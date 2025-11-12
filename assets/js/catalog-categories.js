/**
 * Catalog Categories JavaScript - Shows category cards on main catalog page
 */

(function() {
  'use strict';

  // Categories data
  const categories = [
    {
      id: 'laser_hair_removal',
      slug: 'laser-hair-removal',
      name: 'הסרת שיער בלייזר',
      description: 'מכשירי לייזר מתקדמים להסרת שיער יעילה ובטוחה',
      icon: 'fa-spa',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/3-2-2.png',
      count: 1
    },
    {
      id: 'body_contouring',
      slug: 'body-contouring',
      name: 'מכשירי פיסול גוף',
      description: 'טכנולוגיות מתקדמות לפיסול גוף והסרת שומן',
      icon: 'fa-heartbeat',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/6-800.png',
      count: 5
    },
    {
      id: 'skin_resurfacing',
      slug: 'skin-resurfacing',
      name: 'חידוש עור',
      description: 'מכשירים מתקדמים לחידוש עור וטיפולי פנים',
      icon: 'fa-magic',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/IPLSHRE-LIGHT-Machine.png',
      count: 6
    },
    {
      id: 'anti_aging',
      slug: 'anti-aging',
      name: 'אנטי-אייג\'ינג',
      description: 'טכנולוגיות מתקדמות להפחתת קמטים והרמת עור',
      icon: 'fa-star',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/Vertical-HIFU-Machine-1-2.png',
      count: 1
    },
    {
      id: 'laser_treatment',
      slug: 'laser-treatment',
      name: 'טיפולי לייזר',
      description: 'מכשירי לייזר מקצועיים לטיפולים מגוונים',
      icon: 'fa-bolt',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/1.1917.png',
      count: 2
    },
    {
      id: 'skin_analysis',
      slug: 'skin-analysis',
      name: 'ניתוח עור',
      description: 'מכשירים מתקדמים לאבחון וניתוח מצב העור',
      icon: 'fa-microscope',
      image: 'https://nubway.co.il/wp-content/uploads/2025/04/Soft-Green-Typography-Letter-N-Logo-1-1.jpg',
      count: 1
    }
  ];

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    renderCategories();
    initializeMobileMenu();
    initializeStickyHeader();
  }

  /**
   * Render category cards
   */
  function renderCategories() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = categories.map(category => `
      <a href="category-${category.slug}.html" class="category-card">
        <div class="category-card__image-wrapper">
          <img src="${category.image}" alt="${category.name}" class="category-card__image" loading="lazy">
        </div>
        <div class="category-card__content">
          <div class="category-card__icon">
            <i class="fas ${category.icon}"></i>
          </div>
          <h3 class="category-card__title">${category.name}</h3>
          <p class="category-card__description">${category.description}</p>
          <div class="category-card__count">${category.count} מכשירים</div>
          <div class="category-card__cta">
            <span>צפה במכשירים</span>
            <i class="fas fa-arrow-left"></i>
          </div>
        </div>
      </a>
    `).join('');
  }

  /**
   * Initialize mobile menu
   */
  function initializeMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const closeBtn = document.getElementById('mobileMenuClose');

    if (!toggle || !menu) return;

    const openMenu = () => {
      menu.classList.add('mobile-menu--open');
      if (backdrop) backdrop.classList.add('active');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      menu.classList.remove('mobile-menu--open');
      if (backdrop) backdrop.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('mobile-menu--open');
      isOpen ? closeMenu() : openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Close menu when clicking on links
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /**
   * Initialize sticky header
   */
  function initializeStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        header.classList.add('header--sticky');
      } else {
        header.classList.remove('header--sticky');
      }
    }, { passive: true });
  }

})();
