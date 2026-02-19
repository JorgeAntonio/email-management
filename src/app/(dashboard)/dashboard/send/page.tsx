'use client';

import { useState } from 'react';
import { SendEmailForm } from './send-email-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Mail,
  Plus,
  Clock,
  Save,
  Send,
  Trash2,
  MoreVertical,
  FileText,
  AlertCircle,
  Loader2,
  Edit3,
  Copy,
  Eye,
  ChevronRight,
  Sparkles,
  History,
  Inbox,
  Archive,
  Search,
} from 'lucide-react';

// Tipos
interface Draft {
  id: string;
  subject: string;
  to: string[];
  preview: string;
  updatedAt: string;
  isScheduled?: boolean;
  scheduledFor?: string;
}

interface SentEmail {
  id: string;
  subject: string;
  to: string[];
  sentAt: string;
  status: 'sent' | 'delivered' | 'opened' | 'bounced';
  openCount?: number;
  clickCount?: number;
}

// Mock data
const mockDrafts: Draft[] = [
  {
    id: '1',
    subject: 'Oferta especial de verano',
    to: ['clientes@lista.com'],
    preview: 'Aprovecha nuestras ofertas especiales...',
    updatedAt: '2024-01-15T10:30:00',
    isScheduled: true,
    scheduledFor: '2024-01-20T09:00:00',
  },
  {
    id: '2',
    subject: 'Newsletter mensual',
    to: ['suscriptores@lista.com'],
    preview: 'Bienvenidos a nuestra newsletter de enero...',
    updatedAt: '2024-01-14T15:20:00',
  },
];

const mockSent: SentEmail[] = [
  {
    id: '1',
    subject: 'Bienvenida a nuevos usuarios',
    to: ['usuario1@email.com', 'usuario2@email.com'],
    sentAt: '2024-01-15T09:00:00',
    status: 'opened',
    openCount: 45,
    clickCount: 12,
  },
  {
    id: '2',
    subject: 'Promoción de lanzamiento',
    to: ['lista@completa.com'],
    sentAt: '2024-01-14T14:30:00',
    status: 'sent',
  },
];

