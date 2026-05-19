import mongoose, { Schema } from 'mongoose';

const DoctorSchema = new Schema({
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  specialty_ar: { type: String, required: true },
  specialty_en: { type: String, required: true },
  desc_ar: { type: String, required: true },
  desc_en: { type: String, required: true },
  image_url: { type: String, default: '' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
