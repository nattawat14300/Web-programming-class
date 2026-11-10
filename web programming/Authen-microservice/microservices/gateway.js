// gateway.js (รันที่พอร์ตกลาง 3000)
const express = require('express');
const proxy = require('express-http-proxy');
const app = express();

// Middleware ตรวจสอบเบื้องต้น (เช่น เช็กสิทธิ์, ปริ้น Log)
app.use((req, res, next) => {
  console.log(`[Gateway] รับคำขอ: ${req.method} ${req.url}`);
  next();
});

// ส่งต่อคำขอตาม Path
app.use('/users', proxy('http://localhost:3001'));     // วิ่งไปหา User Service
app.use('/products', proxy('http://localhost:3002'));  // วิ่งไปหา Product Service

app.listen(3000, () => {
  console.log('API Gateway กำลังทำงานที่พอร์ต 3000');
});