// Carousel module - handles portfolio carousel functionality
// 輪播模組 - 處理作品集輪播功能
import { CONFIG, UTILS } from "./config.js";
import { DOMUtils, ErrorHandler } from "./utils.js";

export class PortfolioCarousel {
  constructor() {
    // DOM 元素
    this.carousel = null;
    this.container = null;
    this.indicators = [];
    this.originalCards = [];

    // GSAP 與動畫狀態
    this.portfolioTl = null;
    this.wrap = null; // ★ GSAP 官方的 wrap 函式
    this.xSetter = null; // ★ 新增：高效能的 GSAP quickSetter

    // 尺寸與位置
    this.cardWidth = 0;
    this.gap = 0;
    this.totalWidth = 0;

    // 使用者互動與狀態
    this.currentX = 0;
    this.isDragging = false;
    this.isManualControl = false;
    this.startX = 0;
    this.startScrollX = 0;
    this.resumeTimer = null;

    // ★ 新增：用於節流指示器更新的計時器
    this.indicatorUpdateThrottle = null;

    // 綁定 resize 處理函式，並使用 throttle 優化效能
    this.boundResizeHandler = UTILS.throttle(this.handleResize.bind(this), 250);

    this.bindElements();
  }

  async init() {
    try {
      if (this.carousel && this.originalCards.length > 0) {
        const images = this.carousel.querySelectorAll("img");
        await Promise.all(
          Array.from(images)
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  img.onload = img.onerror = resolve;
                })
            )
        );

