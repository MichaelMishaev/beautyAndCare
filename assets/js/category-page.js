/**
 * Category Page JavaScript - Loads products for specific category
 * Data matches nubway.co.il exactly
 */

(function() {
  'use strict';

  // Product data (exact prices and names from nubway.co.il)
  const products = [
    {
      id: 'diode-laser',
      name: 'לייזר דיודה בגודל רב נקודות',
      model: 'VL8',
      category: 'laser_hair_removal',
      categoryName: 'הסרת שיער בלייזר',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/3-2-2.png',
      price: '₪89,400',
      shortDescription: 'לייזר דיודה מתקדם עם גדלי ספוט משתנים להסרת שיער יעילה'
    },
    {
      id: '5d-hifu',
      name: 'מכשיר HIFU 5D',
      model: 'SMASFOCUS II',
      category: 'anti_aging',
      categoryName: 'אנטי-אייג׳ינג',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/Vertical-HIFU-Machine-1-2.png',
      price: '₪79,304',
      shortDescription: 'מכשיר HIFU 5D להרמת עור והפחתת קמטים ללא ניתוח'
    },
    {
      id: 'cryolipolysis',
      name: 'מכשיר קריאוליפוליזה',
      model: 'C8',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/360-Cryolipolysis-Machine-3.png',
      price: '₪79,304',
      shortDescription: 'מכשיר קריאוליפוליזה להסרת שומן ופיסול גוף'
    },
    {
      id: 'ipl',
      name: 'מכשיר IPL',
      model: 'ESHR50',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/IPLSHRE-LIGHT-Machine.png',
      price: '₪81,350',
      shortDescription: 'מכשיר IPL לחידוש עור והסרת פיגמנטציה'
    },
    {
      id: 'plasma',
      name: 'מכשיר פלזמה',
      model: 'PLASMA II',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/plasma-machine.png',
      price: '₪80,000',
      shortDescription: 'מכשיר פלזמה לחידוש עור והסרת קמטים'
    },
    {
      id: 'velashape',
      name: 'מכשיר VelaShape',
      model: 'VS II',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/6-800.png',
      price: '₪79,304',
      shortDescription: 'מכשיר VelaShape לפיסול גוף והסרת שומן'
    },
    {
      id: 'vacuum-cavitation',
      name: 'מכשיר ואקום קאוויטציה',
      model: 'S200',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/Vaccume-Machine.png',
      price: '₪38,095',
      shortDescription: 'מכשיר ואקום קאוויטציה לפיסול גוף'
    },
    {
      id: 'picosecond',
      name: 'לייזר פיקוסקונד',
      model: 'PS770',
      category: 'laser_treatment',
      categoryName: 'טיפולי לייזר',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/1.1917.png',
      price: '₪129,645',
      shortDescription: 'לייזר פיקוסקונד להסרת קעקועים ופיגמנטציה'
    },
    {
      id: 'nd-yag',
      name: 'לייזר Nd:YAG',
      model: 'QL Ⅶ',
      category: 'laser_treatment',
      categoryName: 'טיפולי לייזר',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Nd-Yag-Laser-Tattoo-Removal-Machine-2-1-1.png',
      price: '₪42,506',
      shortDescription: 'לייזר Nd:YAG להסרת קעקועים וטיפול בעור'
    },
    {
      id: 'co2-laser',
      name: 'לייזר CO2 פרקציונלי',
      model: 'F9',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/7-800-2-1.png',
      price: '₪145,000',
      shortDescription: 'לייזר CO2 פרקציונלי לחידוש עור והסרת צלקות'
    },
    {
      id: 'skin-analyzer',
      name: 'מכשיר ניתוח עור',
      model: 'QSPC-02',
      category: 'skin_analysis',
      categoryName: 'ניתוח עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/04/Soft-Green-Typography-Letter-N-Logo-1-1.jpg',
      price: '₪32,690',
      shortDescription: 'מכשיר ניתוח עור מתקדם לאבחון מצב העור'
    },
    {
      id: 'hydrafacial',
      name: 'מכשיר Hydrafacial',
      model: 'VCSI',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/pcsi.png',
      price: '₪32,379',
      shortDescription: 'מכשיר Hydrafacial לטיפול בעור וניקוי עמוק'
    },
    {
      id: 'pdt-led',
      name: 'מכשיר טיפול LED',
      model: 'LP100S',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/PDT-Led-Light-Therapy-Machine_%E7%9C%8B%E5%9B%BE%E7%8E%8B-removebg-preview.png',
      price: '₪28,094',
      shortDescription: 'מכשיר טיפול LED לטיפול באקנה ובעיות עור'
    },
    {
      id: 'ems-rf',
      name: 'מכשיר EMS+RF',
      model: 'CL10',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Soft-Green-Typography-Letter-N-Logo-3-1.jpg',
      price: '₪75,304',
      shortDescription: 'מכשיר EMS+RF לפיסול גוף והסרת שומן'
    },
    {
      id: 'pelvic-chair',
      name: 'כיסא אגן',
      model: 'CLY-1',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/image34-1-1.png',
      price: '₪24,506',
      shortDescription: 'כיסא אגן לטיפולי רצפת האגן'
    },
    {
      id: 'skin-cooling',
      name: 'מכשיר קירור עור',
      model: 'AC1',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/122.7-1-1.png',
      price: '₪29,443',
      shortDescription: 'מכשיר קירור עור לטיפולים שונים'
    }
  ];

  // Get category from script tag data attribute
  const scriptTag = document.querySelector('script[data-category]');
  const categoryId = scriptTag ? scriptTag.getAttribute('data-category') : null;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    renderProducts();
    initializeMobileMenu();
  }

  /**
   * Render products for this category
   */
  function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container || !categoryId) return;

    const categoryProducts = products.filter(p => p.category === categoryId);

    if (categoryProducts.length === 0) {
      container.innerHTML = '<p>לא נמצאו מכשירים בקטגוריה זו</p>';
      return;
    }

    container.innerHTML = categoryProducts.map(product => `
      <a href="product-detail.html?id=${product.id}" class="machine-card">
        <div class="machine-card__image-wrapper">
          <img src="${product.image}" alt="${product.model}" class="machine-card__image" loading="lazy">
        </div>
        <div class="machine-card__content">
          <h3 class="machine-card__title">${product.name}</h3>
          <p class="machine-card__description">${product.shortDescription}</p>
          <div class="machine-card__price">${product.price}</div>
          <div class="machine-card__cta">
            <span>צפה בפרטים</span>
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
    const nav = document.querySelector('.header__nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('mobile-menu--open');
      if (isOpen) {
        nav.classList.remove('mobile-menu--open');
        toggle.classList.remove('active');
      } else {
        nav.classList.add('mobile-menu--open');
        toggle.classList.add('active');
      }
    });
  }

})();
