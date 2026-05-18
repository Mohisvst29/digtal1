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
  const { t, locale, data } = useContent();

  const isRtl = locale === 'ar';

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  // Master Service Copy Mapping - Dynamic translations from MongoDB with high quality fallbacks
  const SERVICE_DATA: Record<string, {
    icon: string;
    tag: string;
    title: string;
    desc: string;
    btnText: string;
    benefitTitle: string;
    benefitDesc: string;
    benefits: Array<{ icon: string, title: string, desc: string }>;
    strategyTitle: string;
    strategies: Array<{ title: string, desc: string }>;
  }> = {
    seo: {
      icon: 'search_insights',
      tag: t('serv_seo_tag', 'تحسين محركات البحث الطبي | Clinical Medical SEO'),
      title: t('serv_seo_title', 'إتقان سيو العيادات والمستشفيات | Clinical Healthcare SEO Dominance'),
      desc: t('serv_seo_desc', 'تصدّر نتائج البحث المحلية في جوجل للكلمات المفتاحية عالية الحجز بالرياض لبناء تدفق مستمر ومجاني بالكامل من المرضى دون توقف. | Dominating local search results in Riyadh for high-intent queries like best clinic near me to channel organic patient flow.'),
      btnText: t('serv_seo_btn_text', 'اطلب فحص سيو مجاني لعيادتك | Get Free Clinic SEO Audit'),
      benefitTitle: t('serv_seo_benefit_title', 'ميزة تصدر محركات البحث | The Power of Organic SEO'),
      benefitDesc: t('serv_seo_benefit_desc', 'يبدأ أكثر من 70% من المرضى بالرياض رحلتهم الطبية بالبحث على جوجل. إذا لم تكن عيادتك في الصفحة الأولى، فإنك ببساطة تقدم مرضاك الجدد للعيادات المنافسة. | Over 70% of selective patients start their search with Google queries. Dominating organic listings bypasses expensive paid ads permanently.'),
      benefits: [
        { 
          icon: 'verified', 
          title: t('serv_seo_benefit_item1_title', 'حجوزات عالية الكفاءة | High-Intent Bookings'), 
          desc: t('serv_seo_benefit_item1_desc', 'زوار نتائج البحث العضوية يملكون أعلى نسب حجز مواعيد فعلية واستبقاء للعيادة. | Organic web visitors have the absolute highest conversion rate to clinical check-ups.') 
        },
        { 
          icon: 'verified', 
          title: t('serv_seo_benefit_item2_title', 'عائد استثماري مستدام | Permanent Digital Assets'), 
          desc: t('serv_seo_benefit_item2_desc', 'بخلاف الإعلانات، نتائج الـ SEO تبني أصولاً رقمية مجانية ودائمة لعلامتكم الطبية. | Unlike social ads, SEO pages build lasting digital compounding authority for your clinic.') 
        }
      ],
      strategyTitle: t('serv_seo_strategy_title', 'آلية العمل والاستراتيجية السريرية | Our SEO Framework & Compliance'),
      strategies: [
        { 
          title: t('serv_seo_strategy_item1_title', 'السيطرة على البحث المحلي (السيو المحلي) | Google Maps Optimization (Local SEO)'), 
          desc: t('serv_seo_strategy_item1_desc', 'تحسين ملفات خرائط جوجل للعيادة (ملف جوجل التجاري) لتتصدر فوراً عند بحث المرضى القريبين بالرياض. | Optimizing your GMB profile to appear instantly on local geo-targeted clinical searches in Riyadh.') 
        },
        { 
          title: t('serv_seo_strategy_item2_title', 'هيكلة وصناعة المحتوى الطبي التخصصي | MOH & Google Compliant Content'), 
          desc: t('serv_seo_strategy_item2_desc', 'نشر مقالات طبية وعلمية بالغة الدقة تتوافق مع خوارزميات جوجل الصارمة لبناء الموثوقية الطبية. | Writing clinical articles utilizing top expert medical knowledge guidelines to build real authority.') 
        },
        { 
          title: t('serv_seo_strategy_item3_title', 'التحسين التقني الفني للموقع وسرعة التصفح | Technical Speed & Architecture'), 
          desc: t('serv_seo_strategy_item3_desc', 'تحسين كود الموقع وسرعة تحميله لتصل لأقل من ثانية ونصف، وضمان تصفح مريح وخالي من أي تعقيدات من الجوال. | Ensuring your site loads in under 1.5 seconds, optimized fully for responsive mobile screens.') 
        }
      ]
    },
    ppc: {
      icon: 'ads_click',
      tag: t('serv_ppc_tag', 'إعلانات الاستحواذ المباشر | Targeted Patient Lead Generation'),
      title: t('serv_ppc_title', 'حملات الإعلانات الطبية المدفوعة الذكية | High-Conversion Paid Patient Campaigns'),
      desc: t('serv_ppc_desc', 'حملات تسويقية فائقة الدقة والتحويل عبر جوجل وسناب شات وميتا لتوليد تدفق مباشر لحجوزات العيادة بأقل كلفة استحواذ ممكنة وبأعلى جودة. | Engineering data-driven, highly optimized ad campaigns on Google, Snapchat, and Meta to pack clinic consult rooms with selective patients.'),
      btnText: t('serv_ppc_btn_text', 'احصل على خطة إعلانية مخصصة لعيادتك | Request Custom Ad Strategy'),
      benefitTitle: t('serv_ppc_benefit_title', 'عائد سريع ونمو مضمون الحجوزات | Instant Patient Flow Optimization'),
      benefitDesc: t('serv_ppc_benefit_desc', 'نصمم حملات إعلانية مدفوعة ومحسنة خصيصاً للعيادات الطبية التخصصية، لزيادة نسب الإشغال وجمع استمارات الحجز الحقيقية مع خفض تكاليف النقرة. | Deploying highly-converting paid pathways that focus purely on confirmed clinical calls, WhatsApp messages, and direct online bookings.'),
      benefits: [
        { 
          icon: 'trending_up', 
          title: t('serv_ppc_benefit_item1_title', 'نتائج فورية مباشرة | Instant Lead Influx'), 
          desc: t('serv_ppc_benefit_item1_desc', 'تبدأ الاتصالات وحجوزات المواعيد في التدفق لمركزك الطبي من اليوم الأول لإطلاق الحملة. | Verified booking requests start reaching your reception from the very first hour of ad launch.') 
        },
        { 
          icon: 'verified', 
          title: t('serv_ppc_benefit_item2_title', 'تتبع كامل للحجوزات | End-to-End Analytics Tracking'), 
          desc: t('serv_ppc_benefit_item2_desc', 'نظام قياس دقيق يربط بين الميزانية المدفوعة والمبيعات الطبية الفعلية لعيادتك. | We link paid clicks directly with final patient arrivals at your clinic, ensuring precise ROI.') 
        }
      ],
      strategyTitle: t('serv_ppc_strategy_title', 'منهجية الإعلانات الطبية الدقيقة | Clinical Ad Campaigns Setup'),
      strategies: [
        { 
          title: t('serv_ppc_strategy_item1_title', 'استهدف الفئات عالية النية | High-Value Interest Targeting'), 
          desc: t('serv_ppc_strategy_item1_desc', 'استهداف المرضى الباحثين عن علاجات التجميل، الأسنان، الليزر، وزراعة الأسنان في مناطق الرياض الراقية. | Reaching selective individuals looking for plastic surgery, veneers, dental implants, or aesthetic treatments in upscale Riyadh.') 
        },
        { 
          title: t('serv_ppc_strategy_item2_title', 'تصميم عروض وحوافز متوافقة طبياً | MOH Compliant Ad Copywriting'), 
          desc: t('serv_ppc_strategy_item2_desc', 'صياغة نصوص إعلانية وعروض علاجية محفزة مع الحفاظ الكامل على وقار وأخلاقيات المهنة الطبية. | Drafting premium visual styles and persuasive medical copywriting that complies with local healthcare guidelines.') 
        },
        { 
          title: t('serv_ppc_strategy_item3_title', 'الاختبار والتحسين الذكي المستمر | A/B Testing & Scaling'), 
          desc: t('serv_ppc_strategy_item3_desc', 'اختبار مستمر للعناوين والمواد الإبداعية لتقليل تكلفة حجز الاستشارة وضمان ثبات التدفق. | Constantly optimizing graphics, layout variations, and target channels to drive down patient acquisition costs.') 
        }
      ]
    },
    social: {
      icon: 'share_reviews',
      tag: t('serv_social_tag', 'التسويق عبر صناعة المحتوى | Medical Social Content Strategy'),
      title: t('serv_social_title', 'صناعة المحتوى الطبي وإدارة السوشيال ميديا | Premium Medical Content & Social Media'),
      desc: t('serv_social_desc', 'صناعة وإنتاج مقاطع فيديو مميزة ومبسطة للأطباء على تيك توك وإنستغرام وسناب شات لبناء المصداقية وترسيخ الثقة في تخصصاتكم الطبية بالرياض. | Crafting visually stunning educational social assets for selective doctors and modern medical centers to engage patient groups online.'),
      btnText: t('serv_social_btn_text', 'ابدأ في بناء براندك الشخصي الطبي الآن | Build Your Medical Brand Now'),
      benefitTitle: t('serv_social_benefit_title', 'تحويل المعرفة إلى ثقة وحجوزات | Transforming Medical Authority to Trust'),
      benefitDesc: t('serv_social_benefit_desc', 'يبحث المرضى الحديثون عن وجوه مألوفة وعلم حقيقي. نساعد الأطباء على الظهور بمظهر مهيب وودود عبر مقاطع فيديو قصيرة وتصاميم تثقيفية تترجم المعرفة الطبية لثقة. | Modern patients book with doctors they already feel connected to. We write and produce custom media content that presents clinical excellence in premium style.'),
      benefits: [
        { 
          icon: 'group', 
          title: t('serv_social_benefit_item1_title', 'بناء قاعدة مرضى مخلصين | Loyal Patient Community'), 
          desc: t('serv_social_benefit_item1_desc', 'بناء مجتمع رقمي يثق بآرائك الطبية ويفضل عيادتك دائماً عن غيرها. | Building dynamic online followers that seek your medical opinion and share your clinic works.') 
        },
        { 
          icon: 'verified', 
          title: t('serv_social_benefit_item2_title', 'براند شخصي طبي مهيب | Elite Professional Standing'), 
          desc: t('serv_social_benefit_item2_desc', 'تأسيس حضور رقمي يبرز كفاءتك الأكاديمية والعملية بالرياض. | Translating your medical certificates and clinical achievements into high-end public authority.') 
        }
      ],
      strategyTitle: t('serv_social_strategy_title', 'خطوات صناعة المحتوى الطبي | Our Creative Content Lifecycle'),
      strategies: [
        { 
          title: t('serv_social_strategy_item1_title', 'تطوير نصوص طبية مرخصة وجذابة | MOH Regulatory Writing'), 
          desc: t('serv_social_strategy_item1_desc', 'كتابة نصوص الفيديو والمنشورات بالاعتماد على مراجع علمية مع صياغتها بطريقة بسيطة وجذابة. | Drafting medical scripts and educational content that is both compelling and scientifically accurate.') 
        },
        { 
          title: t('serv_social_strategy_item2_title', 'جلسات تصوير سريرية فاخرة | High-End Cinematic Shoots'), 
          desc: t('serv_social_strategy_item2_desc', 'إشراف وتصوير احترافي لعياداتكم وأطبائكم لإبراز المعايير السريرية الراقية والخدمات التخصصية. | Directing and editing stunning visual tours and doctor profile videos in Riyadh clinical facilities.') 
        },
        { 
          title: t('serv_social_strategy_item3_title', 'التوزيع والنشر الذكي المستمر | Organic Algorithm Distribution'), 
          desc: t('serv_social_strategy_item3_desc', 'إدارة وجدولة النشر اليومي والتفاعل مع تعليقات واستفسارات المرضى لتحويلهم لعيادتك. | Scheduling visual publications on TikTok, Snap, and Insta, maximizing reach among target local districts.') 
        }
      ]
    },
    web: {
      icon: 'web',
      tag: t('serv_web_tag', 'تصميم المواقع الطبية الفاخرة | Luxury Medical Web Development'),
      title: t('serv_web_title', 'المواقع والتطبيقات الطبية فائقة الأداء | Stunning Medical Web Platforms & Bookings'),
      desc: t('serv_web_desc', 'تصميم وهندسة واجهات ويب وتطبيقات طبية فائقة السرعة ومتوافقة 100% مع أنظمة الحجوزات لتجربة مريض سلسة ومثالية من الهواتف الذكية. | Developing high-converting responsive web screens and custom client systems with interactive scheduling tools.'),
      btnText: t('serv_web_btn_text', 'صمم موقع عيادتك الفاخر الآن | Build Your Custom Clinic Site'),
      benefitTitle: t('serv_web_benefit_title', 'منصتك الرقمية هي واجهة عيادتك | A Seamless Digital Patient Portal'),
      benefitDesc: t('serv_web_benefit_desc', 'موقعك الطبي هو الانطباع الأول للمرضى. نحن نبني مواقع وتطبيقات تجمع بين الفخامة البصرية والسرعة الفائقة لضمان تحويل الزائرين لحجوزات مؤكدة. | Your clinic website is where patient conversions actually happen. We deliver highly customized Next.js platforms optimized for speed, safety, and bookings.'),
      benefits: [
        { 
          icon: 'speed', 
          title: t('serv_web_benefit_item1_title', 'سرعة تصفح فائقة | Sub-Second Speeds'), 
          desc: t('serv_web_benefit_item1_desc', 'تحميل فوري للموقع من الجوال في أقل من ثانية ونصف يمنع خسارة المرضى. | Optimized react frameworks ensuring your mobile users never leave due to page loading lags.') 
        },
        { 
          icon: 'security', 
          title: t('serv_web_benefit_item2_title', 'أمان وتشفير كامل للبيانات | HIPAA & MOH Data Safety'), 
          desc: t('serv_web_benefit_item2_desc', 'حماية كاملة لمعلومات المرضى الطبية مع تشفير وسيرفرات آمنة. | End-to-end encryption to govern private patient appointment forms and secure hospital data.') 
        }
      ],
      strategyTitle: t('serv_web_strategy_title', 'مراحل تصميم وتطوير المواقع الطبية | Our Medical Engineering Pipeline'),
      strategies: [
        { 
          title: t('serv_web_strategy_item1_title', 'هندسة تجربة المريض الرقمية (UX) | Intuitive Patient Flow (UX/UI)'), 
          desc: t('serv_web_strategy_item1_desc', 'واجهات بسيطة تمكن المريض من معرفة الأطباء، وحجز موعد، والاتصال في أقل من 3 نقرات. | Designing streamlined paths that allow visitors to view credentials and confirm consultations in 3 clicks.') 
        },
        { 
          title: t('serv_web_strategy_item2_title', 'الربط مع برامج إدارة العيادات | Clinic CRM & Calendar Sync'), 
          desc: t('serv_web_strategy_item2_desc', 'دمج موقعك مع أنظمة إدارة الحجوزات والمواعيد الداخلية لمركزك الطبي مباشرة. | Integrating directly with your internal hospital databases and appointment software.') 
        },
        { 
          title: t('serv_web_strategy_item3_title', 'التوافق مع متطلبات السيو الفني | Technical SEO Base Code'), 
          desc: t('serv_web_strategy_item3_desc', 'بناء كود نظيف ومتوافق 100% مع خوارزميات جوجل لضمان الظهور الفوري في نتائج البحث. | Applying structured JSON-LD schemes so search engines understand your locations, reviews, and specialties instantly.') 
        }
      ]
    },
    reputation: {
      icon: 'verified',
      tag: t('serv_rep_tag', 'إدارة السمعة والسيرة الطبية | Healthcare Reputation Governance'),
      title: t('serv_rep_title', 'بناء وإدارة السيرة والسمعة الطبية للأطباء | Clinic & Doctor Reputation Management'),
      desc: t('serv_rep_desc', 'حماية وبناء السمعة الرقمية والتقييمات للمراكز الطبية والأطباء على خرائط جوجل لزيادة ثقة المريض ودعم الحجز السريع. | Leveraging automated feedback software to govern clinic ratings, capture star reviews, and secure patient trust online.'),
      btnText: t('serv_rep_btn_text', 'ابدأ في حماية سمعتك الطبية الرقمية | Govern Your Clinic Reputation Now'),
      benefitTitle: t('serv_rep_benefit_title', 'التقييمات هي القوة الدافعة للحجوزات | Trust In The Age of Digital Reviews'),
      benefitDesc: t('serv_rep_benefit_desc', 'يقرأ أكثر من 90% من المرضى في الرياض تقييمات خرائط جوجل والمنصات قبل اختيار عيادتهم الجديدة. نحن نصمم لك نظاماً آلياً لجمع وحماية تقييماتك وتكبيرها. | Selective patients choose medical specialists with superior verified feedback. We deploy systemic triggers to harvest positive feedback while buffering critical inquiries.'),
      benefits: [
        { 
          icon: 'star', 
          title: t('serv_rep_benefit_item1_title', 'جمع تقييمات حقيقية تلقائية | Automated 5-Star Streams'), 
          desc: t('serv_rep_benefit_item1_desc', 'نظام ذكي يرسل للمرضى بعد خروجهم من العيادة لتقييم خدماتك بسهولة. | Sending polite feedback prompts to patients right after clinical discharge, boosting Google rating naturally.') 
        },
        { 
          icon: 'gavel', 
          title: t('serv_rep_benefit_item2_title', 'حماية السمعة من التقييمات الوهمية | Critical Feedback Buffering'), 
          desc: t('serv_rep_benefit_item2_desc', 'مراقبة وتدخل فوري لحل التقييمات السلبية الكاذبة وحمايتك الرقمية. | Filtering negative remarks privately to internal support teams while showcasing organic positive reviews.') 
        }
      ],
      strategyTitle: t('serv_rep_strategy_title', 'استراتيجية حوكمة السمعة الطبية | Our Review Automation Framework'),
      strategies: [
        { 
          title: t('serv_rep_strategy_item1_title', 'تفعيل أنظمة التقييم التلقائي بالعيادات | Automated Review Triggers'), 
          desc: t('serv_rep_strategy_item1_desc', 'ربط رسائل واتساب أو رسائل نصية قصيرة بنظام الفواتير والزيارات لدعوة التقييم. | Integrating custom text/WhatsApp dispatch systems with your hospital checkout flow.') 
        },
        { 
          title: t('serv_rep_strategy_item2_title', 'تحليل والرد المهني الطبي على المراجعات | Professional Medical Moderation'), 
          desc: t('serv_rep_strategy_item2_desc', 'الرد على كافة التقييمات والمراجعات بلغة وقورة ومهنية تليق بسمعة المركز وتدعم السيو. | Replying to all patient feedback gracefully, showing empathy and enhancing organic keyword relevancy.') 
        },
        { 
          title: t('serv_rep_strategy_item3_title', 'مراقبة المنصات الطبية والأدلة بالرياض | Directories Integration'), 
          desc: t('serv_rep_strategy_item3_desc', 'متابعة وتحديث ملفات الأطباء على مختلف أدلة البحث الطبي لضمان تطابق البيانات. | Keeping active records across Saudi clinic portals consistent and completely updated.') 
        }
      ]
    },
    identity: {
      icon: 'fingerprint',
      tag: t('serv_id_tag', 'الهوية الطبية للعيادات الفاخرة | Clinical Brand Identity'),
      title: t('serv_id_title', 'صياغة وتأسيس الهوية الطبية الرقمية الفاخرة | Luxury Medical Branding & Corporate Identity'),
      desc: t('serv_id_desc', 'تصميم وتأسيس براند طبي متكامل وفاخر يبرز المرجعية العلمية للأطباء والعيادات ويزيد من جاذبيتها للمرضى ذوي الفئات العالية. | Drafting cinematic, premium clinical visual assets, logos, and custom style guide tokens for hospitals and modern centers.'),
      btnText: t('serv_id_btn_text', 'صمم الهوية الطبية الفاخرة لمركزك | Design Your Luxury Medical Brand'),
      benefitTitle: t('serv_id_benefit_title', 'الفخامة البصرية تبني السلطة الطبية | Premium Branding Commands High Fees'),
      benefitDesc: t('serv_id_benefit_desc', 'لا يشتري المرضى مجرد علاج، بل يشترون الثقة والرعاية الفاخرة. الهوية الراقية المتكاملة تميز علامتكم عن العيادات التقليدية وتدعم الأسعار العادلة. | A luxury, unified identity sets elite clinical centers apart from commercial discount operations, justifying premium patient care pricing.'),
      benefits: [
        { 
          icon: 'palette', 
          title: t('serv_id_benefit_item1_title', 'تصميم بصري فاخر وفريد | High-End Custom Visuals'), 
          desc: t('serv_id_benefit_item1_desc', 'شعار، ألوان، وخطوط مخصصة تعبر عن الرقي والوقار الطبي لعلامتكم. | Tailored logo, color palettes, and typography matching clinical class and visual prestige.') 
        },
        { 
          icon: 'verified', 
          title: t('serv_id_benefit_item2_title', 'توحيد كافة قنوات التواصل | Consistent Channel Presentation'), 
          desc: t('serv_id_benefit_item2_desc', 'بناء حضور متكامل ومتناسق يبدأ من لوحة العيادة ويمتد لموقعكم ومنصاتكم. | Aligning physical clinic interiors, signage, stationery, and dynamic web interfaces.') 
        }
      ],
      strategyTitle: t('serv_id_strategy_title', 'استراتيجية بناء الهوية الطبية الرقمية | Branding Execution Protocol'),
      strategies: [
        { 
          title: t('serv_id_strategy_item1_title', 'تحديد تموضع العلامة والرسالة الطبية | Brand Positioning Audit'), 
          desc: t('serv_id_strategy_item1_desc', 'دراسة قيم العيادة وصياغة الرسالة الطبية التخصصية التي تميزكم عن غيركم بالرياض. | Delineating clinical strengths and creating unique brand mission statements for target markets.') 
        },
        { 
          title: t('serv_id_strategy_item2_title', 'تصميم حزمة الهوية البصرية المتكاملة | Premium Style Guide Production'), 
          desc: t('serv_id_strategy_item2_desc', 'إنتاج كتيب الهوية، الشعار، الألوان، الخطوط، وقوالب المنشورات الفاخرة الطبية. | Developing font packages, logo systems, social media assets, and medical card templates.') 
        },
        { 
          title: t('serv_id_strategy_item3_title', 'أصول الطباعة والمواد الإعلانية بالعيادة | Physical Clinic Collaterals'), 
          desc: t('serv_id_strategy_item3_desc', 'تصميم كروت الأطباء، التقارير الطبية، روشتات العيادة، والديكور الداخلي المتناسق. | Designing medical reports, clinical prescription sheets, envelopes, and consistent signage designs.') 
        }
      ]
    }
  };

  let normalizedSlug = slug;
  if (slug === 'digital-medicalidentity') normalizedSlug = 'identity';
  else if (slug === 'medical-socialmedia') normalizedSlug = 'social';
  else if (slug === 'medical-seo') normalizedSlug = 'seo';
  else if (slug === 'paid-ads') normalizedSlug = 'ppc';
  else if (slug === 'reputation-management') normalizedSlug = 'reputation';
  else if (slug === 'medical-website') normalizedSlug = 'web';

  const rawService = SERVICE_DATA[normalizedSlug];
  const dbService = data?.services?.find((s: any) => s.slug === normalizedSlug || s.slug === slug);

  // Smart local text selector that extracts the right locale section if separated by a pipe
  const selectLocalText = (text: string) => {
    if (!text) return '';
    if (text.includes('|')) {
      const parts = text.split('|');
      return isRtl ? parts[0].trim() : parts[1].trim();
    }
    return text;
  };

  const currentService = rawService || dbService ? {
    icon: dbService?.icon || rawService?.icon || 'clinical_notes',
    tag: dbService ? (isRtl ? dbService.tag_ar : dbService.tag_en) : (rawService?.tag ? selectLocalText(rawService.tag) : ''),
    title: dbService ? (isRtl ? dbService.title_ar : dbService.title_en) : (rawService?.title ? selectLocalText(rawService.title) : ''),
    desc: dbService ? (isRtl ? dbService.desc_ar : dbService.desc_en) : (rawService?.desc ? selectLocalText(rawService.desc) : ''),
    btnText: dbService ? (isRtl ? dbService.btnText_ar : dbService.btnText_en) : (rawService?.btnText ? selectLocalText(rawService.btnText) : ''),
    benefitTitle: dbService ? (isRtl ? dbService.benefitTitle_ar : dbService.benefitTitle_en) : (rawService?.benefitTitle ? selectLocalText(rawService.benefitTitle) : ''),
    benefitDesc: dbService ? (isRtl ? dbService.benefitDesc_ar : dbService.benefitDesc_en) : (rawService?.benefitDesc ? selectLocalText(rawService.benefitDesc) : ''),
    benefits: dbService && dbService.benefits && dbService.benefits.length > 0 
      ? dbService.benefits.map((b: any) => ({
          icon: b.icon || 'verified',
          title: isRtl ? b.title_ar : b.title_en,
          desc: isRtl ? b.desc_ar : b.desc_en
        }))
      : (rawService?.benefits || []).map((b: any) => ({
          icon: b.icon || 'verified',
          title: selectLocalText(b.title),
          desc: selectLocalText(b.desc)
        })),
    strategyTitle: dbService ? (isRtl ? dbService.strategyTitle_ar : dbService.strategyTitle_en) : (rawService?.strategyTitle ? selectLocalText(rawService.strategyTitle) : ''),
    strategies: dbService && dbService.strategies && dbService.strategies.length > 0
      ? dbService.strategies.map((s: any) => ({
          title: isRtl ? s.title_ar : s.title_en,
          desc: isRtl ? s.desc_ar : s.desc_en
        }))
      : (rawService?.strategies || []).map((s: any) => ({
          title: selectLocalText(s.title),
          desc: selectLocalText(s.desc)
        }))
  } : null;

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

  const defaultImages: Record<string, string> = {
    seo: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    ppc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    social: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
    web: "https://images.unsplash.com/photo-1547119944-ac76f6dbd485?auto=format&fit=crop&q=80&w=800",
    reputation: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    identity: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
  };

  const serviceImage = dbService?.image || defaultImages[normalizedSlug] || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800";

  const resolvedBenefits = currentService.benefits || [];
  const resolvedStrategies = currentService.strategies || [];

  return (
    <>
      <Header />
      
      <main className={`flex-grow pt-32 pb-24 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900`}>
        
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
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Service Text details */}
            <div className="lg:col-span-7 space-y-6">
              <div className={`flex items-center gap-4 mb-2 ${isRtl ? 'justify-start' : 'justify-start'}`}>
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-cyan-400/20">
                  <span className="material-symbols-outlined text-cyan-400 text-4xl">{currentService.icon}</span>
                </div>
                <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1.5 rounded-lg">
                  {currentService.tag}
                </span>
              </div>
              
              <h1 className={`text-3xl md:text-5xl font-extrabold text-white leading-[1.2] ${isRtl ? 'text-right' : 'text-left'}`}>
                {currentService.title}
              </h1>
              
              <p className={`text-base md:text-lg text-slate-300 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {currentService.desc}
              </p>
              
              <div className="pt-4">
                <Link 
                  href={getHref('contact')} 
                  className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-10 py-5 rounded-xl font-bold text-sm shadow-[0_0_30px_rgba(0,218,243,0.3)] hover:scale-[1.03] transition-transform cursor-pointer"
                >
                  {currentService.btnText}
                </Link>
              </div>
            </div>

            {/* Service Dynamic Image with premium glassmorphic visual showcase */}
            <div className="lg:col-span-5 relative w-full group">
              {/* Glowing Background Ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-[2.5rem] opacity-30 blur-2xl group-hover:scale-105 transition-all duration-500"></div>
              
              <div className="relative bg-slate-900/60 border border-white/10 p-3 rounded-[2.5rem] backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-800">
                  <img 
                    src={serviceImage} 
                    alt={currentService.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Strategies Content Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 select-none">
          
          {/* Benefit card */}
          <div className="glass-card p-8 md:p-10 rounded-2xl flex flex-col justify-between border border-white/5 bg-slate-900/60">
            <div>
              <h3 className={`text-xl md:text-2xl font-bold text-white mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                {selectLocalText(currentService.benefitTitle)}
              </h3>
              <p className={`text-sm md:text-base text-slate-300 leading-relaxed mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                {selectLocalText(currentService.benefitDesc)}
              </p>
              
              <div className="space-y-6">
                {resolvedBenefits.map((b, i) => (
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
          <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/5 bg-slate-900/60">
            <h3 className={`text-xl md:text-2xl font-bold text-white mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
              {selectLocalText(currentService.strategyTitle)}
            </h3>
            
            <ul className="space-y-6">
              {resolvedStrategies.map((strat, i) => (
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
