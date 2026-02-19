'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSubmitted(true);
      toast.success('Se ha enviado un enlace de recuperación a tu correo');
    } catch (error) {
      toast.error('Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Correo enviado</CardTitle>
          <CardDescription>
            Revisa tu bandeja de entrada para continuar con la recuperación de tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Volver al inicio de sesión
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </Button>
          <a
            href="/login"
            className="block text-center text-sm text-muted-foreground hover:text-primary"
          >
            Volver al inicio de sesión
          </a>
        </form>
      </CardContent>
    </Card>
  );
}
