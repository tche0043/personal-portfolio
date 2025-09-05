// Configuration constants for the portfolio website
// This centralizes all hardcoded values for easier maintenance

export const CONFIG = {
  // Animation durations and settings
  ANIMATION: {
    HERO_TITLE_DURATION: 1,
    HERO_BUTTONS_DURATION: 0.6,
    HERO_BUTTONS_DELAY: -0.3,
    SCROLL_DURATION: 2,
    SCROLL_OFFSET_Y: 60,
    FLOATING_ICON_DURATION: 2,
    FLOATING_ICON_STAGGER: 0.3,
    DOODO_ROTATION_DURATION: 30,
    SECTION_ANIMATION_DURATION: 1.2, // ★ About 區域動畫持續時間
    SECTION_ANIMATION_DELAY: 0.3, // ★ About 區域延遲時間
    TECH_STACK_DURATION: 1.8, // ★ 新增：Tech Stack 動畫持續時間
    TECH_STACK_STAGGER: 0.15, // ★ 新增：Tech Stack 動畫間隔
    PORTFOLIO_DURATION: 1.2, // ★ 新增：Portfolio 動畫持續時間
    PORTFOLIO_STAGGER: 0.15, // ★ 新增：Portfolio 動畫間隔
    TECH_HOVER_DURATION: 0.3,
    TECH_HOVER_SCALE: 1.02,
    TECH_HOVER_Y: -6,
    ICON_HOVER_SCALE: 1.1,
    ICON_HOVER_ROTATION: 5,
  },

  // Carousel settings
  CAROUSEL: {
    MOBILE_CARD_WIDTH: 280,
    DESKTOP_CARD_WIDTH: 350,
    GAP: {
      MOBILE: 24,
      DESKTOP: 32,
    },
    AUTO_SCROLL_DURATION: 60,
    DRAG_SENSITIVITY: 1.2,
    RESUME_DELAY:1000,
    INDICATOR_ANIMATION_DURATION: 0.8,
  },

  // Responsive breakpoints
  BREAKPOINTS: {
    MOBILE_MAX: 767,
    TABLET_MIN: 768,
    TABLET_MAX: 1023,
    DESKTOP_MIN: 1024,
    DESKTOP_MAX: 1511,
    LARGE_DESKTOP_MIN: 1512,
  },

  // ScrollTrigger settings
  SCROLL_TRIGGER: {
    START_POSITION: "top 90%",
    END_POSITION: "bottom 20%",
    TOGGLE_ACTIONS: "play none none none",
    REVERSE_TOGGLE_ACTIONS: "play none none reverse",
    // ★ 新增：各區域特定觸發位置
    ABOUT_START: "top 75%",
    PORTFOLIO_START: "top 75%",
    TECH_STACK_START: "top 90%",
    CONTACT_START: "top 80%",
  },

  // Portfolio data - 作品集數據
  PORTFOLIO_PROJECTS: [
    {
      id: "parking-lot",
      title: "停車場管理系統",
      description:
        "現代化的停車場管理系統，具備完整的車輛管理、支付系統與後台管理功能。",
      image: "../assets/parking-lot-admin.png",
      link: "https://github.com/tche0043/parking-lot-management-system",
      technologies: [
        "Python Flask",
        "HTML",
        "CSS",
        "JS",
        "Bootstrap",
        "SQL Server",
      ],
    },
    {
      id: "personal-portfolio",
      title: "個人作品集網站",
      description: "展示個人技能與專案經驗的網站，結合現代設計與互動效果。",
      image: "../assets/personal-portfolio.png",
      link: "https://github.com/tche0043/personal-portfolio",
      technologies: ["HTML", "CSS", "JS", "GSAP"],
    },
    {
      id: "mobile-app",
      title: "行動應用程式",
      description: "跨平台行動應用，提供流暢的使用者體驗與即時通訊功能",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop",
      link: "#",
      technologies: ["React Native", "Firebase", "Redux", "WebRTC"],
    },
    {
      id: "dashboard",
      title: "數據分析儀表板",
      description: "即時數據視覺化平台，支援多種圖表類型與自定義報表生成",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
      link: "#",
      technologies: ["D3.js", "Python", "PostgreSQL"],
    },
  ],

  // Tech stack data - Java軟體工程師技術棧
  TECH_STACKS: [
    {
      name: "HTML",
      icon: "<img src='assets/html5-logo.svg' class='icon-lg'/>",
    },
    {
      name: "CSS",
      icon: "<img src='assets/css-logo.svg' class='icon-lg'/>",
    },
    {
      name: "JavaScript",
      icon: "<img src='assets/javascript-logo.svg' class='icon-lg'/>",
    },
    {
      name: "Java",
      icon: "<img src='assets/java-logo.svg' class='icon-lg'/>",
    },
    {
      name: "Python",
      icon: "<img src='assets/python-logo.svg' class='icon-lg'/>",
    },
    {
      name: "Go",
      icon: "<img src='assets/golang-logo.svg' class='icon-lg'/>",
    },
    {
      name: "Swift",
      icon: "<img src='assets/swift-logo.svg' class='icon-lg'/>",
    },
    {
      name: "R",
      icon: "<img src='assets/r-logo.svg' class='icon-lg'/>",
    },
    {
      name: "SQL SERVER",
      icon: "<img src='assets/sqlserver-logo.svg' class='icon-lg'/>",
    },
    {
      name: "MongoDB",
      icon: "<img src='assets/mongodb-logo.svg' class='icon-lg'/>",
    },
    {
      name: "Git",
      icon: "<img src='assets/git-logo.svg' class='icon-lg'/>",
    },
    {
      name: "Docker",
      icon: "<img src='assets/docker-logo.svg' class='icon-lg'/>",
    },
  ],

  // CSS color variables (for JS animations)
  COLORS: {
    CYAN_400: "#22d3ee",
    CYAN_500: "#06b6d4",
    BLUE_400: "#60a5fa",
    BLUE_500: "#3b82f6",
    PURPLE_400: "#c084fc",
    WHITE: "#ffffff",
    SLATE_600: "#475569",
    SLATE_700: "#334155",
    SLATE_800: "#1e293b",
  },

  // Performance settings
  PERFORMANCE: {
    MOUSE_THROTTLE: true,
    USE_TRANSFORM_3D: true,
    WILL_CHANGE_ELEMENTS: [".floating-icon", ".doodo-background"],
    STAGGER_ANIMATIONS: true,
  },

  // Selectors (commonly used)
  SELECTORS: {
    NAV_TOGGLE: ".nav-toggle",
    NAV_MENU: ".nav-menu",
    NAV_LINKS: ".nav-link",
    HERO_TITLE: ".hero-title",
    HERO_BUTTONS: ".hero-buttons",
    FLOATING_ICONS: ".floating-icon",
    DOODO_BACKGROUND: ".doodo-background",
    PORTFOLIO_CAROUSEL: ".portfolio-carousel",
    PORTFOLIO_CARDS: ".portfolio-card",
    PORTFOLIO_CONTAINER: ".portfolio-carousel-container",
    INDICATORS: ".portfolio-indicators .indicator",
    TECH_GRID: "#tech-stack .tech-grid",
    TECH_ITEMS: ".tech-item",
  },
};

// Utility functions for responsive calculations
export const UTILS = {
  // Check if current viewport is mobile
  isMobile: () => window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE_MAX,

  // Check if current viewport is tablet
  isTablet: () =>
    window.innerWidth >= CONFIG.BREAKPOINTS.TABLET_MIN &&
    window.innerWidth <= CONFIG.BREAKPOINTS.TABLET_MAX,

  // Check if current viewport is desktop
  isDesktop: () => window.innerWidth >= CONFIG.BREAKPOINTS.DESKTOP_MIN,

  // Get card width based on viewport
  getCardWidth: () =>
    UTILS.isMobile()
      ? CONFIG.CAROUSEL.MOBILE_CARD_WIDTH
      : CONFIG.CAROUSEL.DESKTOP_CARD_WIDTH,

  // Get gap based on viewport
  getGap: () =>
    UTILS.isMobile() ? CONFIG.CAROUSEL.GAP.MOBILE : CONFIG.CAROUSEL.GAP.DESKTOP,

  // Throttle function for performance
  throttle: (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  },
};
