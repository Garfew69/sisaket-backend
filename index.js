const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY';

// ปรับปรุง CORS ให้รองรับทั้ง Local และ Vercel
app.use(cors({
  origin: '*', // หรือใส่ ['http://localhost:3000', 'https://sisaket-frontend.vercel.app']
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 1. API Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username}`); // Log เพื่อเช็คใน Render

  try {
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (user && user.password === password) {
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log(`✅ Login Success: ${username} (${user.role})`);
      return res.json({ 
        message: 'Success', 
        token, 
        role: user.role 
      });
    }

    res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  } catch (error) {
    console.error("❌ Prisma/Database Error:", error);
    res.status(500).json({ message: 'ไม่สามารถติดต่อฐานข้อมูลได้' });
  }
});

// 2. API Dashboard (ดึงข้อมูลจริงจาก DB)
app.get('/api/dashboard', async (req, res) => {
  try {
    // ลองดึงข้อมูลจริง ถ้าตารางยังไม่พร้อมจะใช้ค่า Default
    const totalShelters = await prisma.user.count() || 944; // สมมติใช้ User count ไปก่อนเพื่อทดสอบ
    
    res.json({
      totalShelters: totalShelters,
      pendingRequests: 12,
      totalItems: 3350
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    // ถ้า Error ให้ส่งค่า Default ไปก่อนเพื่อให้หน้าเว็บไม่พัง
    res.json({ totalShelters: 944, pendingRequests: 0, totalItems: 3350 });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Sisaket Ready API is running...');
});

// ปิดการเชื่อมต่อ Prisma เมื่อจบการทำงาน
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`✅ Backend รันสำเร็จที่พอร์ต ${port}`);
});