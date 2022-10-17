var express = require("express");
var router = express.Router();

var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");

/* GET home page. */

// 장바구니 조회 및 등록
router.get('/', async function(req, res, next) {
  // 세션에 저장된 유저 정보
  const userId = req.session.user.sessionId;
  console.log(userId)

  cart = await selectCart(userId);
  console.log(cart)
  if(cart.length == 0){  // 장바구니가 없을때  

    // 장바구니 생성
    await insertCart(userId);
    // 장바구니 물품 조회
    cartProduct = await selectCartProduct(userId)

  } else{ // 장바구니가 이미 있는 경우

    // 장바구니 물품 조회
    cartProduct = await selectCartProduct(userId)

  }
  res.render('user/cart', {
    cartProduct: cartProduct
    });
});


// 장바구니 조회
async function selectCart(userId) {
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = " SELECT * FROM CART WHERE USER_ID = :id "
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  let result = await connection.execute(sql, [userId], options);
  
  await connection.close();

  return result.rows;
}


// 장바구니 없는 사람들 추가
async function insertCart(userId) {
  // console.log(param)
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql2 = "INSERT INTO CART(cart_id, user_id)\
              values( (select NVL(MAX(CART_ID),0)+1 FROM CART), :id) "
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  await connection.execute(sql2, [userId], options)
  
  await connection.close();
  }





    // 장바구니 물품 조회
    async function selectCartProduct(userId) {
      let connection = await oracledb.getConnection(ORACLE_CONFIG);
      var sql = " select c.*, p.product_name, p.product_img, (c.cartproduct_count * p.product_price) sum_price \
                  from cartproduct c\
                  left join product p on c.product_id = p.product_id\
                  WHERE c.CART_ID = (SELECT CART_ID FROM CART WHERE USER_ID = :id) \
                  ORDER BY c.CARTPRODUCT_ID DESC"
      let options = {
          outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
        };
      let result = await connection.execute(sql, [userId], options);
      
      await connection.close();
      console.log(result)
  
      return result.rows;
    }



module.exports = router;
