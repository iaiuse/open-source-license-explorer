/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
  images: {
    domains: [
      'upload.wikimedia.org',
      'www.gnu.org',
      'opensource.org',
      'licensebuttons.net',
      'github.com',
      'avatars.githubusercontent.com'
    ],
  },
};

export default nextConfig;
