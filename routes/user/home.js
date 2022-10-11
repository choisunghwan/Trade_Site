var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");

router.get('/', async function(req, res, next) {
  results = await selectHomeProduct();
  console.log(results)
  res.render('user/home', {
     title: 'home',
     results: results
    });
});

//select
async function selectHomeProduct() {

  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  let sql = "SELECT * FROM \
              (SELECT *FROM PRODUCT ORDER BY PRODUCT_DATE DESC) \
              WHERE ROWNUM <= 5"
  let binds = {};
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };

  let result = await connection.execute(sql, binds, options);

  // console.log(result.rows);
  
  await connection.close();

  console.log(result.rows)
  return result.rows;
}

module.exports = router;
