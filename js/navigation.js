// Navigation module - 導航欄邏輯實現
import { CONFIG } from "./config.js";
import { DOMUtils, ErrorHandler, AnimationUtils } from "./utils.js";

export class Navigation {
  constructor() {
    this.navToggle = null;
    this.navMenu = null;
    this.navLinks = null;
    this.init();
  }

  init() {
    try {
      this.navToggle = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.NAV_TOGGLE);
      this.navMenu = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.NAV_MENU);
      this.navLinks = DOMUtils.safeQuerySelectorAll(CONFIG.SELECTORS.NAV_LINKS);
      this.setupEventListeners();
      this.setupSmoothScroll();
    } catch (error) {
      ErrorHandler.logError("Navigation.init", error);
    }
  }

  setupEventListeners() {
    if (!this.navToggle || !this.navMenu) {
      ErrorHandler.logWarning(
        "Navigation",
        "無法選取narToggle, navMenu 物件,手機導航欄無法展開"
      );
      return;
    }
    // 在小螢幕下展開與關閉NAV
    DOMUtils.safeAddEventListener(this.navToggle, "click", () => {
      this.toggleMobileMenu();
    });
    // 點擊 NavLink 捲動到目標位置
    this.navLinks.forEach((link) => {
      DOMUtils.safeAddEventListener(link, "click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        if (targetId) {
          this.smoothScrollTo(targetId);
          this.closeMobileMenu();
        } else {
          ErrorHandler.logWarning(
            "Navigation",
            "Nav link missing href attribute",
            link
          );
        }
      });
    });
  }

  setupSmoothScroll() {
    try {
      // 為所有 href 添加捲動動畫
      const anchorLinks = DOMUtils.safeQuerySelectorAll('a[href^="#"]');
      anchorLinks.forEach((link) => {
        // 預防點擊 navLink 雙重觸發
        if (!link.classList.contains("nav-link")) {
          DOMUtils.safeAddEventListener(link, "click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            if (targetId) {
              this.smoothScrollTo(targetId);
            }
          });
        }
      });
    } catch (error) {
      ErrorHandler.logError("Navigation.setupSmoothScroll", error);
    }
  }

  toggleMobileMenu() {
    this.navToggle.classList.toggle("active");
    this.navMenu.classList.toggle("active");
  }

  closeMobileMenu() {
    this.navToggle.classList.remove("active");
    this.navMenu.classList.remove("active");
  }

  smoothScrollTo(targetId) {
    const targetElement = DOMUtils.safeQuerySelector(targetId);
    if (!targetElement) {
      ErrorHandler.logWarning(
        "Navigation",
        `Smooth scroll target not found: ${targetId}`
      );
    } 
    else{
      AnimationUtils.safeAnimate(
        () => {
          return gsap.to(window, {
            duration: CONFIG.ANIMATION.SCROLL_DURATION,
            scrollTo: {
              y: targetElement,
              offsetY: CONFIG.ANIMATION.SCROLL_OFFSET_Y,
            },
            ease: "power1.inOut",
          });
        },
        "Navigation.smoothScrollTo",
        () => {
          // 失敗則用一般smooth scroll
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      );
    }
  }
}
