import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: {
      apiUrl: 'https://moneymind-be.onrender.com',
    },
    setupNodeEvents(_on, _config) {
      return _config
    },
  },
})