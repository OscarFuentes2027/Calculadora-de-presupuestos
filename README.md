# Calculadora de Préstamos

Calculadora simple con tabla de amortización construida con Next.js y React.

## Desarrollo local

1. Instala dependencias
   - pnpm: `pnpm i`
   - npm: `npm i`
2. Ejecuta en desarrollo
   - pnpm: `pnpm dev`
   - npm: `npm run dev`

## Deploy en GitHub Pages

Este proyecto está configurado para exportación estática.

1. Construye la versión estática:
   - pnpm: `pnpm build`
   - npm: `npm run build`
2. El resultado estará en `out/`. Súbelo a la rama `gh-pages` o usa GitHub Actions para publicarlo.
3. Si tu repositorio es `usuario/nombre-repo`, tu sitio quedará en `https://usuario.github.io/nombre-repo/`.

Notas:
- La configuración establece `output: 'export'` y `trailingSlash: true` para compatibilidad con Pages.
- Si usas un subdirectorio personalizado, ajusta rutas absolutas si hiciera falta.
