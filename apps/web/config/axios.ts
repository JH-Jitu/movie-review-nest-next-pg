import axios from "axios";
import { getSession, updateTokens } from "@/lib/session";
import Router from "next/router";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Keep track of the refresh token promise to prevent multiple refresh calls
let refreshTokenPromise: Promise<any> | null = null;
let isRedirecting = false;

// Add interceptors for authorization token management
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh and error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if it's a 401 and we haven't already tried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it instead of making a new request
        if (!refreshTokenPromise) {
          refreshTokenPromise = (async () => {
            const session = await getSession();

            if (!session?.refreshToken) {
              throw new Error("No refresh token available");
            }

            const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: session.refreshToken }),
            });

            if (!refreshResponse.ok) {
              throw new Error("Failed to refresh token");
            }

            const { accessToken, refreshToken } = await refreshResponse.json();

            // Update tokens in storage
            await fetch("http://localhost:3000/api/auth/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken, refreshToken }),
            }).then((res) => {
              if (!res.ok) throw new Error("Failed to update tokens");
            });

            return { accessToken, refreshToken };
          })();

          // Clear the promise after it resolves or rejects
          refreshTokenPromise.finally(() => {
            refreshTokenPromise = null;
          });
        }

        // Wait for the refresh to complete
        const { accessToken } = await refreshTokenPromise;

        // Update the failed request with new token and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        alert(refreshError);
        // Clear any existing refresh promise
        refreshTokenPromise = null;

        // Redirect to login
        window.location.href = `/auth/signin?redirect=${encodeURIComponent(window.location.href)}`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function handleAuthError() {
  if (isRedirecting) return;
  isRedirecting = true;

  const currentPath = window.location.pathname;
  if (!currentPath.includes("/auth/signin")) {
    Router.push(`/auth/signin?redirect=${encodeURIComponent(currentPath)}`);
  }

  setTimeout(() => {
    isRedirecting = false;
  }, 1000);
}

// TODO: Function to log errors to an external service (e.g., Sentry or LogRocket)
// function logToMonitoringService(error: any) {
//   // Example: Sentry.captureException(error);
// }
