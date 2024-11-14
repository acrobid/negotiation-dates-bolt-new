import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { plugin as mdPlugin, Mode } from "vite-plugin-markdown";

import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
/**
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Negotiation dates",
        short_name: "NegotiationDates",
        description: "Negotiation dates",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    mdPlugin({ mode: [Mode.HTML] }),
  ],
});
