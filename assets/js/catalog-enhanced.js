/**
 * Davidov Beauty & Care - Enhanced Catalog JavaScript
 * Features: Expandable product cards, smooth animations, accessibility
 */

(function() {
  'use strict';

  // Product data from nubway.co.il - extracted from #brxe-gfgdzz
  const products = [
    {
      id: 's200-vacuum-cavitation',
      name: 'Vacuum Cavitation Machine',
      model: 'S200',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/Vaccume-Machine.png',
      price: '₪85,000',
      priceNote: 'מחיר שקוף',
      featured: false,
      shortDescription: 'מכשיר ואקום קאוויטציה לפיסול גוף',
      longDescription: 'מכשיר ואקום קאוויטציה מקצועי S200 לפיסול גוף והסרת שומן. טכנולוגיה מתקדמת עם תוצאות מיידיות.',
      features: [
        'טכנולוגיית ואקום קאוויטציה מתקדמת',
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'ממשק ידידותי',
        'תוצאות מיידיות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'תוצאות מיידיות',
        'טיפול לא פולשני',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Vacuum Cavitation',
        'הספק': 'מתכוונן',
        'מספר אפליקטורים': '2',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 60,
        averageRevenue: 24000,
        paybackMonths: 3.5
      }
    },
    {
      id: 'lp100s-pdt-led',
      name: 'PDT LED Light Therapy Machine',
      model: 'LP100S',
      category: 'skin_resurfacing',
      categoryName: 'טיפולי עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/PDT-Led-Light-Therapy-Machine_%E7%9C%8B%E5%9B%BE%E7%8E%8B-removebg-preview.png',
      price: '₪45,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר PDT LED לטיפול בעור',
      longDescription: 'מכשיר PDT LED Light Therapy מקצועי LP100S לטיפול בעור, אקנה, פיגמנטציה ועוד.',
      features: [
        'טיפול LED מתקדם',
        'מספר אורכי גל',
        'טיפול באקנה',
        'שיפור מרקם העור',
        'ממשק קל לשימוש',
        'תוצאות מהירות'
      ],
      benefits: [
        'טיפול באקנה יעיל',
        'שיפור מרקם העור',
        'טיפול לא פולשני',
        'תוצאות מהירות',
        'בטיחות גבוהה'
      ],
      specifications: {
        'טכנולוגיה': 'PDT LED Light Therapy',
        'אורכי גל': 'מגוון',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 80,
        averageRevenue: 32000,
        paybackMonths: 1.4
      }
    },
    {
      id: 'vs2-velashape',
      name: 'VelaShape Slimming Machine',
      model: 'VS II',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/6-800.png',
      price: '₪95,000',
      priceNote: 'טכנולוגיה מובילה',
      featured: true,
      shortDescription: 'מכשיר VelaShape לפיסול גוף',
      longDescription: 'מכשיר VelaShape II מקצועי לפיסול גוף והסרת שומן. טכנולוגיה מתקדמת עם תוצאות מוכחות.',
      features: [
        'טכנולוגיית VelaShape מתקדמת',
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'ממשק מתקדם',
        'תוצאות מוכחות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'תוצאות מוכחות',
        'טיפול לא פולשני',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'VelaShape',
        'הספק': 'מתכוונן',
        'מספר אפליקטורים': '2',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 70,
        averageRevenue: 35000,
        paybackMonths: 2.7
      }
    },
    {
      id: 'smasfocus2-hifu',
      name: '5D HIFU Machine',
      model: 'SMASFOCUS II',
      category: 'anti_aging',
      categoryName: 'אנטי-אייג׳ינג',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/Vertical-HIFU-Machine-1-2.png',
      price: '₪120,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: true,
      shortDescription: 'מכשיר HIFU 5D אנטי-אייג׳ינג',
      longDescription: 'מכשיר HIFU 5D מקצועי SMASFOCUS II לטיפול אנטי-אייג׳ינג והרמת עור. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'טכנולוגיית HIFU 5D',
        'הרמת עור יעילה',
        'הפחתת קמטים',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הרמת עור יעילה',
        'הפחתת קמטים',
        'תוצאות מעולות',
        'טיפול לא פולשני',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': '5D HIFU',
        'עומקי טיפול': 'מגוון',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '3 שנות אחריות',
      roi: {
        sessionsPerMonth: 50,
        averageRevenue: 50000,
        paybackMonths: 2.4
      }
    },
    {
      id: 'plasma2-plasma',
      name: 'Plasma Machine',
      model: 'PLASMA II',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/plasma-machine.png',
      price: '₪75,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר פלזמה לחידוש עור',
      longDescription: 'מכשיר פלזמה מקצועי PLASMA II לחידוש עור, הסרת קמטים וצלקות. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'טכנולוגיית פלזמה מתקדמת',
        'חידוש עור יעיל',
        'הסרת קמטים',
        'טיפול בצלקות',
        'ממשק מתקדם',
        'תוצאות מעולות'
      ],
      benefits: [
        'חידוש עור יעיל',
        'הסרת קמטים',
        'טיפול בצלקות',
        'תוצאות מעולות',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Plasma',
        'הספק': 'מתכוונן',
        'מספר אפליקטורים': '2',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 40,
        averageRevenue: 30000,
        paybackMonths: 2.5
      }
    },
    {
      id: 'eshr50-ipl',
      name: 'IPL Skin Rejuvenation Machine',
      model: 'ESHR50',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/IPLSHRE-LIGHT-Machine.png',
      price: '₪65,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר IPL לחידוש עור',
      longDescription: 'מכשיר IPL מקצועי ESHR50 לחידוש עור, הסרת פיגמנטציה ושיער. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'טכנולוגיית IPL מתקדמת',
        'חידוש עור יעיל',
        'הסרת פיגמנטציה',
        'הסרת שיער',
        'ממשק מתקדם',
        'תוצאות מעולות'
      ],
      benefits: [
        'חידוש עור יעיל',
        'הסרת פיגמנטציה',
        'הסרת שיער',
        'תוצאות מעולות',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'IPL',
        'אורכי גל': 'מגוון',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 90,
        averageRevenue: 36000,
        paybackMonths: 1.8
      }
    },
    {
      id: 'c8-cryolipolysis',
      name: 'Cryolipolysis Slimming Machine',
      model: 'C8',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/08/360-Cryolipolysis-Machine-3.png',
      price: '₪110,000',
      priceNote: 'טכנולוגיה מובילה',
      featured: true,
      shortDescription: 'מכשיר קריאוליפוליזה לפיסול גוף',
      longDescription: 'מכשיר קריאוליפוליזה מקצועי C8 להסרת שומן ופיסול גוף. טכנולוגיה מתקדמת עם תוצאות מוכחות.',
      features: [
        'טכנולוגיית קריאוליפוליזה מתקדמת',
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'ממשק מתקדם',
        'תוצאות מוכחות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'תוצאות מוכחות',
        'טיפול לא פולשני',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Cryolipolysis',
        'טמפרטורה': 'מתכווננת',
        'מספר אפליקטורים': '4',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '3 שנות אחריות',
      roi: {
        sessionsPerMonth: 60,
        averageRevenue: 42000,
        paybackMonths: 2.6
      }
    },
    {
      id: 'qspc02-skin-analyzer',
      name: 'Face Skin Analyzer Machine',
      model: 'QSPC-02',
      category: 'skin_analysis',
      categoryName: 'ניתוח עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/04/Soft-Green-Typography-Letter-N-Logo-1-1.jpg',
      price: '₪35,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר אבחון עור פנים',
      longDescription: 'מכשיר אבחון עור פנים מקצועי QSPC-02 לניתוח מצב העור, פיגמנטציה ובעיות עור. טכנולוגיה מתקדמת עם דיווח מפורט.',
      features: [
        'אבחון עור מתקדם',
        'ניתוח פיגמנטציה',
        'זיהוי בעיות עור',
        'דיווח מפורט',
        'ממשק מתקדם',
        'תוצאות מדויקות'
      ],
      benefits: [
        'אבחון עור מתקדם',
        'ניתוח פיגמנטציה',
        'זיהוי בעיות עור',
        'דיווח מפורט',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Skin Analysis',
        'רזולוציה': 'גבוהה',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל',
        'אחסון': 'Database'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 100,
        averageRevenue: 15000,
        paybackMonths: 2.3
      }
    },
    {
      id: 'vl8-diode-laser',
      name: 'Multi spot size diode laser',
      model: 'VL8',
      category: 'laser_hair_removal',
      categoryName: 'הסרת שיער בלייזר',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/3-2-2.png',
      price: '₪85,000',
      priceNote: 'טכנולוגיה מובילה',
      featured: true,
      shortDescription: 'לייזר דיודה עם גדלי מוקד משתנים',
      longDescription: 'לייזר דיודה מקצועי VL8 להסרת שיער עם גדלי מוקד משתנים. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'לייזר דיודה מתקדם',
        'גדלי מוקד משתנים',
        'הסרת שיער יעילה',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הסרת שיער יעילה',
        'גדלי מוקד משתנים',
        'תוצאות מעולות',
        'טיפול מהיר',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Diode Laser',
        'אורך גל': '808nm',
        'גדלי ספוט': 'משתנים',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'קירור': 'מערכת קירור'
      },
      certifications: ['CE', 'ISO 13485', 'אישור משרד הבריאות'],
      warranty: '3 שנות אחריות',
      roi: {
        sessionsPerMonth: 120,
        averageRevenue: 48000,
        paybackMonths: 1.8
      }
    },
    {
      id: 'f9-co2-laser',
      name: 'Fractional CO2 Laser Machine',
      model: 'F9',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/7-800-2-1.png',
      price: '₪90,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: true,
      shortDescription: 'לייזר CO2 פרקשנל לחידוש עור',
      longDescription: 'לייזר CO2 פרקשנל מקצועי F9 לחידוש עור, הסרת קמטים וצלקות. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'לייזר CO2 פרקשנל מתקדם',
        'חידוש עור יעיל',
        'הסרת קמטים',
        'טיפול בצלקות',
        'ממשק מתקדם',
        'תוצאות מעולות'
      ],
      benefits: [
        'חידוש עור יעיל',
        'הסרת קמטים',
        'טיפול בצלקות',
        'תוצאות מעולות',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Fractional CO2 Laser',
        'אורך גל': '10600nm',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485', 'FDA'],
      warranty: '3 שנות אחריות',
      roi: {
        sessionsPerMonth: 50,
        averageRevenue: 50000,
        paybackMonths: 1.8
      }
    },
    {
      id: 'ps770-picosecond',
      name: 'Picosecond Pro 770 Laser Machine',
      model: 'PS770',
      category: 'laser_treatment',
      categoryName: 'טיפולי לייזר',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/1.1917.png',
      price: '₪95,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'לייזר פיקוסקונד להסרת קעקועים',
      longDescription: 'לייזר פיקוסקונד מקצועי PS770 להסרת קעקועים, פיגמנטציה וטיפול בעור. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'לייזר פיקוסקונד מתקדם',
        'הסרת קעקועים יעילה',
        'טיפול בפיגמנטציה',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הסרת קעקועים יעילה',
        'טיפול בפיגמנטציה',
        'תוצאות מעולות',
        'טיפול מהיר',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Picosecond Laser',
        'אורכי גל': 'מגוון',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '3 שנות אחריות',
      roi: {
        sessionsPerMonth: 40,
        averageRevenue: 40000,
        paybackMonths: 2.4
      }
    },
    {
      id: 'cl10-ems-rf',
      name: 'EMS+RF Sculpting Machine',
      model: 'CL10',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Soft-Green-Typography-Letter-N-Logo-3-1.jpg',
      price: '₪65,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר EMS+RF לפיסול גוף',
      longDescription: 'מכשיר EMS+RF מקצועי CL10 לפיסול גוף והסרת שומן. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'טכנולוגיית EMS+RF מתקדמת',
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הסרת שומן יעילה',
        'פיסול גוף מקצועי',
        'תוצאות מעולות',
        'טיפול לא פולשני',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'EMS + RF',
        'הספק': 'מתכוונן',
        'מספר אפליקטורים': '4',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 90,
        averageRevenue: 36000,
        paybackMonths: 1.8
      }
    },
    {
      id: 'ql7-nd-yag',
      name: 'Nd Yag Laser Machine',
      model: 'QL Ⅶ',
      category: 'laser_treatment',
      categoryName: 'טיפולי לייזר',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Nd-Yag-Laser-Tattoo-Removal-Machine-2-1-1.png',
      price: '₪55,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'לייזר Nd:YAG להסרת קעקועים',
      longDescription: 'לייזר Nd:YAG מקצועי QL VII להסרת קעקועים, פיגמנטציה וטיפול בעור. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'לייזר Nd:YAG מתקדם',
        'הסרת קעקועים יעילה',
        'טיפול בפיגמנטציה',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הסרת קעקועים יעילה',
        'טיפול בפיגמנטציה',
        'תוצאות מעולות',
        'טיפול מהיר',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Nd:YAG Laser',
        'אורכי גל': '1064nm, 532nm',
        'הספק': 'מתכוונן',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '3 שנות אחריות',
      roi: {
        sessionsPerMonth: 70,
        averageRevenue: 28000,
        paybackMonths: 2.0
      }
    },
    {
      id: 'clf3-anti-aging',
      name: 'Anti-aging An Epoch-making',
      model: 'CLF3',
      category: 'anti_aging',
      categoryName: 'אנטי-אייג׳ינג',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Soft-Green-Typography-Letter-N-Logo-4-1.jpg',
      price: '₪70,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר אנטי-אייג׳ינג מתקדם',
      longDescription: 'מכשיר אנטי-אייג׳ינג מקצועי CLF3 לטיפול בעור, הפחתת קמטים וחידוש עור. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'טכנולוגיית אנטי-אייג׳ינג מתקדמת',
        'הפחתת קמטים יעילה',
        'חידוש עור',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'הפחתת קמטים יעילה',
        'חידוש עור',
        'תוצאות מעולות',
        'טיפול לא פולשני',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Anti-aging',
        'הספק': 'מתכוונן',
        'מספר אפליקטורים': '2',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 60,
        averageRevenue: 30000,
        paybackMonths: 2.3
      }
    },
    {
      id: 'vcsi-hydrafacial',
      name: 'Hydrafacial Skin Care Machine Vcsi',
      model: 'VCSI',
      category: 'skin_resurfacing',
      categoryName: 'טיפולי עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/pcsi.png',
      price: '₪50,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר Hydrafacial לטיפול בעור',
      longDescription: 'מכשיר Hydrafacial מקצועי VCSI לטיפול בעור, ניקוי עמוק וחידוש עור. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'טכנולוגיית Hydrafacial מתקדמת',
        'ניקוי עור עמוק',
        'חידוש עור',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'ניקוי עור עמוק',
        'חידוש עור',
        'תוצאות מעולות',
        'טיפול נעים',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Hydrafacial',
        'הספק': 'מתכוונן',
        'מספר אפליקטורים': '2',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 100,
        averageRevenue: 25000,
        paybackMonths: 2.0
      }
    },
    {
      id: 'cly1-pelvic-chair',
      name: 'Pelvic Chair',
      model: 'CLY-1',
      category: 'body_contouring',
      categoryName: 'מכשירי פיסול גוף',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/image34-1-1.png',
      price: '₪40,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'כיסא אגן לטיפולים',
      longDescription: 'כיסא אגן מקצועי CLY-1 לטיפולים שונים. עיצוב נוח ומקצועי עם תמיכה מלאה.',
      features: [
        'עיצוב מקצועי',
        'נוחות מקסימלית',
        'תמיכה מלאה',
        'ממשק ידידותי',
        'איכות גבוהה',
        'בטיחות גבוהה'
      ],
      benefits: [
        'נוחות מקסימלית',
        'תמיכה מלאה',
        'איכות גבוהה',
        'עיצוב מקצועי',
        'תמיכה מקצועית'
      ],
      specifications: {
        'סוג': 'Pelvic Chair',
        'גובה': 'מתכוונן',
        'זווית': 'מתכווננת',
        'חומרים': 'איכותיים',
        'גודל': 'סטנדרטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 120,
        averageRevenue: 18000,
        paybackMonths: 2.2
      }
    },
    {
      id: 'ac1-skin-cooling',
      name: 'Skin Cooling Machine',
      model: 'AC1',
      category: 'skin_resurfacing',
      categoryName: 'טיפולי עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/122.7-1-1.png',
      price: '₪30,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר קירור עור',
      longDescription: 'מכשיר קירור עור מקצועי AC1 לטיפולים שונים. טכנולוגיה מתקדמת עם קירור יעיל.',
      features: [
        'קירור עור יעיל',
        'ממשק ידידותי',
        'תוצאות מעולות',
        'בטיחות גבוהה',
        'איכות גבוהה',
        'קל לשימוש'
      ],
      benefits: [
        'קירור עור יעיל',
        'תוצאות מעולות',
        'בטיחות גבוהה',
        'קל לשימוש',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Skin Cooling',
        'טמפרטורה': 'מתכווננת',
        'תצוגה': 'מסך',
        'גודל': 'קומפקטי',
        'משקל': 'קל',
        'הספק': 'נמוך'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 150,
        averageRevenue: 12000,
        paybackMonths: 2.5
      }
    },
    {
      id: 'vrf1-vacuum-rf',
      name: 'Vacuum RF Microneedling Machine',
      model: 'VRF1',
      category: 'skin_resurfacing',
      categoryName: 'חידוש עור',
      image: 'https://nubway.co.il/wp-content/uploads/2025/02/Soft-Green-Typography-Letter-N-Logo-5-1.jpg',
      price: '₪80,000',
      priceNote: 'טכנולוגיה מתקדמת',
      featured: false,
      shortDescription: 'מכשיר ואקום RF מיקרו-נידלינג',
      longDescription: 'מכשיר ואקום RF מיקרו-נידלינג מקצועי VRF1 לחידוש עור וטיפול בעור. טכנולוגיה מתקדמת עם תוצאות מעולות.',
      features: [
        'טכנולוגיית ואקום RF מתקדמת',
        'מיקרו-נידלינג יעיל',
        'חידוש עור',
        'ממשק מתקדם',
        'תוצאות מעולות',
        'בטיחות גבוהה'
      ],
      benefits: [
        'מיקרו-נידלינג יעיל',
        'חידוש עור',
        'תוצאות מעולות',
        'טיפול לא פולשני',
        'תמיכה מקצועית'
      ],
      specifications: {
        'טכנולוגיה': 'Vacuum RF Microneedling',
        'הספק': 'מתכוונן',
        'מספר אפליקטורים': '2',
        'תצוגה': 'מסך מגע',
        'גודל': 'קומפקטי',
        'משקל': 'קל'
      },
      certifications: ['CE', 'ISO 13485'],
      warranty: '2 שנות אחריות',
      roi: {
        sessionsPerMonth: 70,
        averageRevenue: 35000,
        paybackMonths: 2.3
      }
    }
  ];

  // State management
  let currentFilter = 'all';
  let expandedCards = new Set();

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * Initialize the application
   */
  function init() {
    renderProducts();
    initializeFilters();
    initializeMobileMenu();
    initializeStickyHeader();
    initializeScrollAnimations();
    initializeSmoothScroll();
    restoreExpandedState();

    // Announce page loaded to screen readers
    announceToScreenReader('העמוד נטען בהצלחה');
  }

  /**
   * Render products to the grid
   */
  function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const filteredProducts = currentFilter === 'all'
      ? products
      : products.filter(p => p.category === currentFilter);

    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

    // Add event listeners to toggle buttons
    grid.querySelectorAll('.product-card__toggle').forEach((btn, index) => {
      btn.addEventListener('click', () => toggleProductCard(btn, filteredProducts[index].id));
    });

    // Add event listeners for CTA buttons
    grid.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleCTAClick);
    });

    // Trigger scroll animations
    setTimeout(() => {
      const cards = grid.querySelectorAll('.product-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s both`;
        }, 50);
      });
    }, 100);
  }

  /**
   * Create product card HTML
   */
  function createProductCard(product) {
    const isExpanded = expandedCards.has(product.id);

    return `
      <article class="product-card ${isExpanded ? 'expanded' : ''}"
               data-category="${product.category}"
               data-product-id="${product.id}"
               role="listitem">
        ${product.featured ? '<span class="product-card__badge">מומלץ</span>' : ''}

        <div class="product-card__image-wrapper">
          <img src="${product.image}"
               alt="${product.model}"
               class="product-card__image"
               loading="lazy"
               width="400"
               height="400">
        </div>

        <div class="product-card__content">
          <h3 class="product-card__title">${product.model}</h3>
          <p class="product-card__category">${product.categoryName}</p>
          <div class="product-card__price">
            ${product.price}
            ${product.priceNote ? `<div class="product-card__price-note">${product.priceNote}</div>` : ''}
          </div>
        </div>

        <button class="product-card__toggle"
                aria-expanded="${isExpanded}"
                aria-controls="details-${product.id}">
          <span>${isExpanded ? 'הסתר פרטים' : 'הצג פרטים מלאים'}</span>
          <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>

        <div class="product-card__details"
             id="details-${product.id}"
             aria-hidden="${!isExpanded}">
          <div class="product-card__details-inner">

            <!-- Description -->
            <p class="product-card__description">${product.longDescription}</p>

            <!-- Features -->
            <div class="product-card__section">
              <h4 class="product-card__section-title">
                <i class="fas fa-star" aria-hidden="true"></i>
                תכונות עיקריות
              </h4>
              <ul class="product-card__list">
                ${product.features.map(feature => `
                  <li>
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <span>${feature}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Benefits -->
            <div class="product-card__section">
              <h4 class="product-card__section-title">
                <i class="fas fa-trophy" aria-hidden="true"></i>
                יתרונות ייחודיים
              </h4>
              <ul class="product-card__list">
                ${product.benefits.map(benefit => `
                  <li>
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <span>${benefit}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Specifications -->
            <div class="product-card__section">
              <h4 class="product-card__section-title">
                <i class="fas fa-cogs" aria-hidden="true"></i>
                מפרט טכני
              </h4>
              <div class="product-card__specs-grid">
                ${Object.entries(product.specifications).map(([key, value]) => `
                  <div class="product-card__spec-item">
                    <div class="product-card__spec-label">${key}</div>
                    <div class="product-card__spec-value">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Certifications -->
            <div class="product-card__section">
              <h4 class="product-card__section-title">
                <i class="fas fa-certificate" aria-hidden="true"></i>
                אישורים ותקנים
              </h4>
              <div class="product-card__certifications">
                ${product.certifications.map(cert => `
                  <span class="product-card__cert-badge">
                    <i class="fas fa-check" aria-hidden="true"></i>
                    ${cert}
                  </span>
                `).join('')}
                <span class="product-card__cert-badge">
                  <i class="fas fa-shield-alt" aria-hidden="true"></i>
                  ${product.warranty}
                </span>
              </div>
            </div>

            <!-- ROI Information -->
            ${product.roi ? `
              <div class="product-card__section">
                <h4 class="product-card__section-title">
                  <i class="fas fa-chart-line" aria-hidden="true"></i>
                  החזר השקעה (ROI)
                </h4>
                <ul class="product-card__list">
                  <li>
                    <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                    <span>החזר השקעה צפוי: ${product.roi.paybackMonths} חודשים</span>
                  </li>
                  <li>
                    <i class="fas fa-dollar-sign" aria-hidden="true"></i>
                    <span>הכנסה חודשית צפויה: ₪${product.roi.averageRevenue.toLocaleString()}</span>
                  </li>
                  <li>
                    <i class="fas fa-users" aria-hidden="true"></i>
                    <span>טיפולים חודשיים: ${product.roi.sessionsPerMonth}</span>
                  </li>
                </ul>
              </div>
            ` : ''}

            <!-- CTA Buttons -->
            <div class="product-card__cta-group">
              <a href="https://wa.me/972123456789?text=אני מעוניין/ת לקבל מידע נוסף על ${encodeURIComponent(product.model)}"
                 class="btn btn--gold"
                 target="_blank"
                 rel="noopener noreferrer"
                 data-action="whatsapp"
                 data-product="${product.id}">
                <i class="fab fa-whatsapp" aria-hidden="true"></i>
                שלח הודעה בוואטסאפ
              </a>
              <button class="btn btn--navy"
                      data-action="demo"
                      data-product="${product.id}">
                <i class="fas fa-calendar-check" aria-hidden="true"></i>
                קבע הדגמה
              </button>
              <button class="btn btn--outline"
                      data-action="quote"
                      data-product="${product.id}">
                <i class="fas fa-file-invoice-dollar" aria-hidden="true"></i>
                בקש הצעת מחיר
              </button>
            </div>

          </div>
        </div>
      </article>
    `;
  }

  /**
   * Toggle product card expanded state
   */
  function toggleProductCard(button, productId) {
    const card = button.closest('.product-card');
    const details = card.querySelector('.product-card__details');
    const isExpanded = card.classList.contains('expanded');

    if (isExpanded) {
      // Collapse
      card.classList.remove('expanded');
      button.setAttribute('aria-expanded', 'false');
      details.setAttribute('aria-hidden', 'true');
      button.querySelector('span').textContent = 'הצג פרטים מלאים';
      expandedCards.delete(productId);
      announceToScreenReader('הפרטים הוסתרו');
    } else {
      // Expand
      card.classList.add('expanded');
      button.setAttribute('aria-expanded', 'true');
      details.setAttribute('aria-hidden', 'false');
      button.querySelector('span').textContent = 'הסתר פרטים';
      expandedCards.add(productId);
      announceToScreenReader('הפרטים הוצגו');

      // Smooth scroll to show expanded content
      setTimeout(() => {
        const rect = details.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (!isVisible) {
          details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 400);
    }

    // Save state to localStorage
    saveExpandedState();
  }

  /**
   * Initialize category filters
   */
  function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update filter and re-render
        currentFilter = category;
        renderProducts();

        // Announce to screen readers
        const categoryName = btn.textContent.trim();
        announceToScreenReader(`מסנן פעיל: ${categoryName}`);
      });
    });
  }

  /**
   * Initialize mobile menu
   */
  function initializeMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('mobile-menu--open');

      if (isOpen) {
        menu.classList.remove('mobile-menu--open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        menu.classList.add('mobile-menu--open');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu when clicking on links
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('mobile-menu--open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('mobile-menu--open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Initialize sticky header
   */
  function initializeStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('header--sticky');
      } else {
        header.classList.remove('header--sticky');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  /**
   * Initialize scroll animations using Intersection Observer
   */
  function initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Initialize smooth scroll for anchor links
   */
  function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Handle CTA button clicks
   */
  function handleCTAClick(e) {
    const action = e.currentTarget.dataset.action;
    const productId = e.currentTarget.dataset.product;
    const product = products.find(p => p.id === productId);

    if (!product) return;

    switch (action) {
      case 'demo':
        alert(`קביעת הדגמה עבור ${product.model}\n\nצוות המכירות שלנו יצור איתך קשר בהקדם.`);
        // In production, open a demo booking modal or redirect to booking page
        break;

      case 'quote':
        alert(`בקשת הצעת מחיר עבור ${product.model}\n\nנשלח אליך הצעת מחיר מפורטת תוך 24 שעות.`);
        // In production, open a quote request form or redirect to contact page
        break;

      // WhatsApp is handled by the anchor tag's href
    }

    // Track analytics (if integrated)
    trackEvent('CTA_Click', {
      action: action,
      product: productId,
      productName: product.model
    });
  }

  /**
   * Save expanded cards state to localStorage
   */
  function saveExpandedState() {
    try {
      localStorage.setItem('davidov_expanded_cards', JSON.stringify([...expandedCards]));
    } catch (e) {
      console.warn('Could not save expanded state:', e);
    }
  }

  /**
   * Restore expanded cards state from localStorage
   */
  function restoreExpandedState() {
    try {
      const saved = localStorage.getItem('davidov_expanded_cards');
      if (saved) {
        expandedCards = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not restore expanded state:', e);
    }
  }

  /**
   * Announce message to screen readers
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Track analytics event (placeholder for integration)
   */
  function trackEvent(eventName, data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, data);
    }

    // LinkedIn Insight Tag
    if (typeof lintrk !== 'undefined') {
      lintrk('track', { conversion_id: eventName });
    }

    console.log('Event tracked:', eventName, data);
  }

  /**
   * Performance optimization: Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Error handling for images
   */
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f5f5f5" width="400" height="400"/%3E%3Ctext fill="%23666" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
      e.target.alt = 'תמונה לא זמינה';
    }
  }, true);

})();