export default function SendEmailPage() {
  const [activeTab, setActiveTab] = useState('compose');
  const [showCompose, setShowCompose] = useState(false);
  const [editingDraft, setEditingDraft] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Formatear fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace minutos';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // Filtrar borradores
  const filteredDrafts = mockDrafts.filter(draft =>
    draft.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.to.some(email => email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filtrar enviados
  const filteredSent = mockSent.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.to.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Eliminar borradores
  const handleDeleteDrafts = async () => {
    setIsDeleting(true);
    // Simular eliminación
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(`${selectedDrafts.length} borradores eliminados`);
    setSelectedDrafts([]);
    setIsDeleting(false);
  };

  // Duplicar borrador
  const handleDuplicateDraft = (draft: Draft) => {
    toast.success('Borrador duplicado');
  };

  // Abrir borrador
  const handleOpenDraft = (draftId: string) => {
    setEditingDraft(draftId);
    setShowCompose(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Enviar Correo</h1>
                <p className="text-sm text-slate-500">Crea y envía emails profesionales</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setEditingDraft(null);
                setShowCompose(true);
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo mensaje
            </Button>
          </div>

          <TabsList className="bg-slate-100 p-1 rounded-lg">
            <TabsTrigger 
              value="compose" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Componer
            </TabsTrigger>
            <TabsTrigger 
              value="drafts" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4"
            >
              <Save className="h-4 w-4 mr-2" />
              Borradores
              <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700">
                {mockDrafts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="sent" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviados
            </TabsTrigger>
            <TabsTrigger 
              value="scheduled" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4"
            >
              <Clock className="h-4 w-4 mr-2" />
              Programados
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="compose" className="h-full m-0">
            {showCompose ? (
              <div className="h-full">
                <SendEmailForm 
                  onClose={() => setShowCompose(false)} 
                  draftId={editingDraft || undefined}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <Card className="max-w-md w-full border-0 shadow-xl">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-10 w-10 text-violet-600" />
                    </div>
                    <CardTitle className="text-xl">Crear nuevo mensaje</CardTitle>
                    <CardDescription className="text-base">
                      Comienza a escribir un email profesional para tu audiencia
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => setShowCompose(true)}
                      className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Comenzar a escribir
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12">
                        <FileText className="h-4 w-4 mr-2" />
                        Usar plantilla
                      </Button>
                      <Button variant="outline" className="h-12">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar anterior
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="h-full m-0">
            <div className="h-full flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar borradores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                {selectedDrafts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">
                      {selectedDrafts.length} seleccionados
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteDrafts}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>

              {/* Lista de borradores */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-3">
                  {filteredDrafts.length === 0 ? (
                    <div className="text-center py-12">
                      <Save className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No tienes borradores guardados</p>
                    </div>
                  ) : (
                    filteredDrafts.map((draft) => (
                      <Card
                        key={draft.id}
                        className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
                        onClick={() => handleOpenDraft(draft.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="pt-1">
                              <input
                                type="checkbox"
                                className="rounded border-slate-300"
                                checked={selectedDrafts.includes(draft.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedDrafts([...selectedDrafts, draft.id]);
                                  } else {
                                    setSelectedDrafts(selectedDrafts.filter(id => id !== draft.id));
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900 truncate">
                                  {draft.subject || '(Sin asunto)'}
                                </h3>
                                {draft.isScheduled && (
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Programado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 mb-2">
                                Para: {draft.to.join(', ')}
                              </p>
                              <p className="text-sm text-slate-400 truncate">
                                {draft.preview}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs text-slate-400">
                                {formatRelativeTime(draft.updatedAt)}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateDraft(draft);
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDrafts([draft.id]);
                                    handleDeleteDrafts();
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="sent" className="h-full m-0">
            <div className="h-full flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar emails enviados..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Lista de enviados */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-3">
                  {filteredSent.length === 0 ? (
                    <div className="text-center py-12">
                      <Send className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No has enviado emails aún</p>
                    </div>
                  ) : (
                    filteredSent.map((email) => (
                      <Card
                        key={email.id}
                        className="border-0 shadow-sm"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              email.status === 'opened' ? 'bg-green-100 text-green-600' :
                              email.status === 'sent' ? 'bg-blue-100 text-blue-600' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {email.status === 'opened' ? <Eye className="h-5 w-5" /> :
                               email.status === 'sent' ? <Send className="h-5 w-5" /> :
                               <AlertCircle className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900">
                                  {email.subject}
                                </h3>
                                <Badge variant="secondary" className={`
                                  ${email.status === 'opened' ? 'bg-green-100 text-green-700' :
                                    email.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'}
                                `}>
                                  {email.status === 'opened' ? 'Abierto' :
                                   email.status === 'sent' ? 'Enviado' :
                                   'Rebotado'}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500">
                                Para: {email.to.length > 1 ? 
                                  `${email.to[0]} y ${email.to.length - 1} más` : 
                                  email.to[0]}
                              </p>
                              {email.openCount !== undefined && (
                                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                  <span>{email.openCount} aperturas</span>
                                  <span>{email.clickCount} clicks</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-400">
                                {formatRelativeTime(email.sentAt)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="block mt-2 text-violet-600"
                              >
                                Ver estadísticas
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="h-full m-0">
            <div className="h-full flex items-center justify-center">
              <Card className="max-w-md w-full border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-10 w-10 text-amber-600" />
                  </div>
                  <CardTitle>Emails Programados</CardTitle>
                  <CardDescription>
                    Aquí aparecerán los emails que hayas programado para enviar más tarde
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">No tienes emails programados</p>
                    <Button
                      onClick={() => setActiveTab('compose')}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      Programar un email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
