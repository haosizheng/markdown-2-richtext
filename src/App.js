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

// 添加模式切换开关样式
const ModeSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
`;

// 基础模式的样式编辑器容器
const BasicEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
`;

// 样式分类容器
const StyleSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  background: #f9f9f9;
`;

// 样式标题
const StyleTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
`;

// 样式选项行
const StyleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

// 样式标签
const StyleLabel = styled.label`
  min-width: 100px;
  font-size: 14px;
`;

// 颜色选择器容器
const ColorPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 在现有的样式组件下添加新的组件
const Select = styled.select`
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 200px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 100px;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }

  &::placeholder {
    color: #999;
  }
`;

// App 组件
const App = () => {
  const [markdown, setMarkdown] = useState(`# Heading 1\n## Heading 2\n### Heading 3\n\nThis is a **bold text** example\n\nThis is an *italic text* example`);
  const [css, setCSS] = useState(defaultCSS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const styleRef = useRef(null);
  const [editorMode, setEditorMode] = useState('basic'); // 'basic' or 'advanced'
  const [styleConfig, setStyleConfig] = useState({
    global: {
      fontFamily: 'Arial',
      letterSpacing: '0px',
      lineHeight: '1.6',
      paragraphSpacing: '16px',
    },
    h1: {
      color: '#000000',
      fontSize: '24px',
    },
    h2: {
      color: '#000000',
      fontSize: '20px',
    },
    h3: {
      color: '#000000',
      fontSize: '18px',
    },
    paragraph: {
      color: '#000000',
      fontSize: '16px',
    },
    blockquote: {
      color: '#666666',
      fontSize: '16px',
    },
    // ... 其他样式配置
  });
  
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

  const defaultValues = {
    global: {
      fontFamily: 'Arial',
      letterSpacing: '0px',
      lineHeight: '1.6',
      paragraphSpacing: '16px',
    },
    h1: {
      color: '#000000',
      fontSize: '24px',
    },
    // ... 其他默认值
  };

  // 生成 CSS
  const generateCSS = (config = styleConfig) => {
    return `
      .preview-content {
        font-family: ${config.global.fontFamily || defaultValues.global.fontFamily}, sans-serif;
        letter-spacing: ${config.global.letterSpacing || defaultValues.global.letterSpacing};
        line-height: ${config.global.lineHeight || defaultValues.global.lineHeight};
      }
      .preview-content h1,
      .preview-content h2,
      .preview-content h3,
      .preview-content h4,
      .preview-content h5,
      .preview-content h6,
      .preview-content p,
      .preview-content ul,
      .preview-content ol {
        margin: ${config.global.paragraphSpacing || defaultValues.global.paragraphSpacing} 0;
      }
      .preview-content h1 {
        color: ${config.h1.color || defaultValues.h1.color};
        font-size: ${config.h1.fontSize || defaultValues.h1.fontSize};
      }
      // ... 其他样式
    `;
  };

  // 处理样式更新
  const handleStyleChange = (section, property, value) => {
    const defaultValue = defaultValues[section]?.[property] || '';
    let finalValue = value.trim() === '' ? defaultValue : value;

    // 特殊处理 line height
    if (property === 'lineHeight') {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        finalValue = defaultValue;
      }
    }

    setStyleConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [property]: finalValue
      }
    }));

    const newCSS = generateCSS({
      ...styleConfig,
      [section]: {
        ...styleConfig[section],
        [property]: finalValue
      }
    });
    updateStyle(newCSS);
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
            <ModeSwitch>
              <Switch>
                <input
                  type="checkbox"
                  checked={editorMode === 'advanced'}
                  onChange={(e) => setEditorMode(e.target.checked ? 'advanced' : 'basic')}
                />
                <span></span>
              </Switch>
              Advanced Mode
            </ModeSwitch>
            
            {editorMode === 'advanced' ? (
              <StyledTextarea
                value={css}
                onChange={(e) => updateStyle(e.target.value)}
                placeholder="Edit CSS styles..."
              />
            ) : (
              <BasicEditorContainer>
                {/* 全局样式设置 */}
                <StyleSection>
                  <StyleTitle>Global Settings</StyleTitle>
                  <StyleRow>
                    <StyleLabel>Font Family</StyleLabel>
                    <Select
                      value={styleConfig.global.fontFamily}
                      onChange={(e) => {
                        handleStyleChange('global', 'fontFamily', e.target.value);
                        // 强制更新
                        const newCSS = generateCSS({
                          ...styleConfig,
                          global: {
                            ...styleConfig.global,
                            fontFamily: e.target.value
                          }
                        });
                        updateStyle(newCSS);
                      }}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="微软雅黑">微软雅黑</option>
                      {/* 添加更多字体选项 */}
                    </Select>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Letter Spacing</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.global.letterSpacing}
                      onChange={(e) => handleStyleChange('global', 'letterSpacing', e.target.value)}
                    />
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Line Height</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.global.lineHeight}
                      onChange={(e) => handleStyleChange('global', 'lineHeight', e.target.value)}
                    />
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Paragraph Spacing</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.global.paragraphSpacing}
                      onChange={(e) => handleStyleChange('global', 'paragraphSpacing', e.target.value)}
                    />
                  </StyleRow>
                </StyleSection>

                {/* 一级标题设置 */}
                <StyleSection>
                  <StyleTitle>Heading 1</StyleTitle>
                  <StyleRow>
                    <StyleLabel>Color</StyleLabel>
                    <ColorPicker>
                      <Input
                        type="color"
                        value={styleConfig.h1.color}
                        onChange={(e) => handleStyleChange('h1', 'color', e.target.value)}
                      />
                      <Input
                        type="text"
                        value={styleConfig.h1.color}
                        onChange={(e) => handleStyleChange('h1', 'color', e.target.value)}
                      />
                    </ColorPicker>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Font Size</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.h1.fontSize}
                      onChange={(e) => handleStyleChange('h1', 'fontSize', e.target.value)}
                    />
                  </StyleRow>
                </StyleSection>

                {/* 其他标题和段落设置类似... */}
              </BasicEditorContainer>
            )}
            <style ref={styleRef}>{css}</style>
          </EditorContainer>
        </EditingContainer>
      </AppContainer>
    </>
  );
};

export default App; 