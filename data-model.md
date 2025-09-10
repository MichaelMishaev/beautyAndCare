# Data Model: Davidov Beauty & Care Landing Page

## Overview

This document defines the data structures, schemas, and relationships for the landing page system, including lead capture, device information, content management, and analytics tracking.

## Core Data Models

### 1. Lead Management

#### Lead Form Data
```typescript
interface LeadFormData {
  // Required personal information
  name: string;                    // Full name (2-100 chars, Hebrew/English)
  email: string;                   // Valid email address
  phone: string;                   // Israeli phone number format
  clinicName: string;              // Clinic/practice name
  
  // Business context
  clinicType: ClinicType;          // Type of medical practice
  currentEquipment?: string[];     // Existing equipment (optional)
  deviceInterest: DeviceType[];    // Devices of interest
  
  // Purchase intent
  budgetRange: BudgetRange;        // Investment range
  timeframe: PurchaseTimeframe;    // Decision timeline
  
  // Additional context
  specificRequirements?: string;   // Custom needs (optional)
  preferredContact: ContactMethod; // Communication preference
  
  // System fields
  source: TrafficSource;           // How they found us
  utmParams?: UTMParameters;       // Marketing attribution
  sessionId: string;               // Session tracking
}

// Enum definitions
enum ClinicType {
  DERMATOLOGY = 'dermatology',
  AESTHETICS = 'aesthetics',
  SPA = 'spa',
  MEDICAL_SPA = 'medical_spa',
  PLASTIC_SURGERY = 'plastic_surgery',
  OTHER = 'other'
}

enum DeviceType {
  DIODE_LASER = 'diode_laser',
  CO2_FRACTIONAL = 'co2_fractional',
  HIFU = 'hifu',
  SKIN_ANALYZER = 'skin_analyzer',
  IPL = 'ipl',
  RADIOFREQUENCY = 'radiofrequency',
  MULTIPLE = 'multiple'
}

enum BudgetRange {
  UNDER_50K = 'under_50k',
  RANGE_50K_100K = '50k_100k',
  RANGE_100K_250K = '100k_250k',
  RANGE_250K_500K = '250k_500k',
  OVER_500K = 'over_500k'
}

enum PurchaseTimeframe {
  IMMEDIATE = 'immediate',
  ONE_TO_THREE_MONTHS = '1_3_months',
  THREE_TO_SIX_MONTHS = '3_6_months',
  SIX_PLUS_MONTHS = '6_plus_months',
  JUST_RESEARCHING = 'researching'
}

enum ContactMethod {
  PHONE = 'phone',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp'
}
```

#### Lead Processing & Storage
```typescript
interface ProcessedLead extends LeadFormData {
  // System metadata
  id: string;                      // Unique lead identifier
  submissionId: string;            // Form submission ID
  timestamp: Date;                 // Submission time
  ipAddress: string;               // Client IP (anonymized)
  userAgent: string;               // Browser info
  
  // Processing status
  status: LeadStatus;              // Current lead state
  processingSteps: ProcessingStep[]; // Audit trail
  
  // Enrichment data
  deviceInfo: DeviceInfo;          // Client device details
  locationInfo?: LocationInfo;     // Geo information (if available)
  referrerInfo: ReferrerInfo;      // Traffic source details
  
  // Follow-up tracking
  contactAttempts: ContactAttempt[];
  assignedTo?: string;             // Sales rep assignment
  notes: string[];                 // Sales notes
  
  // Analytics
  conversionValue: number;         // Estimated lead value
  qualityScore: number;            // Lead scoring (0-100)
}

enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  DEMO_SCHEDULED = 'demo_scheduled',
  PROPOSAL_SENT = 'proposal_sent',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

interface ProcessingStep {
  step: string;                    // Processing step name
  timestamp: Date;                 // When step completed
  success: boolean;                // Step success status
  error?: string;                  // Error message if failed
  metadata?: Record<string, any>;  // Additional data
}
```

### 2. Device Catalog

