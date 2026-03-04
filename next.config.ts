import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  serverExternalPackages: ["pdfkit", "svg-to-pdfkit", "fontkit", "restructure", "iconv-lite"]
};

export default nextConfig;
