// 測試階段類型定義
export type TestPhase = 
  | 'start'
  | 'intro'
  | 'gender_practice'
  | 'product_practice'
  | 'combined_test_1'
  | 'reversed_practice'
  | 'combined_test_2'
  | 'results'
  | 'video_a'      // 新增：影片A
  | 'survey_a'     // 新增：問卷A
  | 'video_b'      // 新增：影片B
  | 'survey_b'     // 新增：問卷B
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