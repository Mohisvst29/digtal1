'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SiteData {
  content: Record<string, string>;
  articles: any[];
  testimonials: any[];
  portfolio: any[];
  media: any[];
  leads?: any[];
  faqs?: any[];
  services?: any[];
  teamMembers?: any[];
  doctors?: any[];
  clinics?: any[];
}

interface ContentContextType {
  data: SiteData;
  loading: boolean;
  locale: 'ar' | 'en';
  setLocale: (l: 'ar' | 'en') => void;
  t: (key: string, enVal?: string) => string;
  refreshData: () => Promise<void>;
}

const ARABIC_DEFAULTS: Record<string, string> = {
  'contact_phone': '+9660541659332',
  'contact_whatsapp': '+9660541659332',
  'contact_email': 'Info@DigitalHealth-sa.com',
  'contact_address': 'الأمير عبد العزيز بن مساعد بن جلوي، المربع، الرياض 12626، المملكة العربية السعودية',
  'home_badge': 'الوكالة الأولى للتسويق الطبي في الرياض',
  'hero_title': 'شريك النمو الطبي الاستراتيجي',
  'hero_tagline': 'نهتم بالهوية الرقمية للعيادات الطبية المتخصصة، تحسين محركات البحث، وجذب المرضى بأعلى معايير المصداقية المهنية.',
  'home_cta_primary': 'ابدأ في النمو الآن',
  'home_cta_secondary': 'عرض دراسات الحالة',
  'home_stats_roi_title': 'الوقت الفعلي',
  'home_stats_roi_value': '+142% عائد الاستثمار',
  'home_stats_seo_title': 'ظهور محركات البحث',
  'home_stats_seo_value': 'أول 3 نتائج في الرياض',
  'home_stats_bookings_title': 'حجوزات المرضى',
  'home_partners_title': 'قنوات وشراكات التسويق المعتمدة للعيادات',
  'home_section_services_title': 'التسويق الطبي الدقيق',
  'home_section_services_desc': 'حلول نمو ذكية متكاملة مصممة خصيصاً لتخصص عيادتك الطبية في الرياض.',
  'home_section_why_badge': 'ما يميز عيادتنا',
  'home_section_why_title': 'نتحدث لغة الطب، وننفذ أسرع استراتيجيات النمو.',
  'home_why_years_title': 'سنة من التخصص الطبي',
  'home_why_feat1_title': 'التوجيه العلمي القائم على التحليلات',
  'home_why_feat1_desc': 'نحن لا نخمن عشوائياً. نستخدم تحليلات دقيقة لتحديد المرضى ذوي الرغبة الحقيقية في العلاج بمركزك.',
  'home_why_feat2_title': 'الامتثال القانوني الصحي التام',
  'home_why_feat2_desc': 'كل حملة نطلقها متوافقة 100% مع أنظمة وزارة الصحة السعودية ولوائح خصوصية البيانات الطبية للمريض.',
  'home_why_feat3_title': 'خبرة عيادية سريرية حصرية',
  'home_why_feat3_desc': 'نحن لا نعمل في مجالات المطاعم أو البيع بالتجزئة. تركيزنا حصري 100% على الأطباء والعيادات فقط.',
  'home_stat1_desc': 'متوسط زيادة عائد الاستثمار',
  'home_stat2_desc': 'مريض جديد محتمل شهرياً',
  'home_stat3_desc': 'عيادة ومركز نثق به بالرياض',
  'home_stat4_desc': 'سنة خبرة متخصصة',
  'home_testimonials_badge': 'تقييمات الأطباء',
  'home_testimonials_title': 'ماذا يقول شركاؤنا من الأطباء والعيادات',
  'home_cta_title': 'هل أنت مستعد لمضاعفة نمو عيادتك؟',
  'home_cta_desc': 'احجز جلستك الاستشارية الطبية المجانية الآن، وسيقوم فريقنا بتدقيق ظهورك وتحديد قنوات نموك.',
  'home_cta_btn': 'احصل على تدقيق مجاني الآن',
  'about_badge': 'تأسست في الرياض',
  'about_title': 'من نحن؟',
  'about_description': 'وكالة تسويق رقمي متخصصة في القطاع الطبي مقرها الرياض، تم تأسيسها لتكون شريك النمو الأول للأطباء والمراكز الطبية والمستشفيات.',
  'about_sub_description': 'نحن شركة ناشئة بفكر متطور، نركز على تحويل الخدمات الطبية إلى علامات رقمية قوية قادرة على جذب المرضى وبناء الثقة.',
  'about_vision_title': 'رؤيتنا',
  'about_vision_desc': 'أن نكون الشريك الرقمي الأول لنمو القطاع الصحي في المملكة العربية السعودية عبر استراتيجيات تسويق طبي مبنية على الثقة وبناء المصداقية وتحقيق نتائج قابلة للقياس تدعم نمو المنشآت الطبية وتزيد وصولها للمرضى.',
  'about_mission_title': 'رسالتنا',
  'about_mission_desc': 'نساعد مقدمي الرعاية الصحية على جذب المرضى المناسبين، بناء سيرة مهنية قوية، وتحقيق نمو مستدام باستخدام التسويق الرقمي، مع الالتزام الكامل بأخلاقيات المجال الطبي والمعايير المهنية.',
  'about_why_title': 'لماذا نختلف؟',
  'about_why_desc': 'على عكس الوكالات التسويقية العامة، نحن متخصصون في التسويق الطبي فقط ونفهم الفروق الدقيقة لمسار الرعاية الطبية.',
  'about_why_feat1_title': 'سيكولوجية المريض',
  'about_why_feat1_desc': 'فهم عميق لطريقة تفكير المرضى وعقليتهم وما الذي يدفعهم للاختيار والحجز وثقة الممارس.',
  'about_why_feat2_title': 'خبرة بالسوق السعودي',
  'about_why_feat2_desc': 'معرفة تامة بسلوكيات المرضى والمنافسة ومؤسسات الرعاية الصحية بالرياض.',
  'about_why_feat3_title': 'قرارات مبنية على البيانات',
  'about_why_feat3_desc': 'تحليل دقيق ومستمر لكل خطوة تسويقية لضمان أعلى عائد استثماري للعيادة والمركز.',
  'about_why_feat4_title': 'الالتزام بأخلاقيات المهنة',
  'about_why_feat4_desc': 'المحافظة المطلقة على سرية ومعايير وأخلاقيات التسويق الطبي المعتمدة بالمملكة.',
  'about_why_feat5_title': 'استراتيجيات مخصصة',
  'about_why_feat5_desc': 'خطط نمو وتواصل فريدة مصممة خصيصاً لكل تخصص طبي بمفرده.',
  'about_why_feat6_title': 'تخصص طبي حصري',
  'about_why_feat6_desc': 'التركيز التام 100% على الرعاية الصحية والطبية دون تشتت في قطاعات تجارية أخرى.',
  'about_audience_title': 'عملاؤنا المستهدفون',
  'about_audience_desc': 'نصمم خدماتنا لتناسب مختلف فئات مقدمي الرعاية الصحية:',
  'about_audience_item1_title': 'الأطباء والاستشاريين',
  'about_audience_item1_desc': 'بناء العلامة الشخصية والسمعة الطبية.',
  'about_audience_item2_title': 'المراكز الطبية',
  'about_audience_item2_desc': 'تسويق متكامل وشامل لجميع التخصصات.',
  'about_audience_item3_title': 'المستشفيات الخاصة',
  'about_audience_item3_desc': 'إدارة الحضور الرقمي وقنوات المرضى.',
  'about_audience_item4_title': 'العيادات التخصصية',
  'about_audience_item4_desc': 'عيادات التجميل، الأسنان، الجلدية، والقلب.',
  'about_team_title': 'فريق العمل',
  'about_team_desc': 'مبدعون ومختصون طبيون يجمعهم هدف واحد: نمو علامتكم الصحية وتفوقها.',
  'about_cta_btn_primary': 'احجز استشارة مجانية',
  'about_cta_btn_secondary': 'خدماتنا الطبية',
  'about_cta_title': 'انضم إلى قائمة شركاء النجاح بالقطاع الصحي',
  'about_cta_desc': 'اتخذ الخطوة الأولى نحو حضور رقمي طبي قوي وجاذب لعيادتك اليوم.',

  // Services Page
  'services_heading': 'هندسة الحلول وبناء الريادة الطبية الرقمية بالرياض',
  'services_description': 'باقات متكاملة ومصممة خصيصاً للعيادات والمراكز والمستشفيات التخصصية الطموحة لضمان نمو تدفق المرضى بأعلى معايير الالتزام الطبي والمهني.',
  'services_badge_moh': 'متوافق مع أنظمة وزارة الصحة',
  'services_badge_clinical': 'استراتيجيات نمو طبي تخصصي',
  'services_cta_title': 'مستعد لتمكين وترسيخ ريادتك الطبية الرقمية بالرياض؟',
  'services_cta_btn_primary': 'احجز جلسة استشارة مجانية',
  'services_cta_btn_secondary': 'تصفح أعمالنا ونجاحاتنا',

  // Portfolio Page
  'portfolio_badge': 'أعمالنا',
  'portfolio_title': 'رواد التحول الرقمي الطبي في الرياض',
  'portfolio_description': 'شاهد كيف ساعدنا كبرى العيادات والمراكز التخصصية بالرياض على زيادة تدفق المرضى وتصدر نتائج جوجل.',

  // Blog Page
  'blog_title': 'المدونة الطبية الرقمية',
  'blog_description': 'مقالات ونقاشات متخصصة حول أساليب التسويق الطبي وجذب المرضى وقوانين وزارة الصحة بالرياض.',

  // FAQ Page
  'faq_badge': 'الأسئلة الشائعة والاستفسارات',
  'faq_title': 'الأسئلة الشائعة والاستفسارات',
  'faq_description': 'إجابات واضحة ودقيقة للأسئلة المكررة لدى الأطباء والمراكز الطبية حول قنوات ونسب النمو وتكاليف التسويق بالرياض.',

  // Contact Page
  'contact_badge': 'طلب جلسة تشخيصية ونمو مجانية',
  'contact_title': 'ابدأ رحلة النمو الطبي لعيادتك اليوم',
  'contact_description': 'دعنا نساعدك في تصميم قناة جذب مرضى مخصصة وفعالة ومتوافقة تماماً مع معايير وزارة الصحة السعودية.',
  'contact_badge_moh': 'معايير تسويقية آمنة وقانونية',
  'contact_badge_clinical': 'تأثير رقمي حقيقي ومستدام',
  'contact_form_heading': 'طلب جلسة تشخيصية ونمو مجانية',
  'contact_form_btn': 'إرسال طلب الاستشارة الطبية',

  // Thank You Page
  'thankyou_title': 'شكراً لك!',
  'thankyou_description': 'لقد تم استلام تفاصيل طلبك بنجاح. سيقوم أحد مستشاري النمو الطبي لدينا بالتواصل معك خلال 24 ساعة لترتيب الجلسة التشخيصية.',
  'thankyou_btn': 'العودة للصفحة الرئيسية'
};

