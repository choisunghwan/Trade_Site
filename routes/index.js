var express = require('express');
var router = express.Router();




//비회원
const login = require('./login');
const login2 = require('./login2');

//회원
const home = require('./user/home.js');
const product = require('./user/product.js');
const prodInfo = require('./user/prodInfo.js');
const cart = require('./user/cart.js');
const buy = require('./user/buy.js');
const insertCart = require('./user/insertCart.js');
const intro = require('./user/intro.js');
const deleteProduct = require('./user/deleteProduct.js');
//관리자
const adminMain = require('./admin/main.js');
const adminInsertProduct = require('./admin/insertProduct.js');




router.use('/', (req,res,next) => {
    // if(req.url == '/' || req.url == '/login' || /user/home) { <-- 예외처리

    
    if(req.url == '/' || req.url == '/login') {
        // console.log("세션 검사 하지않고 로그인페이지로")
        next();
    } else {                                            // 로그인 페이지 이외의 페이지에 진입하려고 하는 경우
        if(req.session.user) {
            // console.log("세션이 있다.")
            next();                        // user와 admin이 같은 페이지를 이용할 때 구분해줘야 할 때
        } else {
            // console.log("세션이 없다.")
            res.send("<script>alert('로그인이 필요합니다.');location.href='/'</script>");
        }
    }
});

// 로그인
router.use('/', login);

router.use('/login2', login2);
// 회원
router.use('/user/product', product);
router.use('/user/home', home);
router.use('/user/cart', cart);
router.use('/user/prodInfo', prodInfo);
router.use('/user/buy', buy);
router.use('/user/insertCart', insertCart);
router.use('/user/intro', intro);
router.use('/user/deleteProduct', deleteProduct);
// 관리자
router.use('/admin/main', adminMain);
router.use('/admin/insertProduct', adminInsertProduct);
module.exports = router;
