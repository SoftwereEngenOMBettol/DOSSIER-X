/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@dossier-x/ui", "@dossier-x/i18n", "@dossier-x/types"],
};

module.exports = nextConfig;
