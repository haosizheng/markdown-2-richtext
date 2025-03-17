/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { createGlobalStyle } from 'styled-components';
import { translations } from './translations'; // 修改导入路径
import LanguageSwitch from './components/LanguageSwitch';
import { defaultValues, styleTemplates } from './config/styleConfig';
/* eslint-enable no-unused-vars */

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
  overflow-x: hidden;
  background: #fff;
  color: #000;
  transition: all 0.3s ease;
  position: relative;
  min-width: 0;
  box-sizing: border-box;

  .preview-content {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
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

// 添加默认 CSS 常量
const defaultCSS = `
  .preview-content {
    font-family: SimSun, serif;
    line-height: 1.6;
    letter-spacing: 0px;
  }
`;

// 创建一个新的按钮样式，用于标题栏中的复制按钮
const HeaderCopyButton = styled.button`
  padding: 6px 12px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.1s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #40a9ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

// 1. 首先添加模板选择器的样式组件
const TemplateSelector = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`;

const TemplateSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }
`;

// App 组件
const App = () => {
  const [toast, setToast] = useState(null);
  const [images, setImages] = useState([]); // 存储粘贴的图片
  const textareaRef = useRef(null);
  const previewRef = useRef(null);
  const isScrollingRef = useRef(false); // 防止无限循环
  const [currentTemplate, setCurrentTemplate] = useState('default');
  const [language, setLanguage] = useState('zh'); // 默认中文
  const t = translations[language]; // 获取当前语言的翻译

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [markdown, setMarkdown] = useState(`# Welcome to FelxMark

### How to Use

1. Type Markdown in the left panel
2. See the **rich-text** formatted result in the preview panel
3. Customize styles in the **Format Editor**
4. Copy the result with the "Copy All" button

> Try pasting an image or formatting some text to see FlexMark in action!

---

# 

### 使用方法

1. 在左侧面板中输入 Markdown
2. 在预览面板中查看**富文本格式化**结果
3. 在格式编辑器中自定义样式
4. 使用"Copy All"按钮一键复制富文本到支持富文本的编辑器中

