var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");

router.get('/', async function(req, res, next) {
  const productDiv = req.query.productDiv == undefined ? "" : req.query.productDiv;
  const searchText = req.query.searchText == undefined ? "" : req.query.searchText;

  results = await selectProductList(productDiv, searchText);
  res.render('user/product', {
     productList: results,
     productDiv: productDiv
    });
});

router.get('/detail', function(req, res, next) {
  res.render('user/productDetail');
});

//select
async function selectProductList(productDiv, searchText) {

  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = " SELECT PRODUCT_NAME, PRODUCT_IMG, PRODUCT_ID, PRODUCT_PRICE FROM PRODUCT WHERE 1=1 "
  var binds = [];
  if(productDiv != ""){
    sql += " and PRODUCT_DIV = :productDiv "
    binds.push(productDiv);
  }
  if(searchText != ""){
    sql += " and product_name like :searchText "
    binds.push("'%"+searchText+"%'");
  }
  console.log(binds)
  console.log(sql)
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  let result = await connection.execute(sql, binds, options);
  
  await connection.close();

  return result.rows;
}

module.exports = router;
