// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // --- Navigation Bar Logic ---
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Smooth scroll function
  const smoothScrollTo = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      gsap.to(window, {
        duration: 2, // 2.5 seconds for slower scroll
        scrollTo: {
          y: targetElement,
          offsetY: 60, // Adjust offset for fixed navbar
        },
        ease: "power1.inOut",
      });
    }
  };

  // Smooth scroll and close mobile menu on nav link click
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      smoothScrollTo(targetId);

      // Close mobile menu after click
      if (navMenu.classList.contains("active")) {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  });

  // Smooth scroll for all anchor links (including hero buttons)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (!link.classList.contains("nav-link")) {
      // Avoid double handling nav links
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        smoothScrollTo(targetId);
      });
    }
  });

  // --- Data for Dynamic Content ---
  const skills = [
    {
      name: "Frontend Development",
      level: 95,
      icon: `<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16 18l6-6l-6-6M8 6l-6 6l6 6"/></svg>`,
    },
    {
      name: "Backend Development",
      level: 88,
      icon: `<svg class="icon" viewBox="0 0 24 24"><rect width="20" height="8" x="2" y="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" rx="2" ry="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6h.01M6 18h.01"/></svg>`,
    },
    {
      name: "Mobile Development",
      level: 82,
      icon: `<svg class="icon" viewBox="0 0 24 24"><rect width="14" height="20" x="5" y="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" rx="2" ry="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01"/></svg>`,
    },
    {
      name: "UI/UX Design",
      level: 78,
      icon: `<svg class="icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 3l-8.5 8.5a5 5 0 1 0 7 7l8.5-8.5a5 5 0 1 0-7-7z"/></svg>`,
    },
  ];

  const techStacks = [
    { name: "React", color: "from-blue-400 to-cyan-400", icon: "⚛️" },
    { name: "TypeScript", color: "from-blue-500 to-blue-600", icon: "📘" },
    { name: "Node.js", color: "from-green-400 to-green-500", icon: "🟢" },
    { name: "Python", color: "from-yellow-400 to-blue-500", icon: "🐍" },
    { name: "Docker", color: "from-blue-400 to-blue-600", icon: "🐳" },
    { name: "AWS", color: "from-orange-400 to-orange-500", icon: "☁️" },
    { name: "MongoDB", color: "from-green-500 to-green-600", icon: "🍃" },
    { name: "PostgreSQL", color: "from-blue-600 to-indigo-600", icon: "🐘" },
    { name: "Redis", color: "from-red-500 to-red-600", icon: "🔴" },
    { name: "GraphQL", color: "from-pink-500 to-purple-500", icon: "📊" },
    { name: "Next.js", color: "from-gray-700 to-gray-900", icon: "▲" },
    { name: "Vue.js", color: "from-green-400 to-green-500", icon: "💚" },
  ];

  // --- Dynamic Content Injection ---
  const skillsContainer = document.querySelector(".skills-container");
  if (skillsContainer) {
    skills.forEach((skill) => {
      const skillHTML = `
              <div class="skill-item">
                  <div class="skill-header">
                      <div class="skill-info">
                          ${skill.icon}
                          <span class="skill-name">${skill.name}</span>
                      </div>
                      <span class="skill-level">${skill.level}%</span>
                  </div>
                  <div class="skill-bar-bg">
                      <div class="skill-bar-fg" data-level="${skill.level}"></div>
                  </div>
              </div>`;
      skillsContainer.innerHTML += skillHTML;
    });
  }

  const techGrid = document.querySelector("#tech-stack .grid-4-col");
  if (techGrid) {
    techStacks.forEach((tech) => {
      const techHTML = `
              <div class="tech-item">
                  <div class="card">
                      <div class="tech-icon">${tech.icon}</div>
                      <h3 class="tech-name">${tech.name}</h3>
                      <div class="tech-color-bar" style="background: linear-gradient(to right, var(--${tech.color
                        .split(" ")[0]
                        .replace("from-", "")}), var(--${tech.color
        .split(" ")[1]
        .replace("to-", "")}));"></div>
                  </div>
              </div>`;
      techGrid.innerHTML += techHTML;
    });
  }

  // --- Animated Background ---
  const orb1 = document.getElementById("orb1");
  const orb2 = document.getElementById("orb2");

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
      });
      gsap.to(orb2, {
        x: x * -80,
        y: y * -60,
        ease: "power2.out",
        duration: 1,
        overwrite: "auto",
      });

      mouseThrottle = false;
    });
  });

  // Animate SVG path drawing
  gsap.fromTo(
    "#svg-path-1",
    { strokeDashoffset: 1000 },
    {
      strokeDashoffset: 0,
      duration: 3,
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
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    }
  );

  // --- Hero Section Animation ---
  const heroTl = gsap.timeline();
  heroTl
    .fromTo(
      ".hero-title",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(
      ".hero-buttons",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );

  gsap.to(".floating-icon", {
    y: -20,
    duration: 2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1,
    stagger: 0.3,
  });

  // Rotating doodo background animation
  gsap.to(".doodo-background", {
    rotation: 360,
    duration: 30,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
  });

  // --- Scroll-Triggered Animations ---

  // About Section - staggered animation from bottom to top
  gsap.fromTo(
    ".profile-card-wrapper",
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );

  gsap.fromTo(
    ".about-text",
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 0.3,
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );

  // Skill bars animation
  document.querySelectorAll(".skill-bar-fg").forEach((bar) => {
    gsap.to(bar, {
      width: `${bar.dataset.level}%`,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: bar,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Portfolio Carousel Animation with Drag Support
  const portfolioCarousel = document.querySelector(".portfolio-carousel");
  const portfolioCards = document.querySelectorAll(".portfolio-card");
  const portfolioContainer = document.querySelector(
    ".portfolio-carousel-container"
  );

  if (portfolioCarousel && portfolioCards.length > 0) {
    // Clone first few cards to create infinite loop effect
    portfolioCards.forEach((card) => {
      const clone = card.cloneNode(true);
      portfolioCarousel.appendChild(clone);
    });

    // Calculate responsive card width and gap
    const isMobile = window.innerWidth <= 768;
    const cardWidth = isMobile ? 280 : 350;
    const gap = isMobile ? 24 : 32;
    const totalWidth = (cardWidth + gap) * portfolioCards.length;

    let currentX = 0;
    let isDragging = false;

    // Simple infinite scroll animation
    let portfolioTl;
    let isManualControl = false;
    let resumeTimer = null;

    const startAutoScroll = () => {
      if (portfolioTl) portfolioTl.kill();

      // First set the current position
      gsap.set(portfolioCarousel, { x: currentX });

      // Use a modulus approach with repeat -1 for true infinite scrolling
      portfolioTl = gsap.to(portfolioCarousel, {
        x: `-=${totalWidth}`,
        duration: 60,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            // Use modulus to keep position in range without visible jumps
            const numX = parseFloat(x);
            let result = numX % totalWidth;
            if (result > 0) result -= totalWidth;
            currentX = result;
            updateIndicators();
            return result + "px";
          },
        },
      });
    };

    const resumeAutoScroll = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        if (!isDragging) {
          isManualControl = false;
          startAutoScroll();
        }
      }, 3000);
    };

    // Start initial animation
    startAutoScroll();

    // Mouse drag functionality
    let startX = 0;
    let startScrollX = 0;

    const handleDragStart = (e) => {
      isDragging = true;
      isManualControl = true;
      if (portfolioTl) portfolioTl.pause();
      if (resumeTimer) clearTimeout(resumeTimer);

      startX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
      startScrollX = currentX;
      portfolioContainer.style.cursor = "grabbing";
    };

    const handleDragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
      const deltaX = (clientX - startX) * 0.5;
      let newX = startScrollX + deltaX;

      // Simple boundary handling - keep in range
      while (newX > 0) newX -= totalWidth;
      while (newX <= -totalWidth) newX += totalWidth;

      gsap.set(portfolioCarousel, { x: newX });
      currentX = newX;
      updateIndicators();
    };

    const handleDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      portfolioContainer.style.cursor = "grab";

      resumeAutoScroll();
    };

    // Mouse events
    portfolioContainer.addEventListener("mousedown", handleDragStart);
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);

    // Touch events
    portfolioContainer.addEventListener("touchstart", handleDragStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);

    // Wheel/scroll support - only respond to horizontal scrolling
    portfolioContainer.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        isManualControl = true;
        if (portfolioTl) portfolioTl.pause();
        if (resumeTimer) clearTimeout(resumeTimer);

        const deltaX = e.deltaX;
        let newX = currentX - deltaX * 1;

        while (newX > 0) newX -= totalWidth;
        while (newX <= -totalWidth) newX += totalWidth;

        gsap.set(portfolioCarousel, { x: newX });
        currentX = newX;
        updateIndicators();

        resumeAutoScroll();
      }
    });

    // Pause on hover
    portfolioContainer.addEventListener("mouseenter", () => {
      if (!isManualControl && portfolioTl) {
        portfolioTl.pause();
      }
    });

    portfolioContainer.addEventListener("mouseleave", () => {
      if (!isManualControl && !isDragging && portfolioTl) {
        portfolioTl.resume();
      }
    });

    // Set initial cursor style
    portfolioContainer.style.cursor = "grab";

    // Portfolio Indicators functionality
    const indicators = document.querySelectorAll(
      ".portfolio-indicators .indicator"
    );
    const indicatorCardWidth = cardWidth + gap; // reuse existing cardWidth variable

    // Update active indicator based on scroll position (moved up before timeline creation)
    const updateIndicators = () => {
      if (indicators.length === 0) return;
      const scrollProgress = Math.abs(currentX) / totalWidth;
      const activeIndex =
        Math.floor(scrollProgress * portfolioCards.length) %
        portfolioCards.length;

      indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
          indicator.classList.add("active");
        } else {
          indicator.classList.remove("active");
        }
      });
    };

    // Click indicators to navigate
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        isManualControl = true;
        if (portfolioTl) portfolioTl.pause();
        if (resumeTimer) clearTimeout(resumeTimer);

        const targetX = -(indicatorCardWidth * index);
        gsap.to(portfolioCarousel, {
          x: targetX,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            currentX = targetX;
            updateIndicators();
            resumeAutoScroll();
          },
        });
      });
    });

    // Initial indicator update
    updateIndicators();
  }

  // Optimized animation for portfolio cards
  gsap.fromTo(
    ".portfolio-card",
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
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );

  // Tech Stack Section
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
      scrollTrigger: {
        trigger: "#tech-stack",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Tech Stack Card Hover Effects with GSAP
  document.querySelectorAll(".tech-item").forEach((item) => {
    const card = item.querySelector(".card");
    const icon = item.querySelector(".tech-icon");
    const name = item.querySelector(".tech-name");

    item.addEventListener("mouseenter", () => {
      // Add hovered class for pseudo-element control
      item.classList.add("hovered");

      gsap.to(card, {
        y: -6,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        borderColor: "rgba(6, 182, 212, 0.4)",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)",
        boxShadow: "0 8px 32px rgba(6, 182, 212, 0.2)",
      });

      gsap.to(icon, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.2)",
      });

      gsap.to(name, {
        color: "rgba(6, 182, 212, 1)",
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
        duration: 0.3,
        ease: "power2.out",
        borderColor: "rgba(148, 163, 184, 0.15)",
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      });

      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(name, {
        color: "#ffffff",
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });

  // Contact Section - simplified animation for new layout
  gsap.fromTo(
    ".contact-simple",
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );
});
