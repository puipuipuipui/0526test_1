import React, { ReactNode } from 'react';

// 自定義卡片元件
interface CustomCardProps {
  children?: ReactNode; // 使 children 成為可選屬性
  className?: string;
  style?: React.CSSProperties;
}

export function CustomCard({ children = null, className = '', style = {} }: CustomCardProps) {
  return (
    <div 
      className={`custom-card ${className}`} 
      style={{
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// 自定義結果元件
interface CustomResultProps {
  status: 'success' | 'error' | 'info' | 'warning';
  title: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}

export function CustomResult({ 
  status, 
  title, 
  subTitle, 
  extra = [], 
  className = '', 
  style = {} 
}: CustomResultProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="success-icon">
            <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="error-icon">
            <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 7.9 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="info-icon">
            <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v48zm0-224c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V304c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v200z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div 
      className={`custom-result ${className}`} 
      style={{
        padding: '48px 32px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        ...style
      }}
    >
      <div style={{ marginBottom: '24px', fontSize: '72px', lineHeight: '72px', color: status === 'success' ? '#52c41a' : status === 'error' ? '#f5222d' : '#1890ff' }}>
        {getStatusIcon()}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 500, color: 'rgba(0, 0, 0, 0.85)', marginBottom: '16px' }}>
        {title}
      </div>
      {subTitle && (
        <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', marginBottom: '24px' }}>
          {subTitle}
        </div>
      )}
      {extra && extra.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          {extra}
        </div>
      )}
    </div>
  );
}