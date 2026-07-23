const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI;
// ==================== SCHEMAS ====================

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Blog Schema
const blogSeoSchema = new mongoose.Schema(
  {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: String,
    coverImage: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    seo: { type: blogSeoSchema, default: {} },
    publishedAt: Date,
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// FAQ Schema
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hosting Package Schema
const hostingPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    originalPrice: Number,
    billingCycle: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Semi-Annually', 'Yearly'],
      default: 'Monthly',
    },
    category: {
      type: String,
      enum: [
        'Shared Hosting',
        'VPS',
        'Dedicated Server',
        'Cloud Hosting',
        'WordPress Hosting',
        'Reseller Hosting',
      ],
      default: 'Shared Hosting',
    },
    features: [String],
    isPopular: { type: Boolean, default: false },
    isBestValue: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    storage: String,
    bandwidth: String,
    ram: String,
    cpu: String,
    domains: String,
    discountPercentage: Number,
    promotionEndsAt: Date,
  },
  { timestamps: true },
);

// Lead Schema
const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    companyName: String,
    email: { type: String, required: true },
    phone: String,
    budgetRange: {
      type: String,
      enum: [
        '< $1,000',
        '$1,000 - $5,000',
        '$5,000 - $15,000',
        '$15,000+',
        'Not Specified',
      ],
      default: 'Not Specified',
    },
    serviceType: {
      type: String,
      enum: [
        'Web App',
        'Mobile App',
        'Automation',
        'ERP',
        'E-Commerce',
        'Consultation',
        'Other',
      ],
      required: true,
    },
    message: String,
    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Proposal Sent',
        'Negotiation',
        'Closed-Won',
        'Closed-Lost',
      ],
      default: 'New',
    },
    notes: String,
    source: String,
    leadType: {
      type: String,
      enum: ['Contact', 'Project Brief', 'Package Request'],
      default: 'Project Brief',
    },
    projectStage: {
      type: String,
      enum: ['Idea', 'Existing Business', 'Redesign', 'Scaling'],
    },
    projectGoal: String,
    timeline: {
      type: String,
      enum: ['Urgent', '1 Month', '2-3 Months', 'Flexible'],
    },
    preferredContactMethod: {
      type: String,
      enum: ['WhatsApp', 'Phone', 'Email', 'Meeting'],
    },
    companySize: {
      type: String,
      enum: ['Individual', 'Startup', 'Small Business', 'Company'],
    },
    currentWebsite: String,
    referenceLinks: [String],
    hasBrandIdentity: Boolean,
    hasContentReady: Boolean,
    expectedLaunchDate: Date,
    meetingPreference: String,
    contactReason: String,
    projectAnswers: mongoose.Schema.Types.Mixed,
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  { timestamps: true },
);

// Technology Schema
const technologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    category: {
      type: String,
      enum: [
        'Backend',
        'Frontend',
        'Mobile',
        'DevOps',
        'Automation',
        'Database',
        'Other',
      ],
      default: 'Other',
    },
    description: String,
    tooltip: String,
  },
  { timestamps: true },
);

// Project Schema
const projectResultSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const projectImagesSchema = new mongoose.Schema(
  {
    cover: String,
    gallery: [String],
  },
  { _id: false },
);

const projectSeoSchema = new mongoose.Schema(
  {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, required: true },
    challenge: String,
    solution: String,
    results: [projectResultSchema],
    technologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }],
    images: { type: projectImagesSchema, default: {} },
    projectUrl: String,
    clientName: String,
    category: {
      type: String,
      enum: [
        'Web App',
        'Mobile App',
        'Automation',
        'ERP',
        'E-Commerce',
        'Other',
      ],
      default: 'Other',
    },
    isFeatured: { type: Boolean, default: false },
    seo: { type: projectSeoSchema, default: {} },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Team Member Schema
const teamMemberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    department: {
      type: String,
      enum: [
        'Management',
        'Backend',
        'Frontend',
        'Mobile',
        'DevOps',
        'Design',
        'Quality Assurance',
        'Marketing',
        'Support',
      ],
      default: 'Backend',
    },
    photo: String,
    bio: String,
    funFact: String,
    email: String,
    linkedinUrl: String,
    githubUrl: String,
    twitterUrl: String,
    websiteUrl: String,
    specializations: [String],
    showOnHome: { type: Boolean, default: true },
    showOnAbout: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    projectsCount: { type: Number, default: 0 },
    joinedAt: Date,
  },
  { timestamps: true },
);

// Testimonial Schema
const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    position: String,
    companyName: String,
    companyLogo: String,
    clientPhoto: String,
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    linkedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Service Schema
const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    icon: String,
    iconType: String,
    gradient: { type: String, default: 'from-teal-500 to-teal-600' },
    features: [String],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    slug: String,
    shortDescription: String,
  },
  { timestamps: true },
);

// Project Category Schema
const projectCategorySchema = new mongoose.Schema(
  {
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    icon: String,
  },
  { timestamps: true },
);

// Company Info Schema
const companyInfoSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    googleMapsUrl: { type: String, required: true },
    workingHours: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsappUrl: { type: String, required: true },
    socialLinks: {
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

// About Schema
const aboutSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      badge: { type: String, default: '' },
      image: { type: String, default: '' },
      primaryButtonText: { type: String, default: '' },
      primaryButtonUrl: { type: String, default: '' },
      secondaryButtonText: { type: String, default: '' },
      secondaryButtonUrl: { type: String, default: '' },
      trustBadges: [{ type: String }],
    },
    vision: { type: String, required: true },
    mission: { type: String, required: true },
    approach: { type: String, required: true },
    story: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      painPoints: [{ type: String }],
      closingStatement: { type: String, default: '' },
    },
    thinking: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        result: { type: String, default: '' },
      },
    ],
    differentiators: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        badge: { type: String, default: '' },
      },
    ],
    process: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        deliverable: { type: String, default: '' },
        icon: { type: String, default: '' },
      },
    ],
    values: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        example: { type: String, default: '' },
      },
    ],
    stats: [
      {
        icon: { type: String, required: true },
        value: { type: Number, required: true },
        suffix: { type: String, default: '' },
        label: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    teamNote: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      highlights: [{ type: String }],
      image: { type: String, default: '' },
    },
    cta: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      buttonText: { type: String, required: true },
      buttonUrl: { type: String, default: '/contact' },
      secondaryButtonText: { type: String, default: '' },
      secondaryButtonUrl: { type: String, default: '' },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ==================== MODELS ====================
const User = mongoose.model('User', userSchema);
const Blog = mongoose.model('Blog', blogSchema);
const Faq = mongoose.model('Faq', faqSchema);
const HostingPackage = mongoose.model('HostingPackage', hostingPackageSchema);
const Lead = mongoose.model('Lead', leadSchema);
const Technology = mongoose.model('Technology', technologySchema);
const Project = mongoose.model('Project', projectSchema);
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Service = mongoose.model('Service', serviceSchema);
const ProjectCategory = mongoose.model(
  'ProjectCategory',
  projectCategorySchema,
);
const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema);
const About = mongoose.model('About', aboutSchema);

// ==================== SEED FUNCTIONS ====================

async function seedUsers() {
  if (!process.env.SEED_ADMIN_PASSWORD) {
    throw new Error('SEED_ADMIN_PASSWORD is required to seed the admin user');
  }

  console.log('🌱 جاري زرع بيانات المستخدمين...');

  const usersData = [
    {
      name: 'أحمد محمد',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@smartagency.com',
      password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10),
      role: 'admin',
      isActive: true,
    },
    {
      name: 'فاطمة علي',
      email: 'editor@smartagency.com',
      password: await bcrypt.hash('editor123', 10),
      role: 'editor',
      isActive: true,
    },
    {
      name: 'خالد حسن',
      email: 'khaled@smartagency.com',
      password: await bcrypt.hash('editor123', 10),
      role: 'editor',
      isActive: true,
    },
  ];

  const users = [];
  for (const userData of usersData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`✅ تم إنشاء المستخدم: ${userData.name}`);
    } else {
      users.push(existingUser);
      console.log(`ℹ️  المستخدم موجود بالفعل: ${userData.name}`);
    }
  }

  return users;
}

