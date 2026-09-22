import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Emit indexing controls before JavaScript runs, using the same editable data.
function siteMetadata(): Plugin {
  const readSite = () =>
    JSON.parse(
      readFileSync(new URL("./src/data/site.json", import.meta.url), "utf8"),
    ) as {
      noindex: boolean;
      favicon: string;
      faviconSvg: string;
      appleTouchIcon: string;
    };
  const assetPath = (path: string) =>
    path.startsWith("/") ? path : `/${path}`;
  const robots = () =>
    `User-agent: *\n${readSite().noindex ? "Disallow: /" : "Allow: /"}\n`;
  return {
    name: "ciren-site-metadata",
    transformIndexHtml() {
      const site = readSite();
      return [
        ...(site.noindex
          ? [
              {
                tag: "meta",
                attrs: { name: "robots", content: "noindex, nofollow" },
              },
            ]
          : []),
        ...(site.favicon
          ? [
              {
                tag: "link",
                attrs: { rel: "icon", href: assetPath(site.favicon) },
              },
            ]
          : []),
        ...(site.faviconSvg
          ? [
              {
                tag: "link",
                attrs: {
                  rel: "icon",
                  type: "image/svg+xml",
                  href: assetPath(site.faviconSvg),
                },
              },
            ]
          : []),
        ...(site.appleTouchIcon
          ? [
              {
                tag: "link",
                attrs: {
                  rel: "apple-touch-icon",
                  href: assetPath(site.appleTouchIcon),
                },
              },
            ]
          : []),
      ];
    },
    configureServer(server) {
      server.middlewares.use("/robots.txt", (_request, response) => {
        response.setHeader("Content-Type", "text/plain");
        response.end(robots());
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: robots(),
      });
    },
  };
}

export default defineConfig({ plugins: [react(), siteMetadata()] });
