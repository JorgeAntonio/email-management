import { z } from 'zod';

// Esquema de validación para la respuesta de API
export const ApiResponseSchema = z.union([
  z.array(z.record(z.string(), z.unknown())),
  z.record(z.string(), z.unknown()),
]);

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Tipo para un parámetro de query
export interface QueryParameter {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

// Tipo para un campo detectado
export interface DetectedField {
  key: string;
  path: string;
  type: string;
  isNested: boolean;
  sample: unknown;
}

// Tipo para el mapeo de campos
export interface FieldMapping {
  originalKey: string;
  originalPath: string;
  standardName: string;
  isSelected: boolean;
  type: string;
}

// Tipos de estructura detectada
export type DataStructureType = 'array' | 'paginated' | 'single-object' | 'unknown';

// Información de paginación
export interface PaginationInfo {
  isPaginated: boolean;
  dataKey?: string;
  countKey?: string;
  totalKey?: string;
  pageKey?: string;
  totalPagesKey?: string;
}

// Estado del mapeo
export interface ApiMappingState {
  url: string;
  queryParams: QueryParameter[];
  rawData: unknown;
  structureType: DataStructureType;
  pagination: PaginationInfo;
  detectedFields: DetectedField[];
  fieldMappings: FieldMapping[];
  standardizedData: Record<string, unknown>[];
  isLoading: boolean;
  error: string | null;
}

// Acciones del reducer
export type ApiMappingAction =
  | { type: 'SET_URL'; payload: string }
  | { type: 'ADD_QUERY_PARAM'; payload: QueryParameter }
  | { type: 'UPDATE_QUERY_PARAM'; payload: QueryParameter }
  | { type: 'REMOVE_QUERY_PARAM'; payload: string }
  | { type: 'TOGGLE_QUERY_PARAM'; payload: string }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: unknown }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_STRUCTURE_TYPE'; payload: DataStructureType }
  | { type: 'SET_PAGINATION'; payload: PaginationInfo }
  | { type: 'SET_DETECTED_FIELDS'; payload: DetectedField[] }
  | { type: 'UPDATE_FIELD_MAPPING'; payload: FieldMapping }
  | { type: 'SET_STANDARDIZED_DATA'; payload: Record<string, unknown>[] }
  | { type: 'RESET' };
