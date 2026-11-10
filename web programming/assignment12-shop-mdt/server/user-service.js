const host = "127.0.0.1";
const port = 3001;

// เชื่อมต่อฐานข้อมูล week12_class
const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
//  complete the code here




});

// เปิดการเชื่อมต่อ MySQL
con.connect(function (err) {
  if (err) {
    console.error("เชื่อมต่อฐานข้อมูลไม่สำเร็จ:", err.message);
    return;
  }
  console.log("เชื่อมต่อ week12_class สำเร็จ");

  // สร้างตารางเมื่อยังไม่มี โดยไม่ลบข้อมูลเดิม
  const sql = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  con.query(sql, function (err, result) {
    if (err) {
      console.error("สร้างตาราง users ไม่สำเร็จ:", err.message);
      return;
    }
    console.log("ตาราง users พร้อมใช้งาน");
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
const session = require("express-session");
const crypto = require("crypto");
const { promisify } = require("util");
const scrypt = promisify(crypto.scrypt);
const app = express();
app.use(express.json({ limit: "10kb" }));
// express-session จัดการรหัส session และ Cookie ให้
app.use(session({
  name: "sessionId",
  secret: "week12-class-shop-session-secret-for-local-demo",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // ใช้ HTTP บน localhost
    maxAge: 600000, // 10 นาที
  },
}));
// 1. สมัครสมาชิก: บันทึกข้อมูลลงตาราง users
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 100 ||
      typeof email !== "string" ||
      email.length > 254 ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 200
    )
      return res
        .status(400)
        .json({ access: false, message: "กรุณากรอกข้อมูลให้ครบ รหัสผ่าน 6–200 ตัวอักษร" });
    const passwordHash = await hashPassword(password);
    // สร้าง SQL โดยให้ mysql.format แทนค่า ?
    // เก็บข้อมูลลงตาราง users 
    // complete the code here



    res.status(201).json({ access: false, message: "สมัครสมาชิกสำเร็จ กรุณา Login" });
  } catch (e) {
    res
      .status(e.code === "ER_DUP_ENTRY" ? 409 : 500)
      .json({
        access: false,
        message:
          e.code === "ER_DUP_ENTRY"
            ? "อีเมลนี้สมัครสมาชิกแล้ว"
            : "ไม่สามารถสมัครสมาชิกได้",
      });
  }
});
// 2. เข้าสู่ระบบ: ตรวจอีเมลและรหัสผ่าน แล้วสร้าง session
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      password.length > 200
    )
      return res.status(400).json({ access: false, message: "ข้อมูลไม่ถูกต้อง" });
    // สร้าง SQL โดยให้ mysql.format แทนค่า ? เพื่ออ่านข้อมูลผู้ใช้จากตาราง users
    // complete the code here




    const user = rows[0];
    if (!user || !(await checkPassword(password, user.password))) {
      return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", access: false });
    }
    // บันทึกผู้ใช้ลง session และให้ express-session ส่ง Cookie อัตโนมัติ
    req.session.user = {
      id: user.id,
      name: user.name,
    };
    res.cookie("userId", user.id, {maxAge: 1000 * 60 *10, path: "/" });

    res.json({ message: "เข้าสู่ระบบสำเร็จ", access: true });
  } catch {
    res.status(500).json({ access: false, message: "ไม่สามารถเข้าสู่ระบบได้" });
  }
});

// 3. ตรวจ session: ให้ Product Service ตรวจว่าผู้ใช้ Login แล้ว
app.get("/session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ access: false, message: "กรุณา Login" });
  }
  res.json({ message: "เข้าสู่ระบบแล้ว", access: true, user: req.session.user });
});

// 4. ออกจากระบบ: ลบ session และ Cookie
app.post("/logout", (req, res) => {
  req.session.destroy(function (error) {
    if (error) {
      return res.status(500).json({ access: false, message: "ไม่สามารถออกจากระบบได้" });
    }
    // ลบ cookie sessionId และ userId โดยให้ path เป็น / เพื่อให้เบราว์เซอร์ลบ cookie ทั้งหมดที่เกี่ยวข้องกับ session
    // complete the code here

    


    res.json({ message: "ออกจากระบบสำเร็จ", access: false });
  });
});

app.listen(port, host, () =>
  console.log("User Service ready"),
);

// ฟังก์ชันประกอบ: สร้างและตรวจ hash รหัสผ่าน (ใช้รูปแบบเดิมในฐานข้อมูล)
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return salt + ":" + hash.toString("hex");
}

async function checkPassword(password, savedPassword) {
  const [salt, stored] = savedPassword.split(":");
  if (!stored) return false;
  const hash = await scrypt(password, salt, 64);
  const expected = Buffer.from(stored, "hex");
  return expected.length === hash.length && crypto.timingSafeEqual(expected, hash);
}
