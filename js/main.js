// Main entry point - initializes all modules
import { Navigation } from "./navigation.js";
import { AnimationManager } from "./animations.js";
import { PortfolioCarousel } from "./carousel.js";
import { ContentManager } from "./content.js";
import { ErrorHandler } from "./utils.js";

class App {
  constructor() {
    this.navigation = null;
    this.animationManager = null;
    this.portfolioCarousel = null;
    this.contentManager = null;

    this.init();
  }

  init() {
    // 等待 DOM 加載完成
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }


  async initializeApp() {
    try {
      if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
      } else {
      console.error("GSAP library not loaded! Animations will not work.");
    }

      // 正常初始化不依賴輪播的模組
      this.contentManager = new ContentManager();
      this.navigation = new Navigation();

      // 建立輪播物件
      this.portfolioCarousel = new PortfolioCarousel();

      // 使用 await 等待輪播系統（包含圖片載入）完全準備就緒
      await this.portfolioCarousel.init();

      // 步驟 3：在輪播系統就緒後，才安全地初始化動畫管理器
      this.animationManager = new AnimationManager();

      // ★ 新增：註冊 beforeunload 事件進行清理
      this.setupCleanup();

      ErrorHandler.logInfo("App", "Portfolio website initialized successfully");
    } catch (error) {
      ErrorHandler.logError("App.initializeApp", error);
    }
  }

  // ★ 新增：設置清理機制
  setupCleanup() {
    // 頁面卸載時清理資源
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });

    // 監聽 visibilitychange 事件暫停動畫
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // 頁面隱藏時暫停動畫節省資源
        if (this.portfolioCarousel && this.portfolioCarousel.portfolioTl) {
          this.portfolioCarousel.portfolioTl.pause();
        }
      } else {
        // 頁面可見時恢復動畫
        if (this.portfolioCarousel && this.portfolioCarousel.portfolioTl) {
          this.portfolioCarousel.portfolioTl.resume();
        }
      }
    });
  }

  // ★ 新增：應用程式清理方法
  destroy() {
    try {
      // 清理各個模組
      if (this.portfolioCarousel && typeof this.portfolioCarousel.destroy === 'function') {
        this.portfolioCarousel.destroy();
      }
      
      if (this.animationManager && typeof this.animationManager.destroy === 'function') {
        this.animationManager.destroy();
      }
      
      // 清理引用
      this.navigation = null;
      this.animationManager = null;
      this.portfolioCarousel = null;
      this.contentManager = null;
      
      ErrorHandler.logInfo("App", "Application cleaned up successfully");
    } catch (error) {
      ErrorHandler.logError("App.destroy", error);
    }
  }
}

// Initialize the application
new App();