> 尝试粘贴图片或格式化一些文本，体验 FlexMark 的强大功能！
`);
  const [css, setCSS] = useState(defaultCSS);
  const styleRef = useRef(null);
  const [editorMode] = useState('basic');  // 如果只需要读取状态
  const [styleConfig, setStyleConfig] = useState({
    global: {
      fontFamily: "SimSun, serif",  // 修改这里为宋体
      letterSpacing: "0px",
      lineHeight: "1.6",
      paragraphSpacing: "16px",
      headingAlign: "left",
      headingColor: "#000000",    // 新增：统一的标题颜色
      headingSize: "medium"       // 新增：标题大小预设
    },
    paragraph: {
      color: '#000000',
      fontSize: '16px',
    },
    bold: {
      color: '#000000',
    },
    blockquote: {
      color: '#666666',
      fontSize: '16px',
      borderColor: '#ccc',
      backgroundColor: '#f9f9f9'
    },
    code: {
      color: '#333333',
      fontSize: '14px',
      backgroundColor: '#f5f5f5',
      fontFamily: "'Monaco', monospace"
    }
  });
  
  const handleCopy = async () => {
    const previewContent = document.querySelector('.preview-content');
    if (previewContent) {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.contentEditable = true;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        
        const clonedContent = previewContent.cloneNode(true);
        
        // 处理标题，添加换行和样式
        clonedContent.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((header, index, headers) => {
          const strong = document.createElement('strong');
          strong.textContent = header.textContent;
          strong.style.color = styleConfig.global.headingColor;
          strong.style.fontSize = header.style.fontSize;
          strong.style.letterSpacing = styleConfig.global.letterSpacing;
          strong.style.display = 'block';
          strong.style.textAlign = styleConfig.global.headingAlign;
          strong.style.fontFamily = styleConfig.global.fontFamily; // 添加字体设置
          
          // 创建包装 div
          const wrapper = document.createElement('div');
          wrapper.style.textAlign = styleConfig.global.headingAlign;
          wrapper.style.fontFamily = styleConfig.global.fontFamily; // 添加字体设置
          wrapper.style.margin = `${styleConfig.global.paragraphSpacing} 0`;
          
          // 创建额外的容器来确保样式被保留
          const container = document.createElement('div');
          container.style.fontFamily = styleConfig.global.fontFamily; // 添加字体设置
          container.style.textAlign = styleConfig.global.headingAlign;
          container.appendChild(strong);
          wrapper.appendChild(container);
          
          // 如果不是最后一个标题，添加换行
          if (index < headers.length - 1) {
            wrapper.appendChild(document.createElement('br'));
            wrapper.appendChild(document.createElement('br'));
          }
          
          // 替换原始标题
          header.parentNode.replaceChild(wrapper, header);
        });
        
        // 处理段落，应用行高和字间距
        clonedContent.querySelectorAll('p').forEach(p => {
          p.style.lineHeight = styleConfig.global.lineHeight;
          p.style.letterSpacing = styleConfig.global.letterSpacing;
          p.style.marginBottom = styleConfig.global.paragraphSpacing;
          p.style.color = styleConfig.paragraph.color; // 添加段落颜色
          p.style.fontSize = styleConfig.paragraph.fontSize; // 添加段落字号
        });
        
        // 处理加粗文本
        clonedContent.querySelectorAll('strong').forEach(strong => {
          strong.style.color = styleConfig.bold.color; // 添加加粗文本颜色
        });
        
        // 处理引用块
        clonedContent.querySelectorAll('blockquote').forEach(quote => {
          quote.style.color = styleConfig.blockquote.color;
          quote.style.fontSize = styleConfig.blockquote.fontSize;
          quote.style.borderColor = styleConfig.blockquote.borderColor;
          quote.style.backgroundColor = styleConfig.blockquote.backgroundColor;
        });
        
        // 处理图片
        clonedContent.querySelectorAll('img').forEach(img => {
          if (img.alt && img.alt.startsWith('img-')) {
            const image = images.find(i => i.id === img.alt);
            if (image) {
              img.src = image.url;
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
            }
          }
        });
        
        // 应用全局样式到容器
        tempDiv.style.lineHeight = styleConfig.global.lineHeight;
        tempDiv.style.letterSpacing = styleConfig.global.letterSpacing;
        tempDiv.style.fontFamily = styleConfig.global.fontFamily;
        
        tempDiv.appendChild(clonedContent);
        document.body.appendChild(tempDiv);
        
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        selection.removeAllRanges();
        selection.addRange(range);
        
        document.execCommand('copy');
        
        document.body.removeChild(tempDiv);
        selection.removeAllRanges();
        
        showToast(t.copySuccess, 'success');
      } catch (err) {
        console.error('Copy error:', err);
        showToast(t.copyError, 'error');
      }
    }
  };
  // 更新样式
  const updateStyle = (newCSS) => {
    // 确保 CSS 包含正确的行高设置
    if (!newCSS.includes('line-height:')) {
      const lineHeight = styleConfig.global.lineHeight || defaultValues.global.lineHeight;
      newCSS = newCSS.replace('.preview-content {', 
        `.preview-content {
          line-height: ${lineHeight};`
      );
    }
    setCSS(newCSS);
    if (styleRef.current) {
      styleRef.current.textContent = newCSS;
    }
  };

  // 3. 修改 generateCSS 函数
  const generateCSS = (config = styleConfig) => {
    return `
      .preview-content {
        font-family: ${config.global.fontFamily || defaultValues.global.fontFamily};
        letter-spacing: ${config.global.letterSpacing || defaultValues.global.letterSpacing};
        line-height: ${config.global.lineHeight || defaultValues.global.lineHeight};
      }

      /* 确保所有块级元素都应用行高设置 */
      .preview-content h1,
      .preview-content h2,
      .preview-content h3,
      .preview-content h4,
      .preview-content h5,
      .preview-content h6,
      .preview-content p,
      .preview-content ul,
      .preview-content ol,
      .preview-content li,
      .preview-content blockquote,
      .preview-content pre {
        line-height: ${config.global.lineHeight || defaultValues.global.lineHeight};
      }

      /* 标题样式 */
      .preview-content h1, 
      .preview-content h2,
      .preview-content h3,
      .preview-content h4,
      .preview-content h5,
      .preview-content h6 {
        color: ${config.global.headingColor || defaultValues.global.headingColor};
        text-align: ${config.global.headingAlign || defaultValues.global.headingAlign};
        margin: ${config.global.paragraphSpacing || defaultValues.global.paragraphSpacing} 0;
      }

      /* 引用块样式 */
      .preview-content blockquote {
        color: ${config.blockquote.color || defaultValues.blockquote.color};
        font-size: ${config.blockquote.fontSize || defaultValues.blockquote.fontSize};
        border-left: 4px solid ${config.blockquote.borderColor || defaultValues.blockquote.borderColor};
        background-color: ${config.blockquote.backgroundColor || defaultValues.blockquote.backgroundColor};
        padding: 1em;
        margin: ${config.global.paragraphSpacing || defaultValues.global.paragraphSpacing} 0;
        padding-left: 20px;
        position: relative;
      }

      /* 引用块左侧小方块 */
      .preview-content blockquote::before {
        content: '';
        position: absolute;
        left: -4px;
        top: 0;
        width: 4px;
        height: 100%;
        background-color: ${config.blockquote.borderColor || defaultValues.blockquote.borderColor};
      }

      /* 确保引用块内的段落继承引用块样式 */
      .preview-content blockquote p {
        color: inherit;
        font-size: inherit;
        margin: 0;
        line-height: inherit;
      }
    `;
  };

  // 添加一个数字输入验证函数
  const isValidNumberInput = (value) => {
    // 只允许数字、小数点和退格键
    return value === '' || /^-?\d*\.?\d*$/.test(value);
  };

  // 修改 handleStyleChange 函数
  const handleStyleChange = (section, property, value) => {
    // 对于需要数字验证的属性，先进行验证
    const numericProperties = ['letterSpacing', 'lineHeight', 'paragraphSpacing', 'fontSize'];
    if (numericProperties.includes(property) && !isValidNumberInput(value)) {
      return; // 如果输入无效，直接返回
    }

    const newConfig = JSON.parse(JSON.stringify(styleConfig));
    
    if (property === 'fontSize' || property === 'paragraphSpacing' || property === 'letterSpacing') {
      const cleanValue = value.toString().replace(/px$/, '');
      newConfig[section][property] = `${cleanValue}px`;
    } 
    else if (property === 'lineHeight') {
      newConfig[section][property] = value;
    }
    else {
      newConfig[section][property] = value;
    }
    
    setStyleConfig(newConfig);
    const newCSS = generateCSS(newConfig);
    updateStyle(newCSS);
  };

  // 修改输入框组件的使用方式
  // Letter Spacing
  // <Input
  //   type="text"
  //   value={styleConfig.global.letterSpacing.replace('px', '')}
  //   onChange={(e) => {
  //     if (isValidNumberInput(e.target.value)) {
  //       handleStyleChange('global', 'letterSpacing', e.target.value);
  //     }
  //   }}
  // />

  // Line Height
  // <Input
  //   type="text"
  //   value={styleConfig.global.lineHeight}
  //   onChange={(e) => {
  //     if (isValidNumberInput(e.target.value)) {
  //       handleStyleChange('global', 'lineHeight', e.target.value);
  //     }
  //   }}
  // />

  // Paragraph Spacing
  // <Input
  //   type="text"
  //   value={styleConfig.global.paragraphSpacing.replace('px', '')}
  //   onChange={(e) => {
  //     if (isValidNumberInput(e.target.value)) {
  //       handleStyleChange('global', 'paragraphSpacing', e.target.value);
  //     }
  //   }}
  // />

  // Font Size (用于段落、引用块等)
  // <Input
  //   type="text"
  //   value={styleConfig.paragraph.fontSize.replace('px', '')}
  //   onChange={(e) => {
  //     if (isValidNumberInput(e.target.value)) {
  //       handleStyleChange('paragraph', 'fontSize', e.target.value);
  //     }
  //   }}
  // />

  // 修改 handlePaste 函数
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        
        reader.onload = (event) => {
          // 保存当前预览框的滚动位置
          const previewContainer = document.querySelector('.preview-content');
          const scrollTop = previewContainer ? previewContainer.parentElement.scrollTop : 0;
          
          const imageUrl = event.target.result;
          const imageId = `img-${Date.now()}`;
          
          // 将图片存储在状态中
          setImages(prev => [...prev, { id: imageId, url: imageUrl }]);
          
          // 在光标位置插入标准 Markdown 图片语法
          const cursorPosition = textareaRef.current.selectionStart;
          const textBefore = markdown.substring(0, cursorPosition);
          const textAfter = markdown.substring(cursorPosition);
          
          // 使用标准 Markdown 语法
          const imageMarkdown = `\n![${imageId}](${imageId})\n`;
          
          setMarkdown(textBefore + imageMarkdown + textAfter);
          
          // 在下一个渲染周期恢复滚动位置
          requestAnimationFrame(() => {
            if (previewContainer && previewContainer.parentElement) {
              previewContainer.parentElement.scrollTop = scrollTop;
            }
          });
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // 添加回 getMarkdownKeyPoints 函数，并改进它
  const getMarkdownKeyPoints = (markdown) => {
    const keyPoints = [];
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockStartIndex = -1;
    let currentParagraph = [];
    let paragraphStartIndex = -1;
    
    const addParagraph = () => {
      if (currentParagraph.length > 0) {
        keyPoints.push({
          type: 'paragraph',
          lineIndex: paragraphStartIndex,
          content: currentParagraph.join('\n').trim()
        });
        currentParagraph = [];
        paragraphStartIndex = -1;
      }
    };
    
    lines.forEach((line, index) => {
      // 处理代码块
      if (line.match(/^```/)) {
        if (!inCodeBlock) {
          // 代码块开始前，先结束当前段落
          addParagraph();
          
          inCodeBlock = true;
          codeBlockStartIndex = index;
          codeBlockContent = [line];
        } else {
          // 代码块结束
          inCodeBlock = false;
          codeBlockContent.push(line);
          keyPoints.push({
            type: 'codeblock',
            lineIndex: codeBlockStartIndex,
            content: codeBlockContent.join('\n'),
            endIndex: index
          });
          codeBlockContent = [];
        }
        return;
      }
      
      // 如果在代码块内，收集内容
      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }
      
      // 识别标题
      if (line.match(/^#{1,6}\s/)) {
        addParagraph(); // 结束当前段落
        keyPoints.push({
          type: 'heading',
          lineIndex: index,
          content: line.trim(),
          level: line.match(/^(#{1,6})\s/)[1].length
        });
      }
      // 识别列表
      else if (line.match(/^(\*|-|\+|\d+\.)\s/)) {
        addParagraph();
        keyPoints.push({
          type: 'list',
          lineIndex: index,
          content: line.trim()
        });
      }
      // 识别引用块
      else if (line.match(/^>/)) {
        addParagraph();
        keyPoints.push({
          type: 'blockquote',
          lineIndex: index,
          content: line.trim()
        });
      }
      // 识别水平线
      else if (line.match(/^(---|\*\*\*|___)$/)) {
        addParagraph();
        keyPoints.push({
          type: 'hr',
          lineIndex: index,
          content: line.trim()
        });
      }
      // 处理段落
      else {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
          // 空行结束当前段落
          addParagraph();
        } else {
          // 如果还没有开始段落，记录起始位置
          if (paragraphStartIndex === -1) {
            paragraphStartIndex = index;
          }
          currentParagraph.push(trimmedLine);
        }
      }
    });
    
    // 处理最后一个段落
    addParagraph();
    
    return keyPoints;
  };

  // 修改 cleanMarkdownText 函数，确保正确处理删除线语法
  const cleanMarkdownText = (text) => {
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')    // 移除链接语法，保留链接文本
      .replace(/`([^`]+)`/g, '$1')                 // 处理行内代码，保留代码内容
      .replace(/~~([^~]+)~~/g, '$1')              // 处理删除线，保留文本内容
      .replace(/[*_]/g, '')                        // 移除加粗、斜体标记
      .replace(/\s+/g, ' ')                        // 统一空白字符
      .trim();
  };

  // 改进段落匹配逻辑
  const findPreviewElements = (keyPoints) => {
    const previewElement = previewRef.current;
    if (!previewElement) {
      console.log('❌ Preview element not found');
      return [];
    }
    
    const previewContent = previewElement.querySelector('.preview-content');
    if (!previewContent) {
      console.log('❌ Preview content not found');
      return [];
    }
    
    return keyPoints.map(keyPoint => {
      let selector;
      
      switch (keyPoint.type) {
        case 'heading':
          selector = `h${keyPoint.level}`;
          break;
        case 'paragraph':
          selector = 'p';
          console.log('🔍 Looking for paragraph:', {
            original: keyPoint.content,
            cleaned: cleanMarkdownText(keyPoint.content)
          });
          break;
        case 'list':
          selector = keyPoint.content.match(/^\d+\./) ? 'ol > li' : 'ul > li';
          break;
        case 'codeblock':
          selector = 'pre code, pre';
          console.log('🔍 Looking for code block:', {
            content: keyPoint.content.slice(0, 100) + '...'
          });
          break;
        case 'blockquote':
          selector = 'blockquote';
          break;
        case 'hr':
          selector = 'hr';
          break;
        default:
          return null;
      }
      
      const elements = Array.from(previewContent.querySelectorAll(selector));
      
      // 对段落使用改进的匹配逻辑
      if (keyPoint.type === 'paragraph') {
        const cleanedContent = cleanMarkdownText(keyPoint.content);
        
        const matchedElements = elements.map(el => {
          // 获取段落的纯文本内容，包括所有子元素
          const elementText = Array.from(el.childNodes)
            .map(node => {
              // 如果是文本节点，直接使用其内容
              if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
              }
              // 如果是行内代码元素，获取其文本内容
              if (node.nodeName === 'CODE') {
                return node.textContent;
              }
              // 其他元素，获取其文本内容
              return node.textContent;
            })
            .join('')
            .trim();

          const matchScore = calculateMatchScore(elementText, cleanedContent);
          
          console.log('📌 Comparing paragraph:', {
            element: elementText.slice(0, 50) + (elementText.length > 50 ? '...' : ''),
            score: matchScore,
            hasInlineCode: el.querySelector('code') !== null
          });
          
          return { element: el, score: matchScore };
        });
        
        matchedElements.sort((a, b) => b.score - a.score);
        
        if (matchedElements[0]?.score > 0.7) {
          console.log('✅ Found matching paragraph with score:', matchedElements[0].score);
          return {
            keyPoint,
            element: matchedElements[0].element
          };
        }
        
        console.log('❌ No matching paragraph found');
        return null;
      }
      
      // 其他类型的匹配逻辑保持不变
      const matchedElement = elements.find(el => {
        const elementText = el.textContent.trim();
        const keyPointContent = keyPoint.content.replace(/^[#>*\-+\d.`\s]+/, '').trim();
        return elementText.includes(keyPointContent) || keyPointContent.includes(elementText);
      });
      
      return matchedElement ? { keyPoint, element: matchedElement } : null;
    }).filter(item => item !== null);
  };

  // 3. 添加专门的代码块匹配分数计算函数
  const calculateCodeBlockMatchScore = (text1, text2) => {
    // 标准化代码文本
    const normalizeCodeText = (text) => {
      return text
        .replace(/\s+/g, ' ')  // 统一空白字符
        .trim();
    };
    
    text1 = normalizeCodeText(text1);
    text2 = normalizeCodeText(text2);
    
    // 完全匹配
    if (text1 === text2) return 1;
    
    // 计算行匹配
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    // 如果行数差异太大，降低匹配分数
    if (Math.abs(lines1.length - lines2.length) > 2) {
      return 0.5;
    }
    
    // 计算每行的匹配度
    const matchedLines = lines1.filter(line1 => 
      lines2.some(line2 => {
        const normalizedLine1 = line1.trim();
        const normalizedLine2 = line2.trim();
        return normalizedLine1.includes(normalizedLine2) || 
               normalizedLine2.includes(normalizedLine1);
      })
    );
    
    return matchedLines.length / Math.max(lines1.length, lines2.length);
  };

  // 计算文本匹配度
  const calculateMatchScore = (text1, text2) => {
    // 转换为小写进行比较
    text1 = text1.toLowerCase();
    text2 = text2.toLowerCase();
    
    // 完全匹配
    if (text1 === text2) return 1;
    
    // 一个文本完全包含另一个
    if (text1.includes(text2)) return 0.9;
    if (text2.includes(text1)) return 0.9;
    
    // 计算共同单词数
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    const commonWords = words1.filter(word => 
      words2.some(w2 => w2.includes(word) || word.includes(w2))
    );
    
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  // 修改同步滚动函数，只保留从输入框到预览框的同步
  const syncScroll = () => {
    if (isScrollingRef.current) return;
    
    try {
      isScrollingRef.current = true;
      
      const textareaElement = textareaRef.current;
      const previewElement = previewRef.current;
      
      if (!textareaElement || !previewElement) return;
      
      // 获取当前光标位置所在的行
      const cursorPosition = textareaElement.selectionStart;
      const text = textareaElement.value.substring(0, cursorPosition);
      const currentLine = text.split('\n').length - 1;
      
      // 获取关键点
      const keyPoints = getMarkdownKeyPoints(markdown);
      
      // 找到最近的前一个关键点
      let closestKeyPoint = null;
      for (let i = keyPoints.length - 1; i >= 0; i--) {
        if (keyPoints[i].lineIndex <= currentLine) {
          closestKeyPoint = keyPoints[i];
          break;
        }
      }
      
      if (closestKeyPoint) {
        // 找到预览中对应的元素
        const previewElements = findPreviewElements([closestKeyPoint]);
        
        if (previewElements.length > 0 && previewElements[0].element) {
          // 计算元素在预览中的位置
          const element = previewElements[0].element;
          const elementTop = element.offsetTop;
          
          // 计算滚动位置，考虑一些偏移以提高可读性
          const scrollTop = Math.max(0, elementTop - 50);
          
          // 平滑滚动到该位置
          previewElement.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }
    } finally {
      // 防止无限循环
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }
  };

  // 修改事件监听，只监听输入框的事件
  useEffect(() => {
    const textarea = textareaRef.current;
    
    if (!textarea) return;

    // 检查初始 CSS 是否包含正确的行高
    if (!css.includes(`line-height: ${styleConfig.global.lineHeight}`)) {
      console.warn('Initial CSS does not contain correct line-height!');
      const initialCSS = generateCSS(styleConfig);
      updateStyle(initialCSS);
    }
    
    const throttle = (func, limit) => {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };
    
    const handleTextareaEvent = throttle(() => {
      syncScroll();
    }, 100);
    
    textarea.addEventListener('scroll', handleTextareaEvent);
    textarea.addEventListener('click', handleTextareaEvent);
    textarea.addEventListener('keyup', handleTextareaEvent);
    
    return () => {
      textarea.removeEventListener('scroll', handleTextareaEvent);
      textarea.removeEventListener('click', handleTextareaEvent);
      textarea.removeEventListener('keyup', handleTextareaEvent);
    };
  }, [markdown, css, styleConfig, generateCSS, syncScroll, updateStyle]);

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

  // 4. 添加模板切换处理函数
  const handleTemplateChange = (templateName) => {
    const template = styleTemplates[templateName];
    if (template) {
      // 更新当前模板
      setCurrentTemplate(templateName);
      
      // 更新样式配置
      const newConfig = JSON.parse(JSON.stringify(template.styles));
      setStyleConfig(newConfig);
      
      // 更新 CSS
      const newCSS = generateCSS(newConfig);
      updateStyle(newCSS);
      
      // 更新样式编辑器中的字体选择
      const fontSelect = document.querySelector('select[name="fontFamily"]');
      if (fontSelect) {
        fontSelect.value = template.styles.global.fontFamily;
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <Title>MarkDown To Rich Text Format</Title>
      <LanguageSwitch language={language} setLanguage={setLanguage} />
    <AppContainer>
        <EditingContainer>
      <EditorContainer>
            <SectionTitle>{t.input}</SectionTitle>
        <StyledTextarea
              ref={textareaRef}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
              onPaste={handlePaste}
              placeholder={t.inputPlaceholder}
        />
      </EditorContainer>
          
          <EditorContainer>
            <SectionTitle>
              {t.preview}
              <HeaderCopyButton onClick={handleCopy}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                {t.copyAll}
              </HeaderCopyButton>
            </SectionTitle>
            <PreviewContainer 
              ref={previewRef}
              className="preview-content"
            >
              <div className="preview-content">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => {
                      const text = props.children[0];
                      if (typeof text === 'string' && text.includes('\n')) {
                        return (
                          <p style={{ backgroundColor: 'transparent' }}>
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
                    },
                    img: ({node, ...props}) => {
                      // 检查 src 是否是我们的图片 ID
                      const src = props.src || '';
                      
                      if (src.startsWith('img-')) {
                        // 查找对应的图片
                        const image = images.find(img => img.id === src);
                        if (image) {
                          return (
                            <img 
                              src={image.url}
                              alt={`Pasted image ${image.id}`}
                              style={{
                                display: 'block',
                                margin: '20px auto',
                                maxWidth: '100%'
                              }}
                            />
                          );
                        }
                      }
                      
                      // 处理常规 Markdown 图片
                      return (
                        <img 
                          {...props} 
                          style={{
                            display: 'block',
                            margin: '20px auto',
                            maxWidth: '100%'
                          }}
                        />
                      );
                    },
                    del: ({node, ...props}) => (
                      <del style={{
                        textDecoration: 'line-through',
                        opacity: '0.7'
                      }} {...props} />
                    )
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
      </PreviewContainer>
          </EditorContainer>

          <EditorContainer>
            <SectionTitle>
              {t.formatEditor}
            </SectionTitle>
            
            {editorMode === 'advanced' ? (
              <StyledTextarea
                value={css}
                onChange={(e) => updateStyle(e.target.value)}
                placeholder="Edit CSS styles..."
              />
            ) : (
              <BasicEditorContainer>
                {/* 1. 模板选择 */}
                <TemplateSelector>
                  <StyleTitle>{t.styleTemplate}</StyleTitle>
                  <TemplateSelect
                    value={currentTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                  >
                    {Object.entries(styleTemplates).map(([key, template]) => (
                      <option key={key} value={key}>
                        {t[template.nameKey]}
                      </option>
                    ))}
                  </TemplateSelect>
                </TemplateSelector>

                {/* 2. 全局设置 */}
                <StyleSection>
                  <StyleTitle>{t.globalSettings}</StyleTitle>
                  <StyleRow>
                    <StyleLabel>{t.fontFamily}</StyleLabel>
                    <Select
                      value={styleConfig.global.fontFamily}
                      onChange={(e) => handleStyleChange('global', 'fontFamily', e.target.value)}
                    >
                      <optgroup label={`${t.wechatSupported}`}>
                        <option value="'PingFang SC', -apple-system, sans-serif">{t.pingfangSC}</option>
                        <option value="'Microsoft YaHei', -apple-system, sans-serif">{t.microsoftYahei}</option>
                        <option value="sans-serif">{t.sansSerif}</option>
                        <option value="serif">{t.serif}</option>
                      </optgroup>
                      <optgroup label={t.otherFonts}>
                        <option value="'Noto Sans SC', sans-serif">{t.notoSansSC}</option>
                        <option value="'Noto Serif SC', serif">{t.notoSerifSC}</option>
                        <option value="'Open Sans', sans-serif">{t.openSans}</option>
                      </optgroup>
                    </Select>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.letterSpacing}</StyleLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input
                        type="text"
                        value={styleConfig.global.letterSpacing.replace('px', '')}
                        onChange={(e) => {
                          if (isValidNumberInput(e.target.value)) {
                            handleStyleChange('global', 'letterSpacing', e.target.value);
                          }
                        }}
                      />
                      <UnitLabel>px</UnitLabel>
                    </div>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.lineHeight}</StyleLabel>
                    <Input
                      type="text"
                      value={styleConfig.global.lineHeight}
                      onChange={(e) => {
                        if (isValidNumberInput(e.target.value)) {
                          handleStyleChange('global', 'lineHeight', e.target.value);
                        }
                      }}
                    />
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.paragraphSpacing}</StyleLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input
                        type="text"
                        value={styleConfig.global.paragraphSpacing.replace('px', '')}
                        onChange={(e) => {
                          if (isValidNumberInput(e.target.value)) {
                            handleStyleChange('global', 'paragraphSpacing', e.target.value);
                          }
                        }}
                      />
                      <UnitLabel>px</UnitLabel>
                    </div>
                  </StyleRow>
                </StyleSection>

                {/* 3. 标题设置（H1-H3） */}
                <StyleSection>
                  <StyleTitle>{t.headings}</StyleTitle>
                  <StyleRow>
                    <StyleLabel>{t.color}</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.global.headingColor}
                        onChange={(e) => handleStyleChange('global', 'headingColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.global.headingColor}
                        onChange={(e) => handleStyleChange('global', 'headingColor', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.size}</StyleLabel>
                    <Select
                      value={styleConfig.global.headingSize}
                      onChange={(e) => handleStyleChange('global', 'headingSize', e.target.value)}
                    >
                      <option value="large">{t.large}</option>
                      <option value="medium">{t.medium}</option>
                      <option value="small">{t.small}</option>
                    </Select>
                  </StyleRow>
                </StyleSection>

                {/* 4. 段落设置 */}
                <StyleSection>
                  <StyleTitle>{t.paragraph}</StyleTitle>
                  <StyleRow>
                    <StyleLabel>{t.color}</StyleLabel>
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
                    <StyleLabel>{t.fontSize}</StyleLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input
                        type="text"
                        value={styleConfig.paragraph.fontSize.replace('px', '')}
                        onChange={(e) => {
                          if (isValidNumberInput(e.target.value)) {
                            handleStyleChange('paragraph', 'fontSize', e.target.value);
                          }
                        }}
                      />
                      <UnitLabel>px</UnitLabel>
                    </div>
                  </StyleRow>
                </StyleSection>

                {/* 5. 加粗文本设置 */}
                <StyleSection>
                  <StyleTitle>{t.boldText}</StyleTitle>
                  <StyleRow>
                    <StyleLabel>{t.color}</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.bold.color}
                        onChange={(e) => handleStyleChange('bold', 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.bold.color}
                        onChange={(e) => handleStyleChange('bold', 'color', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                </StyleSection>

                {/* 6. 引用块设置 */}
                <StyleSection>
                  <StyleTitle>{t.blockquote}</StyleTitle>
                  <StyleRow>
                    <StyleLabel>{t.color}</StyleLabel>
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
                    <StyleLabel>{t.fontSize}</StyleLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input
                        type="text"
                        value={styleConfig.blockquote.fontSize.replace('px', '')}
                        onChange={(e) => {
                          if (isValidNumberInput(e.target.value)) {
                            handleStyleChange('blockquote', 'fontSize', e.target.value);
                          }
                        }}
                      />
                      <UnitLabel>px</UnitLabel>
                    </div>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.borderColor}</StyleLabel>
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
                    <StyleLabel>{t.backgroundColor}</StyleLabel>
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

                {/* 7. 代码块设置 */}
                <StyleSection>
                  <StyleTitle>{t.code}</StyleTitle>
                  <StyleRow>
                    <StyleLabel>{t.fontFamily}</StyleLabel>
                    <Select
                      value={styleConfig.code.fontFamily}
                      onChange={(e) => handleStyleChange('code', 'fontFamily', e.target.value)}
                    >
                      <option value="'Monaco', monospace">Monaco</option>
                      <option value="'Fira Code', monospace">Fira Code</option>
                      <option value="'Consolas', monospace">Consolas</option>
                      <option value="'Source Code Pro', monospace">Source Code Pro</option>
                    </Select>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.color}</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.code.color}
                        onChange={(e) => handleStyleChange('code', 'color', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.code.color}
                        onChange={(e) => handleStyleChange('code', 'color', e.target.value)}
                      />
                    </ColorPickerInput>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.fontSize}</StyleLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input
                        type="text"
                        value={styleConfig.code.fontSize.replace('px', '')}
                        onChange={(e) => handleStyleChange('code', 'fontSize', e.target.value)}
                      />
                      <UnitLabel>px</UnitLabel>
                    </div>
                  </StyleRow>
                  <StyleRow>
                    <StyleLabel>{t.backgroundColor}</StyleLabel>
                    <ColorPickerInput>
                      <input
                        type="color"
                        value={styleConfig.code.backgroundColor}
                        onChange={(e) => handleStyleChange('code', 'backgroundColor', e.target.value)}
                      />
                      <input
                        type="text"
                        value={styleConfig.code.backgroundColor}
                        onChange={(e) => handleStyleChange('code', 'backgroundColor', e.target.value)}
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