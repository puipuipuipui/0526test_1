// frontend/src/hooks/useTestLogic.ts - 修正版本

import { useState, useEffect } from 'react';
import { TestPhase, WordType, Side, TestResults, FeedbackType } from '../types/testTypes';
import { TEST_PHASES, maleWords, femaleWords, computerWords, skinCareWords } from '../constants/testConstants';
import { calculateDScore, generateBiasedProducts } from '../utils/biasCalculation';

interface UseTestLogicProps {
  maxTestCounts?: {
    gender_practice?: number;
    product_practice?: number;
    combined_test_1?: number;
    reversed_practice?: number;
    combined_test_2?: number;
  };
}

interface BiasResults {
  dScore: number;
  biasLevel: string;
  biasType: string | null;
  biasDirection?: string;
  d1?: number;
  d2?: number;
  d3?: number;
  d4?: number;
  meanMaleComputer?: number;
  meanFemaleSkincare?: number;
  meanFemaleComputer?: number;
  meanMaleSkincare?: number;
  standardDeviation?: number;
}

const useTestLogic = ({ maxTestCounts = {} }: UseTestLogicProps = {}) => {
  const [currentPhase, setCurrentPhase] = useState<TestPhase>('start');
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentWordType, setCurrentWordType] = useState<WordType | ''>('');
  const [feedback, setFeedback] = useState<FeedbackType>('');
  const [testResults, setTestResults] = useState<TestResults>({
    maleComputer: [],
    femaleSkincare: [],
    femaleComputer: [],
    maleSkincare: []
  });
  const [testCount, setTestCount] = useState<number>(0);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [biasType, setBiasType] = useState<string>('');
  const [biasLevel, setBiasLevel] = useState<string>('');
  const [dScore, setDScore] = useState<number>(0);
  const [biasedProducts, setBiasedProducts] = useState<Array<{ name: string, score: number }>>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  // IAT分析詳細數據
  const [biasDirection, setBiasDirection] = useState<string>('');
  const [d1Score, setD1Score] = useState<number>(0);
  const [d2Score, setD2Score] = useState<number>(0);
  const [d3Score, setD3Score] = useState<number>(0);
  const [d4Score, setD4Score] = useState<number>(0);

  // 根據當前階段獲取最大測試次數
  const getMaxTestCount = (phase: TestPhase): number => {
    // 預設值 - 使用類型安全的方式
    const defaults: Record<string, number> = {
      'gender_practice': 10,
      'product_practice': 10,
      'combined_test_1': 20,
      'reversed_practice': 10,
      'combined_test_2': 20
    };

    // 用戶設定的值（如果有）
    const userSettings: Record<string, number | undefined> = {
      'gender_practice': maxTestCounts.gender_practice,
      'product_practice': maxTestCounts.product_practice,
      'combined_test_1': maxTestCounts.combined_test_1,
      'reversed_practice': maxTestCounts.reversed_practice,
      'combined_test_2': maxTestCounts.combined_test_2
    };

    // 返回用戶設定的值或預設值
    return userSettings[phase] || defaults[phase] || 10;
  };

  // 開始新的測試
  const startNewTest = () => {
    setTestCount(0);
    setShowInstructions(true);
    setUsedWords(new Set());
  };

  // 檢查答案
  const checkAnswer = (side: Side) => {
    const endTime = Date.now();
    const reactionTime = endTime - testStartTime;
    let isCorrect = false;

    // 檢查答案是否正確
    if (currentPhase === 'gender_practice') {
      isCorrect = (side === 'left' && maleWords.includes(currentWord)) ||
        (side === 'right' && femaleWords.includes(currentWord));
    } else if (currentPhase === 'product_practice') {
      isCorrect = (side === 'left' && computerWords.includes(currentWord)) ||
        (side === 'right' && skinCareWords.includes(currentWord));
    } else if (currentPhase === 'combined_test_1') {
      isCorrect = (side === 'left' && (maleWords.includes(currentWord) || computerWords.includes(currentWord))) ||
        (side === 'right' && (femaleWords.includes(currentWord) || skinCareWords.includes(currentWord)));
    } else if (currentPhase === 'reversed_practice') {
      isCorrect = (side === 'left' && femaleWords.includes(currentWord)) ||
        (side === 'right' && maleWords.includes(currentWord));
    } else if (currentPhase === 'combined_test_2') {
      isCorrect = (side === 'left' && (femaleWords.includes(currentWord) || computerWords.includes(currentWord))) ||
        (side === 'right' && (maleWords.includes(currentWord) || skinCareWords.includes(currentWord)));
    }

    // 設置反饋狀態
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // 如果答案正確
    if (isCorrect) {
      // 記錄反應時間
      if (currentPhase === 'combined_test_1') {
        // 區組1：男性+電腦類或女性+護膚類
        if (maleWords.includes(currentWord) || computerWords.includes(currentWord)) {
          setTestResults(prev => ({
            ...prev,
            maleComputer: [...prev.maleComputer, reactionTime]
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            femaleSkincare: [...prev.femaleSkincare, reactionTime]
          }));
        }
      } else if (currentPhase === 'combined_test_2') {
        // 區組2：女性+電腦類或男性+護膚類
        if (femaleWords.includes(currentWord) || computerWords.includes(currentWord)) {
          setTestResults(prev => ({
            ...prev,
            femaleComputer: [...prev.femaleComputer, reactionTime]
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            maleSkincare: [...prev.maleSkincare, reactionTime]
          }));
        }
      }

      // 增加測試計數
      const newCount = testCount + 1;
      setTestCount(newCount);

      // 獲取當前階段的最大測試次數
      const currentMaxTestCount = getMaxTestCount(currentPhase);

      // 顯示正確反饋後繼續
      setTimeout(() => {
        setFeedback('');
        if (newCount >= currentMaxTestCount) {
          moveToNextPhase();
        } else {
          selectNextWord();
        }
      }, 500);
    } else {
      // 如果答案錯誤，保持當前詞不變，等待正確答案
      setTimeout(() => {
        setFeedback('');
      }, 1000);
    }
  };

  // 選擇下一個詞
  const selectNextWord = () => {
    let wordPool: string[] = [];

    if (currentPhase === 'gender_practice') {
      wordPool = [...maleWords, ...femaleWords];
    } else if (currentPhase === 'product_practice') {
      wordPool = [...computerWords, ...skinCareWords];
    } else if (currentPhase === 'combined_test_1' || currentPhase === 'combined_test_2') {
      wordPool = [...maleWords, ...femaleWords, ...computerWords, ...skinCareWords];
    } else if (currentPhase === 'reversed_practice') {
      wordPool = [...maleWords, ...femaleWords];
    }

    // 過濾掉已使用的詞
    const availableWords = wordPool.filter(word => !usedWords.has(word));

    if (availableWords.length === 0) {
      moveToNextPhase();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];

    // 將選中的詞添加到已使用集合中
    setUsedWords(prev => {
      const newSet = new Set(prev);
      newSet.add(selectedWord);
      return newSet;
    });

    let wordType: WordType | '' = '';
    if (maleWords.includes(selectedWord)) {
      wordType = 'male';
    } else if (femaleWords.includes(selectedWord)) {
      wordType = 'female';
    } else if (computerWords.includes(selectedWord)) {
      wordType = 'computer';
    } else if (skinCareWords.includes(selectedWord)) {
      wordType = 'skincare';
    }

    setCurrentWord(selectedWord);
    setCurrentWordType(wordType);
    setTestStartTime(Date.now());
  };

  // 進入下一個測試階段
  const moveToNextPhase = () => {
    switch (currentPhase) {
      case 'start':
        setCurrentPhase('intro');
        break;
      case 'intro':
        setCurrentPhase('gender_practice');
        startNewTest();
        break;
      case 'gender_practice':
        setCurrentPhase('product_practice');
        startNewTest();
        break;
      case 'product_practice':
        setCurrentPhase('combined_test_1');
        startNewTest();
        break;
      case 'combined_test_1':
        setCurrentPhase('reversed_practice');
        startNewTest();
        break;
      case 'reversed_practice':
        setCurrentPhase('combined_test_2');
        startNewTest();
        break;
      case 'combined_test_2':
        // 在進入結果頁面前計算結果
        calculateBiasResults();
        setCurrentPhase('results');
        break;
      case 'results':
        setCurrentPhase('video_a');
        break;
      case 'video_a':
        setCurrentPhase('survey_a');
        break;
      case 'survey_a':
        setCurrentPhase('video_b');
        break;
      case 'video_b':
        setCurrentPhase('survey_b');
        break;
      case 'survey_b':
        setCurrentPhase('completed');
        break;
      default:
        setCurrentPhase('start');
    }
  };

  // 開始測試 - 點擊開始測試按鈕時調用
  const startTest = () => {
    setShowInstructions(false);
    selectNextWord();
  };

  // 計算偏見結果 - 使用標準IAT D分數演算法
  const calculateBiasResults = () => {
    const result = calculateDScore(testResults);

    // 設置基本結果
    setDScore(result.dScore);
    setBiasLevel(result.biasLevel);

    // 設置詳細結果
    if (result.d1 !== undefined) setD1Score(result.d1);
    if (result.d2 !== undefined) setD2Score(result.d2);
    if (result.d3 !== undefined) setD3Score(result.d3);
    if (result.d4 !== undefined) setD4Score(result.d4);
    if (result.biasDirection !== undefined) setBiasDirection(result.biasDirection);

    if (result.biasType) {
      setBiasType(result.biasType);
      // 產生偏見產品列表
      const products = generateBiasedProducts(result.biasType, result.dScore);
      setBiasedProducts(products);
    } else {
      setBiasType('');
      setBiasedProducts([]);
    }

    return result;
  };

  // 獲取偏見結果後綴 - 修改邏輯以支援新的需求
  const getBiasResultSuffix = (): string => {
    // 如果有明顯偏見，直接使用原本的邏輯
    if (biasLevel !== '無或極弱偏見') {
      if (biasType === 'gender_tech') {
        return '_girl'; // 女性與電腦類偏見
      } else if (biasType === 'gender_skincare') {
        return '_boy';  // 男性與護膚類偏見
      }
    }

    // 如果沒有明顯偏見，則使用D值分數最高的類別來決定
    const d1Abs = Math.abs(d1Score); // 性別-電腦類聯想
    const d2Abs = Math.abs(d2Score); // 性別-護膚類聯想
    const d3Abs = Math.abs(d3Score); // 男性-產品類別聯想
    const d4Abs = Math.abs(d4Score); // 女性-產品類別聯想

    // 找出最大的D分數絕對值
    const maxD = Math.max(d1Abs, d2Abs, d3Abs, d4Abs);

    // 根據最大D分數來決定類別
    if (maxD === d1Abs && d1Score !== 0) {
      // D1最大 - 性別-電腦類聯想最強
      return '_girl'; // 視為女性與電腦類相關
    } else if (maxD === d2Abs && d2Score !== 0) {
      // D2最大 - 性別-護膚類聯想最強
      return '_boy'; // 視為男性與護膚類相關
    } else if (maxD === d3Abs && d3Score !== 0) {
      // D3最大 - 男性-產品類別聯想最強
      if (d3Score > 0) {
        return '_boy'; // 男性與護膚類
      } else {
        return '_girl'; // 男性與電腦類（反向，但歸類為電腦類相關）
      }
    } else if (maxD === d4Abs && d4Score !== 0) {
      // D4最大 - 女性-產品類別聯想最強
      if (d4Score > 0) {
        return '_girl'; // 女性與電腦類
      } else {
        return '_boy'; // 女性與護膚類（反向，但歸類為護膚類相關）
      }
    }

    // 如果所有D分數都很小或為0，預設使用女性與電腦類
    return '_girl';
  };

  return {
    currentPhase,
    currentWord,
    currentWordType,
    feedback,
    testResults,
    testCount,
    maxTestCount: getMaxTestCount(currentPhase), // 根據當前階段返回相應的最大測試次數
    showInstructions,
    biasType,
    biasLevel,
    dScore,
    biasedProducts,
    // IAT分析詳細數據
    biasDirection,
    d1Score,
    d2Score,
    d3Score,
    d4Score,
    getBiasResultSuffix,
    startNewTest,
    checkAnswer,
    moveToNextPhase,
    startTest,
    calculateBiasResults
  };
};

export default useTestLogic;