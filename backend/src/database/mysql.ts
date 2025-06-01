// backend/src/database/mysql.ts
import mysql from 'mysql2/promise';

// 🔧 添加類型定義
interface MysqlInsertResult {
  insertId: number;
  affectedRows: number;
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function saveTestResult(data: any): Promise<MysqlInsertResult> {
  const [result] = await pool.execute(`
    INSERT INTO test_results 
    (user_id, test_date, results, analysis, survey_responses, device_info) 
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    data.userId,
    data.testDate,
    JSON.stringify(data.results),
    JSON.stringify(data.analysis),
    JSON.stringify(data.surveyResponses || {}),
    JSON.stringify(data.deviceInfo || {})
  ]);
  
  // 🔧 正確的類型轉換
  return result as MysqlInsertResult;
}

export default pool;