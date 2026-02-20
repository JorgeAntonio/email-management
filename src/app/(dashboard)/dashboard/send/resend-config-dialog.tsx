'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Key, Globe, Save, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Settings } from 'lucide-react';

interface EmailConfig {
  resendApiKey: string;
  senderEmail: string;
  senderName: string;
  domain: string;
}

interface ResendConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResendConfigDialog({ open, onOpenChange }: ResendConfigDialogProps) {
  const [config, setConfig] = useState<EmailConfig>({
    resendApiKey: '',
    senderEmail: 'noreply@bequi.site',
    senderName: 'EmailSent',
    domain: 'bequi.site',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open]);

  const loadConfig = () => {
    try {
      const savedConfig = localStorage.getItem('emailConfig');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (e) {
      console.error('Error loading config:', e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('emailConfig', JSON.stringify(config));
      toast.success('Configuración guardada correctamente');
      onOpenChange(false);
    } catch (_error) {
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
    } catch (_error) {
      setTestResult({ success: false, message: 'Error de conexión' });
      toast.error('Error de conexión');
    } finally {
      setTesting(false);
    }
  };

  const hasConfig = config.resendApiKey && config.senderEmail && config.domain;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Resend
          </DialogTitle>
          <DialogDescription>
            Configura tu API de Resend para enviar emails. Esta configuración es opcional.
          </DialogDescription>
        </DialogHeader>

        {!hasConfig && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            ⚠️ No hay configuración guardada. Por favor configura tu API de Resend para enviar emails.
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="configApiKey" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key de Resend
            </Label>
            <div className="relative">
              <Input
                id="configApiKey"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="configDomain" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Dominio verificado
            </Label>
            <Input
              id="configDomain"
              value={config.domain}
              onChange={(e) => setConfig({ ...config, domain: e.target.value })}
              placeholder="bequi.site"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="configSenderEmail">Email del remitente</Label>
            <Input
              id="configSenderEmail"
              type="email"
              value={config.senderEmail}
              onChange={(e) => setConfig({ ...config, senderEmail: e.target.value })}
              placeholder="noreply@bequi.site"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="configSenderName">Nombre del remitente</Label>
            <Input
              id="configSenderName"
              value={config.senderName}
              onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
              placeholder="EmailSent"
            />
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing || !config.resendApiKey}
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Probar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
