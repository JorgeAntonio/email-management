-- ============================================================================
-- CONFIGURACIÓN DE STORAGE PARA AVATARES
-- ============================================================================
-- Este script configura el bucket de storage para los avatares de usuario
-- ============================================================================

-- Crear bucket para avatares (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de seguridad para el bucket de avatares

-- 1. Permitir a usuarios autenticados subir sus propios avatares
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'profiles'
        AND (storage.foldername(name))[1] = 'avatars'
    );

-- 2. Permitir a usuarios autenticados actualizar sus propios avatares
CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'profiles'
        AND (storage.foldername(name))[1] = 'avatars'
    );

-- 3. Permitir lectura pública de avatares
CREATE POLICY "Avatars are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'profiles');

-- 4. Permitir a usuarios eliminar sus propios avatares
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'profiles'
        AND (storage.foldername(name))[1] = 'avatars'
    );

-- ============================================================================
-- INSTRUCCIONES
-- ============================================================================
/*

Después de ejecutar este script:

1. El bucket 'profiles' estará disponible para almacenar avatares
2. Los avatares se almacenarán en: profiles/avatars/
3. Las imágenes son públicamente accesibles
4. Solo usuarios autenticados pueden subir/actualizar/eliminar sus avatares

Uso en tu aplicación:

```typescript
// Subir avatar
const { data, error } = await supabase.storage
    .from('profiles')
    .upload('avatars/user-id.png', file);

// Obtener URL pública
const { data: { publicUrl } } = supabase.storage
    .from('profiles')
    .getPublicUrl('avatars/user-id.png');
```

*/
