import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import htmlTemplate from "vite-plugin-html-template"
import VitePluginHtmlEnv from "vite-plugin-html-env"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginHtmlEnv(),
    // htmlTemplate({
    //   pagesDir: "./src",
    //   pages: {
    //     index: {
    //       template: "./index.html",
    //       title: "home",
    //     },
    //   },
    // }),
  ],
})
