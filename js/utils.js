// Utilities module - 錯誤處理以及小工具

// 判斷是否為開發模式
const isDevelopment = () => {
  return window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:';
};

// 錯誤處理class
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

    // 如果為開發模式使用console, 如果不是則傳到Sentry
    if (isDevelopment()) {
      console.error(`❌ [${context}]`, errorInfo);
    } else {
      if (window.Sentry) {
        window.Sentry.captureException(error, { extra: errorInfo });
      }
    }
  }

  static logWarning(context, message, element = null) {
    if (isDevelopment()) {
      console.warn(`⚠️ [${context}] ${message}`, element || '');
    } else {
      const sentryContext = {
        level: "warning",
        extra: {}
      };

      if (element) {
        sentryContext.extra.element = element;
      }

      if (window.Sentry) {
        window.Sentry.captureMessage(`[${context}] ${message}`, sentryContext);
      }
    }
  }

  static logInfo(context, message, data = null) {
    if (isDevelopment()) {
      console.log(`ℹ️ [${context}] ${message}`, data || '');
    } else {
      const sentryContext = {
        level: "info",
        extra: {}
      };

      if (data) {
        sentryContext.extra.data = data;
      }

      if (window.Sentry) {
        window.Sentry.captureMessage(`[${context}] ${message}`, sentryContext);
      }
    }
  }
}

export class DOMUtils {
  /**
   * 安全地查詢單一元素，包含錯誤處理
   * @param {string} selector - CSS 選擇器字串
   * @param {Document|Element} context - 搜尋範圍的上下文元素 (預設為 document)
   * @returns {Element|null} 找到的元素，如果未找到或出錯則返回 null
   */
  static safeQuerySelector(selector, context = document) {
    try {
      const element = context.querySelector(selector);
      if (!element) {
        ErrorHandler.logWarning('DOMUtils', `無法找到該元素: ${selector}`);
      }
      return element;
    } catch (error) {
      ErrorHandler.logError('DOMUtils.safeQuerySelector', error, selector);
      return null;
    }
  }

  /**
   * 安全的查詢多個元素，包含錯誤處理
   * @param {string} selector - CSS 選擇器字串
   * @param {Document|Element} context - 搜尋範圍的上下文元素 (預設為 document)
   * @returns {NodeList} 找到的元素集合 (如果未找到或出錯則返回空的 NodeList)
   */
  static safeQuerySelectorAll(selector, context = document) {
    try {
      const elements = context.querySelectorAll(selector);
      if (elements.length === 0) {
        ErrorHandler.logWarning('DOMUtils', `沒有找到任何元素: ${selector}`);
      }
      return elements;
    } catch (error) {
      ErrorHandler.logError('DOMUtils.safeQuerySelectorAll', error, selector);
      return document.querySelectorAll('');
    }
  }

  /**
   * 安全地新增事件監聽器，包含完整的錯誤處理
   * @param {Element|null} element - 目標 DOM 元素
   * @param {string} eventType - 事件類型 (例如 'click', 'mouseover')
   * @param {Function} handler - 事件處理函式
   * @param {AddEventListenerOptions} options - 事件監聽器選項
   * @returns {boolean} 事件監聽器是否成功附加的狀態
   */
  static safeAddEventListener(element, eventType, handler, options = {}) {
    if (!element) {
      ErrorHandler.logWarning('DOMUtils', `無法新增事件監聽器：目標元素為 null (${eventType})`);
      return false;
    }

    if (typeof handler !== 'function') {
      ErrorHandler.logWarning('DOMUtils', `提供給 ${eventType} 的事件處理常式無效`);
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
}

export class AnimationUtils {
  /**
   * 安全地執行 GSAP 動畫，包含備用方案
   * @param {Function} animationFn - GSAP 動畫函式
   * @param {string} context - 用於錯誤日誌的上下文
   * @param {Function} fallback - 動畫失敗時的備用函式
   */
  static safeAnimate(animationFn, context = 'Animation', fallback = null) {
    try {
      if (typeof gsap === 'undefined') {
        ErrorHandler.logWarning(context, 'GSAP 函式庫未載入，跳過動畫');
        if (fallback) {
          try {
            fallback();
          } catch (fallbackError) {
            ErrorHandler.logError(`${context}.fallback`, fallbackError);
          }
        }
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
   * 安全地終止 GSAP 時間軸或動畫
   * @param {Object} animation - GSAP 時間軸或 tween
   * @param {string} context - 用於錯誤日誌的上下文
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

  //安全地終止所有ScrollTriggers
  static safeKillAllScrollTriggers() {
    try {
      if (window.ScrollTrigger) {
        ScrollTrigger.killAll();
      }
    } catch (error) {
      ErrorHandler.logError('AnimationUtils.safeKillAllScrollTriggers', error);
    }
  }

  /**
   * 使用 requestAnimationFrame 對函式進行節流
   * 限制一個函式在瀏覽器的每一幀中最多只執行一次。
   * @param {Function} fn - 要被節流的函式
   * @returns {Function} - 一個新的、被節流過的函式
   */
  static throttleWithRAF(fn) {
    let rafId = null;
    // 將fn進行節流
    const throttledFn = function (...args) {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        fn(...args);
        rafId = null;
      });
    };
    // 創建一個cancel function用於資源回收
    throttledFn.cancel = function () {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    return throttledFn;

  }
}