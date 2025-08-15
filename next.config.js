/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Let us: import PortalSvg from "@/public/brand/Phambili_Portal.svg";
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|jsx)$/] },
      use: [{ loader: '@svgr/webpack', options: { icon: false } }],
    });
    return config;
  },
};
module.exports = nextConfig;
