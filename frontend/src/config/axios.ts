import axios from 'axios';

let refreshPromise: Promise<string> | null = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(
                `${api.defaults.baseURL}/auth-users/refresh-token`,
                null,
                { headers: { Authorization: `Bearer ${refreshToken}` } },
              )
              .then(({ data }) => {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                return data.accessToken as string;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }

          const accessToken = await refreshPromise;
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          refreshPromise = null;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