async function seedTechnologies() {
  console.log('🌱 جاري زرع بيانات التقنيات...');

  const technologiesData = [
    {
      name: 'NestJS',
      category: 'Backend',
      description: 'إطار عمل Node.js قوي وقابل للتوسع',
      tooltip: 'إطار عمل قوي لبناء واجهات برمجية سريعة وآمنة',
    },
    {
      name: 'React',
      category: 'Frontend',
      description: 'مكتبة JavaScript لبناء واجهات المستخدم',
      tooltip: 'مكتبة لبناء واجهات مستخدم تفاعلية وسريعة',
    },
    {
      name: 'Vue.js',
      category: 'Frontend',
      description: 'إطار عمل JavaScript تقدمي',
      tooltip: 'إطار عمل مرن لبناء واجهات مستخدم حديثة',
    },
    {
      name: 'Angular',
      category: 'Frontend',
      description: 'إطار عمل TypeScript من Google',
      tooltip: 'إطار عمل قوي من Google للتطبيقات المعقدة',
    },
    {
      name: 'Node.js',
      category: 'Backend',
      description: 'بيئة تشغيل JavaScript من جانب الخادم',
      tooltip: 'بيئة سريعة لبناء خدمات الويب المقاسة',
    },
    {
      name: 'MongoDB',
      category: 'Database',
      description: 'قاعدة بيانات NoSQL',
      tooltip: 'قاعدة بيانات مرنة وسريعة لتخزين البيانات',
    },
    {
      name: 'PostgreSQL',
      category: 'Database',
      description: 'قاعدة بيانات علائقية متقدمة',
      tooltip: 'قاعدة بيانات قوية وموثوقة للبيانات المعقدة',
    },
    {
      name: 'Docker',
      category: 'DevOps',
      description: 'منصة للحاويات',
      tooltip: 'نستخدمها لتسهيل نشر التطبيقات وإدارتها',
    },
    {
      name: 'AWS',
      category: 'DevOps',
      description: 'خدمات سحابية من Amazon',
      tooltip: 'خدمات سحابية موثوقة لتشغيل التطبيقات',
    },
    {
      name: 'React Native',
      category: 'Mobile',
      description: 'إطار عمل لتطوير تطبيقات الجوال',
      tooltip: 'لبناء تطبيقات جوال أصلية بتقنية واحدة',
    },
    {
      name: 'Flutter',
      category: 'Mobile',
      description: 'إطار عمل Google لتطوير التطبيقات',
      tooltip: 'إطار عمل Google لبناء تطبيقات جوال جميلة',
    },
    {
      name: 'TypeScript',
      category: 'Frontend',
      description: 'JavaScript مع أنواع البيانات',
      tooltip: 'يجعل الكود أكثر أماناً وسهولة في الصيانة',
    },
    {
      name: 'GraphQL',
      category: 'Backend',
      description: 'لغة استعلام للواجهات البرمجية',
      tooltip: 'لطلب البيانات بدقة وكفاءة عالية',
    },
    {
      name: 'Redis',
      category: 'Database',
      description: 'مخزن بيانات في الذاكرة',
      tooltip: 'نستخدمها لسرعة استجابة البيانات (Caching)',
    },
  ];

  const technologies = [];
  for (const techData of technologiesData) {
    const existingTech = await Technology.findOne({ name: techData.name });
    if (!existingTech) {
      const tech = new Technology(techData);
      await tech.save();
      technologies.push(tech);
      console.log(`✅ تم إنشاء التقنية: ${techData.name}`);
    } else {
      technologies.push(existingTech);
      console.log(`ℹ️  التقنية موجودة بالفعل: ${techData.name}`);
    }
  }

  return technologies;
}

async function seedBlogs(users) {
  console.log('🌱 جاري زرع بيانات المدونات...');

  const blogsData = [
    {
      title: 'دليل شامل لتطوير تطبيقات الويب الحديثة',
      slug: 'guide-modern-web-development',
      content: `
        <h2>مقدمة</h2>
        <p>تطوير تطبيقات الويب الحديثة يتطلب فهماً عميقاً للتقنيات والأدوات المتاحة. في هذا المقال، سنستكشف أفضل الممارسات والطرق الحديثة لتطوير تطبيقات ويب قوية وقابلة للتوسع.</p>
        
        <h2>اختيار التقنيات المناسبة</h2>
        <p>اختيار التقنيات المناسبة هو الخطوة الأولى في بناء تطبيق ويب ناجح. يجب أن تأخذ في الاعتبار متطلبات المشروع، حجم الفريق، والموارد المتاحة.</p>
        
        <h2>أفضل الممارسات</h2>
        <ul>
          <li>استخدام TypeScript لتحسين جودة الكود</li>
          <li>تطبيق مبادئ SOLID</li>
          <li>كتابة اختبارات شاملة</li>
          <li>استخدام CI/CD للتحسين المستمر</li>
        </ul>
      `,
      excerpt:
        'دليل شامل يغطي جميع جوانب تطوير تطبيقات الويب الحديثة من اختيار التقنيات إلى أفضل الممارسات',
      coverImage:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      author: users[0]._id,
      tags: ['تطوير الويب', 'برمجة', 'تقنيات'],
      isPublished: true,
      publishedAt: new Date('2024-01-15'),
      views: 1250,
      seo: {
        metaTitle: 'دليل شامل لتطوير تطبيقات الويب الحديثة',
        metaDescription:
          'تعرف على أفضل الممارسات والتقنيات لتطوير تطبيقات ويب حديثة وقوية',
        keywords: ['تطوير الويب', 'برمجة', 'تقنيات', 'أفضل الممارسات'],
      },
    },
    {
      title: 'كيفية تحسين أداء تطبيقات React',
      slug: 'optimize-react-performance',
      content: `
        <h2>مقدمة</h2>
        <p>تحسين الأداء في تطبيقات React هو أمر حاسم لضمان تجربة مستخدم ممتازة. في هذا المقال، سنستعرض أهم التقنيات والأدوات لتحسين الأداء.</p>
        
        <h2>استخدام React.memo</h2>
        <p>React.memo يساعد في منع إعادة التصيير غير الضرورية للمكونات.</p>
        
        <h2>استخدام useMemo و useCallback</h2>
        <p>هذه الـ hooks تساعد في تحسين الأداء من خلال تقليل الحسابات والوظائف المعاد إنشاؤها.</p>
      `,
      excerpt:
        'تعلم كيفية تحسين أداء تطبيقات React باستخدام أفضل التقنيات والأدوات المتاحة',
      coverImage:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      author: users[1]._id,
      tags: ['React', 'الأداء', 'تحسين'],
      isPublished: true,
      publishedAt: new Date('2024-02-10'),
      views: 890,
      seo: {
        metaTitle: 'كيفية تحسين أداء تطبيقات React',
        metaDescription:
          'دليل شامل لتحسين أداء تطبيقات React باستخدام أفضل الممارسات',
        keywords: ['React', 'الأداء', 'تحسين', 'أفضل الممارسات'],
      },
    },
    {
      title: 'مقدمة إلى NestJS: إطار عمل قوي لـ Node.js',
      slug: 'introduction-to-nestjs',
      content: `
        <h2>ما هو NestJS؟</h2>
        <p>NestJS هو إطار عمل Node.js قوي وقابل للتوسع يستخدم TypeScript. يوفر بنية منظمة وواضحة لبناء تطبيقات خادم قوية.</p>
        
        <h2>المميزات الرئيسية</h2>
        <ul>
          <li>دعم TypeScript بشكل كامل</li>
          <li>بنية معيارية قوية</li>
          <li>دعم Dependency Injection</li>
          <li>تكامل سهل مع قواعد البيانات</li>
        </ul>
      `,
      excerpt:
        'تعرف على NestJS، إطار عمل Node.js القوي الذي يساعدك في بناء تطبيقات خادم احترافية',
      coverImage:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      author: users[0]._id,
      tags: ['NestJS', 'Node.js', 'Backend'],
      isPublished: true,
      publishedAt: new Date('2024-03-05'),
      views: 650,
      seo: {
        metaTitle: 'مقدمة إلى NestJS: إطار عمل قوي لـ Node.js',
        metaDescription:
          'تعرف على NestJS وكيفية استخدامه لبناء تطبيقات خادم قوية',
        keywords: ['NestJS', 'Node.js', 'Backend', 'TypeScript'],
      },
    },
  ];

  for (const blogData of blogsData) {
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    if (!existingBlog) {
      const blog = new Blog(blogData);
      await blog.save();
      console.log(`✅ تم إنشاء المدونة: ${blogData.title}`);
    } else {
      console.log(`ℹ️  المدونة موجودة بالفعل: ${blogData.title}`);
    }
  }
}

