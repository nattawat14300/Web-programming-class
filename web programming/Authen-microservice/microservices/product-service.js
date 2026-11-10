// product-service.js
const express = require('express');
const app = express();

const products = [
  { id: 1, name: 'เสื้อยืด MDT', price: 250 },
  { id: 2, name: 'หมวกแก๊ป', price: 150 }
];

// Endpoint สำหรับส่งข้อมูลสินค้า
app.get('/', (req, res) => {
  res.json(products);
});

// สำคัญมาก: ตัวนี้ต้องเปิดที่ Port 3002
app.listen(3002, () => {
  console.log('✅ Product Service กำลังรันอยู่ที่ http://localhost:3002');
});