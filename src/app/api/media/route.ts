import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import { uploadImage, deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';
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
    const media = await Media.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ status: 'success', media });
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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ status: 'error', message: 'لم يتم اختيار أي ملف للرفع.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const secureUrl = await uploadImage(buffer, file.name);

    const newMedia = await Media.create({
      name: file.name,
      url: secureUrl,
    });

    return NextResponse.json({
      status: 'success',
      message: 'تم رفع الملف بنجاح وحفظه في مكتبة الوسائط!',
      media: newMedia,
    });
  } catch (e: any) {
    console.error('Cloudinary upload route error:', e);
    return NextResponse.json({ status: 'error', message: 'فشل رفع الملف: ' + e.message }, { status: 500 });
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
      return NextResponse.json({ status: 'error', message: 'Media ID is required' }, { status: 400 });
    }

    const mediaItem = await Media.findById(id);
    if (!mediaItem) {
      return NextResponse.json({ status: 'error', message: 'الملف غير موجود في قاعدة البيانات.' }, { status: 404 });
    }

    const publicId = getPublicIdFromUrl(mediaItem.url);
    if (publicId) {
      await deleteImage(publicId);
    }

    await Media.findByIdAndDelete(id);

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف الملف بنجاح من مكتبة الوسائط وكلاودنير.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
