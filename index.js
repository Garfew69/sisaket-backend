const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client'); // เพิ่ม Prisma

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

app.use(cors());
app.use(express.json());

// 1. API Login (เชื่อมต่อกับ Supabase จริง)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // ค้นหา User จากฐานข้อมูล Supabase
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    // ตรวจสอบรหัสผ่าน (ถ้าใน DB เก็บแบบธรรมดา ให้เช็คตรงๆ)
    if (user && user.password === password) {
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({ 
        message: 'Success', 
        token, 
        role: user.role 
      });
    }

    res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
});

// 2. API Dashboard (ส่งข้อมูลไปโชว์ที่หน้า Frontend)
app.get('/api/dashboard', async (req, res) => {
  try {
    // ในอนาคตคุณสามารถใช้ prisma.table.count() เพื่อดึงยอดจริงได้
    // ตอนนี้ส่งค่าจำลองเพื่อให้หน้าเว็บแสดงผลก่อนครับ
    res.json({
      totalShelters: 5,
      pendingRequests: 12,
      totalItems: 1540
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// หน้าแรกสำหรับเช็คสถานะ
app.get('/', (req, res) => {
  res.send('✅ Sisaket Ready API is running...');
});

app.listen(port, () => {
  console.log(`✅ Backend รันสำเร็จที่พอร์ต ${port}`);
});