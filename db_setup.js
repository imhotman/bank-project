const { MongoClient } = require("mongodb");
const mysql = require("mysql2");

let mongodb;
let mysqldb;

const setup = async () => {
    if (mongodb && mysqldb) {
        return { mongodb, mysqldb };
    }

    try {
        //몽고DB에 접속
        const mongoDbUrl = `mongodb+srv://admin:1234@cluster0.nlg2a7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    const mongoConn = await MongoClient.connect(mongoDbUrl/*, { useNewUrlParser: true, useUnifiedTopology: true }*/);
    mongodb = mongoConn.db("myboard");
    console.log("몽고DB 접속 성공");

    // MySQL 접속
    mysqldb = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1234",
      database: "myboard",
    });
    mysqldb.connect();
    console.log("MySQL 접속 성공");

    return { mongodb, mysqldb };
  } catch (err) {
    console.error("DB 접속 실패", err);
    throw err;
  }
};

module.exports = setup;