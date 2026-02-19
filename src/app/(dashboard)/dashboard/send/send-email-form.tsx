'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useEmailSender } from '@/modules/email/hooks/use-email-sender';
import { emailTemplates } from '@/modules/email/templates/email-templates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { BulkImportDialog } from './bulk-import-dialog';
import {
  Send,
  Eye,
  X,
  ChevronDown,
  Paperclip,
  Image,
  Smile,
  MoreVertical,
  Clock,
  Save,
  Trash2,
  Users,
  Loader2,
  Sparkles,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

// Tipos
interface RecipientChip {
  id: string;
  email: string;
  name?: string;
  isValid: boolean;
}

interface SendEmailFormProps {
  onClose?: () => void;
  draftId?: string;
}

export function SendEmailForm({ onClose, draftId }: SendEmailFormProps) {
  // Estados
  const [toRecipients, setToRecipients] = useState<RecipientChip[]>([]);
  const [ccRecipients, setCcRecipients] = useState<RecipientChip[]>([]);
  const [bccRecipients, setBccRecipients] = useState<RecipientChip[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [activeField, setActiveField] = useState<'to' | 'cc' | 'bcc'>('to');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  
  const { sendEmail, isLoading } = useEmailSender();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Agregar recipient
  const addRecipient = useCallback((email: string, field: 'to' | 'cc' | 'bcc' = 'to') => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    // Separar por comas o punto y coma si es una lista
    const emails = trimmedEmail.split(/[,;]/).map(e => e.trim()).filter(e => e);

    const newRecipients: RecipientChip[] = emails.map((email, index) => ({
      id: `${Date.now()}-${index}`,
      email: email.toLowerCase(),
      name: email.split('@')[0],
      isValid: isValidEmail(email),
    }));

    if (field === 'to') {
      setToRecipients(prev => [...prev, ...newRecipients]);
    } else if (field === 'cc') {
      setCcRecipients(prev => [...prev, ...newRecipients]);
    } else {
      setBccRecipients(prev => [...prev, ...newRecipients]);
    }
  }, []);

  // Remover recipient
  const removeRecipient = (id: string, field: 'to' | 'cc' | 'bcc') => {
    if (field === 'to') {
      setToRecipients(prev => prev.filter(r => r.id !== id));
    } else if (field === 'cc') {
      setCcRecipients(prev => prev.filter(r => r.id !== id));
    } else {
      setBccRecipients(prev => prev.filter(r => r.id !== id));
    }
  };

  // Handle keydown en input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'to' | 'cc' | 'bcc') => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';' || e.key === ' ') {
      e.preventDefault();
      if (currentInput.trim()) {
        addRecipient(currentInput, field);
        setCurrentInput('');
      }
    } else if (e.key === 'Backspace' && !currentInput) {
      // Remover último recipient si el input está vacío
      if (field === 'to' && toRecipients.length > 0) {
        setToRecipients(prev => prev.slice(0, -1));
      } else if (field === 'cc' && ccRecipients.length > 0) {
        setCcRecipients(prev => prev.slice(0, -1));
      } else if (field === 'bcc' && bccRecipients.length > 0) {
        setBccRecipients(prev => prev.slice(0, -1));
      }
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent, field: 'to' | 'cc' | 'bcc') => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    addRecipient(pastedText, field);
  };

  // Agregar attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  // Remover attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Seleccionar template
  const handleSelectTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setHtmlContent(template.html);
      setIsHtmlMode(true);
      setShowTemplates(false);
      toast.success(`Plantilla "${template.name}" aplicada`);
    }
  };

  // Generar HTML del body si no está en modo HTML
  const generateHtml = () => {
    if (isHtmlMode && htmlContent) return htmlContent;
    
    // Convertir texto plano a HTML simple
    return body
      .split('\n')
      .map(line => `<p>${line}</p>`)
      .join('');
  };

  // Procesar variables en el HTML
  const processHtml = (html: string) => {
    const now = new Date();
    return html
      .replace(/{{nombre}}/g, 'Nombre')
      .replace(/{{email}}/g, 'email@ejemplo.com')
      .replace(/{{fecha}}/g, now.toLocaleDateString('es-ES'))
      .replace(/{{hora}}/g, now.toLocaleTimeString('es-ES'))
      .replace(/{{asunto}}/g, subject || 'Sin asunto')
      .replace(/{{mes}}/g, now.toLocaleDateString('es-ES', { month: 'long' }))
      .replace(/{{año}}/g, now.getFullYear().toString());
  };

  // Validar formulario
  const isValid = () => {
    const hasRecipients = toRecipients.length > 0 || ccRecipients.length > 0 || bccRecipients.length > 0;
    const hasContent = isHtmlMode ? htmlContent.trim().length > 0 : body.trim().length > 0;
    return hasRecipients && subject.trim() && hasContent;
  };

  // Enviar email
  const handleSend = async () => {
    if (!isValid()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setSending(true);
    
    const allRecipients = [
      ...toRecipients.map(r => r.email),
      ...ccRecipients.map(r => r.email),
      ...bccRecipients.map(r => r.email),
    ];

    try {
      await sendEmail({
        to: allRecipients,
        subject,
        html: generateHtml(),
        // attachments: attachments // Si tu API soporta attachments
      });
      
      toast.success(`Email enviado a ${allRecipients.length} destinatarios`);
      
      // Limpiar formulario
      setToRecipients([]);
      setCcRecipients([]);
      setBccRecipients([]);
      setSubject('');
      setBody('');
      setHtmlContent('');
      setAttachments([]);
      
      if (onClose) onClose();
    } catch (error) {
      toast.error('Error al enviar el email');
    } finally {
      setSending(false);
    }
  };

  // Guardar borrador
  const handleSaveDraft = async () => {
    setSaving(true);
    // Aquí implementarías la lógica para guardar en Supabase
    toast.success('Borrador guardado');
    setSaving(false);
  };

  // Contar total de destinatarios
  const totalRecipients = toRecipients.length + ccRecipients.length + bccRecipients.length;
  const invalidRecipients = [...toRecipients, ...ccRecipients, ...bccRecipients].filter(r => !r.isValid).length;

  // Manejar importación masiva
  const handleBulkImport = (emails: string[]) => {
    const newRecipients: RecipientChip[] = emails.map((email, index) => ({
      id: `${Date.now()}-${index}`,
      email: email.toLowerCase(),
      name: email.split('@')[0],
      isValid: isValidEmail(email),
    }));
    
    setToRecipients(prev => [...prev, ...newRecipients]);
    toast.success(`${newRecipients.length} emails agregados`);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header del formulario */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Nuevo mensaje</h2>
          {totalRecipients > 0 && (
            <Badge variant="secondary" className="bg-slate-100">
              {totalRecipients} destinatario{totalRecipients !== 1 ? 's' : ''}
            </Badge>
          )}
          {invalidRecipients > 0 && (
            <Badge variant="destructive" className="text-xs">
              {invalidRecipients} email inválido
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Guardar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Vista previa</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Campos de destinatarios */}
      <div className="px-6 py-4 space-y-3 border-b">
        {/* Para */}
        <div className="flex items-start gap-2">
          <span className="text-sm text-slate-500 w-12 pt-2 shrink-0">Para</span>
          <div className="flex-1 flex flex-wrap items-center gap-2 min-h-[40px] p-2 border rounded-lg focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 bg-white">
            {toRecipients.map((recipient) => (
              <Badge
                key={recipient.id}
                variant={recipient.isValid ? 'secondary' : 'destructive'}
                className={`flex items-center gap-1 px-2 py-1 ${
                  recipient.isValid 
                    ? 'bg-violet-50 text-violet-700 hover:bg-violet-100' 
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <span className="max-w-[200px] truncate">{recipient.email}</span>
                <button
                  onClick={() => removeRecipient(recipient.id, 'to')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <input
              ref={activeField === 'to' ? inputRef : null}
              type="text"
              className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
              placeholder={toRecipients.length === 0 ? 'ejemplo@correo.com' : ''}
              value={activeField === 'to' ? currentInput : ''}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'to')}
              onPaste={(e) => handlePaste(e, 'to')}
              onFocus={() => setActiveField('to')}
              onBlur={() => {
                if (currentInput.trim()) {
                  addRecipient(currentInput, 'to');
                  setCurrentInput('');
                }
              }}
            />
          </div>
        </div>

        {/* CC */}
        {showCc && (
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-12 pt-2 shrink-0">Cc</span>
            <div className="flex-1 flex flex-wrap items-center gap-2 min-h-[40px] p-2 border rounded-lg focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 bg-white">
              {ccRecipients.map((recipient) => (
                <Badge
                  key={recipient.id}
                  variant={recipient.isValid ? 'secondary' : 'destructive'}
                  className={`flex items-center gap-1 px-2 py-1 ${
                    recipient.isValid 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <span className="max-w-[200px] truncate">{recipient.email}</span>
                  <button
                    onClick={() => removeRecipient(recipient.id, 'cc')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <input
                type="text"
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                placeholder={ccRecipients.length === 0 ? 'Agregar copia' : ''}
                value={activeField === 'cc' ? currentInput : ''}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'cc')}
                onPaste={(e) => handlePaste(e, 'cc')}
                onFocus={() => setActiveField('cc')}
                onBlur={() => {
                  if (currentInput.trim()) {
                    addRecipient(currentInput, 'cc');
                    setCurrentInput('');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* CCO */}
        {showBcc && (
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-500 w-12 pt-2 shrink-0">Cco</span>
            <div className="flex-1 flex flex-wrap items-center gap-2 min-h-[40px] p-2 border rounded-lg focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 bg-white">
              {bccRecipients.map((recipient) => (
                <Badge
                  key={recipient.id}
                  variant={recipient.isValid ? 'secondary' : 'destructive'}
                  className={`flex items-center gap-1 px-2 py-1 ${
                    recipient.isValid 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <span className="max-w-[200px] truncate">{recipient.email}</span>
                  <button
                    onClick={() => removeRecipient(recipient.id, 'bcc')}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <input
                type="text"
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                placeholder={bccRecipients.length === 0 ? 'Agregar copia oculta' : ''}
                value={activeField === 'bcc' ? currentInput : ''}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'bcc')}
                onPaste={(e) => handlePaste(e, 'bcc')}
                onFocus={() => setActiveField('bcc')}
                onBlur={() => {
                  if (currentInput.trim()) {
                    addRecipient(currentInput, 'bcc');
                    setCurrentInput('');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Toggle CC/CCO e Importación */}
        <div className="flex items-center justify-between ml-14">
          <div className="flex gap-4">
            {!showCc && (
              <button
                onClick={() => setShowCc(true)}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Cc
              </button>
            )}
            {!showBcc && (
              <button
                onClick={() => setShowBcc(true)}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                Cco
              </button>
            )}
          </div>
          <button
            onClick={() => setShowBulkImport(true)}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            <Users className="h-3 w-3" />
            Importar emails
          </button>
        </div>

        {/* Asunto */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Asunto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-violet-500 text-base font-medium"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b bg-slate-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Plantilla
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {emailTemplates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-xs text-slate-500">{template.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Link className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Image className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Smile className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={isHtmlMode ? 'text-violet-600' : ''}
        >
          HTML
        </Button>
      </div>

      {/* Editor de contenido */}
      <div className="flex-1 overflow-hidden">
        {isHtmlMode ? (
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder="<html>...</html>"
            className="w-full h-full p-6 resize-none outline-none font-mono text-sm"
          />
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="w-full h-full p-6 resize-none outline-none text-base leading-relaxed"
          />
        )}
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-6 py-3 border-t bg-slate-50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-2 bg-white border"
              >
                <Paperclip className="h-3 w-3" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <span className="text-xs text-slate-400">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="ml-1 text-slate-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Adjuntar</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Clock className="h-4 w-4 mr-2" />
                Programar envío
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Guardar borrador
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Descartar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar
          </Button>
          
          <Button
            onClick={handleSend}
            disabled={!isValid() || sending}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar
                {totalRecipients > 0 && (
                  <span className="ml-1">({totalRecipients})</span>
                )}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Dialog de Vista Previa */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Vista Previa del Email</DialogTitle>
            <DialogDescription>
              Así se verá tu correo en el cliente de email
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden" style={{ height: 'calc(90vh - 100px)' }}>
            <iframe
              srcDoc={processHtml(generateHtml())}
              className="w-full h-full bg-white"
              sandbox="allow-scripts"
              title="Vista previa del email"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Importación Masiva */}
      <BulkImportDialog
        open={showBulkImport}
        onOpenChange={setShowBulkImport}
        onImport={handleBulkImport}
      />
    </div>
  );
}
