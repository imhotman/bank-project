const router = require("express").Router();
const setup = require("../db_setup");
const sha = require("sha256");



router.get("/", async (req, res) => {
    console.log("GET / 처리 시작 ");
  try {
    const { mongodb, mysqldb } = await setup();
    res.send("홈화면 : 데이터베이스 사용 가능");
  } catch (err) {
    res.status(500).send("데이터베이스 연결 실패");
  }
});

router.get("/login", async (req, res) => {
  console.log("GET /login 처리 시작 ");
  try {
    const { mongodb, mysqldb } = await setup();
    res.send("홈화면 : 데이터베이스 사용 가능");
  } catch (err) {
    res.status(500).send("데이터베이스 연결 실패");
  }
});

router.get("/logout", (req, res) => {
    console.log("로그아웃");
    req.session.destroy();
    res.render("index.ejs");
  });

router.post("/account/login", async (req, res) => {
    const { mongodb, mysqldb } = await setup();
    mongodb
      .collection("account")
      .findOne({ userid: req.body.userid })
      .then((result) => {
        if (result) {
          const sql = `SELECT salt FROM UserSalt 
                      WHERE userid=?`;
          mysqldb.query(sql, [req.body.userid], (err, rows, fields) => {
            const salt = rows[0].salt;
            const hashPw = sha(req.body.userpw + salt);
            //  console.log(hashPw);
            if (result.userpw == hashPw) {
              req.body.userpw = hashPw;
              req.session.user = req.body;
              //console.log(req.session.user);
              res.cookie("uid", req.body.userid);
              res.render("index.ejs");
            } else {
                //res.send("login fail");
                //res.render("login.ejs");
                res.render("index.ejs", {data:{alertMsg:'다시 로그인 해주세요'}});
            }
          });
        } else {
            res.render("index.ejs", {data:{alertMsg:'다시 로그인 해주세요'}});
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  });

router.get("/account/enter", (req, res) => {
    res.render("enter.ejs");
});

router.post("/account/save", async (req, res) => {
    const { mongodb, mysqldb } = await setup();
    mongodb
      .collection("account")
      .findOne({ userid: req.body.userid })
      .then((result) => {
        if (result) {
          res.render("enter.ejs", { data: { msg: "ID가 중복되었습니다" } });
        } else {
          const generateSalt = (length = 16) => {
            const crypto = require('crypto');
            return crypto.randomBytes(length).toString("hex");
          };
  
          const salt = generateSalt();
          req.body.userpw = sha(req.body.userpw + salt);
          mongodb
            .collection("account")
            .insertOne(req.body)
            .then((result) => {
              if (result) {
                console.log("회원가입 성공");
  
                //MySQL에 salt를 저장
                const sql = `INSERT INTO UserSalt (userid, salt)
                      VALUES (?,?)`;
                      mysqldb.query(sql, [req.body.userid, salt], (err, result2) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("salt 저장 성공");
                  }
                });
                res.redirect("/");
              } else {
                console.log("회원가입 fail");
                res.render("enter.ejs", { data: { alertMsg: "회원가입 fail" } });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send();
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  });

const pw_ex = (text) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return 
}

module.exports = router;