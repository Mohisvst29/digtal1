'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import Footer from '../Footer';
import FloatContacts from '../FloatContacts';
import { useContent } from '../ContentProvider';

interface DoctorDetailPageProps {
  id: string;
}

export default function DoctorDetailPage({ id }: DoctorDetailPageProps) {
  const { data, loading, locale } = useContent();
  const isRtl = locale === 'ar';

  const doctor = data.doctors?.find((d: any) => d._id === id);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-32 pb-24 bg-slate-950 flex flex-col items-center justify-center text-cyan-400 min-h-screen">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-sm font-bold">{isRtl ? 'جاري تحميل ملف الطبيب...' : 'Loading profile...'}</span>
        </main>
        <Footer />
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-32 pb-24 bg-slate-950 flex flex-col items-center justify-center text-slate-400 min-h-screen text-center px-6 select-none">
          <span className="material-symbols-outlined text-6xl text-slate-650 mb-4">person_off</span>
          <h1 className="text-2xl font-bold text-white mb-2">{isRtl ? 'لم يتم العثور على الطبيب' : 'Doctor Not Found'}</h1>
          <p className="text-xs max-w-sm mb-8 leading-relaxed">
            {isRtl ? 'عذراً، الملف الشخصي لهذا الطبيب غير موجود أو تم نقله.' : 'Sorry, this doctor profile does not exist or has been moved.'}
          </p>
          <Link href={isRtl ? '/doctors' : '/en/doctors'} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs transition-transform duration-300">
            {isRtl ? 'العودة لصفحة الأطباء' : 'Back to Doctors'}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const name = isRtl ? doctor.name_ar : doctor.name_en;
  const specialty = isRtl ? doctor.specialty_ar : doctor.specialty_en;
  const desc = isRtl ? doctor.desc_ar : doctor.desc_en;
  const certsRaw = isRtl ? doctor.certificates_ar : doctor.certificates_en;
  
  // Parse certificates split by newlines
  const certificates = certsRaw 
    ? certsRaw.split('\n').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
    : [];

  return (
    <>
      <Header />
      <FloatContacts />
      
      <main className={`flex-grow pt-32 pb-24 overflow-x-hidden bg-slate-950 ${isRtl ? 'text-right' : 'text-left'} text-slate-350 selection:bg-cyan-500 selection:text-slate-900 animate-fade-in relative`}>
        
        {/* Dynamic Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,218,243,0.18)_2px,transparent_2px)] bg-[size:32px_32px] pointer-events-none select-none z-0"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Back link */}
          <Link 
            href={isRtl ? '/doctors' : '/en/doctors'} 
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-white mb-8 transition-colors select-none group"
          >
            <span className={`material-symbols-outlined text-sm transition-transform ${isRtl ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
              {isRtl ? 'arrow_forward' : 'arrow_back'}
            </span>
            <span>{isRtl ? 'العودة لقائمة الأطباء' : 'Back to Doctors List'}</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Portrait & Actions */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm aspect-[4/5] relative overflow-visible group select-none mb-8">
                {/* Glowing glow decoration */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-[2.5rem] opacity-20 blur-md group-hover:opacity-35 transition duration-1000 -z-10"></div>
                
                {doctor.image_url ? (
                  <img 
                    src={doctor.image_url} 
                    alt={name} 
                    className="w-full h-full object-contain rounded-3xl hover:scale-[1.03] transition-transform duration-700 ease-out animate-float-slow"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900/60 rounded-[2.5rem] border border-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-700 text-8xl">
                      person
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic Action Buttons */}
              <div className="w-full max-w-sm space-y-3.5 select-none">
                <a
                  href={`https://wa.me/${(data.content['phone'] || '966560875412').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isRtl ? `مرحباً، أود حجز موعد مع الدكتور ${name}` : `Hello, I would like to book a consultation with Dr. ${name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-[1.02]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.936 9.936 0 0 0 4.779 1.21h.004c5.505 0 9.989-4.478 9.99-9.985A9.983 9.983 0 0 0 12.012 2zm5.799 14.123c-.253.712-1.463 1.307-2.022 1.362-.513.051-1.18.083-3.218-.762-2.599-1.079-4.247-3.722-4.377-3.894-.13-.171-1.05-1.398-1.05-2.667 0-1.269.664-1.892.901-2.148.236-.256.516-.32.688-.32.172 0 .344.001.494.009.157.008.368-.06.577.444.21.516.719 1.753.782 1.881.063.127.104.276.02.443-.083.167-.156.276-.312.459-.157.183-.328.406-.469.545-.157.155-.32.324-.138.636.182.311.808 1.334 1.733 2.158.93.829 1.716 1.085 2.037 1.241.32.155.507.13.69-.083.182-.213.782-.909.99-1.22.208-.311.416-.259.69-.156.276.104 1.752.825 2.054.977.302.151.503.228.577.355.074.127.074.739-.179 1.451z"/>
                  </svg>
                  <span>{isRtl ? 'حجز موعد عيادة فوري' : 'Book Instant Appointment'}</span>
                </a>
                <Link
                  href={isRtl ? `/contact?specialty=${encodeURIComponent(specialty)}` : `/en/contact?specialty=${encodeURIComponent(specialty)}`}
                  className="w-full border border-cyan-400/20 bg-slate-900/60 hover:bg-cyan-500/10 text-cyan-400 font-bold py-3.5 px-6 rounded-2xl text-xs transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{isRtl ? 'طلب استشارة تسويقية مخصصة' : 'Request Marketing Consultation'}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Profiles copy details */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Identity Header */}
              <div>
                <span className="inline-block text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-400/20 px-4 py-1.5 rounded-full mb-4">
                  {specialty}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                  {name}
                </h1>
                <p className="text-sm text-slate-400 mt-2 font-medium">
                  {isRtl ? 'عضو النخبة الطبية الشريكة للنمو' : 'Elite Healthcare Growth Partner Specialist'}
                </p>
              </div>

              {/* Bio description */}
              <div className="glass-card p-8 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg">clinical_notes</span>
                  <span>{isRtl ? 'نبذة مختصرة عن الطبيب' : 'Brief Biography'}</span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-[1.8] whitespace-pre-wrap">
                  {desc || (isRtl ? 'لا يوجد نبذة تفصيلية مسجلة حالياً.' : 'No biography registered currently.')}
                </p>
              </div>

              {/* Certificates Credentials List */}
              <div className="glass-card p-8 rounded-[2rem] border border-white/5 space-y-6">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <span className="material-symbols-outlined text-cyan-400 text-lg">workspace_premium</span>
                  <span>{isRtl ? 'الشهادات والاعتمادات العلمية' : 'Certificates & Credentials'}</span>
                </div>
                
                {certificates.length > 0 ? (
                  <ul className="space-y-4 pr-1">
                    {certificates.map((cert: string, idx: number) => (
                      <li key={idx} className="flex gap-3.5 items-start text-xs md:text-sm text-slate-350">
                        <span className="material-symbols-outlined text-emerald-400 shrink-0 text-lg relative top-0.5">check_circle</span>
                        <span className="leading-[1.6]">{cert}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    {isRtl ? 'لم يتم إدراج شهادات بعد.' : 'No certificates listed yet.'}
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
