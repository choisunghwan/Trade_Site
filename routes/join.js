var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../config/db");


/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('join'); //1. 😀'join' ==> join.ejs 를 땡겨 온다.
});

module.exports = router;
