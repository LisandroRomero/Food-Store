import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './index.html'),
        login: path.resolve(__dirname, './src/pages/auth/login/login.html'),
        admin: path.resolve(__dirname, './src/pages/admin/index.html'),
        client: path.resolve(__dirname, './src/pages/client/index.html'),
      },
    },
  },
  //root: 'Food-Store',
  publicDir: 'public',
})