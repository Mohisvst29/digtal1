'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function AboutPage() {
  const { t, locale, data } = useContent();

  const isRtl = locale === 'ar';

  const title = t('about_title', 'من نحن؟');
  const description = t('about_description', 'وكالة تسويق رقمي متخصصة في القطاع الطبي مقرها الرياض، تم تأسيسها لتكون شريك النمو الأول للأطباء والمراكز الطبية والمستشفيات.');
  const subDescription = t('about_sub_description', 'نحن شركة ناشئة بفكر متطور، نركز على تحويل الخدمات الطبية إلى علامات رقمية قوية قادرة على جذب المرضى وبناء الثقة.');

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-20 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
        
        {/* About Hero Section */}
        <section className="relative min-h-[500px] flex items-center justify-center py-20 px-6 md:px-12 bg-slate-950/30">
          <div className="absolute inset-0 bg-slate-950/80 z-0"></div>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-20 w-96 h-96 bg-cyan-400 opacity-[0.03] blur-[120px] rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center z-10">
            <span className="inline-block px-3.5 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/10 font-bold text-xs text-cyan-400 tracking-wider mb-6">
              {isRtl ? 'تأسست في الرياض' : 'Established in Riyadh'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
              {description}
            </p>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {subDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href={getHref('services')} 
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-sm text-center shadow-lg transition-transform hover:scale-[1.03] cursor-pointer"
              >
                {isRtl ? 'خدماتنا الطبية' : 'Our Clinical Services'}
              </Link>
              <Link 
                href={getHref('contact')} 
                className="glass-card text-cyan-400 border border-cyan-400/20 px-8 py-4 rounded-xl font-bold text-sm text-center hover:bg-cyan-400/10 transition-colors cursor-pointer"
              >
                {isRtl ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Vision */}
            <div className="glass-card p-10 md:p-12 rounded-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors"></div>
              <span className="material-symbols-outlined text-cyan-400 text-5xl mb-6 block">visibility</span>
              <h2 className={`text-2xl md:text-3xl font-extrabold text-white mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl ? 'رؤيتنا' : 'Our Vision'}
              </h2>
              <p className={`text-sm md:text-base text-slate-300 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl 
                  ? 'أن نكون الشريك الرقمي الأول لنمو القطاع الصحي في المملكة العربية السعودية عبر استراتيجيات تسويق طبي مبنية على الثقة وبناء المصداقية وتحقيق نتائج قابلة للقياس تدعم نمو المنشآت الطبية وتزيد وصولها للمرضى وتحول الحضور الرقمي إلى حجوزات فعلية ونمو مستدام.' 
                  : 'To become the premier healthcare growth partner in Saudi Arabia, building long-term digital credibility and generating high-impact patient flow for clinics and hospitals.'}
              </p>
            </div>

            {/* Mission */}
            <div className="glass-card p-10 md:p-12 rounded-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors"></div>
              <span className="material-symbols-outlined text-cyan-400 text-5xl mb-6 block">rocket_launch</span>
              <h2 className={`text-2xl md:text-3xl font-extrabold text-white mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl ? 'رسالتنا' : 'Our Mission'}
              </h2>
              <p className={`text-sm md:text-base text-slate-300 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl 
                  ? 'نساعد مقدمي الرعاية الصحية على جذب المرضى المناسبين، بناء سيرة مهنية قوية، وتحقيق نمو مستدام باستخدام التسويق الرقمي، مع الالتزام الكامل بأخلاقيات المجال الطبي والمعايير المهنية.' 
                  : 'Empowering doctors and elite practitioners to connect with patients authentically and sustainably using modern ethical medical marketing and digital patient pathways.'}
              </p>
            </div>

          </div>
        </section>

        {/* Why we are different */}
        <section className="py-24 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {isRtl ? 'لماذا نختلف؟' : 'Why Choose Us?'}
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                {isRtl 
                  ? 'على عكس الوكالات التسويقية العامة، نحن متخصصون في التسويق الطبي فقط ونفهم الفروق الدقيقة لمسار الرعاية الطبية.' 
                  : 'Unlike general marketing agencies, we specialize strictly in clinical medical growth, understanding the delicate journey of patients.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: 'psychology', titleAr: 'سيكولوجية المريض', titleEn: 'Patient Psychology', descAr: 'فهم عميق لطريقة تفكير المرضى وعقليتهم وما الذي يدفعهم للاختيار والحجز وثقة الممارس.', descEn: 'Knowing exactly how patients research clinical services and what instills real conversion confidence.' },
                { icon: 'location_on', titleAr: 'خبرة بالسوق السعودي', titleEn: 'Saudi MOH Experts', descAr: 'معرفة تامة بسلوكيات المرضى والمنافسة ومؤسسات الرعاية الصحية بالرياض.', descEn: 'We navigate target audience segments, regional clinic metrics, and Riyadh medical space.' },
                { icon: 'analytics', titleAr: 'قرارات مبنية على البيانات', titleEn: 'Precision Analytics', descAr: 'تحليل دقيق ومستمر لكل خطوة تسويقية لضمان أعلى عائد استثماري للعيادة والمركز.', descEn: 'Tracking direct cost-per-patient-acquisition values to scale profitable clinic channels.' },
                { icon: 'health_and_safety', titleAr: 'الالتزام بأخلاقيات المهنة', titleEn: 'Strict Professional Ethics', descAr: 'المحافظة المطلقة على سرية ومعايير وأخلاقيات التسويق الطبي المعتمدة بالمملكة.', descEn: 'Every digital campaign matches the strict regulations of Saudi MOH guidelines.' },
                { icon: 'tune', titleAr: 'استراتيجيات مخصصة', titleEn: 'Tailored Clinic Roadmap', descAr: 'خطط نمو وتواصل فريدة مصممة خصيصاً لكل تخصص طبي بمفرده.', descEn: 'Whether cosmetic surgery, dental, pediatric, or dermatology, we draft unique plans.' },
                { icon: 'verified', titleAr: 'تخصص طبي حصري', titleEn: 'Exclusive Healthcare Niche', descAr: 'التركيز التام 100% على الرعاية الصحية والطبية دون تشتت في قطاعات تجارية أخرى.', descEn: 'We do not build fast-food or retail brands; we only build elite medical leaders.' }
              ].map((item, idx) => (
                <div key={idx} className="p-8 bg-slate-900 rounded-2xl border border-white/5 flex flex-col items-start select-none">
                  <span className="material-symbols-outlined text-cyan-400 text-4xl mb-4">{item.icon}</span>
                  <h4 className={`text-lg font-bold text-white mb-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {isRtl ? item.titleAr : item.titleEn}
                  </h4>
                  <p className={`text-xs text-slate-400 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                    {isRtl ? item.descAr : item.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {isRtl ? 'عملاؤنا المستهدفون' : 'Who We Support'}
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
              {isRtl 
                ? 'نصمم خدماتنا لتناسب مختلف فئات مقدمي الرعاية الصحية:' 
                : 'We serve all segments of healthcare delivery, optimizing channels for specific scale goals:'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'person', arTitle: 'الأطباء والاستشاريين', enTitle: 'Physicians & Consultants', arDesc: 'بناء العلامة الشخصية والسمعة الطبية.', enDesc: 'Establishing digital thought leadership.' },
              { icon: 'local_hospital', arTitle: 'المراكز الطبية', enTitle: 'Medical Clinics & Centers', arDesc: 'تسويق متكامل وشامل لجميع التخصصات.', enDesc: 'Unified strategic marketing for multi-specialty.' },
              { icon: 'domain', arTitle: 'المستشفيات الخاصة', enTitle: 'Private Hospitals', arDesc: 'إدارة الحضور المؤسسي الرقمي وقنوات المرضى.', enDesc: 'Optimizing corporate healthcare paths.' },
              { icon: 'medical_services', arTitle: 'العيادات التخصصية', enTitle: 'Specialized Clinics', arDesc: 'عيادات التجميل، الأسنان، الجلدية، والقلب.', enDesc: 'Cosmetic surgery, aesthetics, and dentistry.' }
            ].map((audience, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 text-center hover:border-cyan-400/40 select-none">
                <span className="material-symbols-outlined text-cyan-400 text-5xl mb-4">{audience.icon}</span>
                <h3 className="text-base font-bold text-white mb-2">{isRtl ? audience.arTitle : audience.enTitle}</h3>
                <p className="text-xs text-slate-400">{isRtl ? audience.arDesc : audience.enDesc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Members */}
        <section className="py-24 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {isRtl ? 'فريق العمل' : 'Our Team Experts'}
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                {isRtl 
                  ? 'مبدعون ومختصون طبيون يجمعهم هدف واحد: نمو علامتكم الصحية وتفوقها.' 
                  : 'Creative and digital masterminds joined by a singular vision: patient acquisition and stellar branding.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { nameAr: 'مستشار تسويق رقمي طبي', nameEn: 'Clinical Growth Lead', roleAr: 'عضو فريق عمل استراتيجي', roleEn: 'Senior Medical Growth Advisor' },
                { nameAr: 'مطور ويب وتجربة المريض', nameEn: 'UX Patient-Path Architect', roleAr: 'مهندس الحلول الطبية الرقمية', roleEn: 'Fullstack Systems Architect' },
                { nameAr: 'صانع محتوى طبي مرخص', nameEn: 'Clinical Copywriter', roleAr: 'مختص تبسيط المعرفة الطبية', roleEn: 'MOH Compliant Content Lead' }
              ].map((member, idx) => (
                <div key={idx} className="glass-card p-8 rounded-2xl flex flex-col items-center text-center select-none">
                  <div className="w-24 h-24 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-6">
                    <span className="material-symbols-outlined text-5xl">person</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5">
                    {isRtl ? member.nameAr : member.nameEn}
                  </h3>
                  <p className="text-xs text-cyan-400 font-semibold">
                    {isRtl ? member.roleAr : member.roleEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic CTA */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="glass-card p-12 md:p-20 rounded-[2rem] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-950/20 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                {isRtl ? 'انضم إلى قائمة شركاء النجاح بالقطاع الصحي' : 'Join Elite Healthcare Providers In Riyadh'}
              </h2>
              <p className="text-sm md:text-base text-slate-400 mb-10 max-w-xl mx-auto">
                {isRtl 
                  ? 'اتخذ الخطوة الأولى نحو بناء حضور رقمي طبي قوي وجاذب لعيادتك اليوم.' 
                  : 'Elevate your online authority, multiply bookings, and govern patient loyalty with us.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href={getHref('contact')} 
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4.5 rounded-xl hover:scale-105 transition-transform shadow-lg cursor-pointer"
                >
                  {isRtl ? 'احجز استشارة مجانية' : 'Book a Diagnostic Call'}
                </Link>
                <Link 
                  href={getHref('services')} 
                  className="glass-card text-white px-8 py-4.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  {isRtl ? 'خدماتنا الطبية' : 'Our Medical Services'}
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
