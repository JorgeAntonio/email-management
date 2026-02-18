"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiMapper } from "../hooks/useApiMapper";
import type { QueryParameter } from "../types/api-explorer.types";
import {
  Search,
  RefreshCw,
  Database,
  Check,
  AlertCircle,
  Layers,
  FileJson,
  Table as TableIcon,
  Download,
  Globe,
  Plus,
  Trash2,
  Settings2,
  Eye,
  EyeOff,
} from "lucide-react";

export function DynamicApiExplorer() {
  const {
    url,
    queryParams,
    fullUrl,
    structureType,
    pagination,
    fieldMappings,
    standardizedData,
    isLoading,
    error,
    stats,
    setUrl,
    fetchApiData,
    toggleFieldSelection,
    renameField,
    reset,
    addQueryParam,
    updateQueryParam,
    removeQueryParam,
    toggleQueryParam,
  } = useApiMapper();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [activeTab, setActiveTab] = useState("configure");
  const [showQueryParams, setShowQueryParams] = useState(false);

  const handleAnalyze = () => {
    fetchApiData(url);
    setActiveTab("configure");
  };

  const handleStartEdit = (originalPath: string, currentName: string) => {
    setEditingField(originalPath);
    setEditValue(currentName);
  };

  const handleSaveEdit = () => {
    if (editingField) {
      renameField(editingField, editValue);
      setEditingField(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const getStructureBadge = () => {
    switch (structureType) {
      case 'array':
        return <Badge className="bg-blue-500"><Layers className="h-3 w-3 mr-1" /> Array</Badge>;
      case 'paginated':
        return <Badge className="bg-purple-500"><FileJson className="h-3 w-3 mr-1" /> Paginado</Badge>;
      case 'single-object':
        return <Badge className="bg-orange-500"><Database className="h-3 w-3 mr-1" /> Objeto Único</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(standardizedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (standardizedData.length === 0) return;

    const headers = Object.keys(standardizedData[0]);
    const csvContent = [
      headers.join(','),
      ...standardizedData.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header con Input de URL */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-slate-900">Explorador de APIs</CardTitle>
              <CardDescription className="text-slate-600">
                Analiza y estandariza datos de cualquier API externa
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="https://api.ejemplo.com/v1/datos"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                className="h-12 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowQueryParams(!showQueryParams)}
              disabled={isLoading}
              className="h-12 px-4"
              title="Configurar parámetros de consulta"
            >
              <Settings2 className="h-5 w-5" />
              {queryParams.filter(p => p.enabled).length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {queryParams.filter(p => p.enabled).length}
                </Badge>
              )}
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !url}
              className="h-12 px-6 bg-slate-900 hover:bg-slate-800"
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analizar
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={reset}
              disabled={isLoading}
              className="h-12 px-4"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>

          {/* Query Parameters Section */}
          {showQueryParams && (
            <div className="p-4 bg-white/80 rounded-lg backdrop-blur border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-slate-700">
                  Parámetros de Consulta (Query Params)
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addQueryParam}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir parámetro
                </Button>
              </div>
              
              {queryParams.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No hay parámetros configurados. Haz clic en "Añadir parámetro" para agregar query params como page, limit, offset, etc.
                </p>
              ) : (
                <div className="space-y-2">
                  {queryParams.map((param) => (
                    <div key={param.id} className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQueryParam(param.id)}
                        className="h-8 w-8 p-0"
                        title={param.enabled ? "Deshabilitar" : "Habilitar"}
                      >
                        {param.enabled ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                      <Input
                        placeholder="page"
                        value={param.key}
                        onChange={(e) => updateQueryParam({ ...param, key: e.target.value })}
                        className="flex-1 h-8"
                      />
                      <Input
                        placeholder="1"
                        value={param.value}
                        onChange={(e) => updateQueryParam({ ...param, value: e.target.value })}
                        className="flex-1 h-8"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQueryParam(param.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {fullUrl && fullUrl !== url && (
                <div className="mt-3 p-2 bg-slate-100 rounded text-xs font-mono text-slate-600 break-all">
                  <span className="text-slate-400">URL completa:</span> {fullUrl}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {structureType !== 'unknown' && (
            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-lg backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Estructura:</span>
                {getStructureBadge()}
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Registros:</span>
                <Badge variant="secondary" className="font-mono">{stats.dataCount}</Badge>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Campos:</span>
                <Badge variant="secondary" className="font-mono">
                  {stats.selectedFields}/{stats.totalFields}
                </Badge>
              </div>
              {pagination.isPaginated && pagination.dataKey && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Clave de datos:</span>
                    <Badge variant="outline" className="font-mono">{pagination.dataKey}</Badge>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {fieldMappings.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm p-1 rounded-xl">
            <TabsTrigger value="configure" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white px-6">
              <Database className="h-4 w-4 mr-2" />
              Configurar Campos
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white px-6">
              <TableIcon className="h-4 w-4 mr-2" />
              Vista Previa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Mapeo de Campos</CardTitle>
                <CardDescription>
                  Selecciona los campos que deseas incluir y renómbralos según tu necesidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {fieldMappings.map((mapping) => (
                      <div
                        key={mapping.originalPath}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                          mapping.isSelected
                            ? 'bg-violet-50/50 border-violet-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <Checkbox
                          checked={mapping.isSelected}
                          onCheckedChange={() => toggleFieldSelection(mapping.originalPath)}
                        />
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-slate-500">Campo Original</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="px-2 py-1 bg-slate-100 rounded text-sm font-mono">
                                {mapping.originalPath}
                              </code>
                              <Badge variant="secondary" className="text-xs">
                                {mapping.type}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-slate-500">Nombre Estandarizado</Label>
                            {editingField === mapping.originalPath ? (
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                  className="h-8"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleSaveEdit}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="flex items-center gap-2 mt-1 cursor-pointer group"
                                onClick={() => handleStartEdit(mapping.originalPath, mapping.standardName)}
                              >
                                <code className="px-2 py-1 bg-violet-100 text-violet-800 rounded text-sm font-mono">
                                  {mapping.standardName}
                                </code>
                                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Click para editar
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("preview")} className="bg-slate-900 hover:bg-slate-800">
                Ver Vista Previa
                <TableIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Datos Estandarizados</CardTitle>
                  <CardDescription>
                    {stats.dataCount} registros con {stats.selectedFields} campos
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportToJSON}>
                    <FileJson className="h-4 w-4 mr-2" />
                    Exportar JSON
                  </Button>
                  <Button variant="outline" onClick={exportToCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fieldMappings
                          .filter(m => m.isSelected)
                          .map(mapping => (
                            <TableHead key={mapping.originalPath} className="font-mono text-xs">
                              {mapping.standardName}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standardizedData.slice(0, 100).map((row, index) => (
                        <TableRow key={index}>
                          {fieldMappings
                            .filter(m => m.isSelected)
                            .map(mapping => (
                              <TableCell key={mapping.originalPath} className="text-sm">
                                {row[mapping.standardName] === null || row[mapping.standardName] === undefined
                                  ? '-'
                                  : String(row[mapping.standardName]).length > 50
                                  ? String(row[mapping.standardName]).substring(0, 50) + '...'
                                  : String(row[mapping.standardName])}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {standardizedData.length > 100 && (
                    <p className="text-center text-sm text-slate-500 py-4">
                      Mostrando 100 de {standardizedData.length} registros
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
