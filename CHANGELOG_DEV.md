# Bitácora de Desarrollo - App Hábitos (Sanctuary)

Este archivo contiene el registro de cambios, errores encontrados y sus soluciones para evitar repetirlos en el futuro.

## 📅 15 de Abril, 2026

### 1. Error: Pantalla en Blanco en GitHub Pages (Error 404 / _expo)
- **Problema**: Al desplegar la web, se veía una pantalla blanca. La consola mostraba errores 404 al intentar cargar scripts dentro de la carpeta `_expo/`.
- **Causa**: GitHub Pages usa Jekyll por defecto, el cual ignora carpetas que empiezan con guion bajo (`_`). Como Expo guarda el bundle en `_expo`, el servidor no entregaba los archivos.
- **Solución**:
    1. Se creó el archivo `public/.nojekyll` para desactivar Jekyll en GitHub.
    2. Se modificó el script de `deploy` en `package.json` para incluir archivos ocultos (dotfiles).
    - **Script final**: `"deploy": "gh-pages -d dist -t"`.

---

### 2. Implementación de Autenticación con Supabase
- **Cambios**:
    - Se creó `utils/auth.tsx` con un `AuthProvider` para gestionar el estado global del usuario.
    - Se protegió el acceso a las pestañas (`(tabs)`) mediante una redirección automática a la pantalla de login si no hay sesión activa.
    - Se creó la carpeta `app/(auth)/` con el archivo `login.tsx`.

---

### 3. Mejora de UX en el Registro de Usuario
- **Problema**: El flujo de "Crear Cuenta" era confuso porque había dos botones de acción principal y no se daba feedback claro sobre la confirmación por email.
- **Solución**:
    - Se implementó un **toggle (interruptor)** de modo (Login / Registro).
    - Se simplificó la UI a un solo botón de acción dinámico.
    - Se añadió una comprobación de `data.session` en el registro. Si Supabase requiere confirmar email, se muestra un aviso explícito al usuario; de lo contrario, entra automáticamente.

---

### 4. Nuevos campos en el Registro (Metadata)
- **Cambios**:
    - Se agregó el campo **Nombre de Usuario** al formulario cuando el modo es `Registrarse`.
    - Esta información se guarda en el objeto `user_metadata` de Supabase al crear la cuenta.
    - Se eliminó el campo "Tipo de Usuario" por requerimiento del usuario.

---

### 5. Error 404 en Sub-rutas (SPA)
- **Problema**: Al recargar la página en una ruta como `/login`, GitHub Pages devolvía un error 404.
- **Causa**: Las aplicaciones de una sola página (SPA) no tienen archivos físicos para cada ruta. GitHub Pages no sabe que debe redirigir todo a `index.html`.
- **Solución**:
    - Se modificó el script `predeploy` para que copie automáticamente el `index.html` a un nuevo archivo `404.html` en la carpeta `dist`.
    - GitHub Pages usa el archivo `404.html` como respaldo, permitiendo que el router de React tome el control de la URL.

---

### 💡 Notas Técnicas Importantes
- **Caché del Navegador**: Tras un `npm run deploy`, los cambios pueden tardar de 1 a 5 minutos en reflejarse. Siempre usar `Ctrl + F5` para recargar.
- **Confirmación de Email**: Por defecto en Supabase, los nuevos usuarios DEBEN confirmar su correo para poder iniciar sesión. Se debe revisar la bandeja de entrada tras registrarse.

---

### 🚀 Reglas de Flujo de Trabajo (Workflow)
Para asegurar que la aplicación esté siempre actualizada y funcional en producción:
1. **Sincronización Git**: Cada cambio funcional debe ser guardado (`git add .`), confirmado (`git commit`) y subido (`git push`) al repositorio de GitHub inmediatamente.
2. **Despliegue Continuo**: Inmediatamente después del push, se debe ejecutar `npm run deploy` para actualizar la versión web en GitHub Pages.
3. **Validación de Bitácora**: Si el cambio soluciona un error nuevo, debe quedar registrado en este archivo para evitar regresiones.
