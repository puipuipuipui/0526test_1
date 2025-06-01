// frontend/src/utils/api.ts
import { supabase } from './supabase';
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
      user_id: userId,
      test_date: new Date().toISOString(),
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
      device_info: deviceInfo
    };
    
    console.log('🚀 正在儲存測試結果到 Supabase...', { userId });
    
    // 添加重試機制和更好的錯誤處理
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        // 插入資料到 Supabase
        const { data: result, error } = await supabase
          .from('test_results')
          .insert([payload])
          .select()
          .single();
        
        if (error) {
          console.error(`❌ Supabase 錯誤 (嘗試 ${retryCount + 1}/${maxRetries}):`, error);
          
          if (retryCount === maxRetries - 1) {
            throw new Error(`儲存失敗: ${error.message}`);
          }
          
          retryCount++;
          // 等待一段時間後重試
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        
        console.log('✅ 測試結果儲存成功:', result);
        return { success: true, data: result };
        
      } catch (networkError: any) {
        console.error(`❌ 網路錯誤 (嘗試 ${retryCount + 1}/${maxRetries}):`, networkError);
        
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

// 檢查 Supabase 連線狀態
export async function checkApiHealth(): Promise<boolean> {
  try {
    console.log('🔍 檢查 Supabase 連線狀態...');
    
    // 使用簡單的 RPC 調用來測試連線
    const { data, error } = await supabase.rpc('get_current_timestamp');
    
    if (error) {
      console.error('❌ Supabase 連線檢查失敗:', error);
      return false;
    }
    
    console.log('✅ Supabase 連線正常');
    return true;
  } catch (error) {
    console.error('❌ Supabase 連線錯誤:', error);
    return false;
  }
}

// 嘗試上傳本地備份的資料
export async function uploadBackupData(): Promise<void> {
  try {
    const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('backup_test_result_'));
    
    if (backupKeys.length === 0) {
      console.log('📝 沒有發現本地備份資料');
      return;
    }
    
    console.log(`📤 發現 ${backupKeys.length} 個本地備份，嘗試上傳...`);
    
    for (const key of backupKeys) {
      try {
        const backupData = JSON.parse(localStorage.getItem(key) || '{}');
        
        if (backupData.isBackup) {
          delete backupData.isBackup;
          delete backupData.savedAt;
          
          const { error } = await supabase
            .from('test_results')
            .insert([backupData]);
          
          if (!error) {
            localStorage.removeItem(key);
            console.log(`✅ 成功上傳備份資料: ${key}`);
          }
        }
      } catch (uploadError) {
        console.error(`❌ 上傳備份失敗 ${key}:`, uploadError);
      }
    }
  } catch (error) {
    console.error('❌ 備份上傳過程出錯:', error);
  }
}