import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    // 1. Check if the request body is actually readable
    const body = await req.json().catch(() => ({}));
    
    // 2. Log to your terminal so you can see the data arrive
    console.log("Backend received data:", body.email);

    // 3. Handle the Secret (with a fallback to prevent the 500 crash)
    const secret = process.env.JWT_SECRET || "temporary_test_secret_123";

    // 4. Create the token
    const token = jwt.sign(
      { email: body.email, name: body.name },
      secret,
      { expiresIn: '7d' }
    );

    // 5. Success response
    return NextResponse.json({
      success: true,
      data: token,
      user: { 
        email: body.email, 
        name: body.name, 
        picture: body.picture 
      }
    }, { status: 200 });

  } catch (err) {
    // THIS LINE PRINTS THE REAL ERROR IN YOUR TERMINAL
    console.error("CRITICAL SERVER ERROR:", err);

    // THIS LINE SENDS THE REAL ERROR TO YOUR BROWSER
    return NextResponse.json({ 
      success: false, 
      message: err.message,
      stack: err.stack 
    }, { status: 500 });
  }
}