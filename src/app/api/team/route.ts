import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
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
    const members = await TeamMember.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ status: 'success', members });
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
    const { name_ar, name_en, role_ar, role_en, image_url, order } = body;

    if (!name_ar || !name_en || !role_ar || !role_en) {
      return NextResponse.json({ status: 'error', message: 'الرجاء ملء جميع حقول الاسم والمنصب باللغتين العربية والإنجليزية.' }, { status: 400 });
    }

    const newMember = await TeamMember.create({
      name_ar,
      name_en,
      role_ar,
      role_en,
      image_url: image_url || '',
      order: Number(order) || 0,
    });

    return NextResponse.json({
      status: 'success',
      message: 'تم إضافة عضو الفريق بنجاح!',
      member: newMember,
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
    const { id, name_ar, name_en, role_ar, role_en, image_url, order } = body;

    if (!id) {
      return NextResponse.json({ status: 'error', message: 'Team member ID is required' }, { status: 400 });
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      { name_ar, name_en, role_ar, role_en, image_url: image_url || '', order: Number(order) || 0 },
      { new: true }
    );

    if (!updatedMember) {
      return NextResponse.json({ status: 'error', message: 'عضو الفريق غير موجود.' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم تحديث بيانات عضو الفريق بنجاح!',
      member: updatedMember,
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
      return NextResponse.json({ status: 'error', message: 'Team member ID is required' }, { status: 400 });
    }

    const deletedMember = await TeamMember.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json({ status: 'error', message: 'عضو الفريق غير موجود.' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف عضو الفريق بنجاح.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
