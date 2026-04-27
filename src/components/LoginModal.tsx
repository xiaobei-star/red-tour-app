import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: { name: string }) => void;
}

export function LoginModal({ open, onOpenChange, onLogin }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) {
      alert('请填写完整的登录信息');
      return;
    }
    onLogin({ name: loginForm.username });
    onOpenChange(false);
    setLoginForm({ username: '', password: '' });
  };

  const handleRegister = () => {
    if (!registerForm.username || !registerForm.phone || !registerForm.password) {
      alert('请填写完整的注册信息');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    alert('注册成功！');
    setActiveTab('login');
    setRegisterForm({ username: '', phone: '', password: '', confirmPassword: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-red-800">
            欢迎访问红色广西
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <LogIn className="w-4 h-4 mr-1" />
              登录
            </TabsTrigger>
            <TabsTrigger value="register">
              <UserPlus className="w-4 h-4 mr-1" />
              注册
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="login-username">用户名 / 手机号</Label>
              <Input
                id="login-username"
                placeholder="请输入用户名"
                value={loginForm.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">密码</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={loginForm.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full bg-red-700 hover:bg-red-800" onClick={handleLogin}>
              登录
            </Button>
            <p className="text-xs text-gray-500 text-center">
              未登录也可以浏览地图、景点信息，发表评论需要登录
            </p>
          </TabsContent>
          <TabsContent value="register" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reg-username">用户名</Label>
              <Input
                id="reg-username"
                placeholder="请输入用户名"
                value={registerForm.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({ ...registerForm, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone">手机号</Label>
              <Input
                id="reg-phone"
                placeholder="请输入手机号"
                value={registerForm.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">密码</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="请输入密码"
                value={registerForm.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-confirm">确认密码</Label>
              <Input
                id="reg-confirm"
                type="password"
                placeholder="请再次输入密码"
                value={registerForm.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              />
            </div>
            <Button className="w-full bg-red-700 hover:bg-red-800" onClick={handleRegister}>
              注册
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}