import ServiceDetailPage from '@/components/pages/ServiceDetailPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  return <ServiceDetailPage slug={slug} />;
}
