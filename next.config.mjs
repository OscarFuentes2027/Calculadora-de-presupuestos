const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim()
const normalizedBasePath = rawBasePath
  ? (rawBasePath.startsWith('/') ? rawBasePath : `/${rawBasePath}`)
  : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  ...(normalizedBasePath
    ? { basePath: normalizedBasePath, assetPrefix: normalizedBasePath }
    : {}),
}

export default nextConfig
