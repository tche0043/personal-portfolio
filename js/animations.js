// Animations module - handles GSAP animations and effects
import { CONFIG } from "./config.js";
import { ErrorHandler } from "./utils.js";

export class AnimationManager {
  constructor() {
    this.cleanupCallbacks = [];
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
      gsap.to(doodo, {
        rotation: 360,
        duration: CONFIG.ANIMATION.DOODO_ROTATION_DURATION,
        ease: "none",
        repeat: -1
      });
    }
  }

  setupHeroAnimations() {
    const title = document.querySelector(CONFIG.SELECTORS.HERO_TITLE);
    const buttons = document.querySelector(CONFIG.SELECTORS.HERO_BUTTONS);
    const icons = document.querySelectorAll(CONFIG.SELECTORS.FLOATING_ICONS);

    if (title && buttons) {
      gsap.timeline()
        .fromTo(title, { y: 100, opacity: 0 }, {
          y: 0, opacity: 1,
          duration: CONFIG.ANIMATION.HERO_TITLE_DURATION,
          ease: "power3.out"
        })
        .fromTo(buttons, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1,
          duration: CONFIG.ANIMATION.HERO_BUTTONS_DURATION,
          ease: "power3.out"
        }, CONFIG.ANIMATION.HERO_BUTTONS_DELAY);
    }

    if (icons.length) {
      gsap.to(icons, {
        y: -20,
        duration: CONFIG.ANIMATION.FLOATING_ICON_DURATION,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: CONFIG.ANIMATION.FLOATING_ICON_STAGGER
      });
    }
  }

  setupScrollAnimations() {
    const animations = [
      {
        selector: ".profile-card",
        initial: { y: 50, opacity: 0 },
        target: { y: 0, opacity: 1 },
        start: CONFIG.SCROLL_TRIGGER.ABOUT_START
      },
      {
        selector: ".about-text", 
        initial: { y: 50, opacity: 0 },
        target: { y: 0, opacity: 1, delay: CONFIG.ANIMATION.SECTION_ANIMATION_DELAY },
        start: CONFIG.SCROLL_TRIGGER.ABOUT_START
      },
      {
        selector: CONFIG.SELECTORS.PORTFOLIO_CARDS,
        initial: { y: 80, opacity: 0, scale: 0.9 },
        target: { 
          y: 0, opacity: 1, scale: 1,
          stagger: CONFIG.ANIMATION.PORTFOLIO_STAGGER
        },
        start: CONFIG.SCROLL_TRIGGER.PORTFOLIO_START
      },
      {
        selector: ".contact-info-list",
        initial: { opacity: 0 },
        target: { opacity: 1 },
        start: "top bottom-=100px"
      },
      {
        selector: ".contact-info-list", 
        initial: { opacity: 0 },
        target: { opacity: 1, delay: CONFIG.ANIMATION.SECTION_ANIMATION_DELAY },
        start: "top bottom-=50px"
      }
    ];

    animations.forEach(({ selector, initial, target, start }) => {
      gsap.set(selector, initial);
      ScrollTrigger.batch(selector, {
        onEnter: elements => gsap.to(elements, {
          ...target,
          duration: CONFIG.ANIMATION.SECTION_ANIMATION_DURATION,
          ease: "power3.out"
        }),
        start,
        once: true
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
          onEnter: elements => gsap.to(elements, {
            y: 0, opacity: 1, rotationY: 0,
            duration: CONFIG.ANIMATION.TECH_STACK_DURATION,
            stagger: CONFIG.ANIMATION.TECH_STACK_STAGGER,
            ease: "power3.out"
          }),
          start: CONFIG.SCROLL_TRIGGER.TECH_STACK_START,
          once: true
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
    document.querySelectorAll(CONFIG.SELECTORS.TECH_ITEMS).forEach(item => {
      const [card, icon, name] = ['.card', '.tech-icon', '.tech-name']
        .map(sel => item.querySelector(sel));
      
      if (![card, icon, name].every(Boolean)) return;

      const hoverIn = () => {
        item.classList.add("hovered");
        gsap.to(card, {
          y: CONFIG.ANIMATION.TECH_HOVER_Y,
          scale: CONFIG.ANIMATION.TECH_HOVER_SCALE,
          duration: CONFIG.ANIMATION.TECH_HOVER_DURATION,
          ease: "power2.out",
          borderColor: "rgba(6, 182, 212, 0.4)",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)",
          boxShadow: "0 8px 32px rgba(6, 182, 212, 0.2)"
        });
        gsap.to(icon, {
          scale: CONFIG.ANIMATION.ICON_HOVER_SCALE,
          rotation: CONFIG.ANIMATION.ICON_HOVER_ROTATION,
          duration: CONFIG.ANIMATION.TECH_HOVER_DURATION,
          ease: "back.out(1.2)"
        });
        gsap.to(name, { color: CONFIG.COLORS.CYAN_400, duration: 0.2 });
      };

      const hoverOut = () => {
        item.classList.remove("hovered");
        gsap.to(card, {
          y: 0, scale: 1,
          duration: CONFIG.ANIMATION.TECH_HOVER_DURATION,
          ease: "power2.out",
          borderColor: "rgba(148, 163, 184, 0.15)",
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
        });
        gsap.to(icon, { scale: 1, rotation: 0, duration: CONFIG.ANIMATION.TECH_HOVER_DURATION });
        gsap.to(name, { color: CONFIG.COLORS.WHITE, duration: 0.2 });
      };

      item.addEventListener("mouseenter", hoverIn);
      item.addEventListener("mouseleave", hoverOut);
    });
  }

  destroy() {
    this.cleanupCallbacks.forEach(cleanup => cleanup());
    gsap.killTweensOf("*");
    if (window.ScrollTrigger) ScrollTrigger.killAll();
  }
}
