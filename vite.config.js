import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://fauziits.my.id/",
  build: { chunkSizeWarningLimit: 1600 },
});
