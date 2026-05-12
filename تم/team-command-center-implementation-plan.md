# خطة تنفيذ قسم الفريق الاحترافي في الصفحة الرئيسية

## Team Command Center — وكالة سمارت

> الهدف: تحويل قسم عرض أعضاء الفريق في الصفحة الرئيسية من Grid تقليدي يعتمد على الصور فقط إلى قسم احترافي يعكس هوية وكالة تقنية متقدمة: فريق يفكر، يبني، يشغّل، ويطلق منتجات رقمية قابلة للنمو.

---

## 1. ملخص الفكرة

القسم الحالي يعرض أعضاء الفريق كبطاقات صور كبيرة مع ظهور المعلومات عند الـ hover. هذا الأسلوب يعطي انطباعًا تقليديًا ولا يوضح قيمة الفريق أو تخصصاته أو خبرته.

التصميم الجديد سيكون باسم:

**Team Command Center**

وهو تصميم يعرض الفريق كمنظومة تنفيذ احترافية، وليس كمعرض صور.

الفكرة الأساسية:

- عضو مميز Featured Member يظهر في بطاقة كبيرة.
- قائمة جانبية/رأسية لباقي الأعضاء Team Rail.
- عند اختيار عضو، تتغير البطاقة الرئيسية بدون فتح نافذة مباشرة.
- عرض المهارات، القسم، عدد المشاريع، النبذة، وروابط التواصل.
- تحويل النافذة الحالية إلى Drawer/Profile Sheet احترافي عند الضغط على زر “عرض الملف المهني”.

---

## 2. الملفات التي سيتم تعديلها

### Frontend

```txt
frontend/src/components/Team.tsx
frontend/src/components/TeamMemberDialog.tsx
frontend/src/services/team.service.ts
```

### يفضل إضافة ملفات جديدة للتنظيم

```txt
frontend/src/components/team/TeamSectionHeader.tsx
frontend/src/components/team/TeamStats.tsx
frontend/src/components/team/FeaturedTeamMember.tsx
frontend/src/components/team/TeamMemberRail.tsx
frontend/src/components/team/TeamSkillChip.tsx
frontend/src/components/team/TeamProfileDrawer.tsx
frontend/src/components/team/team-utils.ts
```

> يمكن تنفيذ كل شيء داخل `Team.tsx` مؤقتًا، لكن الأفضل تقسيمه إلى مكونات صغيرة للحفاظ على نظافة الكود وسهولة التعديل لاحقًا.

---

## 3. حالة المشروع الحالية حسب الملفات

### 3.1 قسم الفريق الحالي

الملف الحالي:

```txt
frontend/src/components/Team.tsx
```

يعتمد على:

```tsx
publicTeamService.getForHomepage()
```

ثم يعرض الأعضاء في:

