import bcrypt from 'bcryptjs';
import User from '../models/User';
import Content from '../models/Content';
import Article from '../models/Article';
import Testimonial from '../models/Testimonial';
import Portfolio from '../models/Portfolio';
import FAQ from '../models/FAQ';
import Service from '../models/Service';
import TeamMember from '../models/TeamMember';
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
    { key: 'hero_slide_1', value: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1920' },
    { key: 'hero_slide_2', value: 'https://images.unsplash.com/photo-1584515906207-52c616682c16?auto=format&fit=crop&q=80&w=1920' },
    { key: 'hero_slide_3', value: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1920' },
    { key: 'hero_bg_video', value: 'https://assets.mixkit.co/videos/preview/mixkit-medical-laboratory-researcher-analyzing-a-sample-40237-large.mp4' },
    { key: 'social_linkedin', value: 'https://linkedin.com' },
    { key: 'social_facebook', value: 'https://facebook.com' },
    { key: 'social_tiktok', value: 'https://tiktok.com' },
    { key: 'social_instagram', value: 'https://instagram.com' },
    { key: 'social_snapchat', value: 'https://snapchat.com' },
    { key: 'social_behance', value: 'https://behance.net' },
    { key: 'social_x', value: 'https://x.com' },
    { key: 'social_youtube', value: 'https://youtube.com' },

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

  // 6. Seed default FAQs if empty
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    const defaultFAQs = [
      {
        question_ar: 'هل أنتم متخصصون في التسويق الطبي فقط؟',
        question_en: 'Are you exclusively focused on medical healthcare marketing?',
        answer_ar: 'نعم، التسويق الطبي والقطاع الصحي هو تخصصنا الوحيد. نحن نؤمن بأن التسويق الطبي يحتاج إلى فهم دقيق لسيكولوجية المريض، المعايير الطبية والأخلاقية، وقوانين الإعلانات الطبية بمؤسسات المملكة العربية السعودية وزارة الصحة، وهو ما لا تقدمه الوكالات التسويقية العامة.',
        answer_en: 'Yes, clinical marketing is our sole specialty. Healthcare demands meticulous adherence to patient psychology, professional visual trust, and strict Saudi MOH guidelines, which general marketing firms lack.',
        order: 0,
      },
      {
        question_ar: 'كم تكلفة الخدمات والمشاريع الطبية الرقمية؟',
        question_en: 'What are the costs and packages of your clinical services?',
        answer_ar: 'تختلف الأسعار والخطط المقررة بناءً على حجم الأهداف الطبية، وتخصص العيادة، ومستوى التنافس بالرياض. نقدم باقات مرنة للغاية تناسب العيادات الفردية والمراكز الطبية الكبرى مع استراتيجيات تحصيل تتبع دقيق للعائد الاستثماري.',
        answer_en: 'Our service quotes vary depending on scale goals, surgical/non-surgical specialties, and current localized patient competition in Riyadh. We customize budgets strictly aimed at driving profitable patient acquisition costs.',
        order: 1,
      },
      {
        question_ar: 'كم يستغرق ظهور النتائج وحجوزات المرضى الحقيقية؟',
        question_en: 'How long does it take to see real patient inquiries and bookings?',
        answer_ar: 'تختلف المدة حسب القنوات المستخدمة: الإعلانات المدفوعة الذكية تحقق نتائج وحجوزات فورية خلال 30 إلى 60 يوماً من تفعيلها. أما السيو الطبي التخصصي فيحتاج من 3 إلى 6 أشهر لبناء السمعة وتصدر نتائج بحث جوجل لضمان تدفق مستدام ومجاني للمرضى.',
        answer_en: 'Timeline depends on selected pathways: Paid search and social ads yield incoming clinic consult forms within 30-60 days. Comprehensive clinical SEO compounds authority, requiring 3-6 months to capture lasting free local Google Maps patient streams.',
        order: 2,
      },
      {
        question_ar: 'هل تعملون مع الأطباء والاستشاريين الأفراد؟',
        question_en: 'Do you support individual physicians and private consultants?',
        answer_ar: 'نعم، نعمل بشكل وثيق للغاية مع الأطباء والاستشاريين لبناء الهوية الطبية الشخصية (البراند الشخصي الطبي) الذي يدعم الثقة ويزيد من جاذبية اسم الممارس في سوق الرياض الطبي المزدحم.',
        answer_en: 'Absolutely. We collaborate directly with clinical specialists to engineer their professional digital brand, highlighting credentials, clinical reviews, and thought leadership positions.',
        order: 3,
      },
      {
        question_ar: 'هل توفرون تقارير وتحليلات أداء شهرية للعيادات؟',
        question_en: 'Do you deliver detailed clinical performance analytics?',
        answer_ar: 'نعم، نلتزم بالشفافية المطلقة. نقدم تقارير أداء دورية توضح أعداد استمارات الحجز المكتملة، وتكلفة الاستحواذ على المريض، والتفاعل عبر قنوات التواصل، لنبني قراراتنا على الأرقام فقط.',
        answer_en: 'Transparency is our core standard. We share monthly performance digests tracking validated booking numbers, cost-per-inquiry benchmarks, and organic web visitors.',
        order: 4,
      },
      {
        question_ar: 'ما هي قنوات ومنصات التواصل التي تديرونها؟',
        question_en: 'Which digital platforms and social networks do you manage?',
        answer_ar: 'ندير ونطلق الحملات على كافة المنصات النشطة للجمهور المستهدف بالمملكة: سناب شات، إنستغرام، تيك توك، إعلانات جوجل، وخرائط جوجل بالكامل.',
        answer_en: 'We operate clinical funnels across snaps, maps, search engines, and target platforms in Saudi Arabia, matching surgical specialties with selective audience demographics.',
        order: 5,
      }
    ];
    await FAQ.insertMany(defaultFAQs);
    console.log('Seeded default FAQs.');
  }

  // 7. Seed default Services if empty
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    const defaultServices = [
      {
        slug: 'identity',
        icon: 'fingerprint',
        colSpan: 'md:col-span-8',
        order: 0,
        tags_ar: ['استراتيجية', 'تصميم هوية'],
        tags_en: ['Strategy', 'Visual design'],
        title_ar: 'الهوية الطبية الرقمية الفاخرة',
        title_en: 'Premium Clinical Brand Identity',
        desc_ar: 'تأسيس براند طبي قوي ومهيب يعبر عن كفاءتكم الطبية وعيادتكم لربط قيمكم ورسالتكم الطبية بالمرضى بشكل راقٍ ومقنع.',
        desc_en: 'Establishing a visual brand, logos, and custom guidelines for elite clinics and medical centers to engage patient groups online.',
        tag_ar: 'الهوية الطبية للعيادات الفاخرة',
        tag_en: 'Clinical Brand Identity',
        btnText_ar: 'صمم الهوية الطبية الفاخرة لمركزك',
        btnText_en: 'Design Your Luxury Medical Brand',
        benefitTitle_ar: 'الفخامة البصرية تبني السلطة الطبية',
        benefitTitle_en: 'Premium Branding Commands High Fees',
        benefitDesc_ar: 'لا يشتري المرضى مجرد علاج، بل يشترون الثقة والرعاية الفاخرة. الهوية الراقية المتكاملة تميز علامتكم عن العيادات التقليدية وتدعم الأسعار العادلة.',
        benefitDesc_en: 'A luxury, unified identity sets elite clinical centers apart from commercial discount operations, justifying premium patient care pricing.',
        benefits: [
          {
            icon: 'palette',
            title_ar: 'تصميم بصري فاخر وفريد',
            title_en: 'High-End Custom Visuals',
            desc_ar: 'شعار، ألوان، وخطوط مخصصة تعبر عن الرقي والوقار الطبي لعلامتكم.',
            desc_en: 'Tailored logo, color palettes, and typography matching clinical class and visual prestige.',
          },
          {
            icon: 'verified',
            title_ar: 'توحيد كافة قنوات التواصل',
            title_en: 'Consistent Channel Presentation',
            desc_ar: 'بناء حضور متكامل ومتناسق يبدأ من لوحة العيادة ويمتد لموقعكم ومنصاتكم.',
            desc_en: 'Aligning physical clinic interiors, signage, stationery, and dynamic web interfaces.',
          }
        ],
        strategyTitle_ar: 'استراتيجية بناء الهوية الطبية الرقمية',
        strategyTitle_en: 'Branding Execution Protocol',
        strategies: [
          {
            title_ar: 'تحديد تموضع العلامة والرسالة الطبية',
            title_en: 'Brand Positioning Audit',
            desc_ar: 'دراسة قيم العيادة وصياغة الرسالة الطبية التخصصية التي تميزكم عن غيركم بالرياض.',
            desc_en: 'Delineating clinical strengths and creating unique brand mission statements for target markets.',
          },
          {
            title_ar: 'تصميم حزمة الهوية البصرية المتكاملة',
            title_en: 'Premium Style Guide Production',
            desc_ar: 'إنتاج كتيب الهوية، الشعار، الألوان، الخطوط، وقوالب المنشورات الفاخرة الطبية.',
            desc_en: 'Developing font packages, logo systems, social media assets, and medical card templates.',
          },
          {
            title_ar: 'أصول الطباعة والمواد الإعلانية بالعيادة',
            title_en: 'Physical Clinic Collaterals',
            desc_ar: 'تصميم كروت الأطباء، التقارير الطبية، روشتات العيادة، والديكور الداخلي المتناسق.',
            desc_en: 'Designing medical reports, clinical prescription sheets, envelopes, and consistent signage designs.',
          }
        ],
        extraType: 'identity'
      },
      {
        slug: 'seo',
        icon: 'search_insights',
        colSpan: 'md:col-span-4',
        order: 1,
        tags_ar: ['سيو طبي', 'خرائط جوجل'],
        tags_en: ['Medical SEO', 'Google Maps'],
        title_ar: 'السيو الطبي التخصصي',
        title_en: 'Clinical Medical SEO Dominance',
        desc_ar: 'التصدر الفوري والأول لنتائج البحث المحلية بالرياض للمرضى الباحثين عن تخصصك وخدمات عيادتك الطبية مباشرة.',
        desc_en: 'Dominating local search results in Riyadh for high-intent queries like best clinic near me to channel organic patient flow.',
        tag_ar: 'تحسين محركات البحث الطبي',
        tag_en: 'Clinical Medical SEO',
        btnText_ar: 'اطلب فحص سيو مجاني لعيادتك',
        btnText_en: 'Get Free Clinic SEO Audit',
        benefitTitle_ar: 'ميزة تصدر محركات البحث',
        benefitTitle_en: 'The Power of Organic SEO',
        benefitDesc_ar: 'يبدأ أكثر من 70% من المرضى بالرياض رحلتهم الطبية بالبحث على جوجل. إذا لم تكن عيادتك في الصفحة الأولى، فإنك ببساطة تقدم مرضاك الجدد للعيادات المنافسة.',
        benefitDesc_en: 'Over 70% of selective patients start their search with Google queries. Dominating organic listings bypasses expensive paid ads permanently.',
        benefits: [
          {
            icon: 'verified',
            title_ar: 'حجوزات عالية الكفاءة',
            title_en: 'High-Intent Bookings',
            desc_ar: 'زوار نتائج البحث العضوية يملكون أعلى نسب حجز مواعيد فعلية واستبقاء للعيادة.',
            desc_en: 'Organic web visitors have the absolute highest conversion rate to clinical check-ups.',
          },
          {
            icon: 'verified',
            title_ar: 'عائد استثماري مستدام',
            title_en: 'Permanent Digital Assets',
            desc_ar: 'بخلاف الإعلانات، نتائج الـ SEO تبني أصولاً رقمية مجانية ودائمة لعلامتكم الطبية.',
            desc_en: 'Unlike social ads, SEO pages build lasting digital compounding authority for your clinic.',
          }
        ],
        strategyTitle_ar: 'آلية العمل والاستراتيجية السريرية',
        strategyTitle_en: 'Our SEO Framework & Compliance',
        strategies: [
          {
            title_ar: 'السيطرة على البحث المحلي (السيو المحلي)',
            title_en: 'Google Maps Optimization (Local SEO)',
            desc_ar: 'تحسين ملفات خرائط جوجل للعيادة (ملف جوجل التجاري) لتتصدر فوراً عند بحث المرضى القريبين بالرياض.',
            desc_en: 'Optimizing your GMB profile to appear instantly on local geo-targeted clinical searches in Riyadh.',
          },
          {
            title_ar: 'هيكلة وصناعة المحتوى الطبي التخصصي',
            title_en: 'MOH & Google Compliant Content',
            desc_ar: 'نشر مقالات طبية وعلمية بالغة الدقة تتوافق مع خوارزميات جوجل الصارمة لبناء الموثوقية الطبية.',
            desc_en: 'Writing clinical articles utilizing top expert medical knowledge guidelines to build real authority.',
          },
          {
            title_ar: 'التحسين التقني الفني للموقع وسرعة التصفح',
            title_en: 'Technical Speed & Architecture',
            desc_ar: 'تحسين كود الموقع وسرعة تحميله لتصل لأقل من ثانية ونصف، وضمان تصفح مريح وخالي من أي تعقيدات من الجوال.',
            desc_en: 'Ensuring your site loads in under 1.5 seconds, optimized fully for responsive mobile screens.',
          }
        ],
        extraType: 'seo'
      },
      {
        slug: 'reputation',
        icon: 'star_half',
        colSpan: 'md:col-span-4',
        order: 2,
        tags_ar: ['سمعة رقمية', 'خرائط جوجل'],
        tags_en: ['Reputation', 'Google Maps'],
        title_ar: 'إدارة السمعة الطبية',
        title_en: 'Clinic & Doctor Reputation Management',
        desc_ar: 'مراقبة وحماية سمعتك الطبية الرقمية على خرائط جوجل والمنصات الطبية المتخصصة وتكبير حجم التقييمات الإيجابية.',
        desc_en: 'Leveraging automated feedback software to govern clinic ratings, capture star reviews, and secure patient trust online.',
        tag_ar: 'إدارة السمعة والسيرة الطبية',
        tag_en: 'Healthcare Reputation Governance',
        btnText_ar: 'ابدأ في حماية سمعتك الطبية الرقمية',
        btnText_en: 'Govern Your Clinic Reputation Now',
        benefitTitle_ar: 'التقييمات هي القوة الدافعة للحجوزات',
        benefitTitle_en: 'Trust In The Age of Digital Reviews',
        benefitDesc_ar: 'يقرأ أكثر من 90% من المرضى في الرياض تقييمات خرائط جوجل والمنصات قبل اختيار عيادتهم الجديدة. نحن نصمم لك نظاماً آلياً لجمع وحماية تقييماتك وتكبيرها.',
        benefitDesc_en: 'Selective patients choose medical specialists with superior verified feedback. We deploy systemic triggers to harvest positive feedback while buffering critical inquiries.',
        benefits: [
          {
            icon: 'star',
            title_ar: 'جمع تقييمات حقيقية تلقائية',
            title_en: 'Automated 5-Star Streams',
            desc_ar: 'نظام ذكي يرسل للمرضى بعد خروجهم من العيادة لتقييم خدماتك بسهولة.',
            desc_en: 'Sending polite feedback prompts to patients right after clinical discharge, boosting Google rating naturally.',
          },
          {
            icon: 'gavel',
            title_ar: 'حماية السمعة من التقييمات الوهمية',
            title_en: 'Critical Feedback Buffering',
            desc_ar: 'مراقبة وتدخل فوري لحل التقييمات السلبية الكاذبة وحمايتك الرقمية.',
            desc_en: 'Filtering negative remarks privately to internal support teams while showcasing organic positive reviews.',
          }
        ],
        strategyTitle_ar: 'استراتيجية حوكمة السمعة الطبية',
        strategyTitle_en: 'Our Review Automation Framework',
        strategies: [
          {
            title_ar: 'تفعيل أنظمة التقييم التلقائي بالعيادات',
            title_en: 'Automated Review Triggers',
            desc_ar: 'ربط رسائل واتساب أو رسائل نصية قصيرة بنظام الفواتير والزيارات لدعوة التقييم.',
            desc_en: 'Integrating custom text/WhatsApp dispatch systems with your hospital checkout flow.',
          },
          {
            title_ar: 'تحليل والرد المهني الطبي على المراجعات',
            title_en: 'Professional Medical Moderation',
            desc_ar: 'الرد على كافة التقييمات والمراجعات بلغة وقورة ومهنية تليق بسمعة المركز وتدعم السيو.',
            desc_en: 'Replying to all patient feedback gracefully, showing empathy and enhancing organic keyword relevancy.',
          },
          {
            title_ar: 'مراقبة المنصات الطبية والأدلة بالرياض',
            title_en: 'Directories Integration',
            desc_ar: 'متابعة وتحديث ملفات الأطباء على مختلف أدلة البحث الطبي لضمان تطابق البيانات.',
            desc_en: 'Keeping active records across Saudi clinic portals consistent and completely updated.',
          }
        ],
        extraType: 'reputation'
      },
      {
        slug: 'web',
        icon: 'devices',
        colSpan: 'md:col-span-8',
        order: 3,
        tags_ar: ['تصميم مواقع', 'أنظمة حجز'],
        tags_en: ['Web Design', 'Booking Systems'],
        title_ar: 'المواقع والتطبيقات الطبية الفاخرة',
        title_en: 'Stunning Medical Web Platforms',
        desc_ar: 'تطوير منصات طبية ومواقع ويب تفاعلية فائقة السرعة تتيح حجز مواعيد مرن وسلس وتقدم تجربة استخدام مريحة للمريض.',
        desc_en: 'Developing high-converting responsive web screens and custom client systems with interactive scheduling tools.',
        tag_ar: 'تصميم المواقع الطبية الفاخرة',
        tag_en: 'Luxury Medical Web Development',
        btnText_ar: 'صمم موقع عيادتك الفاخر الآن',
        btnText_en: 'Build Your Custom Clinic Site',
        benefitTitle_ar: 'منصتك الرقمية هي واجهة عيادتك',
        benefitTitle_en: 'A Seamless Digital Patient Portal',
        benefitDesc_ar: 'موقعك الطبي هو الانطباع الأول للمرضى. نحن نبني مواقع وتطبيقات تجمع بين الفخامة البصرية والسرعة الفائقة لضمان تحويل الزائرين لحجوزات مؤكدة.',
        benefitDesc_en: 'Your clinic website is where patient conversions actually happen. We deliver highly customized Next.js platforms optimized for speed, safety, and bookings.',
        benefits: [
          {
            icon: 'speed',
            title_ar: 'سرعة تصفح فائقة',
            title_en: 'Sub-Second Speeds',
            desc_ar: 'تحميل فوري للموقع من الجوال في أقل من ثانية ونصف يمنع خسارة المرضى.',
            desc_en: 'Optimized react frameworks ensuring your mobile users never leave due to page loading lags.',
          },
          {
            icon: 'security',
            title_ar: 'أمان وتشفير كامل للبيانات',
            title_en: 'HIPAA & MOH Data Safety',
            desc_ar: 'حماية كاملة لمعلومات المرضى الطبية مع تشفير وسيرفرات آمنة.',
            desc_en: 'End-to-end encryption to govern private patient appointment forms and secure hospital data.',
          }
        ],
        strategyTitle_ar: 'مراحل تصميم وتطوير المواقع الطبية',
        strategyTitle_en: 'Our Medical Engineering Pipeline',
        strategies: [
          {
            title_ar: 'هندسة تجربة المريض الرقمية (UX)',
            title_en: 'Intuitive Patient Flow (UX/UI)',
            desc_ar: 'واجهات بسيطة تمكن المريض من معرفة الأطباء، وحجز موعد، والاتصال في أقل من 3 نقرات.',
            desc_en: 'Designing streamlined paths that allow visitors to view credentials and confirm consultations in 3 clicks.',
          },
          {
            title_ar: 'الربط مع برامج إدارة العيادات',
            title_en: 'Clinic CRM & Calendar Sync',
            desc_ar: 'دمج موقعك مع أنظمة إدارة الحجوزات والمواعيد الداخلية لمركزك الطبي مباشرة.',
            desc_en: 'Integrating directly with your internal hospital databases and appointment software.',
          },
          {
            title_ar: 'التوافق مع متطلبات السيو الفني',
            title_en: 'Technical SEO Base Code',
            desc_ar: 'بناء كود نظيف ومتوافق 100% مع خوارزميات جوجل لضمان الظهور الفوري في نتائج البحث.',
            desc_en: 'Applying structured JSON-LD schemes so search engines understand your locations, reviews, and specialties instantly.',
          }
        ],
        extraType: 'web'
      },
      {
        slug: 'social',
        icon: 'share_reviews',
        colSpan: 'md:col-span-6',
        order: 4,
        tags_ar: ['سوشيال ميديا', 'صناعة محتوى'],
        tags_en: ['Social Media', 'Content Creation'],
        title_ar: 'إدارة السوشيال ميديا الطبية',
        title_en: 'Premium Medical Content & Social Media',
        desc_ar: 'ترجمة المحتوى الطبي العلمي المعقد إلى مقاطع فيديو قصيرة وتصاميم مرئية مبسطة وسهلة الفهم لبناء قاعدة متابعين مخلصين.',
        desc_en: 'Crafting visually stunning educational social assets for selective doctors and modern medical centers to engage patient groups online.',
        tag_ar: 'التسويق عبر صناعة المحتوى',
        tag_en: 'Medical Social Content Strategy',
        btnText_ar: 'ابدأ في بناء براندك الشخصي الطبي الآن',
        btnText_en: 'Build Your Medical Brand Now',
        benefitTitle_ar: 'تحويل المعرفة إلى ثقة وحجوزات',
        benefitTitle_en: 'Transforming Medical Authority to Trust',
        benefitDesc_ar: 'يبحث المرضى الحديثون عن وجوه مألوفة وعلم حقيقي. نساعد الأطباء على الظهور بمظهر مهيب وودود عبر مقاطع فيديو قصيرة وتصاميم تثقيفية تترجم المعرفة الطبية لثقة.',
        benefitDesc_en: 'Modern patients book with doctors they already feel connected to. We write and produce custom media content that presents clinical excellence in premium style.',
        benefits: [
          {
            icon: 'group',
            title_ar: 'بناء قاعدة مرضى مخلصين',
            title_en: 'Loyal Patient Community',
            desc_ar: 'بناء مجتمع رقمي يثق بآرائك الطبية ويفضل عيادتك دائماً عن غيرها.',
            desc_en: 'Building dynamic online followers that seek your medical opinion and share your clinic works.',
          },
          {
            icon: 'verified',
            title_ar: 'براند شخصي طبي مهيب',
            title_en: 'Elite Professional Standing',
            desc_ar: 'تأسيس حضور رقمي يبرز كفاءتك الأكاديمية والعملية بالرياض.',
            desc_en: 'Translating your medical certificates and clinical achievements into high-end public authority.',
          }
        ],
        strategyTitle_ar: 'خطوات صناعة المحتوى الطبي',
        strategyTitle_en: 'Our Creative Content Lifecycle',
        strategies: [
          {
            title_ar: 'تطوير نصوص طبية مرخصة وجذابة',
            title_en: 'MOH Regulatory Writing',
            desc_ar: 'كتابة نصوص الفيديو والمنشورات بالاعتماد على مراجع علمية مع صياغتها بطريقة بسيطة وجذابة.',
            desc_en: 'Drafting medical scripts and educational content that is both compelling and scientifically accurate.',
          },
          {
            title_ar: 'جلسات تصوير سريرية فاخرة',
            title_en: 'High-End Cinematic Shoots',
            desc_ar: 'إشراف وتصوير احترافي لعياداتكم وأطبائكم لإبراز المعايير السريرية الراقية والخدمات التخصصية.',
            desc_en: 'Directing and editing stunning visual tours and doctor profile videos in Riyadh clinical facilities.',
          },
          {
            title_ar: 'التوزيع والنشر الذكي المستمر',
            title_en: 'Organic Algorithm Distribution',
            desc_ar: 'إدارة وجدولة النشر اليومي والتفاعل مع تعليقات واستفسارات المرضى لتحويلهم لعيادتك.',
            desc_en: 'Scheduling visual publications on TikTok, Snap, and Insta, maximizing reach among target local districts.',
          }
        ],
        extraType: 'social'
      },
      {
        slug: 'ppc',
        icon: 'ads_click',
        colSpan: 'md:col-span-6',
        order: 5,
        tags_ar: ['إعلانات ممولة', 'حملات مدفوعة'],
        tags_en: ['Paid Ads', 'PPC Campaigns'],
        title_ar: 'الإعلانات الممولة والاستهداف المباشر',
        title_en: 'High-Conversion Paid Patient Campaigns',
        desc_ar: 'حملات إعلانية مدفوعة ذكية ودقيقة تستهدف المرضى الباحثين عن علاجات التجميل، الأسنان، الليزر بأقل تكلفة حجز ممكنة.',
        desc_en: 'Engineering ad campaigns on Google, Snapchat, and Meta to pack clinic consult rooms with selective patients.',
        tag_ar: 'إعلانات الاستحواذ المباشر',
        tag_en: 'Targeted Patient Lead Generation',
        btnText_ar: 'احصل على خطة إعلانية مخصصة لعيادتك',
        btnText_en: 'Request Custom Ad Strategy',
        benefitTitle_ar: 'عائد سريع ونمو مضمون الحجوزات',
        benefitTitle_en: 'Instant Patient Flow Optimization',
        benefitDesc_ar: 'نصمم حملات إعلانية مدفوعة ومحسنة خصيصاً للعيادات الطبية التخصصية، لزيادة نسب الإشغال وجمع استمارات الحجز الحقيقية مع خفض تكاليف النقرة.',
        benefitDesc_en: 'Deploying highly-converting paid pathways that focus purely on confirmed clinical calls, WhatsApp messages, and direct online bookings.',
        benefits: [
          {
            icon: 'trending_up',
            title_ar: 'نتائج فورية مباشرة',
            title_en: 'Instant Lead Influx',
            desc_ar: 'تبدأ الاتصالات وحجوزات المواعيد في التدفق لمركزك الطبي من اليوم الأول لإطلاق الحملة.',
            desc_en: 'Verified booking requests start reaching your reception from the very first hour of ad launch.',
          },
          {
            icon: 'verified',
            title_ar: 'تتبع كامل للحجوزات',
            title_en: 'End-to-End Analytics Tracking',
            desc_ar: 'نظام قياس دقيق يربط بين الميزانية المدفوعة والمبيعات الطبية الفعلية لعيادتك.',
            desc_en: 'We link paid clicks directly with final patient arrivals at your clinic, ensuring precise ROI.',
          }
        ],
        strategyTitle_ar: 'منهجية الإعلانات الطبية الدقيقة',
        strategyTitle_en: 'Clinical Ad Campaigns Setup',
        strategies: [
          {
            title_ar: 'استهدف الفئات عالية النية',
            title_en: 'High-Value Interest Targeting',
            desc_ar: 'استهداف المرضى الباحثين عن علاجات التجميل، الأسنان، الليزر، وزراعة الأسنان في مناطق الرياض الراقية.',
            desc_en: 'Reaching selective individuals looking for plastic surgery, veneers, dental implants, or aesthetic treatments in upscale Riyadh.',
          },
          {
            title_ar: 'تصميم عروض وحوافز متوافقة طبياً',
            title_en: 'MOH Compliant Ad Copywriting',
            desc_ar: 'صياغة نصوص إعلانية وعروض علاجية محفزة مع الحفاظ الكامل على وقار وأخلاقيات المهنة الطبية.',
            desc_en: 'Drafting premium visual styles and persuasive medical copywriting that complies with local healthcare guidelines.',
          },
          {
            title_ar: 'الاختبار والتحسين الذكي المستمر',
            title_en: 'A/B Testing & Scaling',
            desc_ar: 'اختبار مستمر للعناوين والمواد الإبداعية لتقليل تكلفة حجز الاستشارة وضمان ثبات التدفق.',
            desc_en: 'Constantly optimizing graphics, layout variations, and target channels to drive down patient acquisition costs.',
          }
        ],
        extraType: 'ppc'
      }
    ];
    await Service.insertMany(defaultServices);
    console.log('Seeded default Services.');
  }

  // 8. Seed default Team Members if empty
  const teamMemberCount = await TeamMember.countDocuments();
  if (teamMemberCount === 0) {
    const defaultTeam = [
      {
        name_ar: 'مستشار تسويق رقمي طبي',
        name_en: 'Clinical Growth Lead',
        role_ar: 'عضو فريق عمل استراتيجي',
        role_en: 'Senior Medical Growth Advisor',
        image_url: '',
        order: 0,
      },
      {
        name_ar: 'مطور ويب وتجربة المريض',
        name_en: 'UX Patient-Path Architect',
        role_ar: 'مهندس الحلول الطبية الرقمية',
        role_en: 'Fullstack Systems Architect',
        image_url: '',
        order: 1,
      },
      {
        name_ar: 'صانع محتوى طبي مرخص',
        name_en: 'Clinical Copywriter',
        role_ar: 'مختص تبسيط المعرفة الطبية',
        role_en: 'MOH Compliant Content Lead',
        image_url: '',
        order: 2,
      }
    ];
    await TeamMember.insertMany(defaultTeam);
    console.log('Seeded default Team Members.');
  }
}
