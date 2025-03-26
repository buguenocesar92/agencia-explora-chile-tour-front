// plugins/axios.ts
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import cookie from 'cookie';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.API_URL

  const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    timeout: 60000,
    withCredentials: true,
  });

  interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }

  let isRefreshing = false;
  let failedQueue: FailedRequest[] = [];

  function processQueue(error: unknown, token: string | null = null): void {
    failedQueue.forEach(({ resolve, reject }) => {
      if (token) {
        resolve(token);
      } else {
        reject(error);
      }
    });
    failedQueue = [];
  }

  // Interceptor de requests: agrega el token de autenticación al header
  axiosInstance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      let token: string | undefined;
      if (import.meta.env.SSR) {
        // En SSR, extraemos las cookies desde el header usando event.node.req
        const event = nuxtApp.ssrContext?.event;
        if (event && event.node.req.headers.cookie) {
          const parsedCookies = cookie.parse(event.node.req.headers.cookie);
          token = parsedCookies.access_token;
        }
      } else {
        // En el cliente, usamos el composable useCookie
        token = useCookie('access_token').value ?? undefined;
      }
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      return requestConfig;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Interceptor de respuestas: maneja errores 401 y refresh token
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // Si se está intentando el login, no se reintenta el refresh token
        if (originalRequest.url?.includes('/auth/login')) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          let refreshToken: string | undefined;
          if (import.meta.env.SSR) {
            const event = nuxtApp.ssrContext?.event;
            if (event && event.node.req.headers.cookie) {
              const parsedCookies = cookie.parse(event.node.req.headers.cookie);
              refreshToken = parsedCookies.refresh_token;
            }
          } else {
            refreshToken = useCookie('refresh_token').value ?? undefined;
          }
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Solicitar un nuevo access token
          const response = await axios.post(`${baseURL}/auth/refresh`, null, {
            headers: { Authorization: `Bearer ${refreshToken}` },
            withCredentials: true,
          });

          const { access_token, refresh_token } = response.data;

          // Actualizar las cookies solo en el cliente
          if (!import.meta.env.SSR) {
            const accessTokenCookie = useCookie('access_token', {
              maxAge: 60 * 60 * 24 * 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });
            const refreshTokenCookie2 = useCookie('refresh_token', {
              maxAge: 60 * 60 * 24 * 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });
            accessTokenCookie.value = access_token;
            refreshTokenCookie2.value = refresh_token;
          }

          processQueue(null, access_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          if (!import.meta.env.SSR) {
            const accessTokenCookie = useCookie('access_token');
            const refreshTokenCookie = useCookie('refresh_token');
            accessTokenCookie.value = null;
            refreshTokenCookie.value = null;
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  // Inyecta la instancia para usarla en la aplicación vía $axios
  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
