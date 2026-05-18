'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function ServicesPage() {
  const { t, locale } = useContent();

  const isRtl = locale === 'ar';

  const heading = t('services_heading', 'هندسة الحلول وبناء الريادة الطبية الرقمية');
  const description = t('services_description', 'باقات متكاملة ومصممة خصيصاً للعيادات والمراكز والمستشفيات التخصصية الطموحة لضمان نمو تدفق المرضى بأعلى معايير الالتزام الطبي والمهني.');

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
      titleAr: 'الهوية الطبية الرقمية الفاخرة',
      titleEn: 'Premium Digital Medical Identity',
      descAr: 'تأسيس براند طبي قوي ومهيب يعبر عن كفاءتكم الطبية وعيادتكم لربط قيمكم ورسالتكم الطبية بالمرضى بشكل راقٍ ومقنع.',
      descEn: 'Establishing a dominant, premium clinical brand that portrays clinical expertise and attracts selective premium patients.',
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
      titleAr: 'السيو الطبي التخصصي',
      titleEn: 'Clinical Medical SEO',
      descAr: 'التصدر الفوري والأول لنتائج البحث المحلية بالرياض للمرضى الباحثين عن تخصصك وخدمات عيادتك الطبية مباشرة.',
      descEn: 'Dominating search results in Riyadh for patients seeking verified treatments and doctors in real time.',
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
      titleAr: 'إدارة السمعة الطبية',
      titleEn: 'Reputation & Stars Governance',
      descAr: 'مراقبة وحماية سمعتك الطبية الرقمية على خرائط جوجل والمنصات الطبية المتخصصة وتكبير حجم التقييمات الإيجابية.',
      descEn: 'Protecting and scaling your professional digital presence and patient stars reviews automatically.',
      stat: '98%',
      statDescAr: 'معدل الانطباع الإيجابي لشركائنا',
      statDescEn: 'Positive patient impression rate'
    },
    {
      slug: 'web',
      icon: 'devices',
      colSpan: 'md:col-span-8',
      titleAr: 'المواقع والتطبيقات الطبية الفاخرة',
      titleEn: 'Luxury Medical Web Development',
      descAr: 'تطوير منصات طبية ومواقع ويب تفاعلية فائقة السرعة تتيح حجز مواعيد مرن وسلس وتقدم تجربة استخدام مريحة للمريض.',
      descEn: 'Engineering ultra-fast, responsive web interfaces with booking integrations and clinical security standards.',
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
      titleAr: 'إدارة السوشيال ميديا الطبية',
      titleEn: 'Medical Social Content Strategy',
      descAr: 'ترجمة المحتوى الطبي العلمي المعقد إلى مقاطع فيديو قصيرة وتصاميم مرئية مبسطة وسهلة الفهم لبناء قاعدة متابعين مخلصين.',
      descEn: 'Translating complex medical science into interactive video and stellar educational posts to capture interest.',
      progressAr: 'تفاعل حقيقي +75%',
      progressEn: 'Organic Interaction +75%',
      progressLabelAr: 'متوسط الزيادة لشركائنا بالرياض',
      progressLabelEn: 'Average organic growth for clinics'
    },
    {
      slug: 'ppc',
      icon: 'ads_click',
      colSpan: 'md:col-span-6',
      titleAr: 'الإعلانات الممولة والاستهداف المباشر',
      titleEn: 'Targeted Lead Ads (MOH Compliant)',
      descAr: 'حملات إعلانية مدفوعة ذكية ودقيقة تستهدف المرضى الباحثين عن علاجات التجميل، الأسنان، الليزر بأقل تكلفة حجز ممكنة.',
      descEn: 'Laser-focused paid acquisition on Snapchat & Google targeting verified inquiries with low costs per patient.',
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

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-32 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
        
        {/* Services Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center select-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
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
            {services.map((serv) => {
              const title = isRtl ? serv.titleAr : serv.titleEn;
              const desc = isRtl ? serv.descAr : serv.descEn;
              return (
                <div 
                  key={serv.slug} 
                  className={`${serv.colSpan} glass-card p-8 md:p-10 rounded-2xl flex flex-col justify-between select-none`}
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400">
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
                        {(isRtl ? serv.featuresAr : serv.featuresEn)?.map((f, i) => (
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
                        {(isRtl ? serv.bulletsAr : serv.bulletsEn)?.map((b, i) => (
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
                        {(isRtl ? serv.badgesAr : serv.badgesEn)?.map((badge, i) => (
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
                        {(isRtl ? serv.cardsAr : serv.cardsEn)?.map((c, i) => (
                          <div key={i} className={`p-4 bg-slate-950/50 rounded-xl border border-white/5 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <p className="text-[10px] text-slate-400 mb-1">{c.title}</p>
                            <p className="text-xs font-bold text-cyan-400">{c.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Actions row */}
                  <div className={`mt-auto border-t border-white/5 pt-6 flex ${isRtl ? 'justify-between' : 'justify-between'} items-center`}>
                    {serv.slug === 'identity' && (isRtl ? serv.tags : ['Strategy', 'Visual design'])?.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded text-[10px] text-slate-400 font-semibold uppercase">{t}</span>
                    ))}
                    {serv.slug !== 'identity' && <div />}
                    
                    <Link 
                      href={getHref(`services/${serv.slug}`)} 
                      className="group flex items-center gap-1.5 text-cyan-400 hover:text-white font-bold text-xs cursor-pointer"
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
              {isRtl ? 'مستعد لتمكين وترسيخ ريادتك' : 'Ready to Establish Elite'} <br/>
              <span className="text-cyan-400">
                {isRtl ? 'الطبية الرقمية بالرياض؟' : 'Healthcare Authority In Riyadh?'}
              </span>
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
