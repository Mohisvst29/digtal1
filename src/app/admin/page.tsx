'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  message: string;
  createdAt: string;
}

interface Article {
  _id: string;
  title_ar: string;
  title_en: string;
  cat_ar: string;
  cat_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  image: string;
  date: string;
}

interface Testimonial {
  _id: string;
  name_ar: string;
  name_en: string;
  title_ar: string;
  title_en: string;
  quote_ar: string;
  quote_en: string;
  image: string;
}

interface Portfolio {
  _id: string;
  title_ar: string;
  title_en: string;
  cat_ar: string;
  cat_en: string;
  metric_ar: string;
  metric_en: string;
  image: string;
}

interface MediaItem {
  _id: string;
  url: string;
  publicId: string;
  fileName: string;
  sizeBytes: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'content' | 'blog' | 'testimonials' | 'portfolio' | 'media' | 'security'>('leads');
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'home' | 'about' | 'services' | 'portfolio' | 'blog' | 'faq' | 'contact' | 'thankyou'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Core website data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);

  // Modals / forms states
  const [articleForm, setArticleForm] = useState<Partial<Article> | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial> | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<Partial<Portfolio> | null>(null);
  const [mediaUploading, setMediaUploading] = useState(false);

  // Security Credentials form
  const [securityForm, setSecurityForm] = useState({
    username: 'admin',
    currentPassword: '',
    newPassword: '',
  });

  // Verify Admin Auth Session & Fetch Dataset
  useEffect(() => {
    async function initDashboard() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.replace('/admin/login');
          return;
        }
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.replace('/admin/login');
          return;
        }

        // Authenticated! Now fetch entire CMS dataset
        const dataRes = await fetch('/api/content');
        if (dataRes.ok) {
          const data = await dataRes.json();
          if (data.status === 'success') {
            setContent(data.content || {});
            setArticles(data.articles || []);
            setTestimonials(data.testimonials || []);
            setPortfolio(data.portfolio || []);
            setMedia(data.media || []);
            setLeads(data.leads || []);
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
        showToast('حدث خطأ أثناء تحميل البيانات، الرجاء التحقق من قاعدة البيانات', 'error');
      } finally {
        setLoading(false);
      }
    }
    initDashboard();
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.replace('/admin/login');
      }
    } catch (err) {
      showToast('خطأ أثناء تسجيل الخروج', 'error');
    }
  };

  // SAVE GLOBAL SITE CONTENT (PUT /api/content)
  const saveContent = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم حفظ ومزامنة إعدادات هذا القسم بنجاح المباشر!', 'success');
      } else {
        showToast(data.message || 'فشل المزامنة', 'error');
      }
    } catch (err) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setSaving(false);
    }
  };

  // BLOG CRUD OPERATIONS
  const saveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm) return;
    setSaving(true);
    const isNew = !articleForm._id;
    const url = isNew ? '/api/articles' : '/api/articles';
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleForm),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم إنشاء المقال بنجاح!' : '✓ تم تعديل المقال بنجاح!', 'success');
        
        // Refresh articles list
        const updated = await fetch('/api/content').then(r => r.json());
        setArticles(updated.articles || []);
        setArticleForm(null);
      } else {
        showToast(data.message || 'حدث خطأ ما', 'error');
      }
    } catch (err) {
      showToast('خطأ في حفظ المقال', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال الطَّبي نهائيًا؟')) return;
    try {
      const res = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast('✓ تم حذف المقال بنجاح!', 'success');
        setArticles(articles.filter(a => a._id !== id));
      }
    } catch (err) {
      showToast('خطأ أثناء حذف المقال', 'error');
    }
  };

  // TESTIMONIALS CRUD OPERATIONS
  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm) return;
    setSaving(true);
    const isNew = !testimonialForm._id;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم إضافة تقييم الاستشاري بنجاح!' : '✓ تم تعديل التقييم بنجاح!', 'success');
        const updated = await fetch('/api/content').then(r => r.json());
        setTestimonials(updated.testimonials || []);
        setTestimonialForm(null);
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ التقييم', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!window.confirm('هل تريد حذف تقييم الطبيب نهائياً؟')) return;
    try {
      const res = await fetch('/api/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast('✓ تم حذف التقييم بنجاح!', 'success');
        setTestimonials(testimonials.filter(t => t._id !== id));
      }
    } catch (err) {
      showToast('خطأ أثناء حذف التقييم', 'error');
    }
  };

  // PORTFOLIO CRUD OPERATIONS
  const savePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioForm) return;
    setSaving(true);
    const isNew = !portfolioForm._id;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch('/api/portfolio', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioForm),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم إضافة قصة النجاح بنجاح!' : '✓ تم تعديل قصة النجاح بنجاح!', 'success');
        const updated = await fetch('/api/content').then(r => r.json());
        setPortfolio(updated.portfolio || []);
        setPortfolioForm(null);
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ قصة النجاح', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!window.confirm('هل تريد حذف قصة النجاح هذه نهائياً؟')) return;
    try {
      const res = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast('✓ تم حذف قصة النجاح بنجاح!', 'success');
        setPortfolio(portfolio.filter(p => p._id !== id));
      }
    } catch (err) {
      showToast('خطأ أثناء الحذف', 'error');
    }
  };

  // CLOUDINARY MEDIA UPLOAD
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع الصورة إلى خوادم Cloudinary بنجاح!', 'success');
        setMedia([data.mediaItem, ...media]);
      } else {
        showToast(data.message || 'فشل رفع الملف', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء الاتصال بـ Cloudinary', 'error');
    } finally {
      setMediaUploading(false);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الصورة تماماً من مكتبة CDN السحابية؟')) return;
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showToast('✓ تم حذف الصورة بنجاح!', 'success');
        setMedia(media.filter(m => m._id !== id));
      }
    } catch (err) {
      showToast('خطأ أثناء الحذف السحابي', 'error');
    }
  };

  // PASSWORD SECURITY HANDLER
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.newPassword) {
      showToast('الرجاء إدخال كلمة مرور جديدة', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(securityForm),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم تحديث بيانات المشرف الأمنية بنجاح!', 'success');
        setSecurityForm({ username: securityForm.username, currentPassword: '', newPassword: '' });
      } else {
        showToast(data.message || 'فشل التحديث', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء التحديث الأمني', 'error');
    } finally {
      setSaving(false);
    }
  };

  // DATABASE BACKUP IMPORT/EXPORT
  const handleBackupImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('تحذير: سيقوم استيراد هذه النسخة بمسح كافة البيانات الحالية واستبدالها بالكامل. هل تريد الاستمرار؟')) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string);
        const res = await fetch('/api/db-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backup),
        });
        const data = await res.json();
        if (res.ok && data.status === 'success') {
          showToast('✓ تم استعادة النسخة الاحتياطية بنجاح! جاري تحديث الصفحة...', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showToast(data.message || 'فشل استيراد النسخة', 'error');
        }
      } catch (err) {
        showToast('الملف المختار غير صالح كنسخة احتياطية JSON', 'error');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-sans">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-bold tracking-wider">جاري تهيئة لوحة التحكم الطبية ومزامنة MongoDB...</p>
        </div>
      </div>
    );
  }

  // Helper renderer to render custom input box
  const renderInput = (key: string, label: string, isEn: boolean = false, isTextArea: boolean = false) => {
    const val = content[key] || '';
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContent({ ...content, [key]: e.target.value });
    };

    return (
      <div className="space-y-1.5 flex flex-col">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-300">{label}</label>
          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${isEn ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'}`}>
            {isEn ? 'EN' : 'AR'}
          </span>
        </div>
        {isTextArea ? (
          <textarea
            value={val}
            onChange={onChange}
            rows={3}
            dir={isEn ? 'ltr' : 'rtl'}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-cyan-400/80 transition-all resize-none leading-relaxed"
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={onChange}
            dir={isEn ? 'ltr' : 'rtl'}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-cyan-400/80 transition-all"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans text-right antialiased select-none" dir="rtl">
      
      {/* Toast Notification Widget */}
      {toast && (
        <div className={`fixed top-8 left-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border animate-fade-in-slow text-sm font-semibold ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Section */}
      <aside className="w-full md:w-72 bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Header Brand */}
          <div className="p-8 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,218,243,0.3)]">
                <span className="material-symbols-outlined text-slate-950 text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  medical_services
                </span>
              </div>
              <div className="text-right">
                <h2 className="text-base font-bold text-white leading-tight">ديجيتال هيلث</h2>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wide">لوحة الإشراف والتسويق</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'leads' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'leads' ? "'FILL' 1" : '' }}>patient_list</span>
              <span>العملاء والطلبات</span>
              {leads.length > 0 && (
                <span className={`mr-auto px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'leads' ? 'bg-slate-950 text-cyan-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  {leads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'content' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'content' ? "'FILL' 1" : '' }}>settings_suggest</span>
              <span>إعدادات المحتوى</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'blog' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'blog' ? "'FILL' 1" : '' }}>article</span>
              <span>المقالات الطبية</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'testimonials' ? "'FILL' 1" : '' }}>rate_review</span>
              <span>آراء الأطباء</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'portfolio' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'portfolio' ? "'FILL' 1" : '' }}>finance</span>
              <span>قصص النجاح</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'media' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'media' ? "'FILL' 1" : '' }}>photo_library</span>
              <span>مكتبة الصور (Cloudinary)</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'security' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'security' ? "'FILL' 1" : '' }}>lock</span>
              <span>الحماية والأمان</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>عرض الموقع المباشر</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer border border-rose-500/20 hover:border-transparent"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Container */}
      <main className="flex-grow bg-slate-950 p-6 md:p-10 overflow-y-auto max-w-full">
        
        {/* Top greeting bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-850">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">لوحة الإشراف العام</h1>
            <p className="text-xs text-slate-400 mt-1">تعديل المقالات، والتحكم المطلق بكامل نصوص وتفاصيل الموقع والمزامنة مع قواعد البيانات</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 py-2.5 px-4 rounded-2xl text-xs font-semibold text-cyan-400 animate-fade-in">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0"></span>
            <span>MongoDB & Cloudinary: نشط وسحابي</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LEADS TRACKER */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">طلبات الاستشارة الواردة ({leads.length})</h2>
            </div>

            {leads.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-850 p-12 rounded-[2rem] text-center">
                <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">patient_list</span>
                <p className="text-slate-400 font-semibold text-sm">لا يوجد أي طلبات استشارة مسجلة حاليًا.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {leads.map((lead) => (
                  <div key={lead._id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-cyan-400/30 transition-all relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-extrabold">
                          {lead.specialty || 'تخصص عام'}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(lead.createdAt).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{lead.name}</h3>
                      
                      <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-500 text-sm">call</span>
                            <span>الهاتف: <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a></span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-500 text-sm">mail</span>
                            <span>البريد: <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a></span>
                          </div>
                        )}
                      </div>

                      {lead.message && (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-400 leading-relaxed mb-6 whitespace-pre-wrap">
                          {lead.message}
                        </div>
                      )}
                    </div>

                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.936 9.936 0 0 0 4.779 1.21h.004c5.505 0 9.989-4.478 9.99-9.985A9.983 9.983 0 0 0 12.012 2zm5.799 14.123c-.253.712-1.463 1.307-2.022 1.362-.513.051-1.18.083-3.218-.762-2.599-1.079-4.247-3.722-4.377-3.894-.13-.171-1.05-1.398-1.05-2.667 0-1.269.664-1.892.901-2.148.236-.256.516-.32.688-.32.172 0 .344.001.494.009.157.008.368-.06.577.444.21.516.719 1.753.782 1.881.063.127.104.276.02.443-.083.167-.156.276-.312.459-.157.183-.328.406-.469.545-.157.155-.32.324-.138.636.182.311.808 1.334 1.733 2.158.93.829 1.716 1.085 2.037 1.241.32.155.507.13.69-.083.182-.213.782-.909.99-1.22.208-.311.416-.259.69-.156.276.104 1.752.825 2.054.977.302.151.503.228.577.355.074.127.074.739-.179 1.451z"/>
                      </svg>
                      <span>تواصل فوري عبر الواتساب</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONTENT HUB (MULTI-PAGE CONTENT SUB-NAV) */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            
            {/* Horizontal Sub-Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 select-none">
              {[
                { key: 'general', label: '⚙️ الهوية والبيانات العامة' },
                { key: 'home', label: '🏠 الصفحة الرئيسية' },
                { key: 'about', label: '🏢 صفحة من نحن' },
                { key: 'services', label: '🦷 صفحة الخدمات' },
                { key: 'portfolio', label: '📈 صفحة قصص النجاح' },
                { key: 'blog', label: '📰 صفحة المقالات' },
                { key: 'faq', label: '❓ صفحة الأسئلة الشائعة' },
                { key: 'contact', label: '📞 صفحة اتصل بنا' },
                { key: 'thankyou', label: '🎉 صفحة الشكر' },
              ].map((subTab) => {
                const isActive = activeSubTab === subTab.key;
                return (
                  <button
                    key={subTab.key}
                    onClick={() => setActiveSubTab(subTab.key as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {subTab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-white">
                  {activeSubTab === 'general' && '⚙️ تعديل الهوية، الشعار، الألوان والبيانات العامة'}
                  {activeSubTab === 'home' && '🏠 تعديل نصوص وبانرات وهيدرات الصفحة الرئيسية'}
                  {activeSubTab === 'about' && '🏢 تعديل رؤية ورسالة ومميزات صفحة من نحن'}
                  {activeSubTab === 'services' && '🦷 تعديل باقات وعناوين صفحة الخدمات'}
                  {activeSubTab === 'portfolio' && '📈 تعديل هيدر صفحة قصص النجاح ومؤشرات الأداء'}
                  {activeSubTab === 'blog' && '📰 تعديل هيدر صفحة المقالات والنشرة التوعوية'}
                  {activeSubTab === 'faq' && '❓ تعديل هيدر وعناوين صفحة الأسئلة الشائعة'}
                  {activeSubTab === 'contact' && '📞 تعديل تفاصيل وموقع صفحة اتصل بنا'}
                  {activeSubTab === 'thankyou' && '🎉 تعديل رسالة شكر العملاء بعد إرسال التفاصيل'}
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">تنعكس التحديثات فورياً بمجرد المزامنة والضغط على الحفظ.</p>
              </div>
              
              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ ومزامنة إعدادات القسم'}
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[2rem] space-y-6">
              
              {/* SUB TAB: GENERAL SETTINGS */}
              {activeSubTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('logo_text_ar', 'اسم الشعار بالعربية')}
                  {renderInput('logo_text_en', 'اسم الشعار بالإنجليزية', true)}
                  
                  {renderInput('font_family_ar', 'الخط العربي المستهدف (Font Family)')}
                  {renderInput('font_family_en', 'الخط الإنجليزي المستهدف', true)}

                  {renderInput('primary_color', 'اللون الرئيسي الطاغي (HEX)')}
                  {renderInput('secondary_color', 'اللون الثانوي (HEX)')}
                  {renderInput('bg_color', 'لون خلفية الموقع (Background HEX)')}
                  {renderInput('surface_color', 'لون أسطح الكروت (Surface HEX)')}

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                    <h4 className="text-xs font-bold text-cyan-400 md:col-span-2">🔎 تهيئة السيو وميتا جوجل للبحث الجغرافي بالرياض</h4>
                    {renderInput('seo_title_ar', 'عنوان سيو جوجل بالعربية')}
                    {renderInput('seo_title_en', 'عنوان سيو جوجل بالإنجليزية', true)}
                    {renderInput('seo_desc_ar', 'وصف الميتا بالعربية لتصدر البحث', false, true)}
                    {renderInput('seo_desc_en', 'وصف الميتا بالإنجليزية لتصدر البحث', true, true)}
                    {renderInput('seo_keywords_ar', 'الكلمات المفتاحية الطبية (عربي)')}
                    {renderInput('seo_keywords_en', 'الكلمات المفتاحية الطبية (إنجليزي)', true)}
                  </div>
                </div>
              )}

              {/* SUB TAB: HOME PAGE */}
              {activeSubTab === 'home' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('home_badge_ar', 'شارة الهيرو الصغيرة بالعربية')}
                  {renderInput('home_badge_en', 'شارة الهيرو الصغيرة بالإنجليزية', true)}

                  {renderInput('hero_title_ar', 'العنوان الرئيسي للبانر (عربي)')}
                  {renderInput('hero_title_en', 'العنوان الرئيسي للبانر (إنجليزي)', true)}

                  {renderInput('hero_tagline_ar', 'الوصف التفصيلي للبانر بالعربية', false, true)}
                  {renderInput('hero_tagline_en', 'الوصف التفصيلي للبانر بالإنجليزية', true, true)}

                  {renderInput('home_cta_primary_ar', 'زر الإجراء الرئيسي (عربي)')}
                  {renderInput('home_cta_primary_en', 'زر الإجراء الرئيسي (إنجليزي)', true)}

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                    <h4 className="text-xs font-bold text-cyan-400 md:col-span-2">📈 أرقام ومؤشرات واجهة الصفحة الرئيسية (Stats)</h4>
                    {renderInput('home_stats_roi_title_ar', 'عنوان الإحصائية 1 (عربي)')}
                    {renderInput('home_stats_roi_title_en', 'عنوان الإحصائية 1 (إنجليزي)', true)}
                    {renderInput('home_stats_roi_value_ar', 'قيمة الإحصائية 1 (عربي)')}
                    {renderInput('home_stats_roi_value_en', 'قيمة الإحصائية 1 (إنجليزي)', true)}

                    {renderInput('home_stats_seo_title_ar', 'عنوان الإحصائية 2 (عربي)')}
                    {renderInput('home_stats_seo_title_en', 'عنوان الإحصائية 2 (إنجليزي)', true)}
                    {renderInput('home_stats_seo_value_ar', 'قيمة الإحصائية 2 (عربي)')}
                    {renderInput('home_stats_seo_value_en', 'قيمة الإحصائية 2 (إنجليزي)', true)}
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                    <h4 className="text-xs font-bold text-cyan-400 md:col-span-2">🦷 قسم المميزات وسيكولوجية المريض (Clinical Advantages)</h4>
                    {renderInput('home_section_why_badge_ar', 'شارة قسم المميزات بالعربية')}
                    {renderInput('home_section_why_badge_en', 'شارة قسم المميزات بالإنجليزية', true)}
                    {renderInput('home_section_why_title_ar', 'عنوان قسم المميزات بالعربية')}
                    {renderInput('home_section_why_title_en', 'عنوان قسم المميزات بالإنجليزية', true)}
                    
                    {renderInput('home_why_years_val', 'قيمة سنوات التخصص (رقم)')}
                    {renderInput('home_why_years_title_ar', 'عنوان سنوات التخصص بالعربية')}
                    
                    {renderInput('home_why_feat1_title_ar', 'ميزة 1: العنوان (عربي)')}
                    {renderInput('home_why_feat1_title_en', 'ميزة 1: العنوان (إنجليزي)', true)}
                    {renderInput('home_why_feat1_desc_ar', 'ميزة 1: الوصف (عربي)', false, true)}
                    {renderInput('home_why_feat1_desc_en', 'ميزة 1: الوصف (إنجليزي)', true, true)}

                    {renderInput('home_why_feat2_title_ar', 'ميزة 2: العنوان (عربي)')}
                    {renderInput('home_why_feat2_title_en', 'ميزة 2: العنوان (إنجليزي)', true)}
                    {renderInput('home_why_feat2_desc_ar', 'ميزة 2: الوصف (عربي)', false, true)}
                    {renderInput('home_why_feat2_desc_en', 'ميزة 2: الوصف (إنجليزي)', true, true)}

                    {renderInput('home_why_feat3_title_ar', 'ميزة 3: العنوان (عربي)')}
                    {renderInput('home_why_feat3_title_en', 'ميزة 3: العنوان (إنجليزي)', true)}
                    {renderInput('home_why_feat3_desc_ar', 'ميزة 3: الوصف (عربي)', false, true)}
                    {renderInput('home_why_feat3_desc_en', 'ميزة 3: الوصف (إنجليزي)', true, true)}
                  </div>
                </div>
              )}

              {/* SUB TAB: ABOUT PAGE */}
              {activeSubTab === 'about' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('about_badge_ar', 'شارة صفحة من نحن بالعربية')}
                  {renderInput('about_badge_en', 'شارة صفحة من نحن بالإنجليزية', true)}
                  {renderInput('about_title_ar', 'عنوان صفحة من نحن بالعربية')}
                  {renderInput('about_title_en', 'عنوان صفحة من نحن بالإنجليزية', true)}
                  {renderInput('about_description_ar', 'الوصف الأساسي لـ من نحن بالعربية', false, true)}
                  {renderInput('about_description_en', 'الوصف الأساسي لـ من نحن بالإنجليزية', true, true)}

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                    <h4 className="text-xs font-bold text-cyan-400 md:col-span-2">👁️ الرؤية والرسالة الطبية للوكالة (Vision & Mission)</h4>
                    {renderInput('about_vision_title_ar', 'عنوان الرؤية بالعربية')}
                    {renderInput('about_vision_title_en', 'عنوان الرؤية بالإنجليزية', true)}
                    {renderInput('about_vision_desc_ar', 'نص الرؤية بالعربية بالتفصيل', false, true)}
                    {renderInput('about_vision_desc_en', 'نص الرؤية بالإنجليزية بالتفصيل', true, true)}

                    {renderInput('about_mission_title_ar', 'عنوان الرسالة بالعربية')}
                    {renderInput('about_mission_title_en', 'عنوان الرسالة بالإنجليزية', true)}
                    {renderInput('about_mission_desc_ar', 'نص الرسالة بالعربية بالتفصيل', false, true)}
                    {renderInput('about_mission_desc_en', 'نص الرسالة بالإنجليزية بالتفصيل', true, true)}
                  </div>
                </div>
              )}

              {/* SUB TAB: SERVICES PAGE */}
              {activeSubTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('services_title_ar', 'عنوان صفحة الخدمات الفاخرة بالعربية')}
                  {renderInput('services_title_en', 'عنوان صفحة الخدمات الفاخرة بالإنجليزية', true)}
                  {renderInput('services_title_span_ar', 'العنوان الملون التوضيحي للخدمات (عربي)')}
                  {renderInput('services_title_span_en', 'العنوان الملون التوضيحي للخدمات (إنجليزي)', true)}
                  {renderInput('services_description_ar', 'الوصف العام لصفحة الخدمات بالعربية', false, true)}
                  {renderInput('services_description_en', 'الوصف العام لصفحة الخدمات بالإنجليزية', true, true)}
                  
                  {renderInput('services_badge_moh_ar', 'شارة الالتزام وزارة الصحة بالعربية')}
                  {renderInput('services_badge_moh_en', 'شارة الالتزام وزارة الصحة بالإنجليزية', true)}
                  {renderInput('services_badge_clinical_ar', 'شارة الأبحاث الطبية والنمو بالعربية')}
                  {renderInput('services_badge_clinical_en', 'شارة الأبحاث الطبية والنمو بالإنجليزية', true)}
                </div>
              )}

              {/* SUB TAB: PORTFOLIO PAGE */}
              {activeSubTab === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('portfolio_title_ar', 'عنوان هيدر صفحة قصص النجاح بالعربية')}
                  {renderInput('portfolio_title_en', 'عنوان هيدر صفحة قصص النجاح بالإنجليزية', true)}
                  {renderInput('portfolio_description_ar', 'وصف هيدر صفحة قصص النجاح بالعربية', false, true)}
                  {renderInput('portfolio_description_en', 'وصف هيدر صفحة قصص النجاح بالإنجليزية', true, true)}
                </div>
              )}

              {/* SUB TAB: BLOG PAGE */}
              {activeSubTab === 'blog' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('blog_title_ar', 'عنوان هيدر صفحة المدونة بالعربية')}
                  {renderInput('blog_title_en', 'عنوان هيدر صفحة المدونة بالإنجليزية', true)}
                  {renderInput('blog_description_ar', 'وصف هيدر صفحة المدونة بالعربية', false, true)}
                  {renderInput('blog_description_en', 'وصف هيدر صفحة المدونة بالإنجليزية', true, true)}
                </div>
              )}

              {/* SUB TAB: FAQ PAGE */}
              {activeSubTab === 'faq' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('faq_title_ar', 'عنوان هيدر الأسئلة الشائعة بالعربية')}
                  {renderInput('faq_title_en', 'عنوان هيدر الأسئلة الشائعة بالإنجليزية', true)}
                  {renderInput('faq_description_ar', 'وصف هيدر الأسئلة الشائعة بالعربية', false, true)}
                  {renderInput('faq_description_en', 'وصف هيدر الأسئلة الشائعة بالإنجليزية', true, true)}
                </div>
              )}

              {/* SUB TAB: CONTACT PAGE */}
              {activeSubTab === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('contact_title_ar', 'عنوان هيدر صفحة اتصل بنا بالعربية')}
                  {renderInput('contact_title_en', 'عنوان هيدر صفحة اتصل بنا بالإنجليزية', true)}
                  {renderInput('contact_description_ar', 'وصف هيدر صفحة اتصل بنا بالعربية', false, true)}
                  {renderInput('contact_description_en', 'وصف هيدر صفحة اتصل بنا بالإنجليزية', true, true)}

                  {renderInput('contact_phone', 'هاتف اتصال المقر بالرياض')}
                  {renderInput('contact_whatsapp', 'رقم الواتساب للاستشارات')}
                  {renderInput('contact_email', 'البريد الإلكتروني المهني')}
                  {renderInput('contact_address', 'العنوان الجغرافي الكامل للمكتب')}
                </div>
              )}

              {/* SUB TAB: THANK YOU PAGE */}
              {activeSubTab === 'thankyou' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('thankyou_title_ar', 'عنوان صفحة الشكر الفوري بالعربية')}
                  {renderInput('thankyou_title_en', 'عنوان صفحة الشكر الفوري بالإنجليزية', true)}
                  {renderInput('thankyou_description_ar', 'رسالة وصف صفحة الشكر الفوري بالعربية', false, true)}
                  {renderInput('thankyou_description_en', 'رسالة وصف صفحة الشكر الفوري بالإنجليزية', true, true)}
                  {renderInput('thankyou_btn_ar', 'نص زر التوجيه بالعربية')}
                  {renderInput('thankyou_btn_en', 'نص زر التوجيه بالإنجليزية', true)}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BLOG MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">إدارة المقالات الطبية والتوعوية</h2>
              <button
                onClick={() => setArticleForm({ title_ar: '', title_en: '', cat_ar: '', cat_en: '', excerpt_ar: '', excerpt_en: '', image: '', date: new Date().toISOString().split('T')[0] })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>إضافة مقال جديد</span>
              </button>
            </div>

            {/* Articles List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold bg-slate-950/40">
                      <th className="p-4 md:p-6">العنوان العربي</th>
                      <th className="p-4 md:p-6">التصنيف</th>
                      <th className="p-4 md:p-6">تاريخ النشر</th>
                      <th className="p-4 md:p-6 text-left">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {articles.map((art) => (
                      <tr key={art._id} className="hover:bg-slate-950/20 transition-all">
                        <td className="p-4 md:p-6 font-bold text-white max-w-xs truncate">{art.title_ar}</td>
                        <td className="p-4 md:p-6 text-xs"><span className="bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full font-semibold">{art.cat_ar}</span></td>
                        <td className="p-4 md:p-6 text-slate-400 text-xs font-medium">{art.date}</td>
                        <td className="p-4 md:p-6 text-left space-x-2 space-x-reverse">
                          <button
                            onClick={() => setArticleForm(art)}
                            className="bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => deleteArticle(art._id)}
                            className="bg-rose-500/10 hover:bg-rose-500 hover:text-slate-950 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Create/Edit Article */}
            {articleForm && (
              <div className="fixed inset-0 z-[150] bg-slate-950/85 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in-slow">
                <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                    {articleForm._id ? 'تعديل المقال الطبي الحالي' : 'إنشاء مقال طبي جديد'}
                  </h3>

                  <form onSubmit={saveArticle} className="space-y-4 overflow-y-auto pr-1 flex-1 mb-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">العنوان بالعربية</label>
                        <input
                          type="text"
                          required
                          value={articleForm.title_ar || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, title_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">العنوان بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={articleForm.title_en || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, title_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">التصنيف بالعربية</label>
                        <input
                          type="text"
                          required
                          value={articleForm.cat_ar || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, cat_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">التصنيف بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={articleForm.cat_en || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, cat_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">رابط صورة المقال (Image URL) - يمكنك نسخه من مكتبة الصور</label>
                      <input
                        type="text"
                        value={articleForm.image || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                        dir="ltr"
                        placeholder="https://res.cloudinary.com/..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">تاريخ النشر</label>
                        <input
                          type="date"
                          required
                          value={articleForm.date || ''}
                          onChange={(e) => setArticleForm({ ...articleForm, date: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">نبذة تعريفية للمقال بالعربية</label>
                      <textarea
                        rows={3}
                        required
                        value={articleForm.excerpt_ar || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, excerpt_ar: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">نبذة تعريفية للمقال بالإنجليزية</label>
                      <textarea
                        rows={3}
                        required
                        value={articleForm.excerpt_en || ''}
                        onChange={(e) => setArticleForm({ ...articleForm, excerpt_en: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none resize-none leading-relaxed text-left"
                        dir="ltr"
                      />
                    </div>

                  </form>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setArticleForm(null)}
                      className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      إلغاء وتراجع
                    </button>
                    <button
                      onClick={saveArticle}
                      disabled={saving}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer disabled:opacity-50"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ ومزامنة'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TESTIMONIALS MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">إدارة آراء وتقييمات الاستشاريين</h2>
              <button
                onClick={() => setTestimonialForm({ name_ar: '', name_en: '', title_ar: '', title_en: '', quote_ar: '', quote_en: '', image: '' })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>إضافة تقييم جديد</span>
              </button>
            </div>

            {/* Testimonials Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t._id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-cyan-400/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {t.image ? (
                        <img src={t.image} alt={t.name_ar} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 font-bold text-center">
                          {t.name_ar ? t.name_ar[0] : 'Dr'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-sm">{t.name_ar}</h4>
                        <p className="text-[10px] text-cyan-400 mt-0.5">{t.title_ar}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-950 p-4 rounded-xl border border-slate-850 mb-6">
                      &ldquo;{t.quote_ar}&rdquo;
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setTestimonialForm(t)}
                      className="flex-1 bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-cyan-500/10"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => deleteTestimonial(t._id)}
                      className="flex-1 bg-rose-500/10 hover:bg-rose-500 hover:text-slate-950 text-rose-400 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-500/10"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create/Edit Testimonial */}
            {testimonialForm && (
              <div className="fixed inset-0 z-[150] bg-slate-950/85 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in-slow">
                <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                    {testimonialForm._id ? 'تعديل التقييم الطبي' : 'إضافة تقييم استشاري جديد'}
                  </h3>

                  <form onSubmit={saveTestimonial} className="space-y-4 overflow-y-auto pr-1 flex-1 mb-8">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">اسم الطبيب بالعربية</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.name_ar || ''}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, name_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">الاسم بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.name_en || ''}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, name_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">المسمى والتخصص بالعربية</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.title_ar || ''}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, title_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">المسمى بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.title_en || ''}
                          onChange={(e) => setTestimonialForm({ ...testimonialForm, title_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">رابط الصورة الشخصية للطبيب (URL)</label>
                      <input
                        type="text"
                        value={testimonialForm.image || ''}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">الرأي والتقييم الطبي بالعربية</label>
                      <textarea
                        rows={3}
                        required
                        value={testimonialForm.quote_ar || ''}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, quote_ar: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">الرأي والتقييم بالإنجليزية</label>
                      <textarea
                        rows={3}
                        required
                        value={testimonialForm.quote_en || ''}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, quote_en: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none resize-none leading-relaxed text-left"
                        dir="ltr"
                      />
                    </div>

                  </form>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setTestimonialForm(null)}
                      className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={saveTestimonial}
                      disabled={saving}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer disabled:opacity-50"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ ومزامنة'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PORTFOLIO MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">إدارة دراسات ومشاريع النجاح للعيادات</h2>
              <button
                onClick={() => setPortfolioForm({ title_ar: '', title_en: '', cat_ar: '', cat_en: '', metric_ar: '', metric_en: '', image: '' })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>إضافة دراسة نجاح جديدة</span>
              </button>
            </div>

            {/* Portfolio Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((p) => (
                <div key={p._id} className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-cyan-400/20 transition-all flex flex-col justify-between">
                  {p.image && (
                    <img src={p.image} alt={p.title_ar} className="w-full h-44 object-cover border-b border-slate-850" />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md font-semibold">{p.cat_ar}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-3 leading-snug">{p.title_ar}</h4>
                    <div className="bg-slate-950/80 border border-slate-850 py-3 px-4 rounded-xl text-center">
                      <p className="text-[10px] text-slate-500 font-bold">النتيجة المحققة (Metric)</p>
                      <p className="text-sm font-extrabold text-cyan-400 mt-0.5">{p.metric_ar}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex gap-2">
                    <button
                      onClick={() => setPortfolioForm(p)}
                      className="flex-1 bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-cyan-500/10"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => deletePortfolio(p._id)}
                      className="flex-1 bg-rose-500/10 hover:bg-rose-500 hover:text-slate-950 text-rose-400 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-rose-500/10"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create/Edit Portfolio */}
            {portfolioForm && (
              <div className="fixed inset-0 z-[150] bg-slate-950/85 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in-slow">
                <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                    {portfolioForm._id ? 'تعديل دراسة الحالة الحالية' : 'إضافة قصة نجاح سريرية جديدة'}
                  </h3>

                  <form onSubmit={savePortfolio} className="space-y-4 overflow-y-auto pr-1 flex-1 mb-8">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">العنوان بالعربية</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.title_ar || ''}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, title_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">العنوان بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.title_en || ''}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, title_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">التصنيف بالعربية</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.cat_ar || ''}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, cat_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">التصنيف بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.cat_en || ''}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, cat_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">النتيجة بالعربية (مثل زيادة 142%)</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.metric_ar || ''}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, metric_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">النتيجة بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.metric_en || ''}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, metric_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">رابط صورة التوضيحية (URL)</label>
                      <input
                        type="text"
                        value={portfolioForm.image || ''}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, image: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                        dir="ltr"
                      />
                    </div>

                  </form>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPortfolioForm(null)}
                      className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={savePortfolio}
                      disabled={saving}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer disabled:opacity-50"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ ومزامنة'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MEDIA LIBRARY */}
        {/* ========================================================================= */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">مكتبة الصور السحابية (Cloudinary CDN)</h2>
                <p className="text-xs text-slate-450 mt-1">ارفع الصور الطبية هنا وانسخ روابطها لاستخدامها في المقالات ودراسات الحالة مباشرة</p>
              </div>

              {/* Upload Input Widget */}
              <div className="relative shrink-0">
                <input
                  type="file"
                  id="media-uploader"
                  onChange={handleMediaUpload}
                  disabled={mediaUploading}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="media-uploader"
                  className={`bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer text-xs ${
                    mediaUploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {mediaUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري الرفع لـ Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">cloud_upload</span>
                      <span>رفع صورة جديدة</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Media Items List Grid */}
            {media.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-850 p-12 rounded-[2rem] text-center">
                <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">photo_library</span>
                <p className="text-slate-400 font-semibold text-sm">مكتبة الصور السحابية فارغة حالياً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {media.map((med) => (
                  <div key={med._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-400/20 transition-all flex flex-col justify-between group relative">
                    <div className="aspect-square bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-850">
                      <img src={med.url} alt={med.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-[10px] text-slate-400 truncate text-left" dir="ltr">{med.fileName}</p>
                      
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(med.url);
                            showToast('✓ تم نسخ رابط الصورة للذاكرة بنجاح!', 'success');
                          }}
                          className="flex-1 bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex justify-center items-center gap-1 border border-cyan-500/10"
                          title="نسخ رابط الصورة"
                        >
                          <span className="material-symbols-outlined text-xs">content_copy</span>
                          <span>رابط الصورة</span>
                        </button>
                        <button
                          onClick={() => deleteMedia(med._id)}
                          className="bg-rose-500/10 hover:bg-rose-500 hover:text-slate-950 text-rose-400 p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-rose-500/10"
                          title="حذف من السيرفر"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SECURITY & BACKUPS */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            
            {/* Box 1: Change Admin Credentials */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[2rem] max-w-xl">
              <h3 className="text-base font-extrabold text-cyan-400 mb-6 border-b border-slate-800 pb-2">🔒 تحديث بيانات المشرف الأمنية</h3>
              
              <form onSubmit={updatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">اسم المستخدم (المشرف الحالي)</label>
                  <input
                    type="text"
                    required
                    value={securityForm.username}
                    onChange={(e) => setSecurityForm({ ...securityForm, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">كلمة المرور الحالية (للتحقق)</label>
                  <input
                    type="password"
                    required
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none text-left"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none text-left"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
                >
                  {saving ? 'جاري التحديث...' : 'تحديث بيانات تسجيل الدخول'}
                </button>
              </form>
            </div>

            {/* Box 2: Database Sync and Backup */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[2rem] max-w-xl space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-cyan-400 border-b border-slate-800 pb-2">💾 النسخ الاحتياطي والمزامنة (Database Backups)</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  يمكنك تحميل نسخة احتياطية كاملة من قاعدة بيانات MongoDB السحابية كملف JSON لضمان أمان البيانات بالكامل وتحديث المزامنة في أي وقت.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Download Backup Button */}
                <a
                  href="/api/db-sync"
                  className="bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 border border-cyan-500/20 hover:border-transparent font-bold py-3 px-4 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>تصدير نسخة احتياطية (JSON)</span>
                </a>

                {/* Restore Backup Input */}
                <div className="relative">
                  <input
                    type="file"
                    id="db-backup-restorer"
                    onChange={handleBackupImport}
                    className="hidden"
                    accept=".json"
                  />
                  <label
                    htmlFor="db-backup-restorer"
                    className="w-full bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    <span>استيراد نسخة احتياطية</span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
