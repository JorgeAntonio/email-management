import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resendApiKey, senderEmail, senderName, domain } = body;

    const apiKey = resendApiKey || process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key de Resend no configurada' },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const fromEmail = senderEmail || process.env.SENDER_EMAIL || 'noreply@emailsent.com';
    const fromName = senderName || process.env.SENDER_NAME || 'EmailSent';

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: ['test@resend.dev'],
      subject: 'Test de conexión - EmailSent',
      html: '<p>Si recibes este email, la configuración de Resend es correcta.</p>',
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
