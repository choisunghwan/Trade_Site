var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;
const {
    ORACLE_CONFIG
} = require("../../config/db");

// 결제 페이지로 이동
router.post('/', async function(req, res, next) {
  const cartChk = JSON.parse("[" + req.body.cartChk + "]")
  console.log(cartChk)
  const buyProduct = await selectCartProduct(cartChk)
  var sumPrice = 0;
  for(i=0; i < buyProduct.length; i++){
    sumPrice += buyProduct[i].SUM_PRICE;
  }
    res.render('user/buy', {
        buyProduct : buyProduct,
        sumPrice : sumPrice
      });
  });

// 결제 후 구매 신청
router.post('/buyProduct',  async function(req, res, next) {

  const param = [req.body.productName, paths[0], req.body.productPrice, req.body.productDetail, req.body.productCount, req.body.productDiv]
  await insertProduct(param)

  res.send("<script>alert('정상적으로 등록이 완료되었습니다.');location.href='/admin/main'</script>");
});
    
// 상품 등록
async function selectCartProduct(cartChk) {

  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  
  var sql = "SELECT CP.*, P.PRODUCT_NAME, P.PRODUCT_PRICE,P.PRODUCT_ID, (P.PRODUCT_PRICE * CP.CARTPRODUCT_COUNT) AS SUM_PRICE, P.PRODUCT_IMG \
            FROM CARTPRODUCT CP LEFT JOIN PRODUCT P \
            ON CP.PRODUCT_ID = P.PRODUCT_ID \
            WHERE CARTPRODUCT_ID = :cartChk ";

  if(cartChk.length > 1){

    for(j=0; j<cartChk.length-1; j++){
      sql += " OR CARTPRODUCT_ID = :cartChk"
    }

  }

  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };

  let result = await connection.execute(sql, cartChk, options)
  
  await connection.close();

  return result.rows;

}

module.exports = router;
