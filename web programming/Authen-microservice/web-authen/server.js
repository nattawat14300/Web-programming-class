const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const hostname = 'localhost';
const port = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 1. ตั้งค่า Session Middleware
app.use(session({
  secret: 'my-super-secret-key', // คีย์ลับสำหรับเข้ารหัส Cookie
  resave: false,                 // ไม่บันทึกซ้ำหากข้อมูลไม่เปลี่ยน
  saveUninitialized: false,      // ไม่สร้าง session เปล่าจนกว่าจะมีการใส่ข้อมูล
  cookie: { 
    maxAge: 1000 * 30,      // อายุ Session: 30 วินาที
    httpOnly: true               // ป้องกัน JavaScript หน้าบ้านแอบอ่าน Cookie (ลดความเสี่ยง XSS)[cite: 2]
  }
}));

// 2. Route สำหรับ Login (สร้าง Session)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // ตรวจสอบ username / Password (จำลองข้อมูล)
  if (username === 'admin' && password === '123456') {
    // บันทึกข้อมูลลงใน Session อ็อบเจกต์ของ Express
    req.session.user = {
      id: 1,
      username: 'admin',
      role: 'teacher'
    };
    // สร้าง Cookie สำหรับ username (เพื่อให้ Frontend อ่านได้)
    res.cookie('username', username,{maxAge: 10000},'path=/');
    return res.json({ message: 'เข้าสู่ระบบสำเร็จ, ยินดีต้อนรับ ' + username,access: true });
  }
  res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',access: false });
});

// 3. Route ที่ต้องยืนยันตัวตนก่อนเข้าดูข้อมูล (ตรวจเช็ก Session)
app.get('/dashboard', (req, res) => {
  // ตรวจสอบว่ามีข้อมูล user อยู่ใน session หรือไม่
  if (req.session.user) {
    res.json({
      message: `ยินดีต้อนรับ ${req.session.user.username}`,
      access: true,
      role: req.session.user.role
    });
  } else {
    res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' , access: false });
  }
});

// 4. Route สำหรับ Logout (ทำลาย Session)
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'ไม่สามารถออกจากระบบได้' });
    }
    res.clearCookie('connect.sid'); // ล้าง Cookie ฝั่งเบราว์เซอร์
    res.clearCookie('username'); // ล้าง Cookie ของ username
    console.log('Session ถูกทำลายเรียบร้อย');
    res.json({ message: 'ออกจากระบบสำเร็จ', access: false });
  });
});


app.listen(3000, () => {
  console.log(`Server running at   http://${hostname}:${port}/`);
});