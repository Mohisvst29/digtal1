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

  // 2. Seed default Page Content configs if empty
  const contentCount = await Content.countDocuments();
  if (contentCount === 0) {
    const defaultContent = [
      { key: 'contact_phone', value: '+9660541659332' },
      { key: 'contact_whatsapp', value: '+9660541659332' },
      { key: 'contact_email', value: 'info@digitalhealth.agency' },
      { key: 'contact_address', value: 'الرياض، المملكة العربية السعودية' },
      { key: 'contact_map_iframe', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9782522502677!2d46.708890784999994!3d24.6589332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03f7e5d8f63b%3A0xe5a3c08cd4ad4e2c!2sPrince%20Abdulaziz%20Bin%20Musaid%20Bin%20Jalawi%20St%2C%20Al%20Murabba%2C%20Riyadh%2012628!5e0!3m2!1sen!2ssa!4v1700000000000' },
      { key: 'hero_title_ar', value: 'شريك النمو الطبي الاستراتيجي' },
      { key: 'hero_title_en', value: 'Integrated Medical Growth for Your Clinic' },
      { key: 'hero_tagline_ar', value: 'نهتم بالهوية الرقمية للعيادات الطبية المتخصصة، تحسين محركات البحث، وجذب المرضى بأعلى معايير المصداقية المهنية.' },
      { key: 'hero_tagline_en', value: 'Empowering healthcare providers and doctors in the Kingdom with digital leadership and patient attraction under the highest clinical authority standards.' },
      { key: 'logo_text_ar', value: 'ديجيتال هيلث' },
      { key: 'logo_text_en', value: 'Digital Health' },
      { key: 'logo_image', value: 'assets/logo.png' },
      { key: 'font_family_ar', value: 'Tajawal' },
      { key: 'font_family_en', value: 'Plus Jakarta Sans' },
      { key: 'primary_color', value: '#00daf3' },
      { key: 'secondary_color', value: '#00e3fd' },
      { key: 'bg_color', value: '#011230' },
      { key: 'surface_color', value: '#0e1f3d' },
      { key: 'seo_title_ar', value: 'ديجيتال هيلث | وكالة تسويق رقمي طبي في الرياض' },
      { key: 'seo_title_en', value: 'Digital Health | Medical Digital Marketing Agency in Riyadh' },
      { key: 'seo_desc_ar', value: 'وكالة تسويق رقمي طبي متخصصة في الرياض. نساعد الأطباء، العيادات، والمستشفيات على جذب المرضى وزيادة الحجوزات من خلال استراتيجيات تسويق طبية.' },
      { key: 'seo_desc_en', value: 'Specialized medical digital marketing agency in Riyadh. We help doctors, clinics, and hospitals attract patients and increase bookings through medical marketing strategies.' },
      { key: 'seo_keywords_ar', value: 'تسويق طبي, تسويق عيادات, سيو طبي, الهوية الطبية, جذب المرضى, الرياض' },
      { key: 'seo_keywords_en', value: 'medical marketing, clinic marketing, medical seo, medical identity, patient attraction, Riyadh' },
    ];
    await Content.insertMany(defaultContent);
    console.log('Seeded default layout content configurations.');
  }

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

  // 5. Seed default Portfolio if empty
  const portfolioCount = await Portfolio.countDocuments();
  if (portfolioCount === 0) {
    const defaultPortfolio = [
      {
        title_ar: 'حملة نمو مركز النخبة لطب الأسنان',
        title_en: 'Growth Campaign for Al Nokhba Dental Center',
        cat_ar: 'إعلانات ممولة وسيو',
        cat_en: 'Paid Ads & SEO',
        metric_ar: 'زيادة 142% في الحجوزات المؤكدة',
        metric_en: '+142% Increase in Confirmed Bookings',
        image: 'assets/case-dental.jpg',
      },
    ];
    await Portfolio.insertMany(defaultPortfolio);
    console.log('Seeded default portfolio.');
  }
}
