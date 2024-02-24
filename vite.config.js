/* global __dirname */
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "esnext", //browsers can handle the latest ES features
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
