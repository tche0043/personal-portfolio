// Content module - handles dynamic content injection
import { CONFIG } from "./config.js";
import { DOMUtils, ErrorHandler } from "./utils.js";

export class ContentManager {
  constructor() {
    this.init();
  }

  init() {
    try {
      this.renderTechStack();
    } catch (error) {
      ErrorHandler.logError("ContentManager.init", error);
    }
  }

  renderTechStack() {
    const techGrid = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.TECH_GRID);
    if (!techGrid) {
      ErrorHandler.logWarning(
        "ContentManager",
        "Tech grid element not found, tech stack will not render"
      );
      return;
    }

    try {
      if (!CONFIG.TECH_STACKS || !Array.isArray(CONFIG.TECH_STACKS)) {
        ErrorHandler.logWarning(
          "ContentManager",
          "Tech stacks data not found or invalid"
        );
        return;
      }

      // ★ 關鍵優化：使用 DocumentFragment 避免多次 DOM reflow
      const fragment = document.createDocumentFragment();

      CONFIG.TECH_STACKS.forEach((tech, index) => {
        if (!tech.name || !tech.icon) {
          ErrorHandler.logWarning(
            "ContentManager",
            `Invalid tech stack item at index ${index}`,
            tech
          );
          return;
        }

        const techItem = document.createElement("div");
        techItem.className = "tech-item";
        techItem.innerHTML = `
            <div class="card">
              <div class="tech-icon">${tech.icon}</div>
              <h3 class="tech-name">${tech.name}</h3>
            </div>`;
        fragment.appendChild(techItem);
      });

      // 清空現有內容
      techGrid.innerHTML = "";
      // 一次性將所有新元素附加到 DOM
      techGrid.appendChild(fragment);
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderTechStack", error);
    }
  }
}