```tsx
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

كل بطاقة تعتمد على صورة العضو كخلفية، والاسم والدور يظهران غالبًا مع تأثيرات hover.

### 3.2 نافذة تفاصيل العضو الحالية

الملف:

```txt
frontend/src/components/TeamMemberDialog.tsx
```

حاليًا يستخدم Dialog لعرض تفاصيل العضو، وفيه معلومات جيدة مثل:

- الصورة
- الاسم
- الدور
- القسم
- تاريخ الانضمام
- النبذة
- المهارات
- روابط التواصل
- funFact

### 3.3 بيانات الباك إند المتاحة

من ملف:

```txt
backend/src/team/schemas/team-member.schema.ts
```

الحقول المتاحة حاليًا كافية لتنفيذ التصميم الجديد:

```ts
fullName
role
department
photo
bio
funFact
email
linkedinUrl
githubUrl
twitterUrl
websiteUrl
specializations
showOnHome
showOnAbout
isActive
sortOrder
projectsCount
joinedAt
```

لا نحتاج تعديل إجباري في الباك إند للمرحلة الأولى.

---

## 4. الهدف من إعادة التصميم

القسم الجديد يجب أن يجيب بصريًا على هذه الأسئلة:

1. من هم أعضاء الفريق؟
2. ما دور كل شخص داخل الوكالة؟
3. ما تخصصاتهم التقنية؟
4. لماذا يمكن للعميل الوثوق بهذا الفريق؟
5. كيف تبدو وكالة سمارت كفريق محترف وليس مجرد مجموعة صور؟

---

## 5. النصوص الجديدة المقترحة للقسم

### Badge

```txt
فريق التنفيذ
```

### العنوان الرئيسي

```txt
العقول التي تبني خلف كل تجربة رقمية ناجحة
```

### الوصف

```txt
فريق وكالة سمارت يجمع بين التصميم، البرمجة، التشغيل، والتفكير المنتجاني لبناء حلول رقمية لا تبدو جميلة فقط، بل تعمل بكفاءة وتكبر مع عملك.
```

### CTA داخل بطاقة العضو

```txt
عرض الملف المهني
```

### عناوين داخل البطاقة

```txt
المهارات الأساسية
نبذة مختصرة
تواصل
مشروع مكتمل
```

---

## 6. التصميم المطلوب بصريًا

### 6.1 الخلفية

استخدم نفس روح الموقع الحالية:

- خلفية داكنة: `from-gray-950 via-gray-900 to-black`
- Grid خفيف جدًا في الخلفية
- توهجات Cyan/Teal ناعمة
- حدود زجاجية شفافة
- تأثير Glassmorphism

مثال classes:

```tsx
<section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden" id="team" dir="rtl">
```

### 6.2 Header القسم

يكون في الأعلى ومركزي:

- Badge صغير
- عنوان كبير من سطرين
- تمييز كلمة/عبارة بلون Cyan
- وصف مختصر
- بعدها إحصائيات صغيرة

### 6.3 الإحصائيات

ثلاث بطاقات صغيرة:

1. إجمالي المشاريع من مجموع `projectsCount`
2. عدد التخصصات أو الأقسام المختلفة
3. عبارة ثابتة: من الفكرة إلى الإطلاق

مثال:

```txt
+30 مشروع
+6 تخصصات
من الفكرة إلى الإطلاق
```

### 6.4 Layout الرئيسي

على الشاشات الكبيرة:

```txt
┌──────────────────────────────────────────────┐
│ Header + Stats                               │
└──────────────────────────────────────────────┘