#### Device Information
```typescript
interface Device {
  // Basic information
  id: string;                      // Unique device identifier
  name: string;                    // Device display name
  slug: string;                    // URL-friendly name
  category: DeviceCategory;        // Device classification
  manufacturer: string;            // Manufacturer name
  model: string;                   // Model number/name
  
  // Content
  shortDescription: string;        // Brief overview (1-2 sentences)
  longDescription: string;         // Detailed description
  benefits: string[];              // Key patient/clinic benefits
  features: string[];              // Technical features
  
  // Specifications
  specifications: DeviceSpecs;     // Technical specifications
  certifications: string[];       // FDA, CE, ISO certifications
  warranty: WarrantyInfo;          // Warranty details
  
  // Commercial information
  pricing: PricingInfo;            // Pricing structure
  financing: FinancingOptions;     // Payment options
  
  // Media
  images: ImageSet;                // Product images
  videos?: VideoSet;               // Product videos
  brochures?: DocumentSet;         // Marketing materials
  
  // SEO & Marketing
  seoData: DeviceSEO;             // SEO metadata
  marketingTags: string[];         // Marketing categories
  
  // Status
  isActive: boolean;               // Currently available
  isNew: boolean;                  // New product flag
  isFeatured: boolean;             // Featured on homepage
  
  // Analytics
  viewCount: number;               // Page views
  interestCount: number;           // Lead form selections
  conversionRate: number;          // Interest to sale conversion
}

enum DeviceCategory {
  LASER_HAIR_REMOVAL = 'laser_hair_removal',
  SKIN_RESURFACING = 'skin_resurfacing',
  BODY_CONTOURING = 'body_contouring',
  SKIN_ANALYSIS = 'skin_analysis',
  ANTI_AGING = 'anti_aging',
  ACNE_TREATMENT = 'acne_treatment'
}

interface DeviceSpecs {
  // Physical specifications
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'mm';
  };
  weight: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  
  // Electrical specifications
  power: {
    consumption: number;            // Watts
    voltage: string;                // e.g., "220V AC"
    frequency: string;              // e.g., "50/60 Hz"
  };
  
  // Technical specifications (varies by device type)
  technical: Record<string, any>;  // Device-specific specs
  
  // Treatment parameters
  treatmentAreas: string[];        // Body areas treatable
  skinTypes: string[];             // Suitable skin types
  sessionDuration: {
    min: number;
    max: number;
    unit: 'minutes';
  };
  
  // Safety & compliance
  safetyFeatures: string[];        // Safety mechanisms
  regulatoryApprovals: string[];   // FDA, CE, etc.
}

interface PricingInfo {
  basePrice: {
    amount: number;
    currency: 'ILS' | 'USD';
    displayText: string;           // e.g., "Starting from ₪XXX"
  };
  
  // Package options
  packages?: PricingPackage[];
  
  // Pricing modifiers
  discounts?: Discount[];
  tradeInValue?: number;           // Trade-in credit
  
  // Display options
  showPrice: boolean;              // Whether to display price
  priceOnRequest: boolean;         // "Contact for pricing"
}

interface PricingPackage {
  name: string;                    // Package name
  price: number;                   // Package price
  included: string[];              // What's included
  savings?: number;                // Savings amount
  popular?: boolean;               // Most popular flag
}
```

### 3. Content Management

#### Marketing Copy
```typescript
interface MarketingCopy {
  // Hero section
  hero: {
    headline: string;              // Main headline
    subheadline: string;           // Supporting text
    bullets: string[];             // Key points (max 3)
    ctaPrimary: string;            // Primary CTA text
    ctaSecondary?: string;         // Secondary CTA text
  };
  
  // Section headers
  sectionHeaders: {
    devices: string;
    whyChooseUs: string;
    services: string;
    promotions: string;
    socialProof: string;
    faq: string;
    contact: string;
  };
  
  // Value propositions
  valueProps: {
    factoryDirect: {
      title: string;
      description: string;
      benefits: string[];
    };
    localSupport: {
      title: string;
      description: string;
      benefits: string[];
    };
    experience: {
      title: string;
      description: string;
      benefits: string[];
    };
    showroom: {
      title: string;
      description: string;
      benefits: string[];
    };
  };
  
  // Call-to-action variations
  ctaVariations: {
    quote: string[];               // "Get Quote" variations
    demo: string[];                // "Book Demo" variations
    contact: string[];             // Contact variations
    whatsapp: string[];            // WhatsApp variations
  };
}

// Multi-language support
interface LocalizedContent {
  language: 'he' | 'en';           // Hebrew or English
  direction: 'ltr' | 'rtl';        // Text direction
  content: MarketingCopy;          // Localized copy
  meta: SEOMeta;                   // Localized SEO meta
}
```

