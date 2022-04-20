let express = require("express");
let cors = require("cors");
let app = express();
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "Developer-login";
app.use(cors());

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "mydb",
});

/* 
--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(6) NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` text COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
*/

app.post("/register", jsonParser, (req, res, next) => {
  try {
    let { email, password, first_name, last_name } = req.body;
    connection.execute(
      `SELECT * FROM users WHERE email=?`,
      [email],
      (err, users) => {
        if (err) {
          return res.json({ status: "error", message: err });
        }
        if (users.length == 0) {
          bcrypt.hash(password, saltRounds, (err, hashPassword) => {
            connection.execute(
              `INSERT INTO users (email, password,first_name,last_name) VALUES (?,?,?,?)`,
              [email, hashPassword, first_name, last_name],
              (err, results) => {
                if (err) {
                  return res.json({ status: 'error', message: err });
                }
                res.json({ status: 'ok', message: "register success" });
              }
            );
          });
        }else{
          return res.json({ status: "error", message: "email already in use" });
        }
      });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

app.post("/login", jsonParser, (req, res, next) => {
  let { email, password } = req.body;
  connection.execute(
    `SELECT * FROM users WHERE email=?`,
    [email],
    (err, users, fields) => {
      if (err) {
        return res.json({ status: "error", message: err });
      }
      if (users.length == 0) {
        return res.json({ status: "error", message: "no user found" });
      }
      bcrypt.compare(password, users[0].password, function (err, isLogin) {
        if (isLogin) {
          let token = jwt.sign({ email: users[0].email }, secret, {
            expiresIn: "1h",
          });
          res.json({ status: "ok", message: "login success", token });
        } else {
          res.json({ status: "error", message: "login failed" });
        }
      });
    }
  );
});

app.post("/authen", jsonParser, (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, secret);
    return res.json({ status: "ok", decoded });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

app.listen(3031, () => {
  console.log("server listening on port 3031");
});
