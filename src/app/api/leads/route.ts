import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
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
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ status: 'success', leads });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, fullName, phone, email, clientType, specialty, services, budget, referrer, message } = body;
    const finalName = name || fullName;

    if (!finalName || !phone || !email) {
      return NextResponse.json({ status: 'error', message: 'الرجاء ملء الحقول الأساسية: الاسم، الهاتف، والبريد الإلكتروني.' }, { status: 400 });
    }

    await dbConnect();
    const newLead = await Lead.create({
      name: finalName,
      phone,
      email,
      clientType: clientType || '',
      specialty: specialty || '',
      services: Array.isArray(services) ? services : [],
      budget: budget || '',
      referrer: referrer || '',
      message: message || '',
      date: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({
      status: 'success',
      message: 'تم إرسال طلب الاستشارة بنجاح! سيتواصل معك مستشارونا خلال 24 ساعة.',
      lead: newLead,
    });
  } catch (e: any) {
    console.error('Lead insertion error:', e);
    return NextResponse.json({ status: 'error', message: 'حدث خطأ أثناء إرسال طلبك. الرجاء المحاولة لاحقاً.' }, { status: 500 });
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
      return NextResponse.json({ status: 'error', message: 'Lead ID is required' }, { status: 400 });
    }

    const deletedLead = await Lead.findByIdAndDelete(id);
    if (!deletedLead) {
      return NextResponse.json({ status: 'error', message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'تم حذف طلب الاستشارة بنجاح.',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
