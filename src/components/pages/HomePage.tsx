'use client';

import React from 'react';
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
  const seoKeywords = t('seo_keywords', 'medical marketing, clinic marketing, medical seo');

  // Load from context database records
  const testimonials = data.testimonials.slice(0, 3);
  const articles = data.articles.slice(0, 2);
  const portfolio = data.portfolio.slice(0, 3);

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-20 overflow-x-hidden text-right selection:bg-cyan-500 selection:text-slate-900">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-10 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-400 opacity-[0.05] blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400 opacity-[0.03] blur-[120px] rounded-full"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left/Right Text Column depending on dir */}
            <div className={`lg:col-span-7 z-10 flex flex-col ${isRtl ? 'items-start text-right' : 'items-start text-left'}`}>
              <span className="inline-block px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 font-bold text-xs text-cyan-400 tracking-wider mb-6">
                {isRtl ? 'الوكالة الأولى للتسويق الطبي في الرياض' : 'Riyadh\'s Premier Medical Marketing Agency'}
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
                  {isRtl ? 'ابدأ في النمو الآن' : 'Start Growing Now'}
                </Link>
                <Link 
                  href={getHref('portfolio')} 
                  className="border border-white/10 bg-slate-950/40 text-slate-200 px-8 py-4 rounded-xl font-bold text-sm text-center hover:bg-slate-900/60 hover:text-white transition-all cursor-pointer"
                >
                  {isRtl ? 'عرض دراسات الحالة' : 'View Case Studies'}
                </Link>
              </div>
            </div>

            {/* Dashboard Mockups / Interactive Charts */}
            <div className="lg:col-span-5 relative w-full h-[520px] hidden md:block">
              {/* Floating Live Visitors Card */}
              <div className="absolute top-0 right-0 w-64 p-6 glass-card rounded-2xl animate-float-slow select-none">
                <div className="flex justify-between items-center mb-4">
                  <span className="material-symbols-outlined text-cyan-400 text-2xl">analytics</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{isRtl ? 'الوقت الفعلي' : 'Realtime Analytics'}</span>
                </div>
                <div className="h-32 flex items-end gap-2.5">
                  <div className="w-1/4 bg-cyan-400/20 h-1/2 rounded-md"></div>
                  <div className="w-1/4 bg-cyan-400/40 h-[70%] rounded-md"></div>
                  <div className="w-1/4 bg-cyan-400/60 h-[95%] rounded-md"></div>
                  <div className="w-1/4 bg-cyan-400 h-[65%] rounded-md"></div>
                </div>
                <p className="mt-4 text-xs font-semibold text-white text-center">
                  {isRtl ? '+142% عائد الاستثمار' : '+142% Patient Retention Return'}
                </p>
              </div>

              {/* Dynamic Clinic Growth Metric Card */}
              <div className="absolute top-[40%] -left-8 w-72 p-6 glass-card rounded-2xl shadow-2xl border-cyan-400/20">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-cyan-400">search_insights</span>
                  </div>
                  <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                    <h4 className="text-xs font-bold text-white">{isRtl ? 'ظهور محركات البحث' : 'SEO Ranking Authority'}</h4>
                    <p className="text-[10px] text-slate-400">{isRtl ? 'أول 3 نتائج في الرياض' : 'Top 3 positions Riyadh'}</p>
                  </div>
                </div>
                <div className="h-28 bg-slate-950/50 rounded-xl overflow-hidden flex items-center justify-center text-xs text-slate-400 relative">
                  {/* Subtle Vector grid mock */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 to-transparent"></div>
                  <span className="z-10 font-mono text-cyan-400 text-lg font-bold">+280% organic leads</span>
                </div>
              </div>

              {/* Interactive Booking Scale */}
              <div className="absolute bottom-4 right-6 w-56 p-5 glass-card rounded-2xl">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-bold text-cyan-400">{isRtl ? 'حجوزات المرضى' : 'Active Consult bookings'}</span>
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
            </div>

          </div>
        </section>

        {/* Partners Marquee / Monochrome Icons */}
        <section className="py-12 border-y border-white/5 bg-slate-950/30 select-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <p className="text-center text-xs font-bold text-slate-400 tracking-wider mb-8">
              {isRtl ? 'قنوات وشراكات التسويق المعتمدة للعيادات' : 'OFFICIALLY APPROVED MARKETING CHANNELS'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:opacity-50 transition-opacity">
              <span className="text-lg md:text-2xl font-extrabold text-white font-mono">Google Partners</span>
              <span className="text-lg md:text-2xl font-extrabold text-white font-mono">Meta Business</span>
              <span className="text-lg md:text-2xl font-extrabold text-white font-mono">TikTok Ads</span>
              <span className="text-lg md:text-2xl font-extrabold text-white font-mono">Snapchat Ads</span>
            </div>
          </div>
        </section>

        {/* Dynamic Services grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {isRtl ? 'التسويق الطبي الدقيق' : 'Precision Clinical Marketing'}
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                {isRtl ? 'حلول نمو ذكية متكاملة مصممة خصيصاً لتخصص عيادتك الطبية في الرياض.' : 'Modular strategic growth solutions engineered specifically for healthcare institutions.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Dynamic services from original site */}
              {[
                { key: 'identity', icon: 'medical_information', path: 'services/identity', arName: 'الهوية الطبية', enName: 'Clinical Brand Identity', arDesc: 'صياغة علامة تجارية فاخرة عيادية توازن بين السلطة السريرية وقبول المرضى.', enDesc: 'Establishing elite healthcare visual identity that inspires trust and high-end authority.' },
                { key: 'social', icon: 'share_reviews', path: 'services/social', arName: 'الاستراتيجية الاجتماعية', enName: 'Medical Social Content', arDesc: 'بناء مجتمعات المرضى من خلال محتوى تعليمي مرئي عالي القبول وذو عائد كبير.', enDesc: 'Growing patient engagement and clinic presence via clinical-authority visual posts.' },
                { key: 'seo', icon: 'travel_explore', path: 'services/seo', arName: 'السيو الطبي', enName: 'Healthcare SEO', arDesc: 'السيطرة التامة على نتائج محركات البحث بالرياض للكلمات المفتاحية عالية النية وعياداتك.', enDesc: 'Dominating search results in Riyadh for high-value transactional clinical search phrases.' },
                { key: 'ads', icon: 'ads_click', path: 'services/ppc', arName: 'الإعلانات المستهدفة', enName: 'Targeted Patient Ads', arDesc: 'حملات إعلانية مدفوعة دقيقة تقلل من تكلفة جذب المريض وتملأ غرف الاستشارة.', enDesc: 'High-conversion paid campaigns on Meta & Google targeting verified active inquiries.' },
                { key: 'reputation', icon: 'verified', path: 'services/reputation', arName: 'إدارة السمعة الطبية', enName: 'Reputation Governance', arDesc: 'بناء وحماية المرجعية الرقمية للأطباء والعيادات وجمع تقييمات المرضى الإيجابية.', enDesc: 'Governing and expanding clinical stars, reviews, and professional credibility automatic tools.' },
                { key: 'web', icon: 'web', path: 'services/web', arName: 'المواقع الطبية الفاخرة', enName: 'High-End Medical Web', arDesc: 'مواقع ويب طبية ذكية وسريعة متكاملة مع أنظمة الحجوزات ومتوافقة مع المعايير الطبية.', enDesc: 'Ultra-fast booking systems and interactive responsive interfaces with direct conversions.' }
              ].map((serv) => (
                <div key={serv.key} className="glass-card p-8 rounded-2xl group hover:-translate-y-2 select-none flex flex-col">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors duration-300 text-cyan-400">
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
              ))}

            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-slate-950/30 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Visual graphics */}
            <div className="relative order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-950/40 to-slate-950 flex items-center justify-center border border-white/5 group hover:border-cyan-400/20 transition-all duration-500">
                <span className="material-symbols-outlined text-8xl text-cyan-400/10 group-hover:text-cyan-400/20 group-hover:scale-110 transition-all duration-700">medical_services</span>
                
                {/* Years badge */}
                <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl select-none">
                  <div className="text-cyan-400 text-3xl font-extrabold mb-1">12+</div>
                  <div className="text-white text-xs font-bold">{isRtl ? 'سنة من التخصص الطبي' : 'Years of Healthcare Focus'}</div>
                </div>
              </div>
            </div>

            {/* Core Features */}
            <div className={`order-1 lg:order-2 flex flex-col ${isRtl ? 'items-start text-right' : 'items-start text-left'}`}>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-3">
                {isRtl ? 'ما يميز عيادتنا' : 'Clinical Advantage'}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 leading-tight">
                {isRtl ? 'نتحدث لغة الطب، وننفذ أسرع استراتيجيات النمو.' : 'We speak clinical science, and deliver organic growth.'}
              </h2>
              
              <div className="space-y-8 w-full">
                {[
                  { icon: 'biotech', titleAr: 'التوجيه العلمي القائم على التحليلات', titleEn: 'Data & Scientific Analytics Direction', descAr: 'نحن لا نخمن عشوائياً. نستخدم تحليلات دقيقة لتحديد المرضى ذوي الرغبة الحقيقية في العلاج بمركزك.', descEn: 'We bypass guesses. We employ prescriptive patient modeling to target the right specialties.' },
                  { icon: 'gavel', titleAr: 'الامتثال القانوني الصحي التام', titleEn: 'Full Healthcare Compliance Assurance', descAr: 'كل حملة نطلقها متوافقة 100% مع أنظمة وزارة الصحة السعودية ولوائح خصوصية البيانات الطبية للمريض.', descEn: 'Every creative element aligns perfectly with the Saudi MOH regulations and international healthcare privacy.' },
                  { icon: 'award_star', titleAr: 'خبرة عيادية سريرية حصرية', titleEn: 'Exclusive Clinical Specialization', descAr: 'نحن لا نعمل في مجالات المطاعم أو البيع بالتجزئة. تركيزنا حصري 100% على الأطباء والعيادات فقط.', descEn: 'Unlike generic creative agencies, we work 100% on medical, knowing the exact patient journey.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-400">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        {isRtl ? item.titleAr : item.titleEn}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                        {isRtl ? item.descAr : item.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Real-time stats */}
        <section className="py-20 border-y border-white/5 bg-slate-950/50 select-none">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">250%</div>
                <p className="text-xs font-bold text-slate-300">{isRtl ? 'متوسط زيادة عائد الاستثمار' : 'Average ROI Increase'}</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">15K+</div>
                <p className="text-xs font-bold text-slate-300">{isRtl ? 'مريض جديد محتمل شهرياً' : 'Monthly Patient Leads'}</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">85+</div>
                <p className="text-xs font-bold text-slate-300">{isRtl ? 'عيادة ومركز نثق به بالرياض' : 'Trusted Elite Clinics'}</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-2">12+</div>
                <p className="text-xs font-bold text-slate-300">{isRtl ? 'سنة خبرة متخصصة' : 'Years Clinical Experience'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="text-center mb-16">
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase mb-3 block">
                  {isRtl ? 'تقييمات الأطباء' : 'Trusted by Elite Doctors'}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                  {isRtl ? 'ماذا يقول شركاؤنا من الأطباء والعيادات' : 'Clinic Success Stories & Patient Conversions'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((tItem: any, idx: number) => (
                  <div key={idx} className="glass-card p-8 rounded-2xl border-cyan-400/10 flex flex-col justify-between">
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
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic CTA */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden p-12 md:p-20 text-center border border-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-950/20 to-transparent"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                  {isRtl ? 'هل أنت مستعد لمضاعفة نمو عيادتك؟' : 'Ready to Double Your Patient Flow?'}
                </h2>
                <p className="text-sm md:text-base text-slate-400 mb-10 max-w-xl mx-auto">
                  {isRtl ? 'احجز جلستك الاستشارية الطبية المجانية الآن، وسيقوم فريقنا بتدقيق ظهورك وتحديد قنوات نموك.' : 'Book a 30-minute free diagnostic audit. We will analyze your search presence and deliver a clear patient attraction plan.'}
                </p>
                <Link 
                  href={getHref('contact')} 
                  className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-10 py-4.5 rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl"
                >
                  {isRtl ? 'احصل على تدقيق مجاني الآن' : 'Claim Your Free Audit Now'}
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
