export type Project = {
  title: string;
  status: string;
  url: string | null;
  type: string;
  image: string;
  features?: string[];
  tech: string[];
  links?: {
    android?: string;
    ios?: string;
  };
};


export const projectsData: Record<string, Project> = {
  "alwafrah": {
    title: "منصة الوفرة أونلاين",
    status: "نشط",
    url: "http://alwafrah.us",
    type: "منصة تعليمية رقمية متكاملة",
    image: "https://i.postimg.cc/3xS2hy3T/alwafra.png",
    features: [
      "مجتمع خاص للمستخدمين",
      "لوحة تحكم متقدمة للمدربين والطلاب",
      "نظام دورات تفاعلي"
    ],
    tech: ["React", "Firebase", "Node.js", "MongoDB"]
  },
  "reemstore": {
    title: "متجر ريم ستور",
    status: "نشط",
    url: "http://reemstore.store",
    type: "متجر إلكتروني للهدايا والتغليف",
    image: "https://i.postimg.cc/s2x9GYTx/reemstore.jpg",
    features: [
      "حجز وتخصيص الهدايا",
      "واجهة مستخدم أنيقة ومتجاوبة"
    ],
    tech: ["Next.js", "Shopify", "TailwindCSS"]
  },
  "gh-nice": {
    title: "متجر جي اتش نايس",
    status: "نشط",
    url: "http://gh-nice.com",
    type: "تطبيق وموقع لمتاجر الكف الأخضر - صنعاء، اليمن",
    image: "https://i.postimg.cc/FKwcf2fC/nicetech.png",
    features: [],
    links: {
      android: "https://play.google.com/store/apps/details?id=com.gh.nice&pcampaignid=web_share",
      ios: "https://apps.apple.com/us/app/%D8%AC%D9%8A-%D8%A7%D8%AA%D8%B4-%D9%86%D8%A7%D9%8A%D8%B3-gh-nice/id6446204764"
    },
    tech: ["Flutter", "Next.js", "MERN Stack"]
  },
  "nicewear": {
    title: "متجر نايس وير",
    status: "نشط",
    url: null,
    type: "تطبيق متجر إلكتروني للأزياء",
    image: "https://i.postimg.cc/gkpVHFgf/nicewear.png",
    features: [],
    links: {
      android: "https://play.google.com/store/apps/details?id=com.app.ts.nicewear&pcampaignid=web_share"
    },
    tech: ["Flutter", "Next.js", "MERN Stack"]
  },
  "fazaah": {
    title: "منصة فزعة",
    status: "قيد التطوير",
    url: null,
    type: "منصة إلكترونية لتأجير واستئجار الخدمات والمعدات",
    image: "https://i.postimg.cc/N0VsQtyF/46d1367a52f6d4118c7c65d349cd536f.jpg",
    features: [
      "خرائط Google لتحديد المواقع",
      "تكامل API مع الأحوال المدنية السعودية",
      "لوحة تحكم مخصصة للمؤجر والمستأجر"
    ],
    tech: ["Firebase", "Google Maps API", "Next.js", "Node.js"]
  },
  "bthawani": {
    title: "مشروع بثواني",
    status: "قيد التطوير",
    url: null,
    type: "تطبيق ومنصة للربط الفوري بين مقدمي الخدمات والعملاء",
    image: "https://i.postimg.cc/N0VsQtyF/46d1367a52f6d4118c7c65d349cd536f.jpg",
    features: [
      "نظام طلبات سريع",
      "تقنيات حديثة"
    ],
    tech: ["Flutter", "Next.js", "Node.js", "GraphQL"]
  }
};
