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
  position: relative;
`;

// 创建一个新的按钮样式，专门用于右上角的复制按钮
const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background-color: rgba(24, 144, 255, 0.8);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: rgba(24, 144, 255, 1);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(24, 144, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 14px;
    height: 14px;
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

// 添加回 defaultCSS 变量定义
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

// App 组件
const App = () => {
  const [toast, setToast] = useState(null);
  const [images, setImages] = useState([]); // 存储粘贴的图片
  const textareaRef = useRef(null);
  const previewRef = useRef(null);
  const isScrollingRef = useRef(false); // 防止无限循环

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
        
        // 将 h3、h4、h5、h6 转换为加粗文本
        clonedContent.querySelectorAll('h3, h4, h5, h6').forEach(header => {
          const strong = document.createElement('strong');
          strong.textContent = header.textContent;
          header.parentNode.replaceChild(strong, header);
        });
        
        // 确保图片使用完整的 URL
        clonedContent.querySelectorAll('img').forEach(img => {
          // 确保图片 src 是完整的
          if (img.alt && img.alt.startsWith('img-')) {
            const image = images.find(i => i.id === img.alt);
            if (image) {
              img.src = image.url;
            }
          }
        });
        
        tempDiv.appendChild(clonedContent);
        document.body.appendChild(tempDiv);
        
        // 选择内容
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        selection.removeAllRanges();
        selection.addRange(range);
        
        document.execCommand('copy');
        
        document.body.removeChild(tempDiv);
        selection.removeAllRanges();
        
        showToast('已复制富文本内容到剪贴板！', 'success');
      } catch (err) {
        console.error('Copy error:', err);
        showToast('复制失败，请重试', 'error');
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
      
      .preview-content img {
        display: block;
        margin: 20px auto;
        max-width: 100%;
        height: auto;
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
    
    // 添加节流函数，限制事件的触发频率
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
    
    // 监听输入框的滚动、点击和按键事件
    textarea.addEventListener('scroll', handleTextareaEvent);
    textarea.addEventListener('click', handleTextareaEvent);
    textarea.addEventListener('keyup', handleTextareaEvent);
    
    return () => {
      textarea.removeEventListener('scroll', handleTextareaEvent);
      textarea.removeEventListener('click', handleTextareaEvent);
      textarea.removeEventListener('keyup', handleTextareaEvent);
    };
  }, [markdown]);

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
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onPaste={handlePaste}
              placeholder="Enter Markdown text..."
            />
          </EditorContainer>
          
          <EditorContainer>
            <SectionTitle>
              Preview
              <HeaderCopyButton onClick={handleCopy}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy All
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
                              alt={props.alt || ''}
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
              Format Editor
              <ModeSwitch>
                Advanced Mode
                <Switch>
                  <input
                    type="checkbox"
                    checked={editorMode === 'advanced'}
                    onChange={(e) => setEditorMode(e.target.checked ? 'advanced' : 'basic')}
                  />
                  <span></span>
                </Switch>
              </ModeSwitch>
            </SectionTitle>
            
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