#### Testimonials & Social Proof
```typescript
interface Testimonial {
  id: string;
  
  // Client information
  clientName: string;              // Contact name
  clinicName: string;              // Clinic name
  location: string;                // City, Israel
  clinicType: ClinicType;          // Type of practice
  
  // Testimonial content
  quote: string;                   // Testimonial text
  rating?: number;                 // 1-5 star rating
  
  // Results & metrics
  results: TestimonialResult[];    // Quantified results
  devicesPurchased: string[];      // Devices they bought
  purchaseDate: Date;              // When they bought
  
  // Media
  photo?: string;                  // Client photo
  beforeAfter?: BeforeAfterImages; // Treatment results
  
  // Verification
  verified: boolean;               // Verified testimonial
  approvedForUse: boolean;         // Approved for marketing
  
  // Usage
  featured: boolean;               // Featured testimonial
  displayOrder: number;            // Display priority
}

interface TestimonialResult {
  metric: string;                  // e.g., "Patient satisfaction"
  value: string;                   // e.g., "95% improvement"
  timeframe?: string;              // e.g., "within 3 months"
}

interface SocialProofStats {
  clientsServed: number;           // Total clients
  devicesInstalled: number;        // Devices deployed
  yearsInBusiness: number;         // Years of operation
  installationTime: string;        // "48 hours" average
  satisfactionRate: string;        // "99%" satisfaction
  
  // Certifications & awards
  certifications: string[];        // Industry certifications
  awards: string[];                // Awards received
  
  // Location stats
  telavivClients: number;          // Tel Aviv area clients
  israelwidePresence: boolean;     // National coverage
}
```

### 4. Analytics & Tracking

#### Session Tracking
```typescript
interface UserSession {
  // Session identification
  sessionId: string;               // Unique session ID
  userId?: string;                 // User ID (if known)
  fingerprint: string;             // Browser fingerprint
  
  // Session metadata
  startTime: Date;                 // Session start
  endTime?: Date;                  // Session end
  duration?: number;               // Session length (seconds)
  
  // Device & browser information
  device: DeviceInfo;              // Device details
  browser: BrowserInfo;            // Browser details
  
  // Location & traffic source
  location?: LocationInfo;         // Geographic data
  referrer: ReferrerInfo;          // How they arrived
  utmParams?: UTMParameters;       // Campaign tracking
  
  // Page activity
  pageViews: PageView[];           // Pages visited
  events: UserEvent[];             // User interactions
  
  // Conversion tracking
  conversions: Conversion[];       // Conversion events
  leadSubmitted: boolean;          // Did they submit lead
  
  // Exit information
  exitPage?: string;               // Last page visited
  bounced: boolean;                // Single page visit
}

interface PageView {
  page: string;                    // Page URL
  title: string;                   // Page title
  timestamp: Date;                 // View time
  timeOnPage?: number;             // Time spent (seconds)
  scrollDepth: number;             // Max scroll percentage
}

interface UserEvent {
  type: EventType;                 // Event category
  section: string;                 // Page section
  element: string;                 // Element clicked/interacted
  timestamp: Date;                 // Event time
  metadata: Record<string, any>;   // Additional data
}

enum EventType {
  CTA_CLICK = 'cta_click',
  FORM_START = 'form_start',
  FORM_FIELD = 'form_field',
  FORM_SUBMIT = 'form_submit',
  PHONE_CLICK = 'phone_click',
  WHATSAPP_CLICK = 'whatsapp_click',
  EMAIL_CLICK = 'email_click',
  SCROLL_MILESTONE = 'scroll_milestone',
  TIME_MILESTONE = 'time_milestone'
}
```

