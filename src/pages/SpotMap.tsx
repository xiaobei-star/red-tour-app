import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, MapPin, X, Navigation, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ScenicSpot } from '@/types';
import { scenicSpots, cities } from '@/data/mockData';


export function SpotMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpot, setActiveSpot] = useState<ScenicSpot | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const navigate = useNavigate();

  const filteredSpots = scenicSpots.filter((spot) => {
    const matchCity = selectedCity === 'all' || spot.dqid === selectedCity;
    const matchSearch = !searchQuery || spot.name.includes(searchQuery) || spot.address.includes(searchQuery);
    return matchCity && matchSearch;
  });

  const initMap = useCallback(() => {
    if (!mapContainerRef.current || !window.AMap) return;
    
    try {
      const AMap = window.AMap;
      const map = new AMap.Map(mapContainerRef.current, {
        center: [108.3275, 22.8152],
        zoom: 7,
        viewMode: '2D',
      });

      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar({ position: 'LB' }));
      map.addControl(new AMap.MapType({ position: 'RT' }));

      mapRef.current = map;
      setIsReady(true);

      // React 中容器尺寸可能在初始化后才确定，需要延迟触发 resize
      setTimeout(() => {
        map.resize();
      }, 100);
    } catch (err) {
      console.error('地图初始化失败:', err);
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      if (cancelled) return;
      if (!window.AMap || !mapContainerRef.current) {
        timer = setTimeout(start, 300);
        return;
      }
      initMap();
    };

    start();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.AMap || !isReady) return;

    const AMap = window.AMap;
    markersRef.current.forEach((m) => mapRef.current.remove(m));
    markersRef.current = [];

    filteredSpots.forEach((spot) => {
      const marker = new AMap.Marker({
        position: [spot.longitude, spot.latitude],
        title: spot.name,
        animation: 'AMAP_ANIMATION_DROP',
      });

      const infoContent = `
        <div style="padding:10px;min-width:220px;max-width:280px;">
          <h4 style="margin:0 0 8px;font-size:15px;font-weight:bold;color:#b91c1c;">${spot.name}</h4>
          <p style="margin:0 0 6px;font-size:12px;color:#666;line-height:1.5;">${spot.address}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
            <span style="font-size:12px;color:#f59e0b;">★ ${spot.score}</span>
            <span style="font-size:12px;color:#999;">${spot.type}</span>
          </div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid #eee;">
            <button onclick="window.handleMapDetailClick('${spot.id}')" style="font-size:12px;color:#b91c1c;border:none;background:none;cursor:pointer;text-decoration:underline;">查看详情 →</button>
          </div>
        </div>
      `;

      const infoWindow = new AMap.InfoWindow({
        content: infoContent,
        offset: new AMap.Pixel(0, -30),
      });

      marker.on('click', () => {
        infoWindow.open(mapRef.current, marker.getPosition());
        setActiveSpot(spot);
      });

      mapRef.current.add(marker);
      markersRef.current.push(marker);
    });

    (window as any).handleMapDetailClick = (id: string) => {
      navigate(`/spot/${id}`);
    };
  }, [filteredSpots, isReady, navigate]);

  const handleSpotClick = (spot: ScenicSpot) => {
    if (mapRef.current) {
      mapRef.current.setCenter([spot.longitude, spot.latitude]);
      mapRef.current.setZoom(13);
    }
    setActiveSpot(spot);
  };

  const handleLocateCurrent = () => {
    if (!mapRef.current || !window.AMap) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { longitude, latitude } = pos.coords;
        mapRef.current.setCenter([longitude, latitude]);
        mapRef.current.setZoom(14);
        
        const marker = new window.AMap.Marker({
          position: [longitude, latitude],
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(25, 25),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
            imageSize: new window.AMap.Size(25, 25),
          }),
          offset: new window.AMap.Pixel(-12, -25),
        });
        mapRef.current.add(marker);
      });
    }
  };

  const spotsByCity = cities.map((city) => ({
    city,
    spots: scenicSpots.filter((s) => s.dqid === city.id),
  })).filter((g) => g.spots.length > 0);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* 侧边栏 */}
      <div className="w-full md:w-80 bg-white border-r flex flex-col shrink-0 h-[40vh] md:h-auto overflow-hidden">
        <div className="p-3 md:p-4 border-b space-y-2 md:space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索景点..."
              className="pl-9"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 md:gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedCity === 'all' ? 'default' : 'outline'}
              className={selectedCity === 'all' ? 'bg-red-700 hover:bg-red-800' : ''}
              onClick={() => setSelectedCity('all')}
            >
              全部
            </Button>
            {cities.filter((c) => scenicSpots.some((s) => s.dqid === c.id)).map((city) => (
              <Button
                key={city.id}
                size="sm"
                variant={selectedCity === city.id ? 'default' : 'outline'}
                className={selectedCity === city.id ? 'bg-red-700 hover:bg-red-800' : ''}
                onClick={() => setSelectedCity(city.id)}
              >
                {city.city.replace('市', '')}
              </Button>
            ))}
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {activeSpot && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-red-800 text-sm">{activeSpot.name}</h4>
                  <button onClick={() => setActiveSpot(null)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{activeSpot.address}</p>
                <Button
                  size="sm"
                  className="mt-2 w-full bg-red-700 hover:bg-red-800"
                  onClick={() => navigate(`/spot/${activeSpot.id}`)}
                >
                  查看详情
                </Button>
              </div>
            )}
            {searchQuery ? (
              <div className="space-y-1">
                {filteredSpots.map((spot) => (
                  <button
                    key={spot.id}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    onClick={() => handleSpotClick(spot)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-medium text-sm text-gray-900 group-hover:text-red-700">
                        {spot.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6 mt-0.5 line-clamp-1">{spot.address}</p>
                  </button>
                ))}
                {filteredSpots.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">未找到匹配的景点</div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {(selectedCity === 'all' ? spotsByCity : spotsByCity.filter((g) => g.city.id === selectedCity)).map((group) => (
                  <div key={group.city.id}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {group.city.city}
                    </div>
                    <div className="space-y-0.5">
                      {group.spots.map((spot) => (
                        <button
                          key={spot.id}
                          className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                          onClick={() => handleSpotClick(spot)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900 group-hover:text-red-700">
                              {spot.name}
                            </span>
                            <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-red-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 地图区域 */}
      <div className="flex-1 relative min-h-[50vh] md:min-h-0">
        <div
          ref={mapContainerRef}
          className="absolute inset-0 bg-gray-100"
          style={{ backgroundImage: 'url(https://placehold.co/1920x1080/f3f4f6/9ca3af?text=地图加载中...)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        {!isReady && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">正在加载地图...</p>
              <p className="text-xs text-gray-400 mt-1">请确保网络连接正常</p>
            </div>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-sm px-6">
              <MapPin className="w-12 h-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">地图加载失败</h3>
              <p className="text-sm text-gray-500 mb-4">
                检测到高德地图 API 未正确加载，请检查：
              </p>
              <ul className="text-left text-sm text-gray-500 mb-6 space-y-2 bg-white rounded-lg p-4 border">
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">1.</span>
                  <span>是否已在 <code className="bg-gray-100 px-1 rounded text-red-600">index.html</code> 中填入有效的高德 Key</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">2.</span>
                  <span>Key 的服务平台是否选择了「Web端(JS API)」</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">3.</span>
                  <span>当前网络能否访问 <code className="bg-gray-100 px-1 rounded">webapi.amap.com</code></span>
                </li>
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://lbs.amap.com/api/javascript-api/guide/abc/prepare', '_blank')}
              >
                查看申请教程
              </Button>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="shadow-lg bg-white hover:bg-gray-50"
            onClick={handleLocateCurrent}
            title="定位到当前位置"
          >
            <Navigation className="w-5 h-5 text-red-600" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="shadow-lg bg-white hover:bg-gray-50"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setCenter([108.3275, 22.8152]);
                mapRef.current.setZoom(7);
              }
            }}
            title="恢复全图"
          >
            <Layers className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}