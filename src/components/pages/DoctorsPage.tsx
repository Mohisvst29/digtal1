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
  const bgImage = t('doctors_bg_image', '');

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
    <>
      <Header />
      
      <main className={`flex-grow pt-32 pb-24 overflow-x-hidden ${isRtl ? 'text-right' : 'text-left'} text-slate-300 selection:bg-cyan-500 selection:text-slate-900 animate-fade-in`}>
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center select-none relative overflow-hidden rounded-3xl mb-12">
          {bgImage ? (
            <>
              <div className="absolute inset-0 bg-cover bg-center -z-20" style={{ backgroundImage: `url(${bgImage})` }}></div>
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm -z-10"></div>
            </>
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -z-10"></div>
          )}
          
          <span className="material-symbols-outlined text-cyan-400 text-5xl mb-6 inline-block bg-white/5 p-4 rounded-3xl rotate-[-5deg] border border-white/10 shadow-sm relative z-10">
            stethoscope
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto relative z-10">
            {heading}
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed relative z-10">
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
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-[0_0_20px_rgba(0,218,243,0.3)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-400/40 hover:text-white'
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
            <div className="flex flex-col items-center justify-center py-12 text-cyan-400 animate-pulse text-sm font-bold gap-3">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>{isRtl ? 'جاري تحميل الأطباء...' : 'Loading doctors...'}</span>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-lg font-semibold select-none">
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
                    className="glass-card rounded-3xl overflow-hidden group transition-all duration-500 flex flex-col relative hover:-translate-y-2"
                  >
                    <div className="aspect-[4/5] w-full bg-slate-950/40 flex items-center justify-center relative overflow-hidden p-4">
                      {doc.image_url ? (
                        <img 
                          src={doc.image_url} 
                          alt={name} 
                          className="w-full h-full object-cover rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900/60 rounded-2xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600 text-7xl group-hover:scale-110 transition-transform duration-500">
                            person
                          </span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay for aesthetic */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl m-4 pointer-events-none"></div>
                    </div>
                    
                    <div className="p-6 pt-4 flex-grow flex flex-col justify-between text-center relative z-10">
                      <div>
                        <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-full mb-4 inline-block border border-cyan-400/20">
                          {spec}
                        </span>
                        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                          {name}
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
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
    </>
  );
}
