// Shared Navigation, Multi-Language Translation, Counter, and Animation Logic
(function () {
  
  // 1. Inject Global Design Transition & Animation Styles
  const style = document.createElement('style');
  style.textContent = `
    html {
      scroll-behavior: smooth;
    }
    /* Universal smooth transition */
    *, *::before, *::after {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
      transition-duration: 450ms !important;
    }
    .reveal-hidden {
      opacity: 0;
      transform: translateY(40px) scale(0.97);
      filter: blur(8px);
      transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      will-change: transform, opacity, filter;
    }
    .reveal-active {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
    .page-transition {
      animation: fadeInPage 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInPage {
      from { opacity: 0; filter: blur(15px); transform: translateY(30px) scale(0.98); }
      to { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
    }
    /* Add subtle active scaling to buttons */
    a:active, button:active {
      transform: scale(0.94) !important;
    }
    /* Breathing slow glow animation for cosmic medical circles */
    @keyframes breatheGlow {
      0%, 100% {
        transform: scale(1) translate(0px, 0px);
        opacity: 0.08;
        filter: blur(110px);
      }
      50% {
        transform: scale(1.2) translate(20px, -30px);
        opacity: 0.15;
        filter: blur(130px);
      }
    }
    .animated-glow-circle {
      animation: breatheGlow 12s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
      will-change: transform, opacity;
    }
    /* Header transition */
    header {
      transition: background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.6s ease, border 0.6s ease !important;
    }
    .header-scrolled {
      background-color: rgba(1, 18, 48, 0.85) !important;
      backdrop-filter: blur(20px) !important;
      border-bottom: 1px solid rgba(0, 218, 243, 0.12) !important;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    }
    /* Language specific font declarations */
    html[lang="en"] body {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }
    html[lang="en"] h1, html[lang="en"] h2, html[lang="en"] h3, html[lang="en"] h4, html[lang="en"] h5, html[lang="en"] h6, html[lang="en"] .font-headline-lg, html[lang="en"] .font-headline-xl, html[lang="en"] .font-display-lg {
      font-family: 'Outfit', sans-serif !important;
    }
  `;
  document.head.appendChild(style);

  // Load English Google Fonts dynamically if not present
  if (!document.querySelector('link[href*="Plus+Jakarta+Sans"]')) {
    const fontsLink = document.createElement('link');
    fontsLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
    fontsLink.rel = 'stylesheet';
    document.head.appendChild(fontsLink);
  }

  // Apply page transition to main content
  const main = document.querySelector('main');
  if (main) main.classList.add('page-transition');

  // 2. Cinematic Scroll Reveal Animations
  const animatedElements = document.querySelectorAll('.glass-card, article, h1, h2, h3, p, img, li, .faq-item, .counter');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.01
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        entry.target.classList.remove('reveal-hidden');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el, index) => {
    if(!el.classList.contains('absolute') && !el.closest('#mobile-menu') && !el.closest('header')) {
      el.classList.add('reveal-hidden');
      const delay = (index % 8) * 80;
      el.style.transitionDelay = `${delay}ms`;
      revealObserver.observe(el);
    }
  });

  // 3. Inject Slowly Breathing Glowing Background Circles
  document.querySelectorAll('section, main').forEach((section, index) => {
    if (section.style.position === 'absolute' || section.querySelector('.animated-glow-circle')) return;
    
    const styles = window.getComputedStyle(section);
    if (styles.position === 'static') {
      section.style.position = 'relative';
    }
    
    const glow = document.createElement('div');
    const alignClass = index % 2 === 0 ? 'top-10 left-10' : 'bottom-10 right-10';
    const colorClass = index % 2 === 0 ? 'bg-[#00daf3]' : 'bg-[#00e3fd]';
    glow.className = `absolute w-96 h-96 ${alignClass} ${colorClass} opacity-[0.07] blur-[110px] rounded-full animated-glow-circle`;
    section.appendChild(glow);
  });

  // 4. Header Shrink and Blur on Scroll
  const headerContainer = document.querySelector('header');
  const headerInner = document.querySelector('header > div, header > nav');
  
  if (headerInner) {
    headerInner.style.transition = 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      if(headerContainer) headerContainer.classList.add('header-scrolled');
      if(headerInner) headerInner.style.height = '4rem'; 
    } else {
      if(headerContainer) headerContainer.classList.remove('header-scrolled');
      if(headerInner) headerInner.style.height = '5rem';
    }
  });

  // 5. High-Performance Easing Up Numeric Stats Counter
  function initStatsCounters() {
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetVal = parseInt(el.textContent.replace(/\D/g, '')) || 0;
          const originalText = el.textContent.trim();
          const suffix = originalText.replace(/[0-9]/g, '');
          
          let startVal = 0;
          const duration = 1800; // 1.8 seconds
          const startTime = performance.now();
          
          function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
              el.textContent = targetVal + suffix;
            } else {
              const progress = elapsedTime / duration;
              const easeVal = Math.floor(startVal + (targetVal - startVal) * progress * (2 - progress));
              el.textContent = easeVal + suffix;
              requestAnimationFrame(updateCounter);
            }
          }
          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    
    counters.forEach(c => counterObserver.observe(c));
  }

  // 6. Mobile menu toggle with smooth slide
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    mobileMenu.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    mobileMenu.style.transformOrigin = 'top';
    
    if(mobileMenu.classList.contains('hidden')) {
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'scaleY(0) translateY(-20px)';
      mobileMenu.style.filter = 'blur(10px)';
    }

    menuBtn.addEventListener('click', () => {
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
          mobileMenu.style.opacity = '1';
          mobileMenu.style.transform = 'scaleY(1) translateY(0)';
          mobileMenu.style.filter = 'blur(0)';
        }, 10);
      } else {
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'scaleY(0) translateY(-20px)';
        mobileMenu.style.filter = 'blur(10px)';
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 500);
      }
    });
  }

  // 7. FAQ Accordion with smooth height transitions
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    if (btn && answer) {
      answer.style.transition = 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out, margin 0.5s ease-out, filter 0.5s ease';
      answer.style.overflow = 'hidden';
      
      if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden'); 
        answer.style.maxHeight = '0px';
        answer.style.opacity = '0';
        answer.style.marginTop = '0px';
        answer.style.filter = 'blur(5px)';
      }

      btn.addEventListener('click', () => {
        const isOpen = answer.style.maxHeight !== '0px';
        
        // Close all other answers
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if(otherAnswer && otherAnswer !== answer) {
            otherAnswer.style.maxHeight = '0px';
            otherAnswer.style.opacity = '0';
            otherAnswer.style.marginTop = '0px';
            otherAnswer.style.filter = 'blur(5px)';
            if(otherIcon) {
              otherIcon.textContent = 'add';
              otherIcon.style.transform = 'rotate(0deg)';
            }
          }
        });

        // Toggle current answer
        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 40 + 'px'; 
          answer.style.opacity = '1';
          answer.style.marginTop = '16px'; 
          answer.style.filter = 'blur(0)';
          if (icon) { 
            icon.textContent = 'expand_more'; 
            icon.style.transform = 'rotate(180deg)';
          }
        } else {
          answer.style.maxHeight = '0px';
          answer.style.opacity = '0';
          answer.style.marginTop = '0px';
          answer.style.filter = 'blur(5px)';
          if (icon) { 
            icon.textContent = 'add'; 
            icon.style.transform = 'rotate(0deg)';
          }
        }
      });
    }
  });

  // Dummy links preventative behavior
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

  // 8. Static-Directory Multi-Language Routing and Toggle Injection
  const isEnglish = window.location.pathname.toLowerCase().includes('/en/');
  const currentLang = isEnglish ? 'en' : 'ar';

  // Double-check base elements for matching localization styles
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  function handleLanguageSwitch() {
    const pathname = window.location.pathname.toLowerCase();
    const isEn = pathname.includes('/en/') || pathname.endsWith('/en');
    
    let pageName = pathname.split('/').pop();
    if (!pageName || pageName === 'en' || pageName === 'index.html' || pageName === 'index') {
      pageName = '';
    } else {
      pageName = pageName.replace('.html', '');
    }
    
    let newPath = '';
    if (isEn) {
      // English page: go up to Arabic root
      newPath = '../' + pageName;
    } else {
      // Arabic page: go down to English folder
      newPath = 'en/' + pageName;
    }
    
    // Smooth cinematic transition on swap
    document.body.style.opacity = '0';
    document.body.style.filter = 'blur(10px)';
    setTimeout(() => {
      window.location.href = newPath;
    }, 450);
  }

  function injectLanguageToggles() {
    // Desktop Nav action button row
    const headerActions = document.querySelector('header .flex.items-center.gap-6, header .flex.items-center.gap-4');
    if (headerActions) {
      if (!headerActions.querySelector('.lang-toggle-btn')) {
        const langBtn = document.createElement('button');
        langBtn.className = 'lang-toggle-btn px-4 py-2.5 rounded-lg border border-glass-border font-label-caps text-xs text-on-surface hover:text-secondary-fixed-dim hover:border-secondary-fixed-dim transition-all mr-2 ml-2';
        langBtn.textContent = currentLang === 'ar' ? 'English' : 'العربية';
        langBtn.addEventListener('click', handleLanguageSwitch);
        headerActions.insertBefore(langBtn, headerActions.firstChild);
      }
    }

    // Mobile Navigation overlay drawer
    if (mobileMenu) {
      if (!mobileMenu.querySelector('.lang-toggle-btn')) {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'lang-toggle-btn block w-full text-center px-4 py-3 rounded-lg border border-glass-border font-label-caps text-sm text-secondary-fixed-dim mt-4';
        mobileToggle.textContent = currentLang === 'ar' ? 'English' : 'العربية';
        mobileToggle.addEventListener('click', handleLanguageSwitch);
        mobileMenu.appendChild(mobileToggle);
      }
    }
  }

  // Helper to get normalized current page name without .html extension
  function getNormalizedPageName() {
    let page = window.location.pathname.split('/').pop().toLowerCase();
    if (!page || page === 'index.html' || page === 'index' || page === 'en') {
      return 'index';
    }
    return page.replace('.html', '');
  }
  const currentPage = getNormalizedPageName();

  // Set active class link highlighting on current page
  document.querySelectorAll('nav a[href]').forEach(link => {
    let href = link.getAttribute('href') || '';
    // Normalize href for comparison
    let normalizedHref = href.split('/').pop().toLowerCase().replace('.html', '');
    if (!normalizedHref || normalizedHref === 'index') {
      normalizedHref = 'index';
    }
    
    // Also handle relative roots like '.' or './' or '../'
    if (href === '.' || href === './' || href === '../') {
      normalizedHref = 'index';
    }
    
    if (normalizedHref === currentPage) {
      link.classList.add('text-secondary-fixed-dim', 'border-b-2', 'border-secondary-fixed-dim');
      link.classList.remove('text-on-surface-variant');
    }
  });

  // Contact form submission confirmation and database persistence
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const nameVal = document.getElementById('full-name')?.value || '';
      const phoneVal = document.getElementById('phone')?.value || '';
      const emailVal = document.getElementById('email')?.value || '';
      const clientTypeVal = document.getElementById('client-type')?.value || '';
      const specialtyVal = document.getElementById('specialty')?.value || '';
      
      const selectedServices = [];
      document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
        selectedServices.push(cb.value);
      });
      
      const budgetVal = document.getElementById('budget')?.value || '';
      const referrerVal = document.getElementById('referrer')?.value || '';
      const messageVal = document.getElementById('message')?.value || '';
      
      const newLead = {
        name: nameVal,
        phone: phoneVal,
        email: emailVal,
        clientType: clientTypeVal,
        specialty: specialtyVal,
        services: selectedServices,
        budget: budgetVal,
        referrer: referrerVal,
        message: messageVal
      };
      
      const leadApiPath = isEnglish ? '../api/add_lead.php' : 'api/add_lead.php';
      
      fetch(leadApiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const confirmation = document.getElementById('confirmation-state');
          if (confirmation) {
            confirmation.classList.remove('hidden');
            confirmation.style.opacity = '0';
            confirmation.style.transform = 'scale(0.95)';
            confirmation.style.filter = 'blur(10px)';
            confirmation.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
              confirmation.style.opacity = '1';
              confirmation.style.transform = 'scale(1)';
              confirmation.style.filter = 'blur(0)';
            }, 10);
          }
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert(isEnglish ? "Connection failed. Please check your network." : "فشل في الاتصال بقاعدة البيانات. الرجاء التحقق من جودة اتصالك بالإنترنت.");
      });
    });
  }

  // 9. Floating Contact Buttons (WhatsApp & Call) and services dropdown
  let floatingWidget = document.getElementById('floating-contact-widget');
  if (!floatingWidget) {
    floatingWidget = document.createElement('div');
    floatingWidget.id = 'floating-contact-widget';
    document.body.appendChild(floatingWidget);
  }

  function updateInteractiveElements(lang) {
    const msgAr = "مرحباً بكم في ديجيتال هيلث. أود الاستفسار عن خدماتكم التسويقية الطبية لعيادتنا.";
    const msgEn = "Hello, I would like to inquire about Digital Health medical marketing services for our clinic.";
    const activeMsg = lang === 'ar' ? encodeURIComponent(msgAr) : encodeURIComponent(msgEn);
    
    const widgetPosClass = lang === 'ar' ? 'right-6' : 'left-6';
    floatingWidget.className = `fixed bottom-6 ${widgetPosClass} z-[100] flex flex-col gap-4`;
    
    const tooltipDirClass = lang === 'ar' ? 'right-16' : 'left-16';
    
    floatingWidget.innerHTML = `
      <a href="tel:+9660541659332" class="w-14 h-14 rounded-full bg-surface-container-highest border border-glass-border flex items-center justify-center text-on-surface hover:text-secondary-fixed-dim hover:scale-110 transition-all shadow-lg group relative" style="box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <span class="material-symbols-outlined">call</span>
        <span class="absolute ${tooltipDirClass} bg-surface-container px-3 py-2 rounded text-xs font-label-caps opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-glass-border">${lang === 'ar' ? 'اتصل بنا' : 'Call Us'}</span>
      </a>
      <a href="https://wa.me/9660541659332?text=${activeMsg}" target="_blank" rel="noopener" class="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] group relative">
        <span class="material-symbols-outlined">chat</span>
        <span class="absolute ${tooltipDirClass} bg-surface-container px-3 py-2 rounded text-xs font-label-caps opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-glass-border text-on-surface">${lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
      </a>
    `;

    // 9b. Dynamic mega-dropdown for "Services"
    const desktopNav = document.querySelector('header nav');
    if (desktopNav) {
      const existingWrapper = desktopNav.querySelector('#nav-services-dropdown-wrapper');
      if (existingWrapper) {
        const dropdownAlignClass = lang === 'ar' ? 'left-1/2 -translate-x-1/2 text-right' : 'left-1/2 -translate-x-1/2 text-left';
        const dropdownDirAttr = lang === 'ar' ? 'rtl' : 'ltr';
        
        const dropdownMenu = existingWrapper.querySelector('.absolute');
        if (dropdownMenu) {
          dropdownMenu.className = `absolute top-[70px] ${dropdownAlignClass} w-[620px] bg-[#011230]/95 backdrop-blur-2xl border border-glass-border rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex overflow-hidden z-50`;
          dropdownMenu.setAttribute('dir', dropdownDirAttr);
        }
        
        const trigger = existingWrapper.querySelector('#nav-services-dropdown-trigger');
        if (trigger) {
          trigger.innerHTML = `${lang === 'ar' ? 'خدماتنا' : 'Services'} <span class="material-symbols-outlined text-sm transition-transform duration-300 group-hover:rotate-180">expand_more</span>`;
        }
      } else {
        const servicesLink = Array.from(desktopNav.querySelectorAll('a')).find(a => {
          const href = a.getAttribute('href') || '';
          return href === 'services.html' || href === 'services';
        });
        if (servicesLink) {
          const linkClasses = servicesLink.className;
          
          const wrapper = document.createElement('div');
          wrapper.id = 'nav-services-dropdown-wrapper';
          wrapper.className = 'relative group h-full flex items-center';
          
          const dropdownAlignClass = lang === 'ar' ? 'left-1/2 -translate-x-1/2 text-right' : 'left-1/2 -translate-x-1/2 text-left';
          const dropdownDirAttr = lang === 'ar' ? 'dir="rtl"' : 'dir="ltr"';
          
          wrapper.innerHTML = `
            <a id="nav-services-dropdown-trigger" class="${linkClasses} flex items-center gap-1 py-6 cursor-pointer" href="services" style="padding-bottom: 24px; padding-top: 24px; margin-bottom: -24px; margin-top: -24px;">
              ${lang === 'ar' ? 'خدماتنا' : 'Services'} <span class="material-symbols-outlined text-sm transition-transform duration-300 group-hover:rotate-180">expand_more</span>
            </a>
            
            <div class="absolute top-[70px] ${dropdownAlignClass} w-[620px] bg-[#011230]/95 backdrop-blur-2xl border border-glass-border rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex overflow-hidden z-50" ${dropdownDirAttr}>
              <div class="w-1/3 bg-[#192a48]/50 p-6 border-l border-glass-border flex flex-col justify-center relative overflow-hidden shrink-0">
                 <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-[#00daf3]/10 rounded-full blur-[30px]"></div>
                 <span class="material-symbols-outlined text-[#00daf3] mb-4 text-4xl relative z-10">vital_signs</span>
                 <h4 class="font-headline-lg text-on-surface mb-2 text-lg relative z-10">${lang === 'ar' ? 'نمو طبي متكامل' : 'Integrated Growth'}</h4>
                 <p class="text-xs text-on-surface-variant relative z-10">${lang === 'ar' ? 'حلول تسويقية متقدمة مصممة خصيصاً للقطاع الصحي والعيادات.' : 'Advanced marketing solutions custom-designed for the health sector.'}</p>
              </div>
              <div class="w-2/3 p-6 grid grid-cols-2 gap-x-4 gap-y-2">
                 <a href="service-identity" class="group/link flex items-center gap-3 hover:bg-[#192a48] p-3 rounded-lg transition-colors">
                   <span class="material-symbols-outlined text-[#00daf3] text-xl shrink-0">fingerprint</span>
                   <span class="font-bold text-sm text-on-surface group-hover/link:text-[#00daf3] transition-colors">${lang === 'ar' ? 'الهوية الطبية' : 'Medical Identity'}</span>
                 </a>
                 <a href="service-seo" class="group/link flex items-center gap-3 hover:bg-[#192a48] p-3 rounded-lg transition-colors">
                   <span class="material-symbols-outlined text-[#00daf3] text-xl shrink-0">search_insights</span>
                   <span class="font-bold text-sm text-on-surface group-hover/link:text-[#00daf3] transition-colors">${lang === 'ar' ? 'تحسين محركات البحث' : 'SEO Medical'}</span>
                 </a>
                 <a href="service-reputation" class="group/link flex items-center gap-3 hover:bg-[#192a48] p-3 rounded-lg transition-colors">
                   <span class="material-symbols-outlined text-[#00daf3] text-xl shrink-0">star_half</span>
                   <span class="font-bold text-sm text-on-surface group-hover/link:text-[#00daf3] transition-colors">${lang === 'ar' ? 'إدارة السيرة الطبية' : 'Reputation Defense'}</span>
                 </a>
                 <a href="service-web" class="group/link flex items-center gap-3 hover:bg-[#192a48] p-3 rounded-lg transition-colors">
                   <span class="material-symbols-outlined text-[#00daf3] text-xl shrink-0">devices</span>
                   <span class="font-bold text-sm text-on-surface group-hover/link:text-[#00daf3] transition-colors">${lang === 'ar' ? 'تصميم المواقع' : 'Web & App Design'}</span>
                 </a>
                 <a href="service-social" class="group/link flex items-center gap-3 hover:bg-[#192a48] p-3 rounded-lg transition-colors">
                   <span class="material-symbols-outlined text-[#00daf3] text-xl shrink-0">share_reviews</span>
                   <span class="font-bold text-sm text-on-surface group-hover/link:text-[#00daf3] transition-colors">${lang === 'ar' ? 'إدارة السوشيال ميديا' : 'Social Media'}</span>
                 </a>
                 <a href="service-ppc" class="group/link flex items-center gap-3 hover:bg-[#192a48] p-3 rounded-lg transition-colors">
                   <span class="material-symbols-outlined text-[#00daf3] text-xl shrink-0">ads_click</span>
                   <span class="font-bold text-sm text-on-surface group-hover/link:text-[#00daf3] transition-colors">${lang === 'ar' ? 'الإعلانات الممولة' : 'Paid Ads'}</span>
                 </a>
              </div>
            </div>
          `;
          servicesLink.parentNode.replaceChild(wrapper, servicesLink);
        }
      }
    }
  }

  // 9c. Service Pages Dynamic Hero Backgrounds
  const assetPrefix = isEnglish ? '../' : '';
  const serviceImages = {
    'service-identity': assetPrefix + 'assets/service_identity.png',
    'service-seo': assetPrefix + 'assets/service_seo.png',
    'service-reputation': assetPrefix + 'assets/service_reputation.png',
    'service-web': assetPrefix + 'assets/service_web.png',
    'service-social': assetPrefix + 'assets/service_social.png',
    'service-ppc': assetPrefix + 'assets/service_ppc.png',
  };
  
  if (serviceImages[currentPage]) {
    const heroSection = document.querySelector('main > section:first-of-type');
    if (heroSection) {
      heroSection.style.backgroundImage = `url('${serviceImages[currentPage]}')`;
      heroSection.style.backgroundSize = 'cover';
      heroSection.style.backgroundPosition = 'center';
      heroSection.classList.add('rounded-3xl', 'overflow-hidden', 'mt-8', 'mb-12', 'border', 'border-glass-border', 'shadow-2xl');
      
      if (!heroSection.querySelector('.backdrop-blur-sm')) {
        const innerHTML = heroSection.innerHTML;
        heroSection.innerHTML = `
          <div class="absolute inset-0 bg-background/85 backdrop-blur-sm z-0"></div>
          <div class="relative z-10 py-6">${innerHTML}</div>
        `;
      }
    }
  }

  // --- DYNAMIC DATABASE INTEGRATION & RENDERING ---
  let db = null;
  const storedDb = localStorage.getItem('website_db');
  if (storedDb) {
    try {
      db = JSON.parse(storedDb);
    } catch(e) {
      console.error("Failed to parse website database", e);
    }
  }

  // Live database fetch to keep website up-to-date in real-time
  const apiPath = isEnglish ? '../api/get_content.php' : 'api/get_content.php';
  fetch(apiPath)
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        db = data;
        localStorage.setItem('website_db', JSON.stringify(db));
        syncDbContent();
      }
    })
    .catch(err => console.error("Database connection offline", err));

  function fixDoubleUtf8(str) {
    if (!str || typeof str !== 'string') return str;
    // Detect classic double-encoded UTF-8 sequences (multi-byte UTF-8 bytes represented as Latin-1 characters)
    if (/[\u00C0-\u00DF][\u0080-\u00BF]/.test(str)) {
      try {
        return decodeURIComponent(escape(str));
      } catch (e) {
        return str;
      }
    }
    return str;
  }

  function getDbText(keyAr, keyEn) {
    if (!db || !db.content) return null;
    const val = currentLang === 'ar' ? (db.content[keyAr] || null) : (db.content[keyEn] || null);
    return fixDoubleUtf8(val);
  }

  function getDbRaw(key) {
    if (!db || !db.content) return null;
    const val = db.content[key] || null;
    return fixDoubleUtf8(val);
  }

  function applyDynamicStyles() {
    if (!db || !db.content) return;
    
    const primary = db.content.primary_color || '#00daf3';
    const secondary = db.content.secondary_color || '#00e3fd';
    const bg = db.content.bg_color || '#011230';
    const surface = db.content.surface_color || '#0e1f3d';
    
    const customThemeStyle = document.createElement('style');
    customThemeStyle.id = 'dynamic-theme-overrides';
    customThemeStyle.textContent = `
      :root {
        --primary-custom: ${primary};
        --secondary-custom: ${secondary};
        --bg-custom: ${bg};
        --surface-custom: ${surface};
      }
      
      /* Dynamic theme backgrounds */
      body, .bg-surface, .bg-background, .bg-surface-dim, .bg-surface-container-lowest {
        background-color: ${bg} !important;
      }
      .bg-surface-container, .bg-surface-container-low, .glass-card {
        background-color: ${surface} !important;
      }
      .bg-surface-container-high, .bg-surface-container-highest {
        background-color: ${surface} !important;
        filter: brightness(1.2);
      }
      
      /* Dynamic text and borders */
      .text-secondary-fixed-dim, .text-secondary, .text-secondary-container {
        color: ${primary} !important;
      }
      .border-secondary-fixed-dim, .border-secondary {
        border-color: ${primary} !important;
      }
      
      /* Dynamic glowing effects */
      .medical-cyan-glow:hover, .medical-cyan-glow-hover:hover {
        box-shadow: 0 0 40px ${primary}33 !important;
      }
    `;
    
    const existing = document.getElementById('dynamic-theme-overrides');
    if (existing) existing.remove();
    document.head.appendChild(customThemeStyle);
  }

  function applyDynamicFonts() {
    if (!db || !db.content) return;
    
    const fontAr = db.content.font_family_ar || 'Tajawal';
    const fontEn = db.content.font_family_en || 'Plus Jakarta Sans';
    
    const fontIds = [];
    if (fontAr) fontIds.push(fontAr.replace(/\s+/g, '+'));
    if (fontEn) fontIds.push(fontEn.replace(/\s+/g, '+'));
    
    if (fontIds.length > 0) {
      const fontHref = `https://fonts.googleapis.com/css2?family=${fontIds.map(f => f + ':wght@300;400;500;600;700;800').join('&family=')}&display=swap`;
      let fontsLink = document.getElementById('dynamic-google-fonts');
      if (!fontsLink) {
        fontsLink = document.createElement('link');
        fontsLink.id = 'dynamic-google-fonts';
        fontsLink.rel = 'stylesheet';
        document.head.appendChild(fontsLink);
      }
      fontsLink.href = fontHref;
    }
    
    const fontStyle = document.createElement('style');
    fontStyle.id = 'dynamic-font-overrides';
    fontStyle.textContent = `
      html[lang="ar"] body, html[lang="ar"] p, html[lang="ar"] span, html[lang="ar"] a, html[lang="ar"] li, html[lang="ar"] button, html[lang="ar"] input, html[lang="ar"] textarea {
        font-family: '${fontAr}', sans-serif !important;
      }
      html[lang="ar"] h1, html[lang="ar"] h2, html[lang="ar"] h3, html[lang="ar"] h4, html[lang="ar"] h5, html[lang="ar"] h6 {
        font-family: '${fontAr}', sans-serif !important;
      }
      
      html[lang="en"] body, html[lang="en"] p, html[lang="en"] span, html[lang="en"] a, html[lang="en"] li, html[lang="en"] button, html[lang="en"] input, html[lang="en"] textarea {
        font-family: '${fontEn}', sans-serif !important;
      }
      html[lang="en"] h1, html[lang="en"] h2, html[lang="en"] h3, html[lang="en"] h4, html[lang="en"] h5, html[lang="en"] h6 {
        font-family: '${fontEn}', sans-serif !important;
      }
    `;
    const existingStyle = document.getElementById('dynamic-font-overrides');
    if (existingStyle) existingStyle.remove();
    document.head.appendChild(fontStyle);
  }

  function applyDynamicSeo() {
    if (!db || !db.content) return;
    
    const title = currentLang === 'ar' ? (db.content.seo_title_ar || '') : (db.content.seo_title_en || '');
    const desc = currentLang === 'ar' ? (db.content.seo_desc_ar || '') : (db.content.seo_desc_en || '');
    const keywords = currentLang === 'ar' ? (db.content.seo_keywords_ar || '') : (db.content.seo_keywords_en || '');
    
    if (title) {
      document.title = title;
    }
    
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    if (desc) {
      descMeta.content = desc;
    }
    
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.name = 'keywords';
      document.head.appendChild(keywordsMeta);
    }
    if (keywords) {
      keywordsMeta.content = keywords;
    }
  }

  function syncDbContent() {
    if (!db) return;

    // Apply color, font, and SEO variables dynamically
    applyDynamicStyles();
    applyDynamicFonts();
    applyDynamicSeo();

    // 1. Logo text and logo image sync
    const logoText = getDbText('logo_text_ar', 'logo_text_en') || getDbText('logo_ar', 'logo_en');
    const logoImgUrl = getDbRaw('logo_image');
    
    if (logoText || logoImgUrl) {
      document.querySelectorAll('header .font-headline-lg, footer .font-headline-lg').forEach(el => {
        el.innerHTML = ''; // Reset container content safely
        
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'flex items-center gap-3 justify-start';
        
        if (logoImgUrl && logoImgUrl.trim() !== '') {
          const img = document.createElement('img');
          img.src = (isEnglish ? '../' : '') + logoImgUrl;
          img.alt = 'Digital Health Logo';
          img.className = 'h-11 md:h-12 w-auto object-contain';
          wrapperDiv.appendChild(img);
        } else {
          const icon = document.createElement('span');
          icon.className = 'material-symbols-outlined text-[#00daf3] text-3xl';
          icon.textContent = 'vital_signs';
          wrapperDiv.appendChild(icon);
        }
        
        if (logoText) {
          const titleText = document.createElement('span');
          titleText.className = 'font-bold text-xl tracking-tight text-on-surface';
          titleText.textContent = logoText;
          wrapperDiv.appendChild(titleText);
        }
        
        el.appendChild(wrapperDiv);
      });
    }

    // 2. Phone number sync
    const phoneNum = getDbRaw('contact_phone');
    if (phoneNum) {
      document.querySelectorAll('footer li span, footer a, .contact-card span, main li span, .contact-sidebar li span, p.text-secondary-fixed-dim, .font-body-md.text-secondary-fixed-dim, .dir-ltr').forEach(el => {
        if (el.textContent.includes('+966') || el.textContent.includes('966') || el.textContent.includes('054')) {
          el.textContent = phoneNum;
        }
      });
    }

    // 3. Email sync
    const emailAddr = getDbRaw('contact_email');
    if (emailAddr) {
      document.querySelectorAll('footer li span, footer p, .contact-card span, main li span, p.text-secondary-fixed-dim, .font-body-md.text-secondary-fixed-dim').forEach(el => {
        if (el.textContent.toLowerCase().includes('@digitalhealth') || el.textContent.toLowerCase().includes('.com')) {
          el.textContent = emailAddr;
        }
      });
    }

    // 4. Address sync
    const addressText = getDbRaw('contact_address');
    if (addressText) {
      document.querySelectorAll('footer p.text-on-surface-variant, .contact-sidebar p.text-on-surface-variant, footer p, main p.font-body-md').forEach(el => {
        if (el.textContent.includes('الأمير') || el.textContent.includes('Prince Abdulaziz') || el.textContent.includes('طريق الملك فهد') || el.textContent.includes('المربع')) {
          el.textContent = addressText;
        }
      });
    }

    // 4b. Map sync
    const mapUrl = getDbRaw('contact_map_iframe');
    if (mapUrl) {
      document.querySelectorAll('iframe').forEach(el => {
        if (el.src.includes('google.com/maps')) {
          el.src = mapUrl;
        }
      });
    }

    // 5. Hero title & tagline sync on index page
    if (currentPage === 'index') {
      const heroTitleText = getDbText('hero_title_ar', 'hero_title_en');
      const heroTaglineText = getDbText('hero_tagline_ar', 'hero_tagline_en');
      const heroTitle = document.querySelector('main h1');
      const heroParagraph = document.querySelector('main p');
      
      if (heroTitleText && heroTitle) heroTitle.textContent = heroTitleText;
      if (heroTaglineText && heroParagraph) heroParagraph.textContent = heroTaglineText;
    }

    // 6. Dynamic Blog Page sync
    if (currentPage === 'blog' && db.articles && db.articles.length > 0) {
      const grid = document.getElementById('blog-grid');
      if (grid) {
        grid.innerHTML = '';
        db.articles.forEach(art => {
          const articleEl = document.createElement('article');
          articleEl.className = "blog-item glass-card rounded-xl overflow-hidden medical-glow transition-all duration-300 group";
          
          const cat = fixDoubleUtf8(currentLang === 'ar' ? art.cat_ar : art.cat_en);
          const title = fixDoubleUtf8(currentLang === 'ar' ? art.title_ar : art.title_en);
          const excerpt = fixDoubleUtf8(currentLang === 'ar' ? art.excerpt_ar : art.excerpt_en);
          const label = fixDoubleUtf8(currentLang === 'ar' ? 'تصفح المسودة الكاملة' : 'Read Full Draft');
          
          let mediaHtml = '';
          if (art.image && art.image.includes('assets/')) {
            mediaHtml = `<div class="h-56 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style="background-image: url('${isEnglish ? '../' : ''}${art.image}')"></div>`;
          } else if (art.image && art.image.startsWith('data:image')) {
            mediaHtml = `<div class="h-56 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style="background-image: url('${art.image}')"></div>`;
          } else {
            const iconName = art.cat_en === 'branding' ? 'fingerprint' : (art.cat_en === 'seo' ? 'search_insights' : (art.cat_en === 'social' ? 'share_reviews' : 'gavel'));
            mediaHtml = `
              <div class="h-56 bg-gradient-to-br from-surface-container-high to-surface-variant flex items-center justify-center overflow-hidden">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-[60px] group-hover:scale-110 transition-transform duration-500">${iconName}</span>
              </div>
            `;
          }
          
          articleEl.innerHTML = `
            ${mediaHtml}
            <div class="p-8 ${currentLang === 'ar' ? 'text-right' : 'text-left'}">
              <div class="flex justify-between items-center mb-4">
                <span class="font-label-caps text-label-caps text-secondary font-bold">${cat}</span>
                <span class="text-[12px] text-outline">${art.date}</span>
              </div>
              <h3 class="font-headline-lg text-headline-lg mb-4 text-xl group-hover:text-secondary transition-colors">${title}</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">${excerpt}</p>
              <a href="${isEnglish ? '../' : ''}contact" class="font-label-caps text-label-caps text-on-surface hover:text-secondary transition-colors">${label}</a>
            </div>
          `;
          grid.appendChild(articleEl);
        });
      }

      // Sync featured post
      const featuredArt = db.articles[0];
      const featuredSection = document.querySelector('main > section:nth-of-type(2)');
      if (featuredArt && featuredSection) {
        const title = fixDoubleUtf8(currentLang === 'ar' ? featuredArt.title_ar : featuredArt.title_en);
        const excerpt = fixDoubleUtf8(currentLang === 'ar' ? featuredArt.excerpt_ar : featuredArt.excerpt_en);
        const cat = fixDoubleUtf8(currentLang === 'ar' ? featuredArt.cat_ar : featuredArt.cat_en);
        const label = fixDoubleUtf8(currentLang === 'ar' ? 'اقرأ المزيد' : 'Read More');
        const teamName = fixDoubleUtf8(currentLang === 'ar' ? 'فريق خبراء ديجيتال هيلث' : 'Digital Health Experts');
        const teamDesc = fixDoubleUtf8(currentLang === 'ar' ? 'مستشارو النمو الرقمي' : 'Digital Growth Advisors');
        const sectionHeader = fixDoubleUtf8(currentLang === 'ar' ? 'مقال مميز' : 'Featured Post');
        
        let mediaHtml = '';
        if (featuredArt.image && featuredArt.image.includes('assets/')) {
          mediaHtml = `<div class="lg:w-3/5 bg-cover bg-center min-h-[300px]" style="background-image: url('${isEnglish ? '../' : ''}${featuredArt.image}')"></div>`;
        } else if (featuredArt.image && featuredArt.image.startsWith('data:image')) {
          mediaHtml = `<div class="lg:w-3/5 bg-cover bg-center min-h-[300px]" style="background-image: url('${featuredArt.image}')"></div>`;
        } else {
          mediaHtml = `
            <div class="lg:w-3/5 bg-gradient-to-br from-surface-container to-surface-variant min-h-[300px] flex items-center justify-center overflow-hidden relative">
              <span class="material-symbols-outlined text-secondary-fixed-dim text-[120px] group-hover:scale-110 transition-transform duration-700">biotech</span>
            </div>
          `;
        }
        
        const cardContainer = featuredSection.querySelector('.glass-card');
        if (cardContainer) {
          cardContainer.innerHTML = `
            ${mediaHtml}
            <div class="lg:w-2/5 p-10 flex flex-col justify-center ${currentLang === 'ar' ? 'text-right' : 'text-left'}">
              <span class="font-label-caps text-label-caps text-secondary mb-4">${sectionHeader} - ${cat}</span>
              <h2 class="font-headline-xl text-headline-xl mb-6 text-2xl md:text-3xl">${title}</h2>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8">${excerpt}</p>
              <div class="flex items-center gap-4 mb-8 justify-start">
                <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center"><span class="material-symbols-outlined text-on-secondary">person</span></div>
                <div>
                  <p class="font-label-caps text-label-caps text-on-surface">${teamName}</p>
                  <p class="text-[10px] uppercase tracking-widest text-outline">${teamDesc}</p>
                </div>
              </div>
              <a href="${isEnglish ? '../' : ''}contact" class="flex items-center gap-2 text-secondary font-label-caps text-label-caps hover:gap-4 transition-all justify-start">
                ${label} <span class="material-symbols-outlined ${currentLang === 'ar' ? 'rotate-180' : ''}">arrow_forward</span>
              </a>
            </div>
          `;
        }
      }
    }

    // 7. Dynamic Portfolio Page sync
    if (currentPage === 'portfolio' && db.portfolio && db.portfolio.length > 0) {
      const grid = document.getElementById('portfolio-grid');
      if (grid) {
        grid.innerHTML = '';
        db.portfolio.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = "portfolio-item glass-card rounded-xl overflow-hidden group medical-cyan-glow-hover transition-all duration-300";
          itemEl.setAttribute('data-category', item.cat_en);
          
          const cat = fixDoubleUtf8(currentLang === 'ar' ? item.cat_ar : item.cat_en);
          const title = fixDoubleUtf8(currentLang === 'ar' ? item.title_ar : item.title_en);
          const metric = fixDoubleUtf8(currentLang === 'ar' ? item.metric_ar : item.metric_en);
          
          let mediaHtml = '';
          if (item.image && item.image.includes('assets/')) {
            mediaHtml = `<div class="aspect-video w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style="background-image: url('${isEnglish ? '../' : ''}${item.image}')"></div>`;
          } else if (item.image && item.image.startsWith('data:image')) {
            mediaHtml = `<div class="aspect-video w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style="background-image: url('${item.image}')"></div>`;
          } else {
            const iconName = item.cat_en === 'branding' ? 'fingerprint' : (item.cat_en === 'seo' ? 'search_insights' : (item.cat_en === 'social' ? 'share_reviews' : (item.cat_en === 'web' ? 'devices' : 'ads_click')));
            mediaHtml = `
              <div class="aspect-video w-full bg-gradient-to-br from-surface-container-high to-surface-dim flex items-center justify-center relative">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-[80px] group-hover:scale-110 transition-transform duration-500">${iconName}</span>
              </div>
            `;
          }
          
          const resultLabel = currentLang === 'ar' ? 'النتيجة:' : 'Result:';
          const serviceLabel = currentLang === 'ar' ? 'الخدمة:' : 'Service:';
          const requestConsultation = currentLang === 'ar' ? 'طلب استشارة مماثلة' : 'Request Consultation';
          
          itemEl.innerHTML = `
            ${mediaHtml}
            <div class="p-6 ${currentLang === 'ar' ? 'text-right' : 'text-left'}">
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold text-secondary-fixed-dim">${cat}</span>
                <span class="text-xs text-on-surface-variant">${resultLabel} ${metric}</span>
              </div>
              <h4 class="font-bold text-lg text-on-surface mb-2 group-hover:text-secondary transition-colors">${title}</h4>
              <p class="text-sm text-on-surface-variant mb-4">${currentLang === 'ar' ? 'نهج تسويقي وتقني متكامل ومثالي لرفع كفاءة العيادة والحضور الرقمي المستدام.' : 'An integrated medical growth marketing approach optimized for clinical efficiency.'}</p>
              <div class="pt-4 border-t border-glass-border flex justify-between items-center text-xs text-on-surface-variant">
                <span>${serviceLabel} ${cat}</span>
                <a href="${isEnglish ? '../' : ''}contact" class="text-secondary hover:underline">${requestConsultation}</a>
              </div>
            </div>
          `;
          grid.appendChild(itemEl);
        });
      }
    }

    // 8. Testimonials sync on index page
    if (currentPage === 'index' && db.testimonials && db.testimonials.length > 0) {
      const testimonialsContainer = document.querySelector('main section .grid.overflow-x-auto');
      if (testimonialsContainer) {
        testimonialsContainer.innerHTML = '';
        db.testimonials.forEach(test => {
          const testEl = document.createElement('div');
          testEl.className = "glass-card p-10 rounded-2xl min-w-[320px]";
          
          const name = fixDoubleUtf8(currentLang === 'ar' ? test.name_ar : test.name_en);
          const title = fixDoubleUtf8(currentLang === 'ar' ? test.title_ar : test.title_en);
          const quote = fixDoubleUtf8(currentLang === 'ar' ? test.quote_ar : test.quote_en);
          
          let avatarHtml = '';
          if (test.image && test.image.startsWith('data:image')) {
            avatarHtml = `<img class="w-14 h-14 rounded-full object-cover" data-alt="${name}" src="${test.image}"/>`;
          } else {
            avatarHtml = `
              <div class="w-14 h-14 rounded-full bg-secondary-fixed-dim/20 flex items-center justify-center shrink-0 border border-secondary-fixed-dim/30">
                <span class="material-symbols-outlined text-secondary-fixed-dim text-2xl">person</span>
              </div>
            `;
          }
          
          testEl.innerHTML = `
            <div class="flex text-secondary-fixed-dim mb-6 justify-start">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
            </div>
            <p class="font-body-lg text-on-surface italic mb-10">"${quote}"</p>
            <div class="flex items-center gap-4 justify-start">
              ${avatarHtml}
              <div class="${currentLang === 'ar' ? 'text-right' : 'text-left'}">
                <h5 class="text-on-surface font-bold">${name}</h5>
                <p class="text-on-surface-variant text-xs">${title}</p>
              </div>
            </div>
          `;
          testimonialsContainer.appendChild(testEl);
        });
      }
    }

    // Call global DOM text refiner for lazy images and vocabulary cleanups
    refineDOMContent();
  }

  // Global DOM Walker for vocabulary standardization & lazy loading optimization
  function refineDOMContent() {
    // 1. Force loading="lazy" on all site images (static & dynamic) to optimize speed
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // 2. Global text node translations & DHA dictionary enforcement
    const walkTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        
        // Dynamic replacement: swap "DHA" with "Digital Health" or Arabic translation
        text = text.replace(/\bDHA\b/gi, currentLang === 'ar' ? 'ديجيتال هيلث' : 'Digital Health');
        
        // In Arabic mode, clean remaining technical English phrases to achieve 100% pure Arabic
        if (currentLang === 'ar') {
          text = text.replace(/\bSEO\b/gi, 'تحسين محركات البحث (سيو)');
          text = text.replace(/\bSocial Media\b/gi, 'وسائل التواصل الاجتماعي');
          text = text.replace(/\bPPC\b/gi, 'الإعلانات الطبية الممولة');
          text = text.replace(/\bBranding\b/gi, 'الهوية الطبية الفاخرة');
          text = text.replace(/\bReputation\b/gi, 'إدارة السمعة المهنية');
          text = text.replace(/\bWeb & App Design\b/gi, 'تصميم المواقع الطبية');
        }
        
        if (node.nodeValue !== text) {
          node.nodeValue = text;
        }
      } else {
        // Skip code blocks, dynamic scripts, styling tags and interactive controls
        if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'INPUT' && node.nodeName !== 'TEXTAREA') {
          node.childNodes.forEach(walkTextNodes);
        }
      }
    };
    
    walkTextNodes(document.body);
  }

  // 10. Initial startup sequence
  injectLanguageToggles();
  updateInteractiveElements(currentLang);
  syncDbContent();
  initStatsCounters();

})();
