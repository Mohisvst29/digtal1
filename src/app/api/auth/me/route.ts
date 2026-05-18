import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dejatal_secret_key_121';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.id,
        username: decoded.username,
      },
    });
  } catch (e) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
export const dynamic = 'force-dynamic';
