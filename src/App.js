import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { createGlobalStyle } from 'styled-components';

// 修改全局样式的创建方式
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
`;

// 标题样式优化
const Title = styled.h1`
  text-align: center;
  font-size: 36px;
  margin: 30px 0;
  font-family: 'Times New Roman', serif;
  color: #2c3e50;
  font-weight: 700;
`;

// 修改主容器样式
const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 40px;
`;

// 编辑区域容器
const EditingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 20px;
`;

// 区域标题样式
const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
`;

// 暗黑模式开关容器
const DarkModeSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 开关按钮样式
const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #2196F3;
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

// 编辑器容器样式
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  min-height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
`;

// 文本框样式优化
const StyledTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  resize: none;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #fafafa;
  box-sizing: border-box;
  margin: 0;
  
  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }
`;

// 预览容器样式
const PreviewContainer = styled.div`
  flex: 1;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow-y: auto;
  background: ${props => props.isDark ? '#1a1a1a' : '#fff'};
  color: ${props => props.isDark ? '#fff' : '#000'};
  transition: all 0.3s ease;

  /* 移除通用选择器，改用具体的选择器 */
  h1, h2, h3, h4, h5, h6, p, span, li, a, blockquote, em, strong {
    color: ${props => props.isDark ? '#fff' : 'inherit'};
  }
`;

// 复制按钮容器
const CopyButtonContainer = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const CSSEditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  padding: 12px 24px;
  margin: 15px 0;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #40a9ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
`;

const defaultCSS = `
/* 预览区域的样式 */
.preview-content {
  font-size: 16px;
  line-height: 1.75;
  color: inherit;
}

.preview-content h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
  color: inherit;
}

.preview-content h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 16px 0;
  color: inherit;
}

.preview-content p {
  margin: 16px 0;
}

.preview-content ul, .preview-content ol {
  padding-left: 28px;
  margin: 16px 0;
}

.preview-content li {
  margin: 8px 0;
}

.preview-content strong {
  font-weight: bold;
}

.preview-content em {
  font-style: italic;
}

.preview-content blockquote {
  border-left: 4px solid #ccc;
  margin: 16px 0;
  padding-left: 16px;
  color: #666;
}
`;

// App 组件
const App = () => {
  const [markdown, setMarkdown] = useState(`# Heading 1\n## Heading 2\n### Heading 3\n\nThis is a **bold text** example\n\nThis is an *italic text* example`);
  const [css, setCSS] = useState(defaultCSS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const styleRef = useRef(null);
  
  const handleCopy = async () => {
    const previewContent = document.querySelector('.preview-content');
    if (previewContent) {
      try {
        // 创建一个临时的可编辑div
        const tempDiv = document.createElement('div');
        tempDiv.contentEditable = true;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        
        // 复制原始节点，这样可以保留完整的样式和结构
        const clonedContent = previewContent.cloneNode(true);
        
        // 将 h3、h4、h5、h6 转换为加粗文本
        clonedContent.querySelectorAll('h3, h4, h5, h6').forEach(header => {
          const strong = document.createElement('strong');
          strong.textContent = header.textContent;
          header.parentNode.replaceChild(strong, header);
        });
        
        tempDiv.appendChild(clonedContent);
        document.body.appendChild(tempDiv);
        
        // 选择内容
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // 执行复制命令
        document.execCommand('copy');
        
        // 清理
        document.body.removeChild(tempDiv);
        selection.removeAllRanges();
        
        alert('已复制富文本内容到剪贴板！');
      } catch (err) {
        alert('复制失败，请重试');
        console.error(err);
      }
    }
  };

  // 更新样式
  const updateStyle = (newCSS) => {
    setCSS(newCSS);
    if (styleRef.current) {
      styleRef.current.innerHTML = newCSS;
    }
  };

  return (
    <>
      <GlobalStyle />
      <Title>MarkDown To Rich Text Format</Title>
      <AppContainer>
        <EditingContainer>
          <EditorContainer>
            <SectionTitle>Input (MARKDOWN Syntax)</SectionTitle>
            <StyledTextarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter Markdown text..."
            />
          </EditorContainer>
          
          <EditorContainer>
            <SectionTitle>
              Preview
              <DarkModeSwitch>
                Dark Mode
                <Switch>
                  <input 
                    type="checkbox" 
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                  />
                  <span></span>
                </Switch>
              </DarkModeSwitch>
            </SectionTitle>
            <PreviewContainer 
              className="preview-content"
              isDark={isDarkMode}
            >
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </PreviewContainer>
            <CopyButtonContainer>
              <Button onClick={handleCopy}>
                Copy All
              </Button>
            </CopyButtonContainer>
          </EditorContainer>

          <EditorContainer>
            <SectionTitle>Format Editor</SectionTitle>
            <StyledTextarea
              value={css}
              onChange={(e) => updateStyle(e.target.value)}
              placeholder="Edit CSS styles..."
            />
            <style ref={styleRef}>{css}</style>
          </EditorContainer>
        </EditingContainer>
      </AppContainer>
    </>
  );
};

export default App; 