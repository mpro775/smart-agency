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
export enum ProjectCategory {
  WEB_APP = "Web App",
  MOBILE_APP = "Mobile App",
  AUTOMATION = "Automation",
  ERP = "ERP",
  ECOMMERCE = "E-Commerce",
  OTHER = "Other",
}

export interface ProjectResult {
  label: string;
  value: string;
}

export interface ProjectStat {
  label: string;
  value: string;
  description?: string;
}

export interface ProjectImages {
  cover?: string;
  gallery: string[];
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface ProjectCategoryRef {
  _id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export enum DisplayVariant {
  STANDARD = 'standard',
  FEATURED = 'featured',
  WIDE = 'wide',
  COMPACT = 'compact',
  CASE_STUDY = 'case_study',
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  challenge?: string;
  solution?: string;
  results: ProjectResult[];
  features?: string[];
  technologies: Technology[] | string[];
  images: ProjectImages;
  projectUrl?: string;
  clientName?: string;
  category: ProjectCategory;
  projectTypes?: ProjectCategory[];
  categoryId?: ProjectCategoryRef | string;
  categoryIds?: ProjectCategoryRef[] | string[];
  industry?: string;
  duration?: string;
  year?: string;
  clientLogo?: string;
  accentColor?: string;
  sortOrder?: number;
  featuredOrder?: number;
  displayVariant?: DisplayVariant;
  previewScreens?: string[];
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
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  schemaType?: string;
}

export type BlogContentType = 'article' | 'guide' | 'case-study' | 'insight' | 'news';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  coverAlt?: string;
  author?: User | string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  tags: string[];
  category?: string;
  contentType?: BlogContentType;
  isPublished: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  readingTime?: number;
  summaryPoints?: string[];
  isEditorPick?: boolean;
  allowIndexing?: boolean;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
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
  role: string;
  department: Department;
  photo?: string | null;
  bio?: string | null;
  funFact?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  websiteUrl?: string | null;
  specializations: string[];
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
  position?: string;
  companyName?: string;
  companyLogo?: string;
  clientPhoto?: string;
  content: string;
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
  tooltip?: string;
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
  description?: string;
  price: number;
  currency: string;
  originalPrice?: number;
  billingCycle: BillingCycle;
  category: PackageCategory;
  features: string[];
  isPopular: boolean;
  isBestValue: boolean;
  isActive: boolean;
  sortOrder: number;
  storage?: string;
  bandwidth?: string;
  ram?: string;
  cpu?: string;
  domains?: string;
  discountPercentage?: number;
  promotionEndsAt?: string;
  createdAt: string;
  updatedAt: string;
}

// FAQ Types
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  orderNumber: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  projectsCount: number;
  blogsCount: number;
  leadsCount: number;
  teamMembersCount: number;
  newLeadsCount: number;
  publishedProjectsCount: number;
  publishedBlogsCount: number;
}
