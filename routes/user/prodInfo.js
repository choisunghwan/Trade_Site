var express = require('express');
var router = express.Router();
// 오라클 db 부르기.
var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");



router.get('/', async function(req, res, next) {
  const productId = req.query.productId == undefined ? 1 : req.query.productId;

  // 대표이미지 
  results = await selectprodInfo(productId);
  //추가 파일 이미지
  var productFile = await selectProductFile(productId);
console.log(results);
//prodinfo.ejs 에서 렌더링 하기 
  res.render('user/prodInfo', {
    prodInfo: results,
    productFile : productFile
  });

});

//select1: 대표이미지
async function selectprodInfo(productId) {

    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    var sql = "SELECT PRODUCT_ID,PRODUCT_NAME,PRODUCT_DETAIL,PRODUCT_COUNT,PRODUCT_DIV,PRODUCT_DATE,PRODUCT_IMG, TO_CHAR(PRODUCT_PRICE,'FM999,999,999')AS PROD_PRICE FROM PRODUCT WHERE PRODUCT_ID =:product_id"

    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
        };
    let result = await connection.execute(sql, [productId], options);

    await connection.close();

    return result.rows;
}

//select2: 추가 파일 업로드 한 사진들 (PRODUCTFILE 테이블에 담긴 것들)
async function selectProductFile(productId) {

  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = " SELECT * FROM PRODUCTFILE WHERE PRODUCT_ID = :product_id "
  
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  let result = await connection.execute(sql, [productId], options);
  
  await connection.close();

  return result.rows;
}
module.exports = router;