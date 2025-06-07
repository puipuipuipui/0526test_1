// frontend/src/constants/testConstants.ts - 修正版本

import { TestPhase, PhaseInstructionsType } from '../types/testTypes';

// 測試詞彙定義
export const maleWords = ['男孩', '叔叔', '丈夫', '爸爸', '爺爺'];
export const femaleWords = ['女孩', '阿姨', '妻子', '母親', '奶奶'];
export const computerWords = ['機械鍵盤', '電競滑鼠', '曲面螢幕', '顯示卡', '水冷散熱器'];
export const skinCareWords = ['面膜', '精華液', '保濕霜', '眼霜', '乳液'];

// 測試階段定義 - 使用 const assertion 確保類型正確
export const TEST_PHASES = {
  START: 'start',
  INTRO: 'intro',
  GENDER_PRACTICE: 'gender_practice',
  PRODUCT_PRACTICE: 'product_practice',
  COMBINED_TEST_1: 'combined_test_1',
  REVERSED_PRACTICE: 'reversed_practice',
  COMBINED_TEST_2: 'combined_test_2',
  RESULTS: 'results',
  VIDEO_A: 'video_a',
  SURVEY_A: 'survey_a',
  VIDEO_B: 'video_b',
  SURVEY_B: 'survey_b',
  COMPLETED: 'completed'
} as const;

// 進度條配置
export const phaseProgress: Record<TestPhase, number> = {
  start: 0,
  intro: 10,
  gender_practice: 20,
  product_practice: 30,
  combined_test_1: 40,
  reversed_practice: 60,
  combined_test_2: 80,
  results: 85,
  video_a: 88,
  survey_a: 91,
  video_b: 94,
  survey_b: 97,
  completed: 100
};

// 階段指引標題和內容 - 使用正確的類型
export const phaseInstructions: PhaseInstructionsType = {
  start: { title: '', content: '' },
  intro: { title: '', content: '' },
  gender_practice: {
    title: '性別分類練習',
    content: `在這個階段，您需要對出現的詞語進行性別分類。
              請使用以下方式回答：
              - 電腦鍵盤：按 E 鍵代表男性詞語，按 I 鍵代表女性詞語
              - 手機觸控：直接點擊左側區域（男性）或右側區域（女性）
              
              請盡可能快速且準確地做出反應。`
  },
  product_practice: {
    title: '產品分類練習',
    content: `在這個階段，您需要對出現的詞語進行產品類別分類。
            請使用以下方式回答：
            - 電腦鍵盤：按 E 鍵代表電腦類產品，按 I 鍵代表護膚類產品
            - 手機觸控：直接點擊左側區域（電腦類）或右側區域（護膚類）
            
            請盡可能快速且準確地做出反應。`
  },
  combined_test_1: {
    title: '聯合分類測試（第一階段）',
    content: `在這個階段，您需要同時對"性別詞語"和"產品詞語"進行分類。
            請使用以下方式回答：
            - 電腦鍵盤：按 E 鍵代表「男性詞語」或「電腦類產品」，按 I 鍵代表「女性詞語」或「護膚類產品」
            - 手機觸控：點擊左側區域代表「男性」或「電腦類」，點擊右側區域代表「女性」或「護膚類」
            
            請盡可能快速且準確地做出反應。`
  },
  reversed_practice: {
    title: '反向性別分類練習',
    content: `注意！分類方向已經改變。
            請使用以下方式回答：
            - 電腦鍵盤：按 E 鍵代表女性詞語，按 I 鍵代表男性詞語
            - 手機觸控：點擊左側區域（女性）或右側區域（男性）
            
            請盡可能快速且準確地做出反應。`
  },
  combined_test_2: {
    title: '聯合分類測試（第二階段）',
    content: `在這個階段，您需要同時對"性別詞語"和"產品詞語"進行分類，但配對方式已改變。
            請使用以下方式回答：
            - 電腦鍵盤：按 E 鍵代表「女性詞語」或「電腦類產品」，按 I 鍵代表「男性詞語」或「護膚類產品」
            - 手機觸控：點擊左側區域代表「女性」或「電腦類」，點擊右側區域代表「男性」或「護膚類」
            
            請盡可能快速且準確地做出反應。`
  },
  results: { title: '', content: '' },
  video_a: { title: '', content: '' },
  survey_a: { title: '', content: '' },
  video_b: { title: '', content: '' },
  survey_b: { title: '', content: '' },
  completed: { title: '', content: '' }
};