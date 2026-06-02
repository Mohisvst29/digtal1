import DoctorDetailPage from '@/components/pages/DoctorDetailPage';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    await dbConnect();
    const doc = await Doctor.findById(id);
    if (doc) {
      return {
        title: `${doc.name_ar} | ديجيتال هيلث`,
        description: doc.desc_ar || '',
      };
    }
  } catch (e) {}
  return {
    title: 'ملف الطبيب | ديجيتال هيلث',
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <DoctorDetailPage id={id} />;
}