┌───────────────────────────────┬──────────────┐
│ Featured Member Card          │ Team Rail     │
│ صورة كبيرة + تفاصيل           │ أعضاء مصغرين  │
└───────────────────────────────┴──────────────┘
```

بما أن الموقع عربي RTL، يفضل:

- Team Rail على اليمين أو اليسار حسب توازن الصفحة.
- إن كان هدفك محاكاة الصورة التي ولدناها، اجعل القائمة الجانبية يسارًا والبطاقة الكبيرة يمينًا/وسطًا.
- الأهم أن يكون النص داخل العناصر `dir="rtl"`.

### 6.5 Featured Member Card

يحتوي على:

- صورة العضو كبيرة.
- حلقات/Glow خلف الصورة.
- Badge للقسم.
- الاسم.
- الدور.
- نبذة قصيرة.
- 3 مهارات أساسية.
- عدد المشاريع.
- روابط التواصل.
- زر “عرض الملف المهني”.

### 6.6 Team Rail

قائمة أعضاء مصغرة، كل عنصر يحتوي:

- صورة صغيرة.
- الاسم.
- الدور.
- القسم.
- نقطة لون حسب القسم.

العنصر النشط يكون:

- له border بلون Cyan.
- خلفية شفافة مضيئة.
- Glow خفيف.
- يمكن إضافة خط connector بسيط نحو البطاقة الكبيرة.

---

## 7. التغييرات المنطقية في `Team.tsx`

### 7.1 الحالة الجديدة المطلوبة

أضف حالة للعضو النشط:

```tsx
const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
const [isProfileOpen, setIsProfileOpen] = useState(false);
```

### 7.2 بعد تحميل الأعضاء

بعد جلب البيانات:

```tsx
const members = await publicTeamService.getForHomepage();
setTeamMembers(members);
setActiveMember(members[0] ?? null);
```

### 7.3 عند الضغط على عنصر من القائمة

```tsx
const handleActivateMember = (member: TeamMember) => {
  setActiveMember(member);
};
```

### 7.4 عند الضغط على زر الملف المهني

```tsx
const handleOpenProfile = (member: TeamMember) => {
  setSelectedMember(member);
  setIsProfileOpen(true);
};
```

---

## 8. تحديث TypeScript Interface

في الملف:

```txt
frontend/src/services/team.service.ts
```

حاليًا `TeamMember` لا يحتوي على `projectsCount` رغم أنه موجود في الباك إند.

أضف:

```ts
projectsCount?: number;
```

ليصبح:

```ts
export interface TeamMember {
  _id: string;
  fullName: string;
  role: string;
  department?: string;
  photo?: string;
  bio?: string;
  funFact?: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  specializations?: string[];
  projectsCount?: number;
  showOnHome?: boolean;
  showOnAbout?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 9. دوال مساعدة مقترحة

أنشئ ملف:

```txt
frontend/src/components/team/team-utils.ts
```

### 9.1 أسماء الأقسام بالعربي

```ts
export const getDepartmentLabel = (department?: string) => {
  const labels: Record<string, string> = {
    Management: "الإدارة",
    Backend: "تطوير الخلفية",
    Frontend: "تطوير الواجهات",
    Mobile: "تطبيقات الجوال",
    DevOps: "البنية والتشغيل",
    Design: "التصميم وتجربة المستخدم",
    "Quality Assurance": "ضمان الجودة",
    Marketing: "التسويق والنمو",
    Support: "الدعم الفني",
  };

  return department ? labels[department] ?? department : "فريق سمارت";
};
```

### 9.2 لون القسم

```ts
export const getDepartmentAccent = (department?: string) => {
  const accents: Record<string, string> = {
    Management: "bg-cyan-400",
    Backend: "bg-blue-400",
    Frontend: "bg-emerald-400",
    Mobile: "bg-violet-400",
    DevOps: "bg-orange-400",
    Design: "bg-pink-400",
    "Quality Assurance": "bg-yellow-400",
    Marketing: "bg-green-400",
    Support: "bg-sky-400",
  };

  return department ? accents[department] ?? "bg-cyan-400" : "bg-cyan-400";
};
```

### 9.3 اختصار النص

```ts
export const truncateText = (text = "", max = 140) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};
```

---

## 10. مكونات الواجهة المقترحة

## 10.1 TeamSectionHeader

المسار:

```txt
frontend/src/components/team/TeamSectionHeader.tsx
```

المسؤولية:

- عرض Badge.
- العنوان.
- الوصف.

المحتوى:

```tsx
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function TeamSectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-center mb-10"
      dir="rtl"
    >
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm font-semibold mb-6 shadow-lg shadow-cyan-500/10">
        <Users size={16} />
        فريق التنفيذ
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6">
        العقول التي تبني خلف <br />
        كل <span className="text-cyan-300">تجربة رقمية ناجحة</span>
      </h2>

      <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-8">
        فريق وكالة سمارت يجمع بين التصميم، البرمجة، التشغيل، والتفكير المنتجاني لبناء حلول رقمية لا تبدو جميلة فقط، بل تعمل بكفاءة وتكبر مع عملك.
      </p>
    </motion.div>
  );
}
```

---

## 10.2 TeamStats

المسار:

```txt
frontend/src/components/team/TeamStats.tsx
```

المسؤولية:

- حساب مجموع المشاريع.
- حساب عدد الأقسام المختلفة.
- عرض 3 بطاقات Metric.

```tsx
import { motion } from "framer-motion";
import { Rocket, Grid2X2, Target } from "lucide-react";
import type { TeamMember } from "../../services/team.service";

interface Props {
  members: TeamMember[];
}

export default function TeamStats({ members }: Props) {
  const totalProjects = members.reduce((sum, member) => sum + (member.projectsCount ?? 0), 0);
  const departmentsCount = new Set(members.map((m) => m.department).filter(Boolean)).size;

  const stats = [
    {
      label: "مشروع",
      value: totalProjects > 0 ? `+${totalProjects}` : `+${members.length * 5}`,
      icon: Rocket,
    },
    {
      label: "تخصصات",
      value: `+${Math.max(departmentsCount, 1)}`,
      icon: Grid2X2,
    },
    {
      label: "من الفكرة إلى الإطلاق",
      value: "",
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12" dir="rtl">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-6 py-5 shadow-xl shadow-black/20 flex items-center justify-between"
        >
          <div>
            {stat.value && <div className="text-2xl font-extrabold text-cyan-300">{stat.value}</div>}
            <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
          </div>
          <stat.icon className="text-cyan-300" size={28} />
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 10.3 TeamMemberRail

المسار:

```txt
frontend/src/components/team/TeamMemberRail.tsx
```

المسؤولية:

- عرض قائمة أعضاء مصغرة.
- تحديد العضو النشط.
- دعم الجوال بشكل أفقي.

```tsx
import { motion } from "framer-motion";
import type { TeamMember } from "../../services/team.service";
import { getDepartmentAccent, getDepartmentLabel } from "./team-utils";

interface Props {
  members: TeamMember[];
  activeMember: TeamMember | null;
  onSelect: (member: TeamMember) => void;
}

export default function TeamMemberRail({ members, activeMember, onSelect }: Props) {
  return (
    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" dir="rtl">
      {members.map((member, index) => {
        const isActive = activeMember?._id === member._id;

        return (
          <motion.button
            key={member._id}
            type="button"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            viewport={{ once: true }}
            onClick={() => onSelect(member)}
            className={`relative min-w-[260px] lg:min-w-0 w-full text-right rounded-2xl border p-3 transition-all duration-300 group ${
              isActive
                ? "border-cyan-400/70 bg-cyan-400/10 shadow-lg shadow-cyan-500/20"
                : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06] hover:border-cyan-400/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                {member.photo ? (
                  <img src={member.photo} alt={member.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cyan-300 font-bold">
                    {member.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold truncate">{member.fullName}</h3>
                <p className="text-gray-300 text-sm truncate mt-1">{member.role}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${getDepartmentAccent(member.department)}`} />
                  <span>{getDepartmentLabel(member.department)}</span>
                </div>
              </div>
            </div>

            {isActive && (
              <span className="hidden lg:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-300 shadow-lg shadow-cyan-400/60" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
```

---

## 10.4 FeaturedTeamMember

المسار:

```txt
frontend/src/components/team/FeaturedTeamMember.tsx
```

المسؤولية:

- عرض العضو النشط بشكل كبير.
- عرض الصورة والبيانات.
- زر فتح الملف المهني.

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, BarChart3, Mail, Github, Linkedin, Globe, ExternalLink } from "lucide-react";
import type { TeamMember } from "../../services/team.service";
import { getDepartmentLabel, truncateText } from "./team-utils";

interface Props {
  member: TeamMember;
  onOpenProfile: (member: TeamMember) => void;
}

export default function FeaturedTeamMember({ member, onOpenProfile }: Props) {
  const skills = member.specializations?.slice(0, 3) ?? [];

  const socials = [
    { href: member.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: member.githubUrl, icon: Github, label: "GitHub" },
    { href: member.websiteUrl, icon: Globe, label: "Website" },
    { href: member.email ? `mailto:${member.email}` : undefined, icon: Mail, label: "Email" },
  ].filter((item) => item.href);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={member._id}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/30 min-h-[560px]"
        dir="rtl"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_35%,rgba(34,211,238,0.22),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.04),transparent)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 p-5 md:p-8 lg:p-10 h-full">
          <div className="lg:col-span-5 relative min-h-[360px] flex items-end justify-center overflow-hidden rounded-3xl bg-cyan-400/5 border border-cyan-300/10">
            <div className="absolute w-72 h-72 rounded-full border border-cyan-300/30 shadow-[0_0_80px_rgba(34,211,238,0.20)] top-10" />
            <div className="absolute w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl" />
            {member.photo ? (
              <img src={member.photo} alt={member.fullName} className="relative z-10 w-full h-full object-cover object-top grayscale-0" />
            ) : (
              <div className="relative z-10 text-8xl font-black text-cyan-300/80">{member.fullName.charAt(0)}</div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-cyan-300 text-sm mb-5">
              <Briefcase size={15} />
              {getDepartmentLabel(member.department)}
            </div>

            <h3 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              {member.fullName}
            </h3>

            <p className="text-xl text-gray-300 mb-4">{member.role}</p>

            {member.bio && (
              <p className="text-gray-400 leading-8 max-w-2xl mb-7">
                {truncateText(member.bio, 180)}
              </p>
            )}

            {skills.length > 0 && (
              <div className="mb-7">
                <h4 className="text-cyan-300 font-semibold mb-3">المهارات الأساسية</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col md:flex-row md:items-center md:justify-between gap-5 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 flex items-center gap-3">
                  <BarChart3 className="text-cyan-300" size={24} />
                  <div>
                    <div className="text-white font-extrabold text-xl">{member.projectsCount ?? 0}</div>
                    <div className="text-gray-400 text-xs">مشروع مكتمل</div>
                  </div>
                </div>

                {socials.length > 0 && (
                  <div className="flex items-center gap-2">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target={social.href?.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-300 hover:text-cyan-300 hover:border-cyan-300/40 transition-colors"
                      >
                        <social.icon size={17} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onOpenProfile(member)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 text-gray-950 font-bold px-6 py-3 hover:bg-cyan-200 transition-colors shadow-lg shadow-cyan-500/20"
              >
                عرض الملف المهني
                <ExternalLink size={17} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## 10.5 TeamProfileDrawer

المسار:

```txt
frontend/src/components/team/TeamProfileDrawer.tsx
```

يمكنك بدلًا من تعديل `TeamMemberDialog.tsx` بالكامل أن تنقل منطق الـ Dialog إليه وتحوله إلى Sheet.

المشروع يحتوي غالبًا على:

```txt
frontend/src/components/ui/sheet.tsx
```

استخدم Sheet بدل Dialog.

المطلوب في Drawer:

- يفتح من اليمين.
- يعرض الصورة والاسم والدور.
- يعرض النبذة.
- يعرض المهارات.
- يعرض funFact بعنوان “شيء يميز هذا العضو”.
- يعرض روابط التواصل.
- لا يكون مزدحمًا.

هيكل مقترح:

```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="right" className="..." dir="rtl">
    <SheetHeader>
      <SheetTitle>{member.fullName}</SheetTitle>
      <SheetDescription>{member.role}</SheetDescription>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

---

## 11. الشكل النهائي داخل `Team.tsx`

بعد التقسيم، يصبح `Team.tsx` مسؤولًا فقط عن:

- جلب البيانات.
- loading/error/empty states.
- تحديد العضو النشط.
- تركيب المكونات.

هيكل عام:

```tsx
export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const members = await publicTeamService.getForHomepage();
        setTeamMembers(members);
        setActiveMember(members[0] ?? null);
        setError(null);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("فشل تحميل أعضاء الفريق. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) return <TeamLoadingState />;
  if (error) return <TeamErrorState error={error} />;
  if (!teamMembers.length || !activeMember) return null;

  return (
    <section id="team" dir="rtl" className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      <TeamBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <TeamSectionHeader />
        <TeamStats members={teamMembers} />

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <TeamMemberRail
              members={teamMembers}
              activeMember={activeMember}
              onSelect={setActiveMember}
            />
          </div>

          <div className="lg:col-span-9 order-1 lg:order-2">
            <FeaturedTeamMember
              member={activeMember}
              onOpenProfile={(member) => {
                setSelectedMember(member);
                setIsProfileOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <TeamProfileDrawer
        member={selectedMember}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </section>
  );
}
```

---

## 12. تحسين حالات التحميل والخطأ

لا تكرر كود الخلفية في loading/error مثل الموجود حاليًا.

اعمل مكون مشترك:

```txt
TeamShell
TeamBackground
TeamLoadingState
TeamErrorState
```

أو أبقِها داخل `Team.tsx` لكن لا تكرر نفس الخلفية ثلاث مرات.

### Loading المقترح

- Skeleton cards بدل spinner فقط.
- Skeleton للعنوان.
- Skeleton للبطاقة الكبيرة والـ rail.

### Error المقترح

- Card صغيرة وسط القسم.
- نص واضح.
- زر “إعادة المحاولة” اختياري.

---

## 13. قواعد Responsive Design

### Desktop

- Header في الوسط.
- Stats من 3 أعمدة.
- Layout: Rail + Featured Card.

### Tablet

- Rail يتحول إلى scroll أفقي أعلى أو أسفل البطاقة.
- Featured Card يأخذ العرض الكامل.

### Mobile

- Header أصغر.
- Stats عمودية أو 3 بطاقات صغيرة قابلة للتمرير.
- Team Rail أفقي.
- Featured Card عمودية: الصورة فوق والمحتوى تحت.
- CTA بعرض كامل.

Classes مقترحة:

```tsx
grid lg:grid-cols-12 gap-6
order-1 lg:order-2
order-2 lg:order-1
flex lg:flex-col overflow-x-auto lg:overflow-visible
```

---

## 14. الحركة والـ Animation

استخدم Framer Motion بحذر:

- Header يدخل من أسفل.
- Stats تظهر بالتتابع.
- Rail items تظهر بالتتابع.
- Featured Card يتغير بـ AnimatePresence عند اختيار عضو.
- لا تجعل الحركة مبالغ فيها.

مدة مناسبة:

```ts
0.3s - 0.7s
```

---

## 15. تعديلات اختيارية في لوحة التحكم Admin

ليست إلزامية الآن، لكن لتحسين جودة المحتوى، أضف لاحقًا حقول اختيارية في Team Form:

```ts
headline
impactStatement
yearsExperience
featuredQuote
```

شرح الحقول:

- `headline`: جملة قصيرة تحت اسم العضو.
- `impactStatement`: كيف يساهم في مشاريع الوكالة.
- `yearsExperience`: عدد سنوات الخبرة.
- `featuredQuote`: اقتباس قصير.

لكن المرحلة الأولى يجب ألا تعتمد عليها حتى لا نعدل الباك إند الآن.

---

## 16. تعليمات مهمة عند التنفيذ

1. لا تستخدم الصور بالأبيض والأسود كافتراضي دائم.
2. لا تخفِ الاسم والدور خلف hover فقط.
3. لا تجعل كل البيانات تظهر دفعة واحدة في الكارت الرئيسي.
4. استخدم أول 3 مهارات فقط في البطاقة الرئيسية.
5. بقية التفاصيل تظهر في Drawer.
6. تأكد أن القسم يعمل بدون صورة للعضو.
7. تأكد أن القسم يعمل حتى لو لم توجد روابط تواصل.
8. تأكد أن `projectsCount` لو غير موجود لا يكسر الواجهة.
9. حافظ على RTL في النصوص العربية.
10. لا تعدل API إلا إذا ظهر نقص فعلي.

---

## 17. معايير القبول Acceptance Criteria

يعتبر التنفيذ صحيحًا عند تحقق التالي:

- [ ] يظهر القسم بعنوان جديد احترافي.
- [ ] تظهر إحصائيات صغيرة أعلى القسم.
- [ ] يظهر عضو نشط داخل بطاقة Featured كبيرة.
- [ ] تظهر قائمة أعضاء مصغرة ويمكن تغيير العضو النشط منها.
- [ ] عند تغيير العضو تتغير البطاقة الرئيسية بسلاسة.
- [ ] تظهر المهارات الأساسية من `specializations`.
- [ ] يظهر عدد المشاريع من `projectsCount` إن وجد.
- [ ] زر “عرض الملف المهني” يفتح Drawer أو Dialog احترافي.
- [ ] التصميم يعمل على Desktop وTablet وMobile.
- [ ] لا توجد أخطاء TypeScript.
- [ ] لا توجد أخطاء في Console.
- [ ] لا يتعطل القسم عند غياب الصورة أو النبذة أو الروابط.
- [ ] يحافظ التصميم على هوية الموقع الداكنة مع لون Cyan/Teal.

---

## 18. اختبار يدوي بعد التنفيذ

### 18.1 اختبار التحميل

افتح الصفحة الرئيسية وتأكد من:

- عدم ظهور شاشة بيضاء.
- عدم كسر الـ layout قبل وصول البيانات.
- ظهور Skeleton أو loading مناسب.

### 18.2 اختبار عرض البيانات

تأكد من أن:

- أسماء الأعضاء صحيحة.
- الأدوار صحيحة.
- الأقسام مترجمة للعربية.
- الصور تظهر جيدًا.
- المهارات تظهر كـ chips.
- عدد المشاريع يظهر إن كان موجودًا.

### 18.3 اختبار التفاعل

- اضغط على كل عضو في القائمة.
- تأكد أن البطاقة الرئيسية تتغير.
- اضغط على زر “عرض الملف المهني”.
- تأكد أن Drawer يظهر ويغلق بشكل صحيح.
- اضغط على روابط التواصل إن وجدت.

### 18.4 اختبار Responsive

اختبر الأحجام التالية:

```txt
Desktop: 1440px
Laptop: 1280px
Tablet: 768px
Mobile: 390px
```

تأكد من:

- عدم وجود overflow أفقي مزعج.
- الصور لا تتشوه.
- النصوص مقروءة.
- CTA واضح.

---

## 19. تحسينات لاحقة بعد المرحلة الأولى

بعد تنفيذ الشكل الأساسي، يمكن إضافة:

1. فلترة حسب القسم: الكل، تطوير، تصميم، إدارة، تسويق.
2. Auto-rotate للعضو النشط كل 5 ثوانٍ مع إيقاف عند تفاعل المستخدم.
3. ربط أعضاء الفريق بمشاريع نفذوها فعلًا.
4. إضافة “دوره في منظومة سمارت” لكل عضو.
5. إضافة صفحة Team مستقلة تعرض كل الأعضاء بتفاصيل أوسع.
6. إضافة صور WebP محسنة للسرعة.
7. إضافة Lazy Loading للصور.

---

## 20. توصية نهائية

لا تنفذ القسم كتحسين بسيط على الكروت الحالية. الأفضل إعادة بنائه كقسم مستقل بفلسفة جديدة:

```txt
Team Command Center
```

لأن وكالة سمارت تحتاج أن تظهر كفريق تقني وتشغيلي يبني منتجات، وليس كمعرض صور لأشخاص.

الأولوية التنفيذية:

1. تحديث `TeamMember` interface وإضافة `projectsCount`.
2. بناء `activeMember` logic.
3. بناء Featured Card.
4. بناء Team Rail.
5. بناء Stats.
6. تحويل Dialog إلى Drawer أو تحسينه.
7. اختبار Responsive.
8. تنظيف الكود وإزالة التكرار.

