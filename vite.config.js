import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://cekstok.murtiaji.com/",
  build: { chunkSizeWarningLimit: 1600 },
});
