import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
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

export async function GET(request: Request) {
  try {
    await dbConnect();
    const doctors = await Doctor.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ status: 'success', doctors });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth())) return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const data = await request.json();
    const doctor = await Doctor.create(data);
    return NextResponse.json({ status: 'success', doctor });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await checkAdminAuth())) return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const data = await request.json();
    const doctor = await Doctor.findByIdAndUpdate(data.id, data, { new: true });
    return NextResponse.json({ status: 'success', doctor });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAdminAuth())) return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await Doctor.findByIdAndDelete(id);
    return NextResponse.json({ status: 'success' });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
