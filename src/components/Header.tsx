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

  const logoText = locale === 'ar' 
    ? (data.content['logo_text_ar'] || 'ديجيتال هيلث') 
    : (data.content['logo_text_en'] || 'Digital Health');

  const navItems = [
    { name_ar: 'الرئيسية', name_en: 'Home', path: '' },
    { name_ar: 'من نحن', name_en: 'About Us', path: 'about' },
    { name_ar: 'خدماتنا', name_en: 'Services', path: 'services' },
    { name_ar: 'أعمالنا', name_en: 'Portfolio', path: 'portfolio' },
    { name_ar: 'مقالات', name_en: 'Blog', path: 'blog' },
    { name_ar: 'أسئلة', name_en: 'FAQ', path: 'faq' },
    { name_ar: 'تواصل معنا', name_en: 'Contact Us', path: 'contact' },
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
    router.push(targetPath);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--surface-color)]/70 backdrop-blur-xl border-b border-white/5 shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-12 h-20">
        
        {/* Brand Logo */}
        <Link 
          href={locale === 'en' ? '/en' : '/'} 
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-[var(--secondary-color)] bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          {logoText}
        </Link>

        {/* Desktop Navbar Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const name = locale === 'ar' ? item.name_ar : item.name_en;
            return (
              <Link
                key={item.path}
                href={getHref(item.path)}
                className={`text-sm font-semibold transition-all duration-200 ${
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
        <div className="flex lg:hidden items-center gap-4">
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
        <div className="lg:hidden bg-[var(--surface-color)]/95 border-t border-white/5 px-6 py-6 flex flex-col gap-4 shadow-xl">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const name = locale === 'ar' ? item.name_ar : item.name_en;
            return (
              <Link
                key={item.path}
                href={getHref(item.path)}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold py-1.5 block transition-colors ${
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
