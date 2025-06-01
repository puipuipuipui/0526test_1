import express from 'express';
import { saveTestResult } from '../database/mysql';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('📥 收到測試結果儲存請求 - MySQL');
    
    const result = await saveTestResult(req.body);
    
    console.log('✅ MySQL 儲存成功:', result.insertId);
    
    res.status(201).json({
      success: true,
      message: '測試結果儲存成功',
      data: { id: result.insertId }
    });

  } catch (error: any) {
    console.error('❌ MySQL 儲存錯誤:', error);
    res.status(500).json({
      success: false,
      message: '儲存失敗',
      error: error.message
    });
  }
});

export default router;