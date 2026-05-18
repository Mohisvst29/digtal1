import mongoose, { Schema } from 'mongoose';

const TestimonialSchema = new Schema({
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  title_ar: { type: String, required: true },
  title_en: { type: String, required: true },
  quote_ar: { type: String, required: true },
  quote_en: { type: String, required: true },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
