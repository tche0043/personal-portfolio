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
      this.renderPortfolio();
      this.renderPortfolioIndicators();
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

  renderPortfolio() {
    const portfolioCarousel = DOMUtils.safeQuerySelector('.portfolio-carousel');
    if (!portfolioCarousel) {
      ErrorHandler.logWarning(
        "ContentManager",
        "Portfolio carousel element not found"
      );
      return;
    }

    try {
      // 清空現有內容
      portfolioCarousel.innerHTML = "";
      
      // 使用 DocumentFragment 優化性能
      const fragment = document.createDocumentFragment();

      CONFIG.PORTFOLIO_PROJECTS.forEach((project) => {
        const projectCard = this.createProjectCard(project);
        fragment.appendChild(projectCard);
      });

      portfolioCarousel.appendChild(fragment);
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderPortfolio", error);
    }
  }

  createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'portfolio-card';
    
    article.innerHTML = `
      <div class="card-image-container">
        <img
          src="${project.image}"
          alt="${project.title}"
          class="card-image"
          width="500"
          height="300"
          draggable="false"
        />
        <div class="card-image-overlay"></div>
        <a href="${project.link}" class="card-link-button" aria-label="查看專案詳情">
          <svg class="icon" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"
            />
          </svg>
        </a>
      </div>
      <div class="card-content">
        <h3 class="card-title-small">${project.title}</h3>
        <p class="card-description">${project.description}</p>
        <div class="tech-tags">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
      </div>
    `;
    
    return article;
  }

  renderPortfolioIndicators() {
    const indicatorsContainer = DOMUtils.safeQuerySelector('.portfolio-indicators');
    if (!indicatorsContainer) {
      ErrorHandler.logWarning(
        "ContentManager",
        "Portfolio indicators container not found"
      );
      return;
    }

    try {
      // 清空現有指示器
      indicatorsContainer.innerHTML = "";
      
      // 使用 DocumentFragment 優化性能
      const fragment = document.createDocumentFragment();

      CONFIG.PORTFOLIO_PROJECTS.forEach((project, index) => {
        const indicator = document.createElement('div');
        indicator.className = index === 0 ? 'indicator active' : 'indicator';
        indicator.setAttribute('data-index', index);
        indicator.setAttribute('aria-label', `切換到${project.title}`);
        fragment.appendChild(indicator);
      });

      indicatorsContainer.appendChild(fragment);
      
      ErrorHandler.logInfo(
        "ContentManager", 
        `Successfully rendered ${CONFIG.PORTFOLIO_PROJECTS.length} portfolio indicators`
      );
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderPortfolioIndicators", error);
    }
  }
}
