// 修改 TestPage.tsx 中的相關部分
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Instructions from '../components/Instructions';
import TestContent from '../components/TestContent';
import { TEST_PHASES } from '../constants/testConstants';
import useTestLogic from '../hooks/useTestLogic';
import StartPage from './StartPage';
import IntroPage from './IntroPage';
import ResultsPage from './ResultsPage';
import VideoPage from './VideoPage';
import SurveyPage from './SurveyPage';
import CompletedPage from './CompletedPage';

function TestPage() {
  // 設置不同階段的測試次數
  const {
    currentPhase,
    currentWord,
    currentWordType,
    feedback,
    testResults,
    testCount,
    maxTestCount,
    showInstructions,
    biasType,
    biasLevel,
    dScore,
    getBiasResultSuffix,
    biasedProducts,
    // IAT詳細分析數據
    biasDirection,
    d1Score,
    d2Score,
    d3Score,
    d4Score,
    checkAnswer,
    moveToNextPhase,
    startTest,
    startNewTest
  } = useTestLogic({ 
    maxTestCounts: {
      gender_practice: 10,      
      product_practice: 10,     
      combined_test_1: 20,      
      reversed_practice: 10,    
      combined_test_2: 20       
    }
  });

  // 偵測鍵盤輸入
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentPhase === TEST_PHASES.GENDER_PRACTICE || 
          currentPhase === TEST_PHASES.PRODUCT_PRACTICE || 
          currentPhase === TEST_PHASES.COMBINED_TEST_1 || 
          currentPhase === TEST_PHASES.REVERSED_PRACTICE || 
          currentPhase === TEST_PHASES.COMBINED_TEST_2) {
        
        if (!showInstructions) {
          if (e.key === 'e' || e.key === 'E') {
            checkAnswer('left');
          } else if (e.key === 'i' || e.key === 'I') {
            checkAnswer('right');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPhase, showInstructions, checkAnswer]);

  // 處理點擊答題 - 新增
  const handleAnswer = (side: 'left' | 'right') => {
    if (!showInstructions) {
      checkAnswer(side);
    }
  };

  // 重新開始測試的處理函數
  const handleRestart = () => {
    startNewTest();
  };

  // 渲染當前階段
  const renderPhase = () => {
    switch (currentPhase) {
      case TEST_PHASES.START:
        return <StartPage onStart={moveToNextPhase} />;
      case TEST_PHASES.INTRO:
        return <IntroPage onStart={moveToNextPhase} />;
      case TEST_PHASES.GENDER_PRACTICE:
      case TEST_PHASES.PRODUCT_PRACTICE:
      case TEST_PHASES.COMBINED_TEST_1:
      case TEST_PHASES.REVERSED_PRACTICE:
      case TEST_PHASES.COMBINED_TEST_2:
        return (
          <div className="test-container">
            {showInstructions ? (
              <Instructions 
                currentPhase={currentPhase} 
                visible={showInstructions}
                onStart={startTest} 
              />
            ) : (
              <TestContent 
                currentPhase={currentPhase}
                currentWord={currentWord}
                feedback={feedback}
                testCount={testCount}
                maxTestCount={maxTestCount}
                showInstructions={showInstructions}
                onStartTest={startTest}
                onAnswer={handleAnswer} // 新增答題處理
              />
            )}
          </div>
        );
      case TEST_PHASES.RESULTS:
        return (
          <ResultsPage 
            testResults={testResults}
            biasType={biasType}
            biasLevel={biasLevel}
            dScore={dScore}
            biasedProducts={biasedProducts}
            biasDirection={biasDirection}
            d1={d1Score}
            d2={d2Score}
            d3={d3Score}
            d4={d4Score}
            onContinue={moveToNextPhase}
          />
        );
      case TEST_PHASES.VIDEO_A:
        return (
          <VideoPage 
            onContinue={moveToNextPhase} 
            videoType="A"
            biasResultSuffix={getBiasResultSuffix()}
          />
        );
      case TEST_PHASES.SURVEY_A:
        return (
          <SurveyPage 
            onComplete={moveToNextPhase}
            surveyType="A"
            biasResultSuffix={getBiasResultSuffix()}
          />
        );
      case TEST_PHASES.VIDEO_B:
        return (
          <VideoPage 
            onContinue={moveToNextPhase} 
            videoType="B"
            biasResultSuffix={getBiasResultSuffix()}
          />
        );
      case TEST_PHASES.SURVEY_B:
        return (
          <SurveyPage 
            onComplete={moveToNextPhase}
            surveyType="B"
            biasResultSuffix={getBiasResultSuffix()}
          />
        );
      case TEST_PHASES.COMPLETED:
        return <CompletedPage onRestart={handleRestart} />;
      default:
        return <StartPage onStart={moveToNextPhase} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container"
    >
      {renderPhase()}
    </motion.div>
  );
}

export default TestPage;