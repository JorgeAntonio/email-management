'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Upload, FileUp, Users, Check, AlertCircle, Download, Search, Eye, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (emails: string[]) => void;
}

interface DetectedArray {
  path: string;
  name: string;
  count: number;
  sample: Record<string, unknown>;
}

interface FieldInfo {
  key: string;
  path: string;
  type: string;
  sample: string;
  isEmail: boolean;
}

interface ParsedItem {
  email: string;
  name?: string;
  valid: boolean;
}

export function BulkImportDialog({ open, onOpenChange, onImport }: BulkImportDialogProps) {
  const [inputText, setInputText] = useState('');
  const [parsedEmails, setParsedEmails] = useState<{ email: string; valid: boolean }[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'paste' | 'api'>('paste');

  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiHeadersText, setApiHeadersText] = useState('');
  const [apiBody, setApiBody] = useState('');
  const [isFetchingApi, setIsFetchingApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [rawApiResponse, setRawApiResponse] = useState<unknown>(null);
  const [detectedArrays, setDetectedArrays] = useState<DetectedArray[]>([]);
  const [selectedArrayPath, setSelectedArrayPath] = useState('');
  const [fields, setFields] = useState<FieldInfo[]>([]);
  const [selectedEmailPath, setSelectedEmailPath] = useState('');
  const [selectedNamePath, setSelectedNamePath] = useState('');
  const [parsedApiItems, setParsedApiItems] = useState<ParsedItem[]>([]);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const parseEmails = () => {
    setIsParsing(true);
    const separators = /[,;\n\s]+/;
    const rawEmails = inputText.split(separators).map(e => e.trim()).filter(e => e);
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

  const findAllArrays = (obj: unknown, path: string = '', name: string = 'root'): DetectedArray[] => {
    const arrays: DetectedArray[] = [];
    
    if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object') {
      arrays.push({
        path: path || 'root',
        name,
        count: obj.length,
        sample: obj[0] as Record<string, unknown>,
      });
    } else if (obj && typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const newPath = path ? `${path}.${key}` : key;
        const newName = path ? key : 'root';
        arrays.push(...findAllArrays(value, newPath, newName));
      }
    }
    
    return arrays;
  };

  const extractFields = (obj: unknown, prefix: string = ''): FieldInfo[] => {
    const fieldsList: FieldInfo[] = [];
    
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        const type = Array.isArray(value) ? 'array' : typeof value;
        const sample = Array.isArray(value) ? `[${value.length} items]` : String(value ?? '');
        const isEmail = typeof value === 'string' && isValidEmail(value);
        
        fieldsList.push({
          key,
          path: fullPath,
          type,
          sample: sample.slice(0, 60),
          isEmail,
        });
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          fieldsList.push(...extractFields(value, fullPath));
        }
      }
    }
    
    return fieldsList;
  };

  const resolvePath = (obj: unknown, path: string): unknown => {
    if (!path || !obj) return undefined;
    if (path === 'root') return obj;
    
    const parts = path.split('.').filter(Boolean);
    let cur: unknown = obj;
    for (const part of parts) {
      if (cur === undefined || cur === null) return undefined;
      if (Array.isArray(cur)) {
        const index = parseInt(part, 10);
        cur = !isNaN(index) ? cur[index] : undefined;
      } else if (typeof cur === 'object') {
        cur = (cur as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return cur;
  };

  const getArrayItems = (data: unknown, arrayPath: string): unknown[] => {
    if (arrayPath === 'root' || !arrayPath) {
      return Array.isArray(data) ? data : [];
    }
    const arr = resolvePath(data, arrayPath);
    return Array.isArray(arr) ? arr : [];
  };

  const fetchAndAnalyzeApi = async () => {
    if (!apiUrl) {
      setApiError('Proporciona una URL de API');
      return;
    }

    setIsFetchingApi(true);
    setApiError(null);
    setRawApiResponse(null);
    setDetectedArrays([]);
    setParsedApiItems([]);

    try {
      const headers = parseHeaders(apiHeadersText);
      const opts: RequestInit = { method: apiMethod, headers };
      
      if (apiMethod === 'POST' && apiBody) {
        try {
          opts.body = JSON.stringify(JSON.parse(apiBody));
          opts.headers = { ...headers, 'Content-Type': 'application/json' };
        } catch {
          opts.body = apiBody;
        }
      }

      const res = await fetch(apiUrl, opts);
      const data = await res.json();

      const arrays = findAllArrays(data);
      
      if (arrays.length === 0) {
        setApiError('No se encontró ningún array en la respuesta de la API');
        setIsFetchingApi(false);
        return;
      }

      setRawApiResponse(data);
      setDetectedArrays(arrays);
      setSelectedArrayPath(arrays[0].path);
      
      const firstArray = arrays[0];
      const items = Array.isArray(firstArray.sample) ? firstArray.sample : [firstArray.sample];
      const detectedFields = items.length > 0 ? extractFields(items[0]) : [];
      setFields(detectedFields);
      
      const emailField = detectedFields.find(f => f.isEmail) || detectedFields.find(f => f.key.toLowerCase().includes('email') || f.key.toLowerCase().includes('correo'));
      const nameField = detectedFields.find(f => f.key.toLowerCase().includes('name') || f.key.toLowerCase().includes('nombre') || f.key.toLowerCase().includes('user'));
      
      if (emailField) setSelectedEmailPath(emailField.path);
      if (nameField) setSelectedNamePath(nameField.path);

      toast.success(`Se encontraron ${arrays.length} array(s). Selecciona el que contiene los emails.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error(err);
      setApiError(message);
      toast.error('Error al obtener la muestra desde la API');
    } finally {
      setIsFetchingApi(false);
    }
  };

  const handleArraySelection = (arrayPath: string) => {
    if (!rawApiResponse) return;
    
    setSelectedArrayPath(arrayPath);
    const items = getArrayItems(rawApiResponse, arrayPath);
    const detectedFields = items.length > 0 ? extractFields(items[0]) : [];
    setFields(detectedFields);
    setSelectedEmailPath('');
    setSelectedNamePath('');
    setParsedApiItems([]);
  };

  const extractEmails = () => {
    if (!rawApiResponse || !selectedArrayPath) return;

    const items = getArrayItems(rawApiResponse, selectedArrayPath) as Record<string, unknown>[];
    
    const parsed = items.map((item) => {
      const emailVal = resolvePath(item, selectedEmailPath);
      const nameVal = selectedNamePath ? resolvePath(item, selectedNamePath) : undefined;
      const email = String(emailVal || '').toLowerCase().trim();
      return { 
        email, 
        name: nameVal ? String(nameVal) : undefined,
        valid: isValidEmail(email) 
      };
    });

    setParsedApiItems(parsed);
    const good = parsed.filter(p => p.valid).length;
    const bad = parsed.filter(p => !p.valid).length;
    toast.success(`${good} emails válidos${bad > 0 ? `, ${bad} inválidos` : ''}`);
  };

  const generateEmailsFromName = () => {
    if (!rawApiResponse || !selectedArrayPath) return;

    const items = getArrayItems(rawApiResponse, selectedArrayPath) as Record<string, unknown>[];
    
    const nameField = fields.find(f => 
      f.key.toLowerCase().includes('name') || 
      f.key.toLowerCase().includes('nombre') ||
      f.key.toLowerCase().includes('user')
    );

    if (!nameField) {
      toast.error('No se encontró un campo de nombre para generar emails');
      return;
    }

    const parsed = items.map((item) => {
      const nameVal = resolvePath(item, nameField.path);
      const name = String(nameVal || '').trim();
      const email = name.toLowerCase().replace(/\s+/g, '.') + '@example.com';
      return { 
        email, 
        name,
        valid: true,
        generated: true
      };
    });

    setParsedApiItems(parsed);
    setSelectedEmailPath('__generated__');
    toast.success(`${parsed.length} emails generados desde el nombre`);
  };

  const handleImport = () => {
    const validEmails = activeTab === 'api'
      ? parsedApiItems.filter(p => p.valid).map(p => p.email)
      : parsedEmails.filter(p => p.valid).map(p => p.email);

    if (validEmails.length === 0) {
      toast.error('No hay emails válidos para importar');
      return;
    }

    onImport(validEmails);
    toast.success(`${validEmails.length} emails importados`);

    setInputText('');
    setParsedEmails([]);
    setRawApiResponse(null);
    setDetectedArrays([]);
    setParsedApiItems([]);
    setApiError(null);
    onOpenChange(false);
  };

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
  const validApiCount = parsedApiItems.filter(p => p.valid).length;
  const invalidApiCount = parsedApiItems.filter(p => !p.valid).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Importar Emails Masivamente
          </DialogTitle>
          <DialogDescription>
            Pega emails, carga un CSV o importa desde cualquier API
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'paste' | 'api')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Pegar / CSV</TabsTrigger>
            <TabsTrigger value="api">Importar desde API</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Lista de emails</label>
              <div className="flex gap-2">
                <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                <Button variant="outline" size="sm" onClick={() => document.getElementById('csv-upload')?.click()}>
                  <FileUp className="h-4 w-4 mr-2" />Cargar CSV
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />Template
                </Button>
              </div>
            </div>
            <Textarea
              placeholder={`ejemplo1@correo.com\nejemplo2@correo.com, ejemplo3@correo.com`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
            <p className="text-xs text-slate-500">Separa emails por comas, punto y coma, espacios o saltos de línea</p>
            
            <Button onClick={parseEmails} disabled={!inputText.trim() || isParsing} className="w-full">
              {isParsing ? <><Users className="h-4 w-4 mr-2 animate-spin" />Analizando...</> : <><Users className="h-4 w-4 mr-2" />Analizar Emails</>}
            </Button>

            {parsedEmails.length > 0 && (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Resultados ({parsedEmails.length})</h4>
                  <div className="flex gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-700"><Check className="h-3 w-3 mr-1" />{validCount} válidos</Badge>
                    {parsedEmails.length - validCount > 0 && (
                      <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />{parsedEmails.length - validCount} inválidos</Badge>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[200px] border rounded-md">
                  <div className="p-2 space-y-1">
                    {parsedEmails.slice(0, 200).map((item, index) => (
                      <div key={index} className={`flex items-center justify-between p-2 rounded text-sm ${item.valid ? 'bg-green-50' : 'bg-red-50'}`}>
                        <span className={item.valid ? 'text-green-900' : 'text-red-900'}>{item.email}</span>
                        {item.valid ? <Check className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <select className="w-20 rounded-md border px-2 py-2" value={apiMethod} onChange={(e) => setApiMethod(e.target.value as 'GET' | 'POST')}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
                <Input className="md:col-span-3" placeholder="https://api.ejemplo.com/data" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
              </div>

              <Textarea placeholder="Headers (opcional):&#10;Authorization: Bearer TOKEN&#10;Content-Type: application/json" value={apiHeadersText} onChange={(e) => setApiHeadersText(e.target.value)} className="min-h-[60px] text-sm" />

              {apiMethod === 'POST' && (
                <Textarea placeholder="Body (JSON): { &quot;page&quot;: 1 }" value={apiBody} onChange={(e) => setApiBody(e.target.value)} className="min-h-[60px] text-sm" />
              )}

              <Button onClick={fetchAndAnalyzeApi} disabled={isFetchingApi || !apiUrl} className="w-full">
                {isFetchingApi ? <><Search className="h-4 w-4 mr-2 animate-spin" />Analizando API...</> : <><Eye className="h-4 w-4 mr-2" />Analizar API</>}
              </Button>

              {apiError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{apiError}</p>}

              {detectedArrays.length > 0 && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <ChevronDown className="h-4 w-4" />
                      Arrays detectados en la respuesta
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {detectedArrays.map((arr) => (
                        <Button
                          key={arr.path}
                          variant={selectedArrayPath === arr.path ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleArraySelection(arr.path)}
                          className="justify-start text-left h-auto py-2"
                        >
                          <div>
                            <div className="font-medium">{arr.name}</div>
                            <div className="text-xs opacity-70">{arr.path}</div>
                            <div className="text-xs">{arr.count} items</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedArrayPath && fields.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium">Campos disponibles en el array</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Campo para Email *</label>
                          <select 
                            className="w-full rounded-md border px-3 py-2"
                            value={selectedEmailPath}
                            onChange={(e) => setSelectedEmailPath(e.target.value)}
                          >
                            <option value="">Seleccionar campo...</option>
                            {fields.map(field => (
                              <option key={field.path} value={field.path}>
                                {field.path} - {field.sample} {field.isEmail && '✓'}
                              </option>
                            ))}
                            <option value="__generate__">Generar desde nombre...</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Campo para Nombre (opcional)</label>
                          <select 
                            className="w-full rounded-md border px-3 py-2"
                            value={selectedNamePath}
                            onChange={(e) => setSelectedNamePath(e.target.value)}
                          >
                            <option value="">Ninguno</option>
                            {fields.map(field => (
                              <option key={field.path} value={field.path}>
                                {field.path} - {field.sample}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {selectedEmailPath === '__generate__' ? (
                        <Button onClick={generateEmailsFromName} className="w-full" variant="secondary">
                          <Users className="h-4 w-4 mr-2" />
                          Generar Emails desde Nombre
                        </Button>
                      ) : (
                        <Button onClick={extractEmails} disabled={!selectedEmailPath} className="w-full" variant="secondary">
                          <Search className="h-4 w-4 mr-2" />Extraer Emails
                        </Button>
                      )}
                    </div>
                  )}

                  {parsedApiItems.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Emails extraídos ({parsedApiItems.length})</h4>
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
                          {parsedApiItems.slice(0, 200).map((item, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 rounded text-sm ${item.valid ? 'bg-green-50' : 'bg-red-50'}`}>
                              <div>
                                <div className={item.valid ? 'text-green-900' : 'text-red-900'}>{item.email}</div>
                                {item.name && <div className="text-xs text-slate-500">{item.name}</div>}
                              </div>
                              {item.valid ? <Check className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => { 
            setInputText(''); 
            setParsedEmails([]); 
            setRawApiResponse(null); 
            setDetectedArrays([]); 
            setParsedApiItems([]); 
            onOpenChange(false); 
          }}>
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
      </DialogContent>
    </Dialog>
  );
}
