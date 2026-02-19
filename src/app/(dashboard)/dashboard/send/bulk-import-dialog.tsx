'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Upload, FileUp, Users, Check, AlertCircle, X, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (emails: string[]) => void;
}

export function BulkImportDialog({ open, onOpenChange, onImport }: BulkImportDialogProps) {
  const [inputText, setInputText] = useState('');
  const [parsedEmails, setParsedEmails] = useState<{ email: string; valid: boolean }[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'paste' | 'api'>('paste');

  // API import state
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiHeadersText, setApiHeadersText] = useState(''); // key: value per line
  const [apiBody, setApiBody] = useState('');
  const [apiListPath, setApiListPath] = useState('data'); // path to array in response
  const [apiEmailKey, setApiEmailKey] = useState('email');
  const [apiNameKey, setApiNameKey] = useState('name');
  const [isFetchingApi, setIsFetchingApi] = useState(false);
  const [apiParsed, setApiParsed] = useState<{ email: string; name?: string; valid: boolean }[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

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

  // Helper: resolve nested path like 'data.recipients' on an object
  const resolvePath = (obj: any, path: string) => {
    if (!path) return undefined;
    const parts = path.split('.').filter(Boolean);
    let cur: any = obj;
    for (const part of parts) {
      if (cur === undefined || cur === null) return undefined;
      cur = cur[part];
    }
    return cur;
  };

  const parseHeaders = (text: string) => {
    const headers: Record<string, string> = {};
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    for (const line of lines) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key) headers[key] = value;
    }
    return headers;
  };

  // Fetch preview from API and parse list
  const fetchApiPreview = async () => {
    if (!apiUrl) {
      setApiError('Proporciona una URL de API');
      return;
    }

    setIsFetchingApi(true);
    setApiError(null);
    setApiParsed([]);

    try {
      const headers = parseHeaders(apiHeadersText);
      const opts: RequestInit = { method: apiMethod, headers };
      if (apiMethod === 'POST' && apiBody) {
        // try to parse as JSON, otherwise send as text
        try {
          opts.body = JSON.stringify(JSON.parse(apiBody));
          opts.headers = { ...headers, 'Content-Type': 'application/json' };
        } catch (e) {
          opts.body = apiBody;
        }
      }

      const res = await fetch(apiUrl, opts);
      const data = await res.json();

      // extract list
      const list = resolvePath(data, apiListPath) ?? data;
      if (!Array.isArray(list)) {
        setApiError('La ruta especificada no apunta a una lista/array en la respuesta');
        setIsFetchingApi(false);
        return;
      }

      const parsed = list.map((item: any) => {
        const emailVal = resolvePath(item, apiEmailKey) ?? '';
        const nameVal = resolvePath(item, apiNameKey) ?? '';
        const email = String(emailVal || '').toLowerCase();
        return { email, name: String(nameVal || ''), valid: isValidEmail(email) };
      });

      setApiParsed(parsed);
      const good = parsed.filter(p => p.valid).length;
      const bad = parsed.filter(p => !p.valid).length;
      toast.success(`Preview: ${good} válidos${bad > 0 ? `, ${bad} inválidos` : ''}`);
    } catch (err: any) {
      console.error(err);
      setApiError(String(err?.message ?? err));
      toast.error('Error al obtener la muestra desde la API');
    } finally {
      setIsFetchingApi(false);
    }
  };

  // Importar emails válidos (soporta pestaña de API)
  const handleImport = () => {
    const validEmails = activeTab === 'api'
      ? apiParsed.filter(p => p.valid).map(p => p.email)
      : parsedEmails.filter(p => p.valid).map(p => p.email);

    if (validEmails.length === 0) {
      toast.error('No hay emails válidos para importar');
      return;
    }

    onImport(validEmails);
    toast.success(`${validEmails.length} emails importados`);

    // limpiar estado correspondiente
    setInputText('');
    setParsedEmails([]);
    setApiParsed([]);
    setApiError(null);
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
  const validApiCount = apiParsed.filter(p => p.valid).length;
  const invalidApiCount = apiParsed.filter(p => !p.valid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Importar Emails Masivamente
          </DialogTitle>
          <DialogDescription>
            Pega una lista de emails, carga un CSV o importa desde una API. Separa los emails por comas, punto y coma o saltos de línea.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <Button variant={activeTab === 'paste' ? undefined : 'ghost'} size="sm" onClick={() => setActiveTab('paste')}>
              Pegar / CSV
            </Button>
            <Button variant={activeTab === 'api' ? undefined : 'ghost'} size="sm" onClick={() => setActiveTab('api')}>
              Importar desde API
            </Button>
          </div>
          {/* Input de texto */}
          {activeTab === 'paste' && (
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
          )}

          {/* API import */}
          {activeTab === 'api' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="https://api.example.com/list" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
                <div className="flex gap-2">
                  <select className="w-32 rounded-md border px-2" value={apiMethod} onChange={(e) => setApiMethod(e.target.value as any)}>
                    <option>GET</option>
                    <option>POST</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={() => { setApiHeadersText('# Header por línea: Authorization: Bearer TOKEN'); }}>
                    Ejemplo Headers
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Textarea placeholder={`Authorization: Bearer TOKEN`} value={apiHeadersText} onChange={(e) => setApiHeadersText(e.target.value)} className="min-h-[80px] text-sm" />
                <Textarea placeholder={`{ "page": 1 }`} value={apiBody} onChange={(e) => setApiBody(e.target.value)} className="min-h-[80px] text-sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Ruta a lista en respuesta (ej. data.items)" value={apiListPath} onChange={(e) => setApiListPath(e.target.value)} />
                <Input placeholder="Clave email en cada item (ej. email)" value={apiEmailKey} onChange={(e) => setApiEmailKey(e.target.value)} />
                <Input placeholder="Clave nombre en cada item (ej. name)" value={apiNameKey} onChange={(e) => setApiNameKey(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <Button onClick={fetchApiPreview} disabled={isFetchingApi}>
                  {isFetchingApi ? 'Obteniendo muestra...' : 'Obtener muestra'}
                </Button>
                <Button variant="ghost" onClick={() => { setApiUrl(''); setApiHeadersText(''); setApiBody(''); setApiParsed([]); setApiError(null); }}>
                  Limpiar
                </Button>
              </div>

              {apiError && <p className="text-sm text-red-600">{apiError}</p>}

              {apiParsed.length > 0 && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Resultados de la API</h4>
                    <div className="flex gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        <Check className="h-3 w-3 mr-1" />
                        {validApiCount} válidos
                      </Badge>
                      {invalidApiCount > 0 && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {invalidApiCount} inválidos
                        </Badge>
                      )}
                    </div>
                  </div>

                  <ScrollArea className="h-[200px] border rounded-md">
                    <div className="p-2 space-y-1">
                      {apiParsed.slice(0, 200).map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            item.valid ? 'bg-green-50' : 'bg-red-50'
                          }`}
                        >
                          <div>
                            <div className={item.valid ? 'text-green-900' : 'text-red-900'}>{item.email}</div>
                            {item.name && <div className="text-xs text-slate-500">{item.name}</div>}
                          </div>
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
            </div>
          )}

          {/* Paste tab actions */}
          {activeTab === 'paste' && (
            <>
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
            </>
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
              disabled={activeTab === 'api' ? validApiCount === 0 : validCount === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar {activeTab === 'api' ? (validApiCount > 0 ? `(${validApiCount})` : '') : (validCount > 0 ? `(${validCount})` : '')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
