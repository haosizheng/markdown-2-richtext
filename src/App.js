import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styled, { createGlobalStyle } from 'styled-components';
import { translations } from './translations'; // 修改导入路径
import LanguageSwitch from './components/LanguageSwitch';
import { defaultValues, headingSizePresets, styleTemplates } from './config/styleConfig';

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

// 添加模式切换开关样式
const ModeSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
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

// 添加回 defaultCSS 变量定义
const defaultCSS = `
/* Styles in Preview;预览区域的样式 */
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

.preview-content img {
  display: block;
  margin: 20px auto;
  max-width: 100%;
  height: auto;
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
  const [editorMode, setEditorMode] = useState('basic'); // 'basic' or 'advanced'
  const [styleConfig, setStyleConfig] = useState({
    global: {
      fontFamily: "-apple-system, 'Microsoft YaHei'",
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
        await navigator.clipboard.writeText(previewContent.innerHTML);
        alert(t.copySuccess);
      } catch (err) {
        alert(t.copyError);
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
    const lineHeight = config.global.lineHeight || defaultValues.global.lineHeight;
    const headingSizes = headingSizePresets[config.global.headingSize || 'medium'];
    const headingColor = config.global.headingColor || defaultValues.global.headingColor;
    
    return `
      /* Global styles */
      .preview-content {
        font-family: ${config.global.fontFamily || defaultValues.global.fontFamily};
        line-height: ${lineHeight};
        box-sizing: border-box;
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
        transition: all 0.3s ease;
      }

      /* 统一设置文本样式 */
      .preview-content h1,
      .preview-content h2,
      .preview-content h3,
      .preview-content p,
      .preview-content li,
      .preview-content blockquote {
        letter-spacing: ${config.global.letterSpacing || defaultValues.global.letterSpacing};
      }

      /* 标题统一样式 */
      .preview-content h1,
      .preview-content h2,
      .preview-content h3 {
        color: ${headingColor};
        margin: ${config.global.paragraphSpacing || defaultValues.global.paragraphSpacing} 0;
        text-align: ${config.global.headingAlign || 'left'};
      }

      /* 链接样式 */
      .preview-content a {
        color: ${headingColor} !important; /* 使用 !important 覆盖默认样式 */
        text-decoration: underline;
        font-weight: bold; /* 添加加粗效果 */
        transition: all 0.3s ease;
      }

      .preview-content a:hover {
        opacity: 0.8;
      }

      /* 各级标题大小 */
      .preview-content h1 {
        font-size: ${headingSizes.h1};
      }

      .preview-content h2 {
        font-size: ${headingSizes.h2};
      }

      .preview-content h3 {
        font-size: ${headingSizes.h3};
      }

      /* 段落和列表样式 */
      .preview-content p,
      .preview-content ul,
      .preview-content ol {
        color: ${config.paragraph.color || defaultValues.paragraph.color};
        font-size: ${config.paragraph.fontSize || defaultValues.paragraph.fontSize};
        margin: ${config.global.paragraphSpacing || defaultValues.global.paragraphSpacing} 0;
      }

      /* 列表特殊处理 */
      .preview-content ul,
      .preview-content ol {
        padding-left: 2em;
        box-sizing: border-box;
      }

      .preview-content li {
        color: ${config.paragraph.color || defaultValues.paragraph.color};
        font-size: ${config.paragraph.fontSize || defaultValues.paragraph.fontSize};
        position: relative; /* 保持相对定位 */
      }

      /* 加粗文本样式 */
      .preview-content strong {
        color: ${config.bold.color || config.paragraph.color};
        font-weight: bold;
      }

      /* 引用块样式 */
      .preview-content blockquote {
        color: ${config.blockquote.color || '#666666'};
        font-size: ${config.blockquote.fontSize || '16px'};
        border-left: 4px solid ${config.blockquote.borderColor || '#ccc'};
        background-color: ${config.blockquote.backgroundColor || 'transparent'};
        padding: 1em;
        margin: ${config.global.paragraphSpacing || defaultValues.global.paragraphSpacing} 0;
        padding-left: 20px;
      }

      /* 确保引用块内的段落继承引用块样式 */
      .preview-content blockquote p {
        color: inherit;
        font-size: inherit;
        margin: 0;
      }

      /* 代码样式 */
      .preview-content code,
      .preview-content pre {
        font-family: ${config.code.fontFamily || "'Monaco', monospace"};
        color: ${config.code.color || '#333'};
        font-size: ${config.code.fontSize || '14px'};
        background-color: ${config.code.backgroundColor || '#f5f5f5'};
        padding: 0.2em 0.4em;
        border-radius: 3px;
      }

      .preview-content pre {
        padding: 1em;
        overflow-x: auto;
      }

      .preview-content pre code {
        background: none;
        padding: 0;
        font-size: inherit;
        color: inherit;
      }

      /* 图片样式 */
      .preview-content img {
        display: block;
        margin: 20px auto;
        max-width: 100%;
        height: auto;
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
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // 1. 首先，我们需要识别 Markdown 中的关键点
  const getMarkdownKeyPoints = (markdown) => {
    const keyPoints = [];
    const lines = markdown.split('\n');
    
    lines.forEach((line, index) => {
      // 识别标题
      if (line.match(/^#{1,6}\s/)) {
        keyPoints.push({
          type: 'heading',
          lineIndex: index,
          content: line.trim(),
          level: line.match(/^(#{1,6})\s/)[1].length
        });
      }
      // 识别列表开始
      else if (line.match(/^(\*|-|\+|\d+\.)\s/)) {
        keyPoints.push({
          type: 'list',
          lineIndex: index,
          content: line.trim()
        });
      }
      // 识别代码块开始
      else if (line.match(/^```/)) {
        keyPoints.push({
          type: 'codeblock',
          lineIndex: index,
          content: line.trim()
        });
      }
      // 识别引用块
      else if (line.match(/^>/)) {
        keyPoints.push({
          type: 'blockquote',
          lineIndex: index,
          content: line.trim()
        });
      }
      // 识别水平线
      else if (line.match(/^(---|\*\*\*|___)/)) {
        keyPoints.push({
          type: 'hr',
          lineIndex: index,
          content: line.trim()
        });
      }
      // 识别段落开始（空行后的第一行文本）
      else if (index > 0 && lines[index - 1].trim() === '' && line.trim() !== '') {
        keyPoints.push({
          type: 'paragraph',
          lineIndex: index,
          content: line.trim()
        });
      }
    });
    
    return keyPoints;
  };

  // 2. 在预览窗口中找到对应的 DOM 元素
  const findPreviewElements = (keyPoints) => {
    const previewElement = previewRef.current;
    if (!previewElement) return [];
    
    const previewContent = previewElement.querySelector('.preview-content');
    if (!previewContent) return [];
    
    return keyPoints.map(keyPoint => {
      let selector;
      
      switch (keyPoint.type) {
        case 'heading':
          selector = `h${keyPoint.level}`;
          break;
        case 'list':
          selector = keyPoint.content.match(/^\d+\./) ? 'ol > li' : 'ul > li';
          break;
        case 'codeblock':
          selector = 'pre > code';
          break;
        case 'blockquote':
          selector = 'blockquote';
          break;
        case 'hr':
          selector = 'hr';
          break;
        case 'paragraph':
          selector = 'p';
          break;
        default:
          return null;
      }
      
      // 查找所有匹配的元素
      const elements = Array.from(previewContent.querySelectorAll(selector));
      
      // 尝试通过内容匹配找到正确的元素
      // 这里使用简化的匹配逻辑，实际应用中可能需要更复杂的匹配算法
      const matchedElement = elements.find(el => {
        const elementText = el.textContent.trim();
        const keyPointContent = keyPoint.content.replace(/^[#>*\-+\d.`\s]+/, '').trim();
        return elementText.includes(keyPointContent) || keyPointContent.includes(elementText);
      });
      
      return {
        keyPoint,
        element: matchedElement || elements[0] // 如果找不到匹配的，使用第一个元素
      };
    }).filter(item => item.element); // 过滤掉没有找到对应元素的项
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
  const handleTemplateChange = (templateId) => {
    setCurrentTemplate(templateId);
    const newConfig = {
      ...styleConfig,
      ...styleTemplates[templateId].styles
    };
    setStyleConfig(newConfig);
    
    // 生成新的 CSS 并更新
    const newCSS = generateCSS(newConfig);
    updateStyle(newCSS);
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
                    }
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
                    {Object.entries(styleTemplates).map(([id, template]) => (
                      <option key={id} value={id}>
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
                      <optgroup label={`${t.systemFonts} ${t.wechatSupported}`}>
                        <option value="'Microsoft YaHei', -apple-system, sans-serif">{t.microsoftYahei}</option>
                        <option value="SimSun, serif">{t.simsun}</option>
                        <option value="STHeiti, sans-serif">{t.stheiti}</option>
                      </optgroup>
                      <optgroup label={`${t.genericFonts} ${t.wechatSupported}`}>
                        <option value="sans-serif">{t.sansSerif}</option>
                        <option value="serif">{t.serif}</option>
                      </optgroup>
                      <optgroup label={t.otherFonts}>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Open Sans', sans-serif">Open Sans</option>
                        <option value="'Lato', sans-serif">Lato</option>
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Playfair Display', serif">Playfair Display</option>
                        <option value="'Noto Sans SC', sans-serif">思源黑体 (Noto Sans SC)</option>
                        <option value="'Noto Serif SC', serif">思源宋体 (Noto Serif SC)</option>
                        <option value="'ZCOOL XiaoWei', serif">站酷小薇 (ZCOOL XiaoWei)</option>
                        <option value="'ZCOOL QingKe HuangYou', cursive">站酷庆科黄油体 (ZCOOL QingKe HuangYou)</option>
                        <option value="'Ma Shan Zheng', cursive">马善政楷体 (Ma Shan Zheng)</option>
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