import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// 从环境变量读取后端地址，开发时走 Vite 代理
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建 axios 实例
const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动附加 JWT Token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一错误处理
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ code?: number; message?: string; detail?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const msg =
        error.response.data?.message ||
        error.response.data?.detail ||
        error.message;

      switch (status) {
        case 401:
          toast.error('登录已过期，请重新登录');
          localStorage.removeItem('access_token');
          // 触发全局登录状态重置（可选）
          window.dispatchEvent(new CustomEvent('auth:logout'));
          break;
        case 403:
          toast.error('没有权限执行此操作');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 422:
          toast.error(`参数错误：${msg}`);
          break;
        case 500:
          toast.error('服务器内部错误，请稍后重试');
          break;
        default:
          toast.error(msg || '请求失败');
      }
    } else if (error.request) {
      toast.error('网络连接失败，请检查网络');
    } else {
      toast.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export default client;
