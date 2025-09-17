// Carousel module - handles portfolio carousel functionality
import { CONFIG } from "./config.js";
import { DOMUtils, ErrorHandler, AnimationUtils, throttle } from "./utils.js";

export class PortfolioCarousel {
  constructor() {
    // DOM 元素
    this.carousel = null;
    this.container = null;
    this.indicators = [];
    this.cards = [];
    this.originalCards = [];

    // GSAP 與動畫狀態
    this.portfolioTl = null;
    this.wrap = null;
    this.xSetter = null;
    this.observer = null;

    // 尺寸與位置
    this.cardWidth = 0;
    this.gap = 0;
    this.cardStep = 0;
    this.totalWidth = 0;

    // 使用者互動與狀態
    this.currentX = 0;
    this.isDragging = false;
    this.wasDragged = false;
    this.isManualControl = false;
    this.activeIndex = -1;
    this.startX = 0;
    this.startY = 0;
    this.startScrollX = 0;
    this.resumeTimer = null;
    this.velocityX = 0;
    this.lastX = 0;

    // 綁在document上的事件監聽器
    this.boundDragMove = this.handleDragMove.bind(this);
    this.boundDragEnd = this.handleDragEnd.bind(this);

    // 性能優化
    this.throttledUpdateIndicators = AnimationUtils.throttleWithRAF(
      this.updateIndicators.bind(this)
    );
    this.init();
  }

