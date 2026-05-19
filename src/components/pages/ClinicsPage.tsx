'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function ClinicsPage() {
  const { t, locale, data, loading } = useContent();

  const isRtl = locale === 'ar';

  const heading = t('clinics_title', 'العيادات والمراكز الطبية');
  const description = t('clinics_description', 'تعرف على أفضل العيادات والمراكز الطبية المجهزة بأحدث التقنيات.');

  const dbClinics = data.clinics || [];

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <main className={`flex-grow pt-32 pb-24 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} animate-fade-in`}>
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center select-none relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
            {heading}
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </section>

        {/* Clinics Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-cyan-500 animate-pulse text-sm font-bold gap-3">
              <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{isRtl ? 'جاري تحميل المراكز...' : 'Loading centers...'}</span>
            </div>
          ) : dbClinics.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-lg font-semibold select-none">
              {isRtl ? 'لا يوجد عيادات أو مراكز حالياً' : 'No clinics or centers currently.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {dbClinics.map((clinic: any, idx: number) => {
                const name = isRtl ? clinic.name_ar : clinic.name_en;
                const spec = isRtl ? clinic.specialty_ar : clinic.specialty_en;
                const desc = isRtl ? clinic.desc_ar : clinic.desc_en;
                
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100"
                  >
                    <div className="aspect-video w-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
                      {clinic.image_url ? (
                        <img 
                          src={clinic.image_url} 
                          alt={name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 text-7xl group-hover:scale-110 transition-transform duration-500">
                          local_hospital
                        </span>
                      )}
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col justify-between text-center">
                      <div>
                        {spec && (
                          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3 inline-block">
                            {spec}
                          </span>
                        )}
                        <h4 className="text-xl font-bold text-slate-900 mb-2">
                          {name}
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
      
      <Footer />
      <FloatContacts />
    </div>
  );
}
