/** @type {import('next').NextConfig} */
const isGH = process.env.GITHUB_PAGES === 'true'
const repo = 'Calculadora-de-presupuestos' // <-- cámbialo

export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: isGH ? `/${repo}` : '',
  assetPrefix: isGH ? `/${repo}/` : undefined,
  // opcional si tienes problemas con rutas:
  // trailingSlash: true,
}
