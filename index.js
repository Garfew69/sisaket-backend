const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const users = [
  { username: 'admin', password: 'hashed_password_here', role: 'admin' },
  { username: 'staff', password: 'hashed_password_here', role: 'staff' }
];

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 1. หา User (ในที่นี้เช็คค่าคงที่ตามภาพที่คุณส่งมา)
  if ((username === 'admin' && password === 'admin123') || 
      (username === 'staff' && password === 'staff123')) {
    
    const role = username === 'admin' ? 'admin' : 'staff';
    
    // 2. สร้าง Token
    const token = jwt.sign(
      { username, role }, 
      'YOUR_SECRET_KEY', // ควรเก็บใน .env
      { expiresIn: '1d' }
    );

    return res.json({ message: 'Success', token, role });
  }

  res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
});
// ข้อมูลจำลองสำหรับหน้า Dashboard (ตามภาพต้นฉบับ)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบตามภาพ Login ที่คุณส่งมา
  if (username === 'admin' && password === 'admin123') {
    return res.json({ message: 'Success', token: 'mock-token-admin', role: 'admin' });
  } else if (username === 'staff' && password === 'staff123') {
    return res.json({ message: 'Success', token: 'mock-token-staff', role: 'staff' });
  }

  res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
});

app.listen(port, () => {
  console.log(`✅ Backend รันสำเร็จที่ http://localhost:${port}`);
});