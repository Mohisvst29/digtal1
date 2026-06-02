'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function AboutPage() {
  const { t, locale, data } = useContent();

  const isRtl = locale === 'ar';

  // Toggle light-theme class on body for this page only to activate light Header, Footer, and Selection styles
  useEffect(() => {
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  const title = t('about_title', 'من نحن؟');
  const description = t('about_description', 'وكالة تسويق رقمي متخصصة في القطاع الطبي، مقرها الرياض، تم تأسيسها لتكون شريك النمو الأول للأطباء والمراكز الطبية والمستشفيات. نحن شركة ناشئة بفكر متطور، نركز على تحويل الخدمات الطبية إلى علامات رقمية قوية قادرة على جذب المرضى وبناء الثقة.');

  const dbTeam = data?.teamMembers || [];
  const defaultTeam = [
    {
      name_ar: 'م. محمد فوزي',
      name_en: 'Eng. Mohamed Fawzy',
      role_ar: 'مطور الحلول البرمجية للعيادات',
      role_en: 'Clinic Systems Architect & Developer',
      image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      order: 1
    },
    {
      name_ar: 'د. سارة فهد',
      name_en: 'Dr. Sarah Fahad',
      role_ar: 'مستشارة التسويق والنمو الطبي',
      role_en: 'Clinical Growth & Marketing Lead',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      order: 2
    },
    {
      name_ar: 'أ. أحمد خالد',
      name_en: 'Ahmed Khaled',
      role_ar: 'مخطط استراتيجيات المحتوى الطبي',
      role_en: 'Clinical Content Strategist',
      image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      order: 3
    },
    {
      name_ar: 'أ. ديما سليمان',
      name_en: 'Dima Soliman',
      role_ar: 'أخصائية إدارة السمعة والتقييمات',
      role_en: 'Reputation & Stars Manager',
      image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      order: 4
    }
  ];

  const activeTeam = dbTeam.length > 0 ? [...dbTeam].sort((a, b) => (a.order || 0) - (b.order || 0)) : defaultTeam;

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  const renderProgressCircle = (percentage: number, label: string) => {
    const radius = 40;
    const strokeWidth = 6;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] select-none">
        <div className="relative w-28 h-28 flex items-center justify-center mb-5">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              stroke="#e2e8f0" 
              strokeWidth={strokeWidth} 
              fill="transparent" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r={radius} 
              stroke="#00daf3" 
              strokeWidth={strokeWidth} 
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <span className="absolute text-lg font-black text-slate-800 font-sans">{percentage}%</span>
        </div>
        <p className="text-xs font-black text-slate-800">{label}</p>
      </div>
    );
  };

  return (
    <>
      <Header />
      
      <main className={`flex-grow pt-24 bg-[#f8fafc] text-slate-800 min-h-screen ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900 relative z-10`}>
        
        {/* Dynamic Pattern Overlay to render over the light theme background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none select-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(0, 218, 243, 0.22) 2px, transparent 2px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* HERO SECTION */}
        <section className="relative z-10 py-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Visual Dashboard Graphics Card */}
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1 select-none">
              <div className="w-full max-w-sm aspect-square overflow-hidden group">
                <img 
                  src={data?.content?.['about_img'] || '/assets/about_handshake.png'} 
                  alt="About Us Visual" 
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right Column: Copy text block */}
            <div className="lg:col-span-7 flex flex-col items-start justify-center order-1 lg:order-2">
              <span className="inline-block text-xs font-black text-cyan-400 tracking-wider mb-4 uppercase">
                {t('about_badge', 'تأسست في الرياض')}
              </span>
              
              <h1 className="text-3xl md:text-4.5xl font-black text-[#0f172a] mb-6 leading-snug">
                {isRtl ? 'نعيد صياغة' : 'We redefine'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600">
                  {isRtl ? 'مستقبل التسويق الطبي الرقمي الفاخر' : 'the future of luxury digital medical growth'}
                </span>
              </h1>
              
              <p className="text-base text-slate-800 mb-8 leading-relaxed max-w-xl">
                {description}
              </p>
              
              <div className="flex flex-row gap-4 w-full sm:w-auto">
                <Link 
                  href={getHref('contact')} 
                  className="bg-[#0b132a] hover:bg-[#121c3b] text-white-force px-8 py-3.5 rounded-xl font-bold text-sm text-center shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  {isRtl ? 'اتصل بنا' : 'Contact Us'}
                </Link>
                <Link 
                  href={getHref('services')} 
                  className="bg-white border-2 border-[#0b132a] text-[#0b132a] px-8 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:bg-slate-50 cursor-pointer"
                >
                  {t('about_cta_btn_secondary', 'خدماتنا الطبية')}
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* VISION & MISSION SECTION ("رؤيتنا ورسالتنا") */}
        <section className="relative z-10 py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-cyan-400/20 transition-all select-none">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 mb-6">
                <span className="material-symbols-outlined text-3xl">lightbulb</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">
                {t('about_vision_title', 'رؤيتنا')}
              </h3>
              <p className="text-sm text-slate-650 leading-relaxed">
                {t('about_vision_desc', 'أن نكون الشريك الرقمي الأول لنمو القطاع الصحي في المملكة العربية السعودية عبر استراتيجيات تسويق طبي مبنية على الثقة وبناء المصداقية وتحقيق نتائج قابلة للقياس تدعم نمو المنشآت الطبية وتزيد وصولها للمرضى وتحول الحضور الرقمي إلى حجوزات فعلية ونمو مستدام.')}
              </p>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-cyan-400/20 transition-all select-none">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 mb-6">
                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">
                {t('about_mission_title', 'رسالتنا')}
              </h3>
              <p className="text-sm text-slate-650 leading-relaxed">
                {t('about_mission_desc', 'نساعد مقدمي الرعاية الصحية على جذب المرضى المناسبين، بناء سيرة مهنية قوية، وتحقيق نمو مستدام باستخدام التسويق الرقمي، مع الالتزام الكامل بأخلاقيات المجال الطبي والمعايير المهنية.')}
              </p>
            </div>
          </div>
        </section>

        {/* TIMELINE / GROWTH SECTION ("مسيرة النمو") */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="mb-20 text-center flex flex-col items-center">
            <h2 className="text-3xl font-black text-slate-900 pb-2 border-b-2 border-cyan-400 w-fit">
              {isRtl ? 'مسيرة النمو' : 'Our Milestones'}
            </h2>
          </div>

          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute right-4 md:right-1/2 transform md:translate-x-1/2 top-0 bottom-0 w-0.5 bg-cyan-400/20 z-0"></div>

            <div className="space-y-16">
              {[
                {
                  year: '2023',
                  title_ar: 'التأسيس والانطلاقة بالرياض',
                  title_en: 'Founding & Launch',
                  desc_ar: 'تأسست ديجيتال هيلث برؤية سد الفجوة بين علوم التسويق ومفاهيم الطب، ملتزمين بالكامل بلوائح وزارة الصحة وتوفير حلول نمو سريرية ذكية.',
                  desc_en: 'Established with a focus on bridging medical expertise and digital marketing.'
                },
                {
                  year: '2024',
                  title_ar: 'التوسع وريادة السيو الطبي',
                  title_en: 'Medical SEO Leadership',
                  desc_ar: 'تقديم خدمات السيو وإدارة السمعة لأكثر من 40 مجمعاً عيادياً واستشارياً بالرياض، مع تمكين العيادات من تصدر الكلمات الأكثر ربحية على جوجل.',
                  desc_en: 'Dominated healthcare rankings for 40+ clinical centers in Riyadh.'
                },
                {
                  year: '2025',
                  title_ar: 'حوكمة السمعة وتجربة المريض',
                  title_en: 'Patient-Path Governance',
                  desc_ar: 'إطلاق وتطوير أنظمة تتبع رقمية لقياس رضا المريض وإدارة تقييمات الاستشاريين بشكل مؤتمت وتوافقي مع أنظمة الخصوصية.',
                  desc_en: 'Launched custom analytics tracking to measure clinical patient attraction.'
                }
              ].map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center">
                    
                    {/* Circle branch node */}
                    <div className="absolute right-3 md:right-1/2 transform translate-x-[4px] md:translate-x-[4px] w-3 h-3 rounded-full bg-white border-2 border-cyan-400 z-10"></div>

                    {/* Content Card */}
                    <div className={`w-full md:w-1/2 pr-10 md:pr-0 ${isEven ? 'md:pl-16' : 'md:pr-16 md:order-2'} text-right`}>
                      <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-cyan-400/20 hover:scale-[1.01] transition-all">
                        <span className="text-xs font-black text-cyan-400 mb-2 block">{milestone.year}</span>
                        <h4 className="text-sm font-extrabold text-slate-800 mb-2">{isRtl ? milestone.title_ar : milestone.title_en}</h4>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed">{isRtl ? milestone.desc_ar : milestone.desc_en}</p>
                      </div>
                    </div>

                    {/* Desktop placeholder spacer */}
                    <div className="hidden md:block w-1/2"></div>

                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* VALUES SECTION ("قيمنا الجوهرية") */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="mb-16 text-center">
            <span className="text-xs font-black text-cyan-500 tracking-wider mb-2 block uppercase">
              {isRtl ? 'قيمنا الجوهرية' : 'OUR VALUES'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              {isRtl ? 'القيم الجوهرية: الركائز التي نعمل بها' : 'Core Values We Act By'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'medical_services', title: 'التزام طبي كامل', desc: 'نلتزم بمعايير وأخلاقيات التسويق الطبي المعتمدة بالمملكة وبما يتطابق مع لوائح وزارة الصحة.' },
              { icon: 'verified', title: 'مصداقية وأخلاقيات', desc: 'نلتزم بقوانين وزارة الصحة ولوائح خصوصية البيانات الطبية للمريض والشفافية التامة.' },
              { icon: 'favorite', title: 'خدمة مخصصة', desc: 'خطط نمو وتواصل فريدة مصممة خصيصاً لكل تخصص طبي بمفرده لتناسب أهدافه بدقة.' }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-cyan-400/20 hover:-translate-y-1 transition-all select-none">
                <div className="w-12 h-12 rounded-full border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-6">
                  <span className="material-symbols-outlined text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-3">{value.title}</h3>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY WE ARE DIFFERENT SECTION ("لماذا نختلف؟") */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 md:px-12 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 shadow-sm">
          <div className="mb-16 text-center">
            <span className="text-xs font-black text-cyan-500 tracking-wider mb-2 block uppercase">
              {isRtl ? 'لماذا نحن؟' : 'WHY CHOOSE US'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              {t('about_why_title', 'لماذا نختلف؟')}
            </h2>
            <p className="text-sm text-slate-650 max-w-2xl mx-auto">
              {t('about_why_desc', 'على عكس الوكالات العامة نحن متخصصون في التسويق الطبي فقط لأن هذا المجال يحتاج:')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { icon: 'psychology', titleAr: 'فهم عقلية المريض', descAr: 'فهم طريقة تفكير المرضى وما الذي يدفعهم للحجز والثقة' },
              { icon: 'public', titleAr: 'خبرة بالسوق السعودي', descAr: 'معرفة المنافسة وسلوك المرضى وكيف تبني حضورًا طبيًا قويًا في السعودية' },
              { icon: 'analytics', titleAr: 'قرارات مبنية على البيانات', descAr: 'كل حملة تعتمد على التحليل والأرقام لتحقيق نتائج قابلة للقياس' },
              { icon: 'gavel', titleAr: 'التزام بالمعايير الطبية', descAr: 'أخلاقيات التسويق الطبي والمحافظة على مصداقية العلامة الطبية' },
              { icon: 'track_changes', titleAr: 'استراتيجيات مخصصة لكل تخصص', descAr: 'لكل عيادة أو مركز طبي خطة تناسب تخصصه وأهدافه والجمهور المستهدف' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-cyan-400/20 hover:-translate-y-1 transition-all select-none flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full border border-cyan-400/30 flex items-center justify-center text-cyan-500 mb-6">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xs font-black text-slate-800 mb-3">{isRtl ? item.titleAr : item.titleAr}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{isRtl ? item.descAr : item.descAr}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TARGET CLIENTS SECTION ("عملائنا المستهدفون") */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <span className="text-xs font-black text-cyan-500 tracking-wider mb-2 block uppercase">
              {isRtl ? 'الجمهور المستهدف' : 'TARGET AUDIENCE'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              {isRtl ? 'عملاؤنا المستهدفون' : 'Our Target Clients'}
            </h2>
            <p className="text-sm text-slate-650 max-w-2xl mx-auto">
              {isRtl ? 'نصمم خدماتنا لتناسب مختلف فئات مقدمي الرعاية الصحية بالتخصصات التالية:' : 'We tailor our clinical marketing services for various segments of healthcare providers:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'person', titleAr: 'الأطباء (عيادات فردية)', titleEn: 'Physicians (Solo Practice)', descAr: 'بناء الهوية الشخصية والسمعة الطبية للأطباء والاستشاريين.', descEn: 'Establishing personal branding and trust for elite specialists.' },
              { icon: 'domain', titleAr: 'المراكز الطبية', titleEn: 'Medical Centers', descAr: 'استراتيجيات نمو متكاملة للمجمعات والعيادات متعددة التخصصات.', descEn: 'Integrated growth models for multi-specialty healthcare facilities.' },
              { icon: 'local_hospital', titleAr: 'المستشفيات', titleEn: 'Hospitals', descAr: 'حلول تسويقية متطورة تدير الحضور الرقمي وتنظم مسار جذب المرضى.', descEn: 'Optimizing corporate healthcare pathways and patient attraction cycles.' },
              { icon: 'vaccines', titleAr: 'العيادات التخصصية', titleEn: 'Specialty Clinics', descAr: 'تجميل – أسنان – تغذية – جراحة – جلدية وغيرها من التخصصات الطبية.', descEn: 'Aesthetics, dental, cosmetic, pediatrics, and surgical clinics.' }
            ].map((client, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-cyan-400/20 hover:-translate-y-1 transition-all select-none">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 mb-6">
                  <span className="material-symbols-outlined text-2xl">{client.icon}</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-3">{isRtl ? client.titleAr : client.titleEn}</h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">{isRtl ? client.descAr : client.descEn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM MEMBERS SECTION ("فريق الخبراء") */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 md:px-12 select-none">
          
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              {isRtl ? 'فريق الخبراء' : 'Expert Team'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeTeam.slice(0, 4).map((member, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-slate-100 group">
                <img 
                  src={member.image_url || defaultTeam[idx].image_url} 
                  alt={isRtl ? member.name_ar : member.name_en} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-[1.03]" 
                />
                
                {/* Dark Gradient Overlay for Name and Role text rendering */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent p-6 text-center">
                  <h3 className="text-sm font-black text-white-force">
                    {isRtl ? member.name_ar : member.name_en}
                  </h3>
                  <p className="text-[10px] text-cyan-400-force font-bold mt-1.5">
                    {isRtl ? member.role_ar : member.role_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRESS CIRCLES SECTION ("مؤشرات الأداء") */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              {isRtl ? 'مؤشرات الأداء' : 'Performance Indicators'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {renderProgressCircle(95, isRtl ? 'ارتفاع الاستفسارات الطبية' : 'Patient Leads Growth')}
            {renderProgressCircle(90, isRtl ? 'نسبة رضا العيادات الشريكة' : 'Clinics Satisfaction')}
            {renderProgressCircle(85, isRtl ? 'معدل الحجوزات المؤكدة' : 'Confirmed Bookings Rate')}
          </div>
        </section>

        {/* DUAL-TONE CTA CARD SECTION */}
        <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative rounded-[2.5rem] p-12 md:p-16 text-center bg-gradient-to-r from-[#e0e7ff]/40 via-[#e0f2fe]/40 to-[#e0e7ff]/40 border border-slate-200/50 shadow-sm overflow-hidden select-none hover:shadow-md transition-shadow">
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black mb-6 uppercase tracking-wider shadow-sm">
                {isRtl ? 'طلب استشارة تشخيصية مجانية' : 'Complimentary Audit'}
              </span>
              
              <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight max-w-2xl mx-auto">
                {t('about_cta_title', 'ابدأ رحلة النمو الطبي لعيادتك اليوم')}
              </h2>
              
              <p className="text-xs md:text-sm text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
                {t('about_cta_desc', 'دعنا نساعدك في تصميم قناة جذب مرضى مخصصة وفعالة ومتوافقة تماماً مع معايير وزارة الصحة السعودية.')}
              </p>
              
              <div className="flex justify-center items-center">
                <Link 
                  href={getHref('contact')} 
                  className="bg-[#0b132a] hover:bg-[#121c3b] text-white-force font-black px-10 py-4.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg cursor-pointer text-sm"
                >
                  {isRtl ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
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
