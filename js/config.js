// 網站的固定參數列表
export const CONFIG = {
  // 動畫參數
  ANIMATION: {
    // Hero 區域
    HERO_TITLE_DURATION: 1,           // Hero標題的動畫時間
    HERO_BUTTONS_DURATION: 0.6,       // Hero按鈕的動畫時間
    HERO_BUTTONS_DELAY: 0.5,          // Hero按鈕的動畫延遲
    FLOATING_ICON_DURATION: 2,        // floating icon單次動畫時間
    FLOATING_ICON_STAGGER: 0.3,       // floating icon之間的動畫錯開時間


    // 頁面滾動
    SCROLL_DURATION: 2,               // 平滑滾動到區塊的動畫時間
    SCROLL_OFFSET_Y: 60,              // 平滑滾動的垂直偏移量 (避免被導覽列擋住)

    // Doodo 背景
    DOODO_ROTATION_DURATION: 30,      // Doodo 背景旋轉一圈的時間

    // 區塊進場動畫
    SECTION_ANIMATION_DURATION: 1.2,  // 通用區塊進場動畫的時間
    SECTION_ANIMATION_DELAY: 0.3,     // 通用區塊進場動畫的延遲
    TECH_STACK_DURATION: 1.8,         // 技術棧區塊的動畫總時間
    TECH_STACK_STAGGER: 0.15,         // 技術棧項目之間的動畫錯開時間
    PORTFOLIO_STAGGER: 0.15,          // 作品集卡片之間的動畫錯開時間

    // 技術項目懸停效果
    TECH_HOVER_DURATION: 0.25,         // 懸停動畫時間
    TECH_HOVER_SCALE: 1.02,           // 懸停時卡片的放大比例
    TECH_HOVER_Y: -6,                 // 懸停時卡片的向上位移量
    ICON_HOVER_SCALE: 1.1,            // 懸停時圖示的放大比例
    ICON_HOVER_ROTATION: 5,           // 懸停時圖示的旋轉角度
  },

  // 輪播列表設定
  CAROUSEL: {
    AUTO_SCROLL_DURATION: 60,         // 自動輪播一整輪所需時間 (秒)
    DRAG_SENSITIVITY: 1.2,            // 拖曳的靈敏度
    RESUME_DELAY: 1000,               // 停止手動操作後，恢復自動輪播的延遲 (毫秒)
    INDICATOR_ANIMATION_DURATION: 0.8,// 點擊指示器時的動畫時間
    MOMENTUM_MULTIPLIER: 12,          // 拖曳放開後的慣性乘數
    DRAG_THRESHOLD_PX: 5              // 觸發拖曳所需的最小移動距離 (像素)
  },

  // ScrollTrigger 滾動觸發設定
  SCROLL_TRIGGER: {
    ABOUT_START: "top 75%",           // 「關於我」區塊的觸發點
    PORTFOLIO_START: "top 75%",       // 「作品集」區塊的觸發點
    TECH_STACK_START: "top 90%",      // 「技術棧」區塊的觸發點
    CONTACT_START: "top bottom-=100px",         // 「聯絡資訊」區塊的觸發點
  },

  HERO_SETTINGS: {
    JOB_TITLES: ["JAVA", "Python", "SQL", "Go", "Swift"]
  },
  // 作品集數據
  PORTFOLIO_PROJECTS: [
    {
      id: "parking-lot",
      title: "停車場管理系統",
      description: "現代化的停車場管理系統，具備完整的車輛管理、支付系統與後台管理功能。",
      image: "../assets/parking-lot-admin.png",
      link: "https://github.com/tche0043/parking-lot-management-system",
      technologies: ["Python Flask", "HTML", "CSS", "JS", "Bootstrap", "SQL Server"],
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
      id: "asset-tracker",
      title: "個人資產追蹤系統",
      description: "個人資產追蹤系統，支援多種資產類型的價值趨勢紀錄。",
      image: "../assets/asset-tracker.png",
      link: "https://github.com/tche0043/AssetTracker",
      technologies: ["HTML", "CSS", "JS", "Bootstrap", "Python Django", "postgreSQL", "Docker"],
    },
  ],

  // 技術棧數據
  TECH_STACKS: [
    { name: "HTML", icon: "<img src='assets/html5-logo.svg' class='icon-lg'/>" },
    { name: "CSS", icon: "<img src='assets/css-logo.svg' class='icon-lg'/>" },
    { name: "JavaScript", icon: "<img src='assets/javascript-logo.svg' class='icon-lg'/>" },
    { name: "Java", icon: "<img src='assets/java-logo.svg' class='icon-lg'/>" },
    { name: "Python", icon: "<img src='assets/python-logo.svg' class='icon-lg'/>" },
    { name: "Go", icon: "<img src='assets/golang-logo.svg' class='icon-lg'/>" },
    { name: "Swift", icon: "<img src='assets/swift-logo.svg' class='icon-lg'/>" },
    { name: "R", icon: "<img src='assets/r-logo.svg' class='icon-lg'/>" },
    { name: "SQL SERVER", icon: "<img src='assets/sqlserver-logo.svg' class='icon-lg'/>" },
    { name: "MongoDB", icon: "<img src='assets/mongodb-logo.svg' class='icon-lg'/>" },
    { name: "Git", icon: "<img src='assets/git-logo.svg' class='icon-lg'/>" },
    { name: "Docker", icon: "<img src='assets/docker-logo.svg' class='icon-lg'/>" },
  ],

  // JS 中會用到的 CSS 顏色
  COLORS: {
    CYAN_400: "#22d3ee",
    WHITE: "#ffffff",
  },

  // 統一管理的 CSS 選擇器
  SELECTORS: {
    // 導覽列
    NAV_TOGGLE: ".nav-toggle",               // 導覽列漢堡/X 按鈕
    NAV_MENU: ".nav-menu",                 // 導覽列選單
    NAV_LINKS: ".nav-link",                // 導覽列中的連結

    // Hero 區域
    HERO_TITLE: ".hero-title",               // Hero標題
    HERO_BUTTONS: ".hero-buttons",             // Hero標題下方按鈕
    FLOATING_ICONS: ".floating-icon",        // floating icon的開發圖示
    DOODO_BACKGROUND: ".doodo-background",   // Doodo 旋轉背景
    JOB_TITLE: ".job-title",                 // 職稱輪播文字

    // 關於我區塊
    PROFILE_CARD: ".profile-card",           // 個人資料卡片
    ABOUT_TEXT: ".about-text",               // 「關於我」的文字區塊

    // 作品集區塊
    PORTFOLIO_CAROUSEL: ".portfolio-carousel",   // 輪播的滾動容器
    PORTFOLIO_CARDS: ".portfolio-card",        // 輪播中的每一張卡片
    PORTFOLIO_CONTAINER: ".portfolio-carousel-container", // 輪播的整體容器
    INDICATORS: ".portfolio-indicators .indicator", // 輪播指示器 (小圓點)

    // 技術棧區塊
    TECH_GRID: "#tech-stack .tech-grid",   // 技術棧的網格容器
    TECH_ITEMS: ".tech-item",                // 每一項技術項目

    // 聯絡資訊區塊
    CONTACT_INFO_LIST: ".contact-info-list", // 聯絡資訊列表
  },
};