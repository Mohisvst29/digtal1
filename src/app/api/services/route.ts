import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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
    const services = await Service.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ status: 'success', services });
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
    const { 
      slug, icon, colSpan, order, tags_ar, tags_en,
      title_ar, title_en, desc_ar, desc_en, tag_ar, tag_en, btnText_ar, btnText_en,
      benefitTitle_ar, benefitTitle_en, benefitDesc_ar, benefitDesc_en, benefits,
      strategyTitle_ar, strategyTitle_en, strategies,
      extraType, extraData_ar, extraData_en
    } = body;

    if (!slug || !title_ar || !title_en || !desc_ar || !desc_en) {
      return NextResponse.json({ status: 'error', message: 'الرابط التعريفي والعنوان والوصف باللغتين مطلوبين.' }, { status: 400 });
    }

    // Check if slug is unique
    const existing = await Service.findOne({ slug });
    if (existing) {
      return NextResponse.json({ status: 'error', message: 'الرابط التعريفي للخدمة (slug) مستخدم بالفعل. يرجى اختيار رابط مميز آخر.' }, { status: 400 });
    }

    const newService = await Service.create({
      slug, icon: icon || 'fingerprint', colSpan: colSpan || 'md:col-span-6', order: Number(order) || 0,
      tags_ar: tags_ar || [], tags_en: tags_en || [],
      title_ar, title_en, desc_ar, desc_en, tag_ar: tag_ar || '', tag_en: tag_en || '', btnText_ar: btnText_ar || '', btnText_en: btnText_en || '',
      benefitTitle_ar: benefitTitle_ar || '', benefitTitle_en: benefitTitle_en || '', benefitDesc_ar: benefitDesc_ar || '', benefitDesc_en: benefitDesc_en || '',
      benefits: benefits || [],
      strategyTitle_ar: strategyTitle_ar || '', strategyTitle_en: strategyTitle_en || '',
      strategies: strategies || [],
      extraType: extraType || '', extraData_ar: extraData_ar || null, extraData_en: extraData_en || null
    });

    return NextResponse.json({
      status: 'success',
      message: 'تم إضافة الخدمة الطبية بنجاح!',
      service: newService,
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
    const { 
      id, slug, icon, colSpan, order, tags_ar, tags_en,
      title_ar, title_en, desc_ar, desc_en, tag_ar, tag_en, btnText_ar, btnText_en,
      benefitTitle_ar, benefitTitle_en, benefitDesc_ar, benefitDesc_en, benefits,
      strategyTitle_ar, strategyTitle_en, strategies,
      extraType, extraData_ar, extraData_en
    } = body;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Service ID is required' }, { status: 400 });
    }

    // Check slug uniqueness excluding self
    if (slug) {
      const existing = await Service.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ status: 'error', message: 'الرابط التعريفي للخدمة (slug) مستخدم بالفعل في خدمة أخرى.' }, { status: 400 });
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { 
        slug, icon, colSpan, order: Number(order) || 0, tags_ar, tags_en,
        title_ar, title_en, desc_ar, desc_en, tag_ar, tag_en, btnText_ar, btnText_en,
        benefitTitle_ar, benefitTitle_en, benefitDesc_ar, benefitDesc_en, benefits,
        strategyTitle_ar, strategyTitle_en, strategies,
        extraType, extraData_ar, extraData_en
      },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json({ status: 'error', message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم تحديث الخدمة الطبية بنجاح!',
      service: updatedService,
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
      return NextResponse.json({ status: 'error', message: 'Service ID is required' }, { status: 400 });
    }

    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return NextResponse.json({ status: 'error', message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف الخدمة بنجاح.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
