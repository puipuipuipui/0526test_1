// 修改 TestContent.tsx
import React from 'react';
import { FeedbackType } from '../types/testTypes';
import CategoryLabels from './CategoryLabels';
import Instructions from './Instructions';
import { TestPhase } from '../types/testTypes';

interface TestContentProps {
  currentPhase: TestPhase;
  currentWord: string;
  feedback: FeedbackType;
  testCount: number;
  maxTestCount: number;
  showInstructions: boolean;
  onStartTest: () => void;
  onAnswer?: (side: 'left' | 'right') => void; // 新增答題處理函數
}

function TestContent({
  currentPhase,
  currentWord,
  feedback,
  testCount,
  maxTestCount,
  showInstructions,
  onStartTest,
  onAnswer
}: TestContentProps) {
  const getTestWordClass = () => {
    let className = "test-word";
    if (feedback === 'correct') {
      className += " correct";
    } else if (feedback === 'incorrect') {
      className += " incorrect";
    }
    return className;
  };

  // 處理分類點擊
  const handleCategoryClick = (side: 'left' | 'right') => {
    if (onAnswer && !showInstructions) {
      onAnswer(side);
    }
  };

  return (
    <div className="content-container">
      {/* 手機版指引 */}
      <div className="mobile-instructions">
        💡 可以使用鍵盤 E、I 鍵，或直接點擊左右分類區域
      </div>
      
      <CategoryLabels 
        currentPhase={currentPhase} 
        onCategoryClick={handleCategoryClick}
      />
      
      <div className="test-word-container">
        <div className={getTestWordClass()}>
          {currentWord}
        </div>
      </div>
      
      <div className="test-progress">
        進度: {testCount}/{maxTestCount}
      </div>
      
      <Instructions 
        currentPhase={currentPhase} 
        visible={showInstructions} 
        onStart={onStartTest} 
      />
    </div>
  );
}

export default TestContent;