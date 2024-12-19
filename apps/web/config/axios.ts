import { getSession, updateTokens } from "@/lib/session";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for auth
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Dynamically get session
      const session = await getSession();

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      // Optionally log to external service
      // logToMonitoringService(error);
      return Promise.reject(error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let retryCount = 0;
const maxRetries = 3;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle various HTTP statuses
    if (error.response) {
      const status = error.response.status;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const session = await getSession(); // Dynamically fetch the refresh token
          if (session?.refreshToken) {
            const response = await axios.post(`${baseURL}/auth/refresh`, {
              refresh: session.refreshToken,
            });

            const { accessToken } = response.data;

            // Update the session with the new tokens
            await updateTokens({
              accessToken,
              refreshToken: session.refreshToken,
            });

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          // Optionally log to external service
          // logToMonitoringService(refreshError);
          alert("Session expired. Please sign in again.");
          window.location.href = `/auth/signin?redirect=${encodeURIComponent(window.location.href)}`;
          return Promise.reject(refreshError);
        }
      }

      if (status === 403) {
        // Handle forbidden errors
        alert("You do not have permission to access this resource.");
      }

      if (status === 500) {
        // Handle server errors
        alert("Server error, please try again later.");
      }
    }

    // Retry logic with retry count and maximum retries
    if (retryCount < maxRetries) {
      retryCount++;
      return axiosInstance(originalRequest);
    } else {
      alert("Request failed multiple times.");
      return Promise.reject(error);
    }
  }
);

// TODO: Function to log errors to an external service
// function logToMonitoringService(error: any) {
//   // Send error data to external monitoring service (e.g., Sentry, LogRocket)
//   // Example:
//   // Sentry.captureException(error);
// }
