import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png"],
      manifest: {
        name: "Daily Witness",
        short_name: "Witness",
        start_url: "/Daily-Witness/",
        scope: "/Daily-Witness/",
        display: "standalone",
        background_color: "#f4f1ea",
        theme_color: "#f4f1ea",
        icons: [
          { src: "/Daily-Witness/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/Daily-Witness/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ],
  base: "/Daily-Witness/"
});
