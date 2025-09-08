// Carousel module - handles portfolio carousel functionality
// 輪播模組 - 處理作品集輪播功能 (已全面優化)
import { CONFIG, UTILS } from "./config.js";
import { DOMUtils, ErrorHandler } from "./utils.js";

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
    this.totalWidth = 0;

    // 使用者互動與狀態
    this.currentX = 0;
    this.isDragging = false;
    this.wasDragged = false; // ★ 新增：判斷是否發生了拖曳
    this.isManualControl = false;
    this.startX = 0;
    this.startY = 0;
    this.startScrollX = 0;
    this.resumeTimer = null;
    this.velocityX = 0;
    this.lastX = 0;

    // 性能優化
    this.rafId = null;
    this.lastUpdateTime = 0;

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
        this.setupIntersectionObserver();
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
    this.carousel = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.PORTFOLIO_CAROUSEL);
    this.container = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.PORTFOLIO_CONTAINER);
    this.indicators = DOMUtils.safeQuerySelectorAll(CONFIG.SELECTORS.INDICATORS);
    if (this.carousel) {
      this.originalCards = Array.from(
        this.carousel.querySelectorAll(CONFIG.SELECTORS.PORTFOLIO_CARDS)
      );
    }
  }

  setupCarousel() {
    gsap.set(this.carousel, { opacity: 0 });

    const clones = this.originalCards.map((card) => card.cloneNode(true));
    this.carousel.append(...clones);
    this.cards = Array.from(this.carousel.querySelectorAll(CONFIG.SELECTORS.PORTFOLIO_CARDS));

    this.xSetter = gsap.quickSetter(this.carousel, "x", "px");
    this.calculateDimensions();
    if (this.container) this.container.style.cursor = "grab";

    gsap.to(this.carousel, { 
      opacity: 1, 
      duration: 0.4, 
      ease: "power1.inOut" 
    });
    this.wrapIndex = gsap.utils.wrap(0, this.originalCards.length);
  }

  calculateDimensions() {
    if (!this.originalCards || this.originalCards.length < 1) return;
    
    const firstCard = this.originalCards[0];
    const secondCard = this.originalCards.length > 1 ? this.originalCards[1] : null;

    this.cardWidth = firstCard.offsetWidth;
    this.gap = secondCard 
      ? secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().right 
      : 0;

    this.totalWidth = (this.cardWidth + this.gap) * this.originalCards.length;
    
    if (this.totalWidth < 0) this.totalWidth = 0;
    
    this.wrap = gsap.utils.wrap(-this.totalWidth, 0);
  }

  setupEventListeners() {
    if (!this.container) return;

    DOMUtils.safeAddEventListener(this.container, "mousedown", (e) => this.handleDragStart(e));
    DOMUtils.safeAddEventListener(document, "mousemove", (e) => this.handleDragMove(e));
    DOMUtils.safeAddEventListener(document, "mouseup", () => this.handleDragEnd());
    DOMUtils.safeAddEventListener(this.container, "touchstart", (e) => this.handleDragStart(e), { passive: false });
    DOMUtils.safeAddEventListener(document, "touchmove", (e) => this.handleDragMove(e), { passive: false });
    DOMUtils.safeAddEventListener(document, "touchend", () => this.handleDragEnd());
    DOMUtils.safeAddEventListener(this.container, "wheel", (e) => this.handleWheel(e), { passive: false });
    DOMUtils.safeAddEventListener(this.container, "mouseenter", () => this.pauseOnHover());
    DOMUtils.safeAddEventListener(this.container, "mouseleave", () => this.resumeOnLeave());

    this.indicators.forEach((indicator, index) => {
      DOMUtils.safeAddEventListener(indicator, "click", () => this.navigateToIndex(index));
    });

    window.addEventListener("resize", this.boundResizeHandler);

    DOMUtils.safeAddEventListener(this.container, "click", (e) => this.handleClick(e), true);
  }

