var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");

//장바구니 페이지로 
router.post('/', async function(req, res, next) {
  const cartChk = JSON.parse("[" + req.body.cartChk + "]")
  console.log(cartChk)
  const deleteCart = await deleteCart(cartChk)

    res.render('user/cart', {
      deleteCart:deleteCart
      });
  });

// 장바구니 삭제
async function deleteCart(cartChk) {
  let connection = await oracledb.getConnection(ORACLE_CONFIG);

  var sql = "  DELETE  FROM CARTPRODUCT \
WHERE PRODUCT_ID= :cartChk ";

if(cartChk.length > 1){

  for(j=0; j<cartChk.length-1; j++){
    sql += " OR CARTPRODUCT_ID = :cartChk"
  }

}
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  let result = await connection.execute(sql, [cartChk], options);
  
  await connection.close();

  return result.rows;
}
module.exports = router;