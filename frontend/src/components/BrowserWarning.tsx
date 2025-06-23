import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Alert, Space, Divider } from 'antd';
import { InfoCircleOutlined, ChromeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface BrowserWarningProps {
  onAcknowledge: () => void;
}

function BrowserWarning({ onAcknowledge }: BrowserWarningProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isChrome, setIsChrome] = useState<boolean>(false);
  const [browserInfo, setBrowserInfo] = useState<string>('');

  // 檢測瀏覽器類型
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    let browserName = '';
    let isChromeBrowser = false;

    // 檢測 Chrome（需要排除 Edge 和其他基於 Chromium 的瀏覽器）
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) {
      browserName = 'Google Chrome';
      isChromeBrowser = true;
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Mozilla Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari';
    } else if (userAgent.includes('Edg')) {
      browserName = 'Microsoft Edge';
    } else if (userAgent.includes('OPR')) {
      browserName = 'Opera';
    } else {
      browserName = '未知瀏覽器';
    }

    return { browserName, isChromeBrowser };
  };

  useEffect(() => {
    const { browserName, isChromeBrowser } = detectBrowser();
    setIsChrome(isChromeBrowser);
    setBrowserInfo(browserName);
    
    // 總是顯示提示，讓使用者了解測驗環境
    setIsVisible(true);
  }, []);

  const handleAcknowledge = () => {
    setIsVisible(false);
    onAcknowledge();
  };

  const handleChromeInfo = () => {
    window.open('https://www.google.com/chrome/', '_blank');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
          <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
          <span style={{ fontSize: '18px', fontWeight: 500 }}>
            測驗環境說明
          </span>
        </div>
      }
      open={isVisible}
      footer={[
        !isChrome && (
          <Button
            key="info"
            icon={<ChromeOutlined />}
            onClick={handleChromeInfo}
            style={{
              padding: '0 20px',
              height: '40px',
              fontSize: '15px',
              borderRadius: '6px',
              borderColor: '#fa8c16',
              color: '#fa8c16'
            }}
          >
            取得 Chrome 瀏覽器
          </Button>
        ),
        <Button
          key="continue"
          type="primary"
          size="large"
          onClick={handleAcknowledge}
          style={{
            padding: '0 32px',
            height: '40px',
            fontSize: '15px',
            borderRadius: '6px'
          }}
        >
          開始測驗
        </Button>
      ].filter(Boolean)}
      centered
      maskClosable={false}
      closable={false}
      width={650}
      styles={{
        body: {
          padding: '24px 32px',
          backgroundColor: '#ffffff'
        }
      }}
      style={{
        borderRadius: '8px'
      }}
    >
      <div className="browser-info-content">
        {/* 學術研究聲明 */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#f6f8ff',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #e6f0ff'
        }}>
          <Text style={{ fontSize: '14px', color: '#666' }}>
            國立高雄科技大學智慧商務研究所學術研究<br />
            聯絡信箱：jessica910513@gmail.com<br />
            聯絡人：林鈺憓 國立高雄科技大學智慧商務研究所 碩士生
          </Text>
        </div>

        {/* 瀏覽器資訊 */}
        <div style={{ marginBottom: '20px' }}>
          {/* <Paragraph style={{ fontSize: '16px', marginBottom: '12px' }}>
            <Text strong>目前瀏覽器：</Text>{browserInfo}
          </Paragraph> */}
          
          {isChrome ? (
            <Alert
              message="✅ 建議的測驗環境"
              description="您使用的 Chrome 瀏覽器與我們的測驗系統具有良好相容性"
              type="success"
              icon={<CheckCircleOutlined />}
              style={{ borderRadius: '6px' }}
            />
          ) : (
            <div>
              <Alert
                message="⚠️ 重要提醒：強烈建議使用 Chrome 瀏覽器"
                description="使用其他瀏覽器可能導致問卷系統跳出，填寫完成後無法返回繼續測驗"
                type="warning"
                icon={<InfoCircleOutlined />}
                style={{ borderRadius: '6px', marginBottom: '12px' }}
              />
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fff7e6',
                borderRadius: '6px',
                border: '1px solid #ffd591'
              }}>
                <Text style={{ fontSize: '14px', color: '#d46b08' }}>
                  <Text strong>常見問題：</Text>使用非Chrome瀏覽器時，外部問卷可能會在新視窗開啟，
                  完成後可能無法自動返回測驗頁面，導致測驗中斷。
                </Text>
              </div>
            </div>
          )}
        </div>

        <Divider style={{ margin: '20px 0' }} />


        {/* 技術建議 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#fafafa',
          borderRadius: '6px',
          border: '1px solid #f0f0f0'
        }}>
          <Title level={5} style={{ color: '#333', marginBottom: '12px', fontSize: '14px' }}>
            為了確保順暢的測驗體驗，建議您：
          </Title>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              • 確保網路連線穩定
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              • 測驗過程中保持專注，請勿關閉本測驗頁面
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              • 準備 10-15 分鐘的完整時間
            </Text>
            {!isChrome && (
              <>
                <Text style={{ fontSize: '14px', color: '#fa8c16', fontWeight: 'bold' }}>
                  • ⚠️ 強烈建議使用 Chrome 瀏覽器，避免問卷跳出問題
                </Text>
                <Text style={{ fontSize: '13px', color: '#fa8c16' }}>
                  &nbsp;&nbsp;其他瀏覽器可能無法正確處理問卷系統的跳轉
                </Text>
              </>
            )}
          </Space>
        </div>

        {/* 資料保護聲明 */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#f9f9f9',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '13px', color: '#888' }}>
            您的所有資料將被匿名處理，僅用於學術研究目的
          </Text>
        </div>
      </div>
    </Modal>
  );
}

export default BrowserWarning;