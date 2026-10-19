# 🌸 Florecemos en el servicio — Árbol colaborativo de ideas

Una mini app en React para que el equipo responda **“¿Cómo podemos diferenciarnos?”**. Cada comentario se convierte en una flor azul; al tocarla, aparece la idea y quién la compartió.

## Incluye
- Diseño adaptable a computador y celular.
- Árbol ilustrado y flores interactivas.
- Formulario para compartir ideas (nombre opcional, comentario de hasta 280 caracteres).
- Supabase para guardar ideas compartidas entre dispositivos y actualizarlas en vivo.
- Publicación automática en GitHub Pages con GitHub Actions.

## 1. Crear la base de datos (Supabase)
1. Crea un proyecto gratuito en [Supabase](https://supabase.com/).
2. Abre **SQL Editor → New query**.
3. Copia y ejecuta todo el contenido de `supabase/schema.sql`.
4. En **Project Settings → API** (o **Connect**) copia el **Project URL** y la **publishable/anon key**. En el frontend solo uses la clave pública `anon`/publishable; nunca pongas una `service_role` key en esta app.

## 2. Probar en tu computador
Necesitas Node.js 20 o superior.
```bash
npm install
cp .env.example .env
```
Edita `.env` y agrega los valores de Supabase:
```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLICA_ANON
```
Después ejecuta:
```bash
npm run dev
```
Abre la URL local que te muestra la terminal. Sin credenciales, la app funciona en modo demostración, pero las ideas no se guardan ni se comparten entre dispositivos.

## 3. Subir el código a GitHub
1. Crea un repositorio nuevo en GitHub, por ejemplo `arbol-de-ideas`.
2. Sube todos los archivos de esta carpeta a la rama `main` (incluida la carpeta oculta `.github`).
3. En tu repositorio abre **Settings → Secrets and variables → Actions → New repository secret**.
4. Crea estos dos secretos:
   - `VITE_SUPABASE_URL` = URL del proyecto de Supabase.
   - `VITE_SUPABASE_ANON_KEY` = clave pública anon/publishable de Supabase.
5. Ve a **Settings → Pages** y en **Build and deployment** selecciona **GitHub Actions**.
6. Abre **Actions** y espera a que termine el flujo **Deploy to GitHub Pages**.
7. GitHub mostrará la dirección pública de tu aplicación en **Settings → Pages**.

## Importante sobre privacidad y moderación
Esta configuración permite que cualquier visitante lea las ideas y publique nuevas sin iniciar sesión, tal como necesita un mural colaborativo abierto. No permite editar ni borrar ideas desde la app. Como el mural es público, evita publicar datos personales o información clínica. Si necesitas moderación, se puede agregar aprobación antes de que las flores aparezcan en el árbol.

## Personalización rápida
- Colores, tamaños y estilos: `src/styles.css`.
- Texto y contenido: `src/App.jsx`.
- Estructura de la base de datos y permisos: `supabase/schema.sql`.
