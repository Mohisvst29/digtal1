import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Clinic from '@/models/Clinic';
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
    const clinics = await Clinic.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ status: 'success', clinics });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth())) return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const data = await request.json();
    const clinic = await Clinic.create(data);
    return NextResponse.json({ status: 'success', clinic });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await checkAdminAuth())) return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const data = await request.json();
    const clinic = await Clinic.findByIdAndUpdate(data.id, data, { new: true });
    return NextResponse.json({ status: 'success', clinic });
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
    await Clinic.findByIdAndDelete(id);
    return NextResponse.json({ status: 'success' });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
