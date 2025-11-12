import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3009/api", // Global prefix 추가
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    console.error("에러 상세:", error.response?.data);
    console.error("상태 코드:", error.response?.status);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("Response error:", error);
    console.error("Response data:", error.response?.data);
    console.error("Response status:", error.response?.status);
    return Promise.reject(error);
  }
);

export default apiClient;
