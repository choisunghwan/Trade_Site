var express = require("express");
var router = express.Router();
// db 모듈 추가
var oracledb = require("oracledb");
const { ORACLE_CONFIG } = require("../config/db");

//로그인 페이지로 이동
router.get("/", (req, res) => {
    let route = req.app.get("views") + "/login";
    res.render(route, {
        layout: false,
    });
});

//로그인
router.post("/login", async (req, res) => {
    const loginEmail = req.body.loginEmail;
    const loginPwd = req.body.loginPwd;

  // 이메일, 비밀번호 DB 조회
result = await selectDatabase(loginEmail, loginPwd);
console.log(result);
try {
    // result == undefined 인경우
    // 조회되는 아이디,비번 x
    if (result == undefined) {
        res.send(
            '<script>alert("아이디 또는 비밀번호를 잘못 입력했습니다."); location.href = document.referrer;</script>'
            );
    } else {
    // 조회되는 유저정보가 있는경우
    const userName = result.USER_NAME;
    const userId= result.USER_ID;
    console.log(userId)
    // 일반회원인지 관리자인지 판단
    if (result.USER_AUTH == "관리자") {
        if (req.session.user) {
          res.redirect("/admin/main"); // 관리자 페이지 이동
        } else {
          // 세션 생성
          req.session.user = {
            sessionEmail: loginEmail,
            sessionName: userName,
            sessionId: userId
          };
          res.redirect("/admin/main");
        }
      } else if (result.USER_AUTH == "일반회원") {
        if (req.session.user) {
          res.redirect("/user/home"); // 유저 페이지 이동
        } else {
          // 세션 생성
          req.session.user = {
            sessionId: userId,
            sessionEmail: loginEmail,
            sessionName: userName,
          };
          res.redirect("/user/home");
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

//로그아웃
router.get("/logout", async (req, res) => {
  if (req.session.user) {
    req.session.destroy(function (err) {
      if (err) throw err;
      res.send(
        "<script>alert('로그아웃 되었습니다.'); location.href='/'</script>"
      );
    });
  } else {
    res.redirect("/user/home");
  }
});

//select
async function selectDatabase(loginId, loginPwd) {
  try {
    let connection = await oracledb.getConnection(ORACLE_CONFIG);

    let sql =
      "select user_email, user_name, user_Id, user_auth from member \
                  where user_email = :email and user_pwd = :pwd";
    let param = [loginId, loginPwd]; // 조건 값
    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // query result format
    };

    let result = await connection.execute(sql, param, options);

    await connection.close();

    return result.rows[0];
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = router;
