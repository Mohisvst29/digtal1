'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function ThankYouPage() {
  const { t, locale } = useContent();

  const isRtl = locale === 'ar';

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  return (
    <>
      <Header />
      
      <main className="flex-grow pt-32 pb-24 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900 bg-[#011230] min-h-screen flex flex-col justify-between">
        
        {/* Glow Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-6 w-full flex-grow flex items-center justify-center relative z-10 py-12">
          
          <div className="glass-card w-full rounded-3xl p-8 md:p-16 text-center border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Cyan Accent Ring */}
            <div className="w-16 h-16 rounded-full border-2 border-cyan-400 bg-cyan-400/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,218,243,0.3)] animate-pulse">
              <span className="material-symbols-outlined text-cyan-400 text-3xl font-bold">
                done
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight select-none">
              {t('thankyou_title', 'شكراً لك! تم استلام طلبك بنجاح.')}
            </h1>

            {/* Sub-description */}
            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('thankyou_description', 'سيقوم أحد مستشاري النمو الطبي لدينا بمراجعة تخصصك ومتطلبات ميزانيتك لإعداد استراتيجية نمو مخصصة. توقع رداً منا خلال أقل من 24 ساعة عمل.')}
            </p>

            {/* Alert / Notification Card */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950/40 border border-white/5 flex items-center gap-3.5 mb-10 text-slate-400 text-xs md:text-sm justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-lg shrink-0">
                mail
              </span>
              <span>
                {isRtl 
                  ? 'تم إرسال نسخة من تفاصيل طلب الاستشارة إلى بريدك الإلكتروني.' 
                  : 'A copy of your inquiry has been sent to your email.'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
              <Link 
                href={getHref('')} 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,218,243,0.25)] shrink-0"
              >
                {t('thankyou_btn', 'العودة للصفحة الرئيسية')}
              </Link>
              <Link 
                href={getHref('portfolio')} 
                className="w-full border border-white/10 hover:border-cyan-400 bg-slate-950/30 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-950/60 transition-all cursor-pointer shrink-0"
              >
                {isRtl ? 'استكشف دراسات الحالة' : 'Explore Our Case Studies'}
              </Link>
            </div>

            {/* WhatsApp Fallback Call */}
            <div className="border-t border-white/5 pt-8 select-none">
              <p className="text-[10px] md:text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">
                {isRtl ? 'هل تحتاج إلى مساعدة فورية وعاجلة؟' : 'Need urgent assistance?'}
              </p>
              <a 
                href="https://wa.me/966541659332" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                {isRtl ? 'تحدث معنا مباشرة عبر واتساب' : 'Chat with us on WhatsApp'}
              </a>
            </div>

          </div>

        </div>

        {/* Security Compliance badges */}
        <div className="w-full flex justify-center items-center gap-8 text-[10px] md:text-xs text-slate-500 font-bold mb-12 select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>{isRtl ? 'متوافق مع معايير وزارة الصحة والخصوصية' : 'HIPAA COMPLIANT'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>{isRtl ? 'بروتوكول تشفير آمن بالكامل' : 'SECURE PROTOCOL'}</span>
          </div>
        </div>

      </main>
      
      <Footer />
      <FloatContacts />
    </>
  );
}
