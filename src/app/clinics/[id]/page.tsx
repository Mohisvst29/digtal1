import ClinicDetailPage from '@/components/pages/ClinicDetailPage';
import dbConnect from '@/lib/mongodb';
import Clinic from '@/models/Clinic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    await dbConnect();
    const clinic = await Clinic.findById(id);
    if (clinic) {
      return {
        title: `${clinic.name_ar} | ديجيتال هيلث`,
        description: clinic.desc_ar || '',
      };
    }
  } catch (e) {}
  return {
    title: 'ملف المنشأة | ديجيتال هيلث',
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ClinicDetailPage id={id} />;
}
