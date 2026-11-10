const axios = require("axios");
const host = "127.0.0.1";
const port = 3002;
const userServicePort = 3001;
const userServiceUrl = `http://${host}:${userServicePort}`;

// เชื่อมต่อฐานข้อมูล week12_class
const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  // complete the code here



  charset: "utf8mb4",
});

// เปิดการเชื่อมต่อ MySQL
con.connect(function (err) {
  if (err) {
    console.error("เชื่อมต่อฐานข้อมูลไม่สำเร็จ:", err.message);
    return;
  }
  console.log("เชื่อมต่อ week12_class สำเร็จ");

  // สร้างตารางเมื่อยังไม่มี โดยไม่ลบข้อมูลเดิม
  const sql = `CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  con.query(sql, function (err, result) {
    if (err) {
      console.error("สร้างตาราง product ไม่สำเร็จ:", err.message);
      return;
    }
    console.log("ตาราง product พร้อมใช้งาน");

    // ตรวจจำนวนสินค้า เพื่อไม่เพิ่มข้อมูลซ้ำเมื่อเปิด server ใหม่
    const checkSql = "SELECT COUNT(*) AS total FROM product";
    con.query(checkSql, function (err, rows) {
      if (err) {
        console.error("ตรวจสอบสินค้าไม่สำเร็จ:", err.message);
        return;
      }
      if (rows[0].total > 0) {
        console.log("มีสินค้าอยู่แล้ว ไม่เพิ่มข้อมูลเริ่มต้นซ้ำ");
        return;
      }

      // เพิ่มสินค้า 3 รายการเมื่อเริ่มต้นด้วยตารางว่าง
      const insertSql = mysql.format(
        "INSERT INTO product (name, price) VALUES (?, ?), (?, ?), (?, ?)",
        ["เสื้อยืด MDT", 250, "หมวกแก๊ป", 150, "กระเป๋าผ้า", 190]
      );
      con.query(insertSql, function (err, result) {
        if (err) {
          console.error("เพิ่มสินค้าไม่สำเร็จ:", err.message);
          return;
        }
        console.log("เพิ่มสินค้าเริ่มต้นแล้ว " + result.affectedRows + " รายการ");
      });
    });
  });
});

// รูปแบบเดียวกับสัปดาห์ก่อน: ใช้ con.query และรอผลด้วย await
function queryDB(sql) {
  return new Promise(function (resolve, reject) {
    con.query(sql, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// สร้าง Express และกำหนด API

const express = require("express");
const app = express();
app.get("/", async (req, res) => {
  try {
    // ตรวจ session กับ User Service ก่อนอ่านสินค้า
    await axios.get(userServiceUrl + "/session", {
      headers: { cookie: req.headers.cookie || "" },
      timeout: 5000,
    });
    // ถ้า session ถูกต้อง ให้ดึงข้อมูลสินค้า
    // complete the code here
    



    
    res.json(rows);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ message: "กรุณา Login" });
    }
    res.status(503).json({ message: "ไม่สามารถโหลดสินค้าได้" });
  }
});
app.listen(port, host, () =>
  console.log("Product Service ready"),
);
