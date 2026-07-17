/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@dossier-x/ui",
    "@dossier-x/i18n",
    "@dossier-x/storage",
    "@dossier-x/types",
    "@dossier-x/case-parser",
  ],
};

module.exports = nextConfig;
