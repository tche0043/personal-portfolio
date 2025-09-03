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
    SECTION_ANIMATION_DURATION: 1,
    SECTION_ANIMATION_DELAY: 0.3,
    TECH_HOVER_DURATION: 0.3,
    TECH_HOVER_SCALE: 1.02,
    TECH_HOVER_Y: -6,
    ICON_HOVER_SCALE: 1.1,
    ICON_HOVER_ROTATION: 5,
    SVG_PATH_DURATION_1: 3,
    SVG_PATH_DURATION_2: 4,
    SVG_PATH_DELAY: 1
  },

  // Carousel settings
  CAROUSEL: {
    MOBILE_CARD_WIDTH: 280,
    DESKTOP_CARD_WIDTH: 350,
    GAP: {
      MOBILE: 24,
      DESKTOP: 32
    },
    AUTO_SCROLL_DURATION: 60,
    DRAG_SENSITIVITY: 0.5,
    RESUME_DELAY: 3000,
    INDICATOR_ANIMATION_DURATION: 0.8
  },

  // Responsive breakpoints
  BREAKPOINTS: {
    MOBILE_MAX: 767,
    TABLET_MIN: 768,
    TABLET_MAX: 1023,
    DESKTOP_MIN: 1024,
    DESKTOP_MAX: 1511,
    LARGE_DESKTOP_MIN: 1512
  },

  // ScrollTrigger settings
  SCROLL_TRIGGER: {
    START_POSITION: "top 80%",
    END_POSITION: "bottom 20%",
    TOGGLE_ACTIONS: "play none none none",
    REVERSE_TOGGLE_ACTIONS: "play none none reverse"
  },

  // Tech stack data - Java軟體工程師技術棧
  TECH_STACKS: [
    { name: "Java", color: "from-orange-500 to-red-600", icon: "☕" },
    { name: "Spring Boot", color: "from-green-400 to-green-600", icon: "🍃" },
    { name: "Spring Security", color: "from-green-500 to-green-700", icon: "🔐" },
    { name: "MySQL", color: "from-blue-500 to-blue-700", icon: "🐬" },
    { name: "PostgreSQL", color: "from-blue-600 to-indigo-600", icon: "🐘" },
    { name: "Docker", color: "from-blue-400 to-blue-600", icon: "🐳" },
    { name: "AWS", color: "from-orange-400 to-orange-500", icon: "☁️" },
    { name: "Git", color: "from-gray-600 to-gray-800", icon: "📝" },
    { name: "Maven", color: "from-purple-500 to-purple-700", icon: "🏗️" },
    { name: "JUnit", color: "from-red-400 to-red-600", icon: "🧪" },
    { name: "Redis", color: "from-red-500 to-red-600", icon: "🔴" },
    { name: "Microservices", color: "from-cyan-400 to-cyan-600", icon: "🔧" }
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
    SLATE_800: "#1e293b"
  },

  // Performance settings
  PERFORMANCE: {
    MOUSE_THROTTLE: true,
    USE_TRANSFORM_3D: true,
    WILL_CHANGE_ELEMENTS: ['.floating-icon', '.doodo-background', '.orb'],
    STAGGER_ANIMATIONS: true
  },

  // Selectors (commonly used)
  SELECTORS: {
    NAV_TOGGLE: '.nav-toggle',
    NAV_MENU: '.nav-menu',
    NAV_LINKS: '.nav-link',
    HERO_TITLE: '.hero-title',
    HERO_BUTTONS: '.hero-buttons',
    FLOATING_ICONS: '.floating-icon',
    DOODO_BACKGROUND: '.doodo-background',
    PORTFOLIO_CAROUSEL: '.portfolio-carousel',
    PORTFOLIO_CARDS: '.portfolio-card',
    PORTFOLIO_CONTAINER: '.portfolio-carousel-container',
    INDICATORS: '.portfolio-indicators .indicator',
    TECH_GRID: '#tech-stack .tech-grid',
    TECH_ITEMS: '.tech-item'
  }
};

// Utility functions for responsive calculations
export const UTILS = {
  // Check if current viewport is mobile
  isMobile: () => window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE_MAX,
  
  // Check if current viewport is tablet
  isTablet: () => window.innerWidth >= CONFIG.BREAKPOINTS.TABLET_MIN && 
                  window.innerWidth <= CONFIG.BREAKPOINTS.TABLET_MAX,
  
  // Check if current viewport is desktop
  isDesktop: () => window.innerWidth >= CONFIG.BREAKPOINTS.DESKTOP_MIN,
  
  // Get card width based on viewport
  getCardWidth: () => UTILS.isMobile() ? 
    CONFIG.CAROUSEL.MOBILE_CARD_WIDTH : CONFIG.CAROUSEL.DESKTOP_CARD_WIDTH,
  
  // Get gap based on viewport
  getGap: () => UTILS.isMobile() ? 
    CONFIG.CAROUSEL.GAP.MOBILE : CONFIG.CAROUSEL.GAP.DESKTOP,
  
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
  }
};