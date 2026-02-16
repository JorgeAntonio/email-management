# Email Management Dashboard - Design Document

**Fecha:** 2026-02-16  
**Proyecto:** Email Management System  
**Autor:** AI Assistant

## Resumen Ejecutivo

Sistema de gestión de correos electrónicos diseñado para envíos individuales y masivos, con soporte para plantillas HTML, editor visual y gestión de contactos.

## Estructura General

### Layout Principal
- **Sidebar fijo** (260px) a la izquierda
- **Área de contenido** principal con scroll
- **Sistema de temas**: Claro/Oscuro con toggle

### Navegación (Sidebar)
```
📊 Dashboard (Home)
✉️  Enviar Correo
📢 Campañas Masivas
📄 Plantillas
👥 Contactos
📈 Historial
─────────────
⚙️  Configuración
👤 Perfil de Usuario
```

## Secciones del Dashboard

### 1. Dashboard (Home)
**Propósito:** Vista general del sistema y métricas clave

**Componentes:**
- **Stats Cards** (4 cards):
  - Correos enviados hoy/semana/mes
  - Tasa de apertura promedio
  - Tasa de clics
  - Contactos totales

- **Gráfico de actividad** (últimos 30 días)
- **Tabla de últimas campañas** (5-10 recientes)
- **Estado del sistema**:
  - Conexión SMTP (online/offline)
  - Cola de envíos pendientes
  - Último envío exitoso

### 2. Enviar Correo
**Propósito:** Envío de correos individuales

**Componentes:**
- Formulario:
  - Campo "Para" (con autocompletado de contactos)
  - Campo "Asunto"
  - Selector de plantilla (opcional)
- **Editor HTML** (split-pane):
  - Editor a la izquierda (textarea con syntax highlighting)
  - Preview a la derecha (iframe)
- Toolbar:
  - Insertar variables: `{{nombre}}`, `{{email}}`, `{{empresa}}`
- Botones de acción:
  - Guardar como plantilla
  - Enviar prueba
  - Enviar

### 3. Campañas Masivas
**Propósito:** Crear y gestionar campañas de email marketing

**Flujo en 4 pasos:**
1. **Seleccionar plantilla** (o crear desde cero)
2. **Seleccionar destinatarios**:
   - Lista de contactos
   - Filtros por grupo/tag
   - Importar CSV
3. **Configurar envío**:
   - Inmediato
   - Programado (fecha/hora)
4. **Vista previa y confirmación**

**Lista de campañas:**
- Tabla con: Nombre, Fecha, Destinatarios, Estado, Acciones
- Estados: Borrador, Programada, Enviando, Completada, Fallida

### 4. Plantillas
**Propósito:** Biblioteca de plantillas reutilizables

**Vista:**
- Grid de plantillas (miniatura + nombre)
- Búsqueda y filtros
- Categorías: Newsletter, Promocional, Transaccional, Personalizado

**Editor de plantilla:**
- Igual que "Enviar Correo" pero sin destinatario
- Campos: Nombre, Categoría, HTML, Preview
- Variables disponibles

### 5. Contactos
**Propósito:** Gestión de base de datos de clientes

**Vista:**
- Tabla con: Nombre, Email, Empresa, Grupo, Fecha agregado, Acciones
- Búsqueda global
- Filtros por grupo/tag
- Botón "Agregar contacto" (modal)
- Importar desde CSV
- Exportar a CSV

### 6. Historial
**Propósito:** Logs y reportes de envíos

**Vista:**
- Tabla con: Fecha, Destinatario, Asunto, Estado, Acciones
- Filtros: Fecha, Estado, Tipo (individual/campaña)
- Detalle de envío (modal):
  - Contenido del correo
  - Estado de entrega
  - Aperturas/clics (si aplica)

### 7. Configuración
**Propósito:** Ajustes del sistema

**Secciones:**
- **SMTP**: Configuración del servidor de correo
- **General**: Nombre de la empresa, remitente por defecto
- **Notificaciones**: Alertas de fallos, reportes diarios
- **API Keys**: Para integraciones externas

## Componentes UI de shadcn/ui a Utilizar

