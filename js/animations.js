// Animations module - handles GSAP animations and effects
import { CONFIG } from "./config.js";
import {
  DOMUtils,
  ErrorHandler,
  AnimationUtils,
  FeatureDetection,
} from "./utils.js";

export class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    try {
      // Check if animations should be enabled
      if (!this.shouldEnableAnimations()) {
        ErrorHandler.logWarning(
          "AnimationManager",
          "Animations disabled due to user preference or browser support"
        );
        return;
      }

      this.setupBackgroundAnimations();
      this.setupHeroAnimations();
      this.setupScrollTriggeredAnimations();
      this.setupTechStackAnimations();
    } catch (error) {
      ErrorHandler.logError("AnimationManager.init", error);
    }
  }

  shouldEnableAnimations() {
    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }

    // Check if GSAP is available
    if (typeof gsap === "undefined") {
      ErrorHandler.logWarning("AnimationManager", "GSAP not available");
      return false;
    }

    return true;
  }

  setupBackgroundAnimations() {
    // Animated background orbs with mouse interaction
    this.setupOrbMouseTracking();

    // Animate SVG path drawing
    this.setupSVGAnimations();

    // Rotating doodo background animation
    this.setupDoodoAnimation();
  }

  setupOrbMouseTracking() {
    const orb1 = document.getElementById("orb1");
    const orb2 = document.getElementById("orb2");

    if (!orb1 || !orb2) return;

    // Throttle mouse movement for better performance
    let mouseThrottle = false;
    window.addEventListener("mousemove", (e) => {
      if (mouseThrottle) return;
      mouseThrottle = true;

      requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const x = clientX / window.innerWidth;
        const y = clientY / window.innerHeight;

        gsap.to(orb1, {
          x: x * 100,
          y: y * 100,
          ease: "power2.out",
          duration: 1,
          overwrite: "auto",
          force3D: true,
        });
        gsap.to(orb2, {
          x: x * -80,
          y: y * -60,
          ease: "power2.out",
          duration: 1,
          overwrite: "auto",
          force3D: true,
        });

        mouseThrottle = false;
      });
    });
  }

  setupSVGAnimations() {
    // Animate SVG path drawing
    gsap.fromTo(
      "#svg-path-1",
      { strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        duration: CONFIG.ANIMATION.SVG_PATH_DURATION_1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }
    );
    gsap.fromTo(
      "#svg-path-2",
      { strokeDashoffset: 1000 },
      {
        strokeDashoffset: 0,
        duration: CONFIG.ANIMATION.SVG_PATH_DURATION_2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: CONFIG.ANIMATION.SVG_PATH_DELAY,
      }
    );
  }

  setupDoodoAnimation() {
    const doodoBackground = document.querySelector(
      CONFIG.SELECTORS.DOODO_BACKGROUND
    );
    if (doodoBackground) {
      gsap.to(doodoBackground, {
        rotation: 360,
        duration: CONFIG.ANIMATION.DOODO_ROTATION_DURATION,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    }
  }

  setupHeroAnimations() {
    const heroTitle = document.querySelector(CONFIG.SELECTORS.HERO_TITLE);
    const heroButtons = document.querySelector(CONFIG.SELECTORS.HERO_BUTTONS);

    if (heroTitle && heroButtons) {
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(
          heroTitle,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: CONFIG.ANIMATION.HERO_TITLE_DURATION,
            ease: "power3.out",
          }
        )
        .fromTo(
          heroButtons,
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

    // Floating icons animation
    const floatingIcons = document.querySelectorAll(
      CONFIG.SELECTORS.FLOATING_ICONS
    );
    if (floatingIcons.length > 0) {
      gsap.to(floatingIcons, {
        y: -20,
        duration: CONFIG.ANIMATION.FLOATING_ICON_DURATION,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: CONFIG.ANIMATION.FLOATING_ICON_STAGGER,
      });
    }
  }

  setupScrollTriggeredAnimations() {
    // About Section - staggered animation with smaller displacement to prevent scrollbar
    gsap.set(".profile-card-wrapper", { y: 30, opacity: 0 });
    gsap.set(".about-text", { y: 30, opacity: 0 });

    gsap.to(".profile-card-wrapper", {
      y: 0,
      opacity: 1,
      duration: CONFIG.ANIMATION.SECTION_ANIMATION_DURATION,
      ease: "power3.out",
      force3D: true,
      scrollTrigger: {
        trigger: "#about",
        start: CONFIG.SCROLL_TRIGGER.START_POSITION,
        toggleActions: CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
      },
    });

    gsap.to(".about-text", {
      y: 0,
      opacity: 1,
      duration: CONFIG.ANIMATION.SECTION_ANIMATION_DURATION,
      ease: "power3.out",
      delay: CONFIG.ANIMATION.SECTION_ANIMATION_DELAY,
      force3D: true,
      scrollTrigger: {
        trigger: "#about",
        start: CONFIG.SCROLL_TRIGGER.START_POSITION,
        toggleActions: CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
      },
    });

    // Portfolio Section animation
    gsap.fromTo(
      CONFIG.SELECTORS.PORTFOLIO_CARDS,
      { y: 80, opacity: 0, scale: 0.75 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: "#portfolio",
          start: CONFIG.SCROLL_TRIGGER.START_POSITION,
          toggleActions: CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
        },
      }
    );

    // Tech Stack Section animation
    gsap.fromTo(
      ".tech-item",
      { y: 50, opacity: 0, rotationY: 45 },
      {
        y: 0,
        opacity: 1,
        rotationY: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: "#tech-stack",
          start: CONFIG.SCROLL_TRIGGER.START_POSITION,
          end: CONFIG.SCROLL_TRIGGER.END_POSITION,
          toggleActions: CONFIG.SCROLL_TRIGGER.REVERSE_TOGGLE_ACTIONS,
        },
      }
    );

    // Contact Section animation
    gsap.fromTo(
      ".contact-simple",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: CONFIG.ANIMATION.SECTION_ANIMATION_DURATION,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: "#contact",
          start: CONFIG.SCROLL_TRIGGER.START_POSITION,
          toggleActions: CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
        },
      }
    );
  }

  setupTechStackAnimations() {
    // Tech Stack Card Hover Effects with GSAP
    document.querySelectorAll(CONFIG.SELECTORS.TECH_ITEMS).forEach((item) => {
      const card = item.querySelector(".card");
      const icon = item.querySelector(".tech-icon");
      const name = item.querySelector(".tech-name");

      if (!card || !icon || !name) return;

      item.addEventListener("mouseenter", () => {
        // Add hovered class for pseudo-element control
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

        gsap.to(name, {
          color: CONFIG.COLORS.CYAN_400,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      item.addEventListener("mouseleave", () => {
        // Remove hovered class
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
          ease: "power2.out",
        });

        gsap.to(name, {
          color: CONFIG.COLORS.WHITE,
          duration: 0.2,
          ease: "power2.out",
        });
      });
    });
  }
}
