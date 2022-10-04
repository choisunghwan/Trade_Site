
var express = require('express');
var router = express.Router();
// const db = require('./../db'); // db 모듈 추가
/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('login'); //1. 😀'login' ==> login.ejs 를 땡겨 온다.

});

  // db.getAllUsers((rows) =>{
  //   res.render('login', { rows: rows });
  // });
  //1. ejs에서 id, pw 가지고 오기
  //2. DB 객체 만들고 sql 작성
  //3. id, pw가 DB에 있는지 확인해서 있으면 로그인 수행



module.exports = router;