async function seedFaqs() {
  console.log('🌱 جاري زرع بيانات الأسئلة الشائعة...');

  const faqsData = [
    {
      question: 'ما هي الخدمات التي تقدمونها؟',
      answer:
        'نقدم مجموعة واسعة من الخدمات التقنية بما في ذلك تطوير تطبيقات الويب، تطبيقات الجوال، أنظمة ERP، أنظمة التجارة الإلكترونية، وأتمتة العمليات.',
      category: 'عام',
      order: 1,
      isActive: true,
    },
    {
      question: 'كم تستغرق عملية تطوير التطبيق؟',
      answer:
        'مدة التطوير تعتمد على حجم المشروع وتعقيده. التطبيقات البسيطة قد تستغرق من 2-4 أسابيع، بينما المشاريع الكبيرة قد تستغرق عدة أشهر.',
      category: 'عام',
      order: 2,
      isActive: true,
    },
    {
      question: 'ما هي التقنيات التي تستخدمونها؟',
      answer:
        'نستخدم أحدث التقنيات والأدوات مثل React، Vue.js، Angular للواجهات الأمامية، و NestJS، Node.js للواجهات الخلفية، بالإضافة إلى MongoDB و PostgreSQL لقواعد البيانات.',
      category: 'تقني',
      order: 1,
      isActive: true,
    },
    {
      question: 'هل تقدمون خدمات الصيانة والدعم؟',
      answer:
        'نعم، نقدم خدمات الصيانة والدعم الفني المستمر لجميع المشاريع التي نطورها. يمكنك اختيار خطة دعم تناسب احتياجاتك.',
      category: 'خدمات',
      order: 1,
      isActive: true,
    },
    {
      question: 'كيف يمكنني طلب عرض سعر؟',
      answer:
        'يمكنك ملء نموذج التواصل على موقعنا أو إرسال بريد إلكتروني إلينا. سنقوم بالرد عليك خلال 24 ساعة مع عرض سعر مفصل.',
      category: 'عام',
      order: 3,
      isActive: true,
    },
    {
      question: 'هل تقدمون استضافة المواقع؟',
      answer:
        'نعم، نقدم خدمات استضافة متنوعة تشمل الاستضافة المشتركة، VPS، والخوادم المخصصة. جميع خططنا تتضمن دعم فني 24/7.',
      category: 'استضافة',
      order: 1,
      isActive: true,
    },
  ];

  for (const faqData of faqsData) {
    const existingFaq = await Faq.findOne({ question: faqData.question });
    if (!existingFaq) {
      const faq = new Faq(faqData);
      await faq.save();
      console.log(`✅ تم إنشاء السؤال: ${faqData.question}`);
    } else {
      console.log(`ℹ️  السؤال موجود بالفعل: ${faqData.question}`);
    }
  }
}

async function seedHostingPackages() {
  console.log('🌱 جاري زرع بيانات باقات الاستضافة...');

  const packagesData = [
    {
      name: 'الخطة الأساسية',
      description: 'مثالية للمواقع الصغيرة والمدونات الشخصية',
      price: 50,
      currency: 'SAR',
      originalPrice: 70,
      billingCycle: 'Monthly',
      category: 'Shared Hosting',
      features: [
        '10GB مساحة تخزين',
        'نطاق مجاني',
        'بريد إلكتروني غير محدود',
        'دعم SSL مجاني',
        'نسخ احتياطي يومي',
      ],
      isPopular: false,
      isBestValue: false,
      isActive: true,
      sortOrder: 1,
      storage: '10GB SSD',
      bandwidth: 'غير محدود',
      ram: '512MB',
      cpu: '1 vCPU',
      domains: 'نطاق واحد',
      discountPercentage: 28,
      yearlyPrice: Math.round(50 * 12 * 0.8), // 480 SAR (20% discount)
      benefitHints: {
        storage: '10GB (مناسب للمواقع الصغيرة والمدونات الشخصية)',
        ram: '512MB (كافي لمواقع WordPress بسيطة)',
        cpu: '1 vCPU (أداء مناسب لعدد محدود من الزوار)',
        domains: 'نطاق واحد (مثالي للمبتدئين)',
      },
    },
    {
      name: 'الخطة المتوسطة',
      description: 'مناسبة للمواقع المتوسطة الحجم والمتاجر الإلكترونية الصغيرة',
      price: 120,
      currency: 'SAR',
      originalPrice: 150,
      billingCycle: 'Monthly',
      category: 'Shared Hosting',
      features: [
        '50GB مساحة تخزين',
        '5 نطاقات',
        'بريد إلكتروني غير محدود',
        'دعم SSL مجاني',
        'نسخ احتياطي يومي',
        'أداء محسّن',
      ],
      isPopular: true,
      isBestValue: true,
      isActive: true,
      sortOrder: 2,
      storage: '50GB SSD',
      bandwidth: 'غير محدود',
      ram: '2GB',
      cpu: '2 vCPU',
      domains: '5 نطاقات',
      discountPercentage: 20,
      yearlyPrice: Math.round(120 * 12 * 0.8), // 1152 SAR (20% discount)
      basePackageId: null, // Will be set after creating packages (reference to basic plan)
      benefitHints: {
        storage: '50GB (تكفي لحوالي 10,000 زائر شهرياً)',
        ram: '2GB (مناسب للمواقع متوسطة الحجم والمتاجر الصغيرة)',
        cpu: '2 vCPU (أداء سريع للعمليات المعقدة)',
        domains: '5 نطاقات (مناسب للشركات الناشئة)',
      },
    },
    {
      name: 'الخطة المتقدمة',
      description: 'مثالية للمواقع الكبيرة والتطبيقات عالية الأداء',
      price: 250,
      currency: 'SAR',
      originalPrice: 300,
      billingCycle: 'Monthly',
      category: 'VPS',
      features: [
        '100GB مساحة تخزين',
        'نطاقات غير محدودة',
        'بريد إلكتروني غير محدود',
        'دعم SSL مجاني',
        'نسخ احتياطي يومي',
        'أداء عالي',
        'دعم فني 24/7',
      ],
      isPopular: false,
      isBestValue: false,
      isActive: true,
      sortOrder: 3,
      storage: '100GB SSD',
      bandwidth: 'غير محدود',
      ram: '4GB',
      cpu: '4 vCPU',
      domains: 'غير محدود',
      discountPercentage: 16,
      yearlyPrice: Math.round(250 * 12 * 0.8), // 2400 SAR (20% discount)
      basePackageId: null, // Will be set after creating packages (reference to medium plan)
      benefitHints: {
        storage: '100GB (تكفي لحوالي 50,000 زائر شهرياً)',
        ram: '4GB (مناسب للتطبيقات عالية الأداء والمواقع الكبيرة)',
        cpu: '4 vCPU (أداء فائق للتطبيقات المعقدة)',
        domains: 'غير محدود (مثالي للشركات الكبرى)',
      },
    },
    {
      name: 'استضافة WordPress',
      description: 'مخصصة لمواقع WordPress مع أداء محسّن',
      price: 80,
      currency: 'SAR',
      originalPrice: 100,
      billingCycle: 'Monthly',
      category: 'WordPress Hosting',
      features: [
        '30GB مساحة تخزين',
        '3 نطاقات',
        'تثبيت WordPress تلقائي',
        'قوالب مميزة',
        'إضافات مجانية',
        'دعم SSL مجاني',
      ],
      isPopular: false,
      isBestValue: false,
      isActive: true,
      sortOrder: 4,
      storage: '30GB SSD',
      bandwidth: 'غير محدود',
      ram: '1GB',
      cpu: '1.5 vCPU',
      domains: '3 نطاقات',
      discountPercentage: 20,
      yearlyPrice: Math.round(80 * 12 * 0.8), // 768 SAR (20% discount)
      benefitHints: {
        storage: '30GB (كافي لمعظم مواقع WordPress متوسطة الحجم)',
        ram: '1GB (محسن خصيصاً لأداء WordPress)',
        cpu: '1.5 vCPU (أداء ممتاز لمواقع WordPress)',
        domains: '3 نطاقات (مناسب لمواقع WordPress متعددة)',
      },
    },
  ];

  const createdPackages = [];
  for (const packageData of packagesData) {
    const existingPackage = await HostingPackage.findOne({
      name: packageData.name,
    });
    if (!existingPackage) {
      const pkg = new HostingPackage(packageData);
      await pkg.save();
      createdPackages.push(pkg);
      console.log(`✅ تم إنشاء الباقة: ${packageData.name}`);
    } else {
      createdPackages.push(existingPackage);
      console.log(`ℹ️  الباقة موجودة بالفعل: ${packageData.name}`);
    }
  }

  // Set basePackageId references for feature stacking
  const basicPackage = createdPackages.find(
    (pkg) => pkg.name === 'الخطة الأساسية',
  );
  const mediumPackage = createdPackages.find(
    (pkg) => pkg.name === 'الخطة المتوسطة',
  );

  if (basicPackage && mediumPackage) {
    // Update medium package to reference basic package
    await HostingPackage.findByIdAndUpdate(mediumPackage._id, {
      basePackageId: basicPackage._id,
    });

    // Update advanced package to reference medium package
    const advancedPackage = createdPackages.find(
      (pkg) => pkg.name === 'الخطة المتقدمة',
    );
    if (advancedPackage) {
      await HostingPackage.findByIdAndUpdate(advancedPackage._id, {
        basePackageId: mediumPackage._id,
      });
    }

    console.log('✅ تم تحديث مراجع الباقات الأساسية للـ feature stacking');
  }
}

