/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: gist.githubusercontent.com;",
    domains: ['gist.githubusercontent.com'],
  },
  webpack(config) {
    // This allows Next.js to properly handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
};

module.exports = nextConfig; 