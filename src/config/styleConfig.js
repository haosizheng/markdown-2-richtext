// 标题大小预设
export const headingSizePresets = {
  large: {
    h1: '32px',
    h2: '28px',
    h3: '24px'
  },
  medium: {
    h1: '28px',
    h2: '24px',
    h3: '20px'
  },
  small: {
    h1: '24px',
    h2: '20px',
    h3: '16px'
  }
};

// 默认值配置
export const defaultValues = {
  global: {
    fontFamily: "SimSun, serif",
    letterSpacing: '0px',
    lineHeight: '1.6',
    paragraphSpacing: '16px',
    headingAlign: 'left',
    headingColor: '#000000',
    headingSize: 'medium'
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
    borderColor: '#cccccc',
    backgroundColor: '#f9f9f9'
  },
  code: {
    color: '#333333',
    fontSize: '14px',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Monaco', monospace"
  }
};

// 样式模板配置
export const styleTemplates = {
  default: {
    nameKey: "templateDefault",
    styles: {
      global: {
        fontFamily: "SimSun, serif",
        letterSpacing: "0px",
        lineHeight: "1.6",
        paragraphSpacing: "16px",
        headingAlign: "left",
        headingColor: "#000000",
        headingSize: "medium"
      },
      paragraph: { color: '#000000', fontSize: '16px' },
      bold: { color: '#000000' },
      blockquote: {
        color: '#666666',
        fontSize: '16px',
        borderColor: '#cccccc',
        backgroundColor: '#f9f9f9'
      },
      code: {
        color: '#333333',
        fontSize: '14px',
        backgroundColor: '#f5f5f5',
        fontFamily: "'Monaco', monospace"
      }
    }
  },
  tech: {
    nameKey: "templateTech",
    styles: {
      global: {
        fontFamily: "'Noto Sans SC', sans-serif",
        letterSpacing: "0.5px",
        lineHeight: "1.7",
        paragraphSpacing: "20px",
        headingAlign: "left",
        headingColor: "#1a73e8"
      },
      paragraph: { color: '#444444', fontSize: '15px' },
      bold: { color: '#1a73e8' },
      blockquote: {
        color: '#555555',
        fontSize: '15px',
        borderColor: '#1a73e8',
        backgroundColor: '#f8f9fa'
      },
      code: {
        color: '#24292e',
        fontSize: '14px',
        backgroundColor: '#f6f8fa',
        fontFamily: "'Monaco', monospace"
      }
    }
  },
  literary: {
    nameKey: "templateLiterary",
    styles: {
      global: {
        fontFamily: "'Noto Serif SC', serif",
        letterSpacing: "1px",
        lineHeight: "1.8",
        paragraphSpacing: "24px",
        headingAlign: "left",
        headingColor: "#c0392b"
      },
      paragraph: { color: '#2c3e50', fontSize: '16px' },
      bold: { color: '#c0392b' },
      blockquote: {
        color: '#7f8c8d',
        fontSize: '16px',
        borderColor: '#e74c3c',
        backgroundColor: '#fdf5f5'
      },
      code: {
        color: '#7f8c8d',
        fontSize: '15px',
        backgroundColor: '#f9f9f9',
        fontFamily: "'Monaco', monospace"
      }
    }
  },
  business: {
    nameKey: "templateBusiness",
    styles: {
      global: {
        fontFamily: "STHeiti, sans-serif",
        letterSpacing: "0.3px",
        lineHeight: "1.6",
        paragraphSpacing: "20px",
        headingAlign: "left",
        headingColor: "#1e3a8a"
      },
      paragraph: { color: '#333333', fontSize: '15px' },
      bold: { color: '#1e3a8a' },
      blockquote: {
        color: '#666666',
        fontSize: '15px',
        borderColor: '#1e3a8a',
        backgroundColor: '#f8fafc'
      },
      code: {
        color: '#475569',
        fontSize: '14px',
        backgroundColor: '#f1f5f9',
        fontFamily: "'Monaco', monospace"
      }
    }
  },
  media: {
    nameKey: "templateMedia",
    styles: {
      global: {
        fontFamily: "'ZCOOL XiaoWei', serif",
        letterSpacing: "0.5px",
        lineHeight: "1.8",
        paragraphSpacing: "24px",
        headingAlign: "left",
        headingColor: "#ff6b6b"
      },
      paragraph: { color: '#2d3436', fontSize: '16px' },
      bold: { color: '#ff6b6b' },
      blockquote: {
        color: '#636e72',
        fontSize: '16px',
        borderColor: '#ff6b6b',
        backgroundColor: '#fff8f8'
      },
      code: {
        color: '#2d3436',
        fontSize: '14px',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Monaco', monospace"
      }
    }
  },
  modernMinimal: {
    nameKey: "templateModernMinimal",
    styles: {
      global: {
        fontFamily: "'Roboto', 'Noto Sans SC', sans-serif",
        letterSpacing: "0.2px",
        lineHeight: "1.5",
        paragraphSpacing: "20px",
        headingAlign: "left",
        headingColor: "#2d3436",
        headingSize: "medium"
      },
      paragraph: { 
        color: '#4a4a4a', 
        fontSize: '15px',
        textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.05)' 
      },
      bold: { 
        color: '#2d3436',
        fontWeight: '700' 
      },
      blockquote: {
        color: '#666666',
        fontSize: '15px',
        borderColor: '#e0e0e0',
        backgroundColor: '#ffffff',
        borderLeft: '4px solid #e0e0e0',
        padding: '12px 20px'
      },
      code: {
        color: '#3d3d3d',
        fontSize: '13px',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Fira Code', 'Monaco', monospace",
        borderRadius: '4px'
      }
    }
  },
  softElegance: {
    nameKey: "templateSoftElegance",
    styles: {
      global: {
        fontFamily: "'Lora', 'Noto Serif SC', serif",
        letterSpacing: "0.3px",
        lineHeight: "1.8",
        paragraphSpacing: "24px",
        headingAlign: "center",
        headingColor: "#6c5b7b",
        headingSize: "large"
      },
      paragraph: { 
        color: '#4a4a4a',
        fontSize: '16px',
        textIndent: '2em' 
      },
      bold: { 
        color: '#6c5b7b',
        fontStyle: 'italic' 
      },
      blockquote: {
        color: '#7a7a7a',
        fontSize: '16px',
        borderColor: '#e6d0de',
        backgroundColor: '#fcf8fb',
        fontFamily: "'Playfair Display', 'Noto Serif SC', serif"
      },
      code: {
        color: '#8a4b7c',
        fontSize: '14px',
        backgroundColor: '#f9f2f7',
        fontFamily: "'Courier Prime', 'Monaco', monospace",
        border: '1px solid #f0d8e8'
      }
    }
  },
  darkMatrix: {
    nameKey: "templateDarkMatrix",
    styles: {
      global: {
        fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
        letterSpacing: "0.1px",
        lineHeight: "1.6",
        paragraphSpacing: "18px",
        headingAlign: "left",
        headingColor: "#64ffda",
        backgroundColor: "#1a1a1a"
      },
      paragraph: { 
        color: '#b0b0b0',
        fontSize: '14px',
        textShadow: '0 0 2px rgba(100,255,218,0.1)' 
      },
      bold: { 
        color: '#64ffda',
        textShadow: '0 0 4px rgba(100,255,218,0.3)' 
      },
      blockquote: {
        color: '#888888',
        fontSize: '14px',
        borderColor: '#64ffda',
        backgroundColor: '#252525',
        borderLeft: '3px solid'
      },
      code: {
        color: '#64ffda',
        fontSize: '13px',
        backgroundColor: '#2d2d2d',
        fontFamily: "'JetBrains Mono', 'Monaco', monospace",
        border: '1px solid #3d3d3d'
      }
    }
  },
  natureInspired: {
    nameKey: "templateNatureInspired",
    styles: {
      global: {
        fontFamily: "'Open Sans', 'Noto Sans SC', sans-serif",
        letterSpacing: "0.4px",
        lineHeight: "1.7",
        paragraphSpacing: "22px",
        headingAlign: "left",
        headingColor: "#2e7d32",
        headingSize: "medium"
      },
      paragraph: { 
        color: '#3d3d3d',
        fontSize: '15px',
        lineHeight: '1.8' 
      },
      bold: { 
        color: '#2e7d32',
        textDecoration: 'underline dotted' 
      },
      blockquote: {
        color: '#558b2f',
        fontSize: '15px',
        borderColor: '#a5d6a7',
        backgroundColor: '#f1f8e9',
        fontStyle: 'italic'
      },
      code: {
        color: '#1b5e20',
        fontSize: '14px',
        backgroundColor: '#e8f5e9',
        fontFamily: "'Source Code Pro', 'Monaco', monospace",
        boxShadow: '1px 1px 3px rgba(0,0,0,0.1)'
      }
    }
  },
  vintageRetro: {
    nameKey: "templateVintageRetro",
    styles: {
      global: {
        fontFamily: "'Playfair Display', 'Noto Serif SC', serif",
        letterSpacing: "0.5px",
        lineHeight: "1.6",
        paragraphSpacing: "20px",
        headingAlign: "right",
        headingColor: "#d35400",
        headingSize: "medium"
      },
      paragraph: { 
        color: '#4a3123',
        fontSize: '15px',
        textAlign: 'justify' 
      },
      bold: { 
        color: '#d35400',
        textShadow: '1px 1px 2px rgba(211,84,0,0.2)' 
      },
      blockquote: {
        color: '#8d6e63',
        fontSize: '15px',
        borderColor: '#d35400',
        backgroundColor: '#fff3e0',
        fontFamily: "'Cinzel', 'Noto Serif SC', serif"
      },
      code: {
        color: '#6d4c41',
        fontSize: '14px',
        backgroundColor: '#f5e6d3',
        fontFamily: "'Cutive Mono', 'Monaco', monospace",
        border: '1px dashed #d35400'
      }
    }
  }
}; 