import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
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

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized access' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { username, currentPassword, newPassword } = body;

    if (!username || !newPassword) {
      return NextResponse.json({ status: 'error', message: 'اسم المستخدم وكلمة المرور الجديدة مطلوبان.' }, { status: 400 });
    }

    const user = await User.findOne({});
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'Admin user not found' }, { status: 404 });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ status: 'error', message: 'كلمة المرور الحالية غير صحيحة.' }, { status: 400 });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.username = username;
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      status: 'success',
      message: 'تم تحديث بيانات تسجيل الدخول للمشرف بنجاح!',
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
