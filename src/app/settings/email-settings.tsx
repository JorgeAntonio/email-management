'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Key, Globe, Save, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EmailConfig {
  resendApiKey: string;
  senderEmail: string;
  senderName: string;
  domain: string;
}

const DEFAULT_CONFIG: EmailConfig = {
  resendApiKey: '',
  senderEmail: 'noreply@emailsent.com',
  senderName: 'EmailSent',
  domain: 'emailsent.com',
};

export function EmailSettings() {
  const [config, setConfig] = useState<EmailConfig>(DEFAULT_CONFIG);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('emailConfig', JSON.stringify(config));
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/send/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setTestResult({ success: true, message: 'Conexión exitosa con Resend' });
        toast.success('Conexión exitosa');
      } else {
        setTestResult({ success: false, message: data.error || 'Error al conectar con Resend' });
        toast.error(data.error || 'Error al conectar');
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Error de conexión' });
      toast.error('Error de conexión');
    } finally {
      setTesting(false);
    }
  };

  const loadFromEnv = () => {
    const envApiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY || '';
    const envDomain = process.env.NEXT_PUBLIC_SENDER_DOMAIN || 'emailsent.com';
    const envSenderEmail = process.env.NEXT_PUBLIC_SENDER_EMAIL || 'noreply@emailsent.com';
    const envSenderName = process.env.NEXT_PUBLIC_SENDER_NAME || 'EmailSent';
    
    setConfig(prev => ({
      ...prev,
      resendApiKey: envApiKey || prev.resendApiKey,
      domain: envDomain,
      senderEmail: envSenderEmail,
      senderName: envSenderName,
    }));
    
    if (envApiKey) {
      toast.success('Configuración cargada desde .env');
    } else {
      toast.warning('No hay variables de entorno configuradas');
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Configuración de Email</CardTitle>
            <CardDescription>
              Configura la API de Resend y el dominio para enviar emails
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Nota:</strong> Para producción, configura las variables de entorno en tu archivo .env.local.
            Las opciones aquí te permiten probar sin modificar el código.
          </p>
        </div>

        <Button variant="outline" onClick={loadFromEnv} className="w-full">
          Cargar configuración desde .env
        </Button>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key de Resend
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={config.resendApiKey}
                onChange={(e) => setConfig({ ...config, resendApiKey: e.target.value })}
                placeholder="re_123456789..."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Obtén tu API key en resend.com/api-keys
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Dominio verificado
            </Label>
            <Input
              id="domain"
              value={config.domain}
              onChange={(e) => setConfig({ ...config, domain: e.target.value })}
              placeholder="emailsent.com"
            />
            <p className="text-xs text-muted-foreground">
              El dominio que has verificado en Resend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email del remitente</Label>
              <Input
                id="senderEmail"
                type="email"
                value={config.senderEmail}
                onChange={(e) => setConfig({ ...config, senderEmail: e.target.value })}
                placeholder="noreply@emailsent.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderName">Nombre del remitente</Label>
              <Input
                id="senderName"
                value={config.senderName}
                onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                placeholder="EmailSent"
              />
            </div>
          </div>
        </div>

        {testResult && (
          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {testResult.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing || !config.resendApiKey}
            className="flex-1"
          >
            {testing ? 'Probando...' : 'Probar conexión'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Guardar configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
