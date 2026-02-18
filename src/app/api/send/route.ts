import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'bequi.site';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'BEQUI';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, fromName, replyTo } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: to, subject, html' },
        { status: 400 }
      );
    }

    const recipients = Array.isArray(to) ? to : [to];
    
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Debe especificar al menos un destinatario' },
        { status: 400 }
      );
    }

    const from = `${fromName || FROM_NAME} <onboarding@${FROM_EMAIL}>`;

    const results = [];
    const errors = [];

    for (const recipient of recipients) {
      try {
        const { data, error } = await resend.emails.send({
          from,
          to: recipient,
          subject,
          html,
          replyTo: replyTo || undefined,
        });

        if (error) {
          errors.push({ recipient, error: error.message });
        } else {
          results.push({ recipient, id: data?.id });
        }
      } catch (err) {
        errors.push({ 
          recipient, 
          error: err instanceof Error ? err.message : 'Error desconocido' 
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      sent: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error interno al enviar el email' },
      { status: 500 }
    );
  }
}