#### A/B Testing & Optimization
```typescript
interface ABTestConfig {
  // Test identification
  testId: string;                  // Test identifier
  name: string;                    // Human-readable name
  description: string;             // Test description
  
  // Test configuration
  status: TestStatus;              // Test state
  startDate: Date;                 // Test start
  endDate?: Date;                  // Test end
  trafficAllocation: number;       // % of traffic (0-100)
  
  // Variants
  variants: TestVariant[];         // Test variations
  
  // Success metrics
  primaryMetric: string;           // Main success metric
  secondaryMetrics: string[];      // Additional metrics
  
  // Statistical configuration
  confidenceLevel: number;         // 0.95 for 95% confidence
  minimumSampleSize: number;       // Min conversions needed
  
  // Results
  results?: ABTestResults;         // Test results (if complete)
}

interface TestVariant {
  id: string;                      // Variant identifier
  name: string;                    // Variant name
  allocation: number;              // Traffic % for this variant
  changes: VariantChange[];        // What's different
}

interface VariantChange {
  element: string;                 // What element changes
  property: string;                // What property changes
  value: any;                      // New value
}

enum TestStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

## Data Validation Schemas

### Form Validation (Zod Schemas)
```typescript
import { z } from 'zod';

// Lead form validation
export const leadFormSchema = z.object({
  name: z.string()
    .min(2, 'השם חייב להכיל לפחות 2 תווים')
    .max(100, 'השם ארוך מדי')
    .regex(/^[a-zA-Z\u0590-\u05FF\s'-]+$/, 'השם מכיל תווים לא חוקיים'),
  
  email: z.string()
    .email('כתובת אימייל לא תקינה')
    .max(254, 'כתובת אימייל ארוכה מדי'),
  
  phone: z.string()
    .regex(/^(\+972|0)([23489]|5[0248]|77)[0-9]{7}$/, 'מספר טלפון לא תקין'),
  
  clinicName: z.string()
    .min(2, 'שם הקליניקה נדרש')
    .max(200, 'שם הקליניקה ארוך מדי'),
  
  clinicType: z.nativeEnum(ClinicType),
  
  deviceInterest: z.array(z.nativeEnum(DeviceType))
    .min(1, 'יש לבחור לפחות מכשיר אחד'),
  
  budgetRange: z.nativeEnum(BudgetRange),
  
  timeframe: z.nativeEnum(PurchaseTimeframe),
  
  preferredContact: z.nativeEnum(ContactMethod),
  
  specificRequirements: z.string()
    .max(1000, 'הטקסט ארוך מדי')
    .optional(),
});

// Device data validation
export const deviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.nativeEnum(DeviceCategory),
  shortDescription: z.string().min(10).max(500),
  longDescription: z.string().min(50).max(2000),
  benefits: z.array(z.string()).min(1).max(10),
  isActive: z.boolean(),
  pricing: z.object({
    basePrice: z.object({
      amount: z.number().positive(),
      currency: z.enum(['ILS', 'USD']),
      displayText: z.string(),
    }),
    showPrice: z.boolean(),
  }),
});
```

## Data Storage & Persistence

### Database Schema (if using database)
```sql
-- Lead management tables
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  clinic_name VARCHAR(200) NOT NULL,
  clinic_type VARCHAR(50) NOT NULL,
  device_interest JSONB NOT NULL,
  budget_range VARCHAR(50) NOT NULL,
  timeframe VARCHAR(50) NOT NULL,
  preferred_contact VARCHAR(20) NOT NULL,
  specific_requirements TEXT,
  source JSONB NOT NULL,
  utm_params JSONB,
  session_id VARCHAR(100) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'new',
  quality_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics tables
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) UNIQUE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  device_info JSONB NOT NULL,
  location_info JSONB,
  referrer_info JSONB NOT NULL,
  utm_params JSONB,
  page_views JSONB NOT NULL,
  events JSONB NOT NULL,
  conversions JSONB DEFAULT '[]',
  lead_submitted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device catalog tables
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  specifications JSONB NOT NULL,
  pricing JSONB NOT NULL,
  images JSONB NOT NULL,
  seo_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### JSON File Storage (Static Content)
```typescript
// content/devices.json
interface DevicesData {
  devices: Device[];
  lastUpdated: string;
  version: string;
}

// content/testimonials.json
interface TestimonialsData {
  testimonials: Testimonial[];
  stats: SocialProofStats;
  lastUpdated: string;
}

// content/copy.json
interface CopyData {
  languages: {
    he: LocalizedContent;
    en: LocalizedContent;
  };
  variants: ABTestConfig[];
  lastUpdated: string;
}
```

This data model provides a comprehensive foundation for managing all aspects of the landing page, from lead capture and processing to content management and analytics tracking. The schemas ensure data integrity while remaining flexible enough to accommodate future requirements.