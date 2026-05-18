import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';
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
    const portfolio = await Portfolio.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ status: 'success', portfolio });
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
    const { title_ar, title_en, cat_ar, cat_en, metric_ar, metric_en, image } = body;

    if (!title_ar || !title_en) {
      return NextResponse.json({ status: 'error', message: 'عنوان دراسة الحالة باللغتين مطلوب.' }, { status: 400 });
    }

    const newPortfolio = await Portfolio.create({
      title_ar,
      title_en,
      cat_ar: cat_ar || '',
      cat_en: cat_en || '',
      metric_ar: metric_ar || '',
      metric_en: metric_en || '',
      image: image || '',
    });

    return NextResponse.json({
      status: 'success',
      message: 'تمت إضافة دراسة الحالة بنجاح!',
      portfolio: newPortfolio,
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
    const { id, title_ar, title_en, cat_ar, cat_en, metric_ar, metric_en, image } = body;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Portfolio ID is required' }, { status: 400 });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      { title_ar, title_en, cat_ar, cat_en, metric_ar, metric_en, image },
      { new: true }
    );

    if (!updatedPortfolio) {
      return NextResponse.json({ status: 'error', message: 'Portfolio item not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم تحديث دراسة الحالة بنجاح!',
      portfolio: updatedPortfolio,
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
      return NextResponse.json({ status: 'error', message: 'Portfolio ID is required' }, { status: 400 });
    }

    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
    if (!deletedPortfolio) {
      return NextResponse.json({ status: 'error', message: 'Portfolio item not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف دراسة الحالة بنجاح.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
