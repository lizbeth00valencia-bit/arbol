# Árbol de Ideas Colombianas — instalación

1. **Supabase:** abre SQL Editor → New query. Copia el contenido de `supabase/agregar_tipos_flores.sql` y ejecuta **Run**. Esto agrega el campo `flower_type` sin borrar las ideas existentes. Si ya ejecutaste este SQL, no vuelvas a crear la restricción.
2. **GitHub:** sube los archivos y carpetas de este ZIP al repositorio `arbol` en la rama `main`, conservando las rutas (`src/`, `public/`, `.github/workflows/`, etc.). No subas `node_modules` ni archivos `.env` con valores reales.
3. **GitHub Actions:** en Actions comprueba que termine en verde el flujo de publicación. Los secretos `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` deben seguir configurados por separado.
4. **Prueba:** abre tu sitio y presiona Ctrl+F5. Crea una idea, elige una flor y verifica en Supabase Table Editor → ideas que `flower_type` contiene la especie elegida.

**Nota visual:** el paisaje es una imagen ilustrativa de fondo; las flores de las ideas son botones interactivos superpuestos. En la imagen de referencia aparecen algunas flores decorativas que no representan registros. La lista real de ideas y el contador provienen de Supabase.

**Seguridad:** mantén activadas las políticas RLS; nunca uses una clave `service_role` ni `sb_secret_` en Vite.
