import { useState, useEffect, useCallback } from 'react';
import { login, register, getMe, logout, isAuthenticated } from '@/api/services/auth';
import type { User, LoginParams, RegisterParams } from '@/api/types';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isLoggedIn: false,
  });

  // 页面加载时自动获取用户信息
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!isAuthenticated()) {
        setState({ user: null, loading: false, isLoggedIn: false });
        return;
      }

      try {
        const res = await getMe();
        if (!cancelled && (res.code === 0 || res.code === 200)) {
          setState({ user: res.data, loading: false, isLoggedIn: true });
        }
      } catch {
        if (!cancelled) {
          setState({ user: null, loading: false, isLoggedIn: false });
        }
      }
    }

    init();

    // 监听全局登出事件
    const handleLogout = () => {
      setState({ user: null, loading: false, isLoggedIn: false });
    };
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      cancelled = true;
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const handleLogin = useCallback(async (params: LoginParams) => {
    const res = await login(params);
    if (res.code === 0 || res.code === 200) {
      setState({ user: res.data.user, loading: false, isLoggedIn: true });
      toast.success('登录成功');
      return true;
    }
    toast.error(res.message || '登录失败');
    return false;
  }, []);

  const handleRegister = useCallback(async (params: RegisterParams) => {
    const res = await register(params);
    if (res.code === 0 || res.code === 200) {
      setState({ user: res.data.user, loading: false, isLoggedIn: true });
      toast.success('注册成功');
      return true;
    }
    toast.error(res.message || '注册失败');
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setState({ user: null, loading: false, isLoggedIn: false });
    toast.success('已退出登录');
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    isLoggedIn: state.isLoggedIn,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