async function seedLeads() {
  console.log('🌱 جاري زرع بيانات العملاء المحتملين...');

  const leadsData = [
    {
      fullName: 'محمد أحمد',
      companyName: 'شركة التقنية المتقدمة',
      email: 'mohamed@tech-advanced.com',
      phone: '+966501234567',
      budgetRange: '$1,000 - $5,000',
      serviceType: 'Web App',
      message: 'نرغب في تطوير موقع إلكتروني لشركتنا مع نظام إدارة محتوى متقدم',
      status: 'New',
      source: 'الموقع الإلكتروني',
      leadType: 'Project Brief',
      projectStage: 'Existing Business',
      projectGoal: 'تحسين الحضور الرقمي للشركة',
      timeline: '2-3 Months',
      preferredContactMethod: 'Email',
      companySize: 'Company',
      hasBrandIdentity: true,
      hasContentReady: true,
      priority: 'Medium',
    },
    {
      fullName: 'سارة خالد',
      companyName: 'متجر الأزياء الأنيق',
      email: 'sara@fashion-store.com',
      phone: '+966502345678',
      budgetRange: '$5,000 - $15,000',
      serviceType: 'E-Commerce',
      message: 'نحتاج إلى تطوير متجر إلكتروني متكامل مع نظام دفع وإدارة طلبات',
      status: 'Contacted',
      notes: 'تم التواصل مع العميل وتم تحديد موعد للاجتماع',
      source: 'الإحالة',
      leadType: 'Project Brief',
      projectStage: 'Existing Business',
      projectGoal: 'إطلاق متجر إلكتروني لإدارة الطلبات والمنتجات وربط واتساب',
      timeline: '2-3 Months',
      preferredContactMethod: 'WhatsApp',
      companySize: 'Small Business',
      hasBrandIdentity: true,
      hasContentReady: false,
      projectAnswers: {
        productsReady: true,
        needsDeliveryIntegration: true,
        needsPayment: false,
        needsAdminPanel: true,
      },
      priority: 'High',
    },
    {
      fullName: 'علي حسن',
      companyName: 'مؤسسة التصنيع الحديث',
      email: 'ali@manufacturing.com',
      phone: '+966503456789',
      budgetRange: '$15,000+',
      serviceType: 'ERP',
      message: 'نبحث عن نظام ERP شامل لإدارة عمليات التصنيع والمخزون',
      status: 'Proposal Sent',
      notes: 'تم إرسال العرض الفني والمالي، في انتظار الرد',
      source: 'البريد الإلكتروني',
      leadType: 'Project Brief',
      projectStage: 'Scaling',
      projectGoal: 'دمج عدة أنظمة منفصلة في نظام واحد موحد',
      timeline: 'Flexible',
      preferredContactMethod: 'Meeting',
      companySize: 'Company',
      priority: 'High',
    },
    {
      fullName: 'فاطمة محمود',
      companyName: 'مطعم الطعم الأصيل',
      email: 'fatima@restaurant.com',
      phone: '+966504567890',
      budgetRange: '< $1,000',
      serviceType: 'Mobile App',
      message: 'نريد تطبيق جوال لطلب الطعام مع نظام توصيل',
      status: 'Negotiation',
      notes: 'في مرحلة التفاوض على السعر والمواصفات النهائية',
      source: 'وسائل التواصل الاجتماعي',
      leadType: 'Project Brief',
      projectStage: 'Idea',
      projectGoal: 'بناء MVP لتطبيق طلب طعام مع لوحة تحكم',
      timeline: '1 Month',
      preferredContactMethod: 'WhatsApp',
      companySize: 'Startup',
      hasBrandIdentity: false,
      hasContentReady: false,
      projectAnswers: {
        platforms: 'Android first',
        needsAdminPanel: true,
        hasDesign: false,
        productScope: 'MVP',
      },
      priority: 'High',
    },
    {
      fullName: 'خالد يوسف',
      companyName: 'شركة الخدمات اللوجستية',
      email: 'khalid@logistics.com',
      phone: '+966505678901',
      budgetRange: '$5,000 - $15,000',
      serviceType: 'Automation',
      message: 'نحتاج إلى أتمتة عمليات التوصيل وإدارة الأسطول',
      status: 'Closed-Won',
      notes: 'تم إغلاق الصفقة بنجاح، سيبدأ المشروع الأسبوع القادم',
      source: 'الموقع الإلكتروني',
      leadType: 'Project Brief',
      projectStage: 'Scaling',
      projectGoal: 'أتمتة استقبال الطلبات من واتساب وربطها بجدول متابعة',
      timeline: 'Flexible',
      preferredContactMethod: 'Phone',
      companySize: 'Company',
      projectAnswers: {
        currentTools: 'WhatsApp + Excel',
        needsCRM: true,
        needsNotifications: true,
      },
      priority: 'Medium',
    },
    {
      fullName: 'أحمد القباطي',
      companyName: 'مؤسسة القباطي التجارية',
      email: 'ahmed@example.com',
      phone: '+967777111222',
      serviceType: 'Other',
      budgetRange: 'Not Specified',
      message: 'أريد معرفة المزيد عن خدمات تطوير المواقع.',
      status: 'New',
      source: 'Contact Page',
      leadType: 'Contact',
      contactReason: 'general',
      preferredContactMethod: 'Email',
      priority: 'Medium',
    },
    {
      fullName: 'مازن علي',
      companyName: 'خدمة محلية ناشئة',
      email: 'mazen@example.com',
      phone: '+967777555666',
      budgetRange: '$5,000 - $15,000',
      serviceType: 'Mobile App',
      message: 'بناء MVP لتطبيق خدمات محلية مع لوحة تحكم',
      status: 'Contacted',
      source: 'Start Project Wizard',
      leadType: 'Project Brief',
      projectStage: 'Idea',
      projectGoal: 'بناء MVP لتطبيق خدمات محلية مع لوحة تحكم',
      timeline: '1 Month',
      preferredContactMethod: 'Meeting',
      companySize: 'Startup',
      hasBrandIdentity: false,
      hasContentReady: false,
      projectAnswers: {
        platforms: 'Android first',
        needsAdminPanel: true,
        hasDesign: false,
        productScope: 'MVP',
      },
      priority: 'High',
    },
    {
      fullName: 'عبدالله حسن',
      companyName: 'شركة توزيع',
      email: 'abdullah@example.com',
      phone: '+967777777888',
      budgetRange: '$1,000 - $5,000',
      serviceType: 'Automation',
      message: 'أتمتة استقبال الطلبات من واتساب وربطها بجدول متابعة',
      status: 'Proposal Sent',
      source: 'Start Project Wizard',
      leadType: 'Project Brief',
      projectStage: 'Scaling',
      projectGoal: 'أتمتة استقبال الطلبات من واتساب وربطها بجدول متابعة',
      timeline: 'Flexible',
      preferredContactMethod: 'Phone',
      companySize: 'Company',
      projectAnswers: {
        currentTools: 'WhatsApp + Excel',
        needsCRM: true,
        needsNotifications: true,
      },
      priority: 'Medium',
    },
  ];

  for (const leadData of leadsData) {
    const existingLead = await Lead.findOne({ email: leadData.email });
    if (!existingLead) {
      const lead = new Lead(leadData);
      await lead.save();
      console.log(`✅ تم إنشاء العميل المحتمل: ${leadData.fullName}`);
    } else {
      console.log(`ℹ️  العميل المحتمل موجود بالفعل: ${leadData.fullName}`);
    }
  }
}

