import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dejatal_secret_key_121';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ status: 'error', message: 'الرجاء إدخال اسم المستخدم وكلمة المرور' }, { status: 400 });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ status: 'error', message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    return NextResponse.json({
      status: 'success',
      message: 'تم تسجيل الدخول بنجاح! جاري تحويلك لوحة التحكم...',
      user: { id: user._id, username: user.username },
    });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e.message }, { status: 500 });
  }
}
