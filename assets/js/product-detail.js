/**
 * Product Detail Page JavaScript - Universal template for all products
 * Data matches nubway.co.il exactly
 */

(function() {
  'use strict';

  // Complete product database (exact prices and data from nubway.co.il)
  const productsDB = {
    'diode-laser': {
      id: 'diode-laser',
      name: 'לייזר דיודה בגודל רב נקודות',
      model: 'VL8',
      category: 'laser_hair_removal',
      categoryName: 'הסרת שיער בלייזר',
      categorySlug: 'laser-hair-removal',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/3-2-2.png',
      price: '₪89,400',
      shortDescription: 'לייזר דיודה מתקדם עם גדלי ספוט משתנים להסרת שיער יעילה',
      longDescription: 'מכשיר לייזר דיודה מקצועי עם גדלי ספוט משתנים להסרת שיער יעילה ובטוחה. טכנולוגיה מתקדמת עם תוצאות מעולות לכל סוגי העור.',
      features: [
        'לייזר דיודה 808nm מתקדם',
        'גדלי ספוט משתנים (12mm, 15mm)',
        'מערכת קירור מתקדמת',
        'מהירות טיפול גבוהה',
        'מתאים לכל סוגי העור',
        'תוצאות קבועות'
      ],
      specifications: {
        'טכנולוגיה': 'Diode Laser 808nm',
        'גודל ספוט': '12mm, 15mm',
        'הספק': '1200W',
        'תצוגה': 'מסך מגע 10.4"',
        'קירור': 'מערכת קירור TEC',
        'משקל': '65 ק"ג'
      },
      certifications: ['CE', 'ISO 13485', 'אישור משרד הבריאות'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים ללא הון עצמי'
    },
    '5d-hifu': {
      id: '5d-hifu',
      name: 'מכשיר HIFU 5D',
      model: 'SMASFOCUS II',
      category: 'anti_aging',
      categoryName: 'אנטי-אייג׳ינג',
      categorySlug: 'anti-aging',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/Vertical-HIFU-Machine-1-2.png',
      price: '₪79,304',
      shortDescription: 'מכשיר HIFU 5D להרמת עור והפחתת קמטים ללא ניתוח',
      longDescription: 'מכשיר HIFU 5D מקצועי להרמת עור והפחתת קמטים. טכנולוגיית אולטרסאונד ממוקד בעוצמה גבוהה לטיפול אנטי-אייג\'ינג מתקדם.',
      features: [
        'טכנולוגיית HIFU 5D',
        'הרמת עור ללא ניתוח',
        'הפחתת קמטים',
        '7 ראשי טיפול שונים',
        'עומקי חדירה מגוונים',
        'תוצאות מיידיות'
      ],
      specifications: {
        'טכנולוגיה': 'HIFU 5D',
        'עומקי טיפול': '1.5mm, 3.0mm, 4.5mm',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'ראשי טיפול': '7',
        'משקל': '45 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'cryolipolysis': {
      id: 'cryolipolysis',
      name: 'מכשיר קריאוליפוליזה',
      model: 'C8',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      categorySlug: 'body-contouring',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/360-Cryolipolysis-Machine-3.png',
      price: '₪79,304',
      shortDescription: 'מכשיר קריאוליפוליזה להסרת שומן ופיסול גוף',
      longDescription: 'מכשיר קריאוליפוליזה מקצועי להסרת שומן בקפאה. טכנולוגיה מתקדמת להסרת שומן קבועה ללא ניתוח.',
      features: [
        'טכנולוגיית קריאוליפוליזה 360°',
        'הסרת שומן קבועה',
        '4 ראשי טיפול',
        'טיפול בו-זמני במספר אזורים',
        'בטיחות מקסימלית',
        'תוצאות מעולות'
      ],
      specifications: {
        'טכנולוגיה': 'Cryolipolysis 360°',
        'טמפרטורה': '-11°C עד 5°C',
        'ראשי טיפול': '4',
        'תצוגה': 'מסך מגע 10.4"',
        'הספק': '800W',
        'משקל': '50 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'ipl': {
      id: 'ipl',
      name: 'מכשיר IPL',
      model: 'ESHR50',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      categorySlug: 'skin-resurfacing',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/IPLSHRE-LIGHT-Machine.png',
      price: '₪81,350',
      shortDescription: 'מכשיר IPL לחידוש עור והסרת פיגמנטציה',
      longDescription: 'מכשיר IPL מקצועי לחידוש עור, הסרת פיגמנטציה והסרת שיער. טכנולוגיה מתקדמת לטיפולים מגוונים.',
      features: [
        'טכנולוגיית IPL+SHR',
        'חידוש עור',
        'הסרת פיגמנטציה',
        'הסרת שיער',
        'טיפול בכלי דם',
        'תוצאות מהירות'
      ],
      specifications: {
        'טכנולוגיה': 'IPL + SHR',
        'אורך גל': '480-1200nm',
        'הספק': '3000W',
        'גודל ספוט': '15×50mm',
        'תצוגה': 'מסך מגע 10.4"',
        'משקל': '55 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'plasma': {
      id: 'plasma',
      name: 'מכשיר פלזמה',
      model: 'PLASMA II',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      categorySlug: 'skin-resurfacing',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/plasma-machine.png',
      price: '₪80,000',
      shortDescription: 'מכשיר פלזמה לחידוש עור והסרת קמטים',
      longDescription: 'מכשיר פלזמה מקצועי לחידוש עור, הסרת קמטים והצרת עפעפיים. טכנולוגיה מתקדמת לתוצאות דרמטיות.',
      features: [
        'טכנולוגיית פלזמה מתקדמת',
        'חידוש עור',
        'הסרת קמטים',
        'הצרת עפעפיים',
        'טיפול בצלקות',
        'תוצאות ארוכות טווח'
      ],
      specifications: {
        'טכנולוגיה': 'Plasma',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'מספר רמות': '5',
        'גודל': 'קומפקטי',
        'משקל': '15 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'velashape': {
      id: 'velashape',
      name: 'מכשיר VelaShape',
      model: 'VS II',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      categorySlug: 'body-contouring',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/6-800.png',
      price: '₪79,304',
      shortDescription: 'מכשיר VelaShape לפיסול גוף והסרת שומן',
      longDescription: 'מכשיר VelaShape לפיסול גוף והסרת צלוליט. משלב 4 טכנולוגיות לתוצאות מיטביות.',
      features: [
        'שילוב RF + IR + Vacuum + Massage',
        'פיסול גוף',
        'הסרת צלוליט',
        'הידוק עור',
        'תוצאות מהירות',
        'טיפול נעים'
      ],
      specifications: {
        'טכנולוגיה': 'RF + IR + Vacuum',
        'תדר RF': '1MHz',
        'הספק': '300W',
        'תצוגה': 'מסך מגע',
        'ראשי טיפול': '2',
        'משקל': '40 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'vacuum-cavitation': {
      id: 'vacuum-cavitation',
      name: 'מכשיר ואקום קאוויטציה',
      model: 'S200',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      categorySlug: 'body-contouring',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/Vaccume-Machine.png',
      price: '₪38,095',
      shortDescription: 'מכשיר ואקום קאוויטציה לפיסול גוף',
      longDescription: 'מכשיר ואקום קאוויטציה מקצועי לפיסול גוף והסרת שומן. טכנולוגיה משולבת לתוצאות מקסימליות.',
      features: [
        'ואקום + קאוויטציה',
        'RF מתקדם',
        'פיסול גוף',
        'הסרת שומן',
        'הידוק עור',
        '6 ראשי טיפול'
      ],
      specifications: {
        'טכנולוגיה': 'Vacuum + Cavitation + RF',
        'תדר קאוויטציה': '40KHz',
        'ראשי טיפול': '6',
        'תצוגה': 'מסך מגע',
        'הספק': '250W',
        'משקל': '35 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'picosecond': {
      id: 'picosecond',
      name: 'לייזר פיקוסקונד',
      model: 'PS770',
      category: 'laser_treatment',
      categoryName: 'טיפולי לייזר',
      categorySlug: 'laser-treatment',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/1.1917.png',
      price: '₪129,645',
      shortDescription: 'לייזר פיקוסקונד להסרת קעקועים ופיגמנטציה',
      longDescription: 'לייזר פיקוסקונד מקצועי להסרת קעקועים, פיגמנטציה וחידוש עור. טכנולוגיה מתקדמת עם פולסים קצרים במיוחד.',
      features: [
        'לייזר פיקוסקונד 770ps',
        'הסרת קעקועים יעילה',
        'הסרת פיגמנטציה',
        '3 אורכי גל',
        'חידוש עור',
        'תוצאות מהירות'
      ],
      specifications: {
        'טכנולוגיה': 'Picosecond Laser',
        'אורכי גל': '532nm, 755nm, 1064nm',
        'רוחב פולס': '770ps',
        'הספק': '2000mJ',
        'תצוגה': 'מסך מגע',
        'משקל': '60 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'nd-yag': {
      id: 'nd-yag',
      name: 'לייזר Nd:YAG',
      model: 'QL Ⅶ',
      category: 'laser_treatment',
      categoryName: 'טיפולי לייזר',
      categorySlug: 'laser-treatment',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Nd-Yag-Laser-Tattoo-Removal-Machine-2-1-1.png',
      price: '₪42,506',
      shortDescription: 'לייזר Nd:YAG להסרת קעקועים וטיפול בעור',
      longDescription: 'לייזר Nd:YAG להסרת קעקועים, פיגמנטציה וטיפול בכלי דם. טכנולוגיה מוכחת לתוצאות מעולות.',
      features: [
        'לייזר Nd:YAG Q-Switched',
        'הסרת קעקועים',
        'הסרת פיגמנטציה',
        '2 אורכי גל',
        'טיפול בכלי דם',
        'בטיחות גבוהה'
      ],
      specifications: {
        'טכנולוגיה': 'Nd:YAG Q-Switched',
        'אורכי גל': '532nm, 1064nm',
        'רוחב פולס': '6-10ns',
        'הספק': '1500mJ',
        'תצוגה': 'מסך LCD',
        'משקל': '45 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'co2-laser': {
      id: 'co2-laser',
      name: 'לייזר CO2 פרקציונלי',
      model: 'F9',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      categorySlug: 'skin-resurfacing',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/7-800-2-1.png',
      price: '₪145,000',
      shortDescription: 'לייזר CO2 פרקציונלי לחידוש עור והסרת צלקות',
      longDescription: 'לייזר CO2 פרקציונלי לחידוש עור, הסרת צלקות וקמטים עמוקים. טכנולוגיה מתקדמת לתוצאות דרמטיות.',
      features: [
        'לייזר CO2 פרקציונלי',
        'חידוש עור עמוק',
        'הסרת צלקות',
        'הסרת קמטים',
        'הידוק עור',
        'תוצאות ארוכות טווח'
      ],
      specifications: {
        'טכנולוגיה': 'Fractional CO2 Laser',
        'אורך גל': '10600nm',
        'הספק': '60W',
        'מצבי טיפול': 'Fractional + Normal',
        'תצוגה': 'מסך מגע',
        'משקל': '70 ק"ג'
      },
      certifications: ['CE', 'ISO 13485', 'FDA'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'skin-analyzer': {
      id: 'skin-analyzer',
      name: 'מכשיר ניתוח עור',
      model: 'QSPC-02',
      category: 'skin_analysis',
      categoryName: 'ניתוח עור',
      categorySlug: 'skin-analysis',
      image: 'https://nubway.co.il/wp-content/uploads/2025/04/Soft-Green-Typography-Letter-N-Logo-1-1.jpg',
      price: '₪32,690',
      shortDescription: 'מכשיר ניתוח עור מתקדם לאבחון מצב העור',
      longDescription: 'מכשיר ניתוח עור מתקדם לאבחון מצב העור, פיגמנטציה, קמטים ועוד. כולל מצלמה ותוכנה מקצועית.',
      features: [
        'ניתוח עור מקצועי',
        'זיהוי פיגמנטציה',
        'ניתוח קמטים',
        'בדיקת לחות',
        'דוחות מקצועיים',
        'תיעוד ומעקב'
      ],
      specifications: {
        'טכנולוגיה': 'RGB + UV Analysis',
        'מצלמה': '20MP',
        'תאורה': 'RGB + UV + PL',
        'תוכנה': 'ניתוח מקצועי',
        'תצוגה': 'מסך מגע',
        'משקל': '25 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'hydrafacial': {
      id: 'hydrafacial',
      name: 'מכשיר Hydrafacial',
      model: 'VCSI',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      categorySlug: 'skin-resurfacing',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/pcsi.png',
      price: '₪32,379',
      shortDescription: 'מכשיר Hydrafacial לטיפול בעור וניקוי עמוק',
      longDescription: 'מכשיר Hydrafacial לניקוי עור עמוק, פילינג וחידוש עור. טיפול משולב בתהליך אחד.',
      features: [
        'ניקוי עור עמוק',
        'פילינג',
        'סילוק נקודות שחורות',
        'הזרקת סרום',
        'הידרציה',
        'תוצאות מיידיות'
      ],
      specifications: {
        'טכנולוגיה': 'Hydrafacial',
        'מספר שלבים': '3',
        'ראשי טיפול': '6',
        'תצוגה': 'מסך מגע',
        'הספק': '250W',
        'משקל': '30 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'pdt-led': {
      id: 'pdt-led',
      name: 'מכשיר טיפול LED',
      model: 'LP100S',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      categorySlug: 'skin-resurfacing',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/PDT-Led-Light-Therapy-Machine_%E7%9C%8B%E5%9B%BE%E7%8E%8B-removebg-preview.png',
      price: '₪28,094',
      shortDescription: 'מכשיר טיפול LED לטיפול באקנה ובעיות עור',
      longDescription: 'מכשיר טיפול LED מקצועי לטיפול באקנה, אנטי-אייג\'ינג וחידוש עור. מגוון צבעים לטיפולים שונים.',
      features: [
        'טיפול LED מקצועי',
        '7 צבעי אור',
        'טיפול באקנה',
        'אנטי-אייג\'ינג',
        'חידוש עור',
        'בטיחות מלאה'
      ],
      specifications: {
        'טכנולוגיה': 'LED PDT',
        'מספר צבעים': '7',
        'מספר LEDs': '1600',
        'הספק': '200W',
        'תצוגה': 'מסך LCD',
        'משקל': '35 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'ems-rf': {
      id: 'ems-rf',
      name: 'מכשיר EMS+RF',
      model: 'CL10',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      categorySlug: 'body-contouring',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Soft-Green-Typography-Letter-N-Logo-3-1.jpg',
      price: '₪75,304',
      shortDescription: 'מכשיר EMS+RF לפיסול גוף והסרת שומן',
      longDescription: 'מכשיר EMS+RF לפיסול גוף, בניית שריר והסרת שומן. שילוב טכנולוגיות לתוצאות מקסימליות.',
      features: [
        'EMS + RF משולב',
        'בניית שריר',
        'הסרת שומן',
        'פיסול גוף',
        'הידוק עור',
        '4 ראשי טיפול'
      ],
      specifications: {
        'טכנולוגיה': 'EMS + RF',
        'תדר RF': '5MHz',
        'ראשי טיפול': '4',
        'תצוגה': 'מסך מגע',
        'הספק': '2500W',
        'משקל': '50 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'pelvic-chair': {
      id: 'pelvic-chair',
      name: 'כיסא אגן',
      model: 'CLY-1',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      categorySlug: 'body-contouring',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/image34-1-1.png',
      price: '₪24,506',
      shortDescription: 'כיסא אגן לטיפולי רצפת האגן',
      longDescription: 'כיסא אגן מקצועי לחיזוק שרירי רצפת האגן באמצעות גירוי אלקטרומגנטי. טכנולוגיה לא פולשנית.',
      features: [
        'גירוי אלקטרומגנטי',
        'חיזוק שרירי רצפת האגן',
        'טיפול בבריחת שתן',
        'טיפול לא פולשני',
        'ישיבה נוחה',
        'תוצאות מהירות'
      ],
      specifications: {
        'טכנולוגיה': 'HIFEM',
        'תדר': 'מתכוונן',
        'עוצמה': 'מתכווננת',
        'תצוגה': 'מסך מגע',
        'משקל': '85 ק"ג',
        'מימדים': '95×75×120 ס"מ'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    },
    'skin-cooling': {
      id: 'skin-cooling',
      name: 'מכשיר קירור עור',
      model: 'AC1',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      categorySlug: 'skin-resurfacing',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/122.7-1-1.png',
      price: '₪29,443',
      shortDescription: 'מכשיר קירור עור לטיפולים שונים',
      longDescription: 'מכשיר קירור עור מקצועי להקלה על כאב ונפיחות לאחר טיפולים. קירור מהיר ויעיל.',
      features: [
        'קירור מהיר',
        'הפחתת כאב',
        'הפחתת נפיחות',
        'מתאים לכל הטיפולים',
        'קל לתפעול',
        'תוצאות מיידיות'
      ],
      specifications: {
        'טכנולוגיה': 'Air Cooling',
        'טמפרטורה': '-10°C עד 5°C',
        'הספק': '500W',
        'תצוגה': 'LCD',
        'גודל': 'קומפקטי',
        'משקל': '20 ק"ג'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '5 שנות אחריות',
      paymentTerms: 'עד 60 תשלומים'
    }
  };

  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const product = productsDB[productId];
    if (!product) {
      showError();
      return;
    }

    renderProductDetails(product);
    initializeMobileMenu();
  }

  function renderProductDetails(product) {
    // Update page title
    document.title = `${product.name} - Davidov Beauty & Care`;

    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb ol');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <li><a href="index.html">בית</a></li>
        <li><a href="catalog-enhanced.html">קטלוג מוצרים</a></li>
        <li><a href="category-${product.categorySlug}.html">${product.categoryName}</a></li>
        <li class="active">${product.name}</li>
      `;
    }

    // Update product hero
    const heroImage = document.getElementById('productHeroImage');
    const heroTitle = document.getElementById('productHeroTitle');
    const heroCategory = document.getElementById('productHeroCategory');
    const heroPrice = document.getElementById('productHeroPrice');

    if (heroImage) heroImage.src = product.image;
    if (heroImage) heroImage.alt = product.name;
    if (heroTitle) heroTitle.textContent = product.name;
    if (heroCategory) heroCategory.textContent = product.categoryName;
    if (heroPrice) heroPrice.textContent = product.price;

    // Update description
    const description = document.getElementById('productDescription');
    if (description) description.textContent = product.longDescription;

    // Update features
    const featuresList = document.getElementById('productFeatures');
    if (featuresList && product.features) {
      featuresList.innerHTML = product.features.map(feature => `
        <li><i class="fas fa-check-circle"></i> ${feature}</li>
      `).join('');
    }

    // Update specifications
    const specsList = document.getElementById('productSpecs');
    if (specsList && product.specifications) {
      specsList.innerHTML = Object.entries(product.specifications).map(([key, value]) => `
        <div class="spec-item">
          <span class="spec-label">${key}:</span>
          <span class="spec-value">${value}</span>
        </div>
      `).join('');
    }

    // Update certifications
    const certsList = document.getElementById('productCerts');
    if (certsList && product.certifications) {
      certsList.innerHTML = product.certifications.map(cert => `
        <span class="cert-badge"><i class="fas fa-check"></i> ${cert}</span>
      `).join('') + `<span class="cert-badge"><i class="fas fa-shield-alt"></i> ${product.warranty}</span>`;
    }

    // Update WhatsApp links
    const whatsappButtons = document.querySelectorAll('[id^="whatsappBtn"]');
    whatsappButtons.forEach(btn => {
      btn.href = `https://wa.me/972123456789?text=אני מעוניין/ת לקבל מידע נוסף על ${encodeURIComponent(product.name)} (${product.model}) במחיר ${product.price}`;
    });
  }

  function showError() {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <section class="error-section">
          <div class="container">
            <h2>מוצר לא נמצא</h2>
            <p>המוצר המבוקש לא קיים במערכת</p>
            <a href="catalog-enhanced.html" class="btn btn--gold">חזרה לקטלוג</a>
          </div>
        </section>
      `;
    }
  }

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
