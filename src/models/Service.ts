import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: true, default: 'fingerprint' },
  colSpan: { type: String, default: 'md:col-span-6' }, // Custom layout sizing
  order: { type: Number, default: 0 },
  
  // Custom badges/tags displayed on primary dashboard
  tags_ar: { type: [String], default: [] },
  tags_en: { type: [String], default: [] },

  // Basic content
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  desc_ar: { type: String, required: true },
  desc_en: { type: String, required: true },
  tag_ar: { type: String, default: '' },
  tag_en: { type: String, default: '' },
  btnText_ar: { type: String, default: '' },
  btnText_en: { type: String, default: '' },
  
  // Benefits Section
  benefitTitle_ar: { type: String, default: '' },
  benefitTitle_en: { type: String, default: '' },
  benefitDesc_ar: { type: String, default: '' },
  benefitDesc_en: { type: String, default: '' },
  
  // Array of benefits: [{ icon, title_ar, title_en, desc_ar, desc_en }]
  benefits: [
    {
      icon: { type: String, default: 'verified' },
      title_ar: { type: String, default: '' },
      title_en: { type: String, default: '' },
      desc_ar: { type: String, default: '' },
      desc_en: { type: String, default: '' },
    }
  ],
  
  // Strategies Section
  strategyTitle_ar: { type: String, default: '' },
  strategyTitle_en: { type: String, default: '' },
  
  // Array of strategies: [{ title_ar, title_en, desc_ar, desc_en }]
  strategies: [
    {
      title_ar: { type: String, default: '' },
      title_en: { type: String, default: '' },
      desc_ar: { type: String, default: '' },
      desc_en: { type: String, default: '' },
    }
  ],

  // Extra features / statistics (for custom rendering blocks on home/service page, e.g. bullets, stats, badges, progress, cards)
  extraType: { type: String, default: '' }, // e.g. "bullets", "stat", "badges", "progress", "cards"
  
  extraData_ar: { type: Schema.Types.Mixed, default: null }, // Flexible JSON for extra items in Arabic
  extraData_en: { type: Schema.Types.Mixed, default: null }, // Flexible JSON for extra items in English
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
