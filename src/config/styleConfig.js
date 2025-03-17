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
    borderColor: '#ccc',
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
        borderColor: '#ccc',
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
  }
}; 