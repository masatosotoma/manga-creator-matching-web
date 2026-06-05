import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Check credentials as requested
    if (email === 'masatosotoma@gmail.com' && password === 'masatosotoma') {
      return NextResponse.json({ 
        ok: true, 
        token: 'mock-admin-token-12345',
        user: { email, role: 'admin' }
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid email or password' }, 
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request' }, 
      { status: 400 }
    );
  }
}
