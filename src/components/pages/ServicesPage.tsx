'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function ServicesPage() {
  const { t, locale, data } = useContent();

  const isRtl = locale === 'ar';

  const heading = t('services_heading', 'هندسة الحلول وبناء الريادة الطبية الرقمية');
  const description = t('services_description', 'باقات متكاملة ومصممة خصيصاً للعيادات والمراكز والمستشفيات التخصصية الطموحة لضمان نمو تدفق المرضى بأعلى معايير الالتزام الطبي والمهني.');

  const getServicePath = (slug: string) => {
    if (slug === 'identity') return 'services/digital-medicalidentity';
    if (slug === 'social') return 'services/medical-socialmedia';
    if (slug === 'seo') return 'services/medical-seo';
    if (slug === 'ppc') return 'services/paid-ads';
    if (slug === 'reputation') return 'services/reputation-management';
    if (slug === 'web') return 'services/medical-website';
    return `services/${slug}`;
  };

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  const services = [
    {
      slug: 'identity',
      icon: 'fingerprint',
      colSpan: 'md:col-span-8',
      title: t('services_identity_title', 'الهوية الطبية الرقمية الفاخرة'),
      desc: t('services_identity_desc', 'تأسيس براند طبي قوي ومهيب يعبر عن كفاءتكم الطبية وعيادتكم لربط قيمكم ورسالتكم الطبية بالمرضى بشكل راقٍ ومقنع.'),
      featuresAr: [
        { label: 'تماسك الهوية', desc: 'لغة بصرية وشعار وقيم موحدة على كافة المنصات الرقمية.' },
        { label: 'ترسيخ المرجعية', desc: 'إبراز اسم الطبيب والعيادة كمرجع أساسي في تخصصه بالرياض.' }
      ],
      featuresEn: [
        { label: 'Consistent Visuals', desc: 'Sleek premium typography and color harmony on all web screens.' },
        { label: 'Establish Leadership', desc: 'Positioning your name and credentials as the top clinical choice.' }
      ],
      tags: ['استراتيجية', 'تصميم هوية']
    },
    {
      slug: 'seo',
      icon: 'search_insights',
      colSpan: 'md:col-span-4',
      title: t('services_seo_title', 'السيو الطبي التخصصي'),
      desc: t('services_seo_desc', 'التصدر الفوري والأول لنتائج البحث المحلية بالرياض للمرضى الباحثين عن تخصصك وخدمات عيادتك الطبية مباشرة.'),
      bulletsAr: [
        'سيو خرائط جوجل والمواقع المحلية للعيادات والمستشفيات',
        'تحسين هيكل المحتوى الطبي وتجربة استخدام المرضى',
        'تصدر الكلمات البحثية عالية القيمة ونسب حجز المواعيد'
      ],
      bulletsEn: [
        'Local SEO & Google Maps optimization for clinics',
        'Clinical-grade schema markup & medical copy',
        'Dominating high-intent diagnostic keywords'
      ]
    },
    {
      slug: 'reputation',
      icon: 'star_half',
      colSpan: 'md:col-span-4',
      title: t('services_reputation_title', 'إدارة السمعة الطبية'),
      desc: t('services_reputation_desc', 'مراقبة وحماية سمعتك الطبية الرقمية على خرائط جوجل والمنصات الطبية المتخصصة وتكبير حجم التقييمات الإيجابية.'),
      stat: '98%',
      statDescAr: 'معدل الانطباع الإيجابي لشركائنا',
      statDescEn: 'Positive patient impression rate'
    },
    {
      slug: 'web',
      icon: 'devices',
      colSpan: 'md:col-span-8',
      title: t('services_web_title', 'المواقع والتطبيقات الطبية الفاخرة'),
      desc: t('services_web_desc', 'تطوير منصات طبية ومواقع ويب تفاعلية فائقة السرعة تتيح حجز مواعيد مرن وسلس وتقدم تجربة استخدام مريحة للمريض.'),
      badgesAr: [
        'متوافق مع حجز المواعيد الفوري',
        'أمان وتشفير كامل للمعلومات',
        'سريع ومتجاوب مع الجوال 100%'
      ],
      badgesEn: [
        'Instant patient appointment booking systems',
        'HIPAA-compliant hosting and maximum encryption',
        '100% responsive responsive layouts'
      ]
    },
    {
      slug: 'social',
      icon: 'share_reviews',
      colSpan: 'md:col-span-6',
      title: t('services_social_title', 'إدارة السوشيال ميديا الطبية'),
      desc: t('services_social_desc', 'ترجمة المحتوى الطبي العلمي المعقد إلى مقاطع فيديو قصيرة وتصاميم مرئية مبسطة وسهلة الفهم لبناء قاعدة متابعين مخلصين.'),
      progressAr: 'تفاعل حقيقي +75%',
      progressEn: 'Organic Interaction +75%',
      progressLabelAr: 'متوسط الزيادة لشركائنا بالرياض',
      progressLabelEn: 'Average organic growth for clinics'
    },
    {
      slug: 'ppc',
      icon: 'ads_click',
      colSpan: 'md:col-span-6',
      title: t('services_ppc_title', 'الإعلانات الممولة والاستهداف المباشر'),
      desc: t('services_ppc_desc', 'حملات إعلانية مدفوعة ذكية ودقيقة تستهدف المرضى الباحثين عن علاجات التجميل، الأسنان، الليزر بأقل تكلفة حجز ممكنة.'),
      cardsAr: [
        { title: 'إعلانات جوجل وسناب شات', value: 'أداء فائق واستحواذ سريع' },
        { title: 'تخفيض تكلفة الاستحواذ', value: 'بنسبة 30% كمتوسط عيادي' }
      ],
      cardsEn: [
        { title: 'Meta & Google Ads', value: 'Instant high-intent clinic leads' },
        { title: 'Direct acquisition drop', value: 'Average 30% discount on cost' }
      ]
    }
  ];

  const dbServices = data?.services && data.services.length > 0 ? data.services : [];

  const mergedServices = (services as any[]).map(staticServ => {
    const dbServ = dbServices.find((s: any) => s.slug === staticServ.slug);
    if (dbServ) {
      return {
        ...staticServ,
        title: isRtl ? (dbServ.title_ar || dbServ.title) : (dbServ.title_en || dbServ.title),
        desc: isRtl ? (dbServ.desc_ar || dbServ.desc) : (dbServ.desc_en || dbServ.desc),
        icon: dbServ.icon || staticServ.icon,
        colSpan: dbServ.colSpan || staticServ.colSpan,
        image: dbServ.image || '',
        order: dbServ.order ?? staticServ.order ?? 99,
      };
    }
    return {
      ...staticServ,
      image: '',
    };
  });

  const extraServices = dbServices.filter((s: any) => !services.some(staticServ => staticServ.slug === s.slug)).map((dbServ: any) => ({
    slug: dbServ.slug,
    icon: dbServ.icon || 'clinical_notes',
    colSpan: dbServ.colSpan || 'md:col-span-6',
    title: isRtl ? (dbServ.title_ar || dbServ.title) : (dbServ.title_en || dbServ.title),
    desc: isRtl ? (dbServ.desc_ar || dbServ.desc) : (dbServ.desc_en || dbServ.desc),
    image: dbServ.image || '',
    order: dbServ.order ?? 99,
  }));

  const allServices = [...mergedServices, ...extraServices].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <Header />
      
      <main className={`flex-grow pt-32 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900 animate-fade-in`}>
        
        {/* Services Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center select-none relative overflow-hidden rounded-3xl">
          {data?.content?.['services_bg_img'] && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-[0.22] pointer-events-none z-0"
              style={{ backgroundImage: `url(${data.content['services_bg_img']})` }}
            />
          )}
          <h1 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
            {isRtl ? 'هندسة الحلول وبناء' : 'Engineering Growth &'} <br/>
            <span className="bg-gradient-to-r from-cyan-400 to-[var(--secondary-color)] bg-clip-text text-transparent">
              {isRtl ? 'الريادة الطبية الرقمية بالرياض' : 'Digital Clinical Leadership'}
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-cyan-400 font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">verified</span>
              <span>{isRtl ? 'متوافق مع أنظمة وزارة الصحة' : '100% MOH Regulation Compliant'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">clinical_notes</span>
              <span>{isRtl ? 'استراتيجيات نمو طبي تخصصي' : 'Specialized Clinical Frameworks'}</span>
            </div>
          </div>
        </section>
        
        {/* Bento Grid Services */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {allServices.map((serv: any) => {
              const title = serv.title;
              const desc = serv.desc;
              return (
                <div 
                  key={serv.slug} 
                  className={`${serv.colSpan} glass-card p-8 md:p-10 rounded-2xl flex flex-col justify-between select-none relative overflow-hidden group/card`}
                >
                  {serv.image && (
                    <>
                      <div className="absolute inset-0 bg-cover bg-center opacity-[0.16] group-hover/card:opacity-[0.26] transition-opacity duration-700 pointer-events-none z-0" style={{ backgroundImage: `url(${serv.image})` }} />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950/95 pointer-events-none z-0" />
                    </>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 shrink-0">
                        <span className="material-symbols-outlined text-3xl">{serv.icon}</span>
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold text-white ${isRtl ? 'text-right' : 'text-left'}`}>
                        {title}
                      </h3>
                    </div>
                    
                    <p className={`text-sm md:text-base text-slate-300 leading-relaxed mb-8 max-w-xl ${isRtl ? 'text-right' : 'text-left'}`}>
                      {desc}
                    </p>

                    {/* Conditional features layout */}
                    {serv.slug === 'identity' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {(isRtl ? serv.featuresAr : serv.featuresEn)?.map((f: any, i: number) => (
                          <div key={i} className={`flex items-start gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <span className="material-symbols-outlined text-cyan-400">check_circle</span>
                            <div>
                              <p className="text-sm font-bold text-white">{f.label}</p>
                              <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {serv.slug === 'seo' && (
                      <ul className={`space-y-3.5 mb-8 text-xs text-slate-300 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {(isRtl ? serv.bulletsAr : serv.bulletsEn)?.map((b: any, i: number) => (
                          <li key={i} className="flex items-center gap-2.5">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full shrink-0"></span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {serv.slug === 'reputation' && (
                      <div className={`pt-6 border-t border-white/5 mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <div className="text-cyan-400 text-3xl font-extrabold mb-1">{serv.stat}</div>
                        <div className="text-xs text-slate-400">{isRtl ? serv.statDescAr : serv.statDescEn}</div>
                      </div>
                    )}

                    {serv.slug === 'web' && (
                      <div className="flex flex-wrap gap-2.5 mb-8 justify-start">
                        {(isRtl ? serv.badgesAr : serv.badgesEn)?.map((badge: any, i: number) => (
                          <span key={i} className="px-3 py-1.5 border border-white/5 rounded-full text-xs font-semibold bg-slate-950/20 text-slate-300">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {serv.slug === 'social' && (
                      <div className={`space-y-4 mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 w-3/4"></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span>{isRtl ? serv.progressAr : serv.progressEn}</span>
                          <span>{isRtl ? serv.progressLabelAr : serv.progressLabelEn}</span>
                        </div>
                      </div>
                    )}

                    {serv.slug === 'ppc' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {(isRtl ? serv.cardsAr : serv.cardsEn)?.map((c: any, i: number) => (
                          <div key={i} className={`p-4 bg-slate-950/50 rounded-xl border border-white/5 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <p className="text-[10px] text-slate-400 mb-1">{c.title}</p>
                            <p className="text-xs font-bold text-cyan-400">{c.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Actions row */}
                  <div className={`mt-auto border-t border-white/5 pt-6 flex ${isRtl ? 'justify-between' : 'justify-between'} items-center relative z-10`}>
                    {serv.slug === 'identity' && (isRtl ? serv.tags : ['Strategy', 'Visual design'])?.map((t: any, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white/10 border border-white/10 rounded text-[10px] text-slate-200 font-bold uppercase">{t}</span>
                    ))}
                    {serv.slug !== 'identity' && <div />}
                    
                    <Link 
                      href={getHref(getServicePath(serv.slug))} 
                      className="group flex items-center gap-1.5 text-cyan-300 hover:text-white font-extrabold text-xs cursor-pointer"
                    >
                      {isRtl ? 'عرض تفاصيل الخدمة' : 'View Service Details'}
                      <span className={`material-symbols-outlined text-sm ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`}>
                        arrow_forward
                      </span>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic CTA */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
          <div className="relative glass-card p-12 md:p-20 rounded-[2rem] text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent pointer-events-none"></div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 relative z-10 leading-tight">
              {t('services_cta_title', 'مستعد لتمكين وترسيخ ريادتك الطبية الرقمية بالرياض؟')}
            </h2>
            <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
              <Link 
                href={getHref('contact')} 
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-10 py-4.5 rounded-xl text-sm hover:shadow-[0_0_30px_rgba(0,218,243,0.4)] transition-all text-center cursor-pointer"
              >
                {isRtl ? 'احجز جلسة استشارة مجانية' : 'Book Free Diagnostic Consultation'}
              </Link>
              <Link 
                href={getHref('portfolio')} 
                className="border border-white/10 bg-slate-950/40 px-10 py-4.5 rounded-xl text-sm hover:bg-slate-900 transition-colors text-center cursor-pointer"
              >
                {isRtl ? 'تصفح أعمالنا ونجاحاتنا' : 'Browse Clinic Case Studies'}
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
      <FloatContacts />
    </>
  );
}
