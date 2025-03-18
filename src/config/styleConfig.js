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
        fontFamily: "'Microsoft YaHei', -apple-system, sans-serif",
        letterSpacing: "0.5px",
        lineHeight: "1.75",
        paragraphSpacing: "16px",
        headingAlign: "left",
        headingColor: "#2c3e50",
        headingSize: "medium"
      },
      paragraph: { color: '#333333', fontSize: '15px' },
      bold: { color: '#2c3e50' },
      blockquote: {
        color: '#666666',
        fontSize: '15px',
        borderColor: '#dcdcdc',
        backgroundColor: '#eef1f5'
      },
      code: {
        color: '#333333',
        fontSize: '14px',
        backgroundColor: '#eef1f5',
        fontFamily: "'Microsoft YaHei', monospace"
      }
    }
  },

  techPro: {
    nameKey: "templateTechPro",
    styles: {
      global: {
        fontFamily: "'Microsoft YaHei', -apple-system, sans-serif",
        letterSpacing: "0.2px",
        lineHeight: "1.6",
        paragraphSpacing: "20px",
        headingAlign: "left",
        headingColor: "#0066cc",
        headingSize: "medium"
      },
      paragraph: { color: '#333333', fontSize: '15px' },
      bold: { color: '#0066cc' },
      blockquote: {
        color: '#555555',
        fontSize: '14px',
        borderColor: '#0066cc',
        backgroundColor: '#e6f0fa'
      },
      code: {
        color: '#0066cc',
        fontSize: '14px',
        backgroundColor: '#e6f0fa',
        fontFamily: "'Microsoft YaHei', monospace"
      }
    }
  },

  elegantSerif: {
    nameKey: "templateElegantSerif",
    styles: {
      global: {
        fontFamily: "serif",
        letterSpacing: "0.3px",
        lineHeight: "1.8",
        paragraphSpacing: "24px",
        headingAlign: "center",
        headingColor: "#6b4c4c",
        headingSize: "large"
      },
      paragraph: { color: '#333333', fontSize: '16px' },
      bold: { color: '#6b4c4c' },
      blockquote: {
        color: '#666666',
        fontSize: '16px',
        borderColor: '#d4b8b8',
        backgroundColor: '#f0e8e8'
      },
      code: {
        color: '#6b4c4c',
        fontSize: '15px',
        backgroundColor: '#f0e8e8',
        fontFamily: "'Microsoft YaHei', monospace"
      }
    }
  },

  modernBusiness: {
    nameKey: "templateModernBusiness",
    styles: {
      global: {
        fontFamily: "'PingFang SC', -apple-system, sans-serif",
        letterSpacing: "0.2px",
        lineHeight: "1.7",
        paragraphSpacing: "20px",
        headingAlign: "left",
        headingColor: "#1a365d",
        headingSize: "medium"
      },
      paragraph: { color: '#2d3748', fontSize: '15px' },
      bold: { color: '#1a365d' },
      blockquote: {
        color: '#4a5568',
        fontSize: '15px',
        borderColor: '#1a365d',
        backgroundColor: '#e2eaf2'
      },
      code: {
        color: '#1a365d',
        fontSize: '14px',
        backgroundColor: '#e2eaf2',
        fontFamily: "'PingFang SC', monospace"
      }
    }
  },

  youthVibe: {
    nameKey: "templateYouthVibe",
    styles: {
      global: {
        fontFamily: "'Microsoft YaHei', -apple-system, sans-serif",
        letterSpacing: "0.3px",
        lineHeight: "1.75",
        paragraphSpacing: "22px",
        headingAlign: "left",
        headingColor: "#6366f1",
        headingSize: "medium"
      },
      paragraph: { 
        color: '#374151', 
        fontSize: '15px' 
      },
      bold: { 
        color: '#6366f1' 
      },
      blockquote: {
        color: '#4f46e5',
        fontSize: '15px',
        borderColor: '#818cf8',
        backgroundColor: '#e4e7f5',
        borderLeft: '4px solid'
      },
      code: {
        color: '#4f46e5',
        fontSize: '14px',
        backgroundColor: '#e4e7f5',
        fontFamily: "'Microsoft YaHei', monospace",
        borderRadius: '4px'
      }
    }
  },

  minimalDark: {
    nameKey: "templateMinimalDark",
    styles: {
      global: {
        fontFamily: "'PingFang SC', -apple-system, sans-serif",
        letterSpacing: "0.2px",
        lineHeight: "1.6",
        paragraphSpacing: "20px",
        headingAlign: "left",
        headingColor: "#e2e8f0",
        headingSize: "medium",
        backgroundColor: "#1a202c"
      },
      paragraph: { color: '#cbd5e0', fontSize: '15px' },
      bold: { color: '#e2e8f0' },
      blockquote: {
        color: '#a0aec0',
        fontSize: '15px',
        borderColor: '#2d3748',
        backgroundColor: '#3a4556'
      },
      code: {
        color: '#e2e8f0',
        fontSize: '14px',
        backgroundColor: '#3a4556',
        fontFamily: "'PingFang SC', monospace"
      }
    }
  },

  chineseStyle: {
    nameKey: "templateChineseStyle",
    styles: {
      global: {
        fontFamily: "serif",
        letterSpacing: "1px",
        lineHeight: "2",
        paragraphSpacing: "24px",
        headingAlign: "center",
        headingColor: "#8b4513",
        headingSize: "large"
      },
      paragraph: { color: '#333333', fontSize: '16px' },
      bold: { color: '#8b4513' },
      blockquote: {
        color: '#8b4513',
        fontSize: '16px',
        borderColor: '#d2691e',
        backgroundColor: '#f5e8d7'
      },
      code: {
        color: '#8b4513',
        fontSize: '15px',
        backgroundColor: '#f5e8d7',
        fontFamily: "'Microsoft YaHei', monospace"
      }
    }
  },

  cleanMinimal: {
    nameKey: "templateCleanMinimal",
    styles: {
      global: {
        fontFamily: "sans-serif",
        letterSpacing: "0.2px",
        lineHeight: "1.6",
        paragraphSpacing: "18px",
        headingAlign: "left",
        headingColor: "#1a1a1a",
        headingSize: "medium"
      },
      paragraph: { color: '#333333', fontSize: '15px' },
      bold: { color: '#1a1a1a' },
      blockquote: {
        color: '#666666',
        fontSize: '14px',
        borderColor: '#e5e5e5',
        backgroundColor: '#e8e8e8'
      },
      code: {
        color: '#1a1a1a',
        fontSize: '14px',
        backgroundColor: '#e8e8e8',
        fontFamily: "sans-serif"
      }
    }
  },

  modernMedia: {
    nameKey: "templateModernMedia",
    styles: {
      global: {
        fontFamily: "'Microsoft YaHei', -apple-system, sans-serif",
        letterSpacing: "0.3px",
        lineHeight: "1.7",
        paragraphSpacing: "22px",
        headingAlign: "left",
        headingColor: "#ff3366",
        headingSize: "medium"
      },
      paragraph: { color: '#333333', fontSize: '15px' },
      bold: { color: '#ff3366' },
      blockquote: {
        color: '#666666',
        fontSize: '15px',
        borderColor: '#ff3366',
        backgroundColor: '#f8e1e6'
      },
      code: {
        color: '#ff3366',
        fontSize: '14px',
        backgroundColor: '#f8e1e6',
        fontFamily: "'Microsoft YaHei', monospace"
      }
    }
  },

  professionalNote: {
    nameKey: "templateProfessionalNote",
    styles: {
      global: {
        fontFamily: "'PingFang SC', -apple-system, sans-serif",
        letterSpacing: "0.2px",
        lineHeight: "1.75",
        paragraphSpacing: "20px",
        headingAlign: "left",
        headingColor: "#2c5282",
        headingSize: "medium"
      },
      paragraph: { color: '#2d3748', fontSize: '15px' },
      bold: { color: '#2c5282' },
      blockquote: {
        color: '#4a5568',
        fontSize: '15px',
        borderColor: '#2c5282',
        backgroundColor: '#dce7f3'
      },
      code: {
        color: '#2c5282',
        fontSize: '14px',
        backgroundColor: '#dce7f3',
        fontFamily: "'PingFang SC', monospace"
      }
    }
  }
};