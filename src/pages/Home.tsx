import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Map, Mountain, Clock, Compass, Upload, ChevronRight, Star, MapPin, Users, Route, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { scenicSpots, cities } from '@/data/mockData';

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featuredSpots = scenicSpots.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[560px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1597733336794-12d05021d510?w=1920&q=80"
            alt="红色广西"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-sm mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-red-400" />
            基于 WebGIS 的广西红色旅游资源信息平台
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            追寻红色足迹
            <span className="block text-red-400">传承革命精神</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed">
            以地理空间融合文化叙事，沉浸式探索广西红色景点，
            让红色旅游从"走马观花"升级为"身临其境"的深度体验
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/map">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2">
                <Map className="w-5 h-5" />
                探索景点地图
              </Button>
            </Link>
            <Link to="/timeline">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                <Clock className="w-5 h-5" />
                历史时间轴
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: MapPin, label: '红色景点', value: scenicSpots.length + '+' },
              { icon: Users, label: '覆盖地市', value: cities.length + '个' },
              { icon: Route, label: '主题路线', value: '4条' },
              { icon: Mountain, label: '红色文化', value: '历史+空间' },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center py-6">
                  <stat.icon className="w-8 h-8 text-red-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 reveal opacity-0 translate-y-4 transition-all duration-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">平台核心功能</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              融合 WebGIS 技术与红色文化资源，构建集展示、互动、管理于一体的数字化平台
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Map,
                title: '地图可视化',
                desc: '基于高德地图 API，精准标注广西红色景点，支持缩放、平移、信息弹窗交互',
                color: 'bg-blue-50 text-blue-600',
                to: '/map',
              },
              {
                icon: Mountain,
                title: '红色文化展示',
                desc: '深入挖掘每个景点的历史事件、时代背景、人物事迹，多媒体沉浸式叙事',
                color: 'bg-red-50 text-red-600',
                to: '/spots',
              },
              {
                icon: Clock,
                title: '历史时间轴',
                desc: '以时间为线索组织红色文化资源，实现"时间-空间"双轴联动的叙事体验',
                color: 'bg-amber-50 text-amber-600',
                to: '/timeline',
              },
              {
                icon: Compass,
                title: '智能路线规划',
                desc: '支持驾车、公交、步行多模式路径规划，一键生成最优红色旅游路线',
                color: 'bg-emerald-50 text-emerald-600',
                to: '/route-plan',
              },
              {
                icon: Upload,
                title: 'UGC资源上传',
                desc: '用户可上传景点资源，经审核后纳入数据库，共建红色文化数字资源库',
                color: 'bg-violet-50 text-violet-600',
                to: '/upload',
              },
              {
                icon: Users,
                title: '互动交流社区',
                desc: '评论、点赞、分享功能，构建"参观-分享-讨论-再传播"的社交闭环',
                color: 'bg-pink-50 text-pink-600',
                to: '/spots',
              },
            ].map((feature) => (
              <Link key={feature.title} to={feature.to}>
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                    <div className="mt-4 flex items-center text-red-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      立即体验 <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spots */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">精选红色景点</h2>
              <p className="text-gray-500">深入了解广西红色文化的必访之地</p>
            </div>
            <Link to="/spots">
              <Button variant="ghost" className="text-red-700 hover:text-red-800 hover:bg-red-50">
                查看全部 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredSpots.map((spot) => (
              <Link key={spot.id} to={`/spot/${spot.id}`}>
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                    <img
                      src={`https://placehold.co/600x450/b91c1c/ffffff?text=${encodeURIComponent(spot.name.substring(0, 4))}`}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-xs font-medium text-gray-700">
                        {spot.type}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur text-white text-xs">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {spot.score}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-700 transition-colors line-clamp-1">
                      {spot.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {spot.address}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{spot.introduction}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-red-700 to-red-900 p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">开启您的红色之旅</h2>
            <p className="text-red-100 max-w-xl mx-auto mb-8 text-lg">
              无论您是计划研学、家庭出游还是深度文化探索，我们都为您准备好了最完整的广西红色旅游指南
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/route-plan">
                <Button size="lg" className="bg-white text-red-700 hover:bg-red-50 gap-2">
                  <Compass className="w-5 h-5" />
                  规划我的路线
                </Button>
              </Link>
              <Link to="/map">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                  <Map className="w-5 h-5" />
                  浏览景点地图
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}