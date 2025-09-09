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

      // 初始化所有模組
      this.contentManager = new ContentManager();
      this.navigation = new Navigation();
      this.portfolioCarousel = new PortfolioCarousel();
      this.animationManager = new AnimationManager();

      // ★ 新增：註冊 beforeunload 與 destroy事件
      this.setupCleanup();

      ErrorHandler.logInfo("App", "Portfolio website initialized successfully");
    } catch (error) {
      ErrorHandler.logError("App.initializeApp", error);
    }
  }

  // 不必要時停止資源消耗
  setupCleanup() {
    // 頁面卸載時清理資源
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });

    // 頁面隱藏時停止動畫，恢復時繼續
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.portfolioCarousel && this.portfolioCarousel.portfolioTl) {
          this.portfolioCarousel.portfolioTl.pause();
        }
      } else {
        if (this.portfolioCarousel && this.portfolioCarousel.portfolioTl) {
          this.portfolioCarousel.portfolioTl.resume();
        }
      }
    });
  }

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

new App();
