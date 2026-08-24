// User & Auth Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
} from "../../types/api";

// Project Types
export interface ProjectResult {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
}

export interface ProjectStat {
  label: string;
  labelEn?: string;
  value: string;
  valueEn?: string;
  description?: string;
  descriptionEn?: string;
}

export interface ProjectImages {
  cover?: string;
  gallery: string[];
}

export interface ProjectSeo {
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  keywords: string[];
  keywordsEn?: string[];
}

export interface ProjectCategoryRef {
  _id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface Project {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  summary: string;
  summaryEn?: string;
  challenge?: string;
  challengeEn?: string;
  solution?: string;
  solutionEn?: string;
  results: ProjectResult[];
  features?: string[];
  featuresEn?: string[];
  technologies: Technology[] | string[];
  images: ProjectImages;
  projectUrl?: string;
  clientName?: string;
  clientNameEn?: string;
  categoryIds?: ProjectCategoryRef[] | string[];
  industry?: string;
  industryEn?: string;
  duration?: string;
  durationEn?: string;
  year?: string;
  clientLogo?: string;
  sortOrder?: number;
  featuredOrder?: number;
  videoUrl?: string;
  stats?: ProjectStat[];
  isFeatured: boolean;
  seo: ProjectSeo;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog Types
export interface BlogSeo {
  metaTitle?: string;
  metaTitleEn?: string;
  metaDescription?: string;
  metaDescriptionEn?: string;
  keywords: string[];
  keywordsEn?: string[];
  ogTitle?: string;
  ogTitleEn?: string;
  ogDescription?: string;
  ogDescriptionEn?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterTitleEn?: string;
  twitterDescription?: string;
  twitterDescriptionEn?: string;
  twitterImage?: string;
  noIndex?: boolean;
  schemaType?: string;
}

export type BlogContentType = 'article' | 'guide' | 'case-study' | 'insight' | 'news';

export interface Blog {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  coverImage?: string;
  coverAlt?: string;
  coverAltEn?: string;
  author?: User | string;
  authorName?: string;
  authorNameEn?: string;
  authorRole?: string;
  authorRoleEn?: string;
  authorAvatar?: string;
  tags: string[];
  tagsEn?: string[];
  category: string;
  categoryEn?: string;
  categoryKey: string;
  contentType?: BlogContentType;
  isPublished: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  readingTime?: number;
  summaryPoints?: string[];
  summaryPointsEn?: string[];
  isEditorPick?: boolean;
  allowIndexing?: boolean;
  ctaTitle?: string;
  ctaTitleEn?: string;
  ctaDescription?: string;
  ctaDescriptionEn?: string;
  ctaButtonText?: string;
  ctaButtonTextEn?: string;
  ctaButtonUrl?: string;
  seo: BlogSeo;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Lead Types
export enum ServiceType {
  WEB_APP = "Web App",
  MOBILE_APP = "Mobile App",
  AUTOMATION = "Automation",
  ERP = "ERP",
  ECOMMERCE = "E-Commerce",
  CONSULTATION = "Consultation",
  OTHER = "Other",
}

export enum LeadStatus {
  NEW = "New",
  CONTACTED = "Contacted",
  PROPOSAL_SENT = "Proposal Sent",
  NEGOTIATION = "Negotiation",
  CLOSED_WON = "Closed-Won",
  CLOSED_LOST = "Closed-Lost",
}

export enum BudgetRange {
  SMALL = "< $1,000",
  MEDIUM = "$1,000 - $5,000",
  LARGE = "$5,000 - $15,000",
  ENTERPRISE = "$15,000+",
  NOT_SPECIFIED = "Not Specified",
}

export enum LeadType {
  CONTACT = "Contact",
  PROJECT_BRIEF = "Project Brief",
  PACKAGE_REQUEST = "Package Request",
}

export enum ProjectStage {
  IDEA = "Idea",
  EXISTING_BUSINESS = "Existing Business",
  REDESIGN = "Redesign",
  SCALING = "Scaling",
}

export enum Timeline {
  URGENT = "Urgent",
  ONE_MONTH = "1 Month",
  TWO_THREE_MONTHS = "2-3 Months",
  FLEXIBLE = "Flexible",
}

export enum PreferredContactMethod {
  WHATSAPP = "WhatsApp",
  PHONE = "Phone",
  EMAIL = "Email",
  MEETING = "Meeting",
}

export enum CompanySize {
  INDIVIDUAL = "Individual",
  STARTUP = "Startup",
  SMALL_BUSINESS = "Small Business",
  COMPANY = "Company",
}

export enum LeadPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export interface Lead {
  _id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  budgetRange: BudgetRange;
  serviceType: ServiceType;
  message?: string;
  status: LeadStatus;
  notes?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;

  leadType?: LeadType;
  projectStage?: ProjectStage;
  projectGoal?: string;
  timeline?: Timeline;
  preferredContactMethod?: PreferredContactMethod;
  companySize?: CompanySize;
  currentWebsite?: string;
  referenceLinks?: string[];
  hasBrandIdentity?: boolean;
  hasContentReady?: boolean;
  expectedLaunchDate?: string;
  meetingPreference?: string;
  contactReason?: string;
  projectAnswers?: Record<string, unknown>;
  priority?: LeadPriority;
  locale: "ar" | "en";
}

// Team Member Types
export enum Department {
  MANAGEMENT = "Management",
  BACKEND = "Backend",
  FRONTEND = "Frontend",
  MOBILE = "Mobile",
  DEVOPS = "DevOps",
  DESIGN = "Design",
  QA = "Quality Assurance",
  MARKETING = "Marketing",
  SUPPORT = "Support",
}

export interface TeamMember {
  _id: string;
  fullName: string;
  fullNameEn?: string;
  role: string;
  roleEn?: string;
  department: Department;
  photo?: string | null;
  bio?: string | null;
  bioEn?: string | null;
  funFact?: string | null;
  funFactEn?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  specializations: string[];
  specializationsEn?: string[];
  showOnHome: boolean;
  showOnAbout: boolean;
  isActive: boolean;
  sortOrder: number;
  projectsCount: number;
  joinedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Testimonial Types
export interface Testimonial {
  _id: string;
  clientName: string;
  clientNameEn?: string;
  position?: string;
  positionEn?: string;
  companyName?: string;
  companyNameEn?: string;
  companyLogo?: string;
  clientPhoto?: string;
  content: string;
  contentEn?: string;
  rating: number;
  linkedProject?: Project | string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Technology Types
export enum TechnologyCategory {
  BACKEND = "Backend",
  FRONTEND = "Frontend",
  MOBILE = "Mobile",
  DEVOPS = "DevOps",
  AUTOMATION = "Automation",
  DATABASE = "Database",
  OTHER = "Other",
}

export interface Technology {
  _id: string;
  name: string;
  icon?: string;
  category: TechnologyCategory;
  description?: string;
  descriptionEn?: string;
  tooltip?: string;
  tooltipEn?: string;
  createdAt: string;
  updatedAt: string;
}

// Hosting Package Types
export enum BillingCycle {
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  SEMI_ANNUALLY = "Semi-Annually",
  YEARLY = "Yearly",
}

export enum PackageCategory {
  SHARED_HOSTING = "Shared Hosting",
  VPS = "VPS",
  DEDICATED = "Dedicated Server",
  CLOUD = "Cloud Hosting",
  WORDPRESS = "WordPress Hosting",
  RESELLER = "Reseller Hosting",
}

export interface HostingPackage {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  currency: string;
  originalPrice?: number;
  billingCycle: BillingCycle;
  category: PackageCategory;
  features: string[];
  featuresEn?: string[];
  isPopular: boolean;
  isBestValue: boolean;
  isActive: boolean;
  sortOrder: number;
  storage?: string;
  storageEn?: string;
  bandwidth?: string;
  bandwidthEn?: string;
  ram?: string;
  ramEn?: string;
  cpu?: string;
  cpuEn?: string;
  domains?: string;
  domainsEn?: string;
  discountPercentage?: number;
  promotionEndsAt?: string;
  yearlyPrice?: number;
  basePackageId?: string;
  benefitHints?: Record<string, string>;
  benefitHintsEn?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// FAQ Types
export interface FAQ {
  _id: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
  category: string;
  categoryEn?: string;
  categoryKey: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardContentHealth {
  inactiveServices: number;
  unpublishedProjects: number;
  draftBlogs: number;
  projectsWithoutCover: number;
}

export interface DashboardRecentLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
}

export interface DashboardStats {
  totals: {
    projects: number;
    services: number;
    leads: number;
    blogs: number;
  };
  recentLeads: DashboardRecentLead[];
  contentHealth: DashboardContentHealth;
}
