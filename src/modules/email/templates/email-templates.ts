export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'newsletter' | 'promotional' | 'transactional' | 'welcome';
  thumbnail?: string;
  html: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'blank',
    name: 'En Blanco',
    description: 'Comienza desde cero con un template limpio',
    category: 'basic',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0;">Hola {{nombre}}</h1>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0;">
                Escribe tu mensaje aquí...
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Diseño limpio y moderno con enfoque en el contenido',
    category: 'basic',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #fafafa; color: #2c2c2c;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table role="presentation" style="width: 100%; max-width: 560px; border-collapse: collapse; background-color: #ffffff;">
          <tr>
            <td style="padding: 48px 40px;">
              <p style="color: #666; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 24px 0;">{{fecha}}</p>
              <h1 style="color: #1a1a1a; font-size: 32px; font-weight: 400; line-height: 1.3; margin: 0 0 24px 0; letter-spacing: -0.5px;">{{asunto}}</h1>
              <div style="width: 40px; height: 2px; background-color: #e0e0e0; margin: 32px 0;"></div>
              <p style="color: #4a4a4a; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                Hola {{nombre}},
              </p>
              <p style="color: #4a4a4a; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                Tu mensaje va aquí. Este template minimalista pone el foco completamente en tu contenido.
              </p>
              <p style="color: #4a4a4a; font-size: 17px; line-height: 1.8; margin: 0;">
                Saludos cordiales,<br>
                <strong style="color: #1a1a1a;">El equipo</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f0f0f0;">
              <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                © 2026 BEQUI. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
  {
    id: 'newsletter-modern',
    name: 'Newsletter Moderno',
    description: 'Perfecto para boletines informativos y actualizaciones',
    category: 'newsletter',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 3px;">NEWSLETTER</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; letter-spacing: 1px;">{{mes}} {{año}}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Hola {{nombre}} 👋</h2>
              <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                Bienvenido a nuestra edición de este mes. Tenemos actualizaciones emocionantes para compartir contigo.
              </p>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td style="background-color: #f7fafc; border-radius: 12px; padding: 24px; border-left: 4px solid #667eea;">
                    <h3 style="color: #2d3748; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">🚀 Novedad Destacada</h3>
                    <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0;">
                      Descripción de tu novedad o actualización importante aquí.
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td style="background-color: #f7fafc; border-radius: 12px; padding: 24px; border-left: 4px solid #764ba2;">
                    <h3 style="color: #2d3748; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">📊 Estadísticas</h3>
                    <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0;">
                      Comparte datos interesantes o métricas relevantes.
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" style="width: 100%; margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">Ver Más Contenido</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f7fafc; padding: 24px 40px; text-align: center;">
              <p style="color: #718096; font-size: 13px; margin: 0 0 8px 0;">
                ¿Tienes preguntas? Responde a este correo
              </p>
              <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                © 2026 BEQUI. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
  {
    id: 'promo-card',
    name: 'Promoción Tarjeta',
    description: 'Destaca tus ofertas y promociones especiales',
    category: 'promotional',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f0f0f;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%); border-radius: 24px; overflow: hidden;">
          <tr>
            <td style="padding: 48px 40px; text-align: center; background: radial-gradient(ellipse at top, rgba(255,215,0,0.1) 0%, transparent 50%);">
              <span style="display: inline-block; background-color: #ffd700; color: #1a1a2e; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px;">Oferta Especial</span>
              <h1 style="color: #ffffff; font-size: 42px; font-weight: 800; margin: 0 0 16px 0; text-shadow: 0 2px 20px rgba(255,215,0,0.3);">50% OFF</h1>
              <p style="color: #a0a0a0; font-size: 18px; margin: 0 0 32px 0;">En tu próxima compra</p>
              <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,215,0,0.3); border-radius: 16px; padding: 32px; margin: 24px 0;">
                <p style="color: #ffd700; font-size: 14px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 16px 0;">Código de Descuento</p>
                <p style="color: #ffffff; font-size: 32px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 4px; margin: 0;">BEQUI50</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <p style="color: #c0c0c0; font-size: 16px; line-height: 1.7; text-align: center; margin: 0 0 32px 0;">
                Hola {{nombre}},<br><br>
                No dejes pasar esta oportunidad única. Válido hasta el {{fecha_limite}}.
              </p>
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%); color: #1a1a2e; text-decoration: none; padding: 18px 48px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 20px rgba(255,215,0,0.4); text-transform: uppercase; letter-spacing: 1px;">Aprovechar Ahora</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © 2026 BEQUI. Promoción sujeta a términos y condiciones.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
  {
    id: 'welcome-clean',
    name: 'Bienvenida Limpia',
    description: 'Recibe a nuevos usuarios con estilo',
    category: 'welcome',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <tr>
            <td style="padding: 60px 40px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #ffffff; font-size: 36px;">👋</span>
              </div>
              <h1 style="color: #1a1a1a; font-size: 36px; font-weight: 700; margin: 0 0 16px 0;">¡Bienvenido {{nombre}}!</h1>
              <p style="color: #666; font-size: 18px; line-height: 1.6; margin: 0 0 40px 0;">
                Estamos emocionados de tenerte con nosotros. Prepárate para una experiencia increíble.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 24px; background-color: #f8f9fa; border-radius: 12px; margin-bottom: 16px;">
                    <h3 style="color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">✨ Primer paso</h3>
                    <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0;">Completa tu perfil para personalizar tu experiencia.</p>
                  </td>
                </tr>
                <tr><td style="height: 16px;"></td></tr>
                <tr>
                  <td style="padding: 24px; background-color: #f8f9fa; border-radius: 12px;">
                    <h3 style="color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">🚀 Explora</h3>
                    <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0;">Descubre todas las funcionalidades disponibles.</p>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" style="width: 100%; margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Comenzar Ahora</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                ¿Necesitas ayuda? Escríbenos a <a href="mailto:soporte@bequi.site" style="color: #667eea; text-decoration: none;">soporte@bequi.site</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
  {
    id: 'transactional-receipt',
    name: 'Recibo Transaccional',
    description: 'Confirmaciones de pago y transacciones',
    category: 'transactional',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 560px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid #e8eaed;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 20px; font-weight: 700; color: #1a1a1a;">BEQUI</span>
                <span style="font-size: 13px; color: #00c853; font-weight: 600; background-color: rgba(0,200,83,0.1); padding: 6px 12px; border-radius: 4px;">✓ Completado</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">Confirmación de Transacción</h1>
              <p style="color: #666; font-size: 14px; margin: 0 0 32px 0;">Transacción #{{transaccion_id}} • {{fecha}}</p>
              
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Hola {{nombre}},<br>
                Hemos procesado exitosamente tu transacción.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f8f9fa; border-radius: 6px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px;">Concepto</td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right; font-weight: 500;">{{concepto}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666; font-size: 14px; border-top: 1px solid #e8eaed;">Método de pago</td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px; text-align: right; font-weight: 500; border-top: 1px solid #e8eaed;">{{metodo_pago}}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 8px; color: #1a1a1a; font-size: 16px; font-weight: 600; border-top: 2px solid #1a1a1a;">Total</td>
                        <td style="padding: 12px 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 700; text-align: right; border-top: 2px solid #1a1a1a;">{{monto}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0;">
                Guarda este correo como comprobante. Si tienes alguna pregunta, contacta a nuestro equipo de soporte.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                © 2026 BEQUI. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
];

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return emailTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: EmailTemplate['category']): EmailTemplate[] => {
  return emailTemplates.filter(template => template.category === category);
};
