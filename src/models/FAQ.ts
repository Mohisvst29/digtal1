import mongoose, { Schema } from 'mongoose';

const FAQSchema = new Schema({
  question_ar: { type: String, required: true },
  question_en: { type: String, required: true },
  answer_ar: { type: String, required: true },
  answer_en: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
