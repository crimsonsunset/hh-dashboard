import axios from 'axios'

/**
 * Configured axios instance for API calls
 * Base URL points to /data for mock data, easily swappable to real API endpoint
 */
export const apiClient = axios.create({
  baseURL: '/data',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Response interceptor for centralized error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

