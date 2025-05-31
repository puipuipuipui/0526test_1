// frontend/src/types/testTypes.ts - 修正版本

// 測試階段類型定義 - 確保包含所有階段
export type TestPhase = 
  | 'start'
  | 'intro'
  | 'gender_practice'
  | 'product_practice'
  | 'combined_test_1'
  | 'reversed_practice'
  | 'combined_test_2'
  | 'results'
  | 'video_a'      
  | 'survey_a'     
  | 'video_b'      
  | 'survey_b'     
  | 'completed';

// 詞彙類型定義
export type WordType = 'male' | 'female' | 'computer' | 'skincare';

// 側邊（按鍵）類型
export type Side = 'left' | 'right';

// 反饋狀態類型
export type FeedbackType = '' | 'correct' | 'incorrect';

// 測試結果類型
export interface TestResults {
  maleComputer: number[];
  femaleSkincare: number[];
  femaleComputer: number[];
  maleSkincare: number[];
}

// 階段指引類型定義 - 新增這個接口
export interface PhaseInstruction {
  title: string;
  content: string;
}

// 確保 phaseInstructions 的類型是正確的
export type PhaseInstructionsType = Record<TestPhase, PhaseInstruction>;