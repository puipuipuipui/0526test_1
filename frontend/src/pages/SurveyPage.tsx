import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Divider, message, Modal } from 'antd';
import { FormOutlined, ArrowRightOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface SurveyPageProps {
  surveyType: 'A' | 'B';
  onComplete: () => void;
  biasResultSuffix?: string;
  d1Score?: number;
  d2Score?: number;
  d3Score?: number;
  d4Score?: number;
  biasLevel?: string;
}

function SurveyPage({
  surveyType,
  onComplete,
  biasResultSuffix = '',
  d1Score = 0,
  d2Score = 0,
  d3Score = 0,
  d4Score = 0,
  biasLevel = ''
}: SurveyPageProps) {
  const [surveyUrl, setSurveyUrl] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(10);
  const [surveyStarted, setSurveyStarted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

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

  // 準備問卷URL
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      let googleFormUrl = '';
      let userIdSuffix = '';
      let surveyDescription = '';

      // 檢查偏見結果
      const isFemaleComputerBias = biasResultSuffix.includes('girl');
      const isMaleSkinceBias = biasResultSuffix.includes('boy');

      // 基於D值決定問卷類型的函數
      const determineQuestionnaireType = () => {
        const scores = [
          { name: 'D1', score: d1Score },
          { name: 'D2', score: d2Score },
          { name: 'D3', score: d3Score },
          { name: 'D4', score: d4Score }
        ];
        
        const maxScore = Math.max(d1Score, d2Score, d3Score, d4Score);
        const maxScoreCategory = scores.find(s => s.score === maxScore);
        
        return (maxScoreCategory?.name === 'D1' || maxScoreCategory?.name === 'D2') ? 'computer' : 'skincare';
      };

      if (isFemaleComputerBias) {
        // 測驗結果為「女性與電腦類」偏見
        if (surveyType === 'A') {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_girl_A`;
          surveyDescription = '女性與電競滑鼠問卷';
        } else {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf9N2zED6tC7VxWTI-Be9s2H0Q11KgtH5iG9BBFLyAU0n-LtQ/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_girl_B`;
          surveyDescription = '男性與電競滑鼠問卷';
        }
      } else if (isMaleSkinceBias) {
        // 測驗結果為「男性與護膚類」偏見
        if (surveyType === 'A') {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYnpJafO855tuK7QwWGkv3fXuB2L6gmBwlLNh77EilcA05iQ/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_boy_A`;
          surveyDescription = '男性與面膜問卷';
        } else {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdtUx2JZZpi4ABiyKvVmeLzZz1-i64-jr2U1K2NIXsixbrc6A/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_boy_B`;
          surveyDescription = '女性與面膜問卷';
        }
      } else {
        // 測驗結果為「沒有明顯的性別商品偏見」- 根據D值最高的類別決定問卷
        const questionnaireType = determineQuestionnaireType();

        if (questionnaireType === 'computer') {
          // 使用電腦類問卷
          if (surveyType === 'A') {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/viewform?usp=pp_url&entry.1526772147=';
            userIdSuffix = `${userId}_none_A`;
            surveyDescription = '女性與電競滑鼠問卷（基於D值分析）';
          } else {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf9N2zED6tC7VxWTI-Be9s2H0Q11KgtH5iG9BBFLyAU0n-LtQ/viewform?usp=pp_url&entry.1526772147=';
            userIdSuffix = `${userId}_none_B`;
            surveyDescription = '男性與電競滑鼠問卷（基於D值分析）';
          }
        } else {
          // 使用護膚類問卷
          if (surveyType === 'A') {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYnpJafO855tuK7QwWGkv3fXuB2L6gmBwlLNh77EilcA05iQ/viewform?usp=pp_url&entry.1526772147=';
            userIdSuffix = `${userId}_none_A`;
            surveyDescription = '男性與面膜問卷（基於D值分析）';
          } else {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdtUx2JZZpi4ABiyKvVmeLzZz1-i64-jr2U1K2NIXsixbrc6A/viewform?usp=pp_url&entry.1526772147=';
            userIdSuffix = `${userId}_none_B`;
            surveyDescription = '女性與面膜問卷（基於D值分析）';
          }
        }
      }
      
      // 組合完整的問卷URL（加上用戶ID）
      const completeUrl = `${googleFormUrl}${userIdSuffix}`;
      setSurveyUrl(completeUrl);
      
      console.log(`🔗 第${surveyType === 'A' ? '一' : '二'}份問卷連結已準備完成:`, userIdSuffix);
      console.log(`📋 第${surveyType === 'A' ? '一' : '二'}份問卷類型:`, surveyDescription);
      console.log(`🌐 問卷URL:`, googleFormUrl);
      if (biasLevel === '無或極弱偏見') {
        console.log(`📊 D分數分析: D1=${d1Score.toFixed(3)}, D2=${d2Score.toFixed(3)}, D3=${d3Score.toFixed(3)}, D4=${d4Score.toFixed(3)}`);
        console.log(`🎯 選擇問卷類型: ${determineQuestionnaireType()} (基於最高D值)`);
      }
    } else {
      console.warn('⚠️  找不到用戶 ID，可能會影響資料匹配');
      // 如果沒有 user ID，使用預設問卷（女+電競滑鼠）
      setSurveyUrl('https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/viewform?usp=pp_url&entry.1526772147=default_user');
    }
  }, [surveyType, biasResultSuffix, d1Score, d2Score, d3Score, d4Score, biasLevel]);

  // 獲取標題
  const getTitle = (): string => {
    return `第${surveyType === 'A' ? '一' : '二'}份問卷調查`;
  };

  // 獲取按鈕文字
  const getButtonText = (): string => {
    if (surveyType === 'A') {
      return countdown > 0 ? `觀看第二部影片 (${countdown}s)` : '觀看第二部影片';
    } else {
      return countdown > 0 ? `完成測試 (${countdown}s)` : '完成測試';
    }
  };

  // 獲取描述文字
  const getDescriptionText = (): string => {
    if (surveyType === 'A') {
      return '填寫完成後，請回到此頁面觀看第二部影片';
    } else {
      return '填寫完成後，請回到此頁面完成測試';
    }
  };

  // 改進的開啟問卷函數 - 解決 Safari 回退問題
  const handleSurveyClick = () => {
    setShowModal(true);
  };

  // 確認開啟問卷
  const confirmOpenSurvey = () => {
    setShowModal(false);
    
    // 記錄當前頁面狀態到 sessionStorage
    sessionStorage.setItem('surveyPageState', JSON.stringify({
      surveyType,
      biasResultSuffix,
      d1Score,
      d2Score,
      d3Score,
      d4Score,
      biasLevel,
      timestamp: Date.now()
    }));

    // 記錄問卷開始時間
    const startTime = Date.now();
    sessionStorage.setItem('surveyStartTime', startTime.toString());
    
    setSurveyStarted(true);
    
    // 使用 window.open 代替 href，這樣可以更好地控制新視窗
    const newWindow = window.open(surveyUrl, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      // 彈窗被阻擋時的備用方案
      message.warning({
        content: (
          <div>
            <div>彈出視窗被阻擋，請點擊下方連結手動開啟問卷：</div>
            <a 
              href={surveyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1890ff', textDecoration: 'underline' }}
            >
              🔗 點此開啟問卷
            </a>
          </div>
        ),
        duration: 0, // 不自動關閉
        style: { marginTop: '60px' }
      });
      return;
    }

    message.info({
      content: '問卷已在新分頁開啟，填寫完成後請回到此頁面',
      duration: 5,
      style: { marginTop: '60px' }
    });

    // 監聽頁面焦點變化 - 當用戶從問卷頁面回來時
    const handleFocus = () => {
      const startTime = sessionStorage.getItem('surveyStartTime');
      if (startTime) {
        const elapsed = Date.now() - parseInt(startTime);
        
        // 如果經過超過 30 秒，假設用戶已經填寫問卷
        if (elapsed > 30000) {
          message.success({
            content: '歡迎回來！如果您已完成問卷，請點擊下方按鈕繼續',
            duration: 8,
            style: { marginTop: '60px' }
          });
          
          // 清除計時器記錄
          sessionStorage.removeItem('surveyStartTime');
        }
      }
    };

    // 添加焦點監聽
    window.addEventListener('focus', handleFocus);
    
    // 5分鐘後移除監聽器（避免記憶體洩漏）
    setTimeout(() => {
      window.removeEventListener('focus', handleFocus);
    }, 300000);
  };

  // 頁面載入時檢查是否有保存的狀態
  useEffect(() => {
    const savedState = sessionStorage.getItem('surveyPageState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        const timeDiff = Date.now() - state.timestamp;
        
        // 如果狀態是在 10 分鐘內保存的，顯示歡迎回來訊息
        if (timeDiff < 600000) {
          message.info({
            content: '歡迎回來！您可以繼續進行測試',
            duration: 5,
            style: { marginTop: '60px' }
          });
        }
        
        // 清除已使用的狀態
        sessionStorage.removeItem('surveyPageState');
      } catch (error) {
        console.warn('無法解析保存的頁面狀態');
      }
    }
  }, []);

  return (
    <div className="content-container" style={{ padding: '32px 0', maxWidth: '800px', margin: '0 auto' }}>
      {/* 問卷確認彈窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
            確認開啟問卷
          </div>
        }
        open={showModal}
        onOk={confirmOpenSurvey}
        onCancel={() => setShowModal(false)}
        okText="確定開啟"
        cancelText="取消"
        centered
      >
        <div style={{ padding: '16px 0' }}>
          <Paragraph style={{ marginBottom: '16px', fontSize: '16px' }}>
            點擊確定後，問卷將在新分頁中開啟。
          </Paragraph>
          <div style={{ 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '6px', 
            padding: '12px',
            marginBottom: '16px'
          }}>
            <Text strong style={{ color: '#389e0d' }}>
              重要提醒：
            </Text>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>請保持此頁面開啟</li>
              <li>填寫完問卷後請回到此頁面</li>
              <li>如果不小心關閉此頁面，請重新開始測試</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* 問卷卡片 */}
      <Card 
        className="survey-card"
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e8e8e8'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div 
              className="survey-icon" 
              style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#1890ff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px',
                fontSize: '36px',
                color: 'white'
              }}
            >
              <FormOutlined />
            </div>
            
            <Title level={2} style={{ margin: '0 0 16px', color: '#1890ff' }}>
              {getTitle()}
            </Title>
            
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Paragraph style={{ 
                fontSize: '1.125rem', 
                lineHeight: '1.6', 
                color: 'rgba(0, 0, 0, 0.75)',
                marginBottom: '12px'
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
              onClick={handleSurveyClick}
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
              填寫第{surveyType === 'A' ? '一' : '二'}份問卷
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
          {getDescriptionText()}
        </Text>
        
        <Button
          type="default"
          size="large"
          onClick={onComplete}
          disabled={countdown > 0}
          icon={surveyType === 'A' ? <ArrowRightOutlined /> : <ArrowRightOutlined />}
          style={{ 
            minWidth: '160px',
            height: '44px',
            borderRadius: '8px',
            transition: 'all 0.3s',
            boxShadow: countdown > 0 ? 'none' : '0 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}

export default SurveyPage;