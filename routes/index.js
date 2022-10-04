var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index'); //1. 😀'index' ==> index.ejs를 땡겨 온다.


});

module.exports = router;

