var express = require('express');
var router = express.Router();

var oracledb = require('oracledb');
oracledb.autoCommit = true;
const {
    ORACLE_CONFIG
} = require("../../config/db");


// 장바구니 조회 및 등록
router.post('/', async function(req, res, next) {
  // 세션에 저장된 유저 정보
    const userId = req.session.user.sessionId;
    cart = await selectCart(userId);
    const param = [req.body.productId, req.body.count, userId]
    console.log(cart)
    try{
        if(cart == 0){  // 장바구니가 없을때 

            // 장바구니 생성
            await insertCart(userId);
            console.log(userId)
            // 장바구니 담기
            cartProduct = await insertCartProduct(param)

        } else{ // 장바구니가 이미 있는 경우
    // 장바구니 담기
    cartProduct = await insertCartProduct(param)
}
    res.json({result : "success"});
}catch(e){
    console.log(e)
}

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

// 장바구니 물품 추가
async function insertCartProduct(param) {
    let connection = await oracledb.getConnection(ORACLE_CONFIG);
    var sql2 = "INSERT INTO CARTPRODUCT(cartproduct_id, product_id, cartproduct_count, cart_id)\
            values( (select NVL(MAX(CARTPRODUCT_ID),0)+1 FROM CARTPRODUCT), :productId, :count, (SELECT CART_ID FROM CART WHERE USER_ID = :userId)) "
let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
    await connection.execute(sql2, param, options)
    await connection.close();
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

module.exports = router;
