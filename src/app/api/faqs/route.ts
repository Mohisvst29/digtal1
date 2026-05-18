import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
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
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ status: 'success', faqs });
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
    const { question_ar, question_en, answer_ar, answer_en, order } = body;

    if (!question_ar || !question_en || !answer_ar || !answer_en) {
      return NextResponse.json({ status: 'error', message: 'الرجاء ملء جميع حقول السؤال والجواب باللغتين العربية والإنجليزية.' }, { status: 400 });
    }

    const newFAQ = await FAQ.create({
      question_ar,
      question_en,
      answer_ar,
      answer_en,
      order: Number(order) || 0,
    });

    return NextResponse.json({
      status: 'success',
      message: 'تم إضافة السؤال الشائع بنجاح!',
      faq: newFAQ,
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
    const { id, question_ar, question_en, answer_ar, answer_en, order } = body;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'FAQ ID is required' }, { status: 400 });
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question_ar, question_en, answer_ar, answer_en, order: Number(order) || 0 },
      { new: true }
    );

    if (!updatedFAQ) {
      return NextResponse.json({ status: 'error', message: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم تحديث السؤال الشائع بنجاح!',
      faq: updatedFAQ,
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
      return NextResponse.json({ status: 'error', message: 'FAQ ID is required' }, { status: 400 });
    }

    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    if (!deletedFAQ) {
      return NextResponse.json({ status: 'error', message: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف السؤال الشائع بنجاح.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
