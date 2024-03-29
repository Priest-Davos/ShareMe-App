import { defineConfig } from 'vite'
// const Dotenv = require('dotenv-webpack');
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
