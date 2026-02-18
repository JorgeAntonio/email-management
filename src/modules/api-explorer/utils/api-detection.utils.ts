import type { DataStructureType, PaginationInfo, DetectedField } from '../types/api-explorer.types';

// Palabras clave comunes para detectar paginación
const PAGINATION_KEYS = {
  data: ['data', 'results', 'items', 'records', 'content', 'list', 'objects', 'rows'],
  count: ['count', 'total_count', 'totalCount', 'total', 'length', 'size', 'num_results'],
  page: ['page', 'current_page', 'currentPage', 'page_number', 'pageNumber'],
  totalPages: ['total_pages', 'totalPages', 'pages', 'num_pages', 'page_count'],
};

/**
 * Detecta el tipo de estructura de datos de la respuesta de API
 */
export function detectStructureType(data: unknown): DataStructureType {
  if (data === null || data === undefined) {
    return 'unknown';
  }

  if (Array.isArray(data)) {
    return 'array';
  }

  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    
    // Verificar si es un objeto paginado
    for (const key of PAGINATION_KEYS.data) {
      if (key in obj && Array.isArray(obj[key])) {
        return 'paginated';
      }
    }

    return 'single-object';
  }

  return 'unknown';
}

/**
 * Detecta información de paginación en la respuesta
 */
export function detectPagination(data: unknown): PaginationInfo {
  if (typeof data !== 'object' || data === null) {
    return { isPaginated: false };
  }

  const obj = data as Record<string, unknown>;
  const pagination: PaginationInfo = { isPaginated: false };

  // Buscar clave de datos
  for (const key of PAGINATION_KEYS.data) {
    if (key in obj && Array.isArray(obj[key])) {
      pagination.dataKey = key;
      pagination.isPaginated = true;
      break;
    }
  }

  // Buscar clave de conteo/total
  for (const key of PAGINATION_KEYS.count) {
    if (key in obj) {
      pagination.countKey = key;
      break;
    }
  }

  // Buscar clave de página actual
  for (const key of PAGINATION_KEYS.page) {
    if (key in obj) {
      pagination.pageKey = key;
      break;
    }
  }

  // Buscar clave de total de páginas
  for (const key of PAGINATION_KEYS.totalPages) {
    if (key in obj) {
      pagination.totalPagesKey = key;
      break;
    }
  }

  return pagination;
}

/**
 * Extrae el array de datos de la respuesta
 */
export function extractDataArray(data: unknown, pagination: PaginationInfo): unknown[] {
  const structureType = detectStructureType(data);

  if (structureType === 'array' && Array.isArray(data)) {
    return data;
  }

  if (structureType === 'paginated' && pagination.dataKey) {
    const obj = data as Record<string, unknown>;
    const dataArray = obj[pagination.dataKey];
    return Array.isArray(dataArray) ? dataArray : [];
  }

  if (structureType === 'single-object' && typeof data === 'object' && data !== null) {
    return [data];
  }

  return [];
}

/**
 * Obtiene el tipo de un valor
 */
function getValueType(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Detecta campos recursivamente en un objeto
 */
function detectFieldsRecursive(
  obj: Record<string, unknown>,
  path: string = '',
  fields: DetectedField[] = []
): DetectedField[] {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    const type = getValueType(value);

    if (type === 'object' && value !== null && !Array.isArray(value)) {
      // Recursión para objetos anidados
      detectFieldsRecursive(value as Record<string, unknown>, currentPath, fields);
    } else if (type === 'array' && Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      // Si es un array de objetos, detectar campos del primer elemento
      detectFieldsRecursive(value[0] as Record<string, unknown>, currentPath, fields);
    } else {
      // Campo primitivo
      fields.push({
        key,
        path: currentPath,
        type,
        isNested: path !== '',
        sample: value,
      });
    }
  }

  return fields;
}

/**
 * Detecta todos los campos disponibles en los datos
 */
export function detectFields(data: unknown[]): DetectedField[] {
  if (data.length === 0) return [];

  const firstItem = data[0];
  if (typeof firstItem !== 'object' || firstItem === null) return [];

  return detectFieldsRecursive(firstItem as Record<string, unknown>);
}

/**
 * Genera un nombre estándar basado en la clave original
 */
export function generateStandardName(key: string): string {
  const mappings: Record<string, string> = {
    // Nombres
    'full_name': 'nombre_completo',
    'name': 'nombre',
    'first_name': 'nombre',
    'last_name': 'apellido',
    'firstName': 'nombre',
    'lastName': 'apellido',
    'username': 'usuario',
    
    // Contacto
    'email': 'correo',
    'phone': 'telefono',
    'phone_number': 'telefono',
    'mobile': 'celular',
    'address': 'direccion',
    
    // Identificación
    'id': 'identificador',
    'uuid': 'identificador_unico',
    'document': 'documento',
    'dni': 'dni',
    'ruc': 'ruc',
    
    // Fechas
    'created_at': 'fecha_creacion',
    'updated_at': 'fecha_actualizacion',
    'deleted_at': 'fecha_eliminacion',
    'date': 'fecha',
    'createdAt': 'fecha_creacion',
    'updatedAt': 'fecha_actualizacion',
    
    // Estado
    'status': 'estado',
    'active': 'activo',
    'enabled': 'habilitado',
    'state': 'estado',
    
    // Descripción
    'description': 'descripcion',
    'title': 'titulo',
    'content': 'contenido',
    'text': 'texto',
    'body': 'cuerpo',
    
    // Ubicación
    'country': 'pais',
    'city': 'ciudad',
    'region': 'region',
    'province': 'provincia',
    'district': 'distrito',
    
    // URLs
    'url': 'url',
    'link': 'enlace',
    'website': 'sitio_web',
    'image': 'imagen',
    'avatar': 'avatar',
    'thumbnail': 'miniatura',
    
    // Métricas
    'count': 'cantidad',
    'total': 'total',
    'amount': 'monto',
    'price': 'precio',
    'quantity': 'cantidad',
    'value': 'valor',
    'score': 'puntuacion',
  };

  const lowerKey = key.toLowerCase();
  
  // Buscar coincidencia exacta
  if (mappings[key]) {
    return mappings[key];
  }
  
  // Buscar coincidencia parcial
  for (const [pattern, standard] of Object.entries(mappings)) {
    if (lowerKey.includes(pattern.toLowerCase())) {
      return standard;
    }
  }

  // Si no hay coincidencia, retornar la clave original con formato snake_case
  return key
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Extrae el valor de un objeto usando una ruta anidada (ej: "user.address.city")
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

/**
 * Transforma datos según los mapeos de campos
 */
export function transformData(
  data: unknown[],
  fieldMappings: { originalPath: string; standardName: string; isSelected: boolean }[]
): Record<string, unknown>[] {
  return data.map(item => {
    const standardized: Record<string, unknown> = {};

    for (const mapping of fieldMappings) {
      if (!mapping.isSelected) continue;

      if (typeof item === 'object' && item !== null) {
        const value = getNestedValue(item as Record<string, unknown>, mapping.originalPath);
        standardized[mapping.standardName] = value;
      }
    }

    return standardized;
  });
}
