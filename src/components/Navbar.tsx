import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Compass, Clock, Upload, LogIn, Menu, Home, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavbarProps {
  user: { name: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/map', label: '景点地图', icon: Map },
  { path: '/spots', label: '红色文化', icon: Mountain },
  { path: '/timeline', label: '历史时间轴', icon: Clock },
  { path: '/route-plan', label: '路线规划', icon: Compass },
  { path: '/upload', label: '上传资源', icon: Upload },
];

export function Navbar({ user, onLoginClick, onLogout }: NavbarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-red-700 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline">广西红色旅游资源信息平台</span>
          <span className="sm:hidden">红色广西</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:text-red-700 hover:bg-red-50/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">欢迎，{user.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                退出
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="hidden md:flex bg-red-700 hover:bg-red-800"
              onClick={onLoginClick}
            >
              <LogIn className="w-4 h-4 mr-1" />
              登录 / 注册
            </Button>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center gap-2 text-red-700 font-bold text-lg px-2">
                  <Map className="w-6 h-6" />
                  红色广西
                </div>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-red-50 text-red-700'
                          : 'text-gray-600 hover:text-red-700 hover:bg-red-50/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="border-t pt-4 mt-2">
                  {user ? (
                    <div className="flex flex-col gap-2 px-2">
                      <span className="text-sm text-gray-600">欢迎，{user.name}</span>
                      <Button variant="outline" size="sm" onClick={() => { onLogout(); setMobileOpen(false); }}>
                        退出登录
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-red-700 hover:bg-red-800"
                      onClick={() => { onLoginClick(); setMobileOpen(false); }}
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      登录 / 注册
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}