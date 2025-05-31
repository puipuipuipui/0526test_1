import React from 'react';
import { Progress, Typography } from 'antd';
import { TestPhase } from '../types/testTypes';
import { phaseProgress } from '../constants/testConstants';

const { Title, Text } = Typography;

interface HeaderProps {
  currentPhase: TestPhase;
}

function Header({ currentPhase }: HeaderProps) {
  return (
    <div className="header">
      <div className="header-container">
        <div className="header-top">
          <Title level={4} style={{ margin: 0 }}>擬人化機器人性別設計與產品刻板印象對購買意圖的影響<br/></Title>
          <Text className="date-text">
            {new Date().toLocaleDateString('zh-TW', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              weekday: 'long' 
            })}
          </Text>
        </div>
        {/* <Progress
          percent={phaseProgress[currentPhase]}
          showInfo={false}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        /> */}
      </div>
    </div>
  );
};

export default Header;