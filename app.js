const ejs = require('ejs');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
var oracledb = require('oracledb');
oracledb.autoCommit = true;

//라우팅

var indexRouter = require('./routes/index');
var joinRouter = require('./routes/join');
var loginRouter = require('./routes/login');
var productRouter = require('./routes/user/product');
var introRouter = require('./routes/user/intro');
var cartRouter = require('./routes/user/cart');
var prodInfoRouter = require('./routes/user/prodInfo');

//관리자 라우팅
var mainRouter = require('./routes/admin/main');


var app = express();

// view engine setup <ejs 템플릿엔진 사용>
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//부트스트랩 사용
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS  
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use(express.static("views"));
app.use(logger('dev'));
app.use(express.json()); //json 형태로 뿌려주기
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use( // request를 통해 세션 접근 가능 ex) req.session
  session({
    // key: "loginData",
    secret: "keyboard cat", // 반드시 필요한 옵션. 세션을 암호화해서 저장함
    resave: false, // 세션 변경되지 않아도 계속 저장됨. 기본값은 true지만 false로 사용 권장
    saveUninitialized: true, // 세션을 초기값이 지정되지 않은 상태에서도 강제로 저장. 모든 방문자에게 고유 식별값 주는 것.
    cookie: {
      maxAge: 3600000
    },
    rolling: true
    // store: new MYSQLStore(connt),
  })
);

//비회원 API 
app.use('/join', joinRouter);
app.use('/login', loginRouter);

//회원
app.use('/', indexRouter);
app.use('/user/product', productRouter);
app.use('/user/intro',introRouter);
app.use('/user/cart', cartRouter);
app.use('/user/prodInfo',prodInfoRouter)

//관리자API
app.use('/main', mainRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
