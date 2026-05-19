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


interface Doctor {
  _id?: string;
  name_ar: string;
  name_en: string;
  specialty_ar: string;
  specialty_en: string;
  desc_ar: string;
  desc_en: string;
  image_url: string;
  order: number;
}

interface Clinic {
  _id?: string;
  name_ar: string;
  name_en: string;
  specialty_ar: string;
  specialty_en: string;
  desc_ar: string;
  desc_en: string;
  image_url: string;
  order: number;
}

interface TeamMember {
  _id?: string;
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  image_url: string;
  order: number;
}

interface FAQ {
  _id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  order: number;
}

interface Service {
  _id: string;
  slug: string;
  icon: string;
  colSpan: string;
  order: number;
  image?: string;
  tags_ar: string[];
  tags_en: string[];
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  tag_ar: string;
  tag_en: string;
  btnText_ar: string;
  btnText_en: string;
  benefitTitle_ar: string;
  benefitTitle_en: string;
  benefitDesc_ar: string;
  benefitDesc_en: string;
  benefits: {
    icon: string;
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
  }[];
  strategyTitle_ar: string;
  strategyTitle_en: string;
  strategies: {
    title_ar: string;
    title_en: string;
    desc_ar: string;
    desc_en: string;
  }[];
  extraType: string;
  extraData_ar: any;
  extraData_en: any;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'content' | 'services' | 'faqs' | 'blog' | 'testimonials' | 'portfolio' | 'media' | 'team' | 'security' | 'doctors' | 'clinics'>('leads');
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'home' | 'about' | 'services' | 'portfolio' | 'blog' | 'faq' | 'contact' | 'thankyou' | 'partners' | 'images' | 'doctors_clinics'>('general');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  // Core website data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);


  // Modals / forms states
  const [articleForm, setArticleForm] = useState<Partial<Article> | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial> | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<Partial<Portfolio> | null>(null);
  const [faqForm, setFaqForm] = useState<Partial<FAQ> | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service> | null>(null);
  const [teamMemberForm, setTeamMemberForm] = useState<Partial<TeamMember> | null>(null);
  const [doctorForm, setDoctorForm] = useState<Partial<Doctor> | null>(null);
  const [clinicForm, setClinicForm] = useState<Partial<Clinic> | null>(null);
  const [doctorUploading, setDoctorUploading] = useState(false);
  const [clinicUploading, setClinicUploading] = useState(false);

  const [mediaUploading, setMediaUploading] = useState(false);
  const [teamMemberUploading, setTeamMemberUploading] = useState(false);
  const [serviceImageUploading, setServiceImageUploading] = useState(false);
  const [partnerUploadingIdx, setPartnerUploadingIdx] = useState<number | null>(null);

  // Security Credentials form
  const [securityForm, setSecurityForm] = useState({
    username: 'admin',
    currentPassword: '',
    newPassword: '',
  });

