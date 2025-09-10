# Technical Architecture: Davidov Beauty & Care Landing Page

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER REQUEST                         │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                VERCEL EDGE CDN                          │
│  • Static assets caching                               │
│  • Image optimization (WebP/AVIF)                      │
│  • Geographic distribution                             │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              NEXT.JS APPLICATION                        │
│  ┌─────────────┬─────────────┬─────────────────────────┐ │
│  │    SSG      │    Client   │    Serverless API       │ │
│  │   Pages     │  Analytics  │      Functions          │ │
│  │             │   Tracking  │                         │ │
│  └─────────────┼─────────────┼─────────────────────────┘ │
└─────────────────┼─────────────┼───────────────────────────┘
                  │             │
                  │    ┌────────▼────────┐
                  │    │  Lead Processing │
                  │    │  • Validation   │
                  │    │  • Email Send   │
                  │    │  • CRM Storage  │
                  │    └─────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              EXTERNAL SERVICES                          │
│  ┌──────────────┬──────────────┬─────────────────────┐  │
│  │   Analytics  │    Email     │    CRM/Storage      │  │
│  │ • GA4        │ • SendGrid   │ • Google Sheets     │  │
│  │ • Meta Pixel │ • Resend     │ • Airtable         │  │
│  │ • LinkedIn   │ • Mailgun    │ • HubSpot          │  │
│  └──────────────┴──────────────┴─────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### 1. User Journey & Data Capture

```typescript
// User interaction flow
interface UserInteraction {
  sessionId: string;
  timestamp: Date;
  userAgent: string;
  referrer: string;
  utmParams: UTMParameters;
  device: DeviceInfo;
  actions: UserAction[];
}

interface UserAction {
  type: 'page_view' | 'cta_click' | 'form_start' | 'form_submit';
  section: string;
  element: string;
  metadata: Record<string, any>;
}
```

### 2. Lead Processing Pipeline

```typescript
// Lead capture and processing flow
interface LeadSubmission {
  // Form data
  personalInfo: {
    name: string;
    clinicName: string;
    phone: string;
    email: string;
  };
  
  // Interest data
  deviceInterest: DeviceType[];
  budgetRange: BudgetRange;
  timeframe: TimeFrame;
  
  // Tracking data
  source: TrafficSource;
  campaign: CampaignData;
  sessionData: SessionData;
  
  // System data
  submissionId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

// Processing pipeline
const leadPipeline = async (lead: LeadSubmission) => {
  // 1. Validation & sanitization
  const validatedLead = await validateLead(lead);
  
  // 2. Spam protection
  await verifyRecaptcha(lead.recaptchaToken);
  
  // 3. Email notification
  await sendNotificationEmail(validatedLead);
  
  // 4. CRM storage
  await storeToCRM(validatedLead);
  
  // 5. Analytics tracking
  await trackConversion(validatedLead);
  
  // 6. Follow-up automation
  await triggerFollowUp(validatedLead);
};
```

## Component Architecture

### 1. Page Structure

```typescript
// App Router page structure
app/
├── page.tsx                 // Main landing page
├── layout.tsx              // Root layout with providers
├── not-found.tsx           // 404 fallback
└── api/
    └── lead/
        └── route.ts        // Lead processing endpoint
```

### 2. Component Hierarchy

```typescript
// Component tree structure
LandingPage
├── AnalyticsProviders
│   ├── GoogleAnalytics
│   ├── MetaPixel
│   └── LinkedInInsight
├── ConsentBanner
├── Header (optional - anchor nav)
├── Hero
│   ├── HeroHeadline
│   ├── HeroBullets
│   ├── TrustBadges
│   └── PrimaryCTA
├── FeaturedDevices
│   ├── DeviceGrid
│   │   ├── DeviceCard[]
│   │   │   ├── DeviceImage
│   │   │   ├── DeviceBenefits
│   │   │   ├── PriceTeaser
│   │   │   └── DeviceCTA
├── WhyChooseUs
│   ├── CredibilityPoints
│   └── TrustIndicators
├── Services
│   ├── ServiceGrid
│   └── ServiceDetails
├── Promotions
│   ├── OfferCards
│   └── UrgencyElements
├── SocialProof
│   ├── Testimonials
│   ├── Statistics
│   └── ClientLogos
├── FAQ
│   ├── FAQAccordion
│   └── ContactPrompt
├── FoundersNote
│   ├── PersonalStory
│   └── ContactInfo
├── LeadCapture
│   ├── LeadForm
│   ├── WhatsAppCTA
│   └── PhoneCTA
└── Footer
    ├── ContactInfo
    ├── LegalLinks
    └── SocialLinks
```

## State Management

### 1. Client-Side State

```typescript
// Minimal client state using React hooks
interface AppState {
  // Form state
  leadForm: {
    data: Partial<LeadFormData>;
    errors: Record<string, string>;
    isSubmitting: boolean;
    submitStatus: 'idle' | 'success' | 'error';
  };
  
  // UI state
  ui: {
    activeSection: string;
    modalOpen: boolean;
    consentGiven: boolean;
  };
  
  // Analytics state
  analytics: {
    sessionId: string;
    events: AnalyticsEvent[];
  };
}

// Context providers for shared state
const AppContext = createContext<AppState>();
const AnalyticsContext = createContext<AnalyticsState>();
```

### 2. Server-Side Data

```typescript
// Static data loaded at build time
interface StaticData {
  devices: Device[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  copy: MarketingCopy;
  meta: SEOMeta;
}

// Dynamic data fetched at runtime
interface RuntimeData {
  abTestVariants: ABTestConfig;
  promoStatus: PromotionStatus;
  analytics: AnalyticsConfig;
}
```

## API Design

### 1. Lead Submission Endpoint

