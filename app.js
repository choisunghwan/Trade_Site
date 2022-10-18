var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



const session = require('express-session');
// 레이아웃 설정
const expressLayouts = require('express-ejs-layouts');

var oracledb = require('oracledb');
oracledb.autoCommit = true;

var shopRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 레이아웃 설정
app.set('layout', 'layout')
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.use(expressLayouts)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));


// 세션 설정
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

// 전역 변수
app.use(function (req, res, next) {
  if (req.session.user) {
    global.sessionName = req.session.user.sessionName;
    global.sessionEmail = req.session.user.sessionEmail;
    global.sessionId = req.session.user.sessionId;
  }
  next();
});

app.use('/', shopRouter);



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
