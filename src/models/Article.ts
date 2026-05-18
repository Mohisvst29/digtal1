import mongoose, { Schema } from 'mongoose';

const ArticleSchema = new Schema({
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

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
