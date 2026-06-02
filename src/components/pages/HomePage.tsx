'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function HomePage() {
  const { t, locale, data, loading } = useContent();

  const isRtl = locale === 'ar';

  // Dynamic branding or seed fallbacks
  const heroTitle = t('hero_title', 'Integrated Medical Growth for Your Clinic');
  const heroTagline = t('hero_tagline', 'Empowering healthcare providers and doctors with digital leadership and patient attraction under the highest clinical authority standards.');

  // Load from context database records
  const testimonials = data.testimonials.slice(0, 3);

  // Background Slideshow (3 Images + 1 Video)
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { type: 'image', url: data.content['hero_slide_1'] || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1920' },
    { type: 'image', url: data.content['hero_slide_2'] || 'https://images.unsplash.com/photo-1584515906207-52c616682c16?auto=format&fit=crop&q=80&w=1920' },
    { type: 'image', url: data.content['hero_slide_3'] || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1920' },
    { type: 'video', url: data.content['hero_bg_video'] || 'https://assets.mixkit.co/videos/preview/mixkit-medical-laboratory-researcher-analyzing-a-sample-40237-large.mp4' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  return (
    <>
      <Header />
      
      <main className={`flex-grow pt-20 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900 animate-fade-in`}>
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-10 pb-16 overflow-hidden">
          
          {/* Multi-Slide Backgrounds (3 Images + 1 Video) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            {slides.map((slide, idx) => {
              const isActive = activeSlide === idx;
              return (
                <div
                  key={`slide-${idx}`}
                  className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
                  style={{ opacity: isActive ? 0.25 : 0 }}
                >
                  {slide.type === 'image' ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.url})` }}
                    />
                  ) : (
                    slide.url && (
                      <video
                        src={slide.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  )}
                </div>
              );
            })}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020d1f]/30 via-[#020d1f]/65 to-[#020d1f]/95 z-0"></div>
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-400 opacity-[0.05] blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400 opacity-[0.03] blur-[120px] rounded-full"></div>
            
            {/* Floating Medical and Social Media Digital Icons */}
            <div className="absolute top-[18%] left-[10%] text-cyan-400/20 text-3xl md:text-4xl animate-float-diag-1 select-none pointer-events-none">
              <span className="material-symbols-outlined">stethoscope</span>
            </div>
            <div className="absolute top-[28%] right-[12%] text-cyan-400/15 text-2xl md:text-3xl animate-float-diag-2 select-none pointer-events-none">
              <span className="material-symbols-outlined">ads_click</span>
            </div>
            <div className="absolute bottom-[35%] left-[18%] text-cyan-400/25 text-3xl md:text-4xl animate-float-diag-3 select-none pointer-events-none">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div className="absolute bottom-[20%] right-[22%] text-cyan-400/20 text-3xl md:text-4xl animate-float-diag-1 select-none pointer-events-none">
              <span className="material-symbols-outlined">medical_information</span>
            </div>
            <div className="absolute top-[50%] left-[8%] text-cyan-400/15 text-2xl md:text-3xl animate-float-diag-2 select-none pointer-events-none">
              <span className="material-symbols-outlined">share</span>
            </div>
            <div className="absolute top-[45%] right-[8%] text-cyan-400/20 text-3xl md:text-4xl animate-float-diag-3 select-none pointer-events-none">
              <span className="material-symbols-outlined">clinical_notes</span>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left/Right Text Column depending on dir */}
            <div className={`lg:col-span-7 z-10 flex flex-col ${isRtl ? 'items-start text-right' : 'items-start text-left'}`}>
              <span className="inline-block px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 font-bold text-xs text-cyan-400 tracking-wider mb-6">
                {t('home_badge', 'الوكالة الأولى للتسويق الطبي في الرياض')}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.15]">
                {heroTitle}
              </h1>
              <p className="text-base md:text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
                {heroTagline}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${isRtl ? 'justify-start' : 'justify-start'}`}>
                <Link 
                  href={getHref('contact')} 
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-sm text-center hover:scale-[1.03] transition-transform duration-300 shadow-[0_0_30px_rgba(0,218,243,0.3)] cursor-pointer"
                >
                  {t('home_cta_primary', 'ابدأ في النمو الآن')}
                </Link>
                <Link 
                  href={getHref('portfolio')} 
                  className="border border-white/10 bg-slate-950/40 text-slate-200 px-8 py-4 rounded-xl font-bold text-sm text-center hover:bg-slate-900/60 hover:text-white transition-all cursor-pointer"
                >
                  {t('home_cta_secondary', 'عرض دراسات الحالة')}
                </Link>
              </div>
            </div>

            {/* Dashboard Mockups / Interactive Charts or custom image */}
            <div className="lg:col-span-5 relative w-full h-[520px] hidden md:block">
              {data.content['home_hero_image'] ? (
                <div className="w-full h-full p-2 bg-slate-900/80 border border-cyan-400/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,218,243,0.1)] overflow-hidden">
                  <img 
                    src={data.content['home_hero_image']} 
                    alt="Agency Hero" 
                    className="w-full h-full object-cover rounded-[2rem] hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              ) : (
                <>
                  {/* Floating Live Visitors Card */}
                  <div className="absolute top-0 right-0 w-64 p-6 glass-card rounded-2xl animate-float-slow select-none">
                    <div className="flex justify-between items-center mb-4">
                      <span className="material-symbols-outlined text-cyan-400 text-2xl">analytics</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{t('home_stats_roi_title', 'الوقت الفعلي')}</span>
                    </div>
                    <div className="h-32 flex items-end gap-2.5">
                      <div className="w-1/4 bg-cyan-400/20 h-1/2 rounded-md"></div>
                      <div className="w-1/4 bg-cyan-400/40 h-[70%] rounded-md"></div>
                      <div className="w-1/4 bg-cyan-400/60 h-[95%] rounded-md"></div>
                      <div className="w-1/4 bg-cyan-400 h-[65%] rounded-md"></div>
                    </div>
                    <p className="mt-4 text-xs font-semibold text-white text-center">
                      {t('home_stats_roi_value', '+142% عائد الاستثمار')}
                    </p>
                  </div>

                  {/* Dynamic Clinic Growth Metric Card */}
                  <div className="absolute top-[40%] -left-8 w-72 p-6 glass-card rounded-2xl shadow-2xl border-cyan-400/20 animate-float-delayed">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-cyan-400">search_insights</span>
                      </div>
                      <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                        <h4 className="text-xs font-bold text-white">{t('home_stats_seo_title', 'ظهور محركات البحث')}</h4>
                        <p className="text-[10px] text-slate-400">{t('home_stats_seo_value', 'أول 3 نتائج في الرياض')}</p>
                      </div>
                    </div>
                    <div className="h-28 bg-slate-950/50 rounded-xl overflow-hidden flex items-center justify-center text-xs text-slate-400 relative">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 to-transparent"></div>
                      <span className="z-10 font-mono text-cyan-400 text-lg font-bold">{t('home_stats_seo_sub', '+280% organic leads')}</span>
                    </div>
                  </div>

                  {/* Interactive Booking Scale */}
                  <div className="absolute bottom-4 right-6 w-56 p-5 glass-card rounded-2xl">
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-[10px] font-bold text-cyan-400">{t('home_stats_bookings_title', 'حجوزات المرضى')}</span>
                      <span className="material-symbols-outlined text-sm text-slate-400">more_vert</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-cyan-400 to-teal-400"></div>
                      </div>
                      <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full w-[62%] bg-cyan-400"></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {slides.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  activeSlide === idx ? 'bg-cyan-400 w-8 shadow-[0_0_12px_#00daf3]' : 'bg-slate-700/60 hover:bg-slate-500'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Partners Marquee / Monochrome Icons */}
        {(() => {
          let partners: { name: string; logo: string }[] = [];
          try {
            const rawJson = t('home_partners_json', '');
            if (rawJson) {
              partners = JSON.parse(rawJson);
            }
          } catch (e) {}
          if (!partners || partners.length === 0) {
            partners = [
              { name: 'Google Partners', logo: '' },
              { name: 'Meta Business', logo: '' },
              { name: 'TikTok Ads', logo: '' },
              { name: 'Snapchat Ads', logo: '' },
            ];
          }
          const marqueeClass = isRtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr';
          return (
            <section className="py-12 border-y border-cyan-400/8 bg-gradient-to-r from-[#020d1f] via-[#041428] to-[#020d1f] overflow-hidden select-none">
              <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6">
                <p className="text-center text-xs font-bold text-slate-400 tracking-wider">
                  {t('home_partners_title', 'قنوات وشراكات التسويق المعتمدة للعيادات')}
                </p>
              </div>
              
              <div className="relative w-full overflow-hidden flex">
                <div className={`flex gap-16 items-center whitespace-nowrap ${marqueeClass} duration-[30s] hover:[animation-play-state:paused] pointer-events-auto`}>
                  {/* First Set */}
                  {partners.map((partner, idx) => (
                    <div key={`p1-${idx}`} className="flex items-center gap-3 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="h-12 md:h-20 object-contain" />
                      ) : (
                        <span className="text-xl md:text-3xl font-black text-white tracking-wider font-mono">{partner.name}</span>
                      )}
                    </div>
                  ))}
                  {/* Duplicate Set for infinite loop */}
                  {partners.map((partner, idx) => (
                    <div key={`p2-${idx}`} className="flex items-center gap-3 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="h-12 md:h-20 object-contain" />
                      ) : (
                        <span className="text-xl md:text-3xl font-black text-white tracking-wider font-mono">{partner.name}</span>
                      )}
                    </div>
                  ))}
                  {/* Third Set */}
                  {partners.map((partner, idx) => (
                    <div key={`p3-${idx}`} className="flex items-center gap-3 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                      {partner.logo ? (
                        <img src={partner.logo} alt={partner.name} className="h-12 md:h-20 object-contain" />
                      ) : (
                        <span className="text-xl md:text-3xl font-black text-white tracking-wider font-mono">{partner.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-20 reveal-on-scroll">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {t('home_section_services_title', 'التسويق الطبي الدقيق')}
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                {t('home_section_services_desc', 'حلول نمو ذكية متكاملة مصممة خصيصاً لتخصص عيادتك الطبية في الرياض.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {[
                { key: 'identity', icon: 'medical_information', path: 'services/digital-medicalidentity', arName: 'الهوية الطبية', enName: 'Clinical Brand Identity', arDesc: 'صياغة علامة تجارية فاخرة عيادية توازن بين السلطة السريرية وقبول المرضى.', enDesc: 'Establishing elite healthcare visual identity that inspires trust and high-end authority.' },
                { key: 'social', icon: 'share_reviews', path: 'services/medical-socialmedia', arName: 'الاستراتيجية الاجتماعية', enName: 'Medical Social Content', arDesc: 'بناء مجتمعات المرضى من خلال محتوى تعليمي مرئي عالي القبول وذو عائد كبير.', enDesc: 'Growing patient engagement and clinic presence via clinical-authority visual posts.' },
                { key: 'seo', icon: 'travel_explore', path: 'services/medical-seo', arName: 'السيو الطبي', enName: 'Healthcare SEO', arDesc: 'السيطرة التامة على نتائج محركات البحث بالرياض للكلمات المفتاحية عالية النية وعياداتك.', enDesc: 'Dominating search results in Riyadh for high-value transactional clinical search phrases.' },
                { key: 'ads', icon: 'ads_click', path: 'services/paid-ads', arName: 'الإعلانات المستهدفة', enName: 'Targeted Patient Ads', arDesc: 'حملات إعلانية مدفوعة دقيقة تقلل من تكلفة جذب المريض وتملأ غرف الاستشارة.', enDesc: 'High-conversion paid campaigns on Meta & Google targeting verified active inquiries.' },
                { key: 'reputation', icon: 'verified', path: 'services/reputation-management', arName: 'إدارة السمعة الطبية', enName: 'Reputation Governance', arDesc: 'بناء وحماية المرجعية الرقمية للأطباء والعيادات وجمع تقييمات المرضى الإيجابية.', enDesc: 'Governing and expanding clinical stars, reviews, and professional credibility automatic tools.' },
                { key: 'web', icon: 'web', path: 'services/medical-website', arName: 'المواقع الطبية الفاخرة', enName: 'High-End Medical Web', arDesc: 'مواقع ويب طبية ذكية وسريعة متكاملة مع أنظمة الحجوزات ومتوافقة مع المعايير الطبية.', enDesc: 'Ultra-fast booking systems and interactive responsive interfaces with direct conversions.' }
              ].map((serv, idx) => {
                const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-100', 'delay-200', 'delay-300'];
                const delayClass = delays[idx] || '';
                return (
                  <div key={serv.key} className={`glass-card p-8 rounded-2xl group hover:-translate-y-2 select-none flex flex-col reveal-on-scroll ${delayClass}`}>
                    <div className="w-12 h-12 bg-cyan-400/10 border border-cyan-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-400 group-hover:text-slate-950 group-hover:border-transparent transition-all duration-300 text-cyan-400">
                      <span className="material-symbols-outlined text-2xl">{serv.icon}</span>
                    </div>
                    <h3 className={`text-xl font-bold text-white mb-3.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {isRtl ? serv.arName : serv.enName}
                    </h3>
                    <p className={`text-xs text-slate-400 leading-relaxed mb-6 flex-grow ${isRtl ? 'text-right' : 'text-left'}`}>
                      {isRtl ? serv.arDesc : serv.enDesc}
                    </p>
                    <Link 
                      href={getHref(serv.path)} 
                      className={`inline-flex items-center text-xs font-bold text-cyan-400 group-hover:text-white transition-colors gap-1.5 ${isRtl ? 'justify-start' : 'justify-start'}`}
                    >
                      {isRtl ? 'معرفة المزيد' : 'Learn More'}
                      <span className={`material-symbols-outlined text-sm ${isRtl ? 'rotate-180' : ''}`}>arrow_forward</span>
                    </Link>
                  </div>
                );
              })}

            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gradient-to-b from-transparent via-[#041428]/60 to-transparent overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
             {/* Visual graphics */}
            <div className="relative order-2 lg:order-1 flex justify-center reveal-scale">
              <div className="relative w-full max-w-lg md:max-w-xl aspect-square flex items-center justify-center transition-all duration-500">
                {data?.content?.['home_why_img'] ? (
                  <img
                    src={data.content['home_why_img']}
                    alt="Why Choose Us"
                    className="w-full h-full object-contain transition-all duration-700 hover:scale-105 animate-float-slow"
                  />
                ) : (
                  <span className="material-symbols-outlined text-8xl text-cyan-400/10 hover:text-cyan-400/20 hover:scale-110 transition-all duration-700">medical_services</span>
                )}
 
                {/* Years badge */}
                <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl select-none animate-bounce-subtle z-20">
                  <div className="text-cyan-400 text-3xl font-extrabold mb-1">{t('home_why_years_val', '12+')}</div>
                  <div className="text-white text-xs font-bold">{t('home_why_years_title', 'سنة من التخصص الطبي')}</div>
                </div>
              </div>
            </div>
 
            {/* Core Features */}
            <div className={`order-1 lg:order-2 flex flex-col ${isRtl ? 'items-start text-right' : 'items-start text-left'} reveal-on-scroll`}>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-3">
                {t('home_section_why_badge', 'لماذا Digital Health؟')}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 leading-tight">
                {t('home_section_why_title', 'لأن التسويق الطبي يحتاج شريك يفهم القطاع الصحي فعلاً وليس وكالة عامة.')}
              </h2>
              
              <div className="space-y-8 w-full">
                {[
                  { icon: 'psychology', titleKey: 'home_why_feat1_title', descKey: 'home_why_feat1_desc', titleDef: 'متخصصون في التسويق الطبي فقط', descDef: 'نفهم طريقة تفكير المرضى وما الذي يدفعهم للحجز والثقة' },
                  { icon: 'public', titleKey: 'home_why_feat2_title', descKey: 'home_why_feat2_desc', titleDef: 'خبرة بالسوق السعودي', descDef: 'نعرف المنافسة وسلوك المرضى وكيف تبني حضورًا طبيًا قويًا في السعودية' },
                  { icon: 'analytics', titleKey: 'home_why_feat3_title', descKey: 'home_why_feat3_desc', titleDef: 'قرارات مبنية على البيانات', descDef: 'كل حملة تعتمد على التحليل والأرقام لتحقيق نتائج قابلة للقياس' },
                  { icon: 'gavel', titleKey: 'home_why_feat4_title', descKey: 'home_why_feat4_desc', titleDef: 'التزام بالمعايير الطبية', descDef: 'نلتزم بأخلاقيات التسويق الطبي ونحافظ على مصداقية العلامة الطبية' },
                  { icon: 'track_changes', titleKey: 'home_why_feat5_title', descKey: 'home_why_feat5_desc', titleDef: 'استراتيجيات مخصصة لكل تخصص', descDef: 'لكل عيادة أو مركز طبي خطة تناسب تخصصه وأهدافه والجمهور المستهدف' }
                ].map((item, idx) => {
                  const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
                  const delayClass = delays[idx] || '';
                  return (
                    <div key={idx} className={`flex gap-4 items-start reveal-on-scroll ${delayClass}`}>
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-400">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                        <h4 className="text-base font-bold text-white mb-1.5">
                          {t(item.titleKey, item.titleDef)}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                          {t(item.descKey, item.descDef)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* How We Work Section (منهجية العمل) */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 border-t border-cyan-400/8">
          <div className="text-center mb-16 reveal-on-scroll">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-3 block">
              {isRtl ? 'منهجية العمل' : 'HOW WE WORK'}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {isRtl ? 'نعتمد على منهجية واضحة' : 'We Rely on a Clear Methodology'}
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {isRtl 
                ? 'تحليل السوق والمنافسين، تحديد الجمهور المستهدف، بناء استراتيجية مخصصة لكل تخصص، تنفيذ الحملات، وقياس الأداء وتحسينه باستمرار.' 
                : 'Market analysis, target audience definition, custom strategy design, campaign execution, and continuous optimization.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { num: '1', titleAr: 'تحليل السوق والمنافسين', titleEn: 'Market & Competitor Analysis', descAr: 'دراسة السوق ومنافسيك لتحديد الفجوات والفرص المتاحة.', descEn: 'Studying the local market and direct competitors to locate gaps and opportunities.' },
              { num: '2', titleAr: 'تحديد الجمهور المستهدف (المرضى)', titleEn: 'Targeting Patients', descAr: 'تحديد شريحة المرضى المثالية وسلوكهم واحتياجاتهم الطبية.', descEn: 'Defining selective target patient personas and their specific medical needs.' },
              { num: '3', titleAr: 'بناء استراتيجية مخصصة لكل تخصص', titleEn: 'Specialty Strategy', descAr: 'تصميم خطة تسويقية فريدة تناسب عيادتك وتخصصك الطبي وأهدافك.', descEn: 'Designing a custom healthcare growth blueprint matching your clinic and specialty.' },
              { num: '4', titleAr: 'تنفيذ الحملات', titleEn: 'Campaign Execution', descAr: 'إطلاق الإعلانات وصناعة المحتوى وتهيئة السيو بأعلى المعايير المهنية.', descEn: 'Launching compliant paid funnels, custom copy, and SEO schemas.' },
              { num: '5', titleAr: 'قياس الأداء وتحسينه باستمرار', titleEn: 'Optimize & Scale', descAr: 'متابعة مؤشرات الأداء والتحليلات لزيادة عائد الاستثمار ونمو الحجوزات.', descEn: 'Analyzing clinical metrics and scaling profitable acquisition channels.' }
            ].map((step, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl relative select-none flex flex-col group border border-white/5 hover:border-cyan-400/20 transition-all duration-300">
                <div className="absolute top-4 right-4 text-5xl font-black text-cyan-400/10 group-hover:text-cyan-400/20 transition-colors font-mono">
                  {step.num}
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-6 font-mono font-black text-sm relative z-10">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-2 relative z-10">
                  {isRtl ? step.titleAr : step.titleEn}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed relative z-10">
                  {isRtl ? step.descAr : step.descEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Digital Marketing Section */}
        <section className="py-24 bg-gradient-to-b from-[#041428]/40 to-transparent border-t border-cyan-400/8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`${isRtl ? 'text-right' : 'text-left'} space-y-6`}>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                {isRtl ? 'لماذا التسويق الرقمي الطبي؟' : 'WHY MEDICAL DIGITAL MARKETING?'}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                {isRtl 
                  ? 'النجاح اليوم في القطاع الصحي يعتمد على الظهور الرقمي الذكي وليس فقط السمعة التقليدية.'
                  : 'Success in healthcare today depends on smart digital presence, not just traditional reputation.'}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="glass-card p-8 rounded-2xl border border-white/5 flex gap-4 items-start hover:border-cyan-400/20 transition-all">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {isRtl ? 'البحث عن الأطباء عبر الإنترنت' : 'Patients Research Online'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isRtl 
                      ? 'المرضى يبحثون عبر الإنترنت قبل الحجز والمنافسة عالية في الرياض.'
                      : 'Patients research online before booking and competition in Riyadh is highly intense.'}
                  </p>
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl border border-white/5 flex gap-4 items-start hover:border-cyan-400/20 transition-all">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-400">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {isRtl ? 'بناء الثقة الرقمية والمصداقية' : 'Building Trust & Authority'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isRtl 
                      ? 'التواجد الرقمي يزيد الثقة والمصداقية والتسويق الرقمي يجذب المرضى المناسبين بدقة.'
                      : 'Digital presence increases trust and credibility, while digital marketing targets and attracts the right patients accurately.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-cyan-400/8 bg-gradient-to-r from-[#020d1f] via-[#041630]/80 to-[#020d1f] select-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="reveal-scale delay-100">
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">{t('home_stat1_val', '250%')}</div>
                <p className="text-xs font-bold text-slate-300">{t('home_stat1_desc', 'متوسط زيادة عائد الاستثمار')}</p>
              </div>
              <div className="reveal-scale delay-200">
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">{t('home_stat2_val', '15K+')}</div>
                <p className="text-xs font-bold text-slate-300">{t('home_stat2_desc', 'مريض جديد محتمل شهرياً')}</p>
              </div>
              <div className="reveal-scale delay-300">
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">{t('home_stat3_val', '85+')}</div>
                <p className="text-xs font-bold text-slate-300">{t('home_stat3_desc', 'عيادة ومركز نثق به بالرياض')}</p>
              </div>
              <div className="reveal-scale delay-400">
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">{t('home_stat4_val', '12+')}</div>
                <p className="text-xs font-bold text-slate-300">{t('home_stat4_desc', 'سنة خبرة متخصصة')}</p>
              </div>
            </div>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="text-center mb-16 reveal-on-scroll">
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-3 block">
                  {t('home_testimonials_badge', 'تقييمات الأطباء')}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  {t('home_testimonials_title', 'ماذا يقول شركاؤنا من الأطباء والعيادات')}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((tItem: any, idx: number) => {
                  const delays = ['delay-100', 'delay-200', 'delay-300'];
                  const delayClass = delays[idx] || '';
                  return (
                    <div key={idx} className={`glass-card p-8 rounded-2xl border-cyan-400/10 flex flex-col justify-between hover:border-cyan-400/30 transition-all duration-300 reveal-on-scroll ${delayClass}`}>
                      <div>
                        <div className="flex text-cyan-400 mb-6 justify-start">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                        </div>
                        <p className={`text-sm text-slate-300 leading-relaxed italic mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                          "{isRtl ? tItem.quote_ar : (tItem.quote_en || tItem.quote_ar)}"
                        </p>
                      </div>
                      
                      <div className={`flex items-center gap-4 ${isRtl ? 'justify-start' : 'justify-start'}`}>
                        {tItem.image ? (
                          <img className="w-12 h-12 rounded-full object-cover border border-cyan-400/20" src={tItem.image} alt={tItem.name_ar} />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
                            {isRtl ? tItem.name_ar[0] : (tItem.name_en ? tItem.name_en[0] : 'Dr')}
                          </div>
                        )}
                        <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                          <h5 className="text-sm font-bold text-white">{isRtl ? tItem.name_ar : (tItem.name_en || tItem.name_ar)}</h5>
                          <p className="text-[10px] text-slate-400">{isRtl ? tItem.title_ar : (tItem.title_en || tItem.title_ar)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic CTA */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden p-12 md:p-20 text-center border border-white/5 reveal-scale">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-950/20 to-transparent"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                  {t('home_cta_title', 'هل أنت مستعد لمضاعفة نمو عيادتك؟')}
                </h2>
                <p className="text-sm md:text-base text-slate-400 mb-10 max-w-xl mx-auto">
                  {t('home_cta_desc', 'احجز جلستك الاستشارية الطبية المجانية الآن، وسيقوم فريقنا بتدقيق ظهورك وتحديد قنوات نموك.')}
                </p>
                <Link 
                  href={getHref('contact')} 
                  className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-10 py-4.5 rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl"
                >
                  {t('home_cta_btn', 'احصل على تدقيق مجاني الآن')}
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
