// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverComponentsExternalPackages: ["prisma"],
    },
    output: "standalone",
};


