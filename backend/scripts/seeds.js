const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://smartagencyyem_db_user:P93OOGZBO9gSaXBL@cluster0.sma4e8a.mongodb.net/smart-agency?retryWrites=true&w=majority';

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

// ==================== SEED FUNCTIONS ====================

async function seedUsers() {
  console.log('🌱 جاري زرع بيانات المستخدمين...');

  const usersData = [
    {
      name: 'أحمد محمد',
      email: 'admin@smartagency.com',
      password: await bcrypt.hash('admin123', 10),
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
    },
    {
      name: 'React',
      category: 'Frontend',
      description: 'مكتبة JavaScript لبناء واجهات المستخدم',
    },
    {
      name: 'Vue.js',
      category: 'Frontend',
      description: 'إطار عمل JavaScript تقدمي',
    },
    {
      name: 'Angular',
      category: 'Frontend',
      description: 'إطار عمل TypeScript من Google',
    },
    {
      name: 'Node.js',
      category: 'Backend',
      description: 'بيئة تشغيل JavaScript من جانب الخادم',
    },
    {
      name: 'MongoDB',
      category: 'Database',
      description: 'قاعدة بيانات NoSQL',
    },
    {
      name: 'PostgreSQL',
      category: 'Database',
      description: 'قاعدة بيانات علائقية متقدمة',
    },
    { name: 'Docker', category: 'DevOps', description: 'منصة للحاويات' },
    { name: 'AWS', category: 'DevOps', description: 'خدمات سحابية من Amazon' },
    {
      name: 'React Native',
      category: 'Mobile',
      description: 'إطار عمل لتطوير تطبيقات الجوال',
    },
    {
      name: 'Flutter',
      category: 'Mobile',
      description: 'إطار عمل Google لتطوير التطبيقات',
    },
    {
      name: 'TypeScript',
      category: 'Frontend',
      description: 'JavaScript مع أنواع البيانات',
    },
    {
      name: 'GraphQL',
      category: 'Backend',
      description: 'لغة استعلام للواجهات البرمجية',
    },
    {
      name: 'Redis',
      category: 'Database',
      description: 'مخزن بيانات في الذاكرة',
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
    },
  ];

  for (const packageData of packagesData) {
    const existingPackage = await HostingPackage.findOne({
      name: packageData.name,
    });
    if (!existingPackage) {
      const pkg = new HostingPackage(packageData);
      await pkg.save();
      console.log(`✅ تم إنشاء الباقة: ${packageData.name}`);
    } else {
      console.log(`ℹ️  الباقة موجودة بالفعل: ${packageData.name}`);
    }
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

async function seedProjects(users, technologies) {
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
      results: [
        { label: 'زيادة المبيعات', value: '300%' },
        { label: 'تحسين الأداء', value: '85%' },
        { label: 'رضا العملاء', value: '95%' },
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
        ],
      },
      projectUrl: 'https://example-ecommerce.com',
      clientName: 'شركة التجارة الإلكترونية',
      category: 'E-Commerce',
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
      results: [
        { label: 'عدد المستخدمين', value: '50,000+' },
        { label: 'تقييم التطبيق', value: '4.8/5' },
        { label: 'معدل الاستخدام اليومي', value: '85%' },
      ],
      technologies: [technologies[9]._id, technologies[5]._id],
      images: {
        cover:
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        ],
      },
      projectUrl: 'https://example-taskapp.com',
      clientName: 'شركة الإنتاجية',
      category: 'Mobile App',
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
      results: [
        { label: 'تقليل التكاليف', value: '40%' },
        { label: 'تحسين الكفاءة', value: '60%' },
        { label: 'تقليل الأخطاء', value: '75%' },
      ],
      technologies: [
        technologies[0]._id,
        technologies[6]._id,
        technologies[13]._id,
      ],
      images: {
        cover:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        gallery: [],
      },
      projectUrl: 'https://example-erp.com',
      clientName: 'مصنع التصنيع المتقدم',
      category: 'ERP',
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
      console.log(`ℹ️  عضو الفريق موجود بالفعل: ${memberData.fullName}`);
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

// ==================== MAIN FUNCTION ====================

async function seedAll() {
  try {
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
    const projects = await seedProjects(users, technologies);
    console.log('');
    await seedTeamMembers();
    console.log('');
    await seedTestimonials(projects);
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
