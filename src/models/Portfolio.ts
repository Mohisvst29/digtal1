import mongoose, { Schema } from 'mongoose';

const PortfolioSchema = new Schema({
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  cat_ar: { type: String, required: true },
  cat_en: { type: String, required: true },
  metric_ar: { type: String, required: true },
  metric_en: { type: String, required: true },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
