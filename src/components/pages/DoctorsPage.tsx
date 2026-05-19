'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

export default function DoctorsPage() {
  const { t, locale, data, loading } = useContent();
  const [activeSpecialty, setActiveSpecialty] = useState('all');

  const isRtl = locale === 'ar';

  const heading = t('doctors_title', 'نخبة من أفضل الأطباء');
  const description = t('doctors_description', 'تعرف على كادرنا الطبي المتميز في مختلف التخصصات الطبية.');

  const dbDoctors = data.doctors || [];

  // Extract unique specialties from doctors
  const specialtiesSet = new Set<string>();
  dbDoctors.forEach((doc: any) => {
    if (isRtl && doc.specialty_ar) specialtiesSet.add(doc.specialty_ar);
    if (!isRtl && doc.specialty_en) specialtiesSet.add(doc.specialty_en);
  });

  // Default specialties if db is empty
  if (specialtiesSet.size === 0) {
    if (isRtl) {
      ['أطفال', 'جراحة', 'باطنة', 'نساء وولادة', 'تجميل'].forEach(s => specialtiesSet.add(s));
    } else {
      ['Pediatrics', 'Surgery', 'Internal Medicine', 'Obstetrics & Gynecology', 'Cosmetics'].forEach(s => specialtiesSet.add(s));
    }
  }

  const specialties = ['all', ...Array.from(specialtiesSet)];

  const filteredDoctors = dbDoctors.filter((doc: any) => {
    if (activeSpecialty === 'all') return true;
    return isRtl ? doc.specialty_ar === activeSpecialty : doc.specialty_en === activeSpecialty;
  });

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

        {/* Filter Categories */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12 select-none">
          <div className="flex flex-wrap justify-center gap-3">
            {specialties.map((spec) => {
              const label = spec === 'all' ? (isRtl ? 'الكل' : 'All') : spec;
              const isActive = activeSpecialty === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setActiveSpecialty(spec)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500 text-white border-cyan-500 shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-cyan-500'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-cyan-500 animate-pulse text-sm font-bold gap-3">
              <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{isRtl ? 'جاري تحميل الأطباء...' : 'Loading doctors...'}</span>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-lg font-semibold select-none">
              {isRtl ? 'لا يوجد أطباء في هذا التخصص حالياً' : 'No doctors in this specialty currently.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDoctors.map((doc: any, idx: number) => {
                const name = isRtl ? doc.name_ar : doc.name_en;
                const spec = isRtl ? doc.specialty_ar : doc.specialty_en;
                const desc = isRtl ? doc.desc_ar : doc.desc_en;
                
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100"
                  >
                    <div className="aspect-square w-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
                      {doc.image_url ? (
                        <img 
                          src={doc.image_url} 
                          alt={name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 text-7xl group-hover:scale-110 transition-transform duration-500">
                          person
                        </span>
                      )}
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col justify-between text-center">
                      <div>
                        <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3 inline-block">
                          {spec}
                        </span>
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
