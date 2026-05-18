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
                style={{ width: `${parseInt(data.content['logo_width'] || '150', 10)}px`, height: 'auto', maxHeight: '60px' }}
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
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full border border-white/5 hover:border-cyan-400 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all">
              <span className="material-symbols-outlined text-base">share</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/5 hover:border-cyan-400 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all">
              <span className="material-symbols-outlined text-base">forum</span>
            </a>
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
