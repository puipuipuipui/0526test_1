import React from 'react';
import { Button, Typography, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface StartPageProps {
  onStart: () => void;
}

function StartPage({ onStart }: StartPageProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1000px', width: '100%', padding: '0 32px' }}>
        {/* 標題 */}
        <Title level={1} style={{ textAlign: 'center', marginBottom: '32px', marginTop: '0px' }}>
          研究簡介與流程說明
        </Title>

        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          {/* 研究介紹 */}
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <Paragraph style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
              您好，感謝您參與本次研究。
            </Paragraph>
            <Paragraph style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
              本研究旨在探討聊天機器人的性別設計與產品類型之間的搭配，對於消費者信任感、專業性感受與購買意圖的影響。透過這項研究，我們希望了解人們在面對具備性別特徵的
              AI 機器人時，是否會因其外觀或推薦的產品而產生不同的感受與行為傾向。
            </Paragraph>

            {/* 參與流程 */}
            <Title level={3} style={{ marginBottom: '16px' }}>
              參與流程
            </Title>
            <Card style={{ marginBottom: '24px', backgroundColor: 'white' }}>
              <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', margin: 0 }}>
                <li style={{ fontSize: '1.125rem', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600 }}>潛在聯想測驗（IAT）</span>
                  <p style={{ marginLeft: '24px', marginTop: '4px', color: '#666', marginBottom: 0 }}>
                    進行一項簡短的測驗，以測量您對性別與產品的直覺性關聯
                  </p>
                </li>
                <li style={{ fontSize: '1.125rem', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600 }}>觀看模擬影片</span>
                  <p style={{ marginLeft: '24px', marginTop: '4px', color: '#666', marginBottom: 0 }}>
                    觀看兩段影片，影片中會有擬人化的聊天機器人推薦特定商品給您
                  </p>
                </li>
                <li style={{ fontSize: '1.125rem', marginBottom: 0 }}>
                  <span style={{ fontWeight: 600 }}>完成問卷調查</span>
                  <p style={{ marginLeft: '24px', marginTop: '4px', color: '#666', marginBottom: 0 }}>
                    完成兩份問卷，詢問您對於影片中機器人的觀感與購買意願等問題
                  </p>
                </li>
              </ol>
            </Card>

            {/* 隱私與匿名保護 */}
            <Title level={3} style={{ marginBottom: '16px' }}>
              隱私與匿名保護
            </Title>
            <Paragraph style={{
              fontSize: '1.125rem',
              marginBottom: '24px',
              backgroundColor: '#f0f8ff',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid #d6e7ff'
            }}>
              本研究所收集的資料將完全匿名，僅用於學術研究之分析，請您放心作答。
            </Paragraph>

            {/* 注意事項 */}
            <Title level={3} style={{ marginBottom: '16px' }}>
              注意事項
            </Title>
            <Paragraph style={{ fontSize: '1.125rem', marginBottom: '24px' }}>
              整體過程約需 10-15 分鐘，請您在安靜、不受干擾的環境中進行，並專心完成每一個步驟。
            </Paragraph>
          </div>

          {/* 開始按鈕 */}
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={onStart}
              icon={<ArrowRightOutlined />}
              style={{
                padding: '0 32px',
                height: '48px',
                fontSize: '1.125rem',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
              }}
            >
              開始參與研究
            </Button>
            <Paragraph style={{ marginTop: '16px', color: '#666', marginBottom: 0 }}>
              若您已準備好，請點擊上方按鈕進入測驗。<br />
              感謝您的參與與協助！
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;