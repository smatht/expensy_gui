export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.0.243:8000/api',
    timeout: 10000, // 10 seconds
  },
  app: {
    name: 'Expensy',
    version: '1.0.0',
  },
} as const
