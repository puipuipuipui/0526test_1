// frontend/src/utils/api.ts
import { TestResults } from '../types/testTypes';

interface TestResultData {
  testResults: TestResults;
  dScore: number;
  biasType: string | null;
  biasLevel: string;
  biasDirection?: string;
  d1Score?: number;
  d2Score?: number;
  d3Score?: number;
  d4Score?: number;
}

// 後端 API 基礎 URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://0526test1-production.up.railway.app'  // 替換為你的 Railway 後端 URL
  : 'http://localhost:5000/api';

export async function saveTestResults(data: TestResultData): Promise<any> {
  try {
    // 產生或獲取用戶 ID
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('userId', userId);
    }
    
    // 收集裝置資訊
    const deviceInfo = {
      browser: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform
    };
    
    // 準備資料
    const payload = {
      userId: userId,
      testDate: new Date().toISOString(),
      results: {
        maleComputer: data.testResults.maleComputer,
        femaleSkincare: data.testResults.femaleSkincare,
        femaleComputer: data.testResults.femaleComputer,
        maleSkincare: data.testResults.maleSkincare
      },
      analysis: {
        dScore: data.dScore,
        biasType: data.biasType,
        biasLevel: data.biasLevel,
        biasDirection: data.biasDirection,
        d1Score: data.d1Score,
        d2Score: data.d2Score,
        d3Score: data.d3Score,
        d4Score: data.d4Score
      },
      deviceInfo: deviceInfo
    };
    
    console.log('🚀 正在儲存測試結果到後端 API...', { userId });
    
    // 添加重試機制
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`${API_BASE_URL}/test-results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ 測試結果儲存成功:', result);
        return result;
        
      } catch (networkError: any) {
        console.error(`❌ API 錯誤 (嘗試 ${retryCount + 1}/${maxRetries}):`, networkError);
        
        if (retryCount === maxRetries - 1) {
          // 最後一次嘗試失敗，嘗試本地儲存作為備份
          console.log('💾 嘗試本地儲存作為備份...');
          const backupData = {
            ...payload,
            savedAt: new Date().toISOString(),
            isBackup: true
          };
          localStorage.setItem(`backup_test_result_${userId}`, JSON.stringify(backupData));
          console.log('✅ 資料已備份到本地存儲');
          
          throw new Error(`網路連線失敗，資料已備份到本地: ${networkError.message}`);
        }
        
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }
    
  } catch (error) {
    console.error('❌ 儲存測試結果失敗:', error);
    throw error;
  }
}