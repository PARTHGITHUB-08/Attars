import axios from 'axios';

/**
 * Axios instance for all API calls.
 * - withCredentials: true ensures HTTP-only cookies (JWT) are sent on every request.
 * - 401 responses auto-clear admin state via a custom event.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,          // Required for HTTP-only cookie auth
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res.data,
  err => {
    // If we get a 401, dispatch an event so the Admin page can reset auth state
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event('saurabh:unauthorized'));
    }
    const message = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
