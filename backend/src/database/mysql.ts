// backend/src/database/mysql.ts
import mysql from 'mysql2/promise';
import { URL } from 'url';

interface MysqlInsertResult {
  insertId: number;
  affectedRows: number;
}

// 解析 MYSQL_URL 的函數
const parseMysqlUrl = (mysqlUrl: string) => {
  try {
    const url = new URL(mysqlUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1) // 移除開頭的 '/'
    };
  } catch (error) {
    console.error('❌ 解析 MYSQL_URL 失敗:', error);
    return null;
  }
};

// 建立連接配置
const createConnectionConfig = () => {
  // 如果有 MYSQL_URL，解析它
  if (process.env.MYSQL_URL) {
    console.log('🔗 使用 MYSQL_URL 連接');
    const parsed = parseMysqlUrl(process.env.MYSQL_URL);
    if (parsed) {
      return {
        host: parsed.host,
        port: parsed.port,
        user: parsed.user,
        password: parsed.password,
        database: parsed.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
      };
    }
  }
  
  // 使用個別的環境變數
  console.log('🔗 使用個別環境變數連接');
  return {
    host: process.env.MYSQL_HOST || 'mysql.railway.internal',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
  };
};

const pool = mysql.createPool(createConnectionConfig());

// backend/src/database/mysql.ts
export async function testConnection(): Promise<boolean> {
    try {
      console.log('🔍 測試 MySQL 連接...');
      console.log('🔧 使用連接方式:', process.env.MYSQL_URL ? 'MYSQL_URL (已解析)' : '個別變數');
      
      // 修正 SQL 語法錯誤
      const [rows] = await pool.execute('SELECT 1 as test, NOW() as timestamp');
      console.log('✅ MySQL 連接成功:', rows);
      return true;
    } catch (error) {
      console.error('❌ MySQL 連接失敗:', error);
      return false;
    }
  }

export async function saveTestResult(data: any): Promise<MysqlInsertResult> {
  try {
    console.log('💾 準備儲存測試結果...');
    
    const connected = await testConnection();
    if (!connected) {
      throw new Error('資料庫連接失敗');
    }
    
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
    
    console.log('✅ 資料插入成功, ID:', (result as any).insertId);
    return result as MysqlInsertResult;
    
  } catch (error) {
    console.error('❌ saveTestResult 錯誤:', error);
    throw error;
  }
}

export default pool;