```typescript
// POST /api/lead
interface LeadRequest {
  formData: LeadFormData;
  recaptchaToken: string;
  sessionData: SessionData;
}

interface LeadResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  errors?: ValidationError[];
}

// Implementation
export async function POST(request: Request) {
  try {
    const body: LeadRequest = await request.json();
    
    // 1. Rate limiting
    await rateLimiter.check(request);
    
    // 2. Validation
    const validatedData = leadSchema.parse(body.formData);
    
    // 3. reCAPTCHA verification
    await verifyRecaptcha(body.recaptchaToken);
    
    // 4. Process lead
    const submissionId = await processLead({
      ...validatedData,
      sessionData: body.sessionData,
      timestamp: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      submissionId,
    });
    
  } catch (error) {
    console.error('Lead submission error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to submit lead',
      errors: error.errors || [],
    }, { status: 400 });
  }
}
```

### 2. Analytics Endpoint (optional)

```typescript
// POST /api/analytics
interface AnalyticsEvent {
  eventType: string;
  section: string;
  element: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// For server-side event tracking if needed
export async function POST(request: Request) {
  const events: AnalyticsEvent[] = await request.json();
  
  // Process analytics events
  await Promise.all(events.map(event => 
    trackServerSideEvent(event)
  ));
  
  return NextResponse.json({ success: true });
}
```

## Data Models

### 1. Core Data Types

```typescript
// Lead form data structure
interface LeadFormData {
  // Personal information
  name: string;
  clinicName: string;
  phone: string;
  email: string;
  
  // Business information
  clinicType: 'dermatology' | 'aesthetics' | 'spa' | 'other';
  currentEquipment: string[];
  deviceInterest: DeviceType[];
  
  // Purchase information
  budgetRange: '50k-100k' | '100k-250k' | '250k-500k' | '500k+';
  timeframe: 'immediate' | '1-3months' | '3-6months' | '6+months';
  
  // Additional information
  specificRequirements: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

// Device information
interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  description: string;
  benefits: string[];
  specifications: DeviceSpecs;
  pricing: PricingInfo;
  images: ImageSet;
  seoData: DeviceSEO;
}

// Testimonial data
interface Testimonial {
  id: string;
  clinicName: string;
  contactName: string;
  location: string;
  devicePurchased: string[];
  testimonialText: string;
  results: string[];
  image?: string;
  verified: boolean;
}
```

### 2. Analytics Data Types

```typescript
// User session tracking
interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: PageView[];
  events: UserEvent[];
  device: DeviceInfo;
  location: LocationInfo;
  referrer: ReferrerInfo;
  utmParams: UTMParameters;
}

// Conversion tracking
interface ConversionEvent {
  type: 'lead_form' | 'phone_click' | 'whatsapp_click' | 'demo_request';
  sessionId: string;
  timestamp: Date;
  section: string;
  value: number;
  metadata: Record<string, any>;
}
```

## Security Architecture

### 1. Input Validation & Sanitization

```typescript
import { z } from 'zod';

// Form validation schema
const leadFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\u0590-\u05FF\s]+$/, 'Invalid characters in name'),
  
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long'),
  
  phone: z.string()
    .regex(/^[+]?[(]?[\d\s\-()]{8,15}$/, 'Invalid phone number'),
  
  clinicName: z.string()
    .min(2, 'Clinic name required')
    .max(200, 'Clinic name too long'),
});

// Sanitization utilities
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s\u0590-\u05FF@.-]/g, ''); // Remove special chars except Hebrew
};
```

### 2. Rate Limiting & Spam Protection

```typescript
// Rate limiting configuration
const rateLimiter = new Map<string, { count: number; timestamp: number }>();

const checkRateLimit = (ip: string, limit: number = 5, window: number = 300000) => {
  const now = Date.now();
  const userRequests = rateLimiter.get(ip) || { count: 0, timestamp: now };
  
  if (now - userRequests.timestamp > window) {
    // Reset window
    rateLimiter.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (userRequests.count >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  rateLimiter.set(ip, { 
    count: userRequests.count + 1, 
    timestamp: userRequests.timestamp 
  });
  
  return true;
};

// reCAPTCHA verification
const verifyRecaptcha = async (token: string): Promise<boolean> => {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  });
  
  const data = await response.json();
  return data.success && data.score > 0.5; // Adjust threshold as needed
};
```

## Performance Architecture

### 1. Image Optimization Strategy

```typescript
// Next.js image configuration
const imageConfig = {
  domains: ['davidov.co.il', 'images.davidov.co.il'],
  formats: ['image/avif', 'image/webp'],
  sizes: {
    hero: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    device: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
    testimonial: '(max-width: 768px) 30vw, 20vw',
  },
};

// Image preloading for critical sections
const preloadCriticalImages = () => {
  const criticalImages = [
    '/images/hero/hero-main.webp',
    '/images/devices/diode-laser.webp',
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};
```

### 2. Code Splitting Strategy

```typescript
// Dynamic imports for non-critical components
const ConsentBanner = dynamic(
  () => import('@/components/ConsentBanner'),
  { ssr: false }
);

const FAQ = dynamic(
  () => import('@/components/sections/FAQ'),
  {
    loading: () => <div className="animate-pulse h-96 bg-gray-100" />,
    ssr: true
  }
);

// Lazy load analytics scripts
const loadAnalytics = async () => {
  const [ga4, metaPixel] = await Promise.all([
    import('@/lib/analytics/ga4'),
    import('@/lib/analytics/meta-pixel'),
  ]);
  
  ga4.initialize();
  metaPixel.initialize();
};
```

This technical architecture provides the foundation for building a robust, scalable, and high-performing landing page that meets all the specified requirements while maintaining excellent developer experience and code quality.