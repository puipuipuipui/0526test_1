import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testResultRoutes from './routes/testResults';

dotenv.config();

const app = express();

// 更新 CORS 設定
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://gender-bias-study.netlify.app',
        'https://*.netlify.app'
      ]
    : [
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/test-results', testResultRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: 'MySQL',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 錯誤處理中間件
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器運行於 port ${PORT}`);
  console.log(`🗄️ 使用 MySQL 資料庫`);
  console.log(`🌍 環境: ${process.env.NODE_ENV}`);
});