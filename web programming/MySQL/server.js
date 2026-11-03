const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3001;
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root", //root
    password: "", //""
    database: "mydb"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
        app.listen(port, hostname, () => {
            console.log(`Server running at   http://${hostname}:${port}/`);
        });
    }
})

let tablename = "userInfo";

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

// create table and add data to database
app.post("/addDB",async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
    let result = await queryDB(sql);
    // mysql2 will automatically escape the values to prevent SQL injection
    const {username, email} = req.body;
    sql = `INSERT INTO userInfo (username, email) VALUES (?, ?)`;
    result = await queryDB(mysql.format(sql, [username, email]));
    console.log("New record created successfully");
    res.end("New record created successfully");
})

// update data
app.post("/updateDB",async (req,res) => {
    const {username, email} = req.body;
    let sql = `UPDATE ${tablename} SET email = ? WHERE username = ?`;
    let result = await queryDB(mysql.format(sql, [email, username]));
    console.log(result);
    res.end("Record updated successfully");
})

// delete data
app.post("/deleteDB",async (req,res) => {
    const {username} = req.body;
    let sql = `DELETE FROM ${tablename} WHERE username = ?`;
    let result = await queryDB(mysql.format(sql, [username]));
    console.log(result);
    res.end("Record deleted successfully");
})

// show data
app.get("/showDB", async (req,res) => {
    // let sql = `SELECT * FROM ${tablename}`;
    let sql = `SELECT id, username, email FROM ${tablename}`;
    let result = await queryDB(sql);
    console.log(result);
    res.json(result);
})
 