async function seedProjects(users, technologies, projectCategories) {
  console.log('🌱 جاري زرع بيانات المشاريع...');

  const projectsData = [
    {
      title: 'نظام إدارة المتاجر الإلكترونية',
      slug: 'ecommerce-management-system',
      summary:
        'نظام متكامل لإدارة المتاجر الإلكترونية مع دعم متعدد البائعين والدفع الإلكتروني',
      challenge:
        'كان العميل يحتاج إلى نظام يدعم عدة بائعين مع إدارة معقدة للمخزون والطلبات',
      solution:
        'قمنا بتطوير نظام متكامل باستخدام NestJS و React مع دعم كامل للمتاجر المتعددة',
      features: [
        'لوحة تحكم متعددة البائعين',
        'نظام دفع إلكتروني متكامل',
        'إدارة المخزون والطلبات',
        'تقارير وتحليلات متقدمة',
        'تطبيق موبايل للعملاء',
      ],
      results: [
        { label: 'زيادة المبيعات', value: '300%' },
        { label: 'تحسين الأداء', value: '85%' },
        { label: 'رضا العملاء', value: '95%' },
      ],
      stats: [
        { label: 'الشاشات', value: '+35', description: 'واجهة ولوحة تحكم' },
        { label: 'مدة التنفيذ', value: '45 يوم' },
        { label: 'البائعين', value: '+120' },
      ],
      technologies: [
        technologies[0]._id,
        technologies[1]._id,
        technologies[5]._id,
      ],
      images: {
        cover:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
          'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        ],
      },
      projectUrl: 'https://example-ecommerce.com',
      clientName: 'شركة التجارة الإلكترونية',
      clientLogo: 'https://via.placeholder.com/150x50?text=E-Commerce+Co',
      category: 'E-Commerce',
      projectTypes: ['E-Commerce', 'Web App'],
      industry: 'تجارة إلكترونية',
      duration: '45 يوم',
      year: '2025',
      isFeatured: true,
      isPublished: true,
      seo: {
        metaTitle: 'نظام إدارة المتاجر الإلكترونية - Smart Agency',
        metaDescription:
          'نظام متكامل لإدارة المتاجر الإلكترونية مع دعم متعدد البائعين',
        keywords: ['متجر إلكتروني', 'E-commerce', 'نظام إدارة'],
      },
    },
    {
      title: 'تطبيق جوال لإدارة المهام',
      slug: 'mobile-task-management-app',
      summary: 'تطبيق جوال متقدم لإدارة المهام والمشاريع مع مزامنة سحابية',
      challenge: 'كانت الحاجة لتطبيق يعمل على iOS و Android مع مزامنة فورية',
      solution:
        'استخدمنا React Native لبناء تطبيق واحد يعمل على كلا المنصتين مع MongoDB للمزامنة',
      features: [
        'مزامنة فورية عبر السحابة',
        'إشعارات ذكية',
        'تصنيف المهام والمشاريع',
        'تقارير الإنتاجية',
        'وضع عدم الاتصال',
      ],
      results: [
        { label: 'عدد المستخدمين', value: '50,000+' },
        { label: 'تقييم التطبيق', value: '4.8/5' },
        { label: 'معدل الاستخدام اليومي', value: '85%' },
      ],
      stats: [
        { label: 'المستخدمين', value: '50K+', description: 'مستخدم نشط' },
        { label: 'مدة التنفيذ', value: '60 يوم' },
        { label: 'التقييم', value: '4.8/5' },
      ],
      technologies: [technologies[9]._id, technologies[5]._id, technologies[11]._id],
      images: {
        cover:
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        ],
      },
      projectUrl: 'https://example-taskapp.com',
      clientName: 'شركة الإنتاجية',
      clientLogo: 'https://via.placeholder.com/150x50?text=Productivity+Co',
      category: 'Mobile App',
      projectTypes: ['Mobile App'],
      industry: 'إنتاجية',
      duration: '60 يوم',
      year: '2025',
      isFeatured: true,
      isPublished: true,
      seo: {
        metaTitle: 'تطبيق جوال لإدارة المهام - Smart Agency',
        metaDescription: 'تطبيق جوال متقدم لإدارة المهام والمشاريع',
        keywords: ['تطبيق جوال', 'إدارة المهام', 'React Native'],
      },
    },
    {
      title: 'نظام ERP للتصنيع',
      slug: 'manufacturing-erp-system',
      summary: 'نظام ERP شامل لإدارة عمليات التصنيع والمخزون والموارد البشرية',
      challenge: 'كانت الشركة تحتاج إلى دمج عدة أنظمة منفصلة في نظام واحد موحد',
      solution:
        'طورنا نظام ERP متكامل باستخدام NestJS مع واجهات متعددة للوحدات المختلفة',
      features: [
        'إدارة المخزون والمشتريات',
        'نظام الموارد البشرية',
        'إدارة الإنتاج والجودة',
        'تقارير مالية متقدمة',
        'لوحة تحكم تنفيذية',
      ],
      results: [
        { label: 'تقليل التكاليف', value: '40%' },
        { label: 'تحسين الكفاءة', value: '60%' },
        { label: 'تقليل الأخطاء', value: '75%' },
      ],
      stats: [
        { label: 'الوحدات', value: '8', description: 'وحدة متكاملة' },
        { label: 'مدة التنفيذ', value: '4 أشهر' },
        { label: 'الموظفين', value: '+200' },
      ],
      technologies: [
        technologies[0]._id,
        technologies[6]._id,
        technologies[13]._id,
        technologies[7]._id,
      ],
      images: {
        cover:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        ],
      },
      projectUrl: 'https://example-erp.com',
      clientName: 'مصنع التصنيع المتقدم',
      clientLogo: 'https://via.placeholder.com/150x50?text=Manufacturing+Co',
      category: 'ERP',
      projectTypes: ['ERP', 'Web App'],
      industry: 'تصنيع',
      duration: '4 أشهر',
      year: '2024',
      isFeatured: false,
      isPublished: true,
      seo: {
        metaTitle: 'نظام ERP للتصنيع - Smart Agency',
        metaDescription: 'نظام ERP شامل لإدارة عمليات التصنيع',
        keywords: ['ERP', 'نظام إدارة', 'تصنيع'],
      },
    },
  ];

  const projects = [];
  for (const projectData of projectsData) {
    const existingProject = await Project.findOne({ slug: projectData.slug });
    if (!existingProject) {
      const project = new Project(projectData);
      await project.save();
      projects.push(project);
      console.log(`✅ تم إنشاء المشروع: ${projectData.title}`);
    } else {
      projects.push(existingProject);
      console.log(`ℹ️  المشروع موجود بالفعل: ${projectData.title}`);
    }
  }

  return projects;
}

async function seedTeamMembers() {
  console.log('🌱 جاري زرع بيانات أعضاء الفريق...');

  const teamMembersData = [
    {
      fullName: 'أحمد محمد',
      role: 'مدير المشاريع',
      department: 'Management',
      photo: 'https://i.pravatar.cc/150?img=1',
      bio: 'خبرة أكثر من 10 سنوات في إدارة المشاريع التقنية والفرق البرمجية',
      funFact: 'مدمن قهوة ☕',
      email: 'ahmed@smartagency.com',
      linkedinUrl: 'https://linkedin.com/in/ahmed',
      githubUrl: 'https://github.com/ahmed',
      specializations: ['إدارة المشاريع', 'Agile', 'Scrum'],
      showOnHome: true,
      showOnAbout: true,
      isActive: true,
      sortOrder: 1,
      projectsCount: 50,
      joinedAt: new Date('2020-01-15'),
    },
    {
      fullName: 'فاطمة علي',
      role: 'مطورة Backend متقدمة',
      department: 'Backend',
      photo: 'https://i.pravatar.cc/150?img=5',
      bio: 'متخصصة في تطوير واجهات برمجية قوية وآمنة باستخدام NestJS و Node.js',
      funFact: 'تحب حل الألغاز 🧩',
      email: 'fatima@smartagency.com',
      linkedinUrl: 'https://linkedin.com/in/fatima',
      githubUrl: 'https://github.com/fatima',
      specializations: [
        'NestJS',
        'Node.js',
        'MongoDB',
        'PostgreSQL',
        'GraphQL',
      ],
      showOnHome: true,
      showOnAbout: true,
      isActive: true,
      sortOrder: 2,
      projectsCount: 35,
      joinedAt: new Date('2021-03-20'),
    },
    {
      fullName: 'خالد حسن',
      role: 'مطور Frontend',
      department: 'Frontend',
      photo: 'https://i.pravatar.cc/150?img=12',
      bio: 'خبير في بناء واجهات مستخدم حديثة وجذابة باستخدام React و Vue.js',
      funFact: 'يعشق التصوير الفوتوغرافي 📸',
      email: 'khalid@smartagency.com',
      linkedinUrl: 'https://linkedin.com/in/khalid',
      githubUrl: 'https://github.com/khalid',
      specializations: ['React', 'Vue.js', 'TypeScript', 'Next.js'],
      showOnHome: true,
      showOnAbout: true,
      isActive: true,
      sortOrder: 3,
      projectsCount: 40,
      joinedAt: new Date('2021-06-10'),
    },
    {
      fullName: 'سارة محمود',
      role: 'مصممة واجهات المستخدم',
      department: 'Design',
      photo: 'https://i.pravatar.cc/150?img=9',
      bio: 'مصممة محترفة متخصصة في تصميم واجهات المستخدم وتجربة المستخدم',
      funFact: 'عاشقة للفن والرسم 🎨',
      email: 'sara@smartagency.com',
      linkedinUrl: 'https://linkedin.com/in/sara',
      specializations: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
      showOnHome: true,
      showOnAbout: true,
      isActive: true,
      sortOrder: 4,
      projectsCount: 45,
      joinedAt: new Date('2020-09-05'),
    },
    {
      fullName: 'يوسف أحمد',
      role: 'مهندس DevOps',
      department: 'DevOps',
      photo: 'https://i.pravatar.cc/150?img=15',
      bio: 'متخصص في البنية التحتية السحابية والتحسين المستمر للنشر',
      funFact: 'لاعب شطرنج محترف ♟️',
      email: 'youssef@smartagency.com',
      linkedinUrl: 'https://linkedin.com/in/youssef',
      githubUrl: 'https://github.com/youssef',
      specializations: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
      showOnHome: false,
      showOnAbout: true,
      isActive: true,
      sortOrder: 5,
      projectsCount: 30,
      joinedAt: new Date('2022-01-10'),
    },
  ];

  for (const memberData of teamMembersData) {
    const existingMember = await TeamMember.findOne({
      email: memberData.email,
    });
    if (!existingMember) {
      const member = new TeamMember(memberData);
      await member.save();
      console.log(`✅ تم إنشاء عضو الفريق: ${memberData.fullName}`);
    } else {
      // تحديث العضو الموجود لضمان وجود جميع الحقول الجديدة
      Object.assign(existingMember, memberData);
      await existingMember.save();
      console.log(`🔄 تم تحديث عضو الفريق: ${memberData.fullName}`);
    }
  }
}

