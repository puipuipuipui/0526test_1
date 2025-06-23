import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Alert, Space } from 'antd';
import { ExclamationCircleOutlined, ChromeOutlined, WarningOutlined } from '@ant-design/icons';

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
    
    // 總是顯示警告，讓使用者確認瀏覽器狀況
    setIsVisible(true);
  }, []);

  const handleAcknowledge = () => {
    setIsVisible(false);
    onAcknowledge();
  };

  const handleDownloadChrome = () => {
    window.open('https://www.google.com/chrome/', '_blank');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
          {isChrome ? (
            <ChromeOutlined style={{ color: '#4285f4', fontSize: '28px' }} />
          ) : (
            <WarningOutlined style={{ color: '#ff4d4f', fontSize: '28px' }} />
          )}
          <span style={{ fontSize: '20px', fontWeight: 600 }}>
            {isChrome ? '瀏覽器確認' : '瀏覽器相容性警告'}
          </span>
        </div>
      }
      open={isVisible}
      footer={[
        !isChrome && (
          <Button
            key="download"
            icon={<ChromeOutlined />}
            onClick={handleDownloadChrome}
            style={{
              padding: '0 24px',
              height: '42px',
              fontSize: '16px',
              borderRadius: '6px'
            }}
          >
            下載 Chrome 瀏覽器
          </Button>
        ),
        <Button
          key="continue"
          type="primary"
          size="large"
          onClick={handleAcknowledge}
          style={{
            padding: '0 32px',
            height: '42px',
            fontSize: '16px',
            borderRadius: '6px',
            backgroundColor: isChrome ? '#52c41a' : '#ff7a45',
            borderColor: isChrome ? '#52c41a' : '#ff7a45'
          }}
        >
          {isChrome ? '確認並開始測驗' : '我了解風險，繼續測驗'}
        </Button>
      ].filter(Boolean)}
      centered
      maskClosable={false}
      closable={false}
      width={700}
      styles={{
        body: {
          padding: '32px 36px',
          backgroundColor: '#fafafa',
          borderRadius: '0 0 12px 12px'
        }
      }}
      style={{
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <div className="browser-warning-content">
        {/* 當前瀏覽器資訊 */}
        <Alert
          message={`檢測到您目前使用的瀏覽器：${browserInfo}`}
          type={isChrome ? 'success' : 'warning'}
          icon={isChrome ? <ChromeOutlined /> : <ExclamationCircleOutlined />}
          style={{
            marginBottom: '24px',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />

        {isChrome ? (
          // Chrome 用戶的確認訊息
          <div className="chrome-confirmation">
            <div style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              borderLeft: '4px solid #52c41a',
              marginBottom: '20px'
            }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* <div>
                  <Title level={4} style={{ color: '#52c41a', margin: '0 0 12px 0' }}>
                    ✅ 瀏覽器相容性良好
                  </Title>
                  <Paragraph style={{ fontSize: '16px', margin: 0, lineHeight: '1.6' }}>
                    太好了！您正在使用 Google Chrome 瀏覽器，這是我們推薦的瀏覽器。
                    這將確保您在測驗過程中獲得最佳體驗。
                  </Paragraph>
                </div> */}
              </Space>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              borderLeft: '4px solid #1890ff'
            }}>
              <Paragraph style={{ fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
                <strong>測驗注意事項：</strong><br/>
                • 請確保網路連線穩定<br/>
                • 測驗過程中請勿刷新頁面或返回上一頁<br/>
                • 建議關閉其他不必要的分頁以確保最佳效能<br/>
                • 完整測驗時間約需 15-20 分鐘
              </Paragraph>
            </div>
          </div>
        ) : (
          // 非 Chrome 用戶的警告
          <div className="browser-warning">
            <div style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              borderLeft: '4px solid #ff4d4f',
              marginBottom: '20px'
            }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4} style={{ color: '#ff4d4f', margin: '0 0 12px 0' }}>
                    ⚠️ 瀏覽器相容性警告
                  </Title>
                  <Paragraph style={{ fontSize: '16px', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                    我們<Text strong style={{ color: '#ff4d4f' }}>強烈建議您使用 Google Chrome 瀏覽器</Text>來進行此項測驗。
                  </Paragraph>
                  
                  <Paragraph style={{ fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
                    <Text strong>使用非Chrome瀏覽器可能遇到的問題：</Text><br/>
                    • 問卷可能會突然跳出或無法正常載入<br/>
                    {/* • 填寫完成後可能無法返回繼續測驗<br/>
                    • 某些功能可能無法正常運作<br/>
                    • 資料可能無法正確儲存<br/>
                    • 影片播放可能有問題 */}
                  </Paragraph>
                </div>
              </Space>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              borderLeft: '4px solid #fa8c16'
            }}>
              <Paragraph style={{ fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
                <Text strong>建議操作：</Text><br/>
                1. 點擊「下載 Chrome 瀏覽器」按鈕下載並安裝 Chrome<br/>
                2. 安裝完成後，請使用 Chrome 重新開啟此測驗<br/>
                3. 如果堅持使用目前瀏覽器，請確保網路穩定且不要中途關閉分頁
              </Paragraph>
            </div>
          </div>
        )}

        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f0f2f5',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '14px', color: '#666' }}>
            此測驗包含內隱聯結測驗、影片觀看及問卷調查等多個階段<br/>
            確保瀏覽器相容性有助於您順利完成整個流程
          </Text>
        </div>
      </div>
    </Modal>
  );
}

export default BrowserWarning;