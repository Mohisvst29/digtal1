'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function PortfolioPage() {
  const { t, locale } = useContent();
  const [activeCategory, setActiveCategory] = useState('all');

  const isRtl = locale === 'ar';

  const heading = t('portfolio_heading', 'شاهد نجاحات شركائنا في القطاع الصحي');
  const description = t('portfolio_description', 'نترجم التميز الطبي لعملائنا إلى نتائج رقمية ملموسة وقابلة للقياس بالرياض. استكشف أبرز قصص النجاح.');

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  const categories = [
    { key: 'all', ar: 'الكل', en: 'All' },
    { key: 'social', ar: 'سوشيال ميديا', en: 'Social Media' },
    { key: 'web', ar: 'موقع إلكتروني', en: 'Web Design' },
    { key: 'ads', ar: 'إعلانات ممولة', en: 'Paid Ads' },
    { key: 'seo', ar: 'السيو الطبي', en: 'Clinical SEO' },
    { key: 'branding', ar: 'هوية بصرية', en: 'Brand Identity' }
  ];

  const portfolioItems = [
    {
      category: 'branding',
      icon: 'fingerprint',
      titleAr: 'بناء الهوية البصرية لمجمع نخبة الطبي',
      titleEn: 'Visual Branding for Al-Nokhba Medical Center',
      descAr: 'تصميم شعار فريد وتنسيق ألوان يعبر عن الكفاءة الطبية مع خطوط فخمة مريحة لتجربة المرضى البصرية.',
      descEn: 'Designing a premium clinical logo system and typography package depicting clinical precision and patient care.',
      resultAr: 'النتيجة: +150% ثقة وهيبة حضور',
      resultEn: 'Result: +150% local prestige rate',
      serviceAr: 'تصميم هوية كاملة',
      serviceEn: 'Complete Identity Suite'
    },
    {
      category: 'seo',
      icon: 'search_insights',
      titleAr: 'تحسين محركات البحث لعيادات الأسنان بالرياض',
      titleEn: 'Clinical SEO Dominance for Riyadh Dentistry',
      descAr: 'رفع ترتيب العيادة في محرك بحث جوجل لاستقطاب الباحثين عن خدمات زراعة وتقويم الأسنان في شمال الرياض.',
      descEn: 'Scaling organic search rankings for selective dermatology and implant surgery patients in Riyadh.',
      resultAr: 'النتيجة: تصدر 12 كلمة رئيسية حجوزات',
      resultEn: 'Result: Top-3 positions for 12 primary keywords',
      serviceAr: 'السيو الطبي شامل',
      serviceEn: 'Total Practice SEO'
    },
    {
      category: 'social',
      icon: 'share_reviews',
      titleAr: 'إدارة محتوى طبي لعيادة جراحة تجميلية',
      titleEn: 'Premium Content Strategy for Aesthetics Clinic',
      descAr: 'إنتاج محتوى فيديو قصير وتثقيفي موثوق وجذاب لتبسيط إجراءات نحت الجسم والعمليات عبر ريلز وتيك توك.',
      descEn: 'Directing and publishing MOH-compliant surgical review reels and expert clips on TikTok.',
      resultAr: 'النتيجة: 50 ألف تفاعل مريض حقيقي',
      resultEn: 'Result: 50k+ active target views',
      serviceAr: 'صناعة وإدارة السوشيال ميديا',
      serviceEn: 'Social Media Governance'
    },
    {
      category: 'web',
      icon: 'devices',
      titleAr: 'تصميم وبرمجة موقع مستشفى تخصصي',
      titleEn: 'Modern Next.js Portal for Specialty Hospital',
      descAr: 'تطوير منصة رقمية متطورة للغاية متوافقة مع تجربة المريض، مزودة بنظام حجز مواعيد فوري وسريع التصفح.',
      descEn: 'Architecting an ultra-fast patient scheduler, service profiles, and full medical team profiles.',
      resultAr: 'النتيجة: حجز 340 موعد شهرياً',
      resultEn: 'Result: 340+ verified bookings/month',
      serviceAr: 'تصميم المواقع والتطبيقات الطبية',
      serviceEn: 'Clinical Web Development'
    },
    {
      category: 'ads',
      icon: 'ads_click',
      titleAr: 'حملات إعلانات عيادات الجلدية والليزر بالرياض',
      titleEn: 'Paid Acquisition for Dermatology Center',
      descAr: 'إعلانات سناب شات وجوجل ممولة ذكية تستهدف العروض الخاصة لجذب المريض المناسب بأقل تكلفة تحويل.',
      descEn: 'Deploying high-intent search ads and interactive geo-fenced social maps tags in Riyadh.',
      resultAr: 'النتيجة: 4.5 أضعاف العائد الإعلاني',
      resultEn: 'Result: 4.5x direct return on ad spend',
      serviceAr: 'الإعلانات الممولة والاستهداف المباشر',
      serviceEn: 'Paid Target Leads'
    },
    {
      category: 'branding',
      icon: 'star_half',
      titleAr: 'إعادة بناء السمعة الطبية لمركز تغذية علاجية',
      titleEn: 'Reputation Shield for Clinical Nutrition Group',
      descAr: 'إدارة التقييمات وآراء المرضى وتعديل الهوية الرقمية للمركز لبناء ثقة راسخة مع المراجعين الجدد.',
      descEn: 'Automating post-discharge SMS rating requests to drive positive maps score to stellar heights.',
      resultAr: 'النتيجة: 4.9 تقييم على خرائط جوجل',
      resultEn: 'Result: 4.9 stars Google maps rating',
      serviceAr: 'إدارة السيرة الطبية والسمعة',
      serviceEn: 'Patient Stars Governance'
    }
  ];

  const filteredItems = portfolioItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-32 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
        
        {/* Portfolio Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center select-none">
          <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-lg mb-6 inline-block">
            {isRtl ? 'معرض نجاحاتنا' : 'Clinical Portfolio'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
            {heading}
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </section>

        {/* Filter Categories */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12 select-none">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const label = isRtl ? cat.ar : cat.en;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-cyan-400/30 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => {
              const title = isRtl ? item.titleAr : item.titleEn;
              const desc = isRtl ? item.descAr : item.descEn;
              const result = isRtl ? item.resultAr : item.resultEn;
              const service = isRtl ? item.serviceAr : item.serviceEn;
              
              return (
                <div 
                  key={idx} 
                  className="glass-card rounded-2xl overflow-hidden group hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,218,243,0.1)] transition-all duration-300 flex flex-col select-none"
                >
                  <div className="aspect-video w-full bg-slate-950/60 flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-cyan-400/20 text-7xl group-hover:scale-110 group-hover:text-cyan-400/35 transition-all">
                      {item.icon}
                    </span>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded">
                          {isRtl ? categories.find(c => c.key === item.category)?.ar : categories.find(c => c.key === item.category)?.en}
                        </span>
                        <span className="text-[10px] font-bold text-teal-400">{result}</span>
                      </div>
                      
                      <h4 className={`text-base md:text-lg font-bold text-white mb-2.5 leading-tight ${isRtl ? 'text-right' : 'text-left'}`}>
                        {title}
                      </h4>
                      
                      <p className={`text-xs md:text-sm text-slate-400 leading-relaxed mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>{isRtl ? `الخدمة: ${service}` : `Service: ${service}`}</span>
                      <Link href={getHref('contact')} className="text-cyan-400 hover:text-white cursor-pointer transition-colors">
                        {isRtl ? 'طلب استشارة مماثلة' : 'Request Case Audit'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="glass-card rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,218,243,0.1),transparent)]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                {isRtl ? 'مستعد لتحقيق نفس نتائج النمو الطبي؟' : 'Ready to Attain Similar Clinic Scale?'}
              </h2>
              <p className="max-w-xl mx-auto text-slate-400 mb-12">
                {isRtl 
                  ? 'دعنا نصمم لك الخطة التسويقية الملائمة لتخصص عيادتك ونبدأ رحلة النمو اليوم.' 
                  : 'Let us engineer custom clinical funnels optimized perfectly for Riyadh healthcare.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  href={getHref('contact')} 
                  className="px-10 py-4.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,218,243,0.3)] text-sm cursor-pointer"
                >
                  {isRtl ? 'احجز استشارتك المجانية الآن' : 'Book Free Diagnostic Consultation'}
                </Link>
                <Link 
                  href={getHref('services')} 
                  className="px-10 py-4.5 border border-white/10 bg-slate-950/40 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors text-sm cursor-pointer"
                >
                  {isRtl ? 'استكشف خدماتنا بالتفصيل' : 'View Full Services Map'}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
      <FloatContacts />
    </>
  );
}
