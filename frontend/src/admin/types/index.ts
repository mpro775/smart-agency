// User & Auth Types
export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Pagination Types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

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

export interface ProjectImages {
  cover?: string;
  gallery: string[];
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  challenge?: string;
  solution?: string;
  results: ProjectResult[];
  technologies: Technology[] | string[];
  images: ProjectImages;
  projectUrl?: string;
  clientName?: string;
  category: ProjectCategory;
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
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: User | string;
  tags: string[];
  isPublished: boolean;
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
  photo?: string;
  bio?: string;
  funFact?: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  specializations: string[];
  showOnHome: boolean;
  showOnAbout: boolean;
  isActive: boolean;
  sortOrder: number;
  projectsCount: number;
  joinedAt?: string;
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
