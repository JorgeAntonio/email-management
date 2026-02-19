import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_FROM_EMAIL = process.env.SENDER_EMAIL || 'noreply@emailsent.com';
const DEFAULT_FROM_NAME = process.env.SENDER_NAME || 'EmailSent';
const DEFAULT_DOMAIN = process.env.SENDER_DOMAIN || 'emailsent.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, replyTo, clientConfig } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: to, subject, html' },
        { status: 400 }
      );
    }

    const apiKey = clientConfig?.resendApiKey || process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key de Resend no configurada. Configúrala en Settings.' },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const fromName = clientConfig?.senderName || DEFAULT_FROM_NAME;
    const fromEmail = clientConfig?.senderEmail || DEFAULT_FROM_EMAIL;
    const domain = clientConfig?.domain || DEFAULT_DOMAIN;
    
    const from = `${fromName} <${fromEmail}>`;

    const recipients = Array.isArray(to) ? to : [to];
    
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'Debe especificar al menos un destinatario' },
        { status: 400 }
      );
    }

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