        this.setupCarousel();
        this.setupEventListeners();
        this.startAutoScroll();
      } else {
        ErrorHandler.logWarning(
          "PortfolioCarousel",
          "找不到輪播元素或卡片，功能將無法運作"
        );
      }
    } catch (error) {
      ErrorHandler.logError("PortfolioCarousel.init", error);
    }
  }

  bindElements() {
    this.carousel = DOMUtils.safeQuerySelector(
      CONFIG.SELECTORS.PORTFOLIO_CAROUSEL
    );
    this.container = DOMUtils.safeQuerySelector(
      CONFIG.SELECTORS.PORTFOLIO_CONTAINER
    );
    this.indicators = DOMUtils.safeQuerySelectorAll(
      CONFIG.SELECTORS.INDICATORS
    );
    if (this.carousel) {
      this.originalCards = Array.from(
        this.carousel.querySelectorAll(CONFIG.SELECTORS.PORTFOLIO_CARDS)
      );
    }
  }

  setupCarousel() {
    const clones = this.originalCards.map((card) => card.cloneNode(true));
    this.carousel.append(...clones);

    // ★ 新增：初始化 quickSetter
    this.xSetter = gsap.quickSetter(this.carousel, "x", "px");

    this.calculateDimensions();

    if (this.container) {
      this.container.style.cursor = "grab";
    }
  }

  calculateDimensions() {
    if (!this.originalCards || this.originalCards.length < 2) {
      this.totalWidth =
        this.originalCards.length > 0
          ? this.originalCards[0].offsetWidth * this.originalCards.length
          : 0;
      this.gap = 0;
      return;
    }
    const firstCard = this.originalCards[0];
    const secondCard = this.originalCards[1];
    this.cardWidth = firstCard.offsetWidth;

    const firstCardRect = firstCard.getBoundingClientRect();
    const secondCardRect = secondCard.getBoundingClientRect();
    this.gap = secondCardRect.left - firstCardRect.right;

    this.totalWidth = (this.cardWidth + this.gap) * this.originalCards.length;

    if (this.totalWidth < 0) {
      ErrorHandler.logWarning(
        "PortfolioCarousel",
        `Calculated totalWidth is negative (${this.totalWidth}). Resetting to 0.`
      );
      this.totalWidth = 0;
    }
    this.wrap = gsap.utils.wrap(-this.totalWidth, 0);
  }

  setupEventListeners() {
    if (!this.container) return;

    DOMUtils.safeAddEventListener(this.container, "mousedown", (e) =>
      this.handleDragStart(e)
    );
    DOMUtils.safeAddEventListener(document, "mousemove", (e) =>
      this.handleDragMove(e)
    );
    DOMUtils.safeAddEventListener(document, "mouseup", () =>
      this.handleDragEnd()
    );
    DOMUtils.safeAddEventListener(
      this.container,
      "touchstart",
      (e) => this.handleDragStart(e),
      { passive: true }
    );
    DOMUtils.safeAddEventListener(document, "touchmove", (e) =>
      this.handleDragMove(e)
    );
    DOMUtils.safeAddEventListener(document, "touchend", () =>
      this.handleDragEnd()
    );
    DOMUtils.safeAddEventListener(
      this.container,
      "wheel",
      (e) => this.handleWheel(e),
      { passive: false }
    );
    DOMUtils.safeAddEventListener(this.container, "mouseenter", () =>
      this.pauseOnHover()
    );
    DOMUtils.safeAddEventListener(this.container, "mouseleave", () =>
      this.resumeOnLeave()
    );

    this.indicators.forEach((indicator, index) => {
      DOMUtils.safeAddEventListener(indicator, "click", () =>
        this.navigateToIndex(index)
      );
    });

    window.addEventListener("resize", this.boundResizeHandler);
  }

  // ★ 優化：更新指示器的函式
  updateIndicators() {
    if (
      !this.indicators ||
      this.indicators.length === 0 ||
      this.totalWidth === 0
    )
      return;

    const progress = Math.abs(this.wrap(this.currentX) / this.totalWidth);
    let activeIndex = Math.floor(progress * this.originalCards.length);

    // 確保 activeIndex 不會超出範圍
    activeIndex = activeIndex % this.originalCards.length;

    if (
      this.indicators[activeIndex] &&
      !this.indicators[activeIndex].classList.contains("active")
    ) {
      this.indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === activeIndex);
      });
    }
  }

  startAutoScroll() {
    if (this.portfolioTl) this.portfolioTl.kill();
    if (this.totalWidth === 0) return;

    this.currentX = this.wrap(this.currentX);
    this.xSetter(this.currentX);

    // ★ 關鍵優化：使用 proxy 物件來驅動動畫，而不是直接操作 DOM
    const proxy = { x: this.currentX };

    this.portfolioTl = gsap.to(proxy, {
      x: this.currentX - this.totalWidth,
      duration: CONFIG.CAROUSEL.AUTO_SCROLL_DURATION,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        const wrappedX = this.wrap(proxy.x);
        this.currentX = wrappedX;
        this.xSetter(wrappedX);

        // ★ 優化：節流指示器更新，避免過度頻繁操作 DOM
        if (!this.indicatorUpdateThrottle) {
          this.indicatorUpdateThrottle = setTimeout(() => {
            this.updateIndicators();
            this.indicatorUpdateThrottle = null;
          }, 100); // 每 100ms 更新一次
        }
      },
    });
  }

  resumeAutoScroll() {
    clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => {
      if (!this.isDragging) {
        this.isManualControl = false;
        this.startAutoScroll();
      }
    }, CONFIG.CAROUSEL.RESUME_DELAY);
  }

  navigateToIndex(index) {
    this.isManualControl = true;
    if (this.portfolioTl) this.portfolioTl.pause();
    clearTimeout(this.resumeTimer);

    const targetX = -((this.cardWidth + this.gap) * index);

    gsap.to(this.carousel, {
      x: targetX,
      duration: CONFIG.CAROUSEL.INDICATOR_ANIMATION_DURATION,
      ease: "power2.out",
      onUpdate: () => {
        this.currentX = gsap.getProperty(this.carousel, "x");
        this.updateIndicators();
      },
      onComplete: () => {
        this.currentX = targetX;
        this.updateIndicators();
        this.resumeAutoScroll();
      },
    });
  }

  handleDragStart(e) {
    this.isDragging = true;
    this.isManualControl = true;
    if (this.portfolioTl) this.portfolioTl.pause();
    clearTimeout(this.resumeTimer);

    this.startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    this.startScrollX = this.currentX;
    if (this.container) this.container.style.cursor = "grabbing";
  }

  handleDragMove(e) {
    if (!this.isDragging) return;

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const deltaX = (clientX - this.startX) * CONFIG.CAROUSEL.DRAG_SENSITIVITY;
    const newX = this.wrap(this.startScrollX + deltaX);

    this.currentX = newX;
    this.xSetter(newX);
    this.updateIndicators();
  }

  handleDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.container) this.container.style.cursor = "grab";
    this.resumeAutoScroll();
  }

  handleWheel(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      this.isManualControl = true;
      if (this.portfolioTl) this.portfolioTl.pause();
      clearTimeout(this.resumeTimer);

      const newX = this.wrap(this.currentX - e.deltaX);

      this.currentX = newX;
      this.xSetter(newX);
      this.updateIndicators();
      this.resumeAutoScroll();
    }
  }

  pauseOnHover() {
    if (!this.isManualControl && this.portfolioTl) {
      this.portfolioTl.pause();
    }
  }

  resumeOnLeave() {
    if (!this.isManualControl && !this.isDragging && this.portfolioTl) {
      this.portfolioTl.resume();
    }
  }

  handleResize() {
    if (this.portfolioTl) this.portfolioTl.kill();
    this.calculateDimensions();
    this.currentX = 0;
    this.startAutoScroll();
  }
}