  // Verify Admin Auth Session & Fetch Dataset in Parallel
  useEffect(() => {
    async function initDashboard() {
      try {
        const [authRes, dataRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/content')
        ]);
        
        if (!authRes.ok) {
          router.replace('/admin/login');
          return;
        }
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.replace('/admin/login');
          return;
        }

        // Authenticated! Now read the fetched dataset
        if (dataRes.ok) {
          const data = await dataRes.json();
          if (data.status === 'success') {
            setContent(data.content || {});
            setArticles(data.articles || []);
            setTestimonials(data.testimonials || []);
            setPortfolio(data.portfolio || []);
            setMedia(data.media || []);
            setLeads(data.leads || []);
            setFaqs(data.faqs || []);
            setServices(data.services || []);
            setTeamMembers(data.teamMembers || []);
            setDoctors(data.doctors || []);
            setClinics(data.clinics || []);
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

  
  // DOCTORS CRUD OPERATIONS
  const saveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm) return;
    setSaving(true);
    const isNew = !doctorForm._id;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch('/api/doctors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? doctorForm : { id: doctorForm._id, ...doctorForm }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم إضافة الطبيب بنجاح!' : '✓ تم تعديل الطبيب بنجاح!', 'success');
        const updated = await fetch('/api/content').then(r => r.json());
        setDoctors(updated.doctors || []);
        setDoctorForm(null);
      } else {
        showToast(data.message || 'حدث خطأ', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ الطبيب', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذا الطبيب نهائياً؟')) return;
    try {
      const res = await fetch('/api/doctors?id=' + id, { method: 'DELETE' });
      if (res.ok) {
        showToast('✓ تم الحذف بنجاح!', 'success');
        setDoctors(doctors.filter(d => d._id !== id));
      }
    } catch (err) { showToast('خطأ', 'error'); }
  };

  // CLINICS CRUD OPERATIONS
  const saveClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicForm) return;
    setSaving(true);
    const isNew = !clinicForm._id;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch('/api/clinics', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? clinicForm : { id: clinicForm._id, ...clinicForm }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم الإضافة بنجاح!' : '✓ تم التعديل بنجاح!', 'success');
        const updated = await fetch('/api/content').then(r => r.json());
        setClinics(updated.clinics || []);
        setClinicForm(null);
      } else {
        showToast(data.message || 'حدث خطأ', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء الحفظ', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteClinic = async (id: string) => {
    if (!window.confirm('هل تريد الحذف نهائياً؟')) return;
    try {
      const res = await fetch('/api/clinics?id=' + id, { method: 'DELETE' });
      if (res.ok) {
        showToast('✓ تم الحذف بنجاح!', 'success');
        setClinics(clinics.filter(c => c._id !== id));
      }
    } catch (err) { showToast('خطأ', 'error'); }
  };

  const handleDoctorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDoctorUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع الصورة!', 'success');
        setDoctorForm(prev => prev ? { ...prev, image_url: data.media.url } : { image_url: data.media.url });
      }
    } catch (err) {} finally { setDoctorUploading(false); }
  };

  const handleClinicImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setClinicUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع الصورة!', 'success');
        setClinicForm(prev => prev ? { ...prev, image_url: data.media.url } : { image_url: data.media.url });
      }
    } catch (err) {} finally { setClinicUploading(false); }
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

  // FAQ CRUD OPERATIONS
  const saveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm) return;
    setSaving(true);
    const isNew = !faqForm._id;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch('/api/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? faqForm : { id: faqForm._id, ...faqForm }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم إضافة السؤال بنجاح!' : '✓ تم تعديل السؤال بنجاح!', 'success');
        const updated = await fetch('/api/content').then(r => r.json());
        setFaqs(updated.faqs || []);
        setFaqForm(null);
      } else {
        showToast(data.message || 'حدث خطأ ما', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ السؤال', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteFAQ = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذا السؤال نهائياً؟')) return;
    try {
      const res = await fetch(`/api/faqs?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('✓ تم حذف السؤال بنجاح!', 'success');
        setFaqs(faqs.filter(f => f._id !== id));
      }
    } catch (err) {
      showToast('خطأ أثناء حذف السؤال', 'error');
    }
  };

  // SERVICE CRUD OPERATIONS
  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm) return;
    setSaving(true);
    const isNew = !serviceForm._id;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? serviceForm : { id: serviceForm._id, ...serviceForm }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم إضافة الخدمة بنجاح!' : '✓ تم تعديل الخدمة بنجاح!', 'success');
        const updated = await fetch('/api/content').then(r => r.json());
        setServices(updated.services || []);
        setServiceForm(null);
      } else {
        showToast(data.message || 'حدث خطأ ما', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ الخدمة', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذه الخدمة نهائياً؟')) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('✓ تم حذف الخدمة بنجاح!', 'success');
        setServices(services.filter(s => s._id !== id));
      }
    } catch (err) {
      showToast('خطأ أثناء حذف الخدمة', 'error');
    }
  };

  // TEAM MEMBERS CRUD OPERATIONS
  const saveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamMemberForm) return;
    setSaving(true);
    const isNew = !teamMemberForm._id;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch('/api/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? teamMemberForm : { id: teamMemberForm._id, ...teamMemberForm }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(isNew ? '✓ تم إضافة عضو الفريق بنجاح!' : '✓ تم تعديل عضو الفريق بنجاح!', 'success');
        const updated = await fetch('/api/content').then(r => r.json());
        setTeamMembers(updated.teamMembers || []);
        setTeamMemberForm(null);
      } else {
        showToast(data.message || 'حدث خطأ ما', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ عضو الفريق', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    if (!window.confirm('هل تريد حذف عضو الفريق هذا نهائياً؟')) return;
    try {
      const res = await fetch(`/api/team?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('✓ تم حذف عضو الفريق بنجاح!', 'success');
        setTeamMembers(teamMembers.filter(t => t._id !== id));
      }
    } catch (err) {
      showToast('خطأ أثناء حذف عضو الفريق', 'error');
    }
  };

  const handleTeamMemberImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTeamMemberUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع صورة العضو بنجاح!', 'success');
        setTeamMemberForm(prev => ({ ...prev, image_url: data.media.url }));
        setMedia(prev => [data.media, ...prev]);
      } else {
        showToast(data.message || 'فشل رفع صورة العضو', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء رفع الصورة', 'error');
    } finally {
      setTeamMemberUploading(false);
    }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setServiceImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع صورة الخدمة الطبية بنجاح!', 'success');
        setServiceForm(prev => prev ? ({ ...prev, image: data.media.url }) : null);
        setMedia(prev => [data.media, ...prev]);
      } else {
        showToast(data.message || 'فشل رفع صورة الخدمة', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء رفع الصورة', 'error');
    } finally {
      setServiceImageUploading(false);
    }
  };

  // CLOUDINARY PARTNER LOGO UPLOAD
  const handlePartnerLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPartnerUploadingIdx(idx);
    showToast('⏳ جاري رفع شعار الشريك ومعالجته...', 'success');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع الشريك وتحديث الشعار بنجاح!', 'success');
        const copy = JSON.parse(content.home_partners_json || '[]');
        copy[idx].logo = data.media.url;
        setContent(prev => ({ ...prev, home_partners_json: JSON.stringify(copy) }));
        setMedia(prev => [data.media, ...prev]);
      } else {
        showToast(data.message || 'فشل رفع الشعار', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء رفع الشعار للشريك', 'error');
    } finally {
      setPartnerUploadingIdx(null);
    }
  };

  // CLOUDINARY LOGO UPLOAD
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع شعار الموقع السحابي بنجاح!', 'success');
        setContent(prev => ({ ...prev, logo_img: data.media.url }));
        setMedia(prev => [data.media, ...prev]);
      } else {
        showToast(data.message || 'فشل رفع شعار الموقع', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء الاتصال بالخادم لرفع الشعار', 'error');
    } finally {
      setLogoUploading(false);
    }
  };

  // CLOUDINARY SECTION IMAGES UPLOAD
  const handleImageKeyUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast('⏳ جاري رفع ومعالجة صورة القسم...', 'success');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('✓ تم رفع وتحديث صورة القسم بنجاح!', 'success');
        setContent(prev => ({ ...prev, [key]: data.media.url }));
        setMedia(prev => [data.media, ...prev]);
      } else {
        showToast(data.message || 'فشل رفع صورة القسم', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء الاتصال بالخادم لرفع الصورة', 'error');
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
        setMedia([data.media, ...media]);
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

  // Helper renderer to render custom color picker input
  const renderColorPicker = (key: string, label: string) => {
    const val = content[key] || '';
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setContent({ ...content, [key]: e.target.value });
    };

    return (
      <div className="space-y-1.5 flex flex-col">
        <label className="text-xs font-bold text-slate-300">{label}</label>
        <div className="flex gap-3">
          <input
            type="color"
            value={val.startsWith('#') ? val : `#${val}`}
            onChange={onChange}
            className="w-12 h-10 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer p-1 focus:outline-none shrink-0"
          />
          <input
            type="text"
            value={val}
            onChange={onChange}
            placeholder="#00DAB7"
            className="flex-grow bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs font-mono focus:outline-none focus:border-cyan-400/80 transition-all text-left"
          />
        </div>
      </div>
    );
  };

  const selectTab = (tab: 'leads' | 'content' | 'services' | 'faqs' | 'blog' | 'testimonials' | 'portfolio' | 'media' | 'team' | 'security' | 'doctors' | 'clinics') => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
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

      {/* Mobile Top Header Bar */}
      <div className="flex md:hidden items-center justify-between bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-[110] w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,218,243,0.3)]">
            <span className="material-symbols-outlined text-slate-950 text-base font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              medical_services
            </span>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-white leading-tight">ديجيتال هيلث</h2>
            <p className="text-[9px] text-slate-500 font-semibold tracking-wide">لوحة الإشراف</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 hover:text-white transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">{isSidebarOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[115] md:hidden animate-fade-in" 
        />
      )}

      {/* Sidebar Section */}
      <aside className={`fixed inset-y-0 right-0 z-[120] w-72 h-full bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
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
              onClick={() => selectTab('leads')}
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
              onClick={() => selectTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'content' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'content' ? "'FILL' 1" : '' }}>settings_suggest</span>
              <span>إعدادات المحتوى</span>
            </button>

            <button
              onClick={() => selectTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'services' ? "'FILL' 1" : '' }}>medical_services</span>
              <span>إدارة الخدمات الطبية</span>
              {services.length > 0 && (
                <span className={`mr-auto px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'services' ? 'bg-slate-950 text-cyan-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  {services.length}
                </span>
              )}
            </button>

            <button
              onClick={() => selectTab('faqs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'faqs' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'faqs' ? "'FILL' 1" : '' }}>help_center</span>
              <span>الأسئلة الشائعة</span>
              {faqs.length > 0 && (
                <span className={`mr-auto px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'faqs' ? 'bg-slate-950 text-cyan-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  {faqs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => selectTab('blog')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'blog' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'blog' ? "'FILL' 1" : '' }}>article</span>
              <span>المقالات الطبية</span>
            </button>

            <button
              onClick={() => selectTab('testimonials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'testimonials' ? "'FILL' 1" : '' }}>rate_review</span>
              <span>آراء الأطباء</span>
            </button>

            <button
              onClick={() => selectTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'portfolio' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'portfolio' ? "'FILL' 1" : '' }}>finance</span>
              <span>قصص النجاح</span>
            </button>

            <button
              onClick={() => selectTab('media')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'media' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'media' ? "'FILL' 1" : '' }}>photo_library</span>
              <span>مكتبة الصور (Cloudinary)</span>
            </button>

            <button
              onClick={() => selectTab('team')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'team' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'team' ? "'FILL' 1" : '' }}>group</span>
              <span>فريق العمل</span>
            </button>

            <button
              onClick={() => selectTab('doctors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'doctors' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'doctors' ? "'FILL' 1" : '' }}>stethoscope</span>
              <span>إدارة الأطباء</span>
              {doctors.length > 0 && (
                <span className={`mr-auto px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'doctors' ? 'bg-slate-950 text-cyan-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  {doctors.length}
                </span>
              )}
            </button>

            <button
              onClick={() => selectTab('clinics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'clinics' ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold' : 'text-slate-400 hover:bg-slate-950 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'clinics' ? "'FILL' 1" : '' }}>local_hospital</span>
              <span>العيادات والمراكز</span>
              {clinics.length > 0 && (
                <span className={`mr-auto px-2 py-0.5 text-[10px] rounded-full font-extrabold ${activeTab === 'clinics' ? 'bg-slate-950 text-cyan-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                  {clinics.length}
                </span>
              )}
            </button>

            <button
              onClick={() => selectTab('security')}
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

      {/* Sleek top glowing progress bar */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-cyan-400 animate-pulse z-[300]"></div>
      )}

      {/* Main Panel Content Container */}
      <main className="flex-grow bg-slate-950 p-6 md:p-10 overflow-y-auto max-w-full">
          <>
            {/* Top greeting bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-850">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">لوحة الإشراف العام</h1>
            <p className="text-xs text-slate-400 mt-1">تعديل المقالات، والتحكم المطلق بكامل نصوص وتفاصيل الموقع والمزامنة مع قواعد البيانات</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 py-2.5 px-4 rounded-2xl text-xs font-semibold text-cyan-400 animate-fade-in">
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                <span>جاري مزامنة البيانات...</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0"></span>
                <span>MongoDB & Cloudinary: نشط وسحابي</span>
              </>
            )}
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
                { key: 'partners', label: '🤝 شركاء النجاح والقنوات' },
                { key: 'images', label: '🖼️ صور أقسام الموقع' },
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
                  {activeSubTab === 'partners' && '🤝 تعديل شركاء النجاح والقنوات الإعلانية المتحركة'}
                  {activeSubTab === 'about' && '🏢 تعديل رؤية ورسالة ومميزات صفحة من نحن'}
                  {activeSubTab === 'services' && '🦷 تعديل باقات وعناوين صفحة الخدمات'}
                  {activeSubTab === 'portfolio' && '📈 تعديل هيدر صفحة قصص النجاح ومؤشرات الأداء'}
                  {activeSubTab === 'blog' && '📰 تعديل هيدر صفحة المقالات والنشرة التوعوية'}
                  {activeSubTab === 'faq' && '❓ تعديل هيدر وعناوين صفحة الأسئلة الشائعة'}
                  {activeSubTab === 'contact' && '📞 تعديل تفاصيل وموقع صفحة اتصل بنا'}
                  {activeSubTab === 'thankyou' && '🎉 تعديل رسالة شكر العملاء بعد إرسال التفاصيل'}
                  {activeSubTab === 'images' && '🖼️ إدارة صور أقسام الموقع بالكامل'}
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
              
              {/* SUB TAB: DOCTORS & CLINICS */}
              {activeSubTab === 'doctors_clinics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('doctors_title_ar', 'عنوان صفحة الأطباء بالعربية')}
                  {renderInput('doctors_title_en', 'عنوان صفحة الأطباء بالإنجليزية', true)}
                  {renderInput('doctors_description_ar', 'وصف صفحة الأطباء بالعربية', false, true)}
                  {renderInput('doctors_description_en', 'وصف صفحة الأطباء بالإنجليزية', true, true)}
                  {renderInput('doctors_bg_image', '🖼️ رابط صورة خلفية هيدر الأطباء (اختياري)', true)}
                  <div className="md:col-span-1"></div>

                  <div className="md:col-span-2 border-b border-slate-800 my-4"></div>

                  {renderInput('clinics_title_ar', 'عنوان صفحة العيادات بالعربية')}
                  {renderInput('clinics_title_en', 'عنوان صفحة العيادات بالإنجليزية', true)}
                  {renderInput('clinics_description_ar', 'وصف صفحة العيادات بالعربية', false, true)}
                  {renderInput('clinics_description_en', 'وصف صفحة العيادات بالإنجليزية', true, true)}
                  {renderInput('clinics_bg_image', '🖼️ رابط صورة خلفية هيدر العيادات (اختياري)', true)}
                </div>
              )}

              
              {/* SUB TAB: GENERAL SETTINGS */}
              {activeSubTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('logo_text_ar', 'اسم الشعار بالعربية')}
                  {renderInput('logo_text_en', 'اسم الشعار بالإنجليزية', true)}

                  {/* Website Custom Image Logo Upload & Size Control */}
                  <div className="md:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4 text-right">
                    <h4 className="text-xs font-black text-cyan-400">🖼️ شعار الموقع الصوري (اختياري)</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      إذا كنت تفضل رفع شعار مصمم (صورة) بدلاً من الاسم النصي الافتراضي للموقع، يمكنك رفعه مباشرة من جهازك هنا والتحكم في حجم عرضه بدقة.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Left: Uploader UI */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-300">رفع ملف الشعار من جهازك (PNG / SVG / JPG)</label>
                          {content['logo_img'] && (
                            <button
                              type="button"
                              onClick={() => setContent({ ...content, logo_img: '' })}
                              className="text-rose-500 hover:text-rose-400 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              إزالة الشعار والعودة للافتراضي
                            </button>
                          )}
                        </div>
                        
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="logo-image-uploader"
                            onChange={handleLogoUpload}
                            className="hidden"
                            disabled={logoUploading}
                          />
                          <label
                            htmlFor="logo-image-uploader"
                            className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 cursor-pointer border-dashed border-2 hover:border-cyan-400/50 animate-pulse-slow"
                          >
                            <span className="material-symbols-outlined text-sm">upload_file</span>
                            <span>{logoUploading ? '⏳ جاري رفع الشعار ومعالجته...' : 'اختر صورة الشعار من جهازك'}</span>
                          </label>
                        </div>

                        {/* Manual Logo URL Input */}
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="🔗 أو الصق رابط الشعار المباشر هنا..."
                            value={content['logo_img'] || ''}
                            onChange={(e) => setContent({ ...content, logo_img: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400/80 transition-all font-sans text-left"
                            dir="ltr"
                          />
                        </div>
                        
                        {/* Logo Width Slider control */}
                        <div className="space-y-2 pt-2 border-t border-slate-850">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-300">عرض الشعار بالبكسل: <span className="text-cyan-400 font-mono font-bold">{content['logo_width'] || '150'}px</span></label>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="350"
                            value={content['logo_width'] || '150'}
                            onChange={(e) => setContent({ ...content, logo_width: e.target.value })}
                            className="w-full accent-cyan-400 bg-slate-900 h-1 rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-slate-500 font-mono" dir="ltr">
                            <span>50px</span>
                            <span>200px</span>
                            <span>350px</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: Live Preview Box */}
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
                        <span className="absolute top-2 right-3 text-[9px] font-bold text-slate-500">معاينة الشعار الحيّة</span>
                        {content['logo_img'] ? (
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={content['logo_img']}
                              alt="Logo Preview"
                              style={{ width: `${content['logo_width'] || '150'}px`, height: 'auto', maxHeight: '60px' }}
                              className="object-contain"
                            />
                            <p className="text-[9px] text-slate-500 mt-2 truncate max-w-[200px]">{content['logo_img']}</p>
                          </div>
                        ) : (
                          <div className="text-center space-y-1">
                            <span className="text-base font-bold bg-gradient-to-r from-cyan-400 to-[var(--secondary-color)] bg-clip-text text-transparent">
                              {content['logo_text_ar'] || 'ديجيتال هيلث'}
                            </span>
                            <p className="text-[9px] text-slate-500 font-bold">(الشعار النصي الافتراضي نشط)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {renderInput('font_family_ar', 'الخط العربي المستهدف (Font Family)')}
                  {renderInput('font_family_en', 'الخط الإنجليزي المستهدف', true)}

                  {renderColorPicker('primary_color', 'اللون الرئيسي الطاغي')}
                  {renderColorPicker('secondary_color', 'اللون الثانوي')}
                  {renderColorPicker('bg_color', 'لون خلفية الموقع')}
                  {renderColorPicker('surface_color', 'لون أسطح الكروت')}

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
                    <h4 className="text-xs font-bold text-cyan-400 md:col-span-2">🔎 تهيئة السيو وميتا جوجل للبحث الجغرافي بالرياض</h4>
                    {renderInput('seo_title_ar', 'عنوان سيو جوجل بالعربية')}
                    {renderInput('seo_title_en', 'عنوان سيو جوجل بالإنجليزية', true)}
                    {renderInput('seo_desc_ar', 'وصف الميتا بالعربية لتصدر البحث', false, true)}
                    {renderInput('seo_desc_en', 'وصف الميتا بالإنجليزية لتصدر البحث', true, true)}
                    {renderInput('seo_keywords_ar', 'الكلمات المفتاحية الطبية (عربي)')}
                    {renderInput('seo_keywords_en', 'الكلمات المفتاحية الطبية (إنجليزي)', true)}
                  </div>

                  {/* SUB TAB SECTION: SOCIAL MEDIA PLATFORMS */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/60">
                    <h4 className="text-xs font-bold text-cyan-400 md:col-span-2">🔗 إدارة وتعديل روابط التواصل الاجتماعي وشبكاتنا الطبية الرقمية</h4>
                    <p className="text-[10px] text-slate-400 md:col-span-2 leading-relaxed">
                      قم بتهيئة روابط صفحات عيادتك أو مركزك الطبي الرسمية لتظهر تلقائياً في تذييل الموقع وباقي الأقسام بأحدث الشعارات المحدثة والناعمة.
                    </p>
                    {renderInput('social_linkedin', 'رابط لينكد إن (LinkedIn)', true)}
                    {renderInput('social_facebook', 'رابط فيسبوك (Facebook)', true)}
                    {renderInput('social_tiktok', 'رابط تيك توك (TikTok)', true)}
                    {renderInput('social_instagram', 'رابط إنستغرام (Instagram)', true)}
                    {renderInput('social_snapchat', 'رابط سناب شات (Snapchat)', true)}
                    {renderInput('social_behance', 'رابط بيهانس (Behance)', true)}
                    {renderInput('social_x', 'رابط إكس / تويتر سابقاً (X / Twitter)', true)}
                    {renderInput('social_youtube', 'رابط يوتيوب (YouTube)', true)}
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
                  {renderInput('contact_map_iframe', 'رابط خريطة جوجل التفاعلية (Google Maps)')}
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

              {/* SUB TAB: PARTNERS & CHANNELS */}
              {activeSubTab === 'partners' && (() => {
                let parsedPartners: { name: string; logo: string }[] = [];
                try {
                  const rawJson = content['home_partners_json'] || '';
                  if (rawJson) {
                    parsedPartners = JSON.parse(rawJson);
                  }
                } catch (e) {}
                if (!parsedPartners || parsedPartners.length === 0) {
                  parsedPartners = [
                    { name: 'Google Partners', logo: '' },
                    { name: 'Meta Business', logo: '' },
                    { name: 'TikTok Ads', logo: '' },
                    { name: 'Snapchat Ads', logo: '' },
                  ];
                }

                return (
                  <div className="space-y-8 animate-fade-in text-right">
                    {/* Intro text */}
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                      <h3 className="text-sm font-bold text-white mb-2">🤝 إدارة شركاء النجاح والقنوات الإعلانية المتحركة</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        تسمح لك هذه اللوحة بإضافة وتعديل شركاء النجاح أو القنوات التلفزيونية والإعلانية التي تظهر في الشريط المتحرك بالصفحة الرئيسية للموقع. يمكنك رفع الشعارات عبر تبويب "مكتبة الصور" ثم اختيارها من القائمة المنسدلة هنا أو كتابة الرابط مباشرة.
                      </p>
                    </div>

                    {/* Editor Form & List Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Partners List */}
                      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                          <h4 className="text-xs font-black text-slate-300">القنوات والشركاء المضافين حالياً ({parsedPartners.length})</h4>
                          <button
                            type="button"
                            onClick={() => {
                              const newPartners = [...parsedPartners, { name: 'قناة جديدة', logo: '' }];
                              setContent({ ...content, home_partners_json: JSON.stringify(newPartners) });
                            }}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold px-3 py-1.5 rounded-xl text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[12px]">add</span>
                            <span>إضافة شريك جديد</span>
                          </button>
                        </div>

                        {parsedPartners.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-6">لا يوجد قنوات حالياً. اضغط على إضافة لإدراج قناة جديدة.</p>
                        ) : (
                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {parsedPartners.map((partner, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                    {partner.logo ? (
                                      <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                                    ) : (
                                      <span className="material-symbols-outlined text-slate-600 text-lg">image</span>
                                    )}
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      value={partner.name}
                                      placeholder="اسم القناة أو الشريك"
                                      onChange={(e) => {
                                        const copy = [...parsedPartners];
                                        copy[idx].name = e.target.value;
                                        setContent({ ...content, home_partners_json: JSON.stringify(copy) });
                                      }}
                                      className="bg-transparent border-b border-transparent focus:border-cyan-400 text-xs font-bold text-white focus:outline-none py-0.5 transition-all text-right"
                                    />
                                    <p className="text-[9px] text-slate-500 truncate max-w-[200px] mt-0.5">{partner.logo || 'لا يوجد شعار (سيظهر كاسم نصي)'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* File Uploader from Device */}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id={`partner-logo-uploader-${idx}`}
                                    onChange={(e) => handlePartnerLogoUpload(e, idx)}
                                    disabled={partnerUploadingIdx === idx}
                                  />
                                  <label
                                    htmlFor={`partner-logo-uploader-${idx}`}
                                    className={`bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 p-1.5 rounded-xl border border-cyan-500/20 transition-all cursor-pointer flex items-center justify-center shrink-0 ${partnerUploadingIdx === idx ? 'opacity-50 pointer-events-none' : ''}`}
                                    title="رفع شعار من الجهاز"
                                  >
                                    <span className={`material-symbols-outlined text-sm ${partnerUploadingIdx === idx ? 'animate-spin' : ''}`}>
                                      {partnerUploadingIdx === idx ? 'progress_activity' : 'cloud_upload'}
                                    </span>
                                  </label>

                                  {/* Select Logo dropdown from Media library */}
                                  <select
                                    value={partner.logo}
                                    onChange={(e) => {
                                      const copy = [...parsedPartners];
                                      copy[idx].logo = e.target.value;
                                      setContent({ ...content, home_partners_json: JSON.stringify(copy) });
                                    }}
                                    className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-xl py-1.5 px-3 focus:outline-none focus:border-cyan-400 transition-all cursor-pointer text-right"
                                  >
                                    <option value="">-- اختر شعاراً من المكتبة --</option>
                                    {media.map((m: any) => (
                                      <option key={m.url} value={m.url}>{m.filename || m.public_id}</option>
                                    ))}
                                  </select>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const copy = parsedPartners.filter((_, i) => i !== idx);
                                      setContent({ ...content, home_partners_json: JSON.stringify(copy) });
                                    }}
                                    className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                                    title="حذف الشريك"
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Preview & Guide Card */}
                      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                        <h4 className="text-xs font-black text-slate-300 pb-4 border-b border-slate-800">📊 شريط المعاينة التفاعلي</h4>
                        
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
                          <p className="text-[10px] text-slate-500 font-bold">معاينة حية للمظهر في الصفحة الرئيسية:</p>
                          <div className="py-4 border-y border-white/5 bg-slate-900/40 overflow-hidden select-none flex justify-center items-center gap-6">
                            {parsedPartners.slice(0, 4).map((p, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 opacity-60">
                                {p.logo ? (
                                  <img src={p.logo} alt={p.name} className="h-5 object-contain grayscale invert" />
                                ) : (
                                  <span className="text-[10px] font-extrabold text-white font-mono">{p.name}</span>
                                )}
                              </div>
                            ))}
                            {parsedPartners.length > 4 && (
                              <span className="text-[9px] text-slate-500 font-bold">+{parsedPartners.length - 4} أخرى</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-cyan-500/5 border border-cyan-500/10 p-5 rounded-2xl space-y-3">
                          <h5 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">info</span>
                            <span>نصائح للاستخدام الأمثل</span>
                          </h5>
                          <ul className="text-[10px] text-slate-400 space-y-2 list-disc list-inside leading-relaxed text-right">
                            <li>يفضل استخدام شعارات ذات خلفية شفافة بالكامل (PNG).</li>
                            <li>تتحول الشعارات تلقائياً إلى اللون الأبيض الأحادي المتناسق لتلائم المظهر السينمائي الفاخر للموقع.</li>
                            <li>عند مسح الشعار لشريك معين، سيقوم الموقع تلقائياً بعرض اسمه كنص عريض ذو طابع كلاسيكي أنيق.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* SUB TAB: SITE IMAGES MANAGER */}
              {activeSubTab === 'images' && (() => {
                const imageSlots = [
                  { key: 'hero_slide_1', label: '📸 الهيرو: صورة الشريحة الأولى (Slide 1)', desc: 'تظهر كالصورة الأولى في الخلفية السينمائية المتحركة لقسم الهيرو الرئيسي.' },
                  { key: 'hero_slide_2', label: '📸 الهيرو: صورة الشريحة الثانية (Slide 2)', desc: 'تظهر كالصورة الثانية في الخلفية السينمائية المتحركة لقسم الهيرو الرئيسي.' },
                  { key: 'hero_slide_3', label: '📸 الهيرو: صورة الشريحة الثالثة (Slide 3)', desc: 'تظهر كالصورة الثالثة في الخلفية السينمائية لقسم الهيرو الرئيسي.' },
                  { key: 'hero_bg_video', label: '🎥 الهيرو: فيديو الخلفية (Slide 4 - Video)', desc: 'فيديو متحرك يظهر في الخلفية اللانهائية ليعطي طابعاً سريرياً احترافياً للزوار.', isVideo: true },
                  { key: 'home_why_img', label: '📸 ميزة عيادتنا: صورة قسم "لماذا نحن" (Why Choose Us)', desc: 'تظهر بجانب قسم التوجيه العلمي وخبرة العيادة السريرية لترسيخ الهوية الطبية البصرية.' },
                  { key: 'about_img', label: '🏢 صورة قسم من نحن (الرئيسية)', desc: 'تظهر بجانب نصوص الرؤية والرسالة في الصفحة الرئيسية وصفحة التعريف.' },
                  { key: 'services_bg_img', label: '🦷 خلفية هيدر صفحة خدماتنا', desc: 'تظهر كخلفية لبانر الهيدر العلوي لصفحة استعراض باقات الخدمات الطبية.' },
                  { key: 'portfolio_bg_img', label: '📈 خلفية هيدر صفحة أعمالنا وقصص النجاح', desc: 'تظهر كخلفية للقسم العلوي في استعراض دراسات الحالة ومؤشرات الأداء للعيادات.' },
                  { key: 'blog_bg_img', label: '📰 خلفية هيدر صفحة المقالات', desc: 'تظهر كخلفية للقسم العلوي لصفحة نشر البحوث والمنشورات الصحية والتسويقية.' },
                  { key: 'faq_bg_img', label: '❓ خلفية هيدر صفحة الأسئلة الشائعة', desc: 'تظهر في القسم العلوي لصفحة الأسئلة والأجوبة الطبية التفاعلية.' },
                  { key: 'contact_bg_img', label: '📞 صورة خلفية قسم اتصل بنا', desc: 'تظهر في هيدر أو خلفية قسم التواصل وخرائط الفروع بالرياض.' },
                  { key: 'seo_meta_img', label: '🔗 الصورة الاجتماعية الافتراضية للـ SEO', desc: 'تظهر كصورة المعاينة المصغرة عند مشاركة رابط موقعك على واتساب أو منصات التواصل.' },
                ];

                return (
                  <div className="space-y-6 text-right animate-fade-in">
                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-850">
                      <h3 className="text-sm font-bold text-white mb-2">🖼️ إدارة صور وخلفيات أقسام الموقع بالكامل</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        من خلال هذا القسم يمكنك تغيير أي صورة أو خلفية متواجدة في أي زاوية من زوايا موقعك الإلكتروني الطبي مباشرة بالرفع من جهازك أو بالاختيار من مكتبتك السحابية.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {imageSlots.map((slot) => {
                        const currentUrl = content[slot.key] || '';
                        return (
                          <div key={slot.key} className="bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-cyan-400">{slot.label}</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed">{slot.desc}</p>
                            </div>

                            {/* Center Preview Box */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[140px] flex items-center justify-center relative overflow-hidden select-none">
                              {currentUrl ? (
                                slot.isVideo ? (
                                  <video
                                    src={currentUrl}
                                    controls
                                    muted
                                    playsInline
                                    className="max-h-[120px] max-w-full rounded-lg shadow-md"
                                  />
                                ) : (
                                  <img
                                    src={currentUrl}
                                    alt={slot.label}
                                    className="max-h-[120px] max-w-full object-contain rounded-lg shadow-md"
                                  />
                                )
                              ) : (
                                <div className="text-center space-y-1.5 text-slate-500">
                                  <span className="material-symbols-outlined text-3xl">
                                    {slot.isVideo ? 'movie' : 'image'}
                                  </span>
                                  <p className="text-[10px] font-bold">
                                    {slot.isVideo
                                      ? '(لا يوجد فيديو مخصص - سيتم استخدام المظهر الافتراضي)'
                                      : '(لا توجد صورة مخصصة - سيتم استخدام المظهر الافتراضي)'}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Upload & Link Controls */}
                            <div className="space-y-3 pt-2">
                              <div className="grid grid-cols-2 gap-3">
                                {/* Upload Button */}
                                <div>
                                  <input
                                    type="file"
                                    accept={slot.isVideo ? "video/*" : "image/*"}
                                    id={`image-slot-${slot.key}`}
                                    onChange={(e) => handleImageKeyUpload(e, slot.key)}
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor={`image-slot-${slot.key}`}
                                    className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 font-bold py-2.5 px-3 rounded-xl text-[10px] transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-xs">upload</span>
                                    <span>رفع من جهازك</span>
                                  </label>
                                </div>

                                {/* Select from Library */}
                                <select
                                  value={currentUrl}
                                  onChange={(e) => setContent(prev => ({ ...prev, [slot.key]: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 text-[10px] focus:outline-none focus:border-cyan-400/80 transition-all font-sans"
                                >
                                  <option value="">📁 اختر من المكتبة السحابية</option>
                                  {media.map((m, idx) => (
                                    <option key={idx} value={m.url}>
                                      {m.fileName || `ملف ${idx + 1}`}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Manual Input and Clear Button */}
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={currentUrl}
                                  onChange={(e) => setContent(prev => ({ ...prev, [slot.key]: e.target.value }))}
                                  placeholder={slot.isVideo ? "أو اكتب رابط الفيديو المباشر هنا..." : "أو اكتب رابط الصورة المباشر هنا..."}
                                  className="flex-grow bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 text-[10px] font-mono focus:outline-none text-left"
                                />
                                {currentUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setContent(prev => ({ ...prev, [slot.key]: '' }))}
                                    className="bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white px-2.5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                    title={slot.isVideo ? "حذف الفيديو والعودة للافتراضي" : "حذف الصورة والعودة للافتراضي"}
                                  >
                                    <span className="material-symbols-outlined text-xs">delete</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: FAQs MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">إدارة الأسئلة الشائعة للعيادات</h2>
              <button
                onClick={() => setFaqForm({ question_ar: '', question_en: '', answer_ar: '', answer_en: '', order: faqs.length + 1 })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>إضافة سؤال جديد</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold bg-slate-950/40">
                      <th className="p-4 md:p-6">الترتيب</th>
                      <th className="p-4 md:p-6">السؤال بالعربية</th>
                      <th className="p-4 md:p-6">السؤال بالإنجليزية</th>
                      <th className="p-4 md:p-6 text-left">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {faqs.map((faq) => (
                      <tr key={faq._id} className="hover:bg-slate-950/20 transition-all">
                        <td className="p-4 md:p-6 text-xs text-cyan-400 font-bold">{faq.order}</td>
                        <td className="p-4 md:p-6 font-bold text-white max-w-xs truncate">{faq.question_ar}</td>
                        <td className="p-4 md:p-6 text-slate-300 max-w-xs truncate" dir="ltr">{faq.question_en}</td>
                        <td className="p-4 md:p-6 text-left space-x-2 space-x-reverse">
                          <button
                            onClick={() => setFaqForm(faq)}
                            className="bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => deleteFAQ(faq._id)}
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

            {/* Modal: Create/Edit FAQ */}
            {faqForm && (
              <div className="fixed inset-0 z-[150] bg-slate-950/85 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in-slow">
                <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                    {faqForm._id ? 'تعديل السؤال الشائع الحالي' : 'إنشاء سؤال شائع جديد'}
                  </h3>

                  <form onSubmit={saveFAQ} className="space-y-4 overflow-y-auto pr-1 flex-1 mb-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">السؤال بالعربية</label>
                        <input
                          type="text"
                          required
                          value={faqForm.question_ar || ''}
                          onChange={(e) => setFaqForm({ ...faqForm, question_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">السؤال بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={faqForm.question_en || ''}
                          onChange={(e) => setFaqForm({ ...faqForm, question_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">الترتيب في الصفحة</label>
                        <input
                          type="number"
                          value={faqForm.order || 0}
                          onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">الجواب بالعربية</label>
                      <textarea
                        rows={4}
                        required
                        value={faqForm.answer_ar || ''}
                        onChange={(e) => setFaqForm({ ...faqForm, answer_ar: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">الجواب بالإنجليزية</label>
                      <textarea
                        rows={4}
                        required
                        value={faqForm.answer_en || ''}
                        onChange={(e) => setFaqForm({ ...faqForm, answer_en: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none resize-none leading-relaxed text-left"
                        dir="ltr"
                      />
                    </div>

                  </form>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFaqForm(null)}
                      className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      إلغاء وتراجع
                    </button>
                    <button
                      onClick={saveFAQ}
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
        {/* TAB: SERVICES MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">إدارة باقات الخدمات الطبية والنمو الرقمي</h2>
              <button
                onClick={() => setServiceForm({ 
                  title_ar: '', title_en: '', slug: '', icon: 'dentist', colSpan: 'md:col-span-6', order: services.length + 1,
                  tags_ar: [], tags_en: [], desc_ar: '', desc_en: '', tag_ar: '', tag_en: '', btnText_ar: 'احجز استشارة', btnText_en: 'Book Consult',
                  benefitTitle_ar: '', benefitTitle_en: '', benefitDesc_ar: '', benefitDesc_en: '',
                  benefits: [
                    { icon: 'verified', title_ar: '', title_en: '', desc_ar: '', desc_en: '' },
                    { icon: 'verified', title_ar: '', title_en: '', desc_ar: '', desc_en: '' },
                    { icon: 'verified', title_ar: '', title_en: '', desc_ar: '', desc_en: '' },
                  ],
                  strategyTitle_ar: '', strategyTitle_en: '',
                  strategies: [
                    { title_ar: '', title_en: '', desc_ar: '', desc_en: '' },
                    { title_ar: '', title_en: '', desc_ar: '', desc_en: '' },
                    { title_ar: '', title_en: '', desc_ar: '', desc_en: '' },
                  ],
                })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>إضافة خدمة طبية جديدة</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold bg-slate-950/40">
                      <th className="p-4 md:p-6">الترتيب</th>
                      <th className="p-4 md:p-6">الأيقونة</th>
                      <th className="p-4 md:p-6">الخدمة (عربي)</th>
                      <th className="p-4 md:p-6">الرابط التعريفى (Slug)</th>
                      <th className="p-4 md:p-6 text-left">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {services.map((serv) => (
                      <tr key={serv._id} className="hover:bg-slate-950/20 transition-all">
                        <td className="p-4 md:p-6 text-xs font-bold text-cyan-400">{serv.order}</td>
                        <td className="p-4 md:p-6 text-xs">
                          <span className="material-symbols-outlined text-cyan-400 text-lg">{serv.icon || 'star'}</span>
                        </td>
                        <td className="p-4 md:p-6 font-bold text-white max-w-xs truncate">{serv.title_ar}</td>
                        <td className="p-4 md:p-6 text-slate-400 text-xs font-medium" dir="ltr">{serv.slug}</td>
                        <td className="p-4 md:p-6 text-left space-x-2 space-x-reverse">
                          <button
                            onClick={() => setServiceForm(serv)}
                            className="bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => deleteService(serv._id)}
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

            {/* Modal: Create/Edit Service */}
            {serviceForm && (
              <div className="fixed inset-0 z-[150] bg-slate-950/85 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in-slow">
                <div className="bg-slate-900 border border-slate-800 max-w-4xl w-full p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3 flex justify-between items-center">
                    <span>{serviceForm._id ? 'تعديل بيانات الخدمة الطبية الحالية' : 'إنشاء خدمة طبية جديدة للعيادة'}</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">Slug: {serviceForm.slug || 'لم يحدد بعد'}</span>
                  </h3>

                  <form onSubmit={saveService} className="space-y-6 overflow-y-auto pr-2 flex-1 mb-8 text-right text-xs">
                    
                    {/* General Fields block */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-cyan-400 border-r-2 border-cyan-400 pr-2">1. البيانات التعريفية الأساسية</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">العنوان بالعربية</label>
                          <input
                            type="text"
                            required
                            value={serviceForm.title_ar || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, title_ar: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">العنوان بالإنجليزية</label>
                          <input
                            type="text"
                            required
                            value={serviceForm.title_en || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, title_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">الرابط الفريد (Slug) بالإنجليزية بدون مسافات</label>
                          <input
                            type="text"
                            required
                            value={serviceForm.slug || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                            placeholder="medical-seo"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">اسم أيقونة Material Symbols</label>
                          <input
                            type="text"
                            value={serviceForm.icon || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                            placeholder="fingerprint"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">حجم العرض التلقائي (ColSpan)</label>
                          <select
                            value={serviceForm.colSpan || 'md:col-span-6'}
                            onChange={(e) => setServiceForm({ ...serviceForm, colSpan: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          >
                            <option value="md:col-span-4">ثلث الصفحة (md:col-span-4)</option>
                            <option value="md:col-span-6">نصف الصفحة (md:col-span-6)</option>
                            <option value="md:col-span-8">ثلثي الصفحة (md:col-span-8)</option>
                            <option value="md:col-span-12">الصفحة كاملة (md:col-span-12)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">الترتيب</label>
                          <input
                            type="number"
                            value={serviceForm.order || 0}
                            onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Third Row: Custom Image */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-slate-400">رابط صورة الخدمة الطبية المخصصة</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={serviceForm.image || ''}
                              onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                              placeholder="أدخل رابط الصورة أو قم برفعها مباشرة من اليمين"
                              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                              dir="ltr"
                            />
                            <label className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl cursor-pointer flex items-center justify-center shrink-0 text-xs gap-1 font-semibold transition-colors">
                              <span>رفع صورة</span>
                              <span className="material-symbols-outlined text-sm">cloud_upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleServiceImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {serviceImageUploading && <p className="text-[10px] text-cyan-400 animate-pulse">جاري تحميل وتخزين الصورة...</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">معاينة الصورة</label>
                          <div className="h-[38px] w-full bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                            {serviceForm.image ? (
                              <img src={serviceForm.image} alt="Service preview" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-600 font-bold">لا توجد صورة مخصصة</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desc and Badge block */}
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-bold text-cyan-400 border-r-2 border-cyan-400 pr-2">2. الوصف التفصيلي والbadges</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">الوصف الرئيسي المختصر بالعربية</label>
                          <textarea
                            rows={3}
                            required
                            value={serviceForm.desc_ar || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, desc_ar: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none resize-none leading-relaxed"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">الوصف الرئيسي بالإنجليزية</label>
                          <textarea
                            rows={3}
                            required
                            value={serviceForm.desc_en || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, desc_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left resize-none leading-relaxed"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">الوسوم أو المميزات الصغيرة بالعربية (مفصولة بفاصلة ,)</label>
                          <input
                            type="text"
                            placeholder="نمو فوري, متطابق مع الصحة"
                            value={serviceForm.tags_ar?.join(', ') || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, tags_ar: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">الوسوم بالإنجليزية (مفصولة بفاصلة ,)</label>
                          <input
                            type="text"
                            placeholder="Clinical SEO, Lead Gen"
                            value={serviceForm.tags_en?.join(', ') || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, tags_en: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">بادج التميز (عربي)</label>
                          <input
                            type="text"
                            placeholder="الأكثر طلباً"
                            value={serviceForm.tag_ar || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, tag_ar: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">بادج التميز (إنجليزي)</label>
                          <input
                            type="text"
                            placeholder="Most Popular"
                            value={serviceForm.tag_en || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, tag_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">نص زر التوجيه (عربي)</label>
                          <input
                            type="text"
                            value={serviceForm.btnText_ar || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, btnText_ar: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">نص زر التوجيه (إنجليزي)</label>
                          <input
                            type="text"
                            value={serviceForm.btnText_en || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, btnText_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Benefit array block */}
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-bold text-cyan-400 border-r-2 border-cyan-400 pr-2">3. قسم الفوائد والمزايا (Benefits)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">عنوان قسم الفوائد (عربي)</label>
                          <input
                            type="text"
                            placeholder="لماذا هذه الخدمة بالذات؟"
                            value={serviceForm.benefitTitle_ar || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, benefitTitle_ar: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">عنوان قسم الفوائد (إنجليزي)</label>
                          <input
                            type="text"
                            placeholder="Why this service?"
                            value={serviceForm.benefitTitle_en || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, benefitTitle_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">وصف قسم الفوائد (عربي)</label>
                          <input
                            type="text"
                            placeholder="نوضح الفائدة الكبرى للخدمة..."
                            value={serviceForm.benefitDesc_ar || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, benefitDesc_ar: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">وصف قسم الفوائد (إنجليزي)</label>
                          <input
                            type="text"
                            placeholder="We explain the value..."
                            value={serviceForm.benefitDesc_en || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, benefitDesc_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* We display 3 static benefit inputs for extreme simplicity and ease of use */}
                      <div className="space-y-4 mt-4">
                        {[0, 1, 2].map((idx) => {
                          const benefit = serviceForm.benefits?.[idx] || { icon: 'verified', title_ar: '', title_en: '', desc_ar: '', desc_en: '' };
                          const updateBenefit = (field: string, val: string) => {
                            const current = [...(serviceForm.benefits || [])];
                            while (current.length <= idx) {
                              current.push({ icon: 'verified', title_ar: '', title_en: '', desc_ar: '', desc_en: '' });
                            }
                            current[idx] = { ...current[idx], [field]: val };
                            setServiceForm({ ...serviceForm, benefits: current });
                          };

                          return (
                            <div key={idx} className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-2">
                              <p className="font-bold text-cyan-400/80 text-[10px]">الفائدة {idx + 1}:</p>
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">أيقونة</label>
                                  <input
                                    type="text"
                                    value={benefit.icon || ''}
                                    onChange={(e) => updateBenefit('icon', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px] text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">العنوان (عربي)</label>
                                  <input
                                    type="text"
                                    value={benefit.title_ar || ''}
                                    onChange={(e) => updateBenefit('title_ar', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">العنوان (EN)</label>
                                  <input
                                    type="text"
                                    value={benefit.title_en || ''}
                                    onChange={(e) => updateBenefit('title_en', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px] text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">الوصف (عربي)</label>
                                  <input
                                    type="text"
                                    value={benefit.desc_ar || ''}
                                    onChange={(e) => updateBenefit('desc_ar', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">الوصف (EN)</label>
                                  <input
                                    type="text"
                                    value={benefit.desc_en || ''}
                                    onChange={(e) => updateBenefit('desc_en', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px] text-left"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Strategies and steps block */}
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-bold text-cyan-400 border-r-2 border-cyan-400 pr-2">4. منهجية العمل والاستراتيجية (Strategies)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">عنوان قسم الاستراتيجية (عربي)</label>
                          <input
                            type="text"
                            placeholder="مراحل تطبيق الاستراتيجية"
                            value={serviceForm.strategyTitle_ar || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, strategyTitle_ar: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">عنوان قسم الاستراتيجية (إنجليزي)</label>
                          <input
                            type="text"
                            placeholder="Execution Methodology"
                            value={serviceForm.strategyTitle_en || ''}
                            onChange={(e) => setServiceForm({ ...serviceForm, strategyTitle_en: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 focus:outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* We display 3 static strategy inputs for extreme simplicity and ease of use */}
                      <div className="space-y-4 mt-4">
                        {[0, 1, 2].map((idx) => {
                          const strategy = serviceForm.strategies?.[idx] || { title_ar: '', title_en: '', desc_ar: '', desc_en: '' };
                          const updateStrategy = (field: string, val: string) => {
                            const current = [...(serviceForm.strategies || [])];
                            while (current.length <= idx) {
                              current.push({ title_ar: '', title_en: '', desc_ar: '', desc_en: '' });
                            }
                            current[idx] = { ...current[idx], [field]: val };
                            setServiceForm({ ...serviceForm, strategies: current });
                          };

                          return (
                            <div key={idx} className="bg-slate-950 p-4 border border-slate-850 rounded-2xl space-y-2">
                              <p className="font-bold text-cyan-400/80 text-[10px]">الخطوة الاستراتيجية {idx + 1}:</p>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">العنوان (عربي)</label>
                                  <input
                                    type="text"
                                    value={strategy.title_ar || ''}
                                    onChange={(e) => updateStrategy('title_ar', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">العنوان (EN)</label>
                                  <input
                                    type="text"
                                    value={strategy.title_en || ''}
                                    onChange={(e) => updateStrategy('title_en', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px] text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">الوصف (عربي)</label>
                                  <input
                                    type="text"
                                    value={strategy.desc_ar || ''}
                                    onChange={(e) => updateStrategy('desc_ar', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-slate-500 text-[9px]">الوصف (EN)</label>
                                  <input
                                    type="text"
                                    value={strategy.desc_en || ''}
                                    onChange={(e) => updateStrategy('desc_en', e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-1 px-2 text-[10px] text-left"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </form>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setServiceForm(null)}
                      className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      إلغاء وتراجع
                    </button>
                    <button
                      onClick={saveService}
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
        {/* TAB 8: TEAM MEMBERS MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">👥 إدارة أعضاء فريق العمل</h2>
                <p className="text-xs text-slate-400 mt-1">تحكم بالكامل في طاقم العمل، ووظائفهم، ورتبهم لعرضهم في الصفحة التعريفية كعنصر متحرك راقٍ.</p>
              </div>
              <button
                onClick={() => setTeamMemberForm({ name_ar: '', name_en: '', role_ar: '', role_en: '', image_url: '', order: 0 })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>إضافة عضو جديد</span>
              </button>
            </div>

            {/* Team Members Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((t) => (
                <div key={t._id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-cyan-400/20 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      {t.image_url ? (
                        <img src={t.image_url} alt={t.name_ar} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 font-bold text-center">
                          {t.name_ar ? t.name_ar[0] : '👨‍⚕️'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-sm">{t.name_ar}</h4>
                        <p className="text-[10px] text-cyan-400 mt-0.5">{t.role_ar}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 mb-6 space-y-2 text-[11px] text-slate-400">
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span>الاسم بالإنجليزية:</span>
                        <span className="text-white font-medium">{t.name_en}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span>المسمى بالإنجليزية:</span>
                        <span className="text-white font-medium">{t.role_en}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ترتيب الظهور:</span>
                        <span className="text-cyan-400 font-bold">{t.order}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setTeamMemberForm(t)}
                      className="flex-1 bg-cyan-500/10 hover:bg-cyan-400 hover:text-slate-950 text-cyan-400 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-cyan-500/10"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => deleteTeamMember(t._id!)}
                      className="flex-1 bg-rose-500/10 hover:bg-rose-500 hover:text-slate-950 text-rose-400 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-500/10"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create/Edit Team Member */}
            {teamMemberForm && (
              <div className="fixed inset-0 z-[150] bg-slate-950/85 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in-slow">
                <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between max-h-[90vh]">
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                    {teamMemberForm._id ? '✏️ تعديل بيانات العضو' : '➕ إضافة عضو فريق عمل جديد'}
                  </h3>

                  <form onSubmit={saveTeamMember} className="space-y-4 overflow-y-auto pr-1 flex-1 mb-8">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">الاسم بالعربية</label>
                        <input
                          type="text"
                          required
                          value={teamMemberForm.name_ar || ''}
                          onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">الاسم بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={teamMemberForm.name_en || ''}
                          onChange={(e) => setTeamMemberForm({ ...teamMemberForm, name_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">الوظيفة بالعربية</label>
                        <input
                          type="text"
                          required
                          value={teamMemberForm.role_ar || ''}
                          onChange={(e) => setTeamMemberForm({ ...teamMemberForm, role_ar: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">الوظيفة بالإنجليزية</label>
                        <input
                          type="text"
                          required
                          value={teamMemberForm.role_en || ''}
                          onChange={(e) => setTeamMemberForm({ ...teamMemberForm, role_en: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Image Uploader */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400">الصورة الشخصية للتعريف</label>
                      <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        {teamMemberForm.image_url ? (
                          <img src={teamMemberForm.image_url} alt="Profile" className="w-14 h-14 rounded-full object-cover border border-slate-700" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-bold text-center text-xs">
                            لا يوجد
                          </div>
                        )}
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            id="team-avatar-uploader"
                            onChange={handleTeamMemberImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="team-avatar-uploader"
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 py-1.5 px-3 rounded-lg text-xs transition-all border border-slate-800 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            <span>{teamMemberUploading ? '⏳ جاري الرفع...' : 'اختر صورة من جهازك'}</span>
                          </label>
                          <p className="text-[10px] text-slate-500">الرفع سحابي مباشر عالي الجودة إلى Cloudinary</p>
                        </div>
                      </div>

                      {/* Manual Image Link Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-semibold">أو رابط الصورة المباشر (اختياري)</label>
                        <input
                          type="text"
                          value={teamMemberForm.image_url || ''}
                          onChange={(e) => setTeamMemberForm({ ...teamMemberForm, image_url: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-850 text-slate-300 rounded-xl py-2 px-3 text-[11px] focus:outline-none text-left"
                          dir="ltr"
                          placeholder="https://res.cloudinary.com/..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">ترتيب الظهور (الرقم الأقل يظهر أولاً)</label>
                      <input
                        type="number"
                        required
                        value={teamMemberForm.order ?? 0}
                        onChange={(e) => setTeamMemberForm({ ...teamMemberForm, order: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>

                  </form>

                  <div className="flex gap-3">
                    <button
                      onClick={saveTeamMember}
                      disabled={saving || teamMemberUploading}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
                    >
                      {saving ? '⏳ جاري الحفظ...' : '✓ حفظ العضو في الفريق'}
                    </button>
                    <button
                      onClick={() => setTeamMemberForm(null)}
                      className="flex-1 bg-slate-950 hover:bg-slate-850 text-slate-400 font-semibold py-3 px-6 rounded-xl transition-all border border-slate-800 cursor-pointer text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
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

          </>
      
        {/* ========================================================================= */}
        {/* TAB: DOCTORS */}
        {/* ========================================================================= */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">إدارة الأطباء ({doctors.length})</h2>
              <button
                onClick={() => setDoctorForm({ name_ar: '', name_en: '', specialty_ar: '', specialty_en: '', desc_ar: '', desc_en: '', image_url: '', order: 0 })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>إضافة طبيب جديد</span>
              </button>
            </div>

            {doctorForm && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl animate-fade-in relative">
                <button 
                  onClick={() => setDoctorForm(null)}
                  className="absolute top-6 left-6 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <h3 className="text-lg font-bold text-white mb-6">
                  {doctorForm._id ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}
                </h3>
                <form onSubmit={saveDoctor} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">اسم الطبيب بالعربية *</label>
                      <input type="text" required value={doctorForm.name_ar || ''} onChange={e => setDoctorForm({ ...doctorForm, name_ar: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">اسم الطبيب بالإنجليزية *</label>
                      <input type="text" required dir="ltr" value={doctorForm.name_en || ''} onChange={e => setDoctorForm({ ...doctorForm, name_en: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">التخصص بالعربية *</label>
                      <input type="text" required value={doctorForm.specialty_ar || ''} onChange={e => setDoctorForm({ ...doctorForm, specialty_ar: e.target.value })} placeholder="مثال: أطفال، باطنة..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">التخصص بالإنجليزية *</label>
                      <input type="text" required dir="ltr" value={doctorForm.specialty_en || ''} onChange={e => setDoctorForm({ ...doctorForm, specialty_en: e.target.value })} placeholder="e.g. Pediatrics" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الوصف بالعربية</label>
                      <textarea rows={3} value={doctorForm.desc_ar || ''} onChange={e => setDoctorForm({ ...doctorForm, desc_ar: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الوصف بالإنجليزية</label>
                      <textarea rows={3} dir="ltr" value={doctorForm.desc_en || ''} onChange={e => setDoctorForm({ ...doctorForm, desc_en: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">صورة الطبيب (اختياري)</label>
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                          {doctorForm.image_url ? (
                            <img src={doctorForm.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-600">person</span>
                          )}
                        </div>
                        <div className="flex-grow space-y-2">
                          <input type="text" placeholder="رابط الصورة" value={doctorForm.image_url || ''} onChange={e => setDoctorForm({ ...doctorForm, image_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white text-left" dir="ltr" />
                          <label className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-3 py-1.5 rounded-lg cursor-pointer inline-flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-[12px]">{doctorUploading ? 'sync' : 'upload'}</span>
                            {doctorUploading ? 'جاري الرفع...' : 'رفع من الجهاز'}
                            <input type="file" accept="image/*" onChange={handleDoctorImageUpload} className="hidden" disabled={doctorUploading} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الترتيب</label>
                      <input type="number" value={doctorForm.order || 0} onChange={e => setDoctorForm({ ...doctorForm, order: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={saving} className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-8 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer">
                      {saving ? 'جاري الحفظ...' : 'حفظ الطبيب'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {doctors.map(doc => (
                <div key={doc._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-400/30 transition-colors">
                  <div className="aspect-square bg-slate-950 flex items-center justify-center relative">
                    {doc.image_url ? (
                      <img src={doc.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-slate-700">person</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                      <button onClick={() => setDoctorForm(doc)} className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg" title="تعديل">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => deleteDoctor(doc._id!)} className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg" title="حذف">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded mb-2 inline-block">{doc.specialty_ar}</span>
                    <h4 className="text-sm font-bold text-white truncate">{doc.name_ar}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: CLINICS */}
        {/* ========================================================================= */}
        {activeTab === 'clinics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">إدارة العيادات والمراكز ({clinics.length})</h2>
              <button
                onClick={() => setClinicForm({ name_ar: '', name_en: '', specialty_ar: '', specialty_en: '', desc_ar: '', desc_en: '', image_url: '', order: 0 })}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>إضافة عيادة/مركز جديد</span>
              </button>
            </div>

            {clinicForm && (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl animate-fade-in relative">
                <button 
                  onClick={() => setClinicForm(null)}
                  className="absolute top-6 left-6 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <h3 className="text-lg font-bold text-white mb-6">
                  {clinicForm._id ? 'تعديل العيادة' : 'إضافة عيادة جديدة'}
                </h3>
                <form onSubmit={saveClinic} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الاسم بالعربية *</label>
                      <input type="text" required value={clinicForm.name_ar || ''} onChange={e => setClinicForm({ ...clinicForm, name_ar: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الاسم بالإنجليزية *</label>
                      <input type="text" required dir="ltr" value={clinicForm.name_en || ''} onChange={e => setClinicForm({ ...clinicForm, name_en: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">التخصص بالعربية (اختياري)</label>
                      <input type="text" value={clinicForm.specialty_ar || ''} onChange={e => setClinicForm({ ...clinicForm, specialty_ar: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">التخصص بالإنجليزية (اختياري)</label>
                      <input type="text" dir="ltr" value={clinicForm.specialty_en || ''} onChange={e => setClinicForm({ ...clinicForm, specialty_en: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الوصف بالعربية</label>
                      <textarea rows={3} value={clinicForm.desc_ar || ''} onChange={e => setClinicForm({ ...clinicForm, desc_ar: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الوصف بالإنجليزية</label>
                      <textarea rows={3} dir="ltr" value={clinicForm.desc_en || ''} onChange={e => setClinicForm({ ...clinicForm, desc_en: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">صورة العيادة (اختياري)</label>
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                          {clinicForm.image_url ? (
                            <img src={clinicForm.image_url} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-600">local_hospital</span>
                          )}
                        </div>
                        <div className="flex-grow space-y-2">
                          <input type="text" placeholder="رابط الصورة" value={clinicForm.image_url || ''} onChange={e => setClinicForm({ ...clinicForm, image_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white text-left" dir="ltr" />
                          <label className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-3 py-1.5 rounded-lg cursor-pointer inline-flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-[12px]">{clinicUploading ? 'sync' : 'upload'}</span>
                            {clinicUploading ? 'جاري الرفع...' : 'رفع من الجهاز'}
                            <input type="file" accept="image/*" onChange={handleClinicImageUpload} className="hidden" disabled={clinicUploading} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300">الترتيب</label>
                      <input type="number" value={clinicForm.order || 0} onChange={e => setClinicForm({ ...clinicForm, order: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={saving} className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-8 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer">
                      {saving ? 'جاري الحفظ...' : 'حفظ العيادة'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clinics.map(clinic => (
                <div key={clinic._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-cyan-400/30 transition-colors">
                  <div className="aspect-video bg-slate-950 flex items-center justify-center relative">
                    {clinic.image_url ? (
                      <img src={clinic.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-slate-700">local_hospital</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                      <button onClick={() => setClinicForm(clinic)} className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg" title="تعديل">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => deleteClinic(clinic._id!)} className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg" title="حذف">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    {clinic.specialty_ar && <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded mb-2 inline-block">{clinic.specialty_ar}</span>}
                    <h4 className="text-sm font-bold text-white truncate">{clinic.name_ar}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
