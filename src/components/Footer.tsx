'use client';

import React from 'react';
import Link from 'next/link';
import { useContent } from './ContentProvider';

export default function Footer() {
  const { t, locale, data } = useContent();

  const logoText = locale === 'ar' 
    ? (data.content['logo_text_ar'] || 'ديجيتال هيلث') 
    : (data.content['logo_text_en'] || 'Digital Health');

  const phone = data.content['contact_phone'] || '+9660541659332';
  const email = data.content['contact_email'] || 'info@digitalhealth.agency';
  const address = locale === 'ar' 
    ? (data.content['contact_address'] || 'طريق الملك فهد، العليا، الرياض، المملكة العربية السعودية')
    : 'King Fahd Road, Al Olaya, Riyadh, Saudi Arabia';

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  return (
    <footer className="relative w-full bg-slate-950 border-t border-white/5 shadow-2xl overflow-hidden select-none">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-cyan-400 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
        
        {/* About digital agency */}
        <div className="flex flex-col items-start md:items-start text-right">
          <Link 
            href={locale === 'en' ? '/en' : '/'} 
            className="flex items-center mb-4 hover:opacity-90 transition-opacity"
          >
            {data.content['logo_img'] ? (
              <img 
                src={data.content['logo_img']} 
                alt={logoText} 
                style={{ width: `${parseInt(data.content['logo_width'] || '150', 10)}px`, height: 'auto', maxHeight: '120px' }}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-[var(--secondary-color)] bg-clip-text text-transparent font-sans">
                {logoText}
              </span>
            )}
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
            {locale === 'ar' 
              ? 'شريك النمو والتسويق الرقمي الطبي المتكامل الأول للأطباء والعيادات والمراكز الطبية المتخصصة بالرياض.' 
              : 'The leading clinical digital marketing & strategic growth partner for elite clinics and medical centers in Riyadh.'}
          </p>
          <div className="flex flex-wrap gap-2.5 justify-start items-center">
            {(() => {
              const socialPlatforms = [
                { key: 'social_linkedin', label: 'LinkedIn', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                { key: 'social_facebook', label: 'Facebook', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> },
                { key: 'social_tiktok', label: 'TikTok', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.2 1.22 1.25 2.89 1.86 4.6 1.94v3.89c-1.64-.15-3.23-.74-4.57-1.72-.17-.12-.34-.26-.5-.4v6.62c.03 2.53-1.12 4.93-3.09 6.54-2.61 2.14-6.38 2.37-9.25.56-3.05-1.93-4.59-5.78-3.72-9.33.67-2.75 2.76-5.07 5.56-5.83 1.24-.34 2.53-.35 3.79-.05v3.91c-.81-.24-1.69-.21-2.48.11-1.46.59-2.45 2.09-2.41 3.67.03 1.83 1.41 3.43 3.23 3.68 1.88.26 3.72-1.04 3.99-2.91.05-.33.06-.67.06-1V0z"/></svg> },
                { key: 'social_instagram', label: 'Instagram', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { key: 'social_snapchat', label: 'Snapchat', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2c-3.456 0-5.845 2.164-5.845 4.957 0 2.137.666 3.125 1.424 4.256.12.18.232.348.332.518-.088.082-.2.152-.336.216-1.004.472-2.936 1.428-2.936 3.738 0 1.157.943 2.057 2.106 2.057.29 0 .61-.056.953-.169-.044.204-.067.411-.067.622 0 1.583 1.83 2.148 4.372 2.148s4.372-.565 4.372-2.148c0-.211-.023-.418-.067-.622.343.113.663.169.953.169 1.163 0 2.106-.9 2.106-2.057 0-2.31-1.932-3.266-2.936-3.738-.136-.064-.248-.134-.336-.216.1-.17.212-.338.332-.518.758-1.131 1.424-2.119 1.424-4.256 0-2.793-2.389-4.957-5.845-4.957z"/></svg> },
                { key: 'social_behance', label: 'Behance', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 7h-7v1h7v-1zm-10.082 2.613c0-1.89-1.227-2.613-2.905-2.613h-4.013v10h3.811c2.19 0 3.107-1.127 3.107-2.641 0-1.218-.553-1.979-1.554-2.222 1.05-.28 1.554-1.109 1.554-2.524zm-4.918-1.113h1.393c.875 0 1.341.34 1.341 1.031 0 .63-.393.992-1.312.992h-1.422v-2.023zm1.611 6.5h-1.611v-2.45h1.61c.961 0 1.472.4 1.472 1.189 0 .84-.52 1.261-1.471 1.261zm11.389-2.3c0-2.825-1.93-4.7-4.707-4.7-2.923 0-4.993 2.054-4.993 4.99 0 2.871 2.01 5.01 5.176 5.01 2.451 0 4.152-1.328 4.707-3.082h-2.158c-.37.74-1.22 1.282-2.392 1.282-1.579 0-2.47-1.02-2.52-2.5h7.241c.026-.35.046-.68.046-1zm-7.141-.8c.08-1.29.9-2.2 2.227-2.2 1.23 0 2.022.86 2.092 2.2h-4.319z"/></svg> },
                { key: 'social_x', label: 'X', icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { key: 'social_youtube', label: 'YouTube', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> }
              ];

              const activePlatforms = socialPlatforms.filter(p => data.content[p.key]);

              if (activePlatforms.length === 0) {
                return (
                  <p className="text-[10px] text-slate-500 font-bold">
                    {locale === 'ar' ? 'لم يتم تكوين شبكات بعد' : 'No networks set'}
                  </p>
                );
              }

              return activePlatforms.map((p) => {
                const url = data.content[p.key];
                return (
                  <a 
                    key={p.key}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={p.label}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-white/5 hover:border-cyan-400 hover:bg-cyan-400/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:scale-105 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    {p.icon}
                  </a>
                );
              });
            })()}
          </div>
        </div>

        {/* Services Links Column */}
        <div className="text-right">
          <h6 className="text-xs font-bold text-white uppercase tracking-widest mb-6">
            {locale === 'ar' ? 'الخدمات الرقمية' : 'Digital Services'}
          </h6>
          <ul className="space-y-3.5 text-sm text-slate-400">
            <li>
              <Link href={getHref('services')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'الهوية الطبية الفاخرة' : 'Luxury Medical Identity'}
              </Link>
            </li>
            <li>
              <Link href={getHref('services')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'تحسين محركات البحث السريري' : 'Clinical Medical SEO'}
              </Link>
            </li>
            <li>
              <Link href={getHref('services')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'حملات إعلانات الحجوزات' : 'Paid Patient Ads'}
              </Link>
            </li>
            <li>
              <Link href={getHref('services')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'تصميم المواقع الطبية الفاخرة' : 'Premium Medical Websites'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Navigation / Company Column */}
        <div className="text-right">
          <h6 className="text-xs font-bold text-white uppercase tracking-widest mb-6">
            {locale === 'ar' ? 'الشركة' : 'Our Agency'}
          </h6>
          <ul className="space-y-3.5 text-sm text-slate-400">
            <li>
              <Link href={getHref('about')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'من نحن' : 'Who We Are'}
              </Link>
            </li>
            <li>
              <Link href={getHref('portfolio')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'دراسات الحالة' : 'Case Studies'}
              </Link>
            </li>
            <li>
              <Link href={getHref('blog')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'المقالات والبحوث' : 'Articles & Research'}
              </Link>
            </li>
            <li>
              <Link href={getHref('contact')} className="hover:text-cyan-400 transition-colors">
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Riyadh HQ / Direct Info */}
        <div className="text-right">
          <h6 className="text-xs font-bold text-white uppercase tracking-widest mb-6">
            {locale === 'ar' ? 'مكتب الرياض الرئيسي' : 'Riyadh HQ office'}
          </h6>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {address}
          </p>
          <p className="text-sm text-cyan-400 font-bold mb-1.5" dir="ltr">
            {phone}
          </p>
          <p className="text-sm text-slate-300 font-semibold select-all">
            {email}
          </p>
        </div>

      </div>

      {/* Copyright area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right select-none">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} {logoText}. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>
        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#" className="hover:text-cyan-400 transition-colors">{locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
        </div>
      </div>

    </footer>
  );
}
