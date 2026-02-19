"use client";

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface EmailConfig {
  resendApiKey: string;
  senderEmail: string;
  senderName: string;
  domain: string;
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  fromName?: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  sent: number;
  failed: number;
  results?: Array<{ recipient: string; id?: string }>;
  errors?: Array<{ recipient: string; error: string }>;
}

interface UseEmailSenderReturn {
  sendEmail: (params: SendEmailParams) => Promise<SendEmailResult | null>;
  isLoading: boolean;
  error: string | null;
  config: EmailConfig | null;
  refreshConfig: () => void;
}

const DEFAULT_CONFIG: EmailConfig = {
  resendApiKey: '',
  senderEmail: 'noreply@emailsent.com',
  senderName: 'EmailSent',
  domain: 'emailsent.com',
};

export function useEmailSender(): UseEmailSenderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<EmailConfig | null>(null);

  const loadConfig = useCallback(() => {
    try {
      const savedConfig = localStorage.getItem('emailConfig');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch (e) {
      setConfig(DEFAULT_CONFIG);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const sendEmail = useCallback(async (params: SendEmailParams): Promise<SendEmailResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          clientConfig: config,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el email');
      }

      if (data.success) {
        toast.success(`Email enviado exitosamente a ${data.sent} destinatario(s)`);
      } else {
        toast.warning(`Enviado a ${data.sent} destinatario(s), ${data.failed} falló`);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  return { sendEmail, isLoading, error, config, refreshConfig: loadConfig };
}
