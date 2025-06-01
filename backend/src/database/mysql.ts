// backend/src/database/mysql.ts - 改良版本
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

// 格式化日期為 YYYY-MM-DD 格式
function formatDateOnly(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function testConnection(): Promise<boolean> {
  try {
    console.log('🔍 測試 MySQL 連接...');
    console.log('🔧 使用連接方式:', process.env.MYSQL_URL ? 'MYSQL_URL (已解析)' : '個別變數');
    
    const [rows] = await pool.execute('SELECT 1 as test, NOW() as timestamp');
    console.log('✅ MySQL 連接成功:', rows);
    return true;
  } catch (error) {
    console.error('❌ MySQL 連接失敗:', error);
    return false;
  }
}

// 改良的 ID 生成機制 - 使用時間戳避免併發問題
function generateUniqueId(): number {
  // 使用時間戳 + 隨機數確保唯一性
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  // 組合成一個較大的數字，但確保不會溢出
  return parseInt(`${timestamp.toString().slice(-8)}${random.toString().padStart(3, '0')}`);
}

export async function saveTestResult(data: any): Promise<MysqlInsertResult> {
  const connection = await pool.getConnection();
  
  try {
    console.log('💾 準備儲存測試結果...');
    
    // 處理日期：只保留日期部分
    const testDate = data.testDate ? formatDateOnly(data.testDate) : formatDateOnly(new Date());
    
    // 使用改良的 ID 生成機制
    let newId = generateUniqueId();
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`🆔 嘗試使用 ID: ${newId} (第 ${retryCount + 1} 次)`);
        console.log('📅 格式化日期:', { 
          原始日期: data.testDate, 
          格式化後: testDate 
        });
        
        const [result] = await connection.execute(`
          INSERT INTO test_results 
          (id, user_id, test_date, results, analysis, survey_responses, device_info) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          newId,
          data.userId,
          testDate,
          JSON.stringify(data.results),
          JSON.stringify(data.analysis),
          JSON.stringify(data.surveyResponses || {}),
          JSON.stringify(data.deviceInfo || {})
        ]);
        
        console.log('✅ 資料插入成功, 使用 ID:', newId);
        
        return {
          insertId: newId,
          affectedRows: (result as any).affectedRows
        } as MysqlInsertResult;
        
      } catch (insertError: any) {
        if (insertError.code === 'ER_DUP_ENTRY') {
          // ID 重複，生成新的 ID 重試
          console.log(`⚠️ ID ${newId} 已存在，重新生成...`);
          newId = generateUniqueId();
          retryCount++;
          
          if (retryCount >= maxRetries) {
            throw new Error(`無法生成唯一 ID，已重試 ${maxRetries} 次`);
          }
          
          // 短暫延遲後重試
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        } else {
          // 其他錯誤直接拋出
          throw insertError;
        }
      }
    }
    
    throw new Error('未知錯誤：迴圈異常結束');
    
  } catch (error) {
    console.error('❌ saveTestResult 錯誤:', error);
    throw error;
  } finally {
    // 確保釋放連接
    connection.release();
  }
}

export default pool;