// Animations module - handles GSAP animations and effects
import { CONFIG } from "./config.js";
import { ErrorHandler, DOMUtils } from "./utils.js"; // ★ 新增：導入 DOMUtils

export class AnimationManager {
  constructor() {
    this.cleanupCallbacks = [];
    this.doodoRotationTween = null; // ★ 用於儲存 doodo 旋轉動畫實例
    this.doodoSpeedUpTimer = null; // ★ 新增：用於偵測停止點擊的計時器
    this.init();
  }

  init() {
    if (!this.shouldEnableAnimations()) {
      ErrorHandler.logWarning("AnimationManager", "Animations disabled");
      return;
    }

    this.setupDoodoRotation();
    this.setupHeroAnimations();
    this.setupScrollAnimations();
    this.setupTechHoverAnimations();
  }

  shouldEnableAnimations() {
    return (
      typeof gsap !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  setupDoodoRotation() {
    const doodo = document.querySelector(CONFIG.SELECTORS.DOODO_BACKGROUND);
    if (doodo) {
      // 建立並儲存永久旋轉的動畫實例
      this.doodoRotationTween = gsap.to(doodo, {
        rotation: 720,
        duration: CONFIG.ANIMATION.DOODO_ROTATION_DURATION,
        ease: "none",
        repeat: -1,
      });

      // 為 doodo-background 加上點擊事件監聽器
      DOMUtils.safeAddEventListener(doodo, "click", () => {
        // 每次點擊都清除上一個減速計時器
        clearTimeout(this.doodoSpeedUpTimer);

        // 使用 GSAP 動畫將播放速度 (timeScale) 提升到高速
        gsap.to(this.doodoRotationTween, {
          timeScale: 30, // 目標速度
          duration: 0.8, // 加速所需時間
          ease: "power2.out",
          overwrite: true, // 覆蓋任何正在進行的 timeScale 動畫
        });

        // 設置一個新的計時器，如果在 300 毫秒內沒有再次點擊，就開始減速
        this.doodoSpeedUpTimer = setTimeout(() => {
          gsap.to(this.doodoRotationTween, {
            timeScale: 1, // 回到原速
            duration: 1, // 減速過程需要 1 秒
            ease: "power2.out",
            overwrite: true,
          });
        }, 300); // 300 毫秒的延遲，判斷為停止點擊
      });
    }
  }

  setupHeroAnimations() {
    const title = document.querySelector(CONFIG.SELECTORS.HERO_TITLE);
    const buttons = document.querySelector(CONFIG.SELECTORS.HERO_BUTTONS);
    const icons = document.querySelectorAll(CONFIG.SELECTORS.FLOATING_ICONS);

    if (title && buttons) {
      gsap
        .timeline()
        .fromTo(
          title,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: CONFIG.ANIMATION.HERO_TITLE_DURATION,
            ease: "power3.out",
          }
        )
        .fromTo(
          buttons,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: CONFIG.ANIMATION.HERO_BUTTONS_DURATION,
            ease: "power3.out",
          },
          CONFIG.ANIMATION.HERO_BUTTONS_DELAY
        );
    }

    if (icons.length) {
      gsap.to(icons, {
        y: -20,
        duration: CONFIG.ANIMATION.FLOATING_ICON_DURATION,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: CONFIG.ANIMATION.FLOATING_ICON_STAGGER,
      });
    }
    this.setupJobTitleAnimation();
  }
setupJobTitleAnimation() {
    const titles = ["JAVA", "Python", "SQL", "Go", "Swift", "Backend"];
    const titleElement = document.querySelector(".job-title");

    if (!titleElement) return;

    const tl = gsap.timeline({ repeat: -1 });

    gsap.set(titleElement, { yPercent: 0 });

    titles.forEach((title, index) => {
      // 目前文字向上滑出
      tl.to(titleElement, {
        yPercent: -100,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        delay: 1.5, // 文字停留顯示的時間
      });

      // ★ 關鍵修正：直接在 set 中更新 textContent 屬性，而不是用 onStart
      tl.set(titleElement, {
        textContent: titles[(index + 1) % titles.length],
        yPercent: 100,
        opacity: 0,
      });

      // 新文字從下方滑入
      tl.to(titleElement, {
        yPercent: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }

  setupScrollAnimations() {
    const animations = [
      {
        selector: ".profile-card",
        initial: { y: 50, opacity: 0 },
        target: { y: 0, opacity: 1 },
        start: CONFIG.SCROLL_TRIGGER.ABOUT_START,
      },
      {
        selector: ".about-text",
        initial: { y: 50, opacity: 0 },
        target: {
          y: 0,
          opacity: 1,
          delay: CONFIG.ANIMATION.SECTION_ANIMATION_DELAY,
        },
        start: CONFIG.SCROLL_TRIGGER.ABOUT_START,
      },
      {
        selector: CONFIG.SELECTORS.PORTFOLIO_CARDS,
        initial: { y: 80, opacity: 0, scale: 0.9 },
        target: {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: CONFIG.ANIMATION.PORTFOLIO_STAGGER,
        },
        start: CONFIG.SCROLL_TRIGGER.PORTFOLIO_START,
      },
      {
        selector: ".contact-info-list",
        initial: { opacity: 0 },
        target: { opacity: 1 },
        start: "top bottom-=100px",
      },
      {
        selector: ".contact-info-list",
        initial: { opacity: 0 },
        target: {
          opacity: 1,
          delay: CONFIG.ANIMATION.SECTION_ANIMATION_DELAY,
        },
        start: "top bottom-=50px",
      },
    ];

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

    // Tech stack with retry logic
    this.setupTechAnimation();
  }

  setupTechAnimation() {
    const setupTech = () => {
      const techItems = document.querySelectorAll(".tech-item");
      if (techItems.length) {
        gsap.set(".tech-item", { y: 60, opacity: 0, rotationY: 45 });
        ScrollTrigger.batch(".tech-item", {
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
        return true;
      }
      return false;
    };

    if (!setupTech()) {
      setTimeout(() => {
        if (setupTech()) ScrollTrigger.refresh();
      }, 100);
    }
  }

  setupTechHoverAnimations() {
    document.querySelectorAll(CONFIG.SELECTORS.TECH_ITEMS).forEach((item) => {
      const [card, icon, name] = [".card", ".tech-icon", ".tech-name"].map(
        (sel) => item.querySelector(sel)
      );

      if (![card, icon, name].every(Boolean)) return;

      const hoverIn = () => {
        item.classList.add("hovered");
        gsap.to(card, {
          y: CONFIG.ANIMATION.TECH_HOVER_Y,
          scale: CONFIG.ANIMATION.TECH_HOVER_SCALE,
          duration: CONFIG.ANIMATION.TECH_HOVER_DURATION,
          ease: "power2.out",
          borderColor: "rgba(6, 182, 212, 0.4)",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)",
          boxShadow: "0 8px 32px rgba(6, 182, 212, 0.2)",
        });
        gsap.to(icon, {
          scale: CONFIG.ANIMATION.ICON_HOVER_SCALE,
          rotation: CONFIG.ANIMATION.ICON_HOVER_ROTATION,
          duration: CONFIG.ANIMATION.TECH_HOVER_DURATION,
          ease: "back.out(1.2)",
        });
        gsap.to(name, { color: CONFIG.COLORS.CYAN_400, duration: 0.2 });
      };

      const hoverOut = () => {
        item.classList.remove("hovered");
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: CONFIG.ANIMATION.TECH_HOVER_DURATION,
          ease: "power2.out",
          borderColor: "rgba(148, 163, 184, 0.15)",
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        });
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: CONFIG.ANIMATION.TECH_HOVER_DURATION,
        });
        gsap.to(name, { color: CONFIG.COLORS.WHITE, duration: 0.2 });
      };

      item.addEventListener("mouseenter", hoverIn);
      item.addEventListener("mouseleave", hoverOut);
    });
  }

  destroy() {
    this.cleanupCallbacks.forEach((cleanup) => cleanup());
    gsap.killTweensOf("*");
    if (window.ScrollTrigger) ScrollTrigger.killAll();
  }
}

