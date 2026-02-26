const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sisaket_secret_2026';

// สำคัญ: ปรับ CORS ให้รับข้อมูลจากทุกที่ (รวมถึง Vercel)
app.use(cors());
app.use(express.json());

// API Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`🔑 Login Attempt: ${username}`);

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
      console.log(`✅ Success: ${username} (${user.role})`);
      return res.json({ message: 'Success', token, role: user.role });
    }

    console.log(`❌ Failed: Invalid credentials for ${username}`);
    res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  } catch (error) {
    console.error("❌ Database Error:", error.message);
    res.status(500).json({ message: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาเช็ค DATABASE_URL' });
  }
});

// API Dashboard (ค่าคงที่สำหรับทดสอบตามรูปที่ 3)
app.get('/api/dashboard', async (req, res) => {
  res.json({
    totalShelters: 944,
    pendingRequests: 0,
    totalItems: 3350
  });
});

app.get('/', (req, res) => res.send('API Running...'));

app.listen(port, () => console.log(`🚀 Server on port ${port}`));