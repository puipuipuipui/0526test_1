// frontend/src/components/Instructions.tsx - 修正版本

import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { TestPhase } from '../types/testTypes';
import { phaseInstructions } from '../constants/testConstants';

const { Title, Paragraph } = Typography;

interface InstructionsProps {
  currentPhase: TestPhase;
  visible: boolean;
  onStart: () => void;
}

function Instructions({ 
  currentPhase, 
  visible, 
  onStart 
}: InstructionsProps) {
  // 安全地獲取指引內容，提供預設值
  const instruction = phaseInstructions[currentPhase];
  const title = instruction?.title || '';
  const content = instruction?.content || '';
  
  // 如果沒有指引內容，則不渲染
  if (!title || !content) {
    return null;
  }

  return (
    <Modal
      title={<Title level={3}>{title}</Title>}
      open={visible}
      onOk={onStart}
      onCancel={() => {}}
      closable={false}
      maskClosable={false}
      okText="開始測試"
      cancelButtonProps={{ style: { display: 'none' } }}
      centered
    >
      {/* 使用 white-space: pre-line 來保留換行 */}
      <Paragraph 
        className="text-base"
        style={{ 
          whiteSpace: 'pre-line', // 關鍵屬性：保留換行符
          lineHeight: '1.6',
          fontSize: '1.1rem'
        }}
      >
        {content}
      </Paragraph>
    </Modal>
  );
}

export default Instructions;