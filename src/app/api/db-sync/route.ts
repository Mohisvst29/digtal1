import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import Article from '@/models/Article';
import Testimonial from '@/models/Testimonial';
import Portfolio from '@/models/Portfolio';
import Lead from '@/models/Lead';
import Media from '@/models/Media';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dejatal_secret_key_121';

async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return false;
    const decoded = jwt.verify(token, JWT_SECRET);
    return !!decoded;
  } catch (e) {
    return false;
  }
}

export async function GET() {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized access' }, { status: 401 });
    }

    await dbConnect();
    
    const content = await Content.find({});
    const articles = await Article.find({});
    const testimonials = await Testimonial.find({});
    const portfolio = await Portfolio.find({});
    const leads = await Lead.find({});
    const media = await Media.find({});

    const backup = {
      export_date: new Date().toISOString(),
      content,
      articles,
      testimonials,
      portfolio,
      leads,
      media,
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=digital_health_backup_${Date.now()}.json`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized access' }, { status: 401 });
    }

    await dbConnect();
    const backup = await request.json();

    if (!backup || typeof backup !== 'object') {
      return NextResponse.json({ status: 'error', message: 'ملف النسخة الاحتياطية غير صالح.' }, { status: 400 });
    }

    if (Array.isArray(backup.content)) {
      await Content.deleteMany({});
      await Content.insertMany(backup.content);
    }

    if (Array.isArray(backup.articles)) {
      await Article.deleteMany({});
      await Article.insertMany(backup.articles);
    }

    if (Array.isArray(backup.testimonials)) {
      await Testimonial.deleteMany({});
      await Testimonial.insertMany(backup.testimonials);
    }

    if (Array.isArray(backup.portfolio)) {
      await Portfolio.deleteMany({});
      await Portfolio.insertMany(backup.portfolio);
    }

    if (Array.isArray(backup.leads)) {
      await Lead.deleteMany({});
      await Lead.insertMany(backup.leads);
    }

    if (Array.isArray(backup.media)) {
      await Media.deleteMany({});
      await Media.insertMany(backup.media);
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم استيراد واستعادة النسخة الاحتياطية لقاعدة البيانات بالكامل بنجاح!',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: 'فشل استيراد البيانات: ' + e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
