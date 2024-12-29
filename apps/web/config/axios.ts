import { getSession, updateTokens } from "@/lib/session";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors for authorization token management
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession(); // Dynamically fetch session

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      return Promise.reject(error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh and error handling

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("401 Error detected. Attempting to refresh token...");

      try {
        // Fetch refresh token dynamically
        const session = await getSession();
        console.log("Current session:", session);

        if (session?.refreshToken) {
          const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: session?.refreshToken }),
          });

          if (refreshResponse.ok) {
            const { accessToken, refreshToken } = await refreshResponse.json();
            console.log("New Access Token:", accessToken);

            // Update state
            // await updateTokens({
            //   accessToken,
            //   refreshToken,
            // });

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            const updateRes = await fetch(
              "http://localhost:3000/api/auth/update",
              {
                method: "POST",
                body: JSON.stringify({
                  accessToken,
                  refreshToken,
                }),
              }
            );
            if (!updateRes.ok) throw new Error("Failed to update the tokens");

            return axiosInstance(originalRequest);
          } else {
            console.error("Refresh token failed:", refreshResponse.statusText);
          }
        }
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
      }
    }

    return Promise.reject(error); // Pass the error if refresh fails
  }
);

// TODO: Function to log errors to an external service (e.g., Sentry or LogRocket)
// function logToMonitoringService(error: any) {
//   // Example: Sentry.captureException(error);
// }