async function seedTestimonials(projects) {
  console.log('🌱 جاري زرع بيانات الشهادات...');

  const testimonialsData = [
    {
      clientName: 'محمد العلي',
      position: 'المدير التنفيذي',
      companyName: 'شركة التجارة الإلكترونية',
      companyLogo: 'https://via.placeholder.com/150',
      clientPhoto: 'https://i.pravatar.cc/150?img=3',
      content:
        'لقد كانت تجربة رائعة العمل مع Smart Agency. فريق محترف ومتفاني، وقد نجحوا في تطوير نظام متجر إلكتروني متكامل يفوق توقعاتنا. الأداء ممتاز والدعم الفني مستمر.',
      rating: 5,
      linkedProject: projects[0]._id,
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      clientName: 'فاطمة السالم',
      position: 'مديرة التطوير',
      companyName: 'شركة الإنتاجية',
      companyLogo: 'https://via.placeholder.com/150',
      clientPhoto: 'https://i.pravatar.cc/150?img=8',
      content:
        'تطبيق إدارة المهام الذي طوروه لنا غير طريقة عملنا بالكامل. أصبحنا أكثر إنتاجية وتنظيماً. التطبيق سهل الاستخدام وسريع، والفريق كان متجاوباً جداً مع متطلباتنا.',
      rating: 5,
      linkedProject: projects[1]._id,
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      clientName: 'خالد النجار',
      position: 'مدير تقنية المعلومات',
      companyName: 'مصنع التصنيع المتقدم',
      companyLogo: 'https://via.placeholder.com/150',
      clientPhoto: 'https://i.pravatar.cc/150?img=11',
      content:
        'نظام ERP الذي طوروه لنا ساعدنا في تحسين عملياتنا بشكل كبير. تقليل التكاليف وزيادة الكفاءة كانت نتائج ملموسة. أنصح بشدة بالعمل معهم.',
      rating: 5,
      linkedProject: projects[2]._id,
      isActive: true,
      isFeatured: false,
      sortOrder: 3,
    },
    {
      clientName: 'نورا أحمد',
      position: 'المؤسسة والمديرة',
      companyName: 'متجر الأزياء الأنيق',
      companyLogo: 'https://via.placeholder.com/150',
      clientPhoto: 'https://i.pravatar.cc/150?img=13',
      content:
        'المتجر الإلكتروني الذي طوروه لنا جميل وسهل الاستخدام. المبيعات زادت بشكل كبير منذ إطلاقه. الفريق كان محترفاً ومتابعاً لكل التفاصيل.',
      rating: 5,
      linkedProject: projects[0]._id, // ربط بمشروع E-Commerce
      isActive: true,
      isFeatured: true,
      sortOrder: 4,
    },
  ];

  for (const testimonialData of testimonialsData) {
    const existingTestimonial = await Testimonial.findOne({
      clientName: testimonialData.clientName,
      companyName: testimonialData.companyName,
    });
    if (!existingTestimonial) {
      const testimonial = new Testimonial(testimonialData);
      await testimonial.save();
      console.log(`✅ تم إنشاء الشهادة: ${testimonialData.clientName}`);
    } else {
      console.log(`ℹ️  الشهادة موجودة بالفعل: ${testimonialData.clientName}`);
    }
  }
}

async function seedProjectCategories() {
  console.log('🌱 جاري زرع بيانات فئات المشاريع...');

  const categoriesData = [
    {
      value: 'Web App',
      label: 'مواقع إلكترونية',
      description: 'تطبيقات ومواقع ويب متكاملة',
      isActive: true,
      sortOrder: 1,
    },
    {
      value: 'Mobile App',
      label: 'تطبيقات الجوال',
      description: 'تطبيقات iOS و Android',
      isActive: true,
      sortOrder: 2,
    },
    {
      value: 'E-Commerce',
      label: 'متاجر إلكترونية',
      description: 'منصات تجارة إلكترونية متكاملة',
      isActive: true,
      sortOrder: 3,
    },
    {
      value: 'Automation',
      label: 'أتمتة',
      description: 'أنظمة أتمتة العمليات',
      isActive: true,
      sortOrder: 4,
    },
    {
      value: 'ERP',
      label: 'أنظمة ERP',
      description: 'أنظمة تخطيط موارد المؤسسات',
      isActive: true,
      sortOrder: 5,
    },
    {
      value: 'Other',
      label: 'أخرى',
      description: 'مشاريع أخرى',
      isActive: true,
      sortOrder: 6,
    },
  ];

  for (const categoryData of categoriesData) {
    const existingCategory = await ProjectCategory.findOne({
      value: categoryData.value,
    });
    if (!existingCategory) {
      const category = new ProjectCategory(categoryData);
      await category.save();
      console.log(`✅ تم إنشاء الفئة: ${categoryData.label}`);
    } else {
      console.log(`ℹ️  الفئة موجودة بالفعل: ${categoryData.label}`);
    }
  }
}

