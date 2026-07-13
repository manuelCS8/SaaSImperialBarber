const RESEND_API_URL = 'https://api.resend.com/emails';

export interface EmailNotificationResult {
  provider: 'resend';
  sent: boolean;
  messageId?: string;
  skippedReason?: string;
  error?: string;
}

interface AppointmentEmailData {
  clientName: string;
  clientEmail?: string | null;
  barberName: string;
  appointmentDate: Date;
  services: string[];
}

function getResendConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    fromName: process.env.RESEND_FROM_NAME ?? 'Imperial Barber',
  };
}

function formatAppointmentDate(date: Date): string {
  return date.toLocaleString('es-MX', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

function buildConfirmationHtml(data: AppointmentEmailData): string {
  const services = data.services.join(', ');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #059669;">Cita confirmada — Imperial Barber</h2>
      <p>Hola <strong>${data.clientName}</strong>,</p>
      <p>Tu cita fue confirmada. Estos son los detalles:</p>
      <ul>
        <li><strong>Fecha:</strong> ${formatAppointmentDate(data.appointmentDate)}</li>
        <li><strong>Barbero:</strong> ${data.barberName}</li>
        <li><strong>Servicio(s):</strong> ${services}</li>
      </ul>
      <p>Gracias por confiar en nosotros.</p>
    </div>
  `;
}

export async function sendAppointmentConfirmationEmail(
  data: AppointmentEmailData
): Promise<EmailNotificationResult> {
  const { apiKey, fromEmail, fromName } = getResendConfig();

  if (!apiKey) {
    return {
      provider: 'resend',
      sent: false,
      skippedReason: 'RESEND_API_KEY no configurada',
    };
  }

  if (!data.clientEmail) {
    return {
      provider: 'resend',
      sent: false,
      skippedReason: 'El cliente no tiene correo registrado',
    };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [data.clientEmail],
        subject: 'Tu cita en Imperial Barber fue confirmada',
        html: buildConfirmationHtml(data),
      }),
    });

    const body = (await response.json()) as { id?: string; message?: string };

    if (!response.ok) {
      const hint =
        response.status === 403 &&
        body.message?.includes('verify a domain')
          ? ' Verifica imperialbarber.online en Resend (docs/RESEND-DOMAIN-SETUP.md).'
          : '';
      return {
        provider: 'resend',
        sent: false,
        error: (body.message ?? `Resend respondió con status ${response.status}`) + hint,
      };
    }

    return {
      provider: 'resend',
      sent: true,
      messageId: body.id,
    };
  } catch (error) {
    return {
      provider: 'resend',
      sent: false,
      error: error instanceof Error ? error.message : 'Error al contactar Resend',
    };
  }
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
