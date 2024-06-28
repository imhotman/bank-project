const setup = require("./db_setup");
const express = require("express");
const app = express();

const session = require("express-session");
app.use(
  session({
    secret: "암호화키",
    resave: false,
    saveUninitialized: false,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// 'templates' 폴더를 뷰 디렉토리로 설정
// const path = require("path"); // path 모듈 임포트
// app.set('views', path.join(__dirname, 'templates'));// templates는 임의의 폴더명
app.set('view engine', 'ejs'); // 이 설정은 없어도 무방

//라우팅 
app.get("/", (req, res) => {
    res.render("index.ejs");
  });

//라우팅 포함하는 코드
app.use('/', require('./routes/account.js')); 
app.use('/', require('./routes/post.js')); 

app.listen(8080, async () => {
    await setup();
    console.log("8080 서버가 준비되었습니다...");
});  
