var express = require("express");
var router = express.Router();

// 오라클 db 부르기.
var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");

/* GET home page. */
router.get('/', async function(req, res, next) {
    const productId = req.query.productId == undefined ? 1 : req.query.productId;
    
    results = await selectproductBuy(productId);
    console.log(results)

    res.render('user/buy', {
        buy : results
    });
});

//select1
async function selectproductBuy(productId) {

    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    var sql = "SELECT PRODUCT_ID,PRODUCT_NAME,PRODUCT_DETAIL,PRODUCT_COUNT,PRODUCT_DIV,PRODUCT_DATE,PRODUCT_IMG, TO_CHAR(PRODUCT_PRICE,'FM999,999,999')AS PROD_PRICE\
    FROM PRODUCT WHERE PRODUCT_ID =:product_id"
    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
        };
    let result = await connection.execute(sql, [productId], options);

    await connection.close();

    return result.rows;
}


module.exports = router;