const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Read database connection URI from environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_health';

console.log('Connecting to database:', MONGODB_URI);

// Define Schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' },
});

const ArticleSchema = new mongoose.Schema({
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  cat_ar: { type: String, required: true },
  cat_en: { type: String, required: true },
  image: { type: String, default: '' },
  excerpt_ar: { type: String, required: true },
  excerpt_en: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TestimonialSchema = new mongoose.Schema({
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  quote_ar: { type: String, required: true },
  quote_en: { type: String, required: true },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const PortfolioSchema = new mongoose.Schema({
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  cat_ar: { type: String, required: true },
  cat_en: { type: String, required: true },
  metric_ar: { type: String, required: true },
  metric_en: { type: String, required: true },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Compile Models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

async function runSeed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas!');

    // 1. Seed User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('dejatal121@#', salt);
      await User.create({
        username: 'admin',
        password: passwordHash,
      });
      console.log('✓ Seeded default admin credentials (username: admin / password: dejatal121@#)');
    } else {
      console.log('- Admin credentials already exist.');
    }

    // 2. Seed Content
    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
      const defaultContent = [
        { key: 'contact_phone', value: '+966541659332' },
        { key: 'contact_whatsapp', value: '+966541659332' },
        { key: 'contact_email', value: 'Info@DigitalHealth-sa.com' },
        { key: 'contact_address', value: 'الأمير عبدالعزيز بن مساعد بن جلوي – المربع – الرياض – السعودية' },
        { key: 'contact_map_iframe', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9782522502677!2d46.708890784999994!3d24.6589332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCbDM5JzMyLjIiTiA0NsKwNDInMzIuMCJF!5e0!3m2!1sar!2ssa!4v1700000000000' },
        { key: 'hero_title_ar', value: 'شريك النمو الطبي الاستراتيجي بالرياض' },
        { key: 'hero_title_en', value: 'Integrated Medical Growth for Your Clinic in Riyadh' },
        { key: 'hero_tagline_ar', value: 'نهتم بالهوية الرقمية للعيادات الطبية المتخصصة، تحسين محركات البحث، وجذب المرضى بأعلى معايير المصداقية المهنية.' },
        { key: 'hero_tagline_en', value: 'Empowering healthcare providers and doctors in the Kingdom with digital leadership and patient attraction under the highest clinical authority standards.' },
        { key: 'logo_text_ar', value: 'ديجيتال هيلث' },
        { key: 'logo_text_en', value: 'Digital Health' },
        { key: 'logo_image', value: '' },
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
      console.log('✓ Seeded default layout content configurations successfully.');
    } else {
      console.log('- Layout content configurations already exist.');
    }

    // 3. Seed Articles
    const articleCount = await Article.countDocuments();
    if (articleCount === 0) {
      const defaultArticles = [
        {
          title_ar: 'كيف تختار الهوية البصرية المناسبة لعيادتك الطبية؟',
          title_en: 'How to Choose the Right Visual Identity for Your Medical Clinic?',
          cat_ar: 'الهوية الطبية',
          cat_en: 'Medical Identity',
          image: '',
          excerpt_ar: 'الهوية البصرية ليست مجرد شعار، بل هي حجر الأساس لبناء ثقة المرضى والمصداقية المهنية في القطاع الصحي بالرياض.',
          excerpt_en: 'Visual identity is not just a logo, but the cornerstone for building patient trust and professional credibility in the health sector in Riyadh.',
          date: new Date().toISOString().split('T')[0],
        },
        {
          title_ar: 'دليل السيو الطبي: تصدر نتائج البحث وجذب مرضى جدد لعيادتك',
          title_en: 'Medical SEO Guide: Rank High on Search Engines and Attract Patients',
          cat_ar: 'السيو الطبي',
          cat_en: 'Medical SEO',
          image: '',
          excerpt_ar: 'تعلم كيف يبحث المرضى عن الخدمات الطبية في الرياض، وكيف تجعل موقع عيادتك الخيار الأول على محرك جوجل.',
          excerpt_en: 'Learn how patients search for medical services in Riyadh, and how to make your clinic website the first choice on Google.',
          date: new Date().toISOString().split('T')[0],
        },
      ];
      await Article.insertMany(defaultArticles);
      console.log('✓ Seeded default blog articles successfully.');
    } else {
      console.log('- Blog articles already exist.');
    }

    // 4. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const defaultTestimonials = [
        {
          name_ar: 'د. خالد عبد الرحمن',
          name_en: 'Dr. Khaled Abdulrahman',
          title_ar: 'استشاري جراحة التجميل - الرياض',
          title_en: 'Consultant Plastic Surgeon - Riyadh',
          quote_ar: 'حققت حملات ديجيتال هيلث نتائج مبهرة جداً لعيادتنا. تضاعف عدد الحجوزات ونمت سمعتنا الطبية بشكل احترافي وسريع.',
          quote_en: 'Digital Health campaigns achieved impressive results for our clinic. Bookings doubled and our professional medical reputation grew rapidly and professionally.',
          image: '',
        },
      ];
      await Testimonial.insertMany(defaultTestimonials);
      console.log('✓ Seeded default clinical testimonials successfully.');
    } else {
      console.log('- Clinical testimonials already exist.');
    }

    // 5. Seed Portfolio
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      const defaultPortfolio = [
        {
          title_ar: 'حملة نمو مركز النخبة لطب الأسنان بالرياض',
          title_en: 'Growth Campaign for Al Nokhba Dental Center in Riyadh',
          cat_ar: 'إعلانات ممولة وسيو',
          cat_en: 'Paid Ads & SEO',
          metric_ar: 'زيادة 142% في الحجوزات المؤكدة',
          metric_en: '+142% Increase in Confirmed Bookings',
          image: '',
        },
      ];
      await Portfolio.insertMany(defaultPortfolio);
      console.log('✓ Seeded default portfolio case studies successfully.');
    } else {
      console.log('- Portfolio case studies already exist.');
    }

    console.log('\n=============================================');
    console.log('Database synchronization completed successfully!');
    console.log('=============================================');
  } catch (error) {
    console.error('Error during database synchronization:', error);
  } finally {
    mongoose.connection.close();
  }
}

runSeed();
