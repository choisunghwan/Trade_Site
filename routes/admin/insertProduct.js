var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");

// 파일 업로드
const multer = require("multer");
const path = require('path');
const fs = require('fs');

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdir('public/img', function (err) {
        if (err && err.code != 'EEXIST') {
          // console.log("already exist")
        } else {
          callback(null, 'public/img');
        }
      })
    },
    //파일이름 설정
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
    //파일 개수, 파일사이즈 제한
    // limits: {
    //   files: 5,
    //   fileSize: 1024 * 1024 * 1024 //1기가
    // },

})
  

// 물건 등록 페이지로 이동
router.get('/', function(req, res, next) {
    res.render('admin/insertProduct', {
       title: '관리자' 
      });
  });

// 물건 등록
router.post('/insert', upload.single('file'), async function(req, res, next) {
  const param = [req.body.productName, req.file.path, req.body.productPrice, req.body.productDetail, req.body.productCount, req.body.productDiv]
  // console.log(req.file.path);
  await insertProduct(param)
  res.send("<script>alert('정상적으로 등록이 완료되었습니다.');location.href='/admin/main'</script>");
});
    
//insert
async function insertProduct(param) {
  // console.log(param)
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = "INSERT INTO PRODUCT(PRODUCT_ID, PRODUCT_NAME, PRODUCT_IMG, PRODUCT_PRICE, PRODUCT_DETAIL, PRODUCT_COUNT, PRODUCT_DIV)\
               values((SELECT MAX(PRODUCT_ID)+1 FROM PRODUCT), :name, :path, :price, :detail, :count, :div) "
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  await connection.execute(sql, param, options)
  
  await connection.close();

}

module.exports = router;
