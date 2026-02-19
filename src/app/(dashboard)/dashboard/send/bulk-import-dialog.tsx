'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Upload, FileUp, Users, Check, AlertCircle, X, Download } from 'lucide-react';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (emails: string[]) => void;
}

export function BulkImportDialog({ open, onOpenChange, onImport }: BulkImportDialogProps) {
  const [inputText, setInputText] = useState('');
  const [parsedEmails, setParsedEmails] = useState<{ email: string; valid: boolean }[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Parsear emails del texto
  const parseEmails = useCallback(() => {
    setIsParsing(true);
    
    // Separar por líneas, comas, punto y coma, o espacios
    const separators = /[,;\n\s]+/;
    const rawEmails = inputText.split(separators).map(e => e.trim()).filter(e => e);
    
    // Validar cada email
    const parsed = rawEmails.map(email => ({
      email: email.toLowerCase(),
      valid: isValidEmail(email),
    }));

    setParsedEmails(parsed);
    setIsParsing(false);

    const validCount = parsed.filter(p => p.valid).length;
    const invalidCount = parsed.filter(p => !p.valid).length;

    if (parsed.length === 0) {
      toast.error('No se encontraron emails en el texto');
    } else {
      toast.success(`${validCount} emails válidos encontrados${invalidCount > 0 ? `, ${invalidCount} inválidos` : ''}`);
    }
  }, [inputText]);

  // Importar emails válidos
  const handleImport = () => {
    const validEmails = parsedEmails.filter(p => p.valid).map(p => p.email);
    
    if (validEmails.length === 0) {
      toast.error('No hay emails válidos para importar');
      return;
    }

    onImport(validEmails);
    toast.success(`${validEmails.length} emails importados`);
    setInputText('');
    setParsedEmails([]);
    onOpenChange(false);
  };

  // Cargar archivo CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      toast.success('Archivo cargado. Haz clic en "Analizar" para procesar.');
    };
    reader.readAsText(file);
  };

  // Descargar template CSV
  const downloadTemplate = () => {
    const template = 'email,nombre\nejemplo1@correo.com,Juan\nejemplo2@correo.com,Maria\nejemplo3@correo.com,Pedro';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_emails.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template descargado');
  };

  const validCount = parsedEmails.filter(p => p.valid).length;
  const invalidCount = parsedEmails.filter(p => !p.valid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            Importar Emails Masivamente
          </DialogTitle>
          <DialogDescription>
            Pega una lista de emails o carga un archivo CSV. Separa los emails por comas, punto y coma o saltos de línea.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Input de texto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Lista de emails</label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Cargar CSV
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Template
                </Button>
              </div>
            </div>
            <Textarea
              placeholder={`ejemplo1@correo.com
 ejemplo2@correo.com, ejemplo3@correo.com
 ejemplo4@correo.com; ejemplo5@correo.com`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
            <p className="text-xs text-slate-500">
              Puedes separar emails por comas, punto y coma, espacios o saltos de línea
            </p>
          </div>

          {/* Botón analizar */}
          <Button
            onClick={parseEmails}
            disabled={!inputText.trim() || isParsing}
            className="w-full"
          >
            {isParsing ? (
              <>
                <Users className="h-4 w-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Analizar Emails
              </>
            )}
          </Button>

          {/* Resultados del análisis */}
          {parsedEmails.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Resultados del análisis</h4>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    <Check className="h-3 w-3 mr-1" />
                    {validCount} válidos
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {invalidCount} inválidos
                    </Badge>
                  )}
                </div>
              </div>

              <ScrollArea className="h-[200px] border rounded-md">
                <div className="p-2 space-y-1">
                  {parsedEmails.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        item.valid ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <span className={item.valid ? 'text-green-900' : 'text-red-900'}>
                        {item.email}
                      </span>
                      {item.valid ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setInputText('');
                setParsedEmails([]);
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={validCount === 0}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar {validCount > 0 && `(${validCount})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