const ENGLISH_DEFAULTS: Record<string, string> = {
  // Header / general
  'contact_phone': '+9660541659332',
  'contact_whatsapp': '+9660541659332',
  'contact_email': 'Info@DigitalHealth-sa.com',
  'contact_address': 'Prince Abdulaziz Bin Musaid Bin Jalawi, Al Murabba, Riyadh 12626, Saudi Arabia',
  
  // Home Page
  'home_badge': "Riyadh's Premier Medical Marketing Agency",
  'hero_title': 'Integrated Medical Growth for Your Clinic',
  'hero_tagline': 'Empowering healthcare providers and doctors in the Kingdom with digital leadership and patient attraction under the highest clinical authority standards.',
  'home_cta_primary': 'Start Growing Now',
  'home_cta_secondary': 'View Case Studies',
  'home_stats_roi_title': 'Realtime Analytics',
  'home_stats_roi_value': '+142% Patient Retention Return',
  'home_stats_seo_title': 'SEO Ranking Authority',
  'home_stats_seo_value': 'Top 3 positions Riyadh',
  'home_stats_bookings_title': 'Active Consult bookings',
  'home_partners_title': 'OFFICIALLY APPROVED MARKETING CHANNELS',
  'home_section_services_title': 'Precision Clinical Marketing',
  'home_section_services_desc': 'Modular strategic growth solutions engineered specifically for healthcare institutions.',
  'home_section_why_badge': 'Clinical Advantage',
  'home_section_why_title': 'We speak clinical science, and deliver organic growth.',
  'home_why_years_title': 'Years of Healthcare Focus',
  'home_why_feat1_title': 'Data & Scientific Analytics Direction',
  'home_why_feat1_desc': 'We bypass guesses. We employ prescriptive patient modeling to target the right specialties.',
  'home_why_feat2_title': 'Full Healthcare Compliance Assurance',
  'home_why_feat2_desc': 'Every creative element aligns perfectly with the Saudi MOH regulations and international healthcare privacy.',
  'home_why_feat3_title': 'Exclusive Clinical Specialization',
  'home_why_feat3_desc': 'Unlike generic creative agencies, we work 100% on medical, knowing the exact patient journey.',
  'home_stat1_desc': 'Average ROI Increase',
  'home_stat2_desc': 'Monthly Patient Leads',
  'home_stat3_desc': 'Trusted Elite Clinics',
  'home_stat4_desc': 'Years Clinical Experience',
  'home_testimonials_badge': 'Trusted by Elite Doctors',
  'home_testimonials_title': 'Clinic Success Stories & Patient Conversions',
  'home_cta_title': 'Ready to Double Your Patient Flow?',
  'home_cta_desc': 'Book a 30-minute free diagnostic audit. We will analyze your search presence and deliver a clear patient attraction plan.',
  'home_cta_btn': 'Claim Your Free Audit Now',

  // About Page
  'about_badge': 'Founded in Riyadh',
  'about_title': 'Who We Are',
  'about_description': 'A specialized medical digital marketing agency based in Riyadh, established to be the primary growth partner for doctors, clinics, and hospitals.',
  'about_sub_description': 'We are a progressive team focusing on transforming clinical services into robust digital brands that attract patients and inspire absolute trust.',
  'about_vision_title': 'Our Vision',
  'about_vision_desc': 'To become the premier healthcare growth partner in Saudi Arabia, building long-term digital credibility and generating high-impact patient flow for clinics and hospitals.',
  'about_mission_title': 'Our Mission',
  'about_mission_desc': 'Empowering doctors and elite practitioners to connect with patients authentically and sustainably using modern ethical medical marketing and digital patient pathways.',
  'about_why_title': 'Why Choose Us?',
  'about_why_desc': 'Unlike generic creative agencies, we specialize strictly in clinical medical growth, understanding the delicate journey of patients.',
  'about_why_feat1_title': 'Patient Psychology',
  'about_why_feat1_desc': 'Knowing exactly how patients research clinical services and what instills real conversion confidence.',
  'about_why_feat2_title': 'Saudi MOH Experts',
  'about_why_feat2_desc': 'We navigate target audience segments, regional clinic metrics, and Riyadh medical space.',
  'about_why_feat3_title': 'Precision Analytics',
  'about_why_feat3_desc': 'Tracking direct cost-per-patient-acquisition values to scale profitable clinic channels.',
  'about_why_feat4_title': 'Strict Professional Ethics',
  'about_why_feat4_desc': 'Every digital campaign matches the strict regulations of Saudi MOH guidelines.',
  'about_why_feat5_title': 'Tailored Clinic Roadmap',
  'about_why_feat5_desc': 'Whether cosmetic surgery, dental, pediatric, or dermatology, we draft unique plans.',
  'about_why_feat6_title': 'Exclusive Healthcare Niche',
  'about_why_feat6_desc': 'We do not build fast-food or retail brands; we only build elite medical leaders.',
  'about_audience_title': 'Who We Support',
  'about_audience_desc': 'We serve all segments of healthcare delivery, optimizing channels for specific scale goals:',
  'about_audience_item1_title': 'Physicians & Consultants',
  'about_audience_item1_desc': 'Establishing digital thought leadership.',
  'about_audience_item2_title': 'Medical Clinics & Centers',
  'about_audience_item2_desc': 'Unified strategic marketing for multi-specialty.',
  'about_audience_item3_title': 'Private Hospitals',
  'about_audience_item3_desc': 'Optimizing corporate healthcare paths.',
  'about_audience_item4_title': 'Specialized Clinics',
  'about_audience_item4_desc': 'Cosmetic surgery, aesthetics, and dentistry.',
  'about_team_title': 'Our Team Experts',
  'about_team_desc': 'Creative and digital masterminds joined by a singular vision: patient acquisition and stellar branding.',
  'about_cta_btn_primary': 'Book a Free Consultation',
  'about_cta_btn_secondary': 'Our Medical Services',
  'about_cta_title': 'Join Elite Healthcare Providers In Riyadh',
  'about_cta_desc': 'Elevate your online authority, multiply bookings, and govern patient loyalty with us.',

  // Services Page
  'services_heading': 'Engineering Solutions & Building Digital Clinical Leadership',
  'services_description': 'Modular strategic growth solutions engineered specifically for healthcare institutions.',
  'services_badge_moh': '100% MOH Regulation Compliant',
  'services_badge_clinical': 'Specialized Clinical Frameworks',
  'services_cta_title': 'Ready to Establish Elite',
  'services_cta_span': 'Healthcare Authority In Riyadh?',
  'services_cta_btn_primary': 'Book Free Diagnostic Consultation',
  'services_cta_btn_secondary': 'Browse Clinic Case Studies',

  // Portfolio Page
  'portfolio_badge': 'Our Portfolio',
  'portfolio_title': 'Riyadh Medical Digital Transformation Leaders',
  'portfolio_description': 'Explore how we assisted major specialized clinics and healthcare centers in Riyadh to scale patient bookings and rank first on Google.',

  // Blog Page
  'blog_title': 'Clinical Digital Marketing Blog',
  'blog_description': 'Specialized essays and growth resources concerning healthcare marketing, patient retention, and Riyadh compliance guidelines.',

  // FAQ Page
  'faq_badge': 'Frequently Asked Questions',
  'faq_title': 'Frequently Answered Questions',
  'faq_description': 'Precise clinical-authority insights answering clinics and doctors questions about campaigns ROI, costs, and timeline.',

  // Contact Page
  'contact_badge': 'Book Your Free Diagnostic Consultation',
  'contact_title': 'Elevate Your Healthcare Growth Pathway',
  'contact_description': 'Let us engineer high-conversion custom patients flow pipeline fully matching Saudi MOH policies and medical ethics.',
  'contact_badge_moh': '100% Ethical & Legal Clinical Ads',
  'contact_badge_clinical': 'Sustainable Clinical Organic Growth',
  'contact_form_heading': 'Request a Free Strategy Consultation',
  'contact_form_btn': 'Submit Consultation Request',

  // Thank You Page
  'thankyou_title': 'Thank You!',
  'thankyou_description': 'Your clinical growth audit request has been successfully registered. One of our digital specialists will contact you within 24 hours to coordinate your calendar.',
  'thankyou_btn': 'Back to Home'
};

function isLightColor(colorStr: string): boolean {
  if (!colorStr) return false;
  const clean = colorStr.trim().toLowerCase();
  if (clean === 'white' || clean === '#fff' || clean === '#ffffff') return true;
  
  // Hex matching
  if (clean.startsWith('#')) {
    const hex = clean.substring(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 180;
    } else if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 180;
    }
  }
  
  // RGB matching
  if (clean.startsWith('rgb')) {
    const match = clean.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 180;
    }
  }

  // Common light HTML colors
  const lightColors = ['yellow', 'lightyellow', 'lightgrey', 'lightgray', 'beige', 'azure', 'aliceblue', 'floralwhite', 'ghostwhite', 'honeydew', 'ivory', 'lavender', 'linen', 'mintcream', 'mistyrose', 'oldlace', 'seashell', 'snow', 'white', 'whitesmoke'];
  if (lightColors.includes(clean)) return true;

  return false;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialLocale = 'ar' }: { children: React.ReactNode; initialLocale?: 'ar' | 'en' }) {
  const [data, setData] = useState<SiteData>({
    content: {},
    articles: [],
    testimonials: [],
    portfolio: [],
    media: [],
    leads: [],
    faqs: [],
    services: [],
    teamMembers: [],
    doctors: [],
    clinics: [],
  });
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<'ar' | 'en'>(initialLocale);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      if (json.status === 'success') {
        setData(json);
        if (typeof window !== 'undefined') {
          localStorage.setItem('site_content_cache', JSON.stringify(json));
        }
      }
    } catch (e) {
      console.error('Failed to load content context:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // SWR Speed Hack: Load from localStorage cache immediately
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('site_content_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.content) {
            setData(parsed);
            setLoading(false);
          }
        } catch (e) {
          // Silent catch
        }
      }
    }
    refreshData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isEnglish = window.location.pathname.startsWith('/en') || window.location.pathname.includes('/en/');
      const currentLocale = isEnglish ? 'en' : 'ar';
      setLocale(currentLocale);
      document.documentElement.lang = currentLocale;
      document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';

      // Dynamic SEO Meta Sharing Image Update
      const seoImage = data?.content?.['seo_meta_img'];
      if (seoImage) {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (!ogImg) {
          ogImg = document.createElement('meta');
          ogImg.setAttribute('property', 'og:image');
          document.head.appendChild(ogImg);
        }
        ogImg.setAttribute('content', seoImage);

        let twitterImg = document.querySelector('meta[name="twitter:image"]');
        if (!twitterImg) {
          twitterImg = document.createElement('meta');
          twitterImg.setAttribute('name', 'twitter:image');
          document.head.appendChild(twitterImg);
        }
        twitterImg.setAttribute('content', seoImage);
      }
    }
  }, [locale, data]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentBg = data?.content?.['bg_color'] || '#020d1f';
      const isLight = isLightColor(currentBg);
      if (isLight) {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    }
  }, [data]);

  const t = (key: string, fallbackVal?: string): string => {
    const keyWithLocale = `${key}_${locale}`;
    if (data.content[keyWithLocale]) return data.content[keyWithLocale];
    if (data.content[key]) return data.content[key];
    
    // Smart immediate client-side fallback matching current language context
    if (locale === 'en') {
      const enTranslation = ENGLISH_DEFAULTS[key];
      if (enTranslation) return enTranslation;
    } else {
      const arTranslation = ARABIC_DEFAULTS[key];
      if (arTranslation) return arTranslation;
    }

    if (fallbackVal !== undefined) {
      if (locale === 'en') {
        // If the fallbackVal is already purely English or separated with a pipe '|'
        if (fallbackVal.includes('|') || /^[A-Za-z0-9\s\.,!\?'"\-\(\)\+]+$/.test(fallbackVal)) {
          return fallbackVal;
        }
      } else {
        // For Arabic, if fallbackVal is Arabic, return it
        if (!/^[A-Za-z0-9\s\.,!\?'"\-\(\)\+]+$/.test(fallbackVal)) {
          return fallbackVal;
        }
      }
      return fallbackVal;
    }
    return '';
  };

  const primaryColor = data.content['primary_color'] || '#00daf3';
  const secondaryColor = data.content['secondary_color'] || '#0aebff';
  const bgColor = data.content['bg_color'] || '#020d1f';
  const surfaceColor = data.content['surface_color'] || '#061428';
  const fontAr = data.content['font_family_ar'] || 'IBM Plex Sans Arabic';
  const fontEn = data.content['font_family_en'] || 'Plus Jakarta Sans';

  const isLight = isLightColor(bgColor);
  const dotOpacity = isLight ? '0.22' : '0.18';

  const styleHtml = `
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --bg-color: ${bgColor};
      --surface-color: ${surfaceColor};
      --font-family-ar: var(--font-ibm-plex-arabic), '${fontAr}', sans-serif;
      --font-family-en: var(--font-jakarta), '${fontEn}', sans-serif;
      --font-family: ${locale === 'ar' ? `var(--font-ibm-plex-arabic), '${fontAr}', sans-serif` : `var(--font-jakarta), '${fontEn}', sans-serif`};
    }
    body {
      background-color: var(--bg-color) !important;
      background-image:
        radial-gradient(rgba(0, 218, 243, ${dotOpacity}) 2px, transparent 2px),
        radial-gradient(ellipse 80% 60% at 50% -20%, color-mix(in srgb, ${primaryColor} 6%, transparent) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6, 30, 70, 0.4) 0%, transparent 60%) !important;
      background-size: 32px 32px, 100% 100%, 100% 100% !important;
      color: #f0f8ff;
      font-family: var(--font-family) !important;
      transition: background-color 0.5s ease;
    }
  `;

  return (
    <ContentContext.Provider value={{ data, loading, locale, setLocale, t, refreshData }}>
      <style dangerouslySetInnerHTML={{ __html: styleHtml }} />
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
}
