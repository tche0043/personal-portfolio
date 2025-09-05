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
    if (!techGrid) return;

    try {
      if (!CONFIG.TECH_STACKS || !Array.isArray(CONFIG.TECH_STACKS)) return;

      const fragment = document.createDocumentFragment();
      CONFIG.TECH_STACKS.forEach((tech) => {
        const techItem = document.createElement("div");
        techItem.className = "tech-item";
        techItem.innerHTML = `
            <div class="card">
              <div class="tech-icon">${tech.icon}</div>
              <h3 class="tech-name">${tech.name}</h3>
            </div>`;
        fragment.appendChild(techItem);
      });
      techGrid.innerHTML = "";
      techGrid.appendChild(fragment);
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderTechStack", error);
    }
  }

  renderPortfolio() {
    const portfolioCarousel = DOMUtils.safeQuerySelector('.portfolio-carousel');
    if (!portfolioCarousel) return;

    try {
      portfolioCarousel.innerHTML = "";
      const fragment = document.createDocumentFragment();
      CONFIG.PORTFOLIO_PROJECTS.forEach((project, index) => {
        const projectCard = this.createProjectCard(project, index);
        fragment.appendChild(projectCard);
      });
      portfolioCarousel.appendChild(fragment);
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderPortfolio", error);
    }
  }
  
  // ★ 優化：增加 index 參數並添加無障礙屬性
  createProjectCard(project, index) {
    const article = document.createElement('article');
    article.className = 'portfolio-card';
    // ★ 新增：無障礙屬性
    article.setAttribute('role', 'group');
    article.setAttribute('aria-roledescription', 'slide');
    article.setAttribute('aria-label', `${index + 1} of ${CONFIG.PORTFOLIO_PROJECTS.length}: ${project.title}`);
    // ★ 新增：預設將非第一個的卡片對螢幕閱讀器隱藏
    article.setAttribute('aria-hidden', index !== 0);
    
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
        <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="card-link-button" aria-label="查看專案：${project.title} (在新分頁中開啟)">
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
    if (!indicatorsContainer) return;

    try {
      indicatorsContainer.innerHTML = "";
      const fragment = document.createDocumentFragment();
      CONFIG.PORTFOLIO_PROJECTS.forEach((project, index) => {
        const indicator = document.createElement('div'); // ★ 恢復為 div 樣式
        indicator.className = index === 0 ? 'indicator active' : 'indicator';
        indicator.setAttribute('data-index', index);
        indicator.setAttribute('aria-label', `切換到作品：${project.title}`);
        fragment.appendChild(indicator);
      });
      indicatorsContainer.appendChild(fragment);
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderPortfolioIndicators", error);
    }
  }
}