async function seedServices() {
  console.log('🌱 جاري زرع بيانات الخدمات...');

  const servicesData = [
    {
      title: 'تصميم وتطوير مواقع الويب',
      description:
        'حلول ويب متكاملة بدءًا من المواقع البسيطة وحتى الأنظمة المعقدة، بأحدث التقنيات مثل Next.js وReact.',
      icon: 'FaCode',
      iconType: 'react-icon',
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'تصميم متجاوب',
        'SEO محسّن',
        'أداء عالي',
        'أمان متقدم',
        'سهولة الصيانة',
      ],
      isActive: true,
      sortOrder: 1,
      slug: 'web-development',
      shortDescription: 'حلول ويب متكاملة بأحدث التقنيات مثل Next.js وReact',
    },
    {
      title: 'تطوير تطبيقات الجوال',
      description:
        'تطبيقات جوال عالية الأداء لنظامي iOS وAndroid بتجربة مستخدم متميزة.',
      icon: 'FaMobileAlt',
      iconType: 'react-icon',
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'تطبيقات iOS و Android',
        'أداء عالي',
        'واجهة مستخدم جذابة',
        'تكامل مع الخدمات السحابية',
      ],
      isActive: true,
      sortOrder: 2,
      slug: 'mobile-app-development',
      shortDescription: 'تطبيقات جوال عالية الأداء لنظامي iOS وAndroid',
    },
    {
      title: 'تصميم الهوية البصرية',
      description:
        'بناء هوية بصرية متكاملة تعبر عن قيم علامتك التجارية وتجذب جمهورك المستهدف.',
      icon: 'FaPaintBrush',
      iconType: 'react-icon',
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'تصميم شعار احترافي',
        'دليل الهوية البصرية',
        'تصميم بطاقات العمل',
        'تصميم المطبوعات',
      ],
      isActive: true,
      sortOrder: 3,
      slug: 'brand-identity-design',
      shortDescription: 'بناء هوية بصرية متكاملة تعبر عن قيم علامتك التجارية',
    },
    {
      title: 'التسويق الرقمي',
      description:
        'حملات تسويقية مدروسة تعتمد على البيانات لتحقيق أعلى عائد على الاستثمار.',
      icon: 'FaBullhorn',
      iconType: 'react-icon',
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'إدارة وسائل التواصل الاجتماعي',
        'إعلانات مدفوعة',
        'تحسين محركات البحث (SEO)',
        'تحليل الأداء',
      ],
      isActive: true,
      sortOrder: 4,
      slug: 'digital-marketing',
      shortDescription: 'حملات تسويقية مدروسة لتحقيق أعلى عائد على الاستثمار',
    },
    {
      title: 'حلول SaaS مخصصة',
      description:
        'تصميم وتطوير أنظمة SaaS قابلة للتوسع مع إدارة كاملة للسحابة والبنية التحتية.',
      icon: 'FaCogs',
      iconType: 'react-icon',
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'معمارية قابلة للتوسع',
        'إدارة السحابة',
        'أمان متقدم',
        'تكامل مع APIs',
      ],
      isActive: true,
      sortOrder: 5,
      slug: 'saas-solutions',
      shortDescription: 'تصميم وتطوير أنظمة SaaS قابلة للتوسع',
    },
    {
      title: 'تحليل البيانات',
      description:
        'تحويل بياناتك إلى رؤى قابلة للتنفيذ لاتخاذ قرارات أعمال أكثر ذكاءً.',
      icon: 'FaChartLine',
      iconType: 'react-icon',
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'تحليل البيانات',
        'تقارير تفاعلية',
        'لوحات تحكم',
        'تنبؤات ذكية',
      ],
      isActive: true,
      sortOrder: 6,
      slug: 'data-analytics',
      shortDescription: 'تحويل بياناتك إلى رؤى قابلة للتنفيذ',
    },
    {
      title: 'استضافة وإدارة السحابة',
      description:
        'حلول استضافة متقدمة مع إدارة كاملة للخوادم والسحابة لتضمن أداءً مثاليًا.',
      icon: 'FaServer',
      iconType: 'react-icon',
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'استضافة موثوقة',
        'إدارة السحابة',
        'نسخ احتياطي تلقائي',
        'دعم فني 24/7',
      ],
      isActive: true,
      sortOrder: 7,
      slug: 'cloud-hosting',
      shortDescription: 'حلول استضافة متقدمة مع إدارة كاملة للخوادم والسحابة',
    },
  ];

  for (const serviceData of servicesData) {
    const existingService = await Service.findOne({
      slug: serviceData.slug,
    });
    if (!existingService) {
      const service = new Service(serviceData);
      await service.save();
      console.log(`✅ تم إنشاء الخدمة: ${serviceData.title}`);
    } else {
      console.log(`ℹ️  الخدمة موجودة بالفعل: ${serviceData.title}`);
    }
  }
}

async function seedCompanyInfo() {
  console.log('🌱 جاري زرع بيانات المعلومات الرئيسية للشركة...');

  const companyInfoData = {
    address: 'صنعاء, اليمن',
    googleMapsUrl: 'https://maps.google.com/?q=15.3694,44.1910',
    workingHours: 'الأحد - الخميس: 8 ص - 5 م',
    email: 'info@smartagency.com',
    phone: '+967 778 032 532',
    whatsappUrl: 'https://wa.me/967778032532',
    socialLinks: {
      twitter: 'https://twitter.com/smartagency',
      instagram: 'https://instagram.com/smartagency',
      linkedin: 'https://linkedin.com/company/smartagency',
      facebook: 'https://facebook.com/smartagency',
    },
  };

  // Check if company info already exists (singleton pattern)
  const existingCompanyInfo = await CompanyInfo.findOne();
  if (!existingCompanyInfo) {
    const companyInfo = new CompanyInfo(companyInfoData);
    await companyInfo.save();
    console.log('✅ تم إنشاء المعلومات الرئيسية للشركة');
  } else {
    // Update existing record with seed data
    Object.assign(existingCompanyInfo, companyInfoData);
    await existingCompanyInfo.save();
    console.log('🔄 تم تحديث المعلومات الرئيسية للشركة');
  }
}

