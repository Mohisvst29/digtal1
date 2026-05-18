'use client';

import React from 'react';
import { useContent } from './ContentProvider';

export default function FloatContacts() {
  const { locale, data } = useContent();

  const phone = data.content['contact_phone'] || '+9660541659332';
  const whatsapp = data.content['contact_whatsapp'] || '+9660541659332';

  const cleanWhatsappNumber = whatsapp.replace(/[^0-9]/g, '');

  const isRtl = locale === 'ar';

  return (
    <div 
      className={`fixed bottom-8 z-50 flex flex-col gap-4 select-none ${
        isRtl ? 'left-8' : 'right-8'
      }`}
    >
      
      {/* Glowing WhatsApp floating button */}
      <a
        href={`https://wa.me/${cleanWhatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition-all duration-300 pointer-events-auto"
        title={locale === 'ar' ? 'تواصل معنا مباشرة عبر واتساب' : 'Chat directly via WhatsApp'}
      >
        <svg 
          className="w-8 h-8 fill-current" 
          viewBox="0 0 24 24"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.936 9.936 0 0 0 4.779 1.21h.004c5.505 0 9.989-4.478 9.99-9.985A9.983 9.983 0 0 0 12.012 2zm5.799 14.123c-.253.712-1.463 1.307-2.022 1.362-.513.051-1.18.083-3.218-.762-2.599-1.079-4.247-3.722-4.377-3.894-.13-.171-1.05-1.398-1.05-2.667 0-1.269.664-1.892.901-2.148.236-.256.516-.32.688-.32.172 0 .344.001.494.009.157.008.368-.06.577.444.21.516.719 1.753.782 1.881.063.127.104.276.02.443-.083.167-.156.276-.312.459-.157.183-.328.406-.469.545-.157.155-.32.324-.138.636.182.311.808 1.334 1.733 2.158.93.829 1.716 1.085 2.037 1.241.32.155.507.13.69-.083.182-.213.782-.909.99-1.22.208-.311.416-.259.69-.156.276.104 1.752.825 2.054.977.302.151.503.228.577.355.074.127.074.739-.179 1.451z"/>
        </svg>
      </a>

      {/* Glowing Direct Phone Call Button */}
      <a
        href={`tel:${phone}`}
        className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,218,243,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(0,218,243,0.6)] hover:bg-cyan-400 transition-all duration-300 pointer-events-auto pulse-glow"
        title={locale === 'ar' ? 'اتصل بنا الآن' : 'Call us now'}
      >
        <span className="material-symbols-outlined text-3xl font-bold select-none">
          call
        </span>
      </a>

    </div>
  );
}
