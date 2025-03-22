import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: "/news-app/",  // Replace "news-app" with your repo name
  plugins: [react()]
});
