// Animations 模組 - 處理所有 GSAP 動畫與效果
import { CONFIG } from "./config.js";
import { ErrorHandler, DOMUtils, AnimationUtils } from "./utils.js";

export class AnimationManager {
  constructor() {
    this.cleanupCallbacks = [];
    // doodo 旋轉動畫的實例
    this.doodoRotationTween = null;
    // 用於偵測 doodo 是否停止點擊的計時器
    this.doodoSpeedUpTimer = null;
    this.init();
  }

  init() {
    // 檢查是否應啟用動畫（GSAP 是否存在、使用者是否關閉動態效果）
    if (typeof gsap == "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ErrorHandler.logWarning("AnimationManager", "動畫已被禁用");
      return;
    }

    this.setupDoodoRotation();
    this.setupHeroAnimations();
    this.setupScrollAnimations();
    this.setupTechHoverAnimations();
  }


  // doodo背景的旋轉動畫以及旋轉加速
  setupDoodoRotation() {
    const doodo = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.DOODO_BACKGROUND);

    if (doodo) {
      AnimationUtils.safeAnimate(() => {
        this.doodoRotationTween = gsap.to(doodo, {
          rotation: 720,
          duration: CONFIG.ANIMATION.DOODO_ROTATION_DURATION,
          ease: "none",
          repeat: -1,
        });
      }, "AnimationManager.setupDoodoRotation");

      // 定義一個handler
      const clickHandler = () => {
        // 清除上一個減速計時器
        clearTimeout(this.doodoSpeedUpTimer);
        AnimationUtils.safeAnimate(() => {
          gsap.to(this.doodoRotationTween, {
            timeScale: 30,
            duration: 0.8,
            ease: "power2.out",
            overwrite: true,
          });
        }, "AnimationManager.doodoClickAcceleration");

        // 設定延時，若一段時間內無再次點擊，則減速至原速
        this.doodoSpeedUpTimer = setTimeout(() => {
          AnimationUtils.safeAnimate(() => {
            gsap.to(this.doodoRotationTween, {
              timeScale: 1,
              duration: 1,
              ease: "power2.out",
              overwrite: true,
            });
          }, "AnimationManager.doodoDeceleration");
        }, 300);
      };

      DOMUtils.safeAddEventListener(doodo, "click", clickHandler);
      // 將removeEventListener加入到cleanupCallbacks之中以便destroy函式調用
      this.cleanupCallbacks.push(() => {
        doodo.removeEventListener("click", clickHandler);
      });
    }
  }

  // Hero 區域（主視覺）的進場動畫
  setupHeroAnimations() {
    const title = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.HERO_TITLE);
    const buttons = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.HERO_BUTTONS);
    const icons = DOMUtils.safeQuerySelectorAll(CONFIG.SELECTORS.FLOATING_ICONS);

    // 標題與按鈕的進場動畫時間軸
    if (title && buttons) {
      AnimationUtils.safeAnimate(() => {
        gsap.timeline()
          .fromTo(title, { y: 100, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: CONFIG.ANIMATION.HERO_TITLE_DURATION,
            ease: "power3.out",
          })
          .fromTo(buttons, { y: 30, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: CONFIG.ANIMATION.HERO_BUTTONS_DURATION,
            ease: "power3.out",
          }, CONFIG.ANIMATION.HERO_BUTTONS_DELAY);
      }, "AnimationManager.setupHeroTimeline");
    }

    // 浮動圖示的動畫
    if (icons.length > 0) {
      AnimationUtils.safeAnimate(() => {
        gsap.to(icons, {
          y: -20,
          duration: CONFIG.ANIMATION.FLOATING_ICON_DURATION,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          stagger: CONFIG.ANIMATION.FLOATING_ICON_STAGGER,
        });
      }, "AnimationManager.setupFloatingIcons");
    }

    // 設定職稱輪播動畫
    this.setupJobTitleAnimation();
  }


  // 設定職稱文字輪播動畫
  setupJobTitleAnimation() {
    const titles = CONFIG.HERO_SETTINGS.JOB_TITLES;
    const titleElement = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.JOB_TITLE);
    if (!titleElement) return;

    // 輪播動畫動畫
    AnimationUtils.safeAnimate(() => {
      const tl = gsap.timeline({ repeat: -1 });
      gsap.set(titleElement, { yPercent: 0 });

      titles.forEach((title, index) => {
        tl.to(titleElement, {
          yPercent: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          delay: 1.5,
        });
        tl.set(titleElement, {
          textContent: titles[(index + 1) % titles.length],
          yPercent: 100,
          opacity: 0,
        });
        tl.to(titleElement, {
          yPercent: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    }, "AnimationManager.setupJobTitleAnimation");
  }

  // 設定所有滾動觸發的動畫
  setupScrollAnimations() {
    const animations = [
      { selector: CONFIG.SELECTORS.PROFILE_CARD, start: CONFIG.SCROLL_TRIGGER.ABOUT_START, initial: { y: 50, opacity: 0 }, target: { y: 0, opacity: 1 } },
      { selector: CONFIG.SELECTORS.ABOUT_TEXT, start: CONFIG.SCROLL_TRIGGER.ABOUT_START, initial: { y: 50, opacity: 0 }, target: { y: 0, opacity: 1, delay: CONFIG.ANIMATION.SECTION_ANIMATION_DELAY } },
      { selector: CONFIG.SELECTORS.PORTFOLIO_CARDS, start: CONFIG.SCROLL_TRIGGER.PORTFOLIO_START, initial: { y: 80, opacity: 0, scale: 0.9 }, target: { y: 0, opacity: 1, scale: 1, stagger: CONFIG.ANIMATION.PORTFOLIO_STAGGER } },
      { selector: CONFIG.SELECTORS.CONTACT_INFO_LIST, start: CONFIG.SCROLL_TRIGGER.CONTACT_START, initial: { opacity: 0 }, target: { opacity: 1 } },
    ];

    AnimationUtils.safeAnimate(() => {
      animations.forEach(({ selector, initial, target, start }) => {
        gsap.set(selector, initial);
        ScrollTrigger.batch(selector, {
          onEnter: (elements) =>
            gsap.to(elements, {
              ...target,
              duration: CONFIG.ANIMATION.SECTION_ANIMATION_DURATION,
              ease: "power3.out",
            }),
          start,
          once: true,
        });
      });
    }, "AnimationManager.setupScrollAnimations");

    this.setupTechAnimation();
  }

  // 設定技術棧區塊的滾動觸發動畫
  setupTechAnimation() {
    const techItems = DOMUtils.safeQuerySelectorAll(".tech-item");

    // ★ 如果找不到元素，就直接返回
    if (techItems.length === 0) {
      return;
    }
    AnimationUtils.safeAnimate(() => {
      gsap.set(techItems, { y: 60, opacity: 0, rotationY: 45 });
      ScrollTrigger.batch(techItems, {
        onEnter: (elements) =>
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: CONFIG.ANIMATION.TECH_STACK_DURATION,
            stagger: CONFIG.ANIMATION.TECH_STACK_STAGGER,
            ease: "power3.out",
          }),
        start: CONFIG.SCROLL_TRIGGER.TECH_STACK_START,
        once: true,
      });
    }, "AnimationManager.setupTechAnimation.batch");

  }

  // 設定技術項目滑鼠懸停時的動畫效果
  setupTechHoverAnimations() {
    const techItems = DOMUtils.safeQuerySelectorAll(CONFIG.SELECTORS.TECH_ITEMS);

    techItems.forEach((item) => {
      const card = DOMUtils.safeQuerySelector(".card", item);
      const icon = DOMUtils.safeQuerySelector(".tech-icon", item);
      const name = DOMUtils.safeQuerySelector(".tech-name", item);

      if (!card || !icon || !name) return;

      const hoverIn = () => {
        // 讓頂部顯示藍光
        item.classList.add("hovered");
        AnimationUtils.safeAnimate(() => {
          gsap.to(card, { y: CONFIG.ANIMATION.TECH_HOVER_Y, scale: CONFIG.ANIMATION.TECH_HOVER_SCALE, duration: CONFIG.ANIMATION.TECH_HOVER_DURATION, ease: "power2.out" });
          gsap.to(icon, { scale: CONFIG.ANIMATION.ICON_HOVER_SCALE, rotation: CONFIG.ANIMATION.ICON_HOVER_ROTATION, duration: CONFIG.ANIMATION.TECH_HOVER_DURATION, ease: "back.out(1.2)" });
          gsap.to(name, { color: CONFIG.COLORS.CYAN_400, duration: CONFIG.ANIMATION.TECH_HOVER_DURATION });
        }, "AnimationManager.techHoverIn");
      };

      const hoverOut = () => {
        item.classList.remove("hovered");
        AnimationUtils.safeAnimate(() => {
          gsap.to(card, { y: 0, scale: 1, duration: CONFIG.ANIMATION.TECH_HOVER_DURATION, ease: "power2.out" });
          gsap.to(icon, { scale: 1, rotation: 0, duration: CONFIG.ANIMATION.TECH_HOVER_DURATION });
          gsap.to(name, { color: CONFIG.COLORS.WHITE, duration: CONFIG.ANIMATION.TECH_HOVER_DURATION });
        }, "AnimationManager.techHoverOut");
      };

      // ★ 使用 safeAddEventListener 安全地綁定事件
      DOMUtils.safeAddEventListener(item, "mouseenter", hoverIn);
      DOMUtils.safeAddEventListener(item, "mouseleave", hoverOut);
      this.cleanupCallbacks.push(() => {
        if (item) {
          item.removeEventListener("mouseenter", hoverIn);
          item.removeEventListener("mouseleave", hoverOut);
        }
      });
    });
  }

  //清理所有動畫與事件監聽器
  destroy() {
    clearTimeout(this.doodoSpeedUpTimer);

    // 執行所有已添加的removeEventListener函式
    this.cleanupCallbacks.forEach((cleanup) => cleanup());
    this.cleanupCallbacks = [];

    AnimationUtils.safeKill(gsap.globalTimeline, "gsap.globalTimeline");
    AnimationUtils.safeKillAllScrollTriggers();
  }
}