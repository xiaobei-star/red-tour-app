import { Map, Heart, Mail, Phone, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              广西红色旅游资源信息平台
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              基于 WebGIS 技术构建的广西红色旅游资源展示与互动平台，
              致力于红色文化的数字化传承与旅游产业的创新发展。
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">快速导航</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="hover:text-red-400 transition-colors">首页</Link>
              <Link to="/map" className="hover:text-red-400 transition-colors">景点地图</Link>
              <Link to="/spots" className="hover:text-red-400 transition-colors">红色文化</Link>
              <Link to="/timeline" className="hover:text-red-400 transition-colors">历史时间轴</Link>
              <Link to="/route-plan" className="hover:text-red-400 transition-colors">路线规划</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@redtour-gx.edu.cn</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0771-1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>桂林理工大学测绘地理信息学院</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p> 2025 广西红色旅游资源信息平台. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for red culture heritage
          </p>
        </div>
      </div>
    </footer>
  );
}