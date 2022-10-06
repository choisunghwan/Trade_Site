
var express = require('express');
var router = express.Router();
// const db = require('./../db'); // db 모듈 추가
/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('prodInfo'); 

});



module.exports = router;