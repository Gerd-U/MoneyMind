import type { Configuration } from "./configuration"

export const config: Configuration = {
  api: {
    url: import.meta.env.VITE_API_URL || 'https://moneymind-be.onrender.com',
  },
}