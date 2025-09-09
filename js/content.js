// Content module - 動態注入數據
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
    } catch (error) {
      ErrorHandler.logError("ContentManager.init", error);
    }
  }

  // 填充techStack資料
  renderTechStack() {
    const techGrid = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.TECH_GRID);
    if (!techGrid) return;

    try {
      if (!CONFIG.TECH_STACKS || !Array.isArray(CONFIG.TECH_STACKS)) {
        ErrorHandler.logError(
          "ContentManager.renderTechStack",
          "CONFIG.TECH_STACKS 資料遺失或格式錯誤，此區塊將不會被渲染。"
        );
        return;
      }

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

  // 填充portfolio資料
  renderPortfolio() {
    const portfolioCarousel = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.PORTFOLIO_CAROUSEL);
    const portfolioContainer = DOMUtils.safeQuerySelector(CONFIG.SELECTORS.PORTFOLIO_CONTAINER);
    if (!portfolioCarousel) return;

    if (!CONFIG.PORTFOLIO_PROJECTS || CONFIG.PORTFOLIO_PROJECTS.length === 0) {
      // 如果沒有作品，直接隱藏container
      portfolioContainer.style.display = 'none';
      ErrorHandler.logWarning("ContentManager.renderPortfolio", "作品集為空，已隱藏該區塊。");
      return;
    }

    try {
      const fragment = document.createDocumentFragment();
      CONFIG.PORTFOLIO_PROJECTS.forEach((project, index) => {
        const projectCard = this.createProjectCard(project, index);
        fragment.appendChild(projectCard);
      });
      portfolioCarousel.innerHTML = "";
      portfolioCarousel.appendChild(fragment);
      this.renderPortfolioIndicators();
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderPortfolio", error);
    }
  }

  // 製作portfolio卡片
  createProjectCard(project, index) {
    const article = document.createElement('article');
    article.className = 'portfolio-card';
    article.setAttribute('role', 'group');
    article.setAttribute('aria-roledescription', 'slide');
    article.setAttribute('aria-label', `${index + 1} of ${CONFIG.PORTFOLIO_PROJECTS.length}: ${project.title}`);
    article.setAttribute('aria-hidden', index !== 0);

    article.innerHTML = `
      <div class="card-image-container">
        <img
          src="${project.image}"
          alt="${project.title}"
          class="card-image"
          draggable="false"
        />
        <div class="card-image-overlay"></div>
        <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="card-link-button" aria-label="查看專案：${project.title} (在新分頁中開啟)">
          <svg class="icon" viewBox="0 0 24 24">
            <path
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
  // 製作portfolio 指示器
  renderPortfolioIndicators() {
    const indicatorsContainer = DOMUtils.safeQuerySelector('.portfolio-indicators');
    if (!indicatorsContainer) return;

    try {
      const fragment = document.createDocumentFragment();
      CONFIG.PORTFOLIO_PROJECTS.forEach((project, index) => {
        const indicator = document.createElement('button');
        indicator.className = index === 0 ? 'indicator active' : 'indicator';
        indicator.setAttribute('data-index', index);
        indicator.setAttribute('aria-label', `切換到作品：${project.title}`);
        fragment.appendChild(indicator);
      });
      indicatorsContainer.innerHTML = "";
      indicatorsContainer.appendChild(fragment);
    } catch (error) {
      ErrorHandler.logError("ContentManager.renderPortfolioIndicators", error);
    }
  }
}

