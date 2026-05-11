import client from '../client';
import type { ApiResponse, User, RegisterParams, LoginParams } from '../types';

export interface LoginData {
  token: string;
  user: User;
}

/**
 * POST /auth/register
 * 用户注册
 */
export async function register(params: RegisterParams) {
  const res = await client.post<ApiResponse<LoginData>>('/auth/register', params);
  return res.data;
}

/**
 * POST /auth/login
 * 用户登录
 */
export async function login(params: LoginParams) {
  const res = await client.post<ApiResponse<LoginData>>('/auth/login', params);
  if (res.data.code === 0 || res.data.code === 200) {
    localStorage.setItem('access_token', res.data.data.token);
  }
  return res.data;
}

/**
 * GET /auth/me
 * 获取当前登录用户信息
 */
export async function getMe() {
  const res = await client.get<ApiResponse<User>>('/auth/me');
  return res.data;
}

/**
 * POST /auth/logout
 * 退出登录
 */
export function logout() {
  localStorage.removeItem('access_token');
}

/**
 * 检查本地是否有 token
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('access_token');
}
