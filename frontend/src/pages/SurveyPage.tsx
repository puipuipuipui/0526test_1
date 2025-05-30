import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Space, Divider } from 'antd';
import { FormOutlined, ArrowRightOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface SurveyPageProps {
  onComplete: () => void;
  getBiasResultSuffix?: () => string; // 新增這個 prop
}

function SurveyPage({ onComplete, getBiasResultSuffix }: SurveyPageProps) {
  // 倒數計時器狀態
  const [countdown, setCountdown] = useState<number>(10);
  // 問卷開始填寫標記
  const [surveyStarted, setSurveyStarted] = useState<boolean>(true);
  // 問卷 URL（包含隱藏的 user ID）
  const [surveyUrl, setSurveyUrl] = useState<string>('');

  // 建構問卷 URL（包含隱藏的 user ID）
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // 獲取測試結果後綴
      const resultSuffix = getBiasResultSuffix ? getBiasResultSuffix() : '_none';
      
      // 根據測試結果選擇不同的問卷網址
      let googleFormBaseUrl = '';
      
      if (resultSuffix === '_girl') {
        // 女性與電腦類偏見 - 使用電競滑鼠問卷
        googleFormBaseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScGpRx--MVNEsdJAS4swRRlsNCJKxQwvefGiLMLKF2tV5ALpw/viewform?usp=pp_url&entry.1526772147=';
      } else if (resultSuffix === '_boy') {
        // 男性與護膚類偏見 - 使用面膜問卷
        googleFormBaseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeeFuB-d1knFNPQvO0TlRQy8zGuwNf97ZPhQLBcDQPMa7fULA/viewform?usp=pp_url&entry.1526772147=';
      } else {
        // 無明顯偏見 - 使用預設問卷（電競滑鼠問卷）
        googleFormBaseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScGpRx--MVNEsdJAS4swRRlsNCJKxQwvefGiLMLKF2tV5ALpw/viewform?usp=pp_url&entry.1526772147=';
      }
      
      const googleFormWithUserId = `${googleFormBaseUrl}${userId}${resultSuffix}`;
      
      setSurveyUrl(googleFormWithUserId);
      
      console.log('🔗 問卷連結已準備完成（包含用戶 ID 和測試結果）:', `${userId}${resultSuffix}`);
      console.log('📋 使用的問卷類型:', resultSuffix === '_girl' ? '女性問卷' : resultSuffix === '_boy' ? '男性問卷' : '預設問卷');
    } else {
      console.warn('⚠️  找不到用戶 ID，可能會影響資料匹配');
      // 如果沒有 user ID，使用預設問卷
      setSurveyUrl('https://docs.google.com/forms/d/e/1FAIpQLScGpRx--MVNEsdJAS4swRRlsNCJKxQwvefGiLMLKF2tV5ALpw/viewform');
    }
  }, [getBiasResultSuffix]);

  // 啟動倒數計時
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (surveyStarted && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [surveyStarted, countdown]);

  return (
    <div className="content-container">
      <Title level={2} className="text-center" style={{ marginBottom: '32px' }}>問卷調查</Title>
      
      <Card 
        className="survey-card"
        style={{ 
          borderRadius: '12px', 
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%)'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* 問卷內容 */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div 
              className="survey-icon"
              style={{ 
                background: '#1890ff', 
                borderRadius: '50%', 
                width: '48px', 
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileTextOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            
            <div>
              <Title level={4} style={{ marginTop: 0, marginBottom: '16px' }}>
                您的寶貴反饋
              </Title>
              <Paragraph style={{ 
                fontSize: '1.125rem', 
                lineHeight: '1.6', 
                color: 'rgba(0, 0, 0, 0.75)',
                marginBottom: '0'
              }}>
                接下來請點選下方按鈕前往填寫問卷，您的回覆將有助於我們了解您在與聊天機器人互動過程中的想法與感受。整份問卷僅需數分鐘完成，請依據您的真實感受作答。
              </Paragraph>
            </div>
          </div>
          
          <Divider style={{ margin: '8px 0' }} />
          
          <div className="survey-actions" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              size="large"
              href={surveyUrl}
              target="_blank"
              icon={<FormOutlined />}
              style={{ 
                height: '48px', 
                padding: '0 32px', 
                fontSize: '1.1rem',
                borderRadius: '8px',
                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.1)'
              }}
              disabled={!surveyUrl}
            >
              填寫問卷
            </Button>
          </div>
        </Space>
      </Card>
      
      {/* 倒數計時按鈕 */}
      <div className="timer-section" style={{ 
        marginTop: '32px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        padding: '20px',
        borderRadius: '8px',
        transition: 'background-color 0.3s'
      }}>
        <Text type="secondary" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: '8px' }} /> 
          填寫完問卷後，請點擊以下按鈕完成測試
        </Text>
        
        <Button
          type="default"
          size="large"
          onClick={onComplete}
          disabled={countdown > 0}
          icon={<ArrowRightOutlined />}
          style={{ 
            minWidth: '160px',
            height: '44px',
            borderRadius: '8px',
            transition: 'all 0.3s',
            boxShadow: countdown > 0 ? 'none' : '0 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {countdown > 0 ? `完成測試 (${countdown})` : '完成測試'}
        </Button>
      </div>
    </div>
  );
}

export default SurveyPage;