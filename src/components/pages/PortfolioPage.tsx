'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function PortfolioPage() {
  const { t, locale, data, loading } = useContent();
  const [activeCategory, setActiveCategory] = useState('all');

  const isRtl = locale === 'ar';

  const heading = t('portfolio_title', 'شاهد نجاحات شركائنا في القطاع الصحي');
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

  // Helper mapping to categorize custom database items
  const getCategoryKey = (catEn: string = '', catAr: string = ''): string => {
    const normEn = (catEn || '').toLowerCase();
    const normAr = (catAr || '');
    if (normEn.includes('social') || normAr.includes('سوشيال') || normAr.includes('ميديا')) return 'social';
    if (normEn.includes('web') || normEn.includes('design') || normAr.includes('موقع') || normAr.includes('تصميم')) return 'web';
    if (normEn.includes('ad') || normEn.includes('camp') || normAr.includes('إعلان') || normAr.includes('حمل')) return 'ads';
    if (normEn.includes('seo') || normAr.includes('سيو') || normAr.includes('محرك')) return 'seo';
    if (normEn.includes('brand') || normEn.includes('identity') || normAr.includes('هوية') || normAr.includes('شعار')) return 'branding';
    return 'branding';
  };

  const getCategoryIcon = (categoryKey: string): string => {
    switch (categoryKey) {
      case 'social': return 'share_reviews';
      case 'web': return 'devices';
      case 'ads': return 'ads_click';
      case 'seo': return 'search_insights';
      case 'branding': return 'fingerprint';
      default: return 'star_half';
    }
  };

  // Convert raw database items to page-compatible items
  const dbPortfolio = data.portfolio || [];
  
  // High-quality static fallbacks just in case the database is empty or loading
  const staticFallbacks = [
    {
      title_ar: 'بناء الهوية البصرية لمجمع نخبة الطبي',
      title_en: 'Visual Branding for Al-Nokhba Medical Center',
      cat_ar: 'هوية بصرية',
      cat_en: 'Brand Identity',
      metric_ar: 'زيادة +150% ثقة وهيبة حضور',
      metric_en: 'Result: +150% local prestige rate',
      image: '',
    },
    {
      title_ar: 'تحسين محركات البحث لعيادات الأسنان بالرياض',
      title_en: 'Clinical SEO Dominance for Riyadh Dentistry',
      cat_ar: 'السيو الطبي',
      cat_en: 'Clinical SEO',
      metric_ar: 'تصدر 12 كلمة رئيسية حجوزات',
      metric_en: 'Result: Top-3 positions for 12 primary keywords',
      image: '',
    },
    {
      title_ar: 'إدارة محتوى طبي لعيادة جراحة تجميلية',
      title_en: 'Premium Content Strategy for Aesthetics Clinic',
      cat_ar: 'سوشيال ميديا',
      cat_en: 'Social Media',
      metric_ar: '50 ألف تفاعل مريض حقيقي',
      metric_en: 'Result: 50k+ active target views',
      image: '',
    }
  ];

  const rawItems = dbPortfolio.length > 0 ? dbPortfolio : staticFallbacks;

  const mappedItems = rawItems.map((item: any) => {
    const catKey = getCategoryKey(item.cat_en, item.cat_ar);
    return {
      category: catKey,
      icon: getCategoryIcon(catKey),
      titleAr: item.title_ar,
      titleEn: item.title_en,
      descAr: item.title_ar + ' - تم تخطيط الحملة وتفعيل قنوات التسويق والبحث الجغرافي بالرياض بنجاح تام وفق متطلبات وزارة الصحة.',
      descEn: item.title_en + ' - Executed clinic roadmap, digital targeting strategies, and full compliance optimization under Riyadh health guidelines.',
      resultAr: item.metric_ar,
      resultEn: item.metric_en,
      serviceAr: item.cat_ar,
      serviceEn: item.cat_en,
      image: item.image
    };
  });

  const filteredItems = mappedItems.filter((item: any) => 
    activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <>
      <Header />
      
      <main className={`flex-grow pt-32 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900 animate-fade-in`}>
        
        {/* Portfolio Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center select-none">
          <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-lg mb-6 inline-block">
            {t('portfolio_badge', 'معرض نجاحاتنا')}
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-cyan-400 animate-pulse text-xs font-bold gap-3">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>جاري تحميل دراسات ومؤشرات النجاح الطبية...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold select-none">
              {isRtl ? 'لا يوجد دراسات حالة في هذا القسم حالياً' : 'No clinical cases in this category currently.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item: any, idx: number) => {
                const title = isRtl ? item.titleAr : item.titleEn;
                const desc = isRtl ? item.descAr : item.descEn;
                const result = isRtl ? item.resultAr : item.resultEn;
                const service = isRtl ? item.serviceAr : item.serviceEn;
                
                return (
                  <div 
                    key={idx} 
                    className="glass-card rounded-2xl overflow-hidden group hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,218,243,0.1)] transition-all duration-300 flex flex-col select-none border border-white/5 bg-slate-900/60"
                  >
                    <div className="aspect-video w-full bg-slate-950/60 flex items-center justify-center relative overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-cyan-400/20 text-7xl group-hover:scale-110 group-hover:text-cyan-400/35 transition-all">
                          {item.icon}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded">
                            {service}
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
          )}
        </section>

        {/* Action Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="glass-card rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,218,243,0.1),transparent)]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                {t('portfolio_cta_title', 'مستعد لتحقيق نفس نتائج النمو الطبي؟')}
              </h2>
              <p className="max-w-xl mx-auto text-slate-400 mb-12">
                {t('portfolio_cta_desc', 'دعنا نصمم لك الخطة التسويقية الملائمة لتخصص عيادتك ونبدأ رحلة النمو اليوم.')}
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
