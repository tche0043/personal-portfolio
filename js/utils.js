// Utilities module - error handling and helper functions

// Development vs Production logging control
const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname.includes('local') ||
         window.location.protocol === 'file:';
};

export class ErrorHandler {
  static logError(context, error, element = null) {
    const errorInfo = {
      context,
      error: error.message || error,
      element: element ? element.toString() : null,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Only log to console in development
    if (isDevelopment()) {
      console.error(`❌ [${context}]`, errorInfo);
    }
    
    // In production, send to error tracking service instead
    // this.sendToErrorTracking(errorInfo);
  }

  static logWarning(context, message, element = null) {
    // Only log to console in development
    if (isDevelopment()) {
      console.warn(`⚠️ [${context}] ${message}`, element || '');
    }
  }

  static logInfo(context, message, data = null) {
    // Only log to console in development
    if (isDevelopment()) {
      console.log(`ℹ️ [${context}] ${message}`, data || '');
    }
  }
}

export class DOMUtils {
  /**
   * Safely query a single element with error handling
   * @param {string} selector - CSS selector string
   * @param {Document|Element} context - Search context element (default: document)
   * @returns {Element|null} Found element or null if not found/error
   */
  static safeQuerySelector(selector, context = document) {
    try {
      const element = context.querySelector(selector);
      if (!element) {
        ErrorHandler.logWarning('DOMUtils', `Element not found: ${selector}`);
      }
      return element;
    } catch (error) {
      ErrorHandler.logError('DOMUtils.safeQuerySelector', error, selector);
      return null;
    }
  }

  /**
   * Safely query multiple elements with error handling
   * @param {string} selector - CSS selector string
   * @param {Document|Element} context - Search context element (default: document)
   * @returns {NodeList} Found elements (empty NodeList if none found/error)
   */
  static safeQuerySelectorAll(selector, context = document) {
    try {
      const elements = context.querySelectorAll(selector);
      if (elements.length === 0) {
        ErrorHandler.logWarning('DOMUtils', `No elements found: ${selector}`);
      }
      return elements;
    } catch (error) {
      ErrorHandler.logError('DOMUtils.safeQuerySelectorAll', error, selector);
      return document.querySelectorAll(''); // Return empty NodeList
    }
  }

  /**
   * Safely add event listener with comprehensive error handling
   * @param {Element|null} element - Target DOM element
   * @param {string} eventType - Event type (e.g., 'click', 'mouseover')
   * @param {Function} handler - Event handler function
   * @param {AddEventListenerOptions} options - Event listener options
   * @returns {boolean} Success status of event listener attachment
   */
  static safeAddEventListener(element, eventType, handler, options = {}) {
    if (!element) {
      ErrorHandler.logWarning('DOMUtils', `Cannot add event listener: element is null (${eventType})`);
      return false;
    }

    if (typeof handler !== 'function') {
      ErrorHandler.logWarning('DOMUtils', `Invalid event handler for ${eventType}`);
      return false;
    }

    try {
      const wrappedHandler = (event) => {
        try {
          handler(event);
        } catch (error) {
          ErrorHandler.logError('EventHandler', error, `${eventType} on ${element.tagName}`);
        }
      };

      element.addEventListener(eventType, wrappedHandler, options);
      return true;
    } catch (error) {
      ErrorHandler.logError('DOMUtils.safeAddEventListener', error, `${eventType} on ${element}`);
      return false;
    }
  }

  /**
   * Safely get element style property
   * @param {Element} element - Target element
   * @param {string} property - CSS property name
   * @returns {string} - Property value or empty string
   */
  static safeGetStyle(element, property) {
    try {
      if (!element) return '';
      return window.getComputedStyle(element).getPropertyValue(property) || '';
    } catch (error) {
      ErrorHandler.logError('DOMUtils.safeGetStyle', error, property);
      return '';
    }
  }
}

export class AnimationUtils {
  /**
   * Safely execute GSAP animation with fallback
   * @param {Function} animationFn - GSAP animation function
   * @param {string} context - Context for error logging
   * @param {Function} fallback - Fallback function if animation fails
   */
  static safeAnimate(animationFn, context = 'Animation', fallback = null) {
    try {
      if (typeof gsap === 'undefined') {
        ErrorHandler.logWarning(context, 'GSAP is not available, skipping animation');
        if (fallback) fallback();
        return null;
      }
      return animationFn();
    } catch (error) {
      ErrorHandler.logError(context, error);
      if (fallback) {
        try {
          fallback();
        } catch (fallbackError) {
          ErrorHandler.logError(`${context}.fallback`, fallbackError);
        }
      }
      return null;
    }
  }

  /**
   * Safely kill GSAP timeline or animation
   * @param {Object} animation - GSAP timeline or tween
   * @param {string} context - Context for error logging
   */
  static safeKill(animation, context = 'Animation') {
    try {
      if (animation && typeof animation.kill === 'function') {
        animation.kill();
      }
    } catch (error) {
      ErrorHandler.logError(`${context}.kill`, error);
    }
  }
}

export class MediaUtils {
  /**
   * Safely check if viewport matches media query
   * @param {string} query - Media query string
   * @returns {boolean} - Match result
   */
  static matchesMedia(query) {
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      ErrorHandler.logError('MediaUtils.matchesMedia', error, query);
      return false;
    }
  }

  /**
   * Safely get viewport dimensions
   * @returns {Object} - Viewport width and height
   */
  static getViewportSize() {
    try {
      return {
        width: window.innerWidth || document.documentElement.clientWidth || 0,
        height: window.innerHeight || document.documentElement.clientHeight || 0
      };
    } catch (error) {
      ErrorHandler.logError('MediaUtils.getViewportSize', error);
      return { width: 0, height: 0 };
    }
  }
}

export class FeatureDetection {
  /**
   * Check if touch events are supported
   * @returns {boolean}
   */
  static isTouchSupported() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Check if Intersection Observer is supported
   * @returns {boolean}
   */
  static isIntersectionObserverSupported() {
    return 'IntersectionObserver' in window;
  }

  /**
   * Check if CSS Grid is supported
   * @returns {boolean}
   */
  static isGridSupported() {
    try {
      return CSS.supports('display', 'grid');
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if requestAnimationFrame is supported
   * @returns {boolean}
   */
  static isRAFSupported() {
    return 'requestAnimationFrame' in window;
  }
}