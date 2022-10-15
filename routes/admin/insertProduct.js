var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
const {
    ORACLE_CONFIG
} = require("../../config/db");

// 파일 업로드
const multer = require("multer");
const path = require('path');
const fs = require('fs');

//파일업로드 모듈
var upload = multer({ //multer안에 storage정보  
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      fs.mkdir('public/img', function (err) {
        if (err && err.code != 'EEXIST') {
          // console.log("already exist")
        } else {
          callback(null, 'public/img');
        }
      })
    },
    //파일이름 설정
    filename: (req, file, done) => {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
    //파일 개수, 파일사이즈 제한
    // limits: {
    //   files: 5,
    //   fileSize: 1024 * 1024 * 1024 //1기가
    // },

})
  

// 물건 등록 페이지로 이동
router.get('/', function(req, res, next) {
    res.render('admin/insertProduct', {
        title: '관리자' 
      });
  });

// 물건 등록
router.post('/insert', upload.array('file'), async function(req, res, next) {
  //파일이 저장된 경로
  const paths = req.files.map(data => data.path);
  //파일 원본이름
  const orgName = req.files.map(data => data.originalname);
  

  // paths[0] = 첫번째 파일 : 대표이미지
  const param = [req.body.productName, paths[0], req.body.productPrice, req.body.productDetail, req.body.productCount, req.body.productDiv]
  await insertProduct(param)


  for (let i = 1; i < paths.length; i++) {
    const param2 = [paths[i], i, orgName[i], path.extname(paths[i])];
    await insertFile(param2)
};
  res.send("<script>alert('정상적으로 등록이 완료되었습니다.');location.href='/admin/main'</script>");
});
    
// 상품 등록
async function insertProduct(param) {
  // console.log(param)
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql = "INSERT INTO PRODUCT(PRODUCT_ID, PRODUCT_NAME, PRODUCT_IMG, \
    PRODUCT_PRICE, PRODUCT_DETAIL, PRODUCT_COUNT, PRODUCT_DIV, PRODUCT_DATE)\
    values((SELECT NVL(MAX(PRODUCT_ID),0)+1 FROM PRODUCT), :name, :path, :price, :detail, :count, :div, TO_CHAR(SYSDATE,'yyyy-MM-dd HH:mi:ss')) "
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  await connection.execute(sql, param, options)
  
  await connection.close();

}
// 상품 추가 파일 등록
async function insertFile(param2) {
  // console.log(param)
  let connection = await oracledb.getConnection(ORACLE_CONFIG);
  var sql2 = "INSERT INTO PRODUCTFILE(FILE_ROUTE, FILE_NO, FILE_ORG_NAME, FILE_TYPE, PRODUCT_ID)\
              values(:fileRoute, :fileNo, :fileOrgName, :fileType, (select MAX(PRODUCT_ID) FROM PRODUCT) ) "
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
  await connection.execute(sql2, param2, options)
  
  await connection.close();

}
module.exports = router;
