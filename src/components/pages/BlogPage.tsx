'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function BlogPage() {
  const { t, locale } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const isRtl = locale === 'ar';

  const heading = t('blog_heading', 'المدونة الطبية للنمو الرقمي');
  const description = t('blog_description', 'استكشف المقالات والمسودات التثقيفية لتمكين طبيبك أو مركزك الطبي من ريادة السوق بوعي والتزام بالمعايير الصحية.');

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  const categories = [
    { key: 'all', ar: 'كل المقالات', en: 'All Articles' },
    { key: 'branding', ar: 'الهوية الطبية', en: 'Medical Branding' },
    { key: 'seo', ar: 'سيو عيادات', en: 'Clinic SEO' },
    { key: 'social', ar: 'سوشيال ميديا', en: 'Social Content' },
    { key: 'rules', ar: 'أنظمة وقوانين', en: 'MOH Regulations' }
  ];

  const featuredPost = {
    category: 'featured',
    icon: 'biotech',
    titleAr: 'التسويق الطبي القائم على القيمة الحقيقية',
    titleEn: 'Value-Based Medical Marketing Framework',
    descAr: 'كيف تستقطب المرضى الحقيقيين لمركزك الطبي من خلال صياغة محتوى علمي مبسط يرفع مستويات الوعي بدلاً من الاعتماد الكلي على الترويج التجاري الفج.',
    descEn: 'How to acquire high-value clinical patients by engineering rich educational content rather than aggressive discounts.',
    authorAr: 'فريق خبراء ديجيتال هيلث',
    authorEn: 'Digital Health Clinical Growth Team',
    roleAr: 'مستشارو النمو الرقمي بالرياض',
    roleEn: 'Practice Scale Advisors'
  };

  const blogPosts = [
    {
      category: 'branding',
      icon: 'fingerprint',
      titleAr: 'أهمية الهوية الرقمية للأطباء والأخصائيين بالرياض',
      titleEn: 'The ROI of Custom Medical Brand for Specialists',
      descAr: 'توضح هذه المسودة كيف يسهم البراند الشخصي المحترف للطبيب في زيادة معدل ثقة المرضى بنسبة 80%، وتحويل زوار الموقع لمرضى دائمين للعيادة.',
      descEn: 'A detailed breakdown of how medical personal branding instills 80% higher clinic loyalty among premium patient segments.',
      statusAr: 'مسودة مقترحة',
      statusEn: 'Clinic Guide'
    },
    {
      category: 'social',
      icon: 'share_reviews',
      titleAr: 'كيف تختار المنصة الاجتماعية المناسبة لعيادتك التخصصية؟',
      titleEn: 'Choosing The Right Social Channel For Your Practice',
      descAr: 'تحليل تفصيلي لجمهور منصات تيك توك، سناب شات، وإنستغرام بالرياض، ومساعدة الأطباء في تحديد أين يقضي مريضهم المثالي وقته اليومي.',
      descEn: 'Comparing surgical, cosmetic, and dental demographic preferences on Snapchat, TikTok, and Instagram in Saudi Arabia.',
      statusAr: 'مسودة مقترحة',
      statusEn: 'Creative Blueprint'
    },
    {
      category: 'seo',
      icon: 'search_insights',
      titleAr: 'استراتيجيات تحسين محركات البحث (SEO) للعيادات',
      titleEn: 'Clinical Search Engine Dominance Framework',
      descAr: 'دليلك المصغر لتصدر نتائج بحث جوجل للبحث الجغرافي بالرياض والمملكة لكي تظهر عيادتك فوراً عندما يبحث المرضى عن تخصصك.',
      descEn: 'Actionable steps to structure your medical schemas and GMB ratings to rank first for surgical search terms.',
      statusAr: 'مسودة مقترحة',
      statusEn: 'SEO Playbook'
    },
    {
      category: 'rules',
      icon: 'gavel',
      titleAr: 'أخلاقيات التسويق الطبي وقوانين وزارة الصحة السعودية',
      titleEn: 'MOH Compliant Medical Advertising Ethics',
      descAr: 'دليل وقائي هام حول الممارسات المسموحة والمحظورة في الإعلانات الطبية ووسائل التواصل الاجتماعي لضمان حملات ناجحة دون التعرض لأي غرامات.',
      descEn: 'A compliance checklist for Saudi physicians highlighting illegal claims, licensing numbers display, and patient privacy guidelines.',
      statusAr: 'مسودة مقترحة',
      statusEn: 'Compliance Shield'
    }
  ];

  // Filtering Logic
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = 
      searchTerm === '' ||
      post.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.descAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.descEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-32 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
        
        {/* Blog Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center select-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
            {heading}
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>
          
          <div className="relative w-full max-w-xl mx-auto">
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-full py-4 pr-12 pl-6 focus:border-cyan-400 outline-none transition-all placeholder:text-slate-500 text-sm text-white" 
              placeholder={isRtl ? "ابحث عن المقالات أو النصائح الطبية..." : "Search clinic guides, guidelines..."} 
              type="text"
            />
          </div>
        </section>

        {/* Featured Post */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16 select-none">
          <div className="glass-card rounded-2xl overflow-hidden flex flex-col lg:flex-row group hover:border-cyan-400/40 transition-all duration-500">
            <div className="lg:w-3/5 bg-slate-950/40 min-h-[300px] flex items-center justify-center overflow-hidden relative">
              <span className="material-symbols-outlined text-cyan-400/10 text-9xl group-hover:scale-110 group-hover:text-cyan-400/20 transition-all duration-700">
                {featuredPost.icon}
              </span>
            </div>
            
            <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1.5 rounded-lg mb-4 self-start">
                {isRtl ? featuredPost.authorAr : featuredPost.authorEn}
              </span>
              
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-snug">
                {isRtl ? featuredPost.titleAr : featuredPost.titleEn}
              </h2>
              
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6">
                {isRtl ? featuredPost.descAr : featuredPost.descEn}
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-2">
                <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 shrink-0">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {isRtl ? featuredPost.authorAr : featuredPost.authorEn}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {isRtl ? featuredPost.roleAr : featuredPost.roleEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Tab Filters */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12 select-none">
          <div className="flex flex-wrap gap-3 justify-center border-b border-white/5 pb-8">
            {categories.map((cat) => {
              const label = isRtl ? cat.ar : cat.en;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:border-cyan-400/30 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-slate-500 text-5xl mb-4">search_off</span>
              <p className="text-slate-400">{isRtl ? 'لم يتم العثور على أي مقالات تتطابق مع بحثك' : 'No articles found matching your inquiry.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post, idx) => {
                const title = isRtl ? post.titleAr : post.titleEn;
                const desc = isRtl ? post.descAr : post.descEn;
                const status = isRtl ? post.statusAr : post.statusEn;
                const catLabel = isRtl 
                  ? categories.find(c => c.key === post.category)?.ar 
                  : categories.find(c => c.key === post.category)?.en;
                
                return (
                  <article 
                    key={idx} 
                    className="glass-card rounded-2xl overflow-hidden group hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between select-none"
                  >
                    <div className="h-56 bg-slate-950/60 flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-cyan-400/10 text-7xl group-hover:scale-110 group-hover:text-cyan-400/25 transition-all duration-500">
                        {post.icon}
                      </span>
                    </div>
                    
                    <div className="p-8 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded">
                            {catLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">{status}</span>
                        </div>
                        
                        <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-snug group-hover:text-cyan-400 transition-colors">
                          {title}
                        </h3>
                        
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                          {desc}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-white/5 mt-auto flex justify-between items-center text-xs font-bold">
                        <Link href={getHref('contact')} className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer">
                          {isRtl ? 'تصفح المسودة وقراءة التحليل' : 'Read Draft Analytics'}
                        </Link>
                        <span className="material-symbols-outlined text-slate-500 group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Newsletter Form */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 select-none">
          <div className="glass-card rounded-[2rem] p-12 lg:p-20 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                {isRtl ? 'اشترك في نشرتنا الطبية الدورية' : 'Join Over 1,000 Saudi Clinic Directors'}
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
                {isRtl 
                  ? 'انضم لأكثر من 1,000 طبيب ومدير مركز طبي بالمملكة يصلهم دورياً نصائح وتحديثات قوانين التسويق والنمو الرقمي.' 
                  : 'Get monthly clinical growth insights, audit frameworks, and MOH regulatory shifts sent straight to your inbox.'}
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                  className="flex-grow bg-slate-950/60 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-cyan-400 transition-all text-sm text-white" 
                  placeholder={isRtl ? "أدخل بريدك الإلكتروني المهني" : "Enter professional clinic email..."}
                  type="email"
                  required
                />
                <button 
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-10 py-4.5 rounded-xl font-bold text-sm hover:scale-105 transition-all cursor-pointer shrink-0" 
                  type="submit"
                >
                  {isRtl ? 'اشترك الآن' : 'Subscribe Free'}
                </button>
              </form>
              <p className="mt-6 text-[10px] text-slate-500 font-bold">
                {isRtl ? 'نلتزم بالخصوصية الكاملة للأطباء. لا نرسل رسائل مزعجة.' : 'Zero spam. Unsubscribe at any time with a single click.'}
              </p>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
      <FloatContacts />
    </>
  );
}
