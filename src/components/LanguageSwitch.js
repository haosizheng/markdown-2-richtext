import React from 'react';
import styled from 'styled-components';

const LanguageSwitchContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
`;

const LanguageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${props => props.active ? '#1890ff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    border-color: #1890ff;
    background: ${props => props.active ? '#40a9ff' : '#f5f5f5'};
  }
`;

const LanguageSwitch = ({ language, setLanguage }) => {
  return (
    <LanguageSwitchContainer>
      <LanguageButton 
        active={language === 'zh'} 
        onClick={() => setLanguage('zh')}
      >
        中文
      </LanguageButton>
      <LanguageButton 
        active={language === 'en'} 
        onClick={() => setLanguage('en')}
      >
        English
      </LanguageButton>
    </LanguageSwitchContainer>
  );
};

export default LanguageSwitch; 