  init() {
    this.bindElements();
    try {
      // 判斷輪播卡片已存在
      if (!this.carousel || this.originalCards.length === 0) {
        ErrorHandler.logWarning(
          "PortfolioCarousel",
          "找不到輪播元素或卡片，功能無法運作"
        );
        return;
      }
      this.setupCarousel();
      this.setupEventListeners();
      this.setupIntersectionObserver();
    } catch (error) {
      ErrorHandler.logError("PortfolioCarousel.init", error);
    }
  }
  // 綁定已渲染完成的class
  bindElements() {
    this.carousel = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.PORTFOLIO_CAROUSEL);
    this.container = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.PORTFOLIO_CONTAINER);
    this.indicators = DOMUtils.safeQuerySelectorAll(CONFIG.SELECTORS.INDICATORS);
    if (this.carousel) {
      this.originalCards = Array.from(
        DOMUtils.safeQuerySelectorAll(CONFIG.SELECTORS.PORTFOLIO_CARDS, this.carousel)
      );
    }
  }

  setupCarousel() {
    // 使卡片原始狀態隱藏
    gsap.set(this.carousel, { opacity: 0 });

    // 複製兩組卡片並添加進carousel末尾
    const clones1 = this.originalCards.map((card) => card.cloneNode(true));
    const clones2 = this.originalCards.map((card) => card.cloneNode(true));
    this.carousel.append(...clones1, ...clones2);

    this.cards = Array.from(this.carousel.querySelectorAll(CONFIG.SELECTORS.PORTFOLIO_CARDS));

    // GSAP專門用來更新輪播的 x 座標的函式
    this.xSetter = gsap.quickSetter(this.carousel, "x", "px");
    this.calculateDimensions();

    // 淡入 carousel
    gsap.to(this.carousel, {
      opacity: 1,
      duration: 0.4,
      ease: "power1.inOut"
    });
    this.wrapIndex = gsap.utils.wrap(0, this.originalCards.length);
  }

  calculateDimensions() {
    if (!this.originalCards || this.originalCards.length === 0) return;

    // 測量單張卡片寬度
    this.cardWidth = this.originalCards[0].offsetWidth;

    // 從 CSS 讀取 gap 值
    const computedStyle = window.getComputedStyle(this.carousel);
    this.gap = parseFloat(computedStyle.gap) || 0;

    this.cardStep = this.cardWidth + this.gap;

    // 計算卡片總長度
    this.totalWidth = (this.cardWidth + this.gap) * this.originalCards.length;

    // 打造從0到總長度的無限輪播
    this.wrap = gsap.utils.wrap(-this.totalWidth, 0);
  }

  setupEventListeners() {
    if (!this.container) return;

    // 處理滑鼠動作事件
    DOMUtils.safeAddEventListener(this.container, "mousedown", (e) => this.handleDragStart(e));
    DOMUtils.safeAddEventListener(this.container, "mouseenter", () => this.pauseOnHover());
    DOMUtils.safeAddEventListener(this.container, "mouseleave", () => this.resumeOnLeave());

    // 處理滾輪動作事件
    DOMUtils.safeAddEventListener(this.container, "wheel", (e) => this.handleWheel(e), { passive: false });

    // 處理觸控事件
    // passive: false 預防瀏覽器上下滑動
    DOMUtils.safeAddEventListener(this.container, "touchstart", (e) => this.handleDragStart(e), { passive: false });

    // 處理指示器點擊事件
    this.indicators.forEach((indicator, index) => {
      DOMUtils.safeAddEventListener(indicator, "click", () => this.navigateToIndex(index));
    });

    // 處理卡片點擊事件
    DOMUtils.safeAddEventListener(this.container, "click", (e) => this.handleClick(e), true);
  }

  // 動態綁定 document 級別的拖拽事件
  bindDocumentDragEvents() {
    document.addEventListener("mousemove", this.boundDragMove);
    document.addEventListener("mouseup", this.boundDragEnd);
    document.addEventListener("touchmove", this.boundDragMove, { passive: false });
    document.addEventListener("touchend", this.boundDragEnd);
  }

  // 解綁 document 級別的拖拽事件
  unbindDocumentDragEvents() {
    document.removeEventListener("mousemove", this.boundDragMove);
    document.removeEventListener("mouseup", this.boundDragEnd);
    document.removeEventListener("touchmove", this.boundDragMove);
    document.removeEventListener("touchend", this.boundDragEnd);
  }

  updateIndicators() {
    if (!this.indicators.length || this.totalWidth === 0) return;

    // 索引計算, 增加offset改變indicator更新的時機點
    const offset = this.cardWidth * 0.3;
    const newActiveIndex = this.wrapIndex(Math.round((this.currentX + offset) / -this.cardStep));

    // 如果計算出的新索引和儲存的舊索引相同，代表同一張卡片
    if (newActiveIndex === this.activeIndex) {
      return;
    }

    // 更新狀態並執行 DOM 操作
    this.activeIndex = newActiveIndex;

    this.indicators.forEach((indicator, index) => {
      // 確認是哪一個indicator
      const isActive = index === newActiveIndex;

      // 標示為active
      indicator.classList.toggle("active", isActive);

      // 顯示無障礙標示
      const originalCard = this.originalCards[index];
      const clonedCard = this.cards[index + this.originalCards.length];
      if (originalCard) originalCard.setAttribute("aria-hidden", !isActive);
      if (clonedCard) clonedCard.setAttribute("aria-hidden", !isActive);
    });
  }

  startAutoScroll() {
    // 預防創建多個實例
    if (this.portfolioTl) this.portfolioTl.kill();
    if (this.totalWidth === 0) return;

    // 設置X起始點, 用warp確保在範圍內
    this.currentX = this.wrap(this.currentX);
    this.xSetter(this.currentX);

    // 利用proxy代理X數值
    const proxy = { x: this.currentX };
    this.portfolioTl = gsap.to(proxy, {
      x: this.currentX - this.totalWidth,
      duration: CONFIG.CAROUSEL.AUTO_SCROLL_DURATION,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        // 將更新的x應用在carousel上
        this.currentX = this.wrap(proxy.x);
        this.xSetter(this.currentX);
        this.throttledUpdateIndicators();
      },
    });
  }

  resumeAutoScroll() {
    // 清除計時器
    clearTimeout(this.resumeTimer);

    // 設置新的計時器, 時間到且容器能被看到就開啟自動輪播
    this.resumeTimer = setTimeout(() => {
      this.isManualControl = false;
      if (!this.isDragging && this.observer && this.observer.isIntersecting) {
        this.startAutoScroll();
      }
    }, CONFIG.CAROUSEL.RESUME_DELAY);
  }

  navigateToIndex(index) {
    // 動畫清理
    this.isManualControl = true;
    if (this.portfolioTl) this.portfolioTl.pause();
    gsap.killTweensOf(this.carousel);
    clearTimeout(this.resumeTimer);

    // 安全檢查與當前索引計算
    if (this.cardStep === 0) return;
    const currentX = gsap.getProperty(this.carousel, "x");
    const currentIndex = this.wrapIndex(Math.round(currentX / -this.cardStep));

    // 如果現在就是目標索引, 繼續播放
    if (index === currentIndex) {
      this.resumeAutoScroll();
      return;
    }

    let finalTargetX = -this.cardStep * index;

    // 如果index > currentIndex, 卡片就要向左移動
    if (index > currentIndex) {
      if (finalTargetX > currentX) {
        finalTargetX -= this.totalWidth;
      }
    }
    // 如果 index < currentIndex, 卡片就要像右移動
    else {
      if (finalTargetX < currentX) {
        finalTargetX += this.totalWidth;
      }
    }

    // 執行動畫
    gsap.to(this.carousel, {
      x: finalTargetX,
      duration: CONFIG.CAROUSEL.INDICATOR_ANIMATION_DURATION,
      ease: "power2.out",
      onUpdate: () => {
        // 動畫期間，持續更新狀態並同步指示器
        this.currentX = gsap.getProperty(this.carousel, "x");
        this.throttledUpdateIndicators();
      },
      onComplete: () => {
        // 動畫結束後，校準位置狀態並準備恢復自動滾動
        this.currentX = this.wrap(finalTargetX);
        this.xSetter(this.currentX);
        this.throttledUpdateIndicators();
        this.resumeAutoScroll();
      },
    });
  }

  handleDragStart(e) {
    // 驗證觸摸事件是否發生在carousel容器內
    if (e.type.includes("touch")) {
      const touch = e.touches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!this.container.contains(targetElement)) {
        // 確保清理任何殘留的拖曳狀態
        this.isDragging = false;
        this.wasDragged = false;
        return;
      }
    }

    this.isDragging = true;
    this.wasDragged = false;
    this.isManualControl = true;

    // 動態綁定 document 級別事件（只在有效拖拽期間）
    this.bindDocumentDragEvents();

    // 停止carousel以及清除計時器
    clearTimeout(this.resumeTimer);
    if (this.portfolioTl) this.portfolioTl.pause();
    this.container.style.cursor = 'grabbing';

    // 拖曳時終止所有carousel相關動畫
    gsap.killTweensOf(this.carousel);

    // 同時處理滑鼠以及觸控螢幕的操作
    const touch = e.type.includes("touch") ? e.touches[0] : e;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.lastX = this.startX;
    this.velocityX = 0;
    this.startScrollX = this.currentX;
  }

  handleDragMove(e) {
    // 確保是拖曳中且觸摸事件來源有效
    if (!this.isDragging) return;

    // 對於觸摸事件，額外驗證觸摸點是否仍在有效範圍內
    if (e.type.includes("touch") && e.touches.length === 0) {
      return;
    }

    // 算除移動總距離
    const touch = e.type.includes("touch") ? e.touches[0] : e;
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    const deltaXTotal = clientX - this.startX;
    const deltaYTotal = clientY - this.startY;

    // 確保用戶不是想要上下移動
    if (e.type.includes("touch") && Math.abs(deltaXTotal) < Math.abs(deltaYTotal)) {
      return;
    }
    // 防止瀏覽器上下移動
    e.preventDefault();

    // 確保用戶在移動 carousel
    if (!this.wasDragged && Math.abs(deltaXTotal) > CONFIG.CAROUSEL.DRAG_THRESHOLD_PX) {
      this.wasDragged = true;
    }

    // 計算最後一幀的速度
    this.velocityX = clientX - this.lastX;
    this.lastX = clientX;
    const newX = this.wrap(this.startScrollX + deltaXTotal * CONFIG.CAROUSEL.DRAG_SENSITIVITY);

    this.currentX = newX;
    this.xSetter(newX);
    this.throttledUpdateIndicators();
  }

  handleDragEnd(e) {
    // 判斷已完成拖曳且驗證drag session有效性
    if (!this.isDragging) return;

    // 對於觸摸事件，額外驗證這是一個有效的結束事件
    if (e && e.type.includes("touch") && this.startX === undefined) {
      return;
    }

    this.isDragging = false;
    this.container.style.cursor = 'grab';

    // 解綁 document 級別事件
    this.unbindDocumentDragEvents();

    // 如果只是點擊沒有拖曳或沒有卡片,繼續播放
    if (!this.wasDragged || this.cardStep === 0) {
      this.resumeAutoScroll();
      return;
    }

    // 計算慣性後的位置以及吸附卡片的位置
    const momentumX = gsap.getProperty(this.carousel, "x") + this.velocityX * CONFIG.CAROUSEL.MOMENTUM_MULTIPLIER;
    const snappedX = Math.round(momentumX / this.cardStep) * this.cardStep;

    // 位移到吸附的地方
    gsap.to(this.carousel, {
      x: snappedX,
      duration: 1.2,
      ease: "power3.out",
      onUpdate: () => {
        // 動畫期間，持續更新狀態並同步指示器
        this.currentX = gsap.getProperty(this.carousel, "x");
        this.throttledUpdateIndicators();
      },
      onComplete: () => {
        // 動畫結束後，校準位置狀態並準備恢復自動滾動
        this.currentX = this.wrap(snappedX);
        this.xSetter(this.currentX);
        this.throttledUpdateIndicators();
        this.resumeAutoScroll();
      }
    });
  }

  // 如果用戶是抓取, 防止點擊到卡片中的其他元素
  handleClick(e) {
    if (this.wasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleWheel(e) {
    // 判斷是否為橫向移動
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // 清理動畫
      e.preventDefault();
      this.isManualControl = true;
      if (this.portfolioTl) this.portfolioTl.pause();
      clearTimeout(this.resumeTimer);
      gsap.killTweensOf(this.carousel);

      // 直接瞬移到目的位置, 由觸控板提供滑順感
      const newX = this.wrap(this.currentX - e.deltaX);
      this.currentX = newX;
      this.xSetter(newX);
      this.throttledUpdateIndicators();
      this.resumeAutoScroll();
    }
  }
  // 停止播放
  pauseOnHover() {
    if (!this.isManualControl && this.portfolioTl) this.portfolioTl.pause();
  }
  // 繼續播放
  resumeOnLeave() {
    if (!this.isManualControl && !this.isDragging && this.portfolioTl && this.observer.isIntersecting) {
      this.portfolioTl.resume();
    }
  }

  setupIntersectionObserver() {
    if (!this.container) return;

    // 創建observer實例
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.observer.isIntersecting = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!this.portfolioTl) this.startAutoScroll();
          else this.resumeOnLeave();
        } else {
          this.pauseOnHover();
        }
      },
      { threshold: 0.1 }
    );
    // observer觀察這個container物件
    observer.observe(this.container);
    this.observer = observer;
    this.observer.isIntersecting = false;
  }

  destroy() {
    // 清理 timer, 跟requestAnimationFrame
    clearTimeout(this.resumeTimer);
    if (this.throttledUpdateIndicators && typeof this.throttledUpdateIndicators.cancel === 'function') {
      this.throttledUpdateIndicators.cancel();
    }

    // 清理所有動畫與觀察器
    if (this.portfolioTl) this.portfolioTl.kill();
    if (this.observer) this.observer.disconnect();

    // 確保解綁任何殘留的 document 級別事件
    this.unbindDocumentDragEvents();

    this.carousel = null;
    this.container = null;
    this.indicators = [];
    this.cards = [];
    this.originalCards = [];
    this.portfolioTl = null;
    this.observer = null;
    this.xSetter = null;
    this.wrap = null;
    this.wrapIndex = null;
    this.throttledUpdateIndicators = null;
    this.boundDragMove = null;
    this.boundDragEnd = null;
  }
}

