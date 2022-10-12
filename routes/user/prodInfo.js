var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");


router.get('/', async function(req, res, next) {
  const productId = req.query.productId == undefined ? 1 : req.query.productId;
  results = await selectprodInfo(productId);
  res.render('user/prodInfo', {
    prodInfo: results
   });

});

//select
async function selectprodInfo(productId) {

    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    var sql = " SELECT * FROM PRODUCT WHERE PRODUCT_ID = :product_id "

    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
        };
    let result = await connection.execute(sql, [productId], options);

    await connection.close();

    return result.rows;
}

module.exports = router;