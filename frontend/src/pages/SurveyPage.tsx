import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Space, Divider } from 'antd';
import { FormOutlined, ArrowRightOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface SurveyPageProps {
  onComplete: () => void;
  surveyType: 'A' | 'B'; // 區分是問卷A還是問卷B
  biasResultSuffix?: string; // 傳入偏見結果後綴
  d1Score?: number; // D1分數 (性別-電腦類聯想)
  d2Score?: number; // D2分數 (性別-護膚類聯想)
  d3Score?: number; // D3分數 (男性-產品類別聯想)
  d4Score?: number; // D4分數 (女性-產品類別聯想)
  biasLevel?: string; // 偏見程度
}

function SurveyPage({ onComplete, surveyType, biasResultSuffix, d1Score = 0, d2Score = 0, d3Score = 0, d4Score = 0, biasLevel = '' }: SurveyPageProps) {
  // 倒數計時器狀態
  const [countdown, setCountdown] = useState<number>(10);
  // 問卷開始填寫標記
  const [surveyStarted, setSurveyStarted] = useState<boolean>(true);
  // 問卷 URL（包含隱藏的 user ID）
  const [surveyUrl, setSurveyUrl] = useState<string>('');

  // 建構問卷 URL
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      let googleFormUrl = '';
      let userIdSuffix = '';
      let surveyDescription = '';

      // 判斷是女性與電腦類偏見還是男性與護膚類偏見
      const isFemaleComputerBias = biasResultSuffix === '_girl';
      const isMaleSkinceBias = biasResultSuffix === '_boy';

      // 當沒有明顯偏見時，根據D值最高的類別決定問卷類型
      const determineQuestionnaireType = () => {
        if (biasLevel === '無或極弱偏見') {
          // 找出絕對值最大的D分數
          const d1Abs = Math.abs(d1Score);
          const d2Abs = Math.abs(d2Score);
          const d3Abs = Math.abs(d3Score);
          const d4Abs = Math.abs(d4Score);
          
          const maxD = Math.max(d1Abs, d2Abs, d3Abs, d4Abs);
          
          // 根據最大D分數來決定類別
          if (maxD === d1Abs && d1Score !== 0) {
            // D1最大 - 性別-電腦類聯想最強 -> 使用電腦類問卷
            return 'computer';
          } else if (maxD === d2Abs && d2Score !== 0) {
            // D2最大 - 性別-護膚類聯想最強 -> 使用護膚類問卷
            return 'skincare';
          } else if (maxD === d3Abs && d3Score !== 0) {
            // D3最大 - 男性-產品類別聯想最強
            if (d3Score > 0) {
              return 'skincare'; // 男性與護膚類
            } else {
              return 'computer'; // 男性與電腦類（反向）
            }
          } else if (maxD === d4Abs && d4Score !== 0) {
            // D4最大 - 女性-產品類別聯想最強
            if (d4Score > 0) {
              return 'computer'; // 女性與電腦類
            } else {
              return 'skincare'; // 女性與護膚類（反向）
            }
          }
          
          // 如果所有D分數都很小或為0，預設使用電腦類
          return 'computer';
        }
        
        // 有明顯偏見時，依照原本的邏輯
        return isFemaleComputerBias ? 'computer' : 'skincare';
      };

      const questionnaireType = determineQuestionnaireType();

      if (isFemaleComputerBias) {
        // 測驗結果為「女性與電腦類」偏見
        if (surveyType === 'A') {
          // 影片A：女性與電腦類產品 -> 女+電競滑鼠問卷
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_girl_A`;
          surveyDescription = '女性與電競滑鼠問卷';
        } else {
          // 影片B：男性與電腦類產品 -> 男+電競滑鼠問卷
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf9N2zED6tC7VxWTI-Be9s2H0Q11KgtH5iG9BBFLyAU0n-LtQ/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_girl_B`;
          surveyDescription = '男性與電競滑鼠問卷';
        }
      } else if (isMaleSkinceBias) {
        // 測驗結果為「男性與護膚類」偏見
        if (surveyType === 'A') {
          // 影片A：男性與護膚類產品 -> 男+面膜問卷
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYnpJafO855tuK7QwWGkv3fXuB2L6gmBwlLNh77EilcA05iQ/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_boy_A`;
          surveyDescription = '男性與面膜問卷';
        } else {
          // 影片B：女性與護膚類產品 -> 女+面膜問卷
          googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdtUx2JZZpi4ABiyKvVmeLzZz1-i64-jr2U1K2NIXsixbrc6A/viewform?usp=pp_url&entry.1526772147=';
          userIdSuffix = `${userId}_boy_B`;
          surveyDescription = '女性與面膜問卷';
        }
      } else {
        // 測驗結果為「沒有明顯的性別商品偏見」- 根據D值最高的類別決定問卷
        if (questionnaireType === 'computer') {
          // 使用電腦類問卷
          if (surveyType === 'A') {
            // 影片A：女性與電腦類產品 -> 女+電競滑鼠問卷
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/viewform?usp=pp_url&entry.1526772147=';
            userIdSuffix = `${userId}_none_A`;
            surveyDescription = '女性與電競滑鼠問卷（基於D值分析）';
          } else {
            // 影片B：男性與電腦類產品 -> 男+電競滑鼠問卷
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf9N2zED6tC7VxWTI-Be9s2H0Q11KgtH5iG9BBFLyAU0n-LtQ/viewform?usp=pp_url&entry.1526772147=';
            userIdSuffix = `${userId}_none_B`;
            surveyDescription = '男性與電競滑鼠問卷（基於D值分析）';
          }
        } else {
          // 使用護膚類問卷
          if (surveyType === 'A') {
            // 影片A：男性與護膚類產品 -> 男+面膜問卷
            googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYnpJafO855tuK7QwWGkv3fXuB2L6gmBwlLNh77EilcA05iQ/viewform?usp=pp_url&entry.1526772147=';
            userIdSuffix = `${userId}_none_A`;
            surveyDescription = '男性與面膜問卷（基於D值分析）';
          } else {
            // 影片B：女性與護膚類產品 -> 女+面膜問卷
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
        console.log(`🎯 選擇問卷類型: ${questionnaireType} (基於最高D值)`);
      }
    } else {
      console.warn('⚠️  找不到用戶 ID，可能會影響資料匹配');
      // 如果沒有 user ID，使用預設問卷（女+電競滑鼠）
      setSurveyUrl('https://docs.google.com/forms/d/e/1FAIpQLSe2wqmYqVSXptUJoKmFHJHw1aJMS5AcMy7UpKCkvd8_Qd_tgw/viewform?usp=pp_url&entry.1526772147=default_user');
    }
  }, [surveyType, biasResultSuffix, d1Score, d2Score, d3Score, d4Score, biasLevel]);

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

  // 獲取說明文字
  const getDescriptionText = (): string => {
    if (surveyType === 'A') {
      return '填寫完問卷後，請點擊以下按鈕觀看第二部影片';
    } else {
      return '填寫完問卷後，請點擊以下按鈕完成測試';
    }
  };

  // 獲取問卷類型說明
  const getSurveyTypeDescription = (): string => {
    const isFemaleComputerBias = biasResultSuffix === '_girl';
    const isMaleSkinceBias = biasResultSuffix === '_boy';

    if (isFemaleComputerBias) {
      if (surveyType === 'A') {
        return '女性與電競滑鼠相關問卷';
      } else {
        return '男性與電競滑鼠相關問卷';
      }
    } else if (isMaleSkinceBias) {
      if (surveyType === 'A') {
        return '男性與面膜相關問卷';
      } else {
        return '女性與面膜相關問卷';
      }
    } else {
      if (surveyType === 'A') {
        return '女性與電競滑鼠相關問卷（預設）';
      } else {
        return '男性與電競滑鼠相關問卷（預設）';
      }
    }
  };

  return (
    <div className="content-container">
      <Title level={2} className="text-center" style={{ marginBottom: '32px' }}>
        {getTitle()}
      </Title>
      
      <Card 
        className="survey-card"
        style={{ 
          borderRadius: '12px', 
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%)'
        }}
        styles={{
          body: { padding: '32px' }
        }}
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
                您的寶貴回饋
              </Title>
              <Paragraph style={{ 
                fontSize: '1.125rem', 
                lineHeight: '1.6', 
                color: 'rgba(0, 0, 0, 0.75)',
                marginBottom: '12px'
              }}>
                接下來請點選下方按鈕前往填寫問卷，您的回覆將有助於我們了解您在與聊天機器人互動過程中的想法與感受。整份問卷僅需數分鐘完成，請依據您的真實感受作答。
              </Paragraph>
              {/* <Text type="secondary" style={{ fontSize: '1rem' }}>
                問卷類型：{getSurveyTypeDescription()}
              </Text> */}
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