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
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  // ★ 關鍵修正：將 initializeApp 改為 async 函式
  async initializeApp() {
    try {
      // Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      // 正常初始化不依賴輪播的模組
      this.contentManager = new ContentManager();
      this.navigation = new Navigation();

      // 步驟 1：建立輪播物件
      this.portfolioCarousel = new PortfolioCarousel();

      // 步驟 2：使用 await 等待輪播系統（包含圖片載入）完全準備就緒
      await this.portfolioCarousel.init();

      // 步驟 3：在輪播系統就緒後，才安全地初始化動畫管理器
      this.animationManager = new AnimationManager();

      ErrorHandler.logInfo("App", "Portfolio website initialized successfully 🎉");
    } catch (error) {
      ErrorHandler.logError("App.initializeApp", error);
    }
  }
}

// Initialize the application
new App();
