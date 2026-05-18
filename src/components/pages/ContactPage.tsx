'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function ContactPage() {
  const { t, locale, data } = useContent();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [clientType, setClientType] = useState('طبيب');
  const [specialty, setSpecialty] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState('أقل من 5,000 ريال');
  const [referrer, setReferrer] = useState('جوجل');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRtl = locale === 'ar';

  const heading = t('contact_heading', 'تواصل معنا لتطوير حضورك الرقمي');
  const description = t('contact_description', 'خطوتك الأولى نحو بناء سمعة طبية قوية وجذب المزيد من المرضى لعيادتك أو مركزك الطبي بالرياض تبدأ من هنا.');

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  const handleCheckboxChange = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      alert(isRtl ? 'الرجاء تحديد خدمة مطلوبة واحدة على الأقل.' : 'Please select at least one clinical service.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit lead to our database API
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          clientType,
          specialty,
          services: selectedServices,
          budget,
          referrer,
          message
        })
      });

      // 2. Open WhatsApp fallback prefilled text
      const servicesString = selectedServices.join(', ');
      const waText = `مرحباً، تم تقديم طلب استشارة جديد من الموقع الإلكتروني:%0A%0A` +
                     `*الاسم:* ${encodeURIComponent(fullName)}%0A` +
                     `*الجوال:* ${encodeURIComponent(phone)}%0A` +
                     `*الإيميل:* ${encodeURIComponent(email)}%0A` +
                     `*نوع العميل:* ${encodeURIComponent(clientType)}%0A` +
                     `*التخصص:* ${encodeURIComponent(specialty)}%0A` +
                     `*الخدمات:* ${encodeURIComponent(servicesString)}%0A` +
                     `*الميزانية:* ${encodeURIComponent(budget)}%0A` +
                     `*كيف عرف عنا:* ${encodeURIComponent(referrer)}%0A` +
                     `*الرسالة:* ${encodeURIComponent(message)}`;

      // Open WhatsApp prefilled text in a new tab
      window.open(`https://wa.me/966541659332?text=${waText}`, '_blank');

      // Redirect current page to Thank You page
      router.push(getHref('thank-you'));

    } catch (error) {
      console.error('Submission failed', error);
      alert(isRtl ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.' : 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const servicesList = [
    { ar: 'الهوية الطبية الرقمية الفاخرة', en: 'Premium Digital Identity' },
    { ar: 'إدارة السوشيال ميديا الطبية', en: 'Clinical Social Media' },
    { ar: 'تحسين محركات البحث السيو الطبي', en: 'Practice SEO Dominance' },
    { ar: 'الإعلانات الممولة والاستحواذ', en: 'Targeted Patient Ads' },
    { ar: 'إدارة السيرة والسمعة الطبية', en: 'Reputation Governance' },
    { ar: 'تصميم المواقع والتطبيقات الطبية', en: 'Luxury Medical Web' }
  ];

  return (
    <>
      <Header />
      
      <main className={`flex-grow pt-40 pb-24 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} selection:bg-cyan-500 selection:text-slate-900 animate-fade-in`}>
        
        {/* Contact Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12 select-none relative overflow-hidden rounded-3xl py-12 px-8">
          {data?.content?.['contact_bg_img'] && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none z-0"
              style={{ backgroundImage: `url(${data.content['contact_bg_img']})` }}
            />
          )}
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-lg mb-6 inline-block">
              {t('contact_badge', 'احجز موعد استشارتك')}
            </span>
            <h1 className={`text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight ${isRtl ? 'text-right' : 'text-left'}`}>
              {heading}
            </h1>
            <p className={`text-base md:text-lg text-slate-300 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
              {description}
            </p>
          </div>
        </section>

        {/* Contact Layout */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 text-slate-300">
          
          {/* Contact Form card */}
          <div className="lg:col-span-7 glass-card p-8 md:p-12 rounded-2xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="full-name">
                  {isRtl ? 'الاسم الكامل *' : 'Full Professional Name *'}
                </label>
                <input 
                  id="full-name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-950/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm" 
                  placeholder={isRtl ? "د. أحمد محمد" : "Dr. Ahmad Mohammad"} 
                  type="text" 
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="phone">
                  {isRtl ? 'رقم الجوال *' : 'Phone Number *'}
                </label>
                <input 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-950/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm font-semibold text-left" 
                  placeholder="+966 50 000 0000" 
                  type="tel" 
                  required 
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="email">
                  {isRtl ? 'البريد الإلكتروني *' : 'Clinical Email *'}
                </label>
                <input 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm font-semibold text-left" 
                  placeholder="dr.ahmad@clinic.com" 
                  type="email" 
                  required 
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="client-type">
                  {isRtl ? 'نوع المرفق *' : 'Practice Type *'}
                </label>
                <select 
                  id="client-type" 
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  className="bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm cursor-pointer"
                >
                  <option value="طبيب">{isRtl ? 'طبيب (عيادة فردية)' : 'Physician (Solo Practice)'}</option>
                  <option value="مركز طبي">{isRtl ? 'مركز طبي تخصصي' : 'Medical Center'}</option>
                  <option value="مستشفى">{isRtl ? 'مستشفى خاص' : 'Private Hospital'}</option>
                  <option value="عيادة تخصصية">{isRtl ? 'عيادة تجميل/جلدية' : 'Aesthetic Clinic'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="specialty">
                  {isRtl ? 'التخصص الطبي *' : 'Clinical Specialty *'}
                </label>
                <input 
                  id="specialty" 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="bg-slate-950/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm" 
                  placeholder={isRtl ? "مثال: أسنان، جلدية، تجميل" : "e.g. Dentistry, Aesthetics, Laser"} 
                  type="text" 
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 mb-2">
                  {isRtl ? 'الخدمة المطلوبة (يمكنك اختيار أكثر من خدمة) *' : 'Required services (multiple choice) *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.map((item, idx) => {
                    const label = isRtl ? item.ar : item.en;
                    const value = item.ar;
                    const isChecked = selectedServices.includes(value);
                    return (
                      <label 
                        key={idx} 
                        className={`flex items-center gap-3 p-3 bg-slate-950/20 rounded-xl border cursor-pointer hover:border-cyan-400 transition-all select-none ${
                          isChecked ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(value)}
                          className="rounded border-white/20 text-cyan-400 focus:ring-cyan-400 bg-slate-950"
                        />
                        <span className="text-xs font-semibold text-white">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="budget">
                  {isRtl ? 'الميزانية التقريبية *' : 'Monthly Marketing Budget *'}
                </label>
                <select 
                  id="budget" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm cursor-pointer"
                >
                  <option value="أقل من 5,000 ريال">{isRtl ? 'أقل من 5,000 ريال سعودي' : 'Under 5,000 SAR'}</option>
                  <option value="5,000 - 10,000 ريال">{isRtl ? '5,000 – 10,000 ريال سعودي' : '5,000 - 10,000 SAR'}</option>
                  <option value="أكثر من 10,000 ريال">{isRtl ? 'أكثر من 10,000 ريال سعودي' : 'Over 10,000 SAR'}</option>
                  <option value="غير محدد">{isRtl ? 'غير محدد' : 'Undecided'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="referrer">
                  {isRtl ? 'كيف عرفت عنا؟ *' : 'How did you find us? *'}
                </label>
                <select 
                  id="referrer" 
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                  className="bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm cursor-pointer"
                >
                  <option value="جوجل">{isRtl ? 'محرك البحث جوجل' : 'Google Search'}</option>
                  <option value="سوشيال ميديا">{isRtl ? 'منصات التواصل الاجتماعي' : 'Social Platforms'}</option>
                  <option value="توصية">{isRtl ? 'توصية من ممارس طبي زميل' : 'Clinical Peer referral'}</option>
                  <option value="إعلان">{isRtl ? 'إعلان ممول' : 'Paid Ad'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400" htmlFor="message">
                  {isRtl ? 'الرسالة' : 'Additional Message details'}
                </label>
                <textarea 
                  id="message" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-slate-950/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-cyan-400 text-sm resize-none" 
                  placeholder={isRtl ? "اشرح لنا أهداف عيادتك والنتائج التي تطمح لتحقيقها..." : "Tell us about your clinic scale target, monthly bookings goal..."} 
                  rows={4}
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-4 rounded-xl font-extrabold hover:scale-[1.01] transition-all shadow-lg flex items-center justify-center gap-2 group text-base cursor-pointer disabled:opacity-50" 
                  type="submit"
                >
                  <span>{isSubmitting ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال طلب الاستشارة الطبية' : 'Submit Consultation Request')}</span>
                  <span className={`material-symbols-outlined text-base group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`}>
                    arrow_forward
                  </span>
                </button>
              </div>

            </form>
          </div>

          {/* Sidebar location details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Headquarters details */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-cyan-400 shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {t('contact_hq_title', 'المقر الرئيسي بالرياض')}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t('contact_hq_address', 'الأمير عبدالعزيز بن مساعد بن جلوي – المربع – الرياض – السعودية')}
                  </p>
                </div>
              </div>
              <div className="aspect-video w-full rounded-xl bg-slate-950/60 border border-white/5 overflow-hidden relative">
                <iframe 
                  className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                  src={t('contact_map_iframe', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9782522502677!2d46.708890784999994!3d24.6589332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03f7e5d8f63b%3A0xe5a3c08cd4ad4e2c!2sPrince%20Prince%20Abdulaziz%20Bin%20Musaid%20Bin%20Jalawi%20St%2C%20Al%20Murabba%2C%20Riyadh%2012628!5e0!3m2!1sen!2ssa!4v1700000000000')} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Quick whatsapp link */}
            <a 
              className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:border-[#25D366]/40 transition-all group cursor-pointer" 
              href="https://wa.me/966541659332" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/20 shrink-0 text-[#25D366]">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <div className="flex-grow">
                <p className="text-[10px] text-slate-400">
                  {isRtl ? 'اتصال سريع وفوري' : 'Fast WhatsApp Direct Connect'}
                </p>
                <p className="text-sm font-bold text-white tracking-wide text-right dir-ltr" dir="ltr">
                  +966 54 165 9332
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-transform">
                arrow_forward_ios
              </span>
            </a>

            {/* Support email details */}
            <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0 text-cyan-400">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">
                  {isRtl ? 'البريد الإلكتروني للشركة' : 'Corporate clinical Email'}
                </p>
                <p className="text-sm font-bold text-white">
                  Info@DigitalHealth-sa.com
                </p>
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
