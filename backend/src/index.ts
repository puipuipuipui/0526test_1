import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testResultRoutes from './routes/testResults';
// 移除所有 mongoose 相關的 import

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://gender-bias-study.netlify.app']
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// 路由
app.use('/api/test-results', testResultRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'MySQL',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行於 port ${PORT}`);
  console.log(`🗄️ 使用 MySQL 資料庫`);
});