### Ya Instalados:
- ✅ `sidebar` - Navegación lateral
- ✅ `table` - Tablas de datos
- ✅ `tabs` - Navegación por pestañas
- ✅ `button` - Botones
- ✅ `input` - Campos de texto
- ✅ `textarea` - Áreas de texto
- ✅ `select` - Selectores
- ✅ `card` - Tarjetas de información
- ✅ `dialog` - Modales
- ✅ `dropdown-menu` - Menús desplegables
- ✅ `separator` - Separadores visuales
- ✅ `tooltip` - Tooltips
- ✅ `sonner` - Notificaciones toast
- ✅ `scroll-area` - Áreas con scroll
- ✅ `skeleton` - Estados de carga
- ✅ `sheet` - Paneles laterales móviles
- ✅ `popover` - Popovers
- ✅ `badge` - Etiquetas de estado
- ✅ `toggle` - Switches

### Por Instalar:
- `chart` - Gráficos (para dashboard)
- `calendar` - Selector de fecha (para campañas programadas)
- `command` - Búsqueda con comandos (para contactos)

## Estructura de Archivos (Next.js App Router)

```
app/
├── layout.tsx                 # Root layout con sidebar y tema
├── page.tsx                   # Dashboard (home)
├── globals.css
├── (routes)/
│   ├── send/
│   │   └── page.tsx          # Enviar correo
│   ├── campaigns/
│   │   ├── page.tsx          # Lista de campañas
│   │   └── new/
│   │       └── page.tsx      # Nueva campaña
│   ├── templates/
│   │   ├── page.tsx          # Biblioteca de plantillas
│   │   └── [id]/
│   │       └── page.tsx      # Editor de plantilla
│   ├── contacts/
│   │   └── page.tsx          # Gestión de contactos
│   ├── history/
│   │   └── page.tsx          # Historial de envíos
│   └── settings/
│       └── page.tsx          # Configuración
├── components/
│   ├── email-editor/         # Editor HTML con preview
│   ├── stats-cards/          # Cards de estadísticas
│   ├── charts/               # Gráficos del dashboard
│   └── layout/               # Componentes de layout
├── hooks/
│   └── use-theme.ts          # Hook para tema
├── lib/
│   └── utils.ts              # Utilidades
└── types/
    └── index.ts              # Tipos TypeScript
```

## Estado Global (Contextos)

1. **ThemeContext**: Gestión de tema claro/oscuro
2. **SidebarContext**: Estado colapsado/extendido del sidebar
3. **ToastContext**: Notificaciones globales

## API/Rutas (Futuro)

```
/api/
├── auth/                     # Autenticación
├── emails/
│   ├── send.ts              # Enviar correo individual
│   └── preview.ts           # Generar preview
├── campaigns/
│   ├── route.ts             # CRUD campañas
│   └── [id]/send.ts         # Ejecutar campaña
├── templates/
│   └── route.ts             # CRUD plantillas
├── contacts/
│   ├── route.ts             # CRUD contactos
│   └── import.ts            # Importar CSV
└── stats/
    └── route.ts             # Estadísticas para dashboard
```

## Consideraciones Técnicas

### Performance:
- Usar `dynamic` import para componentes pesados (editor)
- Implementar virtualización para tablas largas
- Lazy loading de gráficos

### Accesibilidad:
- Labels en todos los inputs
- Focus states visibles
- Keyboard navigation
- ARIA labels donde sea necesario

### Responsive:
- Sidebar colapsable en móviles
- Grid de plantillas: 3 cols desktop, 2 tablet, 1 móvil
- Tablas con scroll horizontal en móviles

## Próximos Pasos (MVP)

1. ✅ Estructura base con sidebar y navegación
2. ✅ Sistema de temas (claro/oscuro)
3. ✅ Dashboard con stats mock
4. ✅ Editor HTML básico con preview
5. ✅ Páginas vacías para campañas, plantillas, contactos
6. 🔄 Integrar componentes de shadcn necesarios
7. 🔄 Mock data para visualización
8. 🔄 Responsive design

## Notas

- Priorizar funcionalidad sobre diseño visual inicial
- Usar datos mock para validar UI antes de backend
- Editor HTML: empezar con textarea simple, evaluar Monaco/CodeMirror después
- Preview: iframe que renderiza el HTML escrito
