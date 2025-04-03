import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { generateVerificationCode, storeVerificationCode } from '@/lib/verification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const verificationCode = generateVerificationCode();
    storeVerificationCode(email, verificationCode);

    const { data, error } = await resend.emails.send({
      from: 'TechStore <noreply@techstore.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Email Verification</h1>
          <p>Thank you for verifying your email address. Please use the following code to complete your verification:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px; margin: 0;">${verificationCode}</h2>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 