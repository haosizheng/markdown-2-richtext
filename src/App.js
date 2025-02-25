import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { createGlobalStyle } from 'styled-components';

// 修改全局样式的创建方式
const GlobalStyle = createGlobalStyle`
  body {
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
  width: 100%;
  min-width: 400px;
  max-width: 500px;
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
  min-height: 300px;
  overflow: auto;
  
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
  background: #fff;
  color: #000;
  transition: all 0.3s ease;
`;

// 复制按钮容器
const CopyButtonContainer = styled.div`
  text-align: center;
  margin-top: 10px;
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

// 样式标签 - 移到 StyleRow 前面
const StyleLabel = styled.label`
  min-width: 100px;
  font-size: 14px;
  flex-shrink: 0;
`;

// 样式选项行
const StyleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
  position: relative;
  flex-wrap: wrap;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-start;
    
    ${StyleLabel} {
      margin-bottom: 5px;
    }
  }
`;

const UnitLabel = styled.span`
  display: inline-flex;
  align-items: center;
  height: 100%;
  color: #999;
  margin-left: 5px;
  position: static;
`;

// 替换现有的 ColorPicker 和 ColorPreview 组件
const ColorPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

// 新的组合式颜色选择器组件
const ColorPickerInput = styled.div`
  position: relative;
  width: 100%;
  
  input[type="text"] {
    width: 100%;
    padding: 8px;
    padding-left: 36px; // 为颜色预览留出空间
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
  }
  
  input[type="color"] {
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 100%;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px 0 0 4px;
    }
  }
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
  width: 100%;
  max-width: 120px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  &[type="text"] {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

// 添加 Toast 组件
const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const Toast = styled.div`
  padding: 12px 24px;
  border-radius: 4px;
  background-color: ${props => props.type === 'success' ? '#52c41a' : '#ff4d4f'};
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// App 组件
const App = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [markdown, setMarkdown] = useState(`# Heading 1\n## Heading 2\n### Heading 3\n\nThis is a **bold text** example\n\nThis is an *italic text* example`);
  const [css, setCSS] = useState(defaultCSS);
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
      borderColor: '#ccc',
      backgroundColor: '#f9f9f9'
    },
    code: {
      backgroundColor: '#f5f5f5',
      color: '#333',
      fontSize: '14px',
    },
    link: {
      color: '#1890ff',
    },
    list: {
      bulletColor: '#000',
      numberColor: '#000',
    }
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
        
        // Debug: 打印克隆内容的 HTML
        console.log('Cloned content HTML:', clonedContent.innerHTML);
        
        // Debug: 打印计算样式
        const computedStyle = window.getComputedStyle(clonedContent);
        console.log('Computed styles:', {
          backgroundColor: computedStyle.backgroundColor,
          background: computedStyle.background,
          color: computedStyle.color
        });
        
        // 将 h3、h4、h5、h6 转换为加粗文本
        clonedContent.querySelectorAll('h3, h4, h5, h6').forEach(header => {
          const strong = document.createElement('strong');
          strong.textContent = header.textContent;
          header.parentNode.replaceChild(strong, header);
        });
        
        tempDiv.appendChild(clonedContent);
        document.body.appendChild(tempDiv);
        
        // Debug: 打印临时 div 的最终 HTML
        console.log('Final tempDiv HTML:', tempDiv.innerHTML);
        
        // 选择内容
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // 执行复制命令
        document.execCommand('copy');
        
        // Debug: 尝试从剪贴板读取内容（如果浏览器支持）
        if (navigator.clipboard && navigator.clipboard.read) {
          try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
              for (const type of item.types) {
                const blob = await item.getType(type);
                const text = await blob.text();
                console.log(`Clipboard content (${type}):`, text);
              }
            }
          } catch (e) {
            console.log('Unable to read clipboard content:', e);
          }
        }
        
        // 清理
        document.body.removeChild(tempDiv);
        selection.removeAllRanges();
        
        alert('已复制富文本内容到剪贴板！');
      } catch (err) {
        alert('复制失败，请重试');
        console.error('Copy error:', err);
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

  // 修改 generateCSS 函数
  const generateCSS = (config = styleConfig) => {
    return `
      .preview-content {
        font-family: ${config.global.fontFamily || defaultValues.global.fontFamily}, sans-serif;
        letter-spacing: ${config.global.letterSpacing || defaultValues.global.letterSpacing};
        line-height: ${config.global.lineHeight || defaultValues.global.lineHeight};
        transition: all 0.3s ease;
      }
      
      .preview-content * {
        transition: all 0.3s ease;
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
        transition: all 0.3s ease;
      }
      
      .preview-content h1 {
        color: ${config.h1.color || defaultValues.h1.color};
        font-size: ${config.h1.fontSize || defaultValues.h1.fontSize};
        transition: all 0.3s ease;
      }
      
      .preview-content h2 {
        color: ${config.h2.color || defaultValues.h2.color};
        font-size: ${config.h2.fontSize || defaultValues.h2.fontSize};
        transition: all 0.3s ease;
      }
      
      .preview-content h3 {
        color: ${config.h3.color || defaultValues.h3.color};
        font-size: ${config.h3.fontSize || defaultValues.h3.fontSize};
        transition: all 0.3s ease;
      }
      
      .preview-content p {
        color: ${config.paragraph.color || defaultValues.paragraph.color};
        font-size: ${config.paragraph.fontSize || defaultValues.paragraph.fontSize};
        transition: all 0.3s ease;
      }
      
      .preview-content blockquote {
        color: ${config.blockquote.color || '#666666'};
        font-size: ${config.blockquote.fontSize || '16px'};
        border-left: 4px solid ${config.blockquote.borderColor || '#ccc'};
        background-color: ${config.blockquote.backgroundColor || 'transparent'};
        padding-left: 16px;
        margin: 16px 0;
        transition: all 0.3s ease;
      }
    `;
  };

  // 修改 handleStyleChange 函数
  const handleStyleChange = (section, property, value) => {
    const defaultValue = defaultValues[section]?.[property] || '';
    let finalValue = value;

    // 处理带单位的属性
    if (['fontSize', 'letterSpacing', 'paragraphSpacing'].includes(property)) {
      finalValue = `${value}px`;
    }

    // 特殊处理 line height
    if (property === 'lineHeight') {
      if (value === '') {
        finalValue = '';
      } else {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue > 0) {
          finalValue = value;
        } else {
          finalValue = defaultValue;
        }
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

  useEffect(() => {
    // 动态加载Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lato&family=Ma+Shan+Zheng&family=Montserrat&family=Noto+Sans+SC&family=Noto+Serif+SC&family=Open+Sans&family=Playfair+Display&family=Roboto&family=ZCOOL+QingKe+HuangYou&family=ZCOOL+XiaoWei&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

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
            </SectionTitle>
            <PreviewContainer>
              <div className="preview-content">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => {
                      const text = props.children[0];
                      if (typeof text === 'string' && text.includes('\n')) {
                        return (
                          <p>
                            {text.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i < text.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </p>
                        );
                      }
                      return <p {...props} />;
                    }
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
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
                      {/* 英文字体 */}
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Lato', sans-serif">Lato</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Playfair Display', serif">Playfair Display</option>
                      
                      {/* 中文字体 */}
                      <option value="'Noto Sans SC', sans-serif">思源黑体 (Noto Sans SC)</option>
                      <option value="'Noto Serif SC', serif">思源宋体 (Noto Serif SC)</option>
                      <option value="'ZCOOL XiaoWei', serif">站酷小薇 (ZCOOL XiaoWei)</option>
                      <option value="'ZCOOL QingKe HuangYou', cursive">站酷庆科黄油体 (ZCOOL QingKe HuangYou)</option>
                      <option value="'Ma Shan Zheng', cursive">马善政楷体 (Ma Shan Zheng)</option>
                    </Select>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Letter Spacing</StyleLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input
                        type="text"
                        value={styleConfig.global.letterSpacing.replace('px', '')}
                        onChange={(e) => handleStyleChange('global', 'letterSpacing', e.target.value)}
                      />
                      <UnitLabel>px</UnitLabel>
                    </div>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Line Height</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.global.lineHeight}
                      onChange={(e) => handleStyleChange('global', 'lineHeight', e.target.value)}
                    />
                    <UnitLabel>px</UnitLabel>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Paragraph Spacing</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.global.paragraphSpacing.replace('px', '')}
                      onChange={(e) => handleStyleChange('global', 'paragraphSpacing', e.target.value)}
                    />
                    <UnitLabel>px</UnitLabel>
                  </StyleRow>
                </StyleSection>

                {/* 一级标题设置 */}
                <StyleSection>
                  <StyleTitle>Heading 1</StyleTitle>
                  <StyleRow>
                    <StyleLabel>Color</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.h1.color}
                        onChange={(e) => handleStyleChange('h1', 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.h1.color}
                        onChange={(e) => handleStyleChange('h1', 'color', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Font Size</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.h1.fontSize.replace('px', '')}
                      onChange={(e) => handleStyleChange('h1', 'fontSize', e.target.value)}
                    />
                    <UnitLabel>px</UnitLabel>
                  </StyleRow>
                </StyleSection>

                {/* 二级标题设置 */}
                <StyleSection>
                  <StyleTitle>Heading 2</StyleTitle>
                  <StyleRow>
                    <StyleLabel>Color</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.h2.color}
                        onChange={(e) => handleStyleChange('h2', 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.h2.color}
                        onChange={(e) => handleStyleChange('h2', 'color', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Font Size</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.h2.fontSize.replace('px', '')}
                      onChange={(e) => handleStyleChange('h2', 'fontSize', e.target.value)}
                    />
                    <UnitLabel>px</UnitLabel>
                  </StyleRow>
                </StyleSection>

                {/* 三级标题设置 */}
                <StyleSection>
                  <StyleTitle>Heading 3</StyleTitle>
                  <StyleRow>
                    <StyleLabel>Color</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.h3.color}
                        onChange={(e) => handleStyleChange('h3', 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.h3.color}
                        onChange={(e) => handleStyleChange('h3', 'color', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Font Size</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.h3.fontSize.replace('px', '')}
                      onChange={(e) => handleStyleChange('h3', 'fontSize', e.target.value)}
                    />
                    <UnitLabel>px</UnitLabel>
                  </StyleRow>
                </StyleSection>

                {/* 段落文字设置 */}
                <StyleSection>
                  <StyleTitle>Paragraph</StyleTitle>
                  <StyleRow>
                    <StyleLabel>Color</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.paragraph.color}
                        onChange={(e) => handleStyleChange('paragraph', 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.paragraph.color}
                        onChange={(e) => handleStyleChange('paragraph', 'color', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Font Size</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.paragraph.fontSize.replace('px', '')}
                      onChange={(e) => handleStyleChange('paragraph', 'fontSize', e.target.value)}
                    />
                    <UnitLabel>px</UnitLabel>
                  </StyleRow>
                </StyleSection>

                {/* 引用设置 */}
                <StyleSection>
                  <StyleTitle>Blockquote</StyleTitle>
                  <StyleRow>
                    <StyleLabel>Color</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.blockquote.color}
                        onChange={(e) => handleStyleChange('blockquote', 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.blockquote.color}
                        onChange={(e) => handleStyleChange('blockquote', 'color', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Font Size</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.blockquote.fontSize.replace('px', '')}
                      onChange={(e) => handleStyleChange('blockquote', 'fontSize', e.target.value)}
                    />
                    <UnitLabel>px</UnitLabel>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Border Color</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.blockquote.borderColor}
                        onChange={(e) => handleStyleChange('blockquote', 'borderColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.blockquote.borderColor}
                        onChange={(e) => handleStyleChange('blockquote', 'borderColor', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>Background Color</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.blockquote.backgroundColor}
                        onChange={(e) => handleStyleChange('blockquote', 'backgroundColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.blockquote.backgroundColor}
                        onChange={(e) => handleStyleChange('blockquote', 'backgroundColor', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                </StyleSection>
              </BasicEditorContainer>
            )}
            <style ref={styleRef}>{css}</style>
          </EditorContainer>
        </EditingContainer>
        <ToastContainer>
          {toast && (
            <Toast type={toast.type}>
              {toast.message}
            </Toast>
          )}
        </ToastContainer>
      </AppContainer>
    </>
  );
};

export default App; 