updateIndicators() {
  if (!this.indicators.length || this.totalWidth === 0) return;

  const now = performance.now();
  if (now - this.lastUpdateTime < 16) return;
  this.lastUpdateTime = now;
  
  const cardStep = this.cardWidth + this.gap;
  const rawIndex = Math.round(this.currentX / -cardStep);
  const activeIndex = this.wrapIndex(rawIndex);

  if (this.indicators[activeIndex] && !this.indicators[activeIndex].classList.contains("active")) {
    this.indicators.forEach((indicator, index) => {
      const isActive = index === activeIndex;
      indicator.classList.toggle("active", isActive);
      const originalCard = this.originalCards[index];
      const clonedCard = this.cards[index + this.originalCards.length];
      if (originalCard) originalCard.setAttribute("aria-hidden", !isActive);
      if (clonedCard) clonedCard.setAttribute("aria-hidden", !isActive);
    });
  }
}

  startAutoScroll() {
    if (this.portfolioTl) this.portfolioTl.kill();
    if (this.totalWidth === 0) return;

    this.currentX = this.wrap(this.currentX);
    this.xSetter(this.currentX);

    const proxy = { x: this.currentX };
    this.portfolioTl = gsap.to(proxy, {
      x: this.currentX - this.totalWidth,
      duration: CONFIG.CAROUSEL.AUTO_SCROLL_DURATION,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        this.currentX = this.wrap(proxy.x);
        this.xSetter(this.currentX);
        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => {
            this.updateIndicators();
            this.rafId = null;
          });
        }
      },
    });
  }

  resumeAutoScroll() {
    clearTimeout(this.resumeTimer);
    this.resumeTimer = setTimeout(() => {
      if (!this.isDragging && this.observer && this.observer.isIntersecting) {
        this.isManualControl = false;
        this.startAutoScroll();
      }
    }, CONFIG.CAROUSEL.RESUME_DELAY);
  }

navigateToIndex(index) {
    this.isManualControl = true;
    if (this.portfolioTl) this.portfolioTl.pause();
    gsap.killTweensOf(this.carousel);
    clearTimeout(this.resumeTimer);

    const cardStep = this.cardWidth + this.gap;
    if (cardStep === 0) return;

    const currentX = gsap.getProperty(this.carousel, "x");
    const currentIndex = this.wrapIndex(Math.round(currentX / -cardStep));

    if (index === currentIndex) {
      this.resumeAutoScroll();
      return;
    }


    const baseTargetX = -cardStep * index;
    let finalTargetX = baseTargetX;

    if (this.totalWidth > 0) {
      if (index > currentIndex) {

        if (baseTargetX > currentX) {
          finalTargetX = baseTargetX - this.totalWidth;
        }
      } 
      else {
        if (baseTargetX < currentX) {
          finalTargetX = baseTargetX + this.totalWidth;
        }
      }
    }

    gsap.to(this.carousel, {
      x: finalTargetX,
      duration: CONFIG.CAROUSEL.INDICATOR_ANIMATION_DURATION,
      ease: "power2.out",
      onUpdate: () => {
        this.currentX = gsap.getProperty(this.carousel, "x");
        this.updateIndicators();
      },
      onComplete: () => {
        this.currentX = this.wrap(finalTargetX);
        gsap.set(this.carousel, { x: this.currentX });
        this.updateIndicators();
        this.resumeAutoScroll();
      },
    });
  }

  handleDragStart(e) {
    this.isDragging = true;
    this.wasDragged = false; // ★ 重置拖曳狀態
    this.isManualControl = true;
    if (this.portfolioTl) this.portfolioTl.pause();
    gsap.killTweensOf(this.carousel);
    clearTimeout(this.resumeTimer);

    const touch = e.type.includes("touch") ? e.touches[0] : e;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.lastX = this.startX;
    this.velocityX = 0;
    this.startScrollX = this.currentX;
    if (this.container) this.container.style.cursor = "grabbing";
  }

  handleDragMove(e) {
    if (!this.isDragging) return;

    const touch = e.type.includes("touch") ? e.touches[0] : e;
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    const deltaXTotal = clientX - this.startX;
    const deltaYTotal = clientY - this.startY;

    if (e.type.includes("touch") && Math.abs(deltaXTotal) < Math.abs(deltaYTotal)) {
      return;
    }
    e.preventDefault();
    
    // ★ 如果移動超過一個微小的閾值，就認定為拖曳
    if (Math.abs(deltaXTotal) > CONFIG.CAROUSEL.DRAG_THRESHOLD_PX) {
      this.wasDragged = true;
    }

    this.velocityX = clientX - this.lastX;
    this.lastX = clientX;
    
    const newX = this.wrap(this.startScrollX + deltaXTotal * CONFIG.CAROUSEL.DRAG_SENSITIVITY);
    this.currentX = newX;
    this.xSetter(newX);
    this.updateIndicators();
  }

handleDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.container) this.container.style.cursor = "grab";
    this.currentX = gsap.getProperty(this.carousel, "x");

    if (!this.wasDragged) { // 如果沒有實際拖曳，則不觸發慣性
      this.resumeAutoScroll();
      return;
    }

    const cardStep = this.cardWidth + this.gap;
    if (cardStep === 0) {
      this.resumeAutoScroll();
      return;
    }

    const momentumX = this.currentX + this.velocityX * 12;

    const snappedX = Math.round(momentumX / cardStep) * cardStep;

    gsap.to(this.carousel, {
      x: snappedX,
      duration: 1.2,
      ease: "power3.out",
      onUpdate: () => {
        this.currentX = gsap.getProperty(this.carousel, "x");
        this.updateIndicators();
      },
      onComplete: () => {
        this.currentX = this.wrap(snappedX);
        this.xSetter(this.currentX); 

        this.updateIndicators();
        this.resumeAutoScroll();
      }
    });
  }
  
  // ★ 新增：處理點擊事件的方法
  handleClick(e) {
    if (this.wasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleWheel(e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      this.isManualControl = true;
      if (this.portfolioTl) this.portfolioTl.pause();
      clearTimeout(this.resumeTimer);
      gsap.killTweensOf(this.carousel);

      const newX = this.wrap(this.currentX - e.deltaX);
      this.currentX = newX;
      this.xSetter(newX);
      this.updateIndicators();
      this.resumeAutoScroll();
    }
  }

  pauseOnHover() {
    if (!this.isManualControl && this.portfolioTl) this.portfolioTl.pause();
  }

  resumeOnLeave() {
    if (!this.isManualControl && !this.isDragging && this.portfolioTl && this.observer.isIntersecting) {
      this.portfolioTl.resume();
    }
  }

handleResize() {
  if (this.portfolioTl) this.portfolioTl.pause();

  // 根據當前的 currentX 計算出最近的 activeIndex
  const cardStep = this.cardWidth + this.gap;
  const rawIndex = cardStep > 0 ? Math.round(this.currentX / -cardStep) : 0;
  const activeIndex = this.wrapIndex(rawIndex);

  // 重新計算尺寸
  this.calculateDimensions();

  // 根據 activeIndex 直接定位到新的位置
  const newX = -((this.cardWidth + this.gap) * activeIndex);
  this.currentX = this.wrap(newX);

  gsap.set(this.carousel, { x: this.currentX });

  if (this.observer && this.observer.isIntersecting) {
      this.startAutoScroll();
  }
}

  setupIntersectionObserver() {
    if (!this.container) return;
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
    observer.observe(this.container);
    this.observer = observer;
    this.observer.isIntersecting = false;
  }

  destroy() {
    clearTimeout(this.resumeTimer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.portfolioTl) this.portfolioTl.kill();
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.boundResizeHandler);
  }
}

