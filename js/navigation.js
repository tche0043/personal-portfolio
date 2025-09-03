// Navigation module - handles navigation bar logic and smooth scrolling
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
      this.bindElements();
      this.setupEventListeners();
      this.setupSmoothScroll();
    } catch (error) {
      ErrorHandler.logError("Navigation.init", error);
    }
  }

  bindElements() {
    this.navToggle = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.NAV_TOGGLE);
    this.navMenu = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.NAV_MENU);
    this.navLinks = DOMUtils.safeQuerySelectorAll(CONFIG.SELECTORS.NAV_LINKS);
  }

  setupEventListeners() {
    if (!this.navToggle || !this.navMenu) {
      ErrorHandler.logWarning(
        "Navigation",
        "Navigation elements not found, mobile menu will not work"
      );
      return;
    }

    // Mobile menu toggle
    DOMUtils.safeAddEventListener(this.navToggle, "click", () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking nav links
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
      // Smooth scroll for all anchor links (including hero buttons)
      const anchorLinks = DOMUtils.safeQuerySelectorAll('a[href^="#"]');
      anchorLinks.forEach((link) => {
        if (!link.classList.contains("nav-link")) {
          // Avoid double handling nav links
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
    if (this.navMenu.classList.contains("active")) {
      this.navToggle.classList.remove("active");
      this.navMenu.classList.remove("active");
    }
  }

  smoothScrollTo(targetId) {
    const targetElement = DOMUtils.safeQuerySelector(targetId);
    if (!targetElement) {
      ErrorHandler.logWarning(
        "Navigation",
        `Smooth scroll target not found: ${targetId}`
      );
      return;
    }

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
        // Fallback: use native smooth scroll
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    );
  }
}
