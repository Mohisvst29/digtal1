'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContent } from './ContentProvider';

export default function Header() {
  const { t, locale, data } = useContent();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const logoText = locale === 'ar' 
    ? (data.content['logo_text_ar'] || 'ديجيتال هيلث') 
    : (data.content['logo_text_en'] || 'Digital Health');

  const navItems = [
    { name_ar: 'الرئيسية', name_en: 'Home', path: '' },
    { name_ar: 'من نحن', name_en: 'About Us', path: 'about' },
    { name_ar: 'خدماتنا', name_en: 'Services', path: 'services' },
    { name_ar: 'العيادات والمراكز', name_en: 'Clinics & Centers', path: 'clinics' },
    { name_ar: 'الأطباء', name_en: 'Doctors', path: 'doctors' },
    { name_ar: 'أعمالنا', name_en: 'Portfolio', path: 'portfolio' },
    { name_ar: 'مقالات', name_en: 'Blog', path: 'blog' },
    { name_ar: 'أسئلة', name_en: 'FAQ', path: 'faq' },
    { name_ar: 'تواصل معنا', name_en: 'Contact Us', path: 'contact' },
  ];

  const getServicePath = (slug: string) => {
    if (slug === 'identity') return 'services/digital-medicalidentity';
    if (slug === 'social') return 'services/medical-socialmedia';
    if (slug === 'seo') return 'services/medical-seo';
    if (slug === 'ppc') return 'services/paid-ads';
    if (slug === 'reputation') return 'services/reputation-management';
    if (slug === 'web') return 'services/medical-website';
    if (slug.startsWith('services/')) return slug;
    return `services/${slug}`;
  };

  const servicesList = data.services && data.services.length > 0 ? data.services : [
    { slug: 'identity', title_ar: 'الهوية الطبية الرقمية الفاخرة', title_en: 'Premium Clinical Brand Identity', icon: 'fingerprint' },
    { slug: 'social', title_ar: 'المحتوى والشبكات الاجتماعية', title_en: 'Medical Social Content', icon: 'share_reviews' },
    { slug: 'seo', title_ar: 'السيو الطبي التخصصي', title_en: 'Clinical Healthcare SEO', icon: 'travel_explore' },
    { slug: 'ppc', title_ar: 'الإعلانات المدفوعة الذكية', title_en: 'Targeted Patient Ads', icon: 'ads_click' },
    { slug: 'reputation', title_ar: 'إدارة السمعة والتقييمات', title_en: 'Reputation Governance', icon: 'verified' },
    { slug: 'web', title_ar: 'المواقع الطبية الفاخرة', title_en: 'High-End Medical Web', icon: 'web' },
  ];

  const getHref = (path: string) => {
    if (locale === 'en') {
      return path === '' ? '/en' : `/en/${path}`;
    }
    return path === '' ? '/' : `/${path}`;
  };

  const isActive = (itemPath: string) => {
    let cleanPath = pathname;
    if (pathname.startsWith('/en')) {
      cleanPath = pathname.replace('/en', '');
    }
    if (cleanPath === '/' || cleanPath === '') {
      return itemPath === '';
    }
    return cleanPath.replace(/^\/|\/$/g, '') === itemPath;
  };

  const toggleLanguage = () => {
    let targetPath = '';
    if (locale === 'ar') {
      targetPath = pathname === '/' ? '/en' : `/en${pathname}`;
    } else {
      targetPath = pathname.startsWith('/en') ? pathname.replace('/en', '') : pathname;
      if (targetPath === '') targetPath = '/';
    }
    window.location.href = targetPath;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#020d1f]/85 backdrop-blur-2xl border-b border-cyan-400/10 shadow-[0_1px_0_rgba(0,218,243,0.05),0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-6 md:px-12 h-20">
        
        {/* Brand Logo */}
        {(() => {
          const logoImg = data.content['logo_img'] || '';
          const logoWidth = parseInt(data.content['logo_width'] || '150', 10);
          return (
            <Link 
              href={locale === 'en' ? '/en' : '/'} 
              className="flex items-center hover:opacity-90 transition-opacity shrink max-w-[140px] sm:max-w-[180px] lg:max-w-none"
            >
              {logoImg ? (
                <img 
                  src={logoImg} 
                  alt={logoText} 
                  style={{ width: `${logoWidth}px`, height: 'auto', maxHeight: '75px' }}
                  className="object-contain w-full"
                />
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-[var(--secondary-color)] bg-clip-text text-transparent font-sans whitespace-nowrap">
                  {logoText}
                </span>
              )}
            </Link>
          );
        })()}

        {/* Desktop Navbar Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 h-full">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const name = locale === 'ar' ? item.name_ar : item.name_en;

            if (item.path === 'services') {
              return (
                <div key={item.path} className="relative group flex items-center h-full cursor-pointer py-4">
                  <Link
                    href={getHref(item.path)}
                    className={`text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-0.5 ${
                      active 
                        ? 'text-[var(--primary-color)]' 
                        : 'text-slate-300 hover:text-[var(--primary-color)]'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-350 select-none">
                      keyboard_arrow_down
                    </span>
                  </Link>

                  {/* Glassmorphic Dropdown Menu */}
                  <div className={`absolute ${locale === 'ar' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} top-full mt-0 w-85 bg-slate-900/95 border border-white/15 rounded-3xl p-4 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-350 z-50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]`}>
                    <div className="space-y-1.5">
                      {servicesList.map((serv: any) => {
                        const servName = locale === 'ar' ? (serv.title_ar || serv.title) : (serv.title_en || serv.title);
                        const servIcon = serv.icon || 'clinical_notes';
                        const path = getServicePath(serv.slug);
                        return (
                          <Link
                            key={serv.slug}
                            href={getHref(path)}
                            className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-cyan-400/5 hover:border-cyan-400/10 border border-transparent transition-all text-right group/item"
                          >
                            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover/item:bg-cyan-400 group-hover/item:text-slate-950 transition-all shrink-0">
                              <span className="material-symbols-outlined text-lg">{servIcon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold text-white group-hover/item:text-cyan-400 transition-colors truncate ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                                {servName}
                              </p>
                              <p className={`text-[10px] text-slate-400 truncate mt-0.5 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                                {locale === 'ar' ? 'عرض تفاصيل وتطبيقات الخدمة الطبية' : 'View professional clinical applications'}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                href={getHref(item.path)}
                className={`text-[13px] xl:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  active 
                    ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)] pb-1' 
                    : 'text-slate-300 hover:text-[var(--primary-color)]'
                }`}
              >
                {name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA and Locale Toggle */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[var(--primary-color)] text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">language</span>
            {locale === 'ar' ? 'English' : 'العربية'}
          </button>
          
          <Link 
            href={getHref('contact')} 
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-sm hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(0,218,243,0.2)]"
          >
            {locale === 'ar' ? 'احجز استشارة مجانية' : 'Book Free Consult'}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-4 shrink-0">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">language</span>
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--surface-color)]/95 border-t border-white/5 px-6 py-6 flex flex-col gap-4 shadow-xl max-h-[85vh] overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const name = locale === 'ar' ? item.name_ar : item.name_en;

            if (item.path === 'services') {
              return (
                <div key={item.path} className="w-full">
                  <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                    <Link
                      href={getHref(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-semibold transition-colors ${
                        active ? 'text-[var(--primary-color)]' : 'text-slate-300'
                      }`}
                    >
                      {name}
                    </Link>
                    <button 
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="text-slate-400 hover:text-white p-2 flex items-center justify-center cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                  </div>
                  {mobileServicesOpen && (
                    <div className={`mt-2 ${locale === 'ar' ? 'mr-4 pr-3 border-r' : 'ml-4 pl-3 border-l'} border-cyan-400/20 space-y-3 animate-fade-in`}>
                      {servicesList.map((serv: any) => {
                        const servName = locale === 'ar' ? (serv.title_ar || serv.title) : (serv.title_en || serv.title);
                        const path = getServicePath(serv.slug);
                        return (
                          <Link
                            key={serv.slug}
                            href={getHref(path)}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-slate-400 hover:text-cyan-400 py-1 transition-colors"
                          >
                            • {servName}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                href={getHref(item.path)}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold py-1.5 block transition-colors border-b border-white/5 ${
                  active 
                    ? 'text-[var(--primary-color)]' 
                    : 'text-slate-300 hover:text-[var(--primary-color)]'
                }`}
              >
                {name}
              </Link>
            );
          })}
          
          <Link 
            href={getHref('contact')} 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-cyan-500 text-slate-950 text-center font-bold py-3 rounded-lg text-sm mt-4 hover:bg-cyan-400 transition-colors shadow-lg block"
          >
            {locale === 'ar' ? 'احجز استشارة مجانية' : 'Book Free Consult'}
          </Link>
        </div>
      )}
    </header>
  );
}
