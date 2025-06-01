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
    
    // 插入資料到 Supabase
    const { data: result, error } = await supabase
      .from('test_results')
      .insert([payload])
      .select();
    
    if (error) {
      console.error('❌ Supabase 錯誤:', error);
      throw new Error(`儲存失敗: ${error.message}`);
    }
    
    console.log('✅ 測試結果儲存成功:', result);
    return { success: true, data: result };
    
  } catch (error) {
    console.error('❌ 儲存測試結果失敗:', error);
    throw error;
  }
}

// 檢查 Supabase 連線狀態
export async function checkApiHealth(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('count', { count: 'exact', head: true });
    
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