import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
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
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ status: 'success', testimonials });
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
    const body = await request.json();
    const { name_ar, name_en, title_ar, title_en, quote_ar, quote_en, image } = body;

    if (!name_ar || !quote_ar) {
      return NextResponse.json({ status: 'error', message: 'اسم صاحب التقييم ونص التقييم باللغة العربية مطلوب.' }, { status: 400 });
    }

    const newTestimonial = await Testimonial.create({
      name_ar,
      name_en: name_en || '',
      title_ar: title_ar || '',
      title_en: title_en || '',
      quote_ar,
      quote_en: quote_en || '',
      image: image || '',
    });

    return NextResponse.json({
      status: 'success',
      message: 'تمت إضافة التقييم بنجاح!',
      testimonial: newTestimonial,
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
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
    const { id, name_ar, name_en, title_ar, title_en, quote_ar, quote_en, image } = body;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Testimonial ID is required' }, { status: 400 });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name_ar, name_en, title_ar, title_en, quote_ar, quote_en, image },
      { new: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json({ status: 'error', message: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم تحديث التقييم بنجاح!',
      testimonial: updatedTestimonial,
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized access' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Testimonial ID is required' }, { status: 400 });
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      return NextResponse.json({ status: 'error', message: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف التقييم بنجاح.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
