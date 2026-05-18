import bcrypt from 'bcryptjs';
import User from '../models/User';
import Content from '../models/Content';
import Article from '../models/Article';
import Testimonial from '../models/Testimonial';
import Portfolio from '../models/Portfolio';
import dbConnect from './mongodb';

export async function seedDatabase() {
  await dbConnect();

  // 1. Seed default User if empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('dejatal121@#', salt);
    await User.create({
      username: 'admin',
      password: passwordHash,
    });
    console.log('Seeded default admin credentials.');
  }

  // 2. Seed default Page Content configs using Upsert to avoid wiping existing edits
  const defaultContent = [
    // General Settings
    { key: 'contact_phone', value: '+9660541659332' },
    { key: 'contact_whatsapp', value: '+9660541659332' },
    { key: 'contact_email', value: 'info@digitalhealth.agency' },
    { key: 'contact_address', value: 'الرياض، المملكة العربية السعودية' },
    { key: 'contact_map_iframe', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9782522502677!2d46.708890784999994!3d24.6589332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03f7e5d8f63b%3A0xe5a3c08cd4ad4e2c!2sPrince%20Abdulaziz%20Bin%20Musaid%20Bin%20Jalawi%20St%2C%20Al%20Murabba%2C%20Riyadh%2012628!5e0!3m2!1sen!2ssa!4v1700000000000' },
    { key: 'logo_text_ar', value: 'ديجيتال هيلث' },
    { key: 'logo_text_en', value: 'Digital Health' },
    { key: 'font_family_ar', value: 'Tajawal' },
    { key: 'font_family_en', value: 'Plus Jakarta Sans' },
    { key: 'primary_color', value: '#00daf3' },
    { key: 'secondary_color', value: '#00e3fd' },
    { key: 'bg_color', value: '#011230' },
    { key: 'surface_color', value: '#0e1f3d' },
    
    // SEO Suite
    { key: 'seo_title_ar', value: 'ديجيتال هيلث | وكالة تسويق رقمي طبي في الرياض' },
    { key: 'seo_title_en', value: 'Digital Health | Medical Digital Marketing Agency in Riyadh' },
    { key: 'seo_desc_ar', value: 'وكالة تسويق رقمي طبي متخصصة في الرياض. نساعد الأطباء، العيادات، والمستشفيات على جذب المرضى وزيادة الحجوزات من خلال استراتيجيات تسويق طبية.' },
    { key: 'seo_desc_en', value: 'Specialized medical digital marketing agency in Riyadh. We help doctors, clinics, and hospitals attract patients and increase bookings through medical marketing strategies.' },
    { key: 'seo_keywords_ar', value: 'تسويق طبي, تسويق عيادات, سيو طبي, الهوية الطبية, جذب المرضى, الرياض' },
    { key: 'seo_keywords_en', value: 'medical marketing, clinic marketing, medical seo, medical identity, patient attraction, Riyadh' },

    // HOME PAGE Layout & Copy
    { key: 'home_badge_ar', value: 'الوكالة الأولى للتسويق الطبي في الرياض' },
    { key: 'home_badge_en', value: "Riyadh's Premier Medical Marketing Agency" },
    { key: 'hero_title_ar', value: 'شريك النمو الطبي الاستراتيجي' },
    { key: 'hero_title_en', value: 'Integrated Medical Growth for Your Clinic' },
    { key: 'hero_tagline_ar', value: 'نهتم بالهوية الرقمية للعيادات الطبية المتخصصة، تحسين محركات البحث، وجذب المرضى بأعلى معايير المصداقية المهنية.' },
    { key: 'hero_tagline_en', value: 'Empowering healthcare providers and doctors in the Kingdom with digital leadership and patient attraction under the highest clinical authority standards.' },
    { key: 'home_cta_primary_ar', value: 'ابدأ في النمو الآن' },
    { key: 'home_cta_primary_en', value: 'Start Growing Now' },
    { key: 'home_cta_secondary_ar', value: 'عرض دراسات الحالة' },
    { key: 'home_cta_secondary_en', value: 'View Case Studies' },
    { key: 'home_stats_roi_title_ar', value: 'الوقت الفعلي' },
    { key: 'home_stats_roi_title_en', value: 'Realtime Analytics' },
    { key: 'home_stats_roi_value_ar', value: '+142% عائد الاستثمار' },
    { key: 'home_stats_roi_value_en', value: '+142% Patient Retention Return' },
    { key: 'home_stats_seo_title_ar', value: 'ظهور محركات البحث' },
    { key: 'home_stats_seo_title_en', value: 'SEO Ranking Authority' },
    { key: 'home_stats_seo_value_ar', value: 'أول 3 نتائج في الرياض' },
    { key: 'home_stats_seo_value_en', value: 'Top 3 positions Riyadh' },
    { key: 'home_stats_seo_sub_ar', value: '+280% organic leads' },
    { key: 'home_stats_seo_sub_en', value: '+280% organic leads' },
    { key: 'home_stats_bookings_title_ar', value: 'حجوزات المرضى' },
    { key: 'home_stats_bookings_title_en', value: 'Active Consult bookings' },
    { key: 'home_partners_title_ar', value: 'قنوات وشراكات التسويق المعتمدة للعيادات' },
    { key: 'home_partners_title_en', value: 'OFFICIALLY APPROVED MARKETING CHANNELS' },
    { key: 'home_section_services_title_ar', value: 'التسويق الطبي الدقيق' },
    { key: 'home_section_services_title_en', value: 'Precision Clinical Marketing' },
    { key: 'home_section_services_desc_ar', value: 'حلول نمو ذكية متكاملة مصممة خصيصاً لتخصص عيادتك الطبية في الرياض.' },
    { key: 'home_section_services_desc_en', value: 'Modular strategic growth solutions engineered specifically for healthcare institutions.' },
    { key: 'home_section_why_badge_ar', value: 'ما يميز عيادتنا' },
    { key: 'home_section_why_badge_en', value: 'Clinical Advantage' },
    { key: 'home_section_why_title_ar', value: 'نتحدث لغة الطب، وننفذ أسرع استراتيجيات النمو.' },
    { key: 'home_section_why_title_en', value: 'We speak clinical science, and deliver organic growth.' },
    { key: 'home_why_years_val', value: '12+' },
    { key: 'home_why_years_title_ar', value: 'سنة من التخصص الطبي' },
    { key: 'home_why_years_title_en', value: 'Years of Healthcare Focus' },
    { key: 'home_why_feat1_title_ar', value: 'التوجيه العلمي القائم على التحليلات' },
    { key: 'home_why_feat1_title_en', value: 'Data & Scientific Analytics Direction' },
    { key: 'home_why_feat1_desc_ar', value: 'نحن لا نخمن عشوائياً. نستخدم تحليلات دقيقة لتحديد المرضى ذوي الرغبة الحقيقية في العلاج بمركزك.' },
    { key: 'home_why_feat1_desc_en', value: 'We bypass guesses. We employ prescriptive patient modeling to target the right specialties.' },
    { key: 'home_why_feat2_title_ar', value: 'الامتثال القانوني الصحي التام' },
    { key: 'home_why_feat2_title_en', value: 'Full Healthcare Compliance Assurance' },
    { key: 'home_why_feat2_desc_ar', value: 'كل حملة نطلقها متوافقة 100% مع أنظمة وزارة الصحة السعودية ولوائح خصوصية البيانات الطبية للمريض.' },
    { key: 'home_why_feat2_desc_en', value: 'Every creative element aligns perfectly with the Saudi MOH regulations and international healthcare privacy.' },
    { key: 'home_why_feat3_title_ar', value: 'خبرة عيادية سريرية حصرية' },
    { key: 'home_why_feat3_title_en', value: 'Exclusive Clinical Specialization' },
    { key: 'home_why_feat3_desc_ar', value: 'نحن لا نعمل في مجالات المطاعم أو البيع بالتجزئة. تركيزنا حصري 100% على الأطباء والعيادات فقط.' },
    { key: 'home_why_feat3_desc_en', value: 'Unlike generic creative agencies, we work 100% on medical, knowing the exact patient journey.' },
    { key: 'home_stat1_val', value: '250%' },
    { key: 'home_stat1_desc_ar', value: 'متوسط زيادة عائد الاستثمار' },
    { key: 'home_stat1_desc_en', value: 'Average ROI Increase' },
    { key: 'home_stat2_val', value: '15K+' },
    { key: 'home_stat2_desc_ar', value: 'مريض جديد محتمل شهرياً' },
    { key: 'home_stat2_desc_en', value: 'Monthly Patient Leads' },
    { key: 'home_stat3_val', value: '85+' },
    { key: 'home_stat3_desc_ar', value: 'عيادة ومركز نثق به بالرياض' },
    { key: 'home_stat3_desc_en', value: 'Trusted Elite Clinics' },
    { key: 'home_stat4_val', value: '12+' },
    { key: 'home_stat4_desc_ar', value: 'سنة خبرة متخصصة' },
    { key: 'home_stat4_desc_en', value: 'Years Clinical Experience' },
    { key: 'home_testimonials_badge_ar', value: 'تقييمات الأطباء' },
    { key: 'home_testimonials_badge_en', value: 'Trusted by Elite Doctors' },
    { key: 'home_testimonials_title_ar', value: 'ماذا يقول شركاؤنا من الأطباء والعيادات' },
    { key: 'home_testimonials_title_en', value: 'Clinic Success Stories & Patient Conversions' },
    { key: 'home_cta_title_ar', value: 'هل أنت مستعد لمضاعفة نمو عيادتك؟' },
    { key: 'home_cta_title_en', value: 'Ready to Double Your Patient Flow?' },
    { key: 'home_cta_desc_ar', value: 'احجز جلستك الاستشارية الطبية المجانية الآن، وسيقوم فريقنا بتدقيق ظهورك وتحديد قنوات نموك.' },
    { key: 'home_cta_desc_en', value: 'Book a 30-minute free diagnostic audit. We will analyze your search presence and deliver a clear patient attraction plan.' },
    { key: 'home_cta_btn_ar', value: 'احصل على تدقيق مجاني الآن' },
    { key: 'home_cta_btn_en', value: 'Claim Your Free Audit Now' },
    { key: 'home_hero_image', value: '' },

    // ABOUT PAGE Layout & Copy
    { key: 'about_badge_ar', value: 'تأسست في الرياض' },
    { key: 'about_badge_en', value: 'Established in Riyadh' },
    { key: 'about_title_ar', value: 'من نحن؟' },
    { key: 'about_title_en', value: 'Who We Are' },
    { key: 'about_description_ar', value: 'وكالة تسويق رقمي متخصصة في القطاع الطبي مقرها الرياض، تم تأسيسها لتكون شريك النمو الأول للأطباء والمراكز الطبية والمستشفيات.' },
    { key: 'about_description_en', value: 'A specialized medical digital marketing agency based in Riyadh, established to be the primary growth partner for doctors, clinics, and hospitals.' },
    { key: 'about_sub_description_ar', value: 'نحن شركة ناشئة بفكر متطور، نركز على تحويل الخدمات الطبية إلى علامات رقمية قوية قادرة على جذب المرضى وبناء الثقة.' },
    { key: 'about_sub_description_en', value: 'We are a progressive team focusing on transforming clinical services into robust digital brands that attract patients and inspire absolute trust.' },
    { key: 'about_vision_title_ar', value: 'رؤيتنا' },
    { key: 'about_vision_title_en', value: 'Our Vision' },
    { key: 'about_vision_desc_ar', value: 'أن نكون الشريك الرقمي الأول لنمو القطاع الصحي في المملكة العربية السعودية عبر استراتيجيات تسويق طبي مبنية على الثقة وبناء المصداقية وتحقيق نتائج قابلة للقياس تدعم نمو المنشآت الطبية وتزيد وصولها للمرضى.' },
    { key: 'about_vision_desc_en', value: 'To become the premier healthcare growth partner in Saudi Arabia, building long-term digital credibility and generating high-impact patient flow for clinics and hospitals.' },
    { key: 'about_mission_title_ar', value: 'رسالتنا' },
    { key: 'about_mission_title_en', value: 'Our Mission' },
    { key: 'about_mission_desc_ar', value: 'نساعد مقدمي الرعاية الصحية على جذب المرضى المناسبين، بناء سيرة مهنية قوية، وتحقيق نمو مستدام باستخدام التسويق الرقمي، مع الالتزام الكامل بأخلاقيات المجال الطبي والمعايير المهنية.' },
    { key: 'about_mission_desc_en', value: 'Empowering doctors and elite practitioners to connect with patients authentically and sustainably using modern ethical medical marketing and digital patient pathways.' },
    { key: 'about_why_title_ar', value: 'لماذا نختلف؟' },
    { key: 'about_why_title_en', value: 'Why Choose Us?' },
    { key: 'about_why_desc_ar', value: 'على عكس الوكالات التسويقية العامة، نحن متخصصون في التسويق الطبي فقط ونفهم الفروق الدقيقة لمسار الرعاية الطبية.' },
    { key: 'about_why_desc_en', value: 'Unlike generic creative agencies, we specialize strictly in clinical medical growth, understanding the delicate journey of patients.' },
    { key: 'about_why_feat1_title_ar', value: 'سيكولوجية المريض' },
    { key: 'about_why_feat1_title_en', value: 'Patient Psychology' },
    { key: 'about_why_feat1_desc_ar', value: 'فهم عميق لطريقة تفكير المرضى وعقليتهم وما الذي يدفعهم للاختيار والحجز وثقة الممارس.' },
    { key: 'about_why_feat1_desc_en', value: 'Knowing exactly how patients research clinical services and what instills real conversion confidence.' },
    { key: 'about_why_feat2_title_ar', value: 'خبرة بالسوق السعودي' },
    { key: 'about_why_feat2_title_en', value: 'Saudi MOH Experts' },
    { key: 'about_why_feat2_desc_ar', value: 'معرفة تامة بسلوكيات المرضى والمنافسة ومؤسسات الرعاية الصحية بالرياض.' },
    { key: 'about_why_feat2_desc_en', value: 'We navigate target audience segments, regional clinic metrics, and Riyadh medical space.' },
    { key: 'about_why_feat3_title_ar', value: 'قرارات مبنية على البيانات' },
    { key: 'about_why_feat3_title_en', value: 'Precision Analytics' },
    { key: 'about_why_feat3_desc_ar', value: 'تحليل دقيق ومستمر لكل خطوة تسويقية لضمان أعلى عائد استثماري للعيادة والمركز.' },
    { key: 'about_why_feat3_desc_en', value: 'Tracking direct cost-per-patient-acquisition values to scale profitable clinic channels.' },
    { key: 'about_why_feat4_title_ar', value: 'الالتزام بأخلاقيات المهنة' },
    { key: 'about_why_feat4_title_en', value: 'Strict Professional Ethics' },
    { key: 'about_why_feat4_desc_ar', value: 'المحافظة المطلقة على سرية ومعايير وأخلاقيات التسويق الطبي المعتمدة بالمملكة.' },
    { key: 'about_why_feat4_desc_en', value: 'Every digital campaign matches the strict regulations of Saudi MOH guidelines.' },
    { key: 'about_why_feat5_title_ar', value: 'استراتيجيات مخصصة' },
    { key: 'about_why_feat5_title_en', value: 'Tailored Clinic Roadmap' },
    { key: 'about_why_feat5_desc_ar', value: 'خطط نمو وتواصل فريدة مصممة خصيصاً لكل تخصص طبي بمفرده.' },
    { key: 'about_why_feat5_desc_en', value: 'Whether cosmetic surgery, dental, pediatric, or dermatology, we draft unique plans.' },
    { key: 'about_why_feat6_title_ar', value: 'تخصص طبي حصري' },
    { key: 'about_why_feat6_title_en', value: 'Exclusive Healthcare Niche' },
    { key: 'about_why_feat6_desc_ar', value: 'التركيز التام 100% على الرعاية الصحية والطبية دون تشتت في قطاعات تجارية أخرى.' },
    { key: 'about_why_feat6_desc_en', value: 'We do not build fast-food or retail brands; we only build elite medical leaders.' },
    { key: 'about_audience_title_ar', value: 'عملاؤنا المستهدفون' },
    { key: 'about_audience_title_en', value: 'Who We Support' },
    { key: 'about_audience_desc_ar', value: 'نصمم خدماتنا لتناسب مختلف فئات مقدمي الرعاية الصحية:' },
    { key: 'about_audience_desc_en', value: 'We serve all segments of healthcare delivery, optimizing channels for specific scale goals:' },
    { key: 'about_audience_item1_title_ar', value: 'الأطباء والاستشاريين' },
    { key: 'about_audience_item1_title_en', value: 'Physicians & Consultants' },
    { key: 'about_audience_item1_desc_ar', value: 'بناء العلامة الشخصية والسمعة الطبية.' },
    { key: 'about_audience_item1_desc_en', value: 'Establishing digital thought leadership.' },
    { key: 'about_audience_item2_title_ar', value: 'المراكز الطبية' },
    { key: 'about_audience_item2_title_en', value: 'Medical Clinics & Centers' },
    { key: 'about_audience_item2_desc_ar', value: 'تسويق متكامل وشامل لجميع التخصصات.' },
    { key: 'about_audience_item2_desc_en', value: 'Unified strategic marketing for multi-specialty.' },
    { key: 'about_audience_item3_title_ar', value: 'المستشفيات الخاصة' },
    { key: 'about_audience_item3_title_en', value: 'Private Hospitals' },
    { key: 'about_audience_item3_desc_ar', value: 'إدارة الحضور الرقمي وقنوات المرضى.' },
    { key: 'about_audience_item3_desc_en', value: 'Optimizing corporate healthcare paths.' },
    { key: 'about_audience_item4_title_ar', value: 'العيادات التخصصية' },
    { key: 'about_audience_item4_title_en', value: 'Specialized Clinics' },
    { key: 'about_audience_item4_desc_ar', value: 'عيادات التجميل، الأسنان، الجلدية، والقلب.' },
    { key: 'about_audience_item4_desc_en', value: 'Cosmetic surgery, aesthetics, and dentistry.' },
    { key: 'about_team_title_ar', value: 'فريق العمل' },
    { key: 'about_team_title_en', value: 'Our Team Experts' },
    { key: 'about_team_desc_ar', value: 'مبدعون ومختصون طبيون يجمعهم هدف واحد: نمو علامتكم الصحية وتفوقها.' },
    { key: 'about_team_desc_en', value: 'Creative and digital masterminds joined by a singular vision: patient acquisition and stellar branding.' },
    { key: 'about_cta_title_ar', value: 'انضم إلى قائمة شركاء النجاح بالقطاع الصحي' },
    { key: 'about_cta_title_en', value: 'Join Elite Healthcare Providers In Riyadh' },
    { key: 'about_cta_desc_ar', value: 'اتخذ الخطوة الأولى نحو حضور رقمي طبي قوي وجاذب لعيادتك اليوم.' },
    { key: 'about_cta_desc_en', value: 'Elevate your online authority, multiply bookings, and govern patient loyalty with us.' },

    // SERVICES PAGE Layout & Copy
    { key: 'services_title_ar', value: 'هندسة الحلول وبناء' },
    { key: 'services_title_en', value: 'Engineering Growth &' },
    { key: 'services_title_span_ar', value: 'الريادة الطبية الرقمية بالرياض' },
    { key: 'services_title_span_en', value: 'Digital Clinical Leadership' },
    { key: 'services_description_ar', value: 'باقات متكاملة ومصممة خصيصاً للعيادات والمراكز والمستشفيات التخصصية الطموحة لضمان نمو تدفق المرضى بأعلى معايير الالتزام الطبي والمهني.' },
    { key: 'services_description_en', value: 'Modular strategic growth solutions engineered specifically for healthcare institutions.' },
    { key: 'services_badge_moh_ar', value: 'متوافق مع أنظمة وزارة الصحة' },
    { key: 'services_badge_moh_en', value: '100% MOH Regulation Compliant' },
    { key: 'services_badge_clinical_ar', value: 'استراتيجيات نمو طبي تخصصي' },
    { key: 'services_badge_clinical_en', value: 'Specialized Clinical Frameworks' },
    { key: 'services_cta_title_ar', value: 'مستعد لتمكين وترسيخ ريادتك' },
    { key: 'services_cta_title_en', value: 'Ready to Establish Elite' },
    { key: 'services_cta_span_ar', value: 'الطبية الرقمية بالرياض؟' },
    { key: 'services_cta_span_en', value: 'Healthcare Authority In Riyadh?' },
    { key: 'services_cta_btn_primary_ar', value: 'احجز جلسة استشارة مجانية' },
    { key: 'services_cta_btn_primary_en', value: 'Book Free Diagnostic Consultation' },
    { key: 'services_cta_btn_secondary_ar', value: 'تصفح أعمالنا ونجاحاتنا' },
    { key: 'services_cta_btn_secondary_en', value: 'Browse Clinic Case Studies' },

    // PORTFOLIO PAGE Layout & Copy
    { key: 'portfolio_title_ar', value: 'رواد التحول الرقمي الطبي في الرياض' },
    { key: 'portfolio_title_en', value: 'Riyadh Medical Digital Transformation Leaders' },
    { key: 'portfolio_description_ar', value: 'شاهد كيف ساعدنا كبرى العيادات والمراكز التخصصية بالرياض على زيادة تدفق المرضى وتصدر نتائج جوجل.' },
    { key: 'portfolio_description_en', value: 'Explore how we assisted major specialized clinics and healthcare centers in Riyadh to scale patient bookings and rank first on Google.' },

    // BLOG PAGE Layout & Copy
    { key: 'blog_title_ar', value: 'المدونة الطبية الرقمية' },
    { key: 'blog_title_en', value: 'Clinical Digital Marketing Blog' },
    { key: 'blog_description_ar', value: 'مقالات ونقاشات متخصصة حول أساليب التسويق الطبي وجذب المرضى وقوانين وزارة الصحة بالرياض.' },
    { key: 'blog_description_en', value: 'Specialized essays and growth resources concerning healthcare marketing, patient retention, and Riyadh compliance guidelines.' },

    // FAQ PAGE Layout & Copy
    { key: 'faq_title_ar', value: 'الأسئلة الشائعة والاستفسارات' },
    { key: 'faq_title_en', value: 'Frequently Answered Questions' },
    { key: 'faq_description_ar', value: 'إجابات واضحة ودقيقة للأسئلة المكررة لدى الأطباء والمراكز الطبية حول قنوات ونسب النمو وتكاليف التسويق بالرياض.' },
    { key: 'faq_description_en', value: 'Precise clinical-authority insights answering clinics and doctors questions about campaigns ROI, costs, and timeline.' },

    // CONTACT PAGE Layout & Copy
    { key: 'contact_title_ar', value: 'ابدأ رحلة النمو الطبي لعيادتك اليوم' },
    { key: 'contact_title_en', value: 'Elevate Your Healthcare Growth Pathway' },
    { key: 'contact_description_ar', value: 'دعنا نساعدك في تصميم قناة جذب مرضى مخصصة وفعالة ومتوافقة تماماً مع معايير وزارة الصحة السعودية.' },
    { key: 'contact_description_en', value: 'Let us engineer high-conversion custom patients flow pipeline fully matching Saudi MOH policies and medical ethics.' },
    { key: 'contact_badge_moh_ar', value: 'معايير تسويقية آمنة وقانونية' },
    { key: 'contact_badge_moh_en', value: '100% Ethical & Legal Clinical Ads' },
    { key: 'contact_badge_clinical_ar', value: 'تأثير رقمي حقيقي ومستدام' },
    { key: 'contact_badge_clinical_en', value: 'Sustainable Clinical Organic Growth' },
    { key: 'contact_form_heading_ar', value: 'طلب جلسة تشخيصية ونمو مجانية' },
    { key: 'contact_form_heading_en', value: 'Request a Free Strategy Consultation' },
    { key: 'contact_form_btn_ar', value: 'إرسال طلب الاستشارة الطبية' },
    { key: 'contact_form_btn_en', value: 'Submit Consultation Request' },

    // THANK YOU PAGE Layout & Copy
    { key: 'thankyou_title_ar', value: 'شكراً لك!' },
    { key: 'thankyou_title_en', value: 'Thank You!' },
    { key: 'thankyou_description_ar', value: 'لقد تم استلام تفاصيل طلبك بنجاح. سيقوم أحد مستشاري النمو الطبي لدينا بالتواصل معك خلال 24 ساعة لترتيب الجلسة التشخيصية.' },
    { key: 'thankyou_description_en', value: 'Your clinical growth audit request has been successfully registered. One of our digital specialists will contact you within 24 hours to coordinate your calendar.' },
    { key: 'thankyou_btn_ar', value: 'العودة للصفحة الرئيسية' },
    { key: 'thankyou_btn_en', value: 'Back to Home' }
  ];

  // Bulk upsert keys to make sure they exist, preserving any values already edited by the user!
  const operations = defaultContent.map((item) => {
    return Content.findOneAndUpdate(
      { key: item.key },
      { $setOnInsert: { value: item.value } }, // Only write if the key does not already exist
      { upsert: true, new: true }
    );
  });
  await Promise.all(operations);
  console.log(`Successfully checked and verified all localized layout keys in MongoDB content collection.`);

  // 3. Seed default Articles if empty
  const articleCount = await Article.countDocuments();
  if (articleCount === 0) {
    const defaultArticles = [
      {
        title_ar: 'كيف تختار الهوية البصرية المناسبة لعيادتك الطبية؟',
        title_en: 'How to Choose the Right Visual Identity for Your Medical Clinic?',
        cat_ar: 'الهوية الطبية',
        cat_en: 'Medical Identity',
        image: 'assets/blog-identity.jpg',
        excerpt_ar: 'الهوية البصرية ليست مجرد شعار، بل هي حجر الأساس لبناء ثقة المرضى والمصداقية المهنية في القطاع الصحي.',
        excerpt_en: 'Visual identity is not just a logo, but the cornerstone for building patient trust and professional credibility in the health sector.',
        date: new Date().toISOString().split('T')[0],
      },
      {
        title_ar: 'دليل السيو الطبي: تصدر نتائج البحث وجذب مرضى جدد لعيادتك',
        title_en: 'Medical SEO Guide: Rank High on Search Engines and Attract Patients',
        cat_ar: 'السيو الطبي',
        cat_en: 'Medical SEO',
        image: 'assets/blog-seo.jpg',
        excerpt_ar: 'تعلم كيف يبحث المرضى عن الخدمات الطبية في الرياض، وكيف تجعل موقع عيادتك الخيار الأول على محرك جوجل.',
        excerpt_en: 'Learn how patients search for medical services in Riyadh, and how to make your clinic website the first choice on Google.',
        date: new Date().toISOString().split('T')[0],
      },
    ];
    await Article.insertMany(defaultArticles);
    console.log('Seeded default blog articles.');
  }

  // 4. Seed default Testimonials if empty
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    const defaultTestimonials = [
      {
        name_ar: 'د. خالد عبد الرحمن',
        name_en: 'Dr. Khaled Abdulrahman',
        title_ar: 'استشاري جراحة التجميل - الرياض',
        title_en: 'Consultant Plastic Surgeon - Riyadh',
        quote_ar: 'حققت حملات ديجيتال هيلث نتائج مبهرة جداً لعيادتنا. تضاعف عدد الحجوزات ونمت سمعتنا الطبية بشكل احترافي.',
        quote_en: 'Digital Health campaigns achieved impressive results for our clinic. Bookings doubled and our professional medical reputation grew.',
        image: '',
      },
    ];
    await Testimonial.insertMany(defaultTestimonials);
    console.log('Seeded default testimonials.');
  }

  // 5. Seed default Portfolio if empty - Seed all 6 items so the user gets them in MongoDB out of the box!
  const portfolioCount = await Portfolio.countDocuments();
  if (portfolioCount === 0) {
    const defaultPortfolio = [
      {
        title_ar: 'بناء الهوية البصرية لمجمع نخبة الطبي',
        title_en: 'Visual Branding for Al-Nokhba Medical Center',
        cat_ar: 'هوية بصرية',
        cat_en: 'Brand Identity',
        metric_ar: 'زيادة +150% ثقة وهيبة حضور',
        metric_en: 'Result: +150% local prestige rate',
        image: '',
      },
      {
        title_ar: 'تحسين محركات البحث لعيادات الأسنان بالرياض',
        title_en: 'Clinical SEO Dominance for Riyadh Dentistry',
        cat_ar: 'السيو الطبي',
        cat_en: 'Clinical SEO',
        metric_ar: 'تصدر 12 كلمة رئيسية حجوزات',
        metric_en: 'Result: Top-3 positions for 12 primary keywords',
        image: '',
      },
      {
        title_ar: 'إدارة محتوى طبي لعيادة جراحة تجميلية',
        title_en: 'Premium Content Strategy for Aesthetics Clinic',
        cat_ar: 'سوشيال ميديا',
        cat_en: 'Social Media',
        metric_ar: '50 ألف تفاعل مريض حقيقي',
        metric_en: 'Result: 50k+ active target views',
        image: '',
      },
      {
        title_ar: 'تصميم وبرمجة موقع مستشفى تخصصي',
        title_en: 'Modern Next.js Portal for Specialty Hospital',
        cat_ar: 'موقع إلكتروني',
        cat_en: 'Web Design',
        metric_ar: 'حجز 340 موعد شهرياً',
        metric_en: 'Result: 340+ verified bookings/month',
        image: '',
      },
      {
        title_ar: 'حملات إعلانات عيادات الجلدية والليزر بالرياض',
        title_en: 'Paid Acquisition for Dermatology Center',
        cat_ar: 'إعلانات ممولة',
        cat_en: 'Paid Ads',
        metric_ar: '4.5 أضعاف العائد الإعلاني',
        metric_en: 'Result: 4.5x direct return on ad spend',
        image: '',
      },
      {
        title_ar: 'إعادة بناء السمعة الطبية لمركز تغذية علاجية',
        title_en: 'Reputation Shield for Clinical Nutrition Group',
        cat_ar: 'هوية بصرية',
        cat_en: 'Brand Identity',
        metric_ar: '4.9 تقييم على خرائط جوجل',
        metric_en: 'Result: 4.9 stars Google maps rating',
        image: '',
      }
    ];
    await Portfolio.insertMany(defaultPortfolio);
    console.log('Seeded all 6 default medical portfolio cases.');
  }
}
