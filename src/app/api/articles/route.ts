import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';
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
    const articles = await Article.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ status: 'success', articles });
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
    const { title_ar, title_en, cat_ar, cat_en, image, excerpt_ar, excerpt_en, date } = body;

    if (!title_ar || !title_en) {
      return NextResponse.json({ status: 'error', message: 'عنوان المقال باللغتين العربية والانجليزية مطلوب.' }, { status: 400 });
    }

    const newArticle = await Article.create({
      title_ar,
      title_en,
      cat_ar,
      cat_en,
      image,
      excerpt_ar,
      excerpt_en,
      date: date || new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({
      status: 'success',
      message: 'تم نشر المقال الطبي بنجاح!',
      article: newArticle,
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
    const { id, title_ar, title_en, cat_ar, cat_en, image, excerpt_ar, excerpt_en, date } = body;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Article ID is required' }, { status: 400 });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title_ar, title_en, cat_ar, cat_en, image, excerpt_ar, excerpt_en, date },
      { new: true }
    );

    if (!updatedArticle) {
      return NextResponse.json({ status: 'error', message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم تحديث المقال بنجاح!',
      article: updatedArticle,
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
      return NextResponse.json({ status: 'error', message: 'Article ID is required' }, { status: 400 });
    }

    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return NextResponse.json({ status: 'error', message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف المقال بنجاح.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
