const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sisaket_secret_2026';

// บรรทัดนี้สำคัญมาก ต้องอยู่ก่อน API อื่นๆ
app.use(cors());
app.use(express.json());

// เช็คหน้าแรกว่า API ออนไลน์ไหม
app.get('/', (req, res) => {
  res.send('✅ Sisaket Ready API is running...');
});

// API สำหรับล็อกอิน
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt for:", username);

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
      return res.json({ message: 'Success', token, role: user.role });
    }

    res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API สำหรับดึงข้อมูล Dashboard
app.get('/api/dashboard', (req, res) => {
  res.json({
    totalShelters: 944,
    pendingRequests: 0,
    totalItems: 3350
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});