import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/mindbox-todo-test/",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
