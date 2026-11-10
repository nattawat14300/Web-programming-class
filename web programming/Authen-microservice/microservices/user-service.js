// user-service.js
const express = require('express');
const app = express();

const users = [
  { id: 1, name: 'Kejkaew', role: 'Teacher' },
  { id: 2, name: 'Alice', role: 'Student' }
];

// Endpoint สำหรับดึงข้อมูล Users
app.get('/', (req, res) => {
  res.json(users);
});

// Endpoint ดึง User ตาม ID
app.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// สำคัญ: รันที่ Port 3001
app.listen(3001, () => {
  console.log('✅ User Service กำลังรันอยู่ที่ http://localhost:3001');
});