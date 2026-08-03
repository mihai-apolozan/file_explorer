import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Set HMR_CLIENT_PORT in client/.env (gitignored) when the dev server is reached
  // through a tunnel on a local port other than 5173, so HMR connects to the port
  // the browser actually sees.
  const env = loadEnv(mode, process.cwd(), '')
  const clientPort = Number(env.HMR_CLIENT_PORT)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:8000'
      },
      hmr: clientPort ? { clientPort } : undefined
    }
  }
});
