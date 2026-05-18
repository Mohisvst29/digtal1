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
      
      <main className={`flex-grow pt-20 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900 animate-fade-in`}>
        
        {/* About Hero Section */}
        <section className="relative min-h-[500px] flex items-center justify-center py-20 px-6 md:px-12 bg-slate-950/30">
          {data?.content?.['about_img'] && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none z-0"
              style={{ backgroundImage: `url(${data.content['about_img']})` }}
            />
          )}
          <div className="absolute inset-0 bg-slate-950/80 z-0"></div>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-20 w-96 h-96 bg-cyan-400 opacity-[0.03] blur-[120px] rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center z-10">
            <span className="inline-block px-3.5 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-500/10 font-bold text-xs text-cyan-400 tracking-wider mb-6">
              {t('about_badge', 'تأسست في الرياض')}
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
                {t('about_cta_btn_secondary', 'خدماتنا الطبية')}
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
                {t('about_vision_title', 'رؤيتنا')}
              </h2>
              <p className={`text-sm md:text-base text-slate-300 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {t('about_vision_desc', 'أن نكون الشريك الرقمي الأول لنمو القطاع الصحي في المملكة العربية السعودية عبر استراتيجيات تسويق طبي مبنية على الثقة وبناء المصداقية وتحقيق نتائج قابلة للقياس تدعم نمو المنشآت الطبية وتزيد وصولها للمرضى.')}
              </p>
            </div>

            {/* Mission */}
            <div className="glass-card p-10 md:p-12 rounded-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors"></div>
              <span className="material-symbols-outlined text-cyan-400 text-5xl mb-6 block">rocket_launch</span>
              <h2 className={`text-2xl md:text-3xl font-extrabold text-white mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
                {t('about_mission_title', 'رسالتنا')}
              </h2>
              <p className={`text-sm md:text-base text-slate-300 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                {t('about_mission_desc', 'نساعد مقدمي الرعاية الصحية على جذب المرضى المناسبين، بناء سيرة مهنية قوية، وتحقيق نمو مستدام باستخدام التسويق الرقمي، مع الالتزام الكامل بأخلاقيات المجال الطبي والمعايير المهنية.')}
              </p>
            </div>

          </div>
        </section>

        {/* Why we are different */}
        <section className="py-24 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {t('about_why_title', 'لماذا نختلف؟')}
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                {t('about_why_desc', 'على عكس الوكالات التسويقية العامة، نحن متخصصون في التسويق الطبي فقط ونفهم الفروق الدقيقة لمسار الرعاية الطبية.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: 'psychology', titleKey: 'about_why_feat1_title', descKey: 'about_why_feat1_desc', titleDef: 'سيكولوجية المريض', descDef: 'فهم عميق لطريقة تفكير المرضى وعقليتهم وما الذي يدفعهم للاختيار والحجز وثقة الممارس.' },
                { icon: 'location_on', titleKey: 'about_why_feat2_title', descKey: 'about_why_feat2_desc', titleDef: 'خبرة بالسوق السعودي', descDef: 'معرفة تامة بسلوكيات المرضى والمنافسة ومؤسسات الرعاية الصحية بالرياض.' },
                { icon: 'analytics', titleKey: 'about_why_feat3_title', descKey: 'about_why_feat3_desc', titleDef: 'قرارات مبنية على البيانات', descDef: 'تحليل دقيق ومستمر لكل خطوة تسويقية لضمان أعلى عائد استثماري للعيادة والمركز.' },
                { icon: 'health_and_safety', titleKey: 'about_why_feat4_title', descKey: 'about_why_feat4_desc', titleDef: 'الالتزام بأخلاقيات المهنة', descDef: 'المحافظة المطلقة على سرية ومعايير وأخلاقيات التسويق الطبي المعتمدة بالمملكة.' },
                { icon: 'tune', titleKey: 'about_why_feat5_title', descKey: 'about_why_feat5_desc', titleDef: 'استراتيجيات مخصصة', descDef: 'خطط نمو وتواصل فريدة مصممة خصيصاً لكل تخصص طبي بمفرده.' },
                { icon: 'verified', titleKey: 'about_why_feat6_title', descKey: 'about_why_feat6_desc', titleDef: 'تخصص طبي حصري', descDef: 'التركيز التام 100% على الرعاية الصحية والطبية دون تشتت في قطاعات تجارية أخرى.' }
              ].map((item, idx) => (
                <div key={idx} className="p-8 bg-slate-900 rounded-2xl border border-white/5 flex flex-col items-start select-none">
                  <span className="material-symbols-outlined text-cyan-400 text-4xl mb-4">{item.icon}</span>
                  <h4 className={`text-lg font-bold text-white mb-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t(item.titleKey, item.titleDef)}
                  </h4>
                  <p className={`text-xs text-slate-400 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t(item.descKey, item.descDef)}
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
              {t('about_audience_title', 'عملاؤنا المستهدفون')}
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
              {t('about_audience_desc', 'نصمم خدماتنا لتناسب مختلف فئات مقدمي الرعاية الصحية:')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'person', titleKey: 'about_audience_item1_title', descKey: 'about_audience_item1_desc', titleDef: 'الأطباء والاستشاريين', descDef: 'بناء العلامة الشخصية والسمعة الطبية.' },
              { icon: 'local_hospital', titleKey: 'about_audience_item2_title', descKey: 'about_audience_item2_desc', titleDef: 'المراكز الطبية', descDef: 'تسويق متكامل وشامل لجميع التخصصات.' },
              { icon: 'domain', titleKey: 'about_audience_item3_title', descKey: 'about_audience_item3_desc', titleDef: 'المستشفيات الخاصة', descDef: 'إدارة الحضور المؤسسي الرقمي وقنوات المرضى.' },
              { icon: 'medical_services', titleKey: 'about_audience_item4_title', descKey: 'about_audience_item4_desc', titleDef: 'العيادات التخصصية', descDef: 'عيادات التجميل، الأسنان، الجلدية، والقلب.' }
            ].map((audience, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 text-center hover:border-cyan-400/40 select-none">
                <span className="material-symbols-outlined text-cyan-400 text-5xl mb-4">{audience.icon}</span>
                <h3 className="text-base font-bold text-white mb-2">{t(audience.titleKey, audience.titleDef)}</h3>
                <p className="text-xs text-slate-400">{t(audience.descKey, audience.descDef)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Members */}
        <section className="py-24 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {t('about_team_title', 'فريق العمل')}
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
                {t('about_team_desc', 'مبدعون ومختصون طبيون يجمعهم هدف واحد: نمو علامتكم الصحية وتفوقها.')}
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
                {t('about_cta_title', 'انضم إلى قائمة شركاء النجاح بالقطاع الصحي')}
              </h2>
              <p className="text-sm md:text-base text-slate-400 mb-10 max-w-xl mx-auto">
                {t('about_cta_desc', 'اتخذ الخطوة الأولى نحو بناء حضور رقمي طبي قوي وجاذب لعيادتك اليوم.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href={getHref('contact')} 
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4.5 rounded-xl hover:scale-105 transition-transform shadow-lg cursor-pointer"
                >
                  {t('about_cta_btn_primary', 'احجز استشارة مجانية')}
                </Link>
                <Link 
                  href={getHref('services')} 
                  className="glass-card text-white px-8 py-4.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  {t('about_cta_btn_secondary', 'خدماتنا الطبية')}
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
