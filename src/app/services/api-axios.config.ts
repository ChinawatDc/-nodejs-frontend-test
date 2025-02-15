import { getPairTokens } from "../libs/token";
import { notification } from "antd";
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BASEURL_API || "http://192.168.0.100:100/api";
const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  async (config) => {
    const { accessToken } = getPairTokens();
    const auth = accessToken ? `Bearer ${accessToken}` : "";
    config.headers.Authorization = auth;
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  async function (error) {
    notification.error({
      placement: "topRight",
      message:
        error.response?.data?.message ||
        "มีข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง",
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      notification.error({
        placement: "topRight",
        message: "Invalid Refresh Token",
      });
      // localStorage.clear();
      // sessionStorage.clear();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
