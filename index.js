const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sisaket_secret_2026';

// 1. Middleware (ต้องอยู่ก่อน Route อื่นๆ)
app.use(cors());
app.use(express.json());

// 2. Route หน้าแรก (เพื่อแก้ปัญหา "Cannot GET /" ในรูปที่ 9)
app.get('/', (req, res) => {
  res.send('✅ Sisaket Ready API is online and ready!');
});

// 3. API Login (เพื่อแก้ปัญหา "404 Not Found" ในรูปที่ 8)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username);

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (user && user.password === password) {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
      return res.json({ message: 'Success', token, role: user.role });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. API Dashboard
app.get('/api/dashboard', (req, res) => {
  res.json({ totalShelters: 944, pendingRequests: 0, totalItems: 3350 });
});

app.listen(port, () => console.log(`Server running on port ${port}`));