<?php
// Session-Protected Complete Admin Control Panel
// Location: website/admin/index.php

define('SECURE_ACCESS', true);
require_once __DIR__ . '/../api/helpers.php';

init_secure_session();
$is_logged_in = isset($_SESSION['admin_user']);
?>
<!DOCTYPE html>
<html class="dark" lang="ar" dir="rtl">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <script>
    window.csrfToken = "<?php echo get_csrf_token(); ?>";
    
    // Transparently bind X-CSRF-TOKEN header to all AJAX saves and media uploads
    const originalFetch = window.fetch;
    window.fetch = function(url, init) {
      if (typeof url === 'string' && (url.includes('save_content.php') || url.includes('upload_media.php'))) {
        init = init || {};
        init.headers = init.headers || {};
        
        // Inject CSRF protection token
        init.headers['X-CSRF-TOKEN'] = window.csrfToken;
      }
      return originalFetch(url, init);
    };
  </script>
  <title>ديجيتال هيلث | لوحة التحكم المتكاملة</title>
  
  <!-- Styling & Fonts -->
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  
  <style>
    body {
      background-color: #011230;
      color: #d8e2ff;
      font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .glass-panel {
      background: rgba(14, 31, 61, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(0, 218, 243, 0.12);
    }
    .neon-border {
      box-shadow: 0 0 20px rgba(0, 218, 243, 0.05);
      border: 1px solid rgba(0, 218, 243, 0.15);
    }
    .neon-border:hover {
      box-shadow: 0 0 30px rgba(0, 218, 243, 0.2);
      border-color: rgba(0, 218, 243, 0.4);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #000d27;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #192a48;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #00daf3;
    }
    .tab-content {
      display: none;
      animation: fadeIn 0.4s ease forwards;
    }
    .tab-content.active {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .toast {
      animation: slideIn 0.3s ease-out forwards, fadeOut 0.3s ease-in 2.7s forwards;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  </style>

  <script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#011230",
            "surface-dim": "#011230",
            "surface-container": "#0e1f3d",
            "surface-container-low": "#091b39",
            "surface-container-high": "#192a48",
            "surface-container-highest": "#253453",
            "primary": "#b9c7e4",
            "secondary-fixed-dim": "#00daf3",
            "on-surface": "#d8e2ff",
            "on-surface-variant": "#c5c6cd",
            "glass-border": "rgba(0, 218, 243, 0.12)",
            "deep-navy-surface": "#000d27"
          }
        }
      }
    }
  </script>
</head>
<body class="bg-background text-on-surface antialiased overflow-x-hidden">

  <!-- Toast Notification Container -->
  <div id="toast-container" class="fixed bottom-6 left-6 z-[200] flex flex-col gap-3 pointer-events-none"></div>

  <?php if (!$is_logged_in): ?>
  <!-- ==================================================== -->
  <!-- NEON CYAN / DARK GLASSMORPHIC LOGIN SCREEN           -->
  <!-- ==================================================== -->
  <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Glowing background elements -->
    <div class="absolute w-[500px] h-[500px] rounded-full bg-[#00daf3]/5 blur-[120px] -top-40 -right-40"></div>
    <div class="absolute w-[500px] h-[500px] rounded-full bg-[#b9c7e4]/5 blur-[120px] -bottom-40 -left-40"></div>

    <div class="glass-panel max-w-md w-full p-10 rounded-3xl neon-border relative z-10">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-secondary-fixed-dim/20 border border-secondary-fixed-dim flex items-center justify-center shadow-[0_0_30px_rgba(0,218,243,0.3)] mx-auto mb-4">
          <span class="material-symbols-outlined text-secondary-fixed-dim text-3xl">health_metrics</span>
        </div>
        <h1 class="font-bold text-2xl text-on-surface">بوابة الإشراف الطبي</h1>
        <p class="text-xs text-on-surface-variant mt-2 font-bold">لوحة تحكم وكالة ديجيتال هيلث (Digital Health)</p>
      </div>

      <form id="login-form" onsubmit="handleLogin(event)" class="space-y-6">
        <div>
          <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">اسم المستخدم</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
            <input type="text" id="login-username" class="w-full bg-[#010d27] border border-glass-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary-fixed-dim transition-all text-right" required placeholder="أدخل اسم المستخدم" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">كلمة المرور المشفرة</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
            <input type="password" id="login-password" class="w-full bg-[#010d27] border border-glass-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary-fixed-dim transition-all text-right" required placeholder="أدخل كلمة المرور" />
          </div>
        </div>

        <button type="submit" class="w-full bg-secondary-fixed-dim text-background font-bold py-4 rounded-xl hover:scale-102 hover:shadow-[0_0_20px_rgba(0,218,243,0.4)] transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-[20px]">login</span>
          <span>تسجيل الدخول الآمن</span>
        </button>
      </form>
    </div>
  </div>

  <script>
    function showToast(msg, type = "success") {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      const bg = type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      toast.className = `toast glass-panel px-5 py-3.5 rounded-xl border flex items-center gap-3 shadow-lg pointer-events-auto ${bg}`;
      toast.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">${type === 'success' ? 'check_circle' : 'error'}</span>
        <span class="text-xs font-bold">${msg}</span>
      `;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    function handleLogin(e) {
      e.preventDefault();
      const u = document.getElementById('login-username').value;
      const p = document.getElementById('login-password').value;

      fetch('../api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message, 'success');
          setTimeout(() => window.location.reload(), 800);
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ أثناء محاولة تسجيل الدخول.', 'danger');
      });
    }
  </script>

  <?php else: ?>
  <!-- ==================================================== -->
  <!-- DUAL-SYNC REAL-TIME DATABASE ADMIN PANEL            -->
  <!-- ==================================================== -->
  <div class="flex min-h-screen">

    <!-- Sidebar Navigation -->
    <aside class="w-72 fixed right-0 top-0 h-screen bg-deep-navy-surface border-l border-glass-border flex flex-col py-6 px-6 z-50">
      
      <!-- Brand Logo -->
      <div class="mb-8 flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-secondary-fixed-dim/20 border border-secondary-fixed-dim flex items-center justify-center shadow-[0_0_20px_rgba(0,218,243,0.3)]">
          <span class="material-symbols-outlined text-secondary-fixed-dim text-2xl">health_metrics</span>
        </div>
        <div>
          <h1 class="font-bold text-lg text-secondary-fixed-dim leading-none">ديجيتال هيلث</h1>
          <p class="text-[10px] tracking-wider text-on-surface-variant uppercase mt-1">إدارة التسويق الطبي الرقمي</p>
        </div>
      </div>

      <!-- Live DB Connection Indicator -->
      <div class="mb-6 px-4 py-2.5 rounded-lg bg-surface-container-low border border-glass-border flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute"></div>
        <span class="text-xs text-emerald-400 font-semibold mr-1">قاعدة البيانات: نشطة ومتصلة</span>
      </div>

      <!-- Navigation Tabs -->
      <nav class="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
        <button onclick="switchTab('overview-tab')" id="btn-overview-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-secondary-fixed-dim font-bold bg-surface-container-high border-r-4 border-secondary-fixed-dim transition-all duration-200 text-right">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="text-sm">نظرة عامة والتحليلات</span>
        </button>
        
        <button onclick="switchTab('content-tab')" id="btn-content-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">settings_suggest</span>
          <span class="text-sm">إدارة محتوى الموقع</span>
        </button>
        
        <button onclick="switchTab('articles-tab')" id="btn-articles-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">edit_note</span>
          <span class="text-sm">إدارة مقالات المدونة</span>
        </button>
        
        <button onclick="switchTab('testimonials-tab')" id="btn-testimonials-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">rate_review</span>
          <span class="text-sm">إدارة آراء الأطباء</span>
        </button>
        
        <button onclick="switchTab('portfolio-tab')" id="btn-portfolio-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">folder_shared</span>
          <span class="text-sm">إدارة معرض الأعمال</span>
        </button>
        
        <button onclick="switchTab('media-tab')" id="btn-media-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">image</span>
          <span class="text-sm">مكتبة الصور والميديا</span>
        </button>
        
        <button onclick="switchTab('leads-tab')" id="btn-leads-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">group</span>
          <span class="text-sm">طلبات الاتصال والاستشارة</span>
        </button>

        <button onclick="switchTab('appearance-tab')" id="btn-appearance-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">palette</span>
          <span class="text-sm">إعدادات المظهر والهوية</span>
        </button>

        <button onclick="switchTab('seo-tab')" id="btn-seo-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">search</span>
          <span class="text-sm">إعدادات سيو الموقع</span>
        </button>

        <button onclick="switchTab('security-tab')" id="btn-security-tab" class="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right">
          <span class="material-symbols-outlined">shield</span>
          <span class="text-sm">إعدادات الأمان والحساب</span>
        </button>
      </nav>

      <!-- Bottom System Action -->
      <div class="mt-auto pt-6 border-t border-glass-border space-y-3">
        <a href="../index.html" target="_blank" class="w-full bg-[#192a48] text-secondary-fixed-dim border border-glass-border font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary-fixed-dim hover:text-[#011230] transition-all duration-200 shadow-md text-sm">
          <span class="material-symbols-outlined text-[20px]">open_in_new</span>
          <span>عرض الموقع الإلكتروني</span>
        </a>
        <button onclick="handleLogout()" class="w-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
          <span class="material-symbols-outlined text-[20px]">logout</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Panel (Shifted due to Sidebar) -->
    <main class="flex-1 mr-72 p-10 min-h-screen relative overflow-x-hidden">
      
      <!-- Top header bar -->
      <header class="flex justify-between items-center mb-10 pb-6 border-b border-glass-border">
        <div>
          <h2 id="current-panel-title" class="text-2xl font-bold text-on-surface">نظرة عامة والتحليلات</h2>
          <p id="current-panel-subtitle" class="text-on-surface-variant text-sm mt-1">ذكاء تسويقي طبي فوري ومراقبة تحويلات العيادات.</p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Backup system -->
          <button onclick="exportDatabase()" class="glass-panel text-secondary-fixed-dim border border-secondary-fixed-dim/30 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-secondary-fixed-dim/10 transition-all">
            <span class="material-symbols-outlined text-[18px]">download</span>
            <span>نسخ احتياطي (JSON)</span>
          </button>
          <button onclick="document.getElementById('import-db-file').click()" class="glass-panel text-on-surface-variant border border-glass-border font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-all">
            <span class="material-symbols-outlined text-[18px]">upload</span>
            <span>استعادة البيانات</span>
          </button>
          <input type="file" id="import-db-file" accept=".json" onchange="importDatabase(event)" class="hidden" />
        </div>
      </header>

      <!-- PANEL 1: OVERVIEW & ANALYTICS -->
      <div id="overview-tab" class="tab-content active space-y-10">
        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-panel p-6 rounded-xl neon-border transition-all duration-300">
            <div class="flex justify-between items-start mb-4">
              <div class="p-2 bg-secondary-fixed-dim/10 rounded-lg"><span class="material-symbols-outlined text-secondary-fixed-dim">group</span></div>
              <span class="text-emerald-400 font-bold text-xs flex items-center gap-1"><span class="material-symbols-outlined text-xs">trending_up</span> +18.4%</span>
            </div>
            <p class="text-on-surface-variant text-xs font-bold mb-1">إجمالي طلبات الاستشارة</p>
            <h3 id="stat-total-leads" class="text-3xl font-bold">0</h3>
            <p class="text-[11px] text-on-surface-variant mt-2">من عيادات الرياض المتخصصة</p>
          </div>
          
          <div class="glass-panel p-6 rounded-xl neon-border transition-all duration-300">
            <div class="flex justify-between items-start mb-4">
              <div class="p-2 bg-secondary-fixed-dim/10 rounded-lg"><span class="material-symbols-outlined text-secondary-fixed-dim">edit_note</span></div>
              <span class="text-secondary-fixed-dim font-bold text-xs">نشط</span>
            </div>
            <p class="text-on-surface-variant text-xs font-bold mb-1">المقالات الطبية المنشورة</p>
            <h3 id="stat-total-articles" class="text-3xl font-bold">0</h3>
            <p class="text-[11px] text-on-surface-variant mt-2">تغطي السيو الطبي والهوية</p>
          </div>

          <div class="glass-panel p-6 rounded-xl neon-border transition-all duration-300">
            <div class="flex justify-between items-start mb-4">
              <div class="p-2 bg-secondary-fixed-dim/10 rounded-lg"><span class="material-symbols-outlined text-secondary-fixed-dim">folder_shared</span></div>
              <span class="text-secondary-fixed-dim font-bold text-xs">مكتملة</span>
            </div>
            <p class="text-on-surface-variant text-xs font-bold mb-1">دراسات الحالة والأعمال</p>
            <h3 id="stat-total-portfolio" class="text-3xl font-bold">0</h3>
            <p class="text-[11px] text-on-surface-variant mt-2">نسبة نجاح ممتازة للعيادات</p>
          </div>

          <div class="glass-panel p-6 rounded-xl neon-border transition-all duration-300">
            <div class="flex justify-between items-start mb-4">
              <div class="p-2 bg-secondary-fixed-dim/10 rounded-lg"><span class="material-symbols-outlined text-secondary-fixed-dim">image</span></div>
              <span class="text-secondary-fixed-dim font-bold text-xs">تخزين الخادم</span>
            </div>
            <p class="text-on-surface-variant text-xs font-bold mb-1">ملفات الميديا والصور</p>
            <h3 id="stat-total-media" class="text-3xl font-bold">0</h3>
            <p class="text-[11px] text-on-surface-variant mt-2">صور الهوية الطبية والحملات</p>
          </div>
        </div>

        <!-- Charts & Conversion Panel -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Graph -->
          <div class="glass-panel p-6 rounded-2xl lg:col-span-2 relative overflow-hidden">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h4 class="font-bold text-lg text-on-surface">معدل التحويل ونمو الزيارات</h4>
                <p class="text-on-surface-variant text-xs mt-1">النمو الطبي الرقمي المحقق خلال الـ 30 يوماً الماضية</p>
              </div>
              <div class="flex gap-1.5 p-1 bg-deep-navy-surface rounded-lg border border-glass-border">
                <button class="px-3 py-1 rounded font-bold text-xs bg-[#192a48] text-secondary-fixed-dim">30 يوماً</button>
                <button class="px-3 py-1 rounded font-bold text-xs text-on-surface-variant hover:text-on-surface">90 يوماً</button>
              </div>
            </div>
            <!-- Mock SVG Line Chart -->
            <div class="h-64 relative flex items-end justify-between pt-10">
              <div class="absolute inset-0 flex flex-col justify-between py-2 opacity-5">
                <div class="w-full border-t border-on-surface"></div>
                <div class="w-full border-t border-on-surface"></div>
                <div class="w-full border-t border-on-surface"></div>
                <div class="w-full border-t border-on-surface"></div>
              </div>
              <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
                <defs>
                  <linearGradient id="glowGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="rgba(0, 218, 243, 0.3)"></stop>
                    <stop offset="100%" stop-color="rgba(0, 218, 243, 0)"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,180 Q150,110 300,140 T600,60 T900,40 T1000,30" fill="none" stroke="#00daf3" stroke-linecap="round" stroke-width="4"></path>
                <path d="M0,180 Q150,110 300,140 T600,60 T900,40 T1000,30 V200 H0 Z" fill="url(#glowGrad)"></path>
                <circle cx="300" cy="140" fill="#00daf3" r="6" class="animate-pulse"></circle>
                <circle cx="600" cy="60" fill="#00daf3" r="6" class="animate-pulse"></circle>
                <circle cx="900" cy="40" fill="#00daf3" r="6" class="animate-pulse"></circle>
              </svg>
            </div>
            <div class="flex justify-between text-xs text-on-surface-variant font-bold mt-4 px-2">
              <span>أسبوع 1</span>
              <span>أسبوع 2</span>
              <span>أسبوع 3</span>
              <span>أسبوع 4</span>
            </div>
          </div>

          <!-- Services Breakdown Card -->
          <div class="glass-panel p-6 rounded-2xl flex flex-col">
            <h4 class="font-bold text-lg text-on-surface mb-6">توزيع الطلبات حسب التخصص</h4>
            <div class="flex-1 space-y-4">
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>السيو الطبي والظهور</span>
                  <span class="text-secondary-fixed-dim">45%</span>
                </div>
                <div class="h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div class="h-full bg-secondary-fixed-dim" style="width: 45%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>الهوية الرقمية والمواقع</span>
                  <span class="text-secondary-fixed-dim">30%</span>
                </div>
                <div class="h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div class="h-full bg-secondary-fixed-dim" style="width: 30%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>إدارة السوشيال ميديا</span>
                  <span class="text-secondary-fixed-dim">15%</span>
                </div>
                <div class="h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div class="h-full bg-secondary-fixed-dim" style="width: 15%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span>إعلانات جوجل والممول</span>
                  <span class="text-secondary-fixed-dim">10%</span>
                </div>
                <div class="h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div class="h-full bg-secondary-fixed-dim" style="width: 10%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PANEL 2: GENERAL WEBSITE CONTENT -->
      <div id="content-tab" class="tab-content space-y-8">
        <div class="glass-panel p-8 rounded-2xl">
          <h3 class="text-lg font-bold text-secondary-fixed-dim mb-6 border-b border-glass-border pb-3">إعدادات الهوية والاتصال</h3>
          <form id="form-general-content" onsubmit="saveGeneralContent(event)" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">الرقم الموحد للاتصال</label>
              <input type="text" id="cfg-phone" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">رقم واتساب المباشر</label>
              <input type="text" id="cfg-whatsapp" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">البريد الإلكتروني للوكالة</label>
              <input type="email" id="cfg-email" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">عنوان الوكالة بالرياض</label>
              <input type="text" id="cfg-address" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">رابط تضمين خريطة جوجل (Google Maps Embed URL)</label>
              <input type="text" id="cfg-map-iframe" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required placeholder="مثال: https://www.google.com/maps/embed?pb=..." />
            </div>
            
            <h3 class="text-lg font-bold text-secondary-fixed-dim mb-2 mt-4 md:col-span-2 border-b border-glass-border pb-3">عناوين وترويسة الموقع الرئيسية</h3>
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">عنوان الترويسة الرئيسي بالعربية</label>
              <input type="text" id="cfg-tagline-ar" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">عنوان الترويسة بالإنجليزية (Tagline EN)</label>
              <input type="text" id="cfg-tagline-en" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">وصف الهوية التعريفي بالعربية</label>
              <textarea id="cfg-desc-ar" class="w-full h-24 bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim resize-none" required></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">وصف الهوية بالإنجليزية (Description EN)</label>
              <textarea id="cfg-desc-en" class="w-full h-24 bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim resize-none" required></textarea>
            </div>
            
            <div class="md:col-span-2 pt-4 flex justify-end">
              <button type="submit" class="bg-secondary-fixed-dim text-background font-bold px-8 py-3.5 rounded-xl hover:scale-102 hover:shadow-[0_0_20px_rgba(0,218,243,0.3)] transition-all">حفظ ومزامنة محتوى الموقع</button>
            </div>
          </form>
        </div>
      </div>

      <!-- PANEL 3: ARTICLES / BLOG CMS -->
      <div id="articles-tab" class="tab-content space-y-8">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-on-surface">إجمالي المقالات المنشورة بالمدونة</h3>
          <button onclick="openArticleModal()" class="bg-secondary-fixed-dim text-background font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] transition-all">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            <span>كتابة مقال طبي جديد</span>
          </button>
        </div>
        
        <!-- Grid of Articles -->
        <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>

      <!-- PANEL 4: TESTIMONIALS CMS -->
      <div id="testimonials-tab" class="tab-content space-y-8">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-on-surface">آراء وتقييمات الأطباء والعملاء</h3>
          <button onclick="openTestimonialModal()" class="bg-secondary-fixed-dim text-background font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] transition-all">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            <span>إضافة شهادة عميل جديدة</span>
          </button>
        </div>

        <div class="glass-panel rounded-2xl overflow-hidden text-right">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-glass-border">
                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase text-right">الاسم (عربي / إنجليزي)</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase text-right">التخصص / المسمى الوظيفي</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase w-1/2 text-right">الشهادة / الاقتباس بالعربية</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase text-left">التحكم</th>
              </tr>
            </thead>
            <tbody id="testimonials-table-body" class="divide-y divide-glass-border"></tbody>
          </table>
        </div>
      </div>

      <!-- PANEL 5: PORTFOLIO / CASE STUDIES CMS -->
      <div id="portfolio-tab" class="tab-content space-y-8">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-on-surface">معرض دراسات الحالة والنمو الطبي للعيادات</h3>
          <button onclick="openPortfolioModal()" class="bg-secondary-fixed-dim text-background font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] transition-all">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            <span>إضافة دراسة حالة جديدة</span>
          </button>
        </div>

        <div id="portfolio-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </div>

      <!-- PANEL 6: MEDIA & IMAGE LIBRARY -->
      <div id="media-tab" class="tab-content space-y-8">
        <div class="glass-panel p-8 rounded-2xl text-center border-2 border-dashed border-glass-border hover:border-secondary-fixed-dim transition-all cursor-pointer relative" id="drop-zone" onclick="document.getElementById('media-file-input').click()">
          <span class="material-symbols-outlined text-secondary-fixed-dim text-5xl mb-4 animate-bounce">cloud_upload</span>
          <h4 class="font-bold text-lg text-on-surface mb-2">اضغط للتصفح ورفع الصور مباشرة للخادم</h4>
          <p class="text-on-surface-variant text-xs">يدعم صيغ JPG, PNG, WebP (يتم حفظها في مجلد uploads في موقعك)</p>
          <input type="file" id="media-file-input" class="hidden" accept="image/*" onchange="uploadImage(event)" />
        </div>

        <div>
          <h3 class="text-lg font-bold text-on-surface mb-4">الصور المخزنة في مكتبتك</h3>
          <div id="media-library-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"></div>
        </div>
      </div>

      <!-- PANEL 7: LEADS / CONTACT FORMS -->
      <div id="leads-tab" class="tab-content space-y-8">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-on-surface">طلبات الاستشارة والتواصل الواردة</h3>
          <button onclick="clearAllLeads()" class="text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 font-bold px-4 py-2 rounded-lg text-xs transition-all">
            حذف كافة الطلبات
          </button>
        </div>

        <div class="glass-panel rounded-2xl overflow-hidden text-right">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-glass-border text-right">
                <th class="p-4 text-xs font-bold text-on-surface-variant text-right">اسم مقدم الطلب</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant text-right">العيادة / التخصص</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant text-right">الخدمة المطلوبة</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant text-right">الميزانية المقدرة</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant text-right">تاريخ التقديم</th>
                <th class="p-4 text-xs font-bold text-on-surface-variant text-left">التفاصيل والتحكم</th>
              </tr>
            </thead>
            <tbody id="leads-table-body" class="divide-y divide-glass-border"></tbody>
          </table>
        </div>
      </div>

      <!-- PANEL 8: BRANDING & APPEARANCE -->
      <div id="appearance-tab" class="tab-content space-y-8">
        <div class="glass-panel p-8 rounded-2xl">
          <h3 class="text-lg font-bold text-secondary-fixed-dim mb-6 border-b border-glass-border pb-3">تخصيص الشعار ومظهر الموقع (الألوان والخطوط)</h3>
          <form id="form-appearance" onsubmit="saveAppearance(event)" class="space-y-6">
            
            <!-- Logo Section -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">اسم الشعار بالعربية</label>
                <input type="text" id="cfg-logo-text-ar" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">اسم الشعار بالإنجليزية</label>
                <input type="text" id="cfg-logo-text-en" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">شعار بصري (صورة اختياري)</label>
                <div class="flex gap-2">
                  <input type="text" id="cfg-logo-image" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="مثال: uploads/logo.png" />
                  <button type="button" onclick="triggerDeviceUpload('cfg-logo-image')" class="bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-secondary-fixed-dim hover:text-background transition-all">رفع</button>
                </div>
                <img id="cfg-logo-image-preview" class="mt-2 h-12 object-contain rounded border border-glass-border hidden" />
              </div>
            </div>

            <!-- Colors Section -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-glass-border/30">
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">اللون الأساسي (Primary Color)</label>
                <div class="flex gap-2">
                  <input type="color" id="cfg-primary-color" class="w-12 h-11 bg-transparent border-0 cursor-pointer" />
                  <input type="text" id="cfg-primary-color-text" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary-fixed-dim" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">اللون الثانوي (Secondary Color)</label>
                <div class="flex gap-2">
                  <input type="color" id="cfg-secondary-color" class="w-12 h-11 bg-transparent border-0 cursor-pointer" />
                  <input type="text" id="cfg-secondary-color-text" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary-fixed-dim" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">لون خلفية الموقع (Background)</label>
                <div class="flex gap-2">
                  <input type="color" id="cfg-bg-color" class="w-12 h-11 bg-transparent border-0 cursor-pointer" />
                  <input type="text" id="cfg-bg-color-text" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary-fixed-dim" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">لون البطاقات والأسطح (Surface)</label>
                <div class="flex gap-2">
                  <input type="color" id="cfg-surface-color" class="w-12 h-11 bg-transparent border-0 cursor-pointer" />
                  <input type="text" id="cfg-surface-color-text" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-secondary-fixed-dim" />
                </div>
              </div>
            </div>

            <!-- Fonts Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-glass-border/30">
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">خط اللغة العربية (Google Font)</label>
                <select id="cfg-font-family-ar" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim">
                  <option value="Tajawal">Tajawal (تجول)</option>
                  <option value="Cairo">Cairo (القاهرة)</option>
                  <option value="Almarai">Almarai (المراعي)</option>
                  <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
                  <option value="Amiri">Amiri (الأميري)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">خط اللغة الإنجليزية (Google Font)</label>
                <select id="cfg-font-family-en" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim">
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Outfit">Outfit</option>
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <button type="submit" class="bg-secondary-fixed-dim text-background font-bold px-8 py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,218,243,0.3)] transition-all">حفظ وإعادة تطبيق المظهر الفوري</button>
            </div>
          </form>
        </div>
      </div>

      <!-- PANEL 9: SEO MANAGEMENT -->
      <div id="seo-tab" class="tab-content space-y-8">
        <div class="glass-panel p-8 rounded-2xl">
          <h3 class="text-lg font-bold text-secondary-fixed-dim mb-6 border-b border-glass-border pb-3">إدارة محركات البحث وسيو الموقع (SEO Meta Tags)</h3>
          <form id="form-seo" onsubmit="saveSeo(event)" class="space-y-6">
            
            <!-- Arabic SEO -->
            <div class="space-y-4">
              <h4 class="font-bold text-sm text-on-surface">إعدادات الأرشفة والظهور للموقع العربي</h4>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant mb-1">عنوان الصفحة الرئيسي (Meta Title AR)</label>
                  <input type="text" id="cfg-seo-title-ar" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant mb-1">وصف محركات البحث المختصر (Meta Description AR)</label>
                  <textarea id="cfg-seo-desc-ar" class="w-full h-20 bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim resize-none" required></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant mb-1">الكلمات الدلالية المفتاحية (Meta Keywords AR - مفصولة بفواصل)</label>
                  <input type="text" id="cfg-seo-keywords-ar" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
                </div>
              </div>
            </div>

            <!-- English SEO -->
            <div class="space-y-4 pt-6 border-t border-glass-border/30">
              <h4 class="font-bold text-sm text-on-surface">Search Engine Settings for the English Website</h4>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant mb-1">Meta Title EN</label>
                  <input type="text" id="cfg-seo-title-en" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant mb-1">Meta Description EN</label>
                  <textarea id="cfg-seo-desc-en" class="w-full h-20 bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim resize-none" required></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface-variant mb-1">Meta Keywords EN (Comma separated)</label>
                  <input type="text" id="cfg-seo-keywords-en" class="w-full bg-[#010d27] border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <button type="submit" class="bg-secondary-fixed-dim text-background font-bold px-8 py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,218,243,0.3)] transition-all">حفظ ومزامنة محركات البحث</button>
            </div>
          </form>
        </div>
      </div>

      <!-- PANEL 10: ACCOUNT & SECURITY SETTINGS -->
      <div id="security-tab" class="tab-content space-y-8">
        <div class="glass-panel p-8 rounded-2xl">
          <h3 class="text-lg font-bold text-rose-400 mb-6 border-b border-glass-border pb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-[24px]">security</span>
            <span>تغيير بيانات حساب المشرف وكلمة المرور الآمنة</span>
          </h3>
          <form id="form-security" onsubmit="saveSecurity(event)" class="space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">اسم المستخدم الحالي أو الجديد</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
                  <input type="text" id="sec-username" class="w-full bg-[#010d27] border border-glass-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">كلمة المرور الحالية (للتحقق وتأكيد التغيير)</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock_open</span>
                  <input type="password" id="sec-current-password" class="w-full bg-[#010d27] border border-glass-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-rose-400" required placeholder="أدخل كلمة مرورك الحالية لتأكيد الهوية" />
                </div>
              </div>

              <div class="pt-4 border-t border-glass-border/30 md:col-span-2">
                <h4 class="font-bold text-xs text-rose-400 uppercase mb-4">كلمة المرور الجديدة (اتركها فارغة إذا كنت تريد تغيير اسم المستخدم فقط)</h4>
              </div>

              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">كلمة المرور الجديدة</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                  <input type="password" id="sec-new-password" class="w-full bg-[#010d27] border border-glass-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="أدخل كلمة المرور الجديدة" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase mb-2">تأكيد كلمة المرور الجديدة</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">enhanced_encryption</span>
                  <input type="password" id="sec-confirm-password" class="w-full bg-[#010d27] border border-glass-border rounded-xl pr-12 pl-4 py-3.5 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="أعد إدخال كلمة المرور الجديدة" />
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <button type="submit" class="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">save</span>
                <span>تحديث بيانات الأمان فوراً</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </main>
  </div>

  <!-- ARTICLE CRUD MODAL -->
  <div id="article-modal" class="fixed inset-0 z-[100] hidden bg-background/80 backdrop-blur-md flex items-center justify-center p-6 text-right">
    <div class="glass-panel max-w-2xl w-full p-8 rounded-2xl neon-border overflow-y-auto max-h-[90vh] custom-scrollbar">
      <div class="flex justify-between items-center mb-6 pb-3 border-b border-glass-border">
        <h3 id="article-modal-title" class="text-lg font-bold text-secondary-fixed-dim">كتابة مقال طبي جديد</h3>
        <button onclick="closeArticleModal()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form id="form-article" onsubmit="saveArticle(event)" class="space-y-4 text-sm">
        <input type="hidden" id="art-id" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">العنوان بالعربية</label>
            <input type="text" id="art-title-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">العنوان بالإنجليزية</label>
            <input type="text" id="art-title-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">التصنيف بالعربية</label>
            <input type="text" id="art-cat-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">التصنيف بالإنجليزية</label>
            <input type="text" id="art-cat-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">صورة المقال</label>
            <div class="flex gap-2">
              <input type="text" id="art-image" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="مثال: assets/blog1.png" required />
              <button type="button" onclick="triggerDeviceUpload('art-image')" class="bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-secondary-fixed-dim hover:text-background transition-all">رفع من الجهاز</button>
            </div>
            <img id="art-image-preview" class="mt-2 w-32 h-20 object-cover rounded-lg border border-glass-border hidden" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">مقتطف قصير بالعربية</label>
            <input type="text" id="art-excerpt-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">مقتطف بالإنجليزية (Excerpt EN)</label>
            <input type="text" id="art-excerpt-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">تاريخ النشر</label>
            <input type="date" id="art-date" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
        </div>
        <div class="pt-4 flex justify-end gap-3">
          <button type="button" onclick="closeArticleModal()" class="px-6 py-2.5 rounded-lg border border-glass-border text-on-surface-variant hover:bg-surface-container-low transition-all">إلغاء</button>
          <button type="submit" class="bg-secondary-fixed-dim text-background font-bold px-6 py-2.5 rounded-lg hover:scale-102 transition-all">نشر وحفظ</button>
        </div>
      </form>
    </div>
  </div>

  <!-- TESTIMONIAL CRUD MODAL -->
  <div id="testimonial-modal" class="fixed inset-0 z-[100] hidden bg-background/80 backdrop-blur-md flex items-center justify-center p-6 text-right">
    <div class="glass-panel max-w-xl w-full p-8 rounded-2xl neon-border overflow-y-auto max-h-[90vh] custom-scrollbar">
      <div class="flex justify-between items-center mb-6 pb-3 border-b border-glass-border">
        <h3 id="testimonial-modal-title" class="text-lg font-bold text-secondary-fixed-dim">إضافة شهادة عميل جديدة</h3>
        <button onclick="closeTestimonialModal()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form id="form-testimonial" onsubmit="saveTestimonial(event)" class="space-y-4 text-sm">
        <input type="hidden" id="test-id" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">الاسم بالعربية</label>
            <input type="text" id="test-name-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">الاسم بالإنجليزية</label>
            <input type="text" id="test-name-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">المسمى الوظيفي بالعربية</label>
            <input type="text" id="test-title-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">المسمى بالإنجليزية</label>
            <input type="text" id="test-title-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">صورة الطبيب أو العميل (اختياري)</label>
            <div class="flex gap-2">
              <input type="text" id="test-image" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="مثال: uploads/doctor1.png" />
              <button type="button" onclick="triggerDeviceUpload('test-image')" class="bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-secondary-fixed-dim hover:text-background transition-all">رفع من الجهاز</button>
            </div>
            <img id="test-image-preview" class="mt-2 w-16 h-16 object-cover rounded-full border border-glass-border hidden" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">الاقتباس/الشهادة بالعربية</label>
            <textarea id="test-quote-ar" class="w-full h-20 bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim resize-none" required></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">الاقتباس بالإنجليزية (Quote EN)</label>
            <textarea id="test-quote-en" class="w-full h-20 bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim resize-none" required></textarea>
          </div>
        </div>
        <div class="pt-4 flex justify-end gap-3">
          <button type="button" onclick="closeTestimonialModal()" class="px-6 py-2.5 rounded-lg border border-glass-border text-on-surface-variant hover:bg-surface-container-low transition-all">إلغاء</button>
          <button type="submit" class="bg-secondary-fixed-dim text-background font-bold px-6 py-2.5 rounded-lg hover:scale-102 transition-all">حفظ التغييرات</button>
        </div>
      </form>
    </div>
  </div>

  <!-- PORTFOLIO CRUD MODAL -->
  <div id="portfolio-modal" class="fixed inset-0 z-[100] hidden bg-background/80 backdrop-blur-md flex items-center justify-center p-6 text-right">
    <div class="glass-panel max-w-xl w-full p-8 rounded-2xl neon-border overflow-y-auto max-h-[90vh] custom-scrollbar">
      <div class="flex justify-between items-center mb-6 pb-3 border-b border-glass-border">
        <h3 id="portfolio-modal-title" class="text-lg font-bold text-secondary-fixed-dim">إضافة دراسة حالة جديدة</h3>
        <button onclick="closePortfolioModal()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
      </div>
      <form id="form-portfolio" onsubmit="savePortfolio(event)" class="space-y-4 text-sm">
        <input type="hidden" id="port-id" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">العنوان بالعربية</label>
            <input type="text" id="port-title-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">العنوان بالإنجليزية</label>
            <input type="text" id="port-title-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">التصنيف بالعربية</label>
            <input type="text" id="port-cat-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">التصنيف بالإنجليزية</label>
            <input type="text" id="port-cat-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">مقياس النتيجة بالعربية (أرقام النمو)</label>
            <input type="text" id="port-metric-ar" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="النتيجة: +150% ثقة وهيبة" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface-variant mb-1">مقياس النتيجة بالإنجليزية</label>
            <input type="text" id="port-metric-en" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="Result: +150% Brand Equity" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-on-surface-variant mb-1">صورة قصة النجاح</label>
            <div class="flex gap-2">
              <input type="text" id="port-image" class="w-full bg-[#000d27] border border-glass-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-secondary-fixed-dim" placeholder="مثال: assets/work1.png" required />
              <button type="button" onclick="triggerDeviceUpload('port-image')" class="bg-secondary-fixed-dim/20 text-secondary-fixed-dim border border-secondary-fixed-dim/30 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-secondary-fixed-dim hover:text-background transition-all">رفع من الجهاز</button>
            </div>
            <img id="port-image-preview" class="mt-2 w-32 h-20 object-cover rounded-lg border border-glass-border hidden" />
          </div>
        </div>
        <div class="pt-4 flex justify-end gap-3">
          <button type="button" onclick="closePortfolioModal()" class="px-6 py-2.5 rounded-lg border border-glass-border text-on-surface-variant hover:bg-surface-container-low transition-all">إلغاء</button>
          <button type="submit" class="bg-secondary-fixed-dim text-background font-bold px-6 py-2.5 rounded-lg hover:scale-102 transition-all">حفظ وإضافة</button>
        </div>
      </form>
    </div>
  </div>

  <!-- LEAD DETAILS MODAL -->
  <div id="lead-modal" class="fixed inset-0 z-[100] hidden bg-background/80 backdrop-blur-md flex items-center justify-center p-6 text-right">
    <div class="glass-panel max-w-xl w-full p-8 rounded-2xl neon-border text-sm">
      <div class="flex justify-between items-center mb-6 pb-3 border-b border-glass-border">
        <h3 class="text-lg font-bold text-secondary-fixed-dim">تفاصيل طلب الاستشارة بالكامل</h3>
        <button onclick="closeLeadModal()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
      </div>
      <div class="space-y-4 text-right" id="lead-details-content"></div>
      <div class="pt-6 mt-6 border-t border-glass-border flex justify-end">
        <button onclick="closeLeadModal()" class="bg-[#192a48] text-secondary-fixed-dim px-6 py-2.5 rounded-lg font-bold hover:scale-102 transition-all">إغلاق النافذة</button>
      </div>
    </div>
  </div>

  <!-- DATABASE LOGIC SCRIPT -->
  <script>
    let db = { content: {}, articles: [], testimonials: [], portfolio: [], leads: [], media: [] };

    // Tab switching engine
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');

      // Update active nav button styles
      document.querySelectorAll('nav button').forEach(btn => {
        btn.className = "w-full flex items-center gap-3 py-3 px-4 rounded-xl text-on-surface-variant hover:text-secondary-fixed-dim hover:bg-surface-container-low transition-all duration-200 text-right";
      });
      const activeBtn = document.getElementById('btn-' + tabId);
      if (activeBtn) {
        activeBtn.className = "w-full flex items-center gap-3 py-3 px-4 rounded-xl text-secondary-fixed-dim font-bold bg-surface-container-high border-r-4 border-secondary-fixed-dim transition-all duration-200 text-right";
      }

      // Update header title and subtitle
      const title = document.getElementById('current-panel-title');
      const sub = document.getElementById('current-panel-subtitle');
      if (tabId === 'overview-tab') {
        title.textContent = "نظرة عامة والتحليلات";
        sub.textContent = "ذكاء تسويقي طبي فوري ومراقبة تحويلات العيادات.";
      } else if (tabId === 'content-tab') {
        title.textContent = "إدارة محتوى الموقع";
        sub.textContent = "تعديل نصوص الهوية الطبية، الاتصال، والعناوين المكتوبة.";
      } else if (tabId === 'articles-tab') {
        title.textContent = "إدارة مقالات المدونة";
        sub.textContent = "تحرير وكتابة المقالات الصحية لتعزيز تصدر محركات البحث.";
      } else if (tabId === 'testimonials-tab') {
        title.textContent = "إدارة آراء الأطباء";
        sub.textContent = "إضافة آراء وتجارب الأطباء والعيادات المتعاقدة معنا.";
      } else if (tabId === 'portfolio-tab') {
        title.textContent = "إدارة معرض الأعمال";
        sub.textContent = "تحديث قصص نمو العيادات وإحصائيات النجاح الطبية المحققة.";
      } else if (tabId === 'media-tab') {
        title.textContent = "مكتبة الصور والميديا";
        sub.textContent = "رفع الصور والهويات البصرية واستلام روابطها الفورية للمقالات.";
      } else if (tabId === 'leads-tab') {
        title.textContent = "طلبات الاستشارة والتواصل";
        sub.textContent = "عرض العيادات المهتمة بنمونا الرقمي وتفاصيل تخصصاتها.";
      } else if (tabId === 'appearance-tab') {
        title.textContent = "إعدادات المظهر والهوية";
        sub.textContent = "تخصيص ألوان الهوية البصرية، الخطوط، وشعار الشركة ديجيتال هيلث.";
      } else if (tabId === 'seo-tab') {
        title.textContent = "إعدادات سيو الموقع";
        sub.textContent = "تهيئة الكلمات المفتاحية، عناوين الصفحات، والأوصاف لتصدر محركات البحث.";
      } else if (tabId === 'security-tab') {
        title.textContent = "إعدادات الأمان والحساب";
        sub.textContent = "تعديل اسم المستخدم وكلمة المرور الخاصة بلوحة تحكم الإدارة.";
      }
    }

    function showToast(msg, type = "success") {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      
      let bg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      let icon = 'check_circle';
      if (type === 'danger' || type === 'error') {
        bg = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
        icon = 'cancel';
      } else if (type === 'info') {
        bg = 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
        icon = 'info';
      }
      
      toast.className = `toast glass-panel px-6 py-4 rounded-xl border flex items-center gap-3 shadow-2xl pointer-events-auto transform translate-y-4 opacity-0 transition-all duration-500 ${bg}`;
      toast.innerHTML = `
        <span class="material-symbols-outlined text-[22px] shrink-0">${icon}</span>
        <span class="text-xs font-bold leading-relaxed">${msg}</span>
      `;
      container.appendChild(toast);
      
      // Trigger browser reflow for entry animation
      setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
      }, 50);
      
      // Auto dismiss with fade out transition
      setTimeout(() => {
        toast.classList.add('-translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
      }, 3500);
    }

    function setButtonLoading(button, isLoading) {
      if (!button) return;
      if (isLoading) {
        button.disabled = true;
        button.dataset.originalHtml = button.innerHTML;
        button.innerHTML = `
          <div class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري المزامنة...</span>
          </div>
        `;
      } else {
        button.disabled = false;
        if (button.dataset.originalHtml) {
          button.innerHTML = button.dataset.originalHtml;
        }
      }
    }

    function fetchWithLoading(url, options, submitButton) {
      if (submitButton) setButtonLoading(submitButton, true);
      return fetch(url, options)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .finally(() => {
          if (submitButton) setButtonLoading(submitButton, false);
        });
    }

    // ----------------------------------------------------
    // UNIFIED REAL-TIME DATA FETCHING FROM MYSQL
    // ----------------------------------------------------
    function fetchAndRender() {
      fetch('../api/get_content.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          db = data;
          // Sync with LocalStorage for compatibility/fallback
          localStorage.setItem('website_db', JSON.stringify(db));
          renderDashboard();
        } else {
          showToast('فشل في تحميل البيانات من قاعدة البيانات.', 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('خطأ في الاتصال بالخادم.', 'danger');
      });
    }

    function renderDashboard() {
      // 1. Overview counts
      document.getElementById('stat-total-leads').textContent = db.leads ? db.leads.length : 0;
      document.getElementById('stat-total-articles').textContent = db.articles ? db.articles.length : 0;
      document.getElementById('stat-total-portfolio').textContent = db.portfolio ? db.portfolio.length : 0;
      document.getElementById('stat-total-media').textContent = db.media ? db.media.length : 0;

      // 2. Forms/Content Inputs Sync
      if (db.content) {
        document.getElementById('cfg-phone').value = db.content.contact_phone || '';
        document.getElementById('cfg-whatsapp').value = db.content.contact_whatsapp || '';
        document.getElementById('cfg-email').value = db.content.contact_email || '';
        document.getElementById('cfg-address').value = db.content.contact_address || '';
        document.getElementById('cfg-map-iframe').value = db.content.contact_map_iframe || '';
        document.getElementById('cfg-tagline-ar').value = db.content.hero_title_ar || '';
        document.getElementById('cfg-tagline-en').value = db.content.hero_title_en || '';
        document.getElementById('cfg-desc-ar').value = db.content.hero_tagline_ar || '';
        document.getElementById('cfg-desc-en').value = db.content.hero_tagline_en || '';

        // Sync branding & styling tab
        document.getElementById('cfg-logo-text-ar').value = db.content.logo_text_ar || '';
        document.getElementById('cfg-logo-text-en').value = db.content.logo_text_en || '';
        document.getElementById('cfg-logo-image').value = db.content.logo_image || '';
        document.getElementById('cfg-logo-image').dispatchEvent(new Event('input'));
        
        const primary = db.content.primary_color || '#00daf3';
        document.getElementById('cfg-primary-color').value = primary;
        document.getElementById('cfg-primary-color-text').value = primary;
        
        const secondary = db.content.secondary_color || '#00e3fd';
        document.getElementById('cfg-secondary-color').value = secondary;
        document.getElementById('cfg-secondary-color-text').value = secondary;

        const bgColor = db.content.bg_color || '#011230';
        document.getElementById('cfg-bg-color').value = bgColor;
        document.getElementById('cfg-bg-color-text').value = bgColor;

        const surface = db.content.surface_color || '#0e1f3d';
        document.getElementById('cfg-surface-color').value = surface;
        document.getElementById('cfg-surface-color-text').value = surface;

        document.getElementById('cfg-font-family-ar').value = db.content.font_family_ar || 'Tajawal';
        document.getElementById('cfg-font-family-en').value = db.content.font_family_en || 'Plus Jakarta Sans';

        // Sync SEO tab
        document.getElementById('cfg-seo-title-ar').value = db.content.seo_title_ar || '';
        document.getElementById('cfg-seo-title-en').value = db.content.seo_title_en || '';
        document.getElementById('cfg-seo-desc-ar').value = db.content.seo_desc_ar || '';
        document.getElementById('cfg-seo-desc-en').value = db.content.seo_desc_en || '';
        document.getElementById('cfg-seo-keywords-ar').value = db.content.seo_keywords_ar || '';
        document.getElementById('cfg-seo-keywords-en').value = db.content.seo_keywords_en || '';

        // Sync Security Username field
        document.getElementById('sec-username').value = "<?php echo isset($_SESSION['admin_user']) ? $_SESSION['admin_user'] : ''; ?>";
      }

      // Render tab subsets
      renderArticles();
      renderTestimonials();
      renderPortfolio();
      renderMedia();
      renderLeads();
    }

    // 1. General Content Saving
    function saveGeneralContent(e) {
      e.preventDefault();
      const submitButton = e.submitter || e.target.querySelector('button[type="submit"]');

      const email = document.getElementById('cfg-email').value.trim();
      const phone = document.getElementById('cfg-phone').value.trim();
      const whatsapp = document.getElementById('cfg-whatsapp').value.trim();

      // Client-side validations
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('الرجاء إدخال بريد إلكتروني طبي صالح!', 'danger');
        return;
      }
      if (phone && !/^[\d\s+\-()]{7,20}$/.test(phone)) {
        showToast('الرجاء إدخال رقم هاتف صالح (أرقام فقط مع رمز البلد)!', 'danger');
        return;
      }
      if (whatsapp && !/^[\d\s+\-()]{7,20}$/.test(whatsapp)) {
        showToast('الرجاء إدخال رقم واتساب صالح (أرقام فقط مع رمز البلد)!', 'danger');
        return;
      }

      const updatedContent = {
        contact_phone: phone,
        contact_whatsapp: whatsapp,
        contact_email: email,
        contact_address: document.getElementById('cfg-address').value.trim(),
        contact_map_iframe: document.getElementById('cfg-map-iframe').value.trim(),
        hero_title_ar: document.getElementById('cfg-tagline-ar').value.trim(),
        hero_title_en: document.getElementById('cfg-tagline-en').value.trim(),
        hero_tagline_ar: document.getElementById('cfg-desc-ar').value.trim(),
        hero_tagline_en: document.getElementById('cfg-desc-en').value.trim()
      };

      fetchWithLoading('../api/save_content.php?action=update_content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent })
      }, submitButton)
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ في النظام أثناء محاولة الحفظ.', 'danger');
      });
    }

    // 2. Articles CRUD Operations
    function renderArticles() {
      const grid = document.getElementById('articles-grid');
      grid.innerHTML = '';
      if (!db.articles || db.articles.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-on-surface-variant text-sm">لا توجد مقالات منشورة حالياً.</div>`;
        return;
      }
      db.articles.forEach(art => {
        const card = document.createElement('div');
        card.className = "glass-panel rounded-xl overflow-hidden neon-border flex flex-col";
        card.innerHTML = `
          <div class="h-44 w-full bg-cover bg-center" style="background-image: url('../${art.image}')"></div>
          <div class="p-5 flex-1 flex flex-col">
            <span class="text-xs font-bold text-secondary-fixed-dim mb-2 inline-block">${art.cat_ar}</span>
            <h4 class="font-bold text-base text-on-surface mb-2 line-clamp-2 text-right">${art.title_ar}</h4>
            <p class="text-xs text-on-surface-variant line-clamp-3 mb-4 leading-relaxed text-right">${art.excerpt_ar}</p>
            <div class="flex justify-between items-center text-xs text-on-surface-variant pt-3 border-t border-glass-border mt-auto">
              <span>🗓️ ${art.date}</span>
              <div class="flex gap-2">
                <button onclick="editArticle(${art.id})" class="text-secondary-fixed-dim hover:underline font-bold">تعديل</button>
                <button onclick="deleteArticle(${art.id})" class="text-rose-400 hover:underline font-bold">حذف</button>
              </div>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function openArticleModal(artId = null) {
      document.getElementById('form-article').reset();
      document.getElementById('art-id').value = '';
      
      if (artId) {
        const art = db.articles.find(a => a.id === artId);
        if (art) {
          document.getElementById('art-id').value = art.id;
          document.getElementById('art-title-ar').value = art.title_ar;
          document.getElementById('art-title-en').value = art.title_en;
          document.getElementById('art-cat-ar').value = art.cat_ar;
          document.getElementById('art-cat-en').value = art.cat_en;
          document.getElementById('art-image').value = art.image;
          document.getElementById('art-excerpt-ar').value = art.excerpt_ar;
          document.getElementById('art-excerpt-en').value = art.excerpt_en;
          document.getElementById('art-date').value = art.date;
          document.getElementById('article-modal-title').textContent = "تعديل المقال الطبي";
        }
      } else {
        document.getElementById('art-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('article-modal-title').textContent = "كتابة مقال طبي جديد";
      }
      
      // Sync preview element
      document.getElementById('art-image').dispatchEvent(new Event('input'));
      document.getElementById('article-modal').classList.remove('hidden');
    }

    function closeArticleModal() {
      document.getElementById('article-modal').classList.add('hidden');
    }

    function saveArticle(e) {
      e.preventDefault();
      const submitButton = e.submitter || e.target.querySelector('button[type="submit"]');

      const titleAr = document.getElementById('art-title-ar').value.trim();
      const titleEn = document.getElementById('art-title-en').value.trim();
      const catAr = document.getElementById('art-cat-ar').value.trim();
      const catEn = document.getElementById('art-cat-en').value.trim();
      const image = document.getElementById('art-image').value.trim();
      const excerptAr = document.getElementById('art-excerpt-ar').value.trim();
      const excerptEn = document.getElementById('art-excerpt-en').value.trim();
      const date = document.getElementById('art-date').value;

      if (!titleAr || !titleEn || !catAr || !catEn || !image || !excerptAr || !excerptEn || !date) {
        showToast('الرجاء تعبئة جميع الحقول المطلوبة للمقال الطبي!', 'danger');
        return;
      }

      const id = document.getElementById('art-id').value;
      const payload = {
        id: id ? parseInt(id) : 0,
        title_ar: titleAr,
        title_en: titleEn,
        cat_ar: catAr,
        cat_en: catEn,
        image: image,
        excerpt_ar: excerptAr,
        excerpt_en: excerptEn,
        date: date
      };

      fetchWithLoading('../api/save_content.php?action=save_article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, submitButton)
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          closeArticleModal();
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ في الاتصال بالخادم.', 'danger');
      });
    }

    function editArticle(id) {
      openArticleModal(id);
    }

    function deleteArticle(id) {
      if (confirm("هل أنت متأكد من رغبتك في حذف هذا المقال الطبي؟")) {
        fetch('../api/save_content.php?action=delete_article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showToast(data.message);
            fetchAndRender();
          } else {
            showToast(data.message, 'danger');
          }
        });
      }
    }

    // 3. Testimonials CRUD Operations
    function renderTestimonials() {
      const tbody = document.getElementById('testimonials-table-body');
      tbody.innerHTML = '';
      if (!db.testimonials || db.testimonials.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-on-surface-variant text-sm">لا توجد آراء مسجلة حالياً.</td></tr>`;
        return;
      }
      db.testimonials.forEach(test => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-surface-container-high/40 transition-colors text-right";
        tr.innerHTML = `
          <td class="p-4 font-bold text-on-surface text-right">
            <div>${test.name_ar}</div>
            <div class="text-[10px] text-on-surface-variant font-mono" dir="ltr text-right">${test.name_en}</div>
          </td>
          <td class="p-4 text-xs text-on-surface-variant font-bold text-right">${test.title_ar}</td>
          <td class="p-4 text-xs text-on-surface-variant leading-relaxed text-right">${test.quote_ar}</td>
          <td class="p-4 text-left">
            <div class="flex gap-3 justify-end">
              <button onclick="editTestimonial(${test.id})" class="text-secondary-fixed-dim hover:underline font-bold text-xs">تعديل</button>
              <button onclick="deleteTestimonial(${test.id})" class="text-rose-400 hover:underline font-bold text-xs">حذف</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function openTestimonialModal(testId = null) {
      document.getElementById('form-testimonial').reset();
      document.getElementById('test-id').value = '';
      
      if (testId) {
        const test = db.testimonials.find(t => t.id === testId);
        if (test) {
          document.getElementById('test-id').value = test.id;
          document.getElementById('test-name-ar').value = test.name_ar;
          document.getElementById('test-name-en').value = test.name_en;
          document.getElementById('test-title-ar').value = test.title_ar;
          document.getElementById('test-title-en').value = test.title_en;
          document.getElementById('test-quote-ar').value = test.quote_ar;
          document.getElementById('test-quote-en').value = test.quote_en;
          document.getElementById('test-image').value = test.image || '';
          document.getElementById('testimonial-modal-title').textContent = "تعديل شهادة العميل";
        }
      } else {
        document.getElementById('testimonial-modal-title').textContent = "إضافة شهادة عميل جديدة";
      }
      
      // Sync preview element
      document.getElementById('test-image').dispatchEvent(new Event('input'));
      document.getElementById('testimonial-modal').classList.remove('hidden');
    }

    function closeTestimonialModal() {
      document.getElementById('testimonial-modal').classList.add('hidden');
    }

    function saveTestimonial(e) {
      e.preventDefault();
      const submitButton = e.submitter || e.target.querySelector('button[type="submit"]');

      const nameAr = document.getElementById('test-name-ar').value.trim();
      const nameEn = document.getElementById('test-name-en').value.trim();
      const titleAr = document.getElementById('test-title-ar').value.trim();
      const titleEn = document.getElementById('test-title-en').value.trim();
      const quoteAr = document.getElementById('test-quote-ar').value.trim();
      const quoteEn = document.getElementById('test-quote-en').value.trim();

      if (!nameAr || !nameEn || !titleAr || !titleEn || !quoteAr || !quoteEn) {
        showToast('الرجاء تعبئة جميع حقول شهادة الطبيب / العميل!', 'danger');
        return;
      }

      const id = document.getElementById('test-id').value;
      const payload = {
        id: id ? parseInt(id) : 0,
        name_ar: nameAr,
        name_en: nameEn,
        title_ar: titleAr,
        title_en: titleEn,
        quote_ar: quoteAr,
        quote_en: quoteEn
      };

      fetchWithLoading('../api/save_content.php?action=save_testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, submitButton)
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          closeTestimonialModal();
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ في النظام أثناء محاولة الحفظ.', 'danger');
      });
    }

    function editTestimonial(id) {
      openTestimonialModal(id);
    }

    function deleteTestimonial(id) {
      if (confirm("هل تريد حذف شهادة الطبيب هذه؟")) {
        fetch('../api/save_content.php?action=delete_testimonial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showToast(data.message);
            fetchAndRender();
          }
        });
      }
    }

    // 4. Portfolio CRUD Operations
    function renderPortfolio() {
      const grid = document.getElementById('portfolio-grid');
      grid.innerHTML = '';
      if (!db.portfolio || db.portfolio.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-on-surface-variant text-sm">لا توجد قصص نجاح مسجلة حالياً.</div>`;
        return;
      }
      db.portfolio.forEach(port => {
        const card = document.createElement('div');
        card.className = "glass-panel rounded-xl overflow-hidden neon-border flex flex-col";
        card.innerHTML = `
          <div class="h-44 w-full bg-cover bg-center" style="background-image: url('../${port.image}')"></div>
          <div class="p-5 flex-1 flex flex-col">
            <span class="text-xs font-bold text-secondary-fixed-dim mb-2 inline-block text-right">${port.cat_ar}</span>
            <h4 class="font-bold text-base text-on-surface mb-2 line-clamp-2 text-right">${port.title_ar}</h4>
            <div class="mt-2 py-2 px-3 bg-secondary-fixed-dim/5 border border-secondary-fixed-dim/15 rounded-lg text-xs font-bold text-secondary-fixed-dim text-right">
              📈 ${port.metric_ar}
            </div>
            <div class="flex justify-end gap-3 text-xs pt-4 border-t border-glass-border mt-4">
              <button onclick="editPortfolio(${port.id})" class="text-secondary-fixed-dim hover:underline font-bold">تعديل</button>
              <button onclick="deletePortfolio(${port.id})" class="text-rose-400 hover:underline font-bold">حذف</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function openPortfolioModal(portId = null) {
      document.getElementById('form-portfolio').reset();
      document.getElementById('port-id').value = '';
      
      if (portId) {
        const port = db.portfolio.find(p => p.id === portId);
        if (port) {
          document.getElementById('port-id').value = port.id;
          document.getElementById('port-title-ar').value = port.title_ar;
          document.getElementById('port-title-en').value = port.title_en;
          document.getElementById('port-cat-ar').value = port.cat_ar;
          document.getElementById('port-cat-en').value = port.cat_en;
          document.getElementById('port-metric-ar').value = port.metric_ar;
          document.getElementById('port-metric-en').value = port.metric_en;
          document.getElementById('port-image').value = port.image;
          document.getElementById('portfolio-modal-title').textContent = "تعديل دراسة الحالة";
        }
      } else {
        document.getElementById('portfolio-modal-title').textContent = "إضافة دراسة حالة جديدة";
      }
      
      // Sync preview element
      document.getElementById('port-image').dispatchEvent(new Event('input'));
      document.getElementById('portfolio-modal').classList.remove('hidden');
    }

    function closePortfolioModal() {
      document.getElementById('portfolio-modal').classList.add('hidden');
    }

    function savePortfolio(e) {
      e.preventDefault();
      const submitButton = e.submitter || e.target.querySelector('button[type="submit"]');

      const titleAr = document.getElementById('port-title-ar').value.trim();
      const titleEn = document.getElementById('port-title-en').value.trim();
      const catAr = document.getElementById('port-cat-ar').value.trim();
      const catEn = document.getElementById('port-cat-en').value.trim();
      const metricAr = document.getElementById('port-metric-ar').value.trim();
      const metricEn = document.getElementById('port-metric-en').value.trim();
      const image = document.getElementById('port-image').value.trim();

      if (!titleAr || !titleEn || !catAr || !catEn || !metricAr || !metricEn || !image) {
        showToast('الرجاء تعبئة جميع حقول دراسة الحالة / قصة النجاح الطبية!', 'danger');
        return;
      }

      const id = document.getElementById('port-id').value;
      const payload = {
        id: id ? parseInt(id) : 0,
        title_ar: titleAr,
        title_en: titleEn,
        cat_ar: catAr,
        cat_en: catEn,
        metric_ar: metricAr,
        metric_en: metricEn,
        image: image
      };

      fetchWithLoading('../api/save_content.php?action=save_portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, submitButton)
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          closePortfolioModal();
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ في النظام أثناء محاولة الحفظ.', 'danger');
      });
    }

    function editPortfolio(id) {
      openPortfolioModal(id);
    }

    function deletePortfolio(id) {
      if (confirm("هل ترغب فعلاً في حذف قصة النجاح هذه؟")) {
        fetch('../api/save_content.php?action=delete_portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showToast(data.message);
            fetchAndRender();
          }
        });
      }
    }

    // 5. Media Management (Server File Upload Integration)
    function renderMedia() {
      const grid = document.getElementById('media-library-grid');
      grid.innerHTML = '';
      if (!db.media || db.media.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-on-surface-variant text-sm">مكتبة الوسائط فارغة حالياً.</div>`;
        return;
      }
      db.media.forEach(med => {
        const card = document.createElement('div');
        card.className = "glass-panel rounded-xl overflow-hidden neon-border group relative flex flex-col";
        card.innerHTML = `
          <div class="h-28 w-full bg-cover bg-center" style="background-image: url('../${med.url}')"></div>
          <div class="p-2.5 flex-1 flex flex-col justify-between">
            <span class="text-[10px] text-on-surface-variant truncate block font-bold text-right">${med.name}</span>
            <div class="flex gap-2 justify-between mt-2 pt-2 border-t border-glass-border/30 text-[10px]">
              <button onclick="copyMediaUrl('${med.url}')" class="text-secondary-fixed-dim hover:underline font-bold">نسخ الرابط</button>
              <button onclick="deleteMedia(${med.id})" class="text-rose-400 hover:underline font-bold">حذف</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function uploadImage(e) {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      fetch('../api/upload_media.php', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ أثناء رفع الصورة لموقعك.', 'danger');
      });
    }

    function copyMediaUrl(url) {
      // Build absolute URL for easy copying
      const absoluteUrl = window.location.origin + '/' + url.replace(/^\.\.\//, '');
      navigator.clipboard.writeText(absoluteUrl).then(() => {
        showToast("تم نسخ رابط الصورة الكامل إلى الحافظة!");
      }).catch(err => {
        const textarea = document.createElement('textarea');
        textarea.value = absoluteUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast("تم نسخ رابط الصورة بنجاح!");
      });
    }

    function deleteMedia(id) {
      if (confirm("هل أنت متأكد من حذف هذه الصورة من مكتبتك؟")) {
        // Since media delete is not separate, we can add it or let database sync it.
        // Let's create an action in save_content or query database directly.
        // Let's implement it inside db or simply hide it. For maximum safety, let's allow deleting it:
        fetch('../api/save_content.php?action=delete_lead', { // or we can use a custom request
          // Actually, let's keep it robust and add a quick custom delete if needed.
          // For simplicity we will handle delete in PHP.
        });
      }
    }

    // 6. Leads / Form Submissions Manager
    function renderLeads() {
      const tbody = document.getElementById('leads-table-body');
      tbody.innerHTML = '';
      
      if (!db.leads || db.leads.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="p-8 text-center text-on-surface-variant">لا توجد أي طلبات تواصل واردة حالياً.</td>
          </tr>
        `;
        return;
      }

      db.leads.forEach(lead => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-surface-container-high/40 transition-colors text-right";
        
        const serviceBadge = lead.services && lead.services.length > 0 ? lead.services[0] : 'استشارة عامة';
        const dateStr = lead.date || 'تاريخ غير محدد';
        
        tr.innerHTML = `
          <td class="p-4 font-bold text-on-surface text-right">
            <div>${lead.name}</div>
            <div class="text-[10px] text-on-surface-variant font-mono text-right" dir="ltr">${lead.phone}</div>
          </td>
          <td class="p-4 text-xs font-bold text-on-surface-variant text-right">
            <div>${lead.clientType}</div>
            <div class="text-[10px] font-normal text-secondary-fixed-dim mt-0.5 text-right">${lead.specialty}</div>
          </td>
          <td class="p-4 text-xs text-on-surface-variant text-right">
            <span class="px-2.5 py-1 rounded bg-secondary-fixed-dim/10 text-secondary-fixed-dim border border-secondary-fixed-dim/20 font-bold">${serviceBadge}</span>
          </td>
          <td class="p-4 text-xs font-bold text-on-surface text-right">${lead.budget}</td>
          <td class="p-4 text-xs text-on-surface-variant text-right">${dateStr}</td>
          <td class="p-4 text-left">
            <div class="flex gap-3 justify-end">
              <button onclick="viewLeadDetails(${lead.id})" class="text-secondary-fixed-dim hover:underline font-bold text-xs">عرض التفاصيل</button>
              <button onclick="deleteLead(${lead.id})" class="text-rose-400 hover:underline font-bold text-xs">حذف</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function viewLeadDetails(id) {
      const lead = db.leads.find(l => l.id == id);
      if (!lead) return;

      const content = document.getElementById('lead-details-content');
      content.innerHTML = `
        <div class="grid grid-cols-2 gap-4 text-right">
          <div>
            <span class="text-xs text-on-surface-variant block font-bold text-right">اسم مقدم الطلب</span>
            <span class="font-bold text-base text-on-surface text-right">${lead.name}</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant block font-bold text-right">رقم الهاتف والجوال</span>
            <span class="font-bold text-base text-secondary-fixed-dim text-right" dir="ltr">${lead.phone}</span>
          </div>
          <div class="col-span-2">
            <span class="text-xs text-on-surface-variant block font-bold text-right">البريد الإلكتروني</span>
            <span class="font-bold text-on-surface font-mono text-right">${lead.email}</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant block font-bold text-right">نوع الكيان الطبي</span>
            <span class="font-bold text-on-surface text-right">${lead.clientType}</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant block font-bold text-right">التخصص الطبي</span>
            <span class="font-bold text-secondary-fixed-dim text-right">${lead.specialty}</span>
          </div>
          <div class="col-span-2">
            <span class="text-xs text-on-surface-variant block font-bold text-right">الخدمات الطبية المطلوبة</span>
            <div class="flex flex-wrap gap-2 mt-1 justify-start dir-rtl">
              ${lead.services.map(s => `<span class="px-2 py-0.5 rounded bg-surface-container-high border border-glass-border text-xs text-on-surface font-bold">${s}</span>`).join('')}
            </div>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant block font-bold text-right">الميزانية المرصودة</span>
            <span class="font-bold text-on-surface text-right">${lead.budget}</span>
          </div>
          <div>
            <span class="text-xs text-on-surface-variant block font-bold text-right">مصدر التعرف علينا</span>
            <span class="font-bold text-on-surface text-right">${lead.referrer}</span>
          </div>
          <div class="col-span-2 pt-2 border-t border-glass-border">
            <span class="text-xs text-on-surface-variant block font-bold mb-1 text-right">تفاصيل الرسالة الاستشارية</span>
            <p class="p-4 rounded-xl bg-[#000d27] border border-glass-border text-on-surface leading-relaxed text-xs text-right">${lead.message || 'لا توجد رسالة مرفقة.'}</p>
          </div>
        </div>
      `;
      
      document.getElementById('lead-modal').classList.remove('hidden');
    }

    function closeLeadModal() {
      document.getElementById('lead-modal').classList.add('hidden');
    }

    function deleteLead(id) {
      if (confirm("هل أنت متأكد من رغبتك في حذف طلب الاستشارة هذا؟")) {
        fetch('../api/save_content.php?action=delete_lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showToast(data.message);
            fetchAndRender();
          }
        });
      }
    }

    function clearAllLeads() {
      if (confirm("هل تريد بالفعل مسح كافة طلبات الاستشارة المخزنة؟ لا يمكن التراجع عن هذا الإجراء.")) {
        fetch('../api/save_content.php?action=clear_leads', {
          method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showToast(data.message);
            fetchAndRender();
          }
        });
      }
    }

    // 7. System Database Backups
    function exportDatabase() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "digital_health_db_backup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("تم تصدير النسخة الاحتياطية بنجاح!");
    }

    function importDatabase(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.content && parsed.articles && parsed.testimonials && parsed.portfolio) {
            
            fetch('../api/save_content.php?action=import_db', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed)
            })
            .then(res => res.json())
            .then(data => {
              if (data.status === 'success') {
                showToast(data.message);
                fetchAndRender();
              } else {
                alert("خطأ أثناء استعادة البيانات على الخادم.");
              }
            });

          } else {
            alert("تنسيق ملف النسخة الاحتياطية غير صالح.");
          }
        } catch (err) {
          alert("حدث خطأ أثناء قراءة ملف البيانات.");
        }
      };
      reader.readAsText(file);
    }

    // 8. Branding & Appearance Settings Save
    function saveAppearance(e) {
      e.preventDefault();
      const submitButton = e.submitter || e.target.querySelector('button[type="submit"]');

      const primary = document.getElementById('cfg-primary-color-text').value.trim();
      const secondary = document.getElementById('cfg-secondary-color-text').value.trim();
      const bg = document.getElementById('cfg-bg-color-text').value.trim();
      const surface = document.getElementById('cfg-surface-color-text').value.trim();

      const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
      if (!hexRegex.test(primary) || !hexRegex.test(secondary) || !hexRegex.test(bg) || !hexRegex.test(surface)) {
        showToast('الرجاء إدخال أكواد الألوان بنظام الـ Hex بشكل صحيح! (مثال: #00daf3)', 'danger');
        return;
      }

      const updatedContent = {
        logo_text_ar: document.getElementById('cfg-logo-text-ar').value.trim(),
        logo_text_en: document.getElementById('cfg-logo-text-en').value.trim(),
        logo_image: document.getElementById('cfg-logo-image').value.trim(),
        primary_color: primary,
        secondary_color: secondary,
        bg_color: bg,
        surface_color: surface,
        font_family_ar: document.getElementById('cfg-font-family-ar').value,
        font_family_en: document.getElementById('cfg-font-family-en').value
      };

      fetchWithLoading('../api/save_content.php?action=update_content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent })
      }, submitButton)
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ أثناء حفظ المظهر.', 'danger');
      });
    }

    // 9. SEO Settings Save
    function saveSeo(e) {
      e.preventDefault();
      const submitButton = e.submitter || e.target.querySelector('button[type="submit"]');

      const titleAr = document.getElementById('cfg-seo-title-ar').value.trim();
      const titleEn = document.getElementById('cfg-seo-title-en').value.trim();
      const descAr = document.getElementById('cfg-seo-desc-ar').value.trim();
      const descEn = document.getElementById('cfg-seo-desc-en').value.trim();

      if (!titleAr || !titleEn || !descAr || !descEn) {
        showToast('الرجاء كتابة العنوان والوصف التعريفي بالكامل لتهيئة السيو!', 'danger');
        return;
      }
      if (descAr.length < 20 || descEn.length < 20) {
        showToast('يُنصح بألا يقل وصف السيو عن 20 حرفاً لضمان فهرسة ممتازة في جوجل!', 'info');
      }

      const updatedContent = {
        seo_title_ar: titleAr,
        seo_title_en: titleEn,
        seo_desc_ar: descAr,
        seo_desc_en: descEn,
        seo_keywords_ar: document.getElementById('cfg-seo-keywords-ar').value.trim(),
        seo_keywords_en: document.getElementById('cfg-seo-keywords-en').value.trim()
      };

      fetchWithLoading('../api/save_content.php?action=update_content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent })
      }, submitButton)
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ أثناء حفظ إعدادات السيو.', 'danger');
      });
    }

    // 10. Account Credentials Update
    function saveSecurity(e) {
      e.preventDefault();
      const submitButton = e.submitter || e.target.querySelector('button[type="submit"]');

      const username = document.getElementById('sec-username').value.trim();
      const currentPass = document.getElementById('sec-current-password').value;
      const newPass = document.getElementById('sec-new-password').value;
      const confirmPass = document.getElementById('sec-confirm-password').value;

      if (!username) {
        showToast('الرجاء إدخال اسم مستخدم صالح!', 'danger');
        return;
      }
      if (!currentPass) {
        showToast('يجب إدخال كلمة المرور الحالية لتأكيد الهوية وتحديث البيانات!', 'danger');
        return;
      }
      if (newPass) {
        if (newPass.length < 8) {
          showToast('يجب ألا تقل كلمة المرور الجديدة عن 8 خانات لتأمين حسابك!', 'danger');
          return;
        }
        if (newPass !== confirmPass) {
          showToast('كلمة المرور الجديدة وتأكيدها غير متطابقين!', 'danger');
          return;
        }
      }

      const payload = {
        new_username: username,
        current_password: currentPass,
        new_password: newPass
      };

      fetchWithLoading('../api/save_content.php?action=update_credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, submitButton)
      .then(data => {
        if (data.status === 'success') {
          showToast(data.message);
          document.getElementById('sec-current-password').value = '';
          document.getElementById('sec-new-password').value = '';
          document.getElementById('sec-confirm-password').value = '';
          fetchAndRender();
        } else {
          showToast(data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('حدث خطأ أثناء حفظ إعدادات الأمان.', 'danger');
      });
    }

    // 11. Custom Direct Device Image Upload
    function triggerDeviceUpload(targetInputId) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      
      fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Dynamic immediate local preview prior to server upload
        const previewId = targetInputId + '-preview';
        const previewImg = document.getElementById(previewId);
        if (previewImg) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            previewImg.src = evt.target.result;
            previewImg.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
        
        showToast('جاري رفع الملف فوراً...', 'info');
        
        const formData = new FormData();
        formData.append('image', file);
        
        fetch('../api/upload_media.php', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showToast('تم الرفع وحفظ الملف بنجاح!');
            const inputEl = document.getElementById(targetInputId);
            if (inputEl) {
              inputEl.value = data.url;
              // Trigger input event to update color/styles if needed
              inputEl.dispatchEvent(new Event('input'));
            }
            
            // Re-confirm absolute final preview URL
            if (previewImg) {
              previewImg.src = '../' + data.url;
              previewImg.classList.remove('hidden');
            }
          } else {
            showToast(data.message, 'danger');
            // Hide preview if upload failed and input is empty
            if (previewImg && !document.getElementById(targetInputId).value) {
              previewImg.classList.add('hidden');
            }
          }
        })
        .catch(err => {
          console.error(err);
          showToast('فشل رفع الصورة للخادم.', 'danger');
          if (previewImg && !document.getElementById(targetInputId).value) {
            previewImg.classList.add('hidden');
          }
        });
      };
      
      fileInput.click();
    }

    // 12. Media Item Deletion Handler
    function deleteMedia(id) {
      if (confirm("هل أنت متأكد من حذف هذه الصورة نهائياً؟ سيتم مسحها من الخادم والمكتبة.")) {
        fetch('../api/save_content.php?action=delete_media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            showToast(data.message);
            fetchAndRender();
          } else {
            showToast(data.message, 'danger');
          }
        })
        .catch(err => {
          console.error(err);
          showToast('حدث خطأ في النظام أثناء محاولة الحذف.', 'danger');
        });
      }
    }

    // Color pickers sync on input
    document.addEventListener('DOMContentLoaded', () => {
      const syncColor = (pickerId, textId) => {
        const picker = document.getElementById(pickerId);
        const text = document.getElementById(textId);
        if(picker && text) {
          picker.addEventListener('input', (e) => text.value = e.target.value);
          text.addEventListener('input', (e) => picker.value = e.target.value);
        }
      };
      syncColor('cfg-primary-color', 'cfg-primary-color-text');
      syncColor('cfg-secondary-color', 'cfg-secondary-color-text');
      syncColor('cfg-bg-color', 'cfg-bg-color-text');
      syncColor('cfg-surface-color', 'cfg-surface-color-text');

      // Real-time dynamic image previews
      const setupPreview = (inputId, previewId) => {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (input && preview) {
          const update = () => {
            const val = input.value.trim();
            if (val) {
              preview.src = (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:')) ? val : '../' + val;
              preview.classList.remove('hidden');
            } else {
              preview.classList.add('hidden');
            }
          };
          input.addEventListener('input', update);
          input.addEventListener('change', update);
        }
      };
      setupPreview('art-image', 'art-image-preview');
      setupPreview('port-image', 'port-image-preview');
      setupPreview('test-image', 'test-image-preview');
      setupPreview('cfg-logo-image', 'cfg-logo-image-preview');
    });

    function handleLogout() {
      fetch('../api/auth.php?action=logout')
      .then(res => res.json())
      .then(data => {
        showToast(data.message);
        setTimeout(() => window.location.reload(), 500);
      });
    }

    // Initialize Database on load
    window.addEventListener('DOMContentLoaded', fetchAndRender);
  </script>
  <?php endif; ?>
</body>
</html>
