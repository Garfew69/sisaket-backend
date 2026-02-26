const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ข้อมูลจำลองสำหรับหน้า Dashboard (ตามภาพต้นฉบับ)
app.get('/api/dashboard', (req, res) => {
  res.json({
    totalShelters: 944,
    pendingRequests: 0,
    totalItems: 3350,
  });
});

app.listen(port, () => {
  console.log(`✅ Backend รันสำเร็จที่ http://localhost:${port}`);
});