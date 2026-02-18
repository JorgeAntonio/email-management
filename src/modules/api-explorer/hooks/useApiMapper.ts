"use client";

import { useReducer, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type {
  ApiMappingState,
  ApiMappingAction,
  FieldMapping,
  QueryParameter,
} from '../types/api-explorer.types';
import {
  detectStructureType,
  detectPagination,
  extractDataArray,
  detectFields,
  generateStandardName,
  transformData,
} from '../utils/api-detection.utils';

// Estado inicial
const initialState: ApiMappingState = {
  url: '',
  queryParams: [],
  rawData: null,
  structureType: 'unknown',
  pagination: { isPaginated: false },
  detectedFields: [],
  fieldMappings: [],
  standardizedData: [],
  isLoading: false,
  error: null,
};

// Reducer
function apiMappingReducer(state: ApiMappingState, action: ApiMappingAction): ApiMappingState {
  switch (action.type) {
    case 'SET_URL':
      return { ...state, url: action.payload };
    case 'ADD_QUERY_PARAM':
      return { ...state, queryParams: [...state.queryParams, action.payload] };
    case 'UPDATE_QUERY_PARAM': {
      const index = state.queryParams.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        const newParams = [...state.queryParams];
        newParams[index] = action.payload;
        return { ...state, queryParams: newParams };
      }
      return state;
    }
    case 'REMOVE_QUERY_PARAM':
      return { ...state, queryParams: state.queryParams.filter(p => p.id !== action.payload) };
    case 'TOGGLE_QUERY_PARAM': {
      const index = state.queryParams.findIndex(p => p.id === action.payload);
      if (index >= 0) {
        const newParams = [...state.queryParams];
        newParams[index] = { ...newParams[index], enabled: !newParams[index].enabled };
        return { ...state, queryParams: newParams };
      }
      return state;
    }
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, rawData: action.payload, isLoading: false };
    case 'FETCH_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_STRUCTURE_TYPE':
      return { ...state, structureType: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'SET_DETECTED_FIELDS':
      return { ...state, detectedFields: action.payload };
    case 'UPDATE_FIELD_MAPPING': {
      const existingIndex = state.fieldMappings.findIndex(
        m => m.originalPath === action.payload.originalPath
      );
      
      if (existingIndex >= 0) {
        const newMappings = [...state.fieldMappings];
        newMappings[existingIndex] = action.payload;
        return { ...state, fieldMappings: newMappings };
      }
      
      return { ...state, fieldMappings: [...state.fieldMappings, action.payload] };
    }
    case 'SET_STANDARDIZED_DATA':
      return { ...state, standardizedData: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useApiMapper() {
  const [state, dispatch] = useReducer(apiMappingReducer, initialState);

  // Construir URL completa con query params
  const buildUrlWithParams = useCallback((baseUrl: string, params: QueryParameter[]): string => {
    if (!baseUrl) return '';
    
    const enabledParams = params.filter(p => p.enabled && p.key.trim() !== '');
    if (enabledParams.length === 0) return baseUrl;
    
    const url = new URL(baseUrl);
    enabledParams.forEach(param => {
      url.searchParams.set(param.key, param.value);
    });
    
    return url.toString();
  }, []);

  // Fetch datos de la API
  const fetchApiData = useCallback(async (baseUrl: string) => {
    if (!baseUrl) {
      toast.error('Por favor ingresa una URL válida');
      return;
    }

    const fullUrl = buildUrlWithParams(baseUrl, state.queryParams);
    dispatch({ type: 'FETCH_START' });

    try {
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      
      // Detectar estructura
      const structureType = detectStructureType(data);
      dispatch({ type: 'SET_STRUCTURE_TYPE', payload: structureType });

      // Detectar paginación
      const pagination = detectPagination(data);
      dispatch({ type: 'SET_PAGINATION', payload: pagination });

      // Extraer array de datos
      const dataArray = extractDataArray(data, pagination);
      
      if (dataArray.length === 0) {
        toast.warning('No se encontraron datos en la respuesta');
        return;
      }

      // Detectar campos
      const fields = detectFields(dataArray);
      dispatch({ type: 'SET_DETECTED_FIELDS', payload: fields });

      // Crear mapeos iniciales
      const initialMappings: FieldMapping[] = fields.map(field => ({
        originalKey: field.key,
        originalPath: field.path,
        standardName: generateStandardName(field.key),
        isSelected: true,
        type: field.type,
      }));

      initialMappings.forEach(mapping => {
        dispatch({ type: 'UPDATE_FIELD_MAPPING', payload: mapping });
      });

      // Transformar datos iniciales
      const standardized = transformData(dataArray, initialMappings);
      dispatch({ type: 'SET_STANDARDIZED_DATA', payload: standardized });

      toast.success(`API analizada: ${fields.length} campos detectados`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      toast.error(`Error al analizar API: ${errorMessage}`);
    }
  }, []);

  // Actualizar mapeo de campo
  const updateFieldMapping = useCallback((mapping: FieldMapping) => {
    dispatch({ type: 'UPDATE_FIELD_MAPPING', payload: mapping });
    
    // Re-transformar datos
    const dataArray = extractDataArray(state.rawData, state.pagination);
    const updatedMappings = state.fieldMappings.map(m =>
      m.originalPath === mapping.originalPath ? mapping : m
    );
    const standardized = transformData(dataArray, updatedMappings);
    dispatch({ type: 'SET_STANDARDIZED_DATA', payload: standardized });
  }, [state.rawData, state.pagination, state.fieldMappings]);

  // Toggle selección de campo
  const toggleFieldSelection = useCallback((originalPath: string) => {
    const mapping = state.fieldMappings.find(m => m.originalPath === originalPath);
    if (mapping) {
      updateFieldMapping({ ...mapping, isSelected: !mapping.isSelected });
    }
  }, [state.fieldMappings, updateFieldMapping]);

  // Renombrar campo
  const renameField = useCallback((originalPath: string, newName: string) => {
    const mapping = state.fieldMappings.find(m => m.originalPath === originalPath);
    if (mapping) {
      updateFieldMapping({ ...mapping, standardName: newName });
    }
  }, [state.fieldMappings, updateFieldMapping]);

  // Resetear estado
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Query parameter actions
  const addQueryParam = useCallback(() => {
    const newParam: QueryParameter = {
      id: crypto.randomUUID(),
      key: '',
      value: '',
      enabled: true,
    };
    dispatch({ type: 'ADD_QUERY_PARAM', payload: newParam });
  }, []);

  const updateQueryParam = useCallback((param: QueryParameter) => {
    dispatch({ type: 'UPDATE_QUERY_PARAM', payload: param });
  }, []);

  const removeQueryParam = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_QUERY_PARAM', payload: id });
  }, []);

  const toggleQueryParam = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_QUERY_PARAM', payload: id });
  }, []);

  // Estadísticas
  const stats = useMemo(() => {
    const selectedFields = state.fieldMappings.filter(m => m.isSelected).length;
    const totalFields = state.fieldMappings.length;
    const dataCount = state.standardizedData.length;
    const enabledParams = state.queryParams.filter(p => p.enabled).length;
    
    return {
      selectedFields,
      totalFields,
      dataCount,
      enabledParams,
    };
  }, [state.fieldMappings, state.standardizedData, state.queryParams]);

  // URL completa con parámetros
  const fullUrl = useMemo(() => {
    return buildUrlWithParams(state.url, state.queryParams);
  }, [state.url, state.queryParams, buildUrlWithParams]);

  return {
    // Estado
    url: state.url,
    queryParams: state.queryParams,
    fullUrl,
    rawData: state.rawData,
    structureType: state.structureType,
    pagination: state.pagination,
    detectedFields: state.detectedFields,
    fieldMappings: state.fieldMappings,
    standardizedData: state.standardizedData,
    isLoading: state.isLoading,
    error: state.error,
    stats,
    
    // Acciones
    setUrl: (url: string) => dispatch({ type: 'SET_URL', payload: url }),
    fetchApiData,
    updateFieldMapping,
    toggleFieldSelection,
    renameField,
    reset,
    addQueryParam,
    updateQueryParam,
    removeQueryParam,
    toggleQueryParam,
  };
}
