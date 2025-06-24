import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Divider, Spin } from 'antd';
import { FormOutlined, ArrowRightOutlined, ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeHeight, setIframeHeight] = useState<string>('900px');
  const [iframeWidth, setIframeWidth] = useState<string>('100%');

  // 根據螢幕尺寸設定iframe高度和寬度
  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 768) {
        setIframeHeight('500px'); // 手機使用固定600px，確保能看到問卷
        setIframeWidth('100%');   // 手機使用全寬
      } else {
        setIframeHeight('600px'); // 電腦使用固定900px
        setIframeWidth('90%');    // 電腦使用90%寬度，留一些邊距
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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
          { name: 'D1', score: Math.abs(d1Score) },
          { name: 'D2', score: Math.abs(d2Score) },
          { name: 'D3', score: Math.abs(d3Score) },
          { name: 'D4', score: Math.abs(d4Score) }
        ];
        
        const maxScore = Math.max(Math.abs(d1Score), Math.abs(d2Score), Math.abs(d3Score), Math.abs(d4Score));
        const maxScoreCategory = scores.find(s => s.score === maxScore);
        
        return (maxScoreCategory?.name === 'D1' || maxScoreCategory?.name === 'D4') ? 'computer' : 'skincare';
      };

      if (isFemaleComputerBias) {
        // 測驗結果為「女性與電腦類」偏見
        if (surveyType === 'A') {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/formResponse?embedded=true&entry.1526772147=';
          userIdSuffix = `${userId}_girl_A`;
          surveyDescription = '女性與電競滑鼠問卷';
        } else {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf9N2zED6tC7VxWTI-Be9s2H0Q11KgtH5iG9BBFLyAU0n-LtQ/formResponse?embedded=true&entry.1526772147=';
          userIdSuffix = `${userId}_girl_B`;
          surveyDescription = '男性與電競滑鼠問卷';
        }
      } else if (isMaleSkinceBias) {
        // 測驗結果為「男性與護膚類」偏見
        if (surveyType === 'A') {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYnpJafO855tuK7QwWGkv3fXuB2L6gmBwlLNh77EilcA05iQ/formResponse?embedded=true&entry.1526772147=';
          userIdSuffix = `${userId}_boy_A`;
          surveyDescription = '男性與面膜問卷';
        } else {
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdtUx2JZZpi4ABiyKvVmeLzZz1-i64-jr2U1K2NIXsixbrc6A/formResponse?embedded=true&entry.1526772147=';
          userIdSuffix = `${userId}_boy_B`;
          surveyDescription = '女性與面膜問卷';
        }
      } else {
        // 測驗結果為「沒有明顯的性別商品偏見」- 根據D值最高的類別決定問卷
        const questionnaireType = determineQuestionnaireType();

        if (questionnaireType === 'computer') {
          // 使用電腦類問卷
          if (surveyType === 'A') {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/formResponse?embedded=true&entry.1526772147=';
            userIdSuffix = `${userId}_none_A`;
            surveyDescription = '女性與電競滑鼠問卷（基於D值分析）';
          } else {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf9N2zED6tC7VxWTI-Be9s2H0Q11KgtH5iG9BBFLyAU0n-LtQ/formResponse?embedded=true&entry.1526772147=';
            userIdSuffix = `${userId}_none_B`;
            surveyDescription = '男性與電競滑鼠問卷（基於D值分析）';
          }
        } else {
          // 使用護膚類問卷
          if (surveyType === 'A') {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYnpJafO855tuK7QwWGkv3fXuB2L6gmBwlLNh77EilcA05iQ/formResponse?embedded=true&entry.1526772147=';
            userIdSuffix = `${userId}_none_A`;
            surveyDescription = '男性與面膜問卷（基於D值分析）';
          } else {
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdtUx2JZZpi4ABiyKvVmeLzZz1-i64-jr2U1K2NIXsixbrc6A/formResponse?embedded=true&entry.1526772147=';
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
      setSurveyUrl('https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/formResponse?embedded=true&entry.1526772147=default_user');
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
      return '填寫完成後，請點擊下方按鈕觀看第二部影片';
    } else {
      return '填寫完成後，請點擊下方按鈕完成測試';
    }
  };

  // 處理iframe載入完成
  const handleIframeLoad = () => {
    setIsLoading(false);
    setSurveyStarted(true);
  };

  return (
    <div className="content-container" style={{ padding: '32px 0', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* 問卷標題區 */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {/* <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#1890ff', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              fontSize: '28px',
              color: 'white'
            }}
          >
            <FormOutlined />
          </div> */}
          
          <Title level={2} style={{ margin: '0 0 16px', color: '#1890ff' }}>
            {getTitle()}
          </Title>
          
          <Paragraph style={{ 
            fontSize: '1.125rem', 
            color: 'rgba(0, 0, 0, 0.75)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            請填寫以下問卷，您的回覆將有助於我們了解您在與聊天機器人互動過程中的想法與感受。
            整份問卷僅需數分鐘完成，請依據您的真實感受作答。
          </Paragraph>
        </div>
      </Card>

      {/* 內嵌問卷區域 */}
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}
      >
        {surveyUrl ? (
          <div style={{ position: 'relative', minHeight: iframeHeight }}>
            {/* 載入提示 */}
            {isLoading && (
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  background: 'white',
                  padding: '32px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}
              >
                <Spin 
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
                  size="large" 
                />
                <div style={{ marginTop: '16px' }}>
                  <Text style={{ fontSize: '16px', color: '#666' }}>問卷載入中...</Text>
                </div>
              </div>
            )}
            
            {/* 內嵌問卷 */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <iframe
                src={surveyUrl}
                width={iframeWidth}
                height={iframeHeight}
                style={{ 
                  border: 'none',
                  borderRadius: '12px',
                  display: 'block'
                }}
                title={`第${surveyType === 'A' ? '一' : '二'}份問卷調查`}
                onLoad={handleIframeLoad}
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary" style={{ fontSize: '16px' }}>問卷準備中...</Text>
            </div>
          </div>
        )}
      </Card>

      {/* 繼續按鈕區域 */}
      <div style={{ 
        backgroundColor: 'rgba(24, 144, 255, 0.02)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid rgba(24, 144, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <ClockCircleOutlined style={{ 
            fontSize: '20px', 
            color: '#1890ff', 
            marginRight: '8px' 
          }} />
          <Text style={{ fontSize: '16px', color: '#666' }}>
            {getDescriptionText()}
          </Text>
        </div>
        
        <Button
          type="primary"
          size="large"
          onClick={onComplete}
          disabled={countdown > 0}
          icon={<ArrowRightOutlined />}
          style={{ 
            minWidth: '200px',
            height: '48px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            boxShadow: countdown > 0 ? 'none' : '0 2px 0 rgba(5, 145, 255, 0.1)'
          }}
        >
          {getButtonText()}
        </Button>
        
        {countdown > 0 && (
          <div style={{ marginTop: '12px' }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              請完成問卷填寫後再繼續
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

export default SurveyPage;