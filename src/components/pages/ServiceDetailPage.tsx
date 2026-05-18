'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

interface ServiceDetailProps {
  slug: string;
}

export default function ServiceDetailPage({ slug }: ServiceDetailProps) {
  const { t, locale } = useContent();

  const isRtl = locale === 'ar';

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  // Master Service Copy Mapping
  const SERVICE_DATA: Record<string, {
    icon: string;
    tagAr: string;
    tagEn: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    btnTextAr: string;
    btnTextEn: string;
    benefitTitleAr: string;
    benefitTitleEn: string;
    benefitDescAr: string;
    benefitDescEn: string;
    benefitsAr: Array<{ icon: string, title: string, desc: string }>;
    benefitsEn: Array<{ icon: string, title: string, desc: string }>;
    strategyTitleAr: string;
    strategyTitleEn: string;
    strategiesAr: Array<{ title: string, desc: string }>;
    strategiesEn: Array<{ title: string, desc: string }>;
  }> = {
    seo: {
      icon: 'search_insights',
      tagAr: 'تحسين محركات البحث الطبي',
      tagEn: 'Clinical Medical SEO',
      titleAr: 'إتقان سيو العيادات والمستشفيات',
      titleEn: 'Clinical Healthcare SEO Dominance',
      descAr: 'تصدّر نتائج البحث المحلية في جوجل للكلمات المفتاحية عالية الحجز مثل "أفضل عيادة أسنان بالرياض" لبناء تدفق مستمر ومجاني بالكامل من المرضى دون توقف.',
      descEn: 'Dominating local search results in Riyadh for high-intent queries like "best clinic near me" or specialized surgeons to channel organic patient flow.',
      btnTextAr: 'اطلب فحص سيو مجاني لعيادتك',
      btnTextEn: 'Get Free Clinic SEO Audit',
      benefitTitleAr: 'ميزة تصدر محركات البحث',
      benefitTitleEn: 'The Power of Organic SEO',
      benefitDescAr: 'يبدأ أكثر من 70% من المرضى بالرياض رحلتهم الطبية بالبحث على جوجل. إذا لم تكن عيادتك في الصفحة الأولى، فإنك ببساطة تقدم مرضاك الجدد للعيادات المنافسة.',
      benefitDescEn: 'Over 70% of selective patients start their search with Google queries. Dominating organic listings bypasses expensive paid ads permanently.',
      benefitsAr: [
        { icon: 'verified', title: 'حجوزات عالية الكفاءة', desc: 'زوار نتائج البحث العضوية يملكون أعلى نسب حجز مواعيد فعلية واستبقاء للعيادة.' },
        { icon: 'verified', title: 'عائد استثماري مستدام', desc: 'بخلاف الإعلانات، نتائج الـ SEO تبني أصولاً رقمية مجانية ودائمة لعلامتكم الطبية.' }
      ],
      benefitsEn: [
        { icon: 'verified', title: 'High-Intent Bookings', desc: 'Organic web visitors have the absolute highest conversion rate to clinical check-ups.' },
        { icon: 'verified', title: 'Permanent Digital Assets', desc: 'Unlike social ads, SEO pages build lasting digital compounding authority for your clinic.' }
      ],
      strategyTitleAr: 'آلية العمل والاستراتيجية السريرية',
      strategyTitleEn: 'Our SEO Framework & Compliance',
      strategiesAr: [
        { title: 'السيطرة على البحث المحلي (السيو المحلي)', desc: 'تحسين ملفات خرائط جوجل للعيادة (ملف جوجل التجاري) لتتصدر فوراً عند بحث المرضى القريبين بالرياض.' },
        { title: 'هيكلة وصناعة المحتوى الطبي التخصصي', desc: 'نشر مقالات طبية وعلمية بالغة الدقة تتوافق مع خوارزميات جوجل الصارمة لبناء الموثوقية الطبية.' },
        { title: 'التحسين التقني الفني للموقع وسرعة التصفح', desc: 'تحسين كود الموقع وسرعة تحميله لتصل لأقل من ثانية ونصف، وضمان تصفح مريح وخالي من أي تعقيدات من الجوال.' }
      ],
      strategiesEn: [
        { title: 'Google Maps Optimization (Local SEO)', desc: 'Optimizing your GMB profile to appear instantly on local geo-targeted clinical searches in Riyadh.' },
        { title: 'MOH & Google Compliant Content', desc: 'Writing clinical articles utilizing top expert medical knowledge guidelines to build real authority.' },
        { title: 'Technical Speed & Architecture', desc: 'Ensuring your site loads in under 1.5 seconds, optimized fully for responsive mobile screens.' }
      ]
    },
    ppc: {
      icon: 'ads_click',
      tagAr: 'إعلانات الاستحواذ المباشر',
      tagEn: 'Targeted Patient Lead Generation',
      titleAr: 'حملات الإعلانات الطبية المدفوعة الذكية',
      titleEn: 'High-Conversion Paid Patient Campaigns',
      descAr: 'حملات تسويقية فائقة الدقة والتحويل عبر جوجل وسناب شات وميتا لتوليد تدفق مباشر لحجوزات العيادة بأقل كلفة استحواذ ممكنة وبأعلى جودة.',
      descEn: 'Engineering data-driven, highly optimized ad campaigns on Google, Snapchat, and Meta to pack clinic consult rooms with selective patients.',
      btnTextAr: 'احصل على خطة إعلانية مخصصة لعيادتك',
      btnTextEn: 'Request Custom Ad Strategy',
      benefitTitleAr: 'عائد سريع ونمو مضمون الحجوزات',
      benefitTitleEn: 'Instant Patient Flow Optimization',
      benefitDescAr: 'نصمم حملات إعلانية مدفوعة ومحسنة خصيصاً للعيادات الطبية التخصصية، لزيادة نسب الإشغال وجمع استمارات الحجز الحقيقية مع خفض تكاليف النقرة.',
      benefitDescEn: 'Deploying highly-converting paid pathways that focus purely on confirmed clinical calls, WhatsApp messages, and direct online bookings.',
      benefitsAr: [
        { icon: 'trending_up', title: 'نتائج فورية مباشرة', desc: 'تبدأ الاتصالات وحجوزات المواعيد في التدفق لمركزك الطبي من اليوم الأول لإطلاق الحملة.' },
        { icon: 'verified', title: 'تتبع كامل للحجوزات', desc: 'نظام قياس دقيق يربط بين الميزانية المدفوعة والمبيعات الطبية الفعلية لعيادتك.' }
      ],
      benefitsEn: [
        { icon: 'trending_up', title: 'Instant Lead Influx', desc: 'Verified booking requests start reaching your reception from the very first hour of ad launch.' },
        { icon: 'verified', title: 'End-to-End Analytics Tracking', desc: 'We link paid clicks directly with final patient arrivals at your clinic, ensuring precise ROI.' }
      ],
      strategyTitleAr: 'منهجية الإعلانات الطبية الدقيقة',
      strategyTitleEn: 'Clinical Ad Campaigns Setup',
      strategiesAr: [
        { title: 'استهداف الفئات عالية النية', desc: 'استهداف المرضى الباحثين عن علاجات التجميل، الأسنان، الليزر، وزراعة الأسنان في مناطق الرياض الراقية.' },
        { title: 'تصميم عروض وحوافز متوافقة طبياً', desc: 'صياغة نصوص إعلانية وعروض علاجية محفزة مع الحفاظ الكامل على وقار وأخلاقيات المهنة الطبية.' },
        { title: 'الاختبار والتحسين الذكي المستمر', desc: 'اختبار مستمر للعناوين والمواد الإبداعية لتقليل تكلفة حجز الاستشارة وضمان ثبات التدفق.' }
      ],
      strategiesEn: [
        { title: 'High-Value Interest Targeting', desc: 'Reaching selective individuals looking for plastic surgery, veneers, dental implants, or aesthetic treatments in upscale Riyadh.' },
        { title: 'MOH Compliant Ad Copywriting', desc: 'Drafting premium visual styles and persuasive medical copywriting that complies with local healthcare guidelines.' },
        { title: 'A/B Testing & Scaling', desc: 'Constantly optimizing graphics, layout variations, and target channels to drive down patient acquisition costs.' }
      ]
    },
    social: {
      icon: 'share_reviews',
      tagAr: 'التسويق عبر صناعة المحتوى',
      tagEn: 'Medical Social Content Strategy',
      titleAr: 'صناعة المحتوى الطبي وإدارة السوشيال ميديا',
      titleEn: 'Premium Medical Content & Social Media',
      descAr: 'صناعة وإنتاج مقاطع فيديو مميزة ومبسطة للأطباء على تيك توك وإنستغرام وسناب شات لبناء المصداقية وترسيخ الثقة في تخصصاتكم الطبية بالرياض.',
      descEn: 'Crafting visually stunning educational social assets for selective doctors and modern medical centers to engage patient groups online.',
      btnTextAr: 'ابدأ في بناء براندك الشخصي الطبي الآن',
      btnTextEn: 'Build Your Medical Brand Now',
      benefitTitleAr: 'تحويل المعرفة إلى ثقة وحجوزات',
      benefitTitleEn: 'Transforming Medical Authority to Trust',
      benefitDescAr: 'يبحث المرضى الحديثون عن وجوه مألوفة وعلم حقيقي. نساعد الأطباء على الظهور بمظهر مهيب وودود عبر مقاطع فيديو قصيرة وتصاميم تثقيفية تترجم المعرفة الطبية لثقة.',
      benefitDescEn: 'Modern patients book with doctors they already feel connected to. We write and produce custom media content that presents clinical excellence in premium style.',
      benefitsAr: [
        { icon: 'group', title: 'بناء قاعدة مرضى مخلصين', desc: 'بناء مجتمع رقمي يثق بآرائك الطبية ويفضل عيادتك دائماً عن غيرها.' },
        { icon: 'verified', title: 'براند شخصي طبي مهيب', desc: 'تأسيس حضور رقمي يبرز كفاءتك الأكاديمية والعملية بالرياض.' }
      ],
      benefitsEn: [
        { icon: 'group', title: 'Loyal Patient Community', desc: 'Building dynamic online followers that seek your medical opinion and share your clinic works.' },
        { icon: 'verified', title: 'Elite Professional Standing', desc: 'Translating your medical certificates and clinical achievements into high-end public authority.' }
      ],
      strategyTitleAr: 'خطوات صناعة المحتوى الطبي',
      strategyTitleEn: 'Our Creative Content Lifecycle',
      strategiesAr: [
        { title: 'تطوير نصوص طبية مرخصة وجذابة', desc: 'كتابة نصوص الفيديو والمنشورات بالاعتماد على مراجع علمية مع صياغتها بطريقة بسيطة وجذابة.' },
        { title: 'جلسات تصوير سريرية فاخرة', desc: 'إشراف وتصوير احترافي لعياداتكم وأطبائكم لإبراز المعايير السريرية الراقية والخدمات التخصصية.' },
        { title: 'التوزيع والنشر الذكي المستمر', desc: 'إدارة وجدولة النشر اليومي والتفاعل مع تعليقات واستفسارات المرضى لتحويلهم لعيادتك.' }
      ],
      strategiesEn: [
        { title: 'MOH Regulatory Writing', desc: 'Drafting medical scripts and educational content that is both compelling and scientifically accurate.' },
        { title: 'High-End Cinematic Shoots', desc: 'Directing and editing stunning visual tours and doctor profile videos in Riyadh clinical facilities.' },
        { title: 'Organic Algorithm Distribution', desc: 'Scheduling visual publications on TikTok, Snap, and Insta, maximizing reach among target local districts.' }
      ]
    },
    web: {
      icon: 'web',
      tagAr: 'تصميم المواقع الطبية الفاخرة',
      tagEn: 'Luxury Medical Web Development',
      titleAr: 'المواقع والتطبيقات الطبية فائقة الأداء',
      titleEn: 'Stunning Medical Web Platforms & Bookings',
      descAr: 'تصميم وهندسة واجهات ويب وتطبيقات طبية فائقة السرعة ومتوافقة 100% مع أنظمة الحجوزات لتجربة مريض سلسة ومثالية من الهواتف الذكية.',
      descEn: 'Developing high-converting responsive web screens and custom client systems with interactive scheduling tools.',
      btnTextAr: 'صمم موقع عيادتك الفاخر الآن',
      btnTextEn: 'Build Your Custom Clinic Site',
      benefitTitleAr: 'منصتك الرقمية هي واجهة عيادتك',
      benefitTitleEn: 'A Seamless Digital Patient Portal',
      benefitDescAr: 'موقعك الطبي هو الانطباع الأول للمرضى. نحن نبني مواقع وتطبيقات تجمع بين الفخامة البصرية والسرعة الفائقة لضمان تحويل الزائرين لحجوزات مؤكدة.',
      benefitDescEn: 'Your clinic website is where patient conversions actually happen. We deliver highly customized Next.js platforms optimized for speed, safety, and bookings.',
      benefitsAr: [
        { icon: 'speed', title: 'سرعة تصفح فائقة', desc: 'تحميل فوري للموقع من الجوال في أقل من ثانية ونصف يمنع خسارة المرضى.' },
        { icon: 'security', title: 'أمان وتشفير كامل للبيانات', desc: 'حماية كاملة لمعلومات المرضى الطبية مع تشفير وسيرفرات آمنة.' }
      ],
      benefitsEn: [
        { icon: 'speed', title: 'Sub-Second Speeds', desc: 'Optimized react frameworks ensuring your mobile users never leave due to page loading lags.' },
        { icon: 'security', title: 'HIPAA & MOH Data Safety', desc: 'End-to-end encryption to govern private patient appointment forms and secure hospital data.' }
      ],
      strategyTitleAr: 'مراحل تصميم وتطوير المواقع الطبية',
      strategyTitleEn: 'Our Medical Engineering Pipeline',
      strategiesAr: [
        { title: 'هندسة تجربة المريض الرقمية (UX)', desc: 'واجهات بسيطة تمكن المريض من معرفة الأطباء، وحجز موعد، والاتصال في أقل من 3 نقرات.' },
        { title: 'الربط مع برامج إدارة العيادات', desc: 'دمج موقعك مع أنظمة إدارة الحجوزات والمواعيد الداخلية لمركزك الطبي مباشرة.' },
        { title: 'التوافق مع متطلبات السيو الفني', desc: 'بناء كود نظيف ومتوافق 100% مع خوارزميات جوجل لضمان الظهور الفوري في نتائج البحث.' }
      ],
      strategiesEn: [
        { title: 'Intuitive Patient Flow (UX/UI)', desc: 'Designing streamlined paths that allow visitors to view credentials and confirm consultations in 3 clicks.' },
        { title: 'Clinic CRM & Calendar Sync', desc: 'Integrating directly with your internal hospital databases and appointment software.' },
        { title: 'Technical SEO Base Code', desc: 'Applying structured JSON-LD schemes so search engines understand your locations, reviews, and specialties instantly.' }
      ]
    },
    reputation: {
      icon: 'verified',
      tagAr: 'إدارة السمعة والسيرة الطبية',
      tagEn: 'Healthcare Reputation Governance',
      titleAr: 'بناء وإدارة السيرة والسمعة الطبية للأطباء',
      titleEn: 'Clinic & Doctor Reputation Management',
      descAr: 'حماية وبناء السمعة الرقمية والتقييمات للمراكز الطبية والأطباء على خرائط جوجل لزيادة ثقة المريض ودعم الحجز السريع.',
      descEn: 'Leveraging automated feedback software to govern clinic ratings, capture star reviews, and secure patient trust online.',
      btnTextAr: 'ابدأ في حماية سمعتك الطبية الرقمية',
      btnTextEn: 'Govern Your Clinic Reputation Now',
      benefitTitleAr: 'التقييمات هي القوة الدافعة للحجوزات',
      benefitTitleEn: 'Trust In The Age of Digital Reviews',
      benefitDescAr: 'يقرأ أكثر من 90% من المرضى في الرياض تقييمات خرائط جوجل والمنصات قبل اختيار عيادتهم الجديدة. نحن نصمم لك نظاماً آلياً لجمع وحماية تقييماتك وتكبيرها.',
      benefitDescEn: 'Selective patients choose medical specialists with superior verified feedback. We deploy systemic triggers to harvest positive feedback while buffering critical inquiries.',
      benefitsAr: [
        { icon: 'star', title: 'جمع تقييمات حقيقية تلقائية', desc: 'نظام ذكي يرسل للمرضى بعد خروجهم من العيادة لتقييم خدماتك بسهولة.' },
        { icon: 'gavel', title: 'حماية السمعة من التقييمات الوهمية', desc: 'مراقبة وتدخل فوري لحل التقييمات السلبية الكاذبة وحمايتك الرقمية.' }
      ],
      benefitsEn: [
        { icon: 'star', title: 'Automated 5-Star Streams', desc: 'Sending polite feedback prompts to patients right after clinical discharge, boosting Google rating naturally.' },
        { icon: 'gavel', title: 'Critical Feedback Buffering', desc: 'Filtering negative remarks privately to internal support teams while showcasing organic positive reviews.' }
      ],
      strategyTitleAr: 'استراتيجية حوكمة السمعة الطبية',
      strategyTitleEn: 'Our Review Automation Framework',
      strategiesAr: [
        { title: 'تفعيل أنظمة التقييم التلقائي بالعيادات', desc: 'ربط رسائل واتساب أو رسائل نصية قصيرة بنظام الفواتير والزيارات لدعوة التقييم.' },
        { title: 'تحليل والرد المهني الطبي على المراجعات', desc: 'الرد على كافة التقييمات والمراجعات بلغة وقورة ومهنية تليق بسمعة المركز وتدعم السيو.' },
        { title: 'مراقبة المنصات الطبية والأدلة بالرياض', desc: 'متابعة وتحديث ملفات الأطباء على مختلف أدلة البحث الطبي لضمان تطابق البيانات.' }
      ],
      strategiesEn: [
        { title: 'Automated Review Triggers', desc: 'Integrating custom text/WhatsApp dispatch systems with your hospital checkout flow.' },
        { title: 'Professional Medical Moderation', desc: 'Replying to all patient feedback gracefully, showing empathy and enhancing organic keyword relevancy.' },
        { title: 'Directories Integration', desc: 'Keeping active records across multiple Saudi clinic portals consistent and completely updated.' }
      ]
    },
    identity: {
      icon: 'fingerprint',
      tagAr: 'الهوية الطبية للعيادات الفاخرة',
      tagEn: 'Clinical Brand Identity',
      titleAr: 'صياغة وتأسيس الهوية الطبية الرقمية الفاخرة',
      titleEn: 'Luxury Medical Branding & Corporate Identity',
      descAr: 'تصميم وتأسيس براند طبي متكامل وفاخر يبرز المرجعية العلمية للأطباء والعيادات ويزيد من جاذبيتها للمرضى ذوي الفئات العالية.',
      descEn: 'Drafting cinematic, premium clinical visual assets, logos, and custom style guide tokens for hospitals and modern centers.',
      btnTextAr: 'صمم الهوية الطبية الفاخرة لمركزك',
      btnTextEn: 'Design Your Luxury Medical Brand',
      benefitTitleAr: 'الفخامة البصرية تبني السلطة الطبية',
      benefitTitleEn: 'Premium Branding Commands High Fees',
      benefitDescAr: 'لا يشتري المرضى مجرد علاج، بل يشترون الثقة والرعاية الفاخرة. الهوية الراقية المتكاملة تميز علامتكم عن العيادات التقليدية وتدعم الأسعار العادلة.',
      benefitDescEn: 'A luxury, unified identity sets elite clinical centers apart from commercial discount operations, justifying premium patient care pricing.',
      benefitsAr: [
        { icon: 'palette', title: 'تصميم بصري فاخر وفريد', desc: 'شعار، ألوان، وخطوط مخصصة تعبر عن الرقي والوقار الطبي لعلامتكم.' },
        { icon: 'verified', title: 'توحيد كافة قنوات التواصل', desc: 'بناء حضور متكامل ومتناسق يبدأ من لوحة العيادة ويمتد لموقعكم ومنصاتكم.' }
      ],
      benefitsEn: [
        { icon: 'palette', title: 'High-End Custom Visuals', desc: 'Tailored logo, color palettes, and typography matching clinical class and visual prestige.' },
        { icon: 'verified', title: 'Consistent Channel Presentation', desc: 'Aligning physical clinic interiors, signage, stationery, and dynamic web interfaces.' }
      ],
      strategyTitleAr: 'استراتيجية بناء الهوية الطبية الرقمية',
      strategyTitleEn: 'Branding Execution Protocol',
      strategiesAr: [
        { title: 'تحديد تموضع العلامة والرسالة الطبية', desc: 'دراسة قيم العيادة وصياغة الرسالة الطبية التخصصية التي تميزكم عن غيركم بالرياض.' },
        { title: 'تصميم حزمة الهوية البصرية المتكاملة', desc: 'إنتاج كتيب الهوية، الشعار، الألوان، الخطوط، وقوالب المنشورات الفاخرة الطبية.' },
        { title: 'أصول الطباعة والمواد الإعلانية بالعيادة', desc: 'تصميم كروت الأطباء، التقارير الطبية، روشتات العيادة، والديكور الداخلي المتناسق.' }
      ],
      strategiesEn: [
        { title: 'Brand Positioning Audit', desc: 'Delineating clinical strengths and creating unique brand mission statements for target markets.' },
        { title: 'Premium Style Guide Production', desc: 'Developing font packages, logo systems, social media assets, and medical card templates.' },
        { title: 'Physical Clinic Collaterals', desc: 'Designing medical reports, clinical prescription sheets, envelopes, and consistent signage designs.' }
      ]
    }
  };

  const currentService = SERVICE_DATA[slug];

  if (!currentService) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-40 pb-24 text-center">
          <h2 className="text-2xl text-white font-bold mb-4">{isRtl ? 'الخدمة غير موجودة' : 'Service Not Found'}</h2>
          <Link href={getHref('services')} className="text-cyan-400 font-bold hover:underline">
            {isRtl ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-32 pb-24 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
        
        {/* Service Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative select-none">
          <div className="absolute top-0 left-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <Link 
            href={getHref('services')} 
            className={`inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 text-xs font-bold ${isRtl ? 'justify-start' : 'justify-start'}`}
          >
            <span className={`material-symbols-outlined text-sm ${isRtl ? 'rotate-180' : ''}`}>arrow_back</span> 
            {isRtl ? 'العودة للخدمات الرقمية' : 'Back to Digital Services'}
          </Link>
          
          <div className={`flex items-center gap-4 mb-8 ${isRtl ? 'justify-start' : 'justify-start'}`}>
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-cyan-400/20">
              <span className="material-symbols-outlined text-cyan-400 text-4xl">{currentService.icon}</span>
            </div>
            <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1.5 rounded-lg">
              {isRtl ? currentService.tagAr : currentService.tagEn}
            </span>
          </div>
          
          <h1 className={`text-3xl md:text-5xl font-extrabold text-white mb-6 leading-[1.2] max-w-4xl ${isRtl ? 'text-right' : 'text-left'}`}>
            {isRtl ? currentService.titleAr : currentService.titleEn}
          </h1>
          
          <p className={`text-base md:text-lg text-slate-300 max-w-2xl mb-12 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
            {isRtl ? currentService.descAr : currentService.descEn}
          </p>
          
          <Link 
            href={getHref('contact')} 
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-10 py-5 rounded-xl font-bold text-sm shadow-[0_0_30px_rgba(0,218,243,0.3)] hover:scale-[1.03] transition-transform cursor-pointer"
          >
            {isRtl ? currentService.btnTextAr : currentService.btnTextEn}
          </Link>
        </section>

        {/* Benefits & Strategies Content Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 select-none">
          
          {/* Benefit card */}
          <div className="glass-card p-8 md:p-10 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className={`text-xl md:text-2xl font-bold text-white mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl ? currentService.benefitTitleAr : currentService.benefitTitleEn}
              </h3>
              <p className={`text-sm md:text-base text-slate-300 leading-relaxed mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl ? currentService.benefitDescAr : currentService.benefitDescEn}
              </p>
              
              <div className="space-y-6">
                {(isRtl ? currentService.benefitsAr : currentService.benefitsEn).map((b, i) => (
                  <div key={i} className={`flex gap-4 items-start ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-400">
                      <span className="material-symbols-outlined text-lg">{b.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1.5">{b.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-sm">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Direct call links details */}
            <div className="border-t border-white/5 pt-8 mt-12 flex justify-start">
              <Link href={getHref('contact')} className="text-cyan-400 text-xs font-bold hover:underline flex items-center gap-1">
                {isRtl ? 'احصل على تفاصيل الأسعار والخطط' : 'Get specific custom plan costs'}
                <span className={`material-symbols-outlined text-sm ${isRtl ? 'rotate-180' : ''}`}>arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Strategies Card */}
          <div className="glass-card p-8 md:p-10 rounded-2xl">
            <h3 className={`text-xl md:text-2xl font-bold text-white mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
              {isRtl ? currentService.strategyTitleAr : currentService.strategyTitleEn}
            </h3>
            
            <ul className="space-y-6">
              {(isRtl ? currentService.strategiesAr : currentService.strategiesEn).map((strat, i) => (
                <li key={i} className={`border-b border-white/5 last:border-0 pb-5 last:pb-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h4 className="text-cyan-400 font-bold mb-2 text-sm md:text-base">{strat.title}</h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{strat.desc}</p>
                </li>
              ))}
            </ul>
          </div>

        </section>

      </main>
      
      <Footer />
      <FloatContacts />
    </>
  );
}