async function seedAbout() {
  console.log('🌱 جاري زرع بيانات صفحة من نحن الاحترافية...');

  const aboutData = {
    hero: {
      badge: 'من نحن',
      title: 'لا نبني مواقع فقط… نبني أنظمة رقمية تساعد الشركات على النمو',
      subtitle:
        'سمارت وكالة تقنية تجمع بين الاستراتيجية، تجربة المستخدم، التصميم، البرمجة، والذكاء الاصطناعي لتحويل الأفكار إلى منتجات رقمية واضحة، قابلة للاستخدام، وقابلة للتوسع.',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400',
      primaryButtonText: 'ابدأ مشروعك معنا',
      primaryButtonUrl: '/contact',
      secondaryButtonText: 'شاهد أعمالنا',
      secondaryButtonUrl: '/projects',
      trustBadges: [
        'استراتيجية قبل التنفيذ',
        'تصميم يخدم التحويل',
        'برمجة قابلة للتوسع',
        'شريك نمو لا مجرد منفذ',
      ],
    },

    vision:
      'أن تكون سمارت الشريك التقني الأقرب للشركات والمشاريع الطموحة في المنطقة، من خلال بناء منتجات رقمية لا تكتفي بالمظهر الجميل، بل تصنع أثرًا تشغيليًا وتجاريًا حقيقيًا.',

    mission:
      'مهمتنا هي مساعدة المشاريع على الانتقال من فكرة مبعثرة إلى منتج رقمي واضح، منظم، وسهل الاستخدام، عبر مزيج متكامل من التخطيط، التصميم، التطوير، الإطلاق، والتحسين المستمر.',

    approach:
      'نعمل بمنهجية تبدأ بفهم الهدف والسوق والمستخدم، ثم نترجم ذلك إلى تجربة استخدام واضحة، ونبنيها بتقنيات مستقرة قابلة للتوسع، ثم نتابع التحسين بعد الإطلاق بناءً على البيانات والتجربة الواقعية.',

    story: {
      title: 'لماذا وُجدت سمارت؟',
      description:
        'كثير من المشاريع لا تفشل بسبب ضعف الفكرة، بل بسبب ضعف تحويلها إلى تجربة واضحة ونظام قابل للتشغيل. لذلك وُجدت سمارت لتكون الجسر بين الفكرة والتنفيذ الحقيقي.',
      painPoints: [
        'أفكار قوية تضيع بسبب تنفيذ تقليدي لا يفهم السوق.',
        'واجهات جميلة ظاهريًا لكنها لا تقود المستخدم لاتخاذ قرار.',
        'مشاريع تُبنى بسرعة لكنها تصبح صعبة التطوير بعد الإطلاق.',
        'غياب شريك تقني يفهم المنتج والعميل والنمو معًا.',
      ],
      closingStatement:
        'نحن لا نتعامل مع المشروع كتصميم أو كود فقط، بل كنظام رقمي يجب أن يخدم هدفًا واضحًا ويستطيع النمو مع الوقت.',
    },

    thinking: [
      {
        icon: 'FiSearch',
        title: 'نفهم قبل أن نصمم',
        description:
          'نبدأ بفهم الهدف التجاري، طبيعة الجمهور، رحلة المستخدم، والمشكلة التي يجب أن يحلها المنتج.',
        result: 'مخرجات أوضح قبل الدخول في التصميم والتنفيذ.',
      },
      {
        icon: 'FiPenTool',
        title: 'نصمم تجربة تقود المستخدم',
        description:
          'لا نكتفي بواجهة جميلة؛ نصمم رحلة استخدام تقلل التشتت وتزيد وضوح القرار لدى العميل.',
        result: 'تجربة استخدام أكثر وضوحًا وقابلية للتحويل.',
      },
      {
        icon: 'FiCode',
        title: 'نبني بنظام قابل للتوسع',
        description:
          'نراعي بنية الكود، تنظيم الواجهات، واجهات API، لوحة التحكم، وقابلية التطوير بعد الإطلاق.',
        result: 'منتج مستقر لا ينهار عند أول توسع.',
      },
      {
        icon: 'FiTrendingUp',
        title: 'نقيس ونحسن بعد الإطلاق',
        description:
          'نؤمن أن الإطلاق ليس النهاية، بل بداية مرحلة تحسين مستمرة بناءً على الاستخدام والبيانات.',
        result: 'تحسين مستمر بدل تسليم جامد.',
      },
    ],

    differentiators: [
      {
        icon: 'FiLayers',
        title: 'نفهم المنتج وليس الكود فقط',
        description:
          'نتعامل مع كل مشروع كسير عمل وتجربة وهدف تجاري، وليس مجرد صفحات يتم تنفيذها.',
        badge: 'Product Mindset',
      },
      {
        icon: 'FiLayout',
        title: 'نجمع التصميم والتطوير والتشغيل',
        description:
          'نربط بين واجهة المستخدم، الباك إند، لوحة التحكم، وسهولة إدارة المحتوى بعد التسليم.',
        badge: 'Full Experience',
      },
      {
        icon: 'FiCpu',
        title: 'نستخدم التقنية حيث تصنع قيمة',
        description:
          'نستفيد من الأتمتة والذكاء الاصطناعي والتكاملات عندما تخدم المشروع فعليًا لا لمجرد الاستعراض.',
        badge: 'Smart Tech',
      },
      {
        icon: 'FiShield',
        title: 'نبني على أساس قابل للنمو',
        description:
          'نهتم بالبنية، الأداء، الأمان، وتجربة الإدارة حتى يكون المشروع قابلًا للتطوير لاحقًا.',
        badge: 'Scalable Build',
      },
    ],

    stats: [
      {
        icon: 'FiBriefcase',
        value: 20,
        suffix: '+',
        label: 'مشروع رقمي',
        description:
          'بين مواقع تعريفية، متاجر إلكترونية، تطبيقات، أنظمة تشغيلية، ولوحات تحكم.',
      },
      {
        icon: 'FiGrid',
        value: 6,
        suffix: '+',
        label: 'أنواع حلول',
        description:
          'مواقع، تطبيقات، متاجر، أنظمة SaaS، لوحات إدارة، وأتمتة تشغيلية.',
      },
      {
        icon: 'FiUsers',
        value: 10,
        suffix: '+',
        label: 'قطاعات تعاملنا معها',
        description:
          'تجارة، خدمات، تعليم، تقنية، محتوى، مشاريع ناشئة، وحلول داخلية.',
      },
      {
        icon: 'FiRepeat',
        value: 7,
        suffix: ' مراحل',
        label: 'منهجية تنفيذ',
        description:
          'من الاكتشاف والتخطيط إلى التصميم، التطوير، الاختبار، الإطلاق، والتحسين.',
      },
    ],

    process: [
      {
        step: 1,
        icon: 'FiSearch',
        title: 'الاكتشاف والتحليل',
        description:
          'نحدد الهدف، الجمهور، نطاق المشروع، الأولويات، والمشاكل التي يجب حلها.',
        deliverable: 'ملخص المتطلبات وخريطة أولية للحل',
      },
      {
        step: 2,
        icon: 'FiMap',
        title: 'هيكلة التجربة',
        description:
          'نرتب الصفحات، رحلة المستخدم، تدفق البيانات، والمنطق الأساسي قبل التصميم.',
        deliverable: 'User Flow / Sitemap / Wireframe',
      },
      {
        step: 3,
        icon: 'FiPenTool',
        title: 'تصميم الواجهة',
        description:
          'نصمم واجهة احترافية تعكس الهوية وتخدم الاستخدام والتحويل.',
        deliverable: 'UI Design قابل للتنفيذ',
      },
      {
        step: 4,
        icon: 'FiCode',
        title: 'التطوير والربط',
        description:
          'نبني الواجهات، الباك إند، لوحة التحكم، وربط البيانات والتكاملات المطلوبة.',
        deliverable: 'نسخة عملية قابلة للاختبار',
      },
      {
        step: 5,
        icon: 'FiCheckCircle',
        title: 'الاختبار والتحسين',
        description:
          'نراجع الأداء، الأخطاء، التجاوب، سهولة الاستخدام، وجودة التجربة النهائية.',
        deliverable: 'نسخة محسنة قبل الإطلاق',
      },
      {
        step: 6,
        icon: 'FiUploadCloud',
        title: 'الإطلاق والتسليم',
        description:
          'نطلق المشروع، نضبط الإعدادات الأساسية، ونسلم لوحة التحكم وطريقة الاستخدام.',
        deliverable: 'إطلاق رسمي ومستندات تشغيل مختصرة',
      },
      {
        step: 7,
        icon: 'FiTrendingUp',
        title: 'النمو والتطوير المستمر',
        description:
          'نراجع تجربة الاستخدام والبيانات ونقترح تحسينات بعد الإطلاق.',
        deliverable: 'خطة تحسين مستمرة',
      },
    ],

    values: [
      {
        icon: 'FiTarget',
        title: 'لا نبدأ قبل فهم الهدف',
        description:
          'كل قرار تصميمي أو تقني يجب أن يخدم هدفًا واضحًا للمشروع والمستخدم.',
        example: 'قبل التصميم نسأل: ما القرار الذي نريد من المستخدم اتخاذه؟',
      },
      {
        icon: 'FiEye',
        title: 'الجمال يجب أن يخدم الوضوح',
        description:
          'نؤمن أن الواجهة الاحترافية ليست زخرفة فقط، بل وضوح وترتيب وثقة وسهولة استخدام.',
        example: 'نقلل الضجيج البصري ونرفع وضوح الرسالة والزر الأساسي.',
      },
      {
        icon: 'FiDatabase',
        title: 'لا نبني شيئًا يصعب تطويره',
        description:
          'نهتم بالبنية والتنظيم من البداية حتى لا يتحول المشروع إلى عبء عند التوسع.',
        example: 'نفصل المكونات ونراعي قابلية إعادة الاستخدام وتوسع البيانات.',
      },
      {
        icon: 'FaHandshake',
        title: 'نتعامل كشريك لا كمورد',
        description:
          'نناقش، نقترح، ونصحح الاتجاه عندما نرى أن القرار لا يخدم المشروع.',
        example:
          'إذا كان المطلوب غير مناسب، نقترح بديلًا يخدم الهدف بشكل أفضل.',
      },
    ],

    teamNote: {
      title: 'فريق صغير بعقلية تنفيذ كبيرة',
      description:
        'نؤمن أن قوة الوكالة لا تقاس بعدد الأشخاص فقط، بل بوضوح المنهجية، جودة التنفيذ، وسرعة تحويل الأفكار إلى نتائج. نعمل كفريق متكامل يجمع بين التفكير المنتج، التصميم، البرمجة، والتشغيل.',
      highlights: [
        'تواصل مباشر وواضح خلال مراحل التنفيذ',
        'قرارات مبنية على هدف المشروع لا على الذوق فقط',
        'اهتمام بالتفاصيل من أول شاشة حتى لوحة التحكم',
      ],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
    },

    cta: {
      title: 'هل لديك فكرة وتريد تحويلها إلى منتج رقمي حقيقي؟',
      description:
        'شاركنا فكرتك، وسنساعدك على تحويلها إلى تجربة واضحة، نظام مستقر، وإطلاق احترافي قابل للنمو.',
      buttonText: 'ابدأ مشروعك معنا',
      buttonUrl: '/contact',
      secondaryButtonText: 'استعرض أعمالنا',
      secondaryButtonUrl: '/projects',
    },

    seo: {
      metaTitle: 'من نحن | وكالة سمارت للحلول الرقمية والبرمجية',
      metaDescription:
        'تعرف على وكالة سمارت: شريك تقني يساعد الشركات على بناء مواقع، تطبيقات، متاجر، وأنظمة رقمية احترافية قابلة للنمو.',
      keywords: [
        'وكالة سمارت',
        'شركة برمجة',
        'تصميم مواقع',
        'تطوير تطبيقات',
        'حلول رقمية',
        'وكالة تقنية',
      ],
      ogImage:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400',
    },

    isActive: true,
  };

  const existingAbout = await About.findOne();
  if (!existingAbout) {
    const about = new About(aboutData);
    await about.save();
    console.log('✅ تم إنشاء بيانات صفحة من نحن الاحترافية');
  } else {
    Object.assign(existingAbout, aboutData);
    await existingAbout.save();
    console.log('🔄 تم تحديث بيانات صفحة من نحن الاحترافية');
  }
}

// ==================== MAIN FUNCTION ====================

async function seedAll() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }

    console.log('🔄 جاري الاتصال بقاعدة البيانات...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

    // زرع البيانات بالترتيب الصحيح (حسب التبعيات)
    const users = await seedUsers();
    console.log('');
    const technologies = await seedTechnologies();
    console.log('');
    await seedBlogs(users);
    console.log('');
    await seedFaqs();
    console.log('');
    await seedHostingPackages();
    console.log('');
    await seedLeads();
    console.log('');
    await seedProjectCategories();
    console.log('');
    const projectCategories = await ProjectCategory.find().exec();
    const projects = await seedProjects(users, technologies, projectCategories);
    console.log('');
    await seedTeamMembers();
    console.log('');
    await seedTestimonials(projects);
    console.log('');
    await seedServices();
    console.log('');
    await seedCompanyInfo();
    console.log('');
    await seedAbout();
    console.log('');

    console.log('✅ تم زرع جميع البيانات التجريبية بنجاح!');
  } catch (error) {
    console.error('❌ حدث خطأ أثناء زرع البيانات:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

// تشغيل السكربت
if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };
