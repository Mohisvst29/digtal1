import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { seedDatabase } from '@/lib/seed';
import Content from '@/models/Content';
import Article from '@/models/Article';
import Testimonial from '@/models/Testimonial';
import Portfolio from '@/models/Portfolio';
import Media from '@/models/Media';
import Lead from '@/models/Lead';
import FAQ from '@/models/FAQ';
import Service from '@/models/Service';
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
    await dbConnect();
    
    // Auto-seed if database is empty on first load
    await seedDatabase();

    // 1. Fetch content table (key-value store)
    const contentRows = await Content.find({});
    const content: Record<string, string> = {};
    contentRows.forEach((row) => {
      content[row.key] = row.value;
    });

    // 2. Fetch articles
    const articles = await Article.find({}).sort({ createdAt: -1 });

    // 3. Fetch testimonials
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });

    // 4. Fetch portfolio
    const portfolio = await Portfolio.find({}).sort({ createdAt: -1 });

    // 5. Fetch media library URLs
    const media = await Media.find({}).sort({ createdAt: -1 });

    // 6. Fetch FAQs
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: 1 });

    // 7. Fetch Services
    const services = await Service.find({}).sort({ order: 1, createdAt: 1 });

    // 8. Fetch leads / consults (STRICTLY FOR LOGGED IN ADMIN ONLY)
    let leads: any[] = [];
    const isAdmin = await checkAdminAuth();
    if (isAdmin) {
      leads = await Lead.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      status: 'success',
      content,
      articles,
      testimonials,
      portfolio,
      media,
      leads,
      faqs,
      services,
    });
  } catch (e: any) {
    console.error('Error fetching site content:', e);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to retrieve website content: ' + e.message,
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized access' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { content } = body;

    if (content && typeof content === 'object') {
      const operations = Object.entries(content).map(([key, value]) => {
        return Content.findOneAndUpdate(
          { key },
          { value: String(value) },
          { upsert: true, new: true }
        );
      });
      await Promise.all(operations);
      
      return NextResponse.json({
        status: 'success',
        message: 'تم حفظ وتزامن إعدادات المحتوى العام للموقع بنجاح!',
      });
    } else {
      return NextResponse.json({ status: 'error', message: 'Invalid data format' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to update content: ' + e.message,
    }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
