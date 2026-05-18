'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function FaqPage() {
  const { t, locale } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const isRtl = locale === 'ar';

  const heading = t('faq_heading', 'الأسئلة الشائعة للنمو الطبي');
  const description = t('faq_description', 'إجابات واضحة وشفافة حول باقات خدماتنا الطبية وطرق العمل مع الأطباء والعيادات التخصصية بالرياض.');

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  const faqs = [
    {
      qAr: 'هل أنتم متخصصون في التسويق الطبي فقط؟',
      qEn: 'Are you exclusively focused on medical healthcare marketing?',
      aAr: 'نعم، التسويق الطبي والقطاع الصحي هو تخصصنا الوحيد. نحن نؤمن بأن التسويق الطبي يحتاج إلى فهم دقيق لسيكولوجية المريض، المعايير الطبية والأخلاقية، وقوانين الإعلانات الطبية بمؤسسات المملكة العربية السعودية وزارة الصحة، وهو ما لا تقدمه الوكالات التسويقية العامة.',
      aEn: 'Yes, clinical marketing is our sole specialty. Healthcare demands meticulous adherence to patient psychology, professional visual trust, and strict Saudi MOH guidelines, which general marketing firms lack.'
    },
    {
      qAr: 'كم تكلفة الخدمات والمشاريع الطبية الرقمية؟',
      qEn: 'What are the costs and packages of your clinical services?',
      aAr: 'تختلف الأسعار والخطط المقررة بناءً على حجم الأهداف الطبية، وتخصص العيادة، ومستوى التنافس بالرياض. نقدم باقات مرنة للغاية تناسب العيادات الفردية والمراكز الطبية الكبرى مع استراتيجيات تحصيل تتبع دقيق للعائد الاستثماري.',
      aEn: 'Our service quotes vary depending on scale goals, surgical/non-surgical specialties, and current localized patient competition in Riyadh. We customize budgets strictly aimed at driving profitable patient acquisition costs.'
    },
    {
      qAr: 'كم يستغرق ظهور النتائج وحجوزات المرضى الحقيقية؟',
      qEn: 'How long does it take to see real patient inquiries and bookings?',
      aAr: 'تختلف المدة حسب القنوات المستخدمة: الإعلانات المدفوعة الذكية تحقق نتائج وحجوزات فورية خلال 30 إلى 60 يوماً من تفعيلها. أما السيو الطبي التخصصي فيحتاج من 3 إلى 6 أشهر لبناء السمعة وتصدر نتائج بحث جوجل لضمان تدفق مستدام ومجاني للمرضى.',
      aEn: 'Timeline depends on selected pathways: Paid search and social ads yield incoming clinic consult forms within 30-60 days. Comprehensive clinical SEO compounds authority, requiring 3-6 months to capture lasting free local Google Maps patient streams.'
    },
    {
      qAr: 'هل تعملون مع الأطباء والاستشاريين الأفراد؟',
      qEn: 'Do you support individual physicians and private consultants?',
      aAr: 'نعم، نعمل بشكل وثيق للغاية مع الأطباء والاستشاريين لبناء الهوية الطبية الشخصية (البراند الشخصي الطبي) الذي يدعم الثقة ويزيد من جاذبية اسم الممارس في سوق الرياض الطبي المزدحم.',
      aEn: 'Absolutely. We collaborate directly with clinical specialists to engineer their professional digital brand, highlighting credentials, clinical reviews, and thought leadership positions.'
    },
    {
      qAr: 'هل توفرون تقارير وتحليلات أداء شهرية للعيادات؟',
      qEn: 'Do you deliver detailed clinical performance analytics?',
      aAr: 'نعم، نلتزم بالشفافية المطلقة. نقدم تقارير أداء دورية توضح أعداد استمارات الحجز المكتملة، وتكلفة الاستحواذ على المريض، والتفاعل عبر قنوات التواصل، لنبني قراراتنا على الأرقام فقط.',
      aEn: 'Transparency is our core standard. We share monthly performance digests tracking validated booking numbers, cost-per-inquiry benchmarks, and organic web visitors.'
    },
    {
      qAr: 'ما هي قنوات ومنصات التواصل التي تديرونها؟',
      qEn: 'Which digital platforms and social networks do you manage?',
      aAr: 'ندير ونطلق الحملات على كافة المنصات النشطة للجمهور المستهدف بالمملكة: سناب شات، إنستغرام، تيك توك، إعلانات جوجل، وخرائط جوجل بالكامل.',
      aEn: 'We operate clinical funnels across snaps, maps, search engines, and target platforms in Saudi Arabia, matching surgical specialties with selective audience demographics.'
    }
  ];

  return (
    <>
      <Header />
      
      <main className={`flex-grow pt-32 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900 animate-fade-in`}>
        
        {/* FAQ Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center select-none">
          <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-lg mb-6 inline-block">
            {t('faq_badge', 'الأسئلة الشائعة')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
            {heading}
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </section>

        {/* Accordions List */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 select-none">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 glass-card p-6 rounded-2xl">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 mb-6 uppercase">
                {isRtl ? 'تصنيف الدعم' : 'Help categories'}
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-cyan-500 text-slate-950 font-bold transition-all text-xs text-right cursor-pointer">
                  <span>{t('faq_sidebar_title', 'جميع الاستفسارات')}</span>
                  <span className={`material-symbols-outlined text-sm ${isRtl ? 'rotate-180' : ''}`}>chevron_left</span>
                </button>
              </div>
            </div>
          </aside>

          {/* FAQ Accordion container */}
          <div className="lg:col-span-9 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const question = isRtl ? faq.qAr : faq.qEn;
              const answer = isRtl ? faq.aAr : faq.aEn;
              
              return (
                <div 
                  key={index}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="glass-card rounded-2xl p-6 hover:border-cyan-400/40 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="text-base md:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {question}
                    </h4>
                    <span className="material-symbols-outlined text-cyan-400 transition-transform duration-300 shrink-0 select-none">
                      {isOpen ? 'expand_less' : 'add'}
                    </span>
                  </div>
                  
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-white/5 text-slate-300 text-xs md:text-sm leading-relaxed animate-fade-in-slow">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Visual Callout block */}
            <div className="relative overflow-hidden rounded-2xl p-10 mt-12 bg-slate-950/60 border border-white/5 flex items-center justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10 max-w-lg">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  {t('faq_callout_title', 'نمو مبني على الحقائق والأرقام الطبية')}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  {t('faq_callout_desc', 'استرسال معايير نمونا يتبع بدقة لوائح خصوصية وممارسات وزارة الصحة لضمان سلامة الاسم المهني.')}
                </p>
              </div>
              <span className="material-symbols-outlined text-cyan-400/10 text-8xl shrink-0 hidden sm:block">
                analytics
              </span>
            </div>

          </div>

        </section>

        {/* Direct Callback CTA */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 select-none">
          <div className="glass-card rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 blur-[120px] -mr-48 -mt-48"></div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              {t('faq_cta_title', 'لديك استفسار آخر لم نقم بالإجابة عليه؟')}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
              {t('faq_cta_desc', 'مستشارو التسويق الطبي لدينا بالرياض جاهزون للإجابة على جميع استفساراتك بشكل مجاني ومباشر.')}
            </p>
            <Link 
              href={getHref('contact')} 
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-10 py-4.5 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg cursor-pointer"
            >
              {t('faq_cta_btn', 'تحدث مع خبير تسويق طبي الآن')}
            </Link>
          </div>
        </section>

      </main>
      
      <Footer />
      <FloatContacts />
    </>
  );
}
