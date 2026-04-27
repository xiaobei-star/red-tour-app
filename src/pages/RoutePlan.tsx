import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navigation, Car, Bus, Footprints, Bike, Star, ChevronRight, LocateFixed, Route } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scenicSpots, themeRoutes } from '@/data/mockData';

type TravelMode = 'driving' | 'bus' | 'walking' | 'riding';

const modeIcons = { driving: Car, bus: Bus, walking: Footprints, riding: Bike };
const modeLabels = { driving: '驾车', bus: '公交', walking: '步行', riding: '骑行' };

export function RoutePlan() {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('target');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endSpot, setEndSpot] = useState<string>(targetId || '');
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);

  const targetSpot = scenicSpots.find((s) => s.id === endSpot);

  useEffect(() => {
    if (window.AMap && mapContainerRef.current) {
      const AMap = window.AMap;
      const map = new AMap.Map(mapContainerRef.current, {
        center: [108.3275, 22.8152],
        zoom: 7,
      });
      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar());
      mapRef.current = map;
      setIsReady(true);
    }
  }, []);

  const handleLocate = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setStartPoint(coords);
          setIsLocating(false);
          if (mapRef.current) {
            mapRef.current.setCenter(coords);
            mapRef.current.setZoom(14);
            const AMap = window.AMap;
            const marker = new AMap.Marker({
              position: coords,
              label: { content: '我的位置', direction: 'top' },
            });
            mapRef.current.add(marker);
          }
        },
        () => {
          alert('定位失败，请手动选择起点');
          setIsLocating(false);
        }
      );
    }
  };

  const handlePlanRoute = () => {
    if (!targetSpot) { alert('请选择目的地景点'); return; }
    const start = startPoint || [108.3275, 22.8152];
    const end: [number, number] = [targetSpot.longitude, targetSpot.latitude];
    const mockDistance = Math.floor(Math.random() * 300 + 50);
    const durationMap = { driving: Math.floor(mockDistance * 1.2), bus: Math.floor(mockDistance * 2.5), walking: Math.floor(mockDistance * 12), riding: Math.floor(mockDistance * 4) };
    setRouteInfo({ distance: mockDistance, duration: durationMap[travelMode], start, end, mode: travelMode });

    if (mapRef.current && window.AMap) {
      const AMap = window.AMap;
      mapRef.current.clearMap();
      const startMarker = new AMap.Marker({ position: start, label: { content: '起点', direction: 'top' }, icon: new AMap.Icon({ size: new AMap.Size(25, 34), image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png', imageSize: new AMap.Size(25, 34) }) });
      const endMarker = new AMap.Marker({ position: end, label: { content: targetSpot.name, direction: 'top' }, icon: new AMap.Icon({ size: new AMap.Size(25, 34), image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png', imageSize: new AMap.Size(25, 34) }) });
      mapRef.current.add(startMarker);
      mapRef.current.add(endMarker);
      const path = [start, [start[0] + (end[0] - start[0]) * 0.3, start[1] + (end[1] - start[1]) * 0.3 + 0.1], [start[0] + (end[0] - start[0]) * 0.7, start[1] + (end[1] - start[1]) * 0.7 - 0.05], end];
      const polyline = new AMap.Polyline({ path, strokeColor: '#b91c1c', strokeWeight: 6, strokeOpacity: 0.8, strokeStyle: 'solid' });
      mapRef.current.add(polyline);
      mapRef.current.setFitView([polyline]);
    }
  };

  const handleThemeRoute = (themeId: string) => {
    setSelectedTheme(themeId);
    const theme = themeRoutes.find((t) => t.id === themeId);
    if (!theme) return;
    const spots = theme.scenicSpotIds.map((id) => scenicSpots.find((s) => s.id === id)).filter(Boolean);
    if (spots.length < 2) return;
    if (mapRef.current && window.AMap) {
      const AMap = window.AMap;
      mapRef.current.clearMap();
      const path = spots.map((s) => [s!.longitude, s!.latitude]);
      spots.forEach((spot, idx) => {
        const marker = new AMap.Marker({ position: [spot!.longitude, spot!.latitude], label: { content: `${idx + 1}. ${spot!.name.substring(0, 6)}`, direction: 'top' } });
        mapRef.current.add(marker);
      });
      for (let i = 0; i < path.length - 1; i++) {
        const segment = [path[i], path[i + 1]];
        const polyline = new AMap.Polyline({ path: segment, strokeColor: '#b91c1c', strokeWeight: 5, strokeOpacity: 0.7, strokeStyle: 'dashed' });
        mapRef.current.add(polyline);
      }
      mapRef.current.setFitView();
    }
    setRouteInfo({ isTheme: true, themeName: theme.routeName, spots });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} 分钟`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} 小时 ${m > 0 ? m + ' 分钟' : ''}`;
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row">
      <div className="w-full md:w-96 bg-white border-r flex flex-col shrink-0 h-[45vh] md:h-auto overflow-y-auto">
        <div className="p-4 md:p-5 border-b space-y-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Route className="w-5 h-5 text-red-600" />
            路线规划
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">起点</label>
            <div className="flex gap-2">
              <div className="flex-1 p-2.5 bg-gray-50 rounded-lg border text-sm text-gray-600">
                {startPoint ? '已定位当前位置' : '请选择起点'}
              </div>
              <Button size="sm" variant="outline" onClick={handleLocate} disabled={isLocating}>
                <LocateFixed className="w-4 h-4 mr-1" />
                {isLocating ? '定位中...' : '定位'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">目的地</label>
            <Select value={endSpot} onValueChange={setEndSpot}>
              <SelectTrigger><SelectValue placeholder="选择目标景点" /></SelectTrigger>
              <SelectContent>
                {scenicSpots.map((spot) => (
                  <SelectItem key={spot.id} value={spot.id}>{spot.name} ({spot.dqList})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">出行方式</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(modeLabels) as TravelMode[]).map((mode) => {
                const Icon = modeIcons[mode];
                return (
                  <button key={mode} onClick={() => setTravelMode(mode)} className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs transition-colors ${travelMode === mode ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <Icon className="w-5 h-5" />{modeLabels[mode]}
                  </button>
                );
              })}
            </div>
          </div>

          <Button className="w-full bg-red-700 hover:bg-red-800" onClick={handlePlanRoute} disabled={!endSpot}>
            <Navigation className="w-4 h-4 mr-2" />开始规划
          </Button>
        </div>

        <div className="p-5 border-b">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">推荐主题路线</h3>
          <div className="space-y-2">
            {themeRoutes.map((theme) => (
              <button key={theme.id} onClick={() => handleThemeRoute(theme.id)} className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedTheme === theme.id ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{theme.routeName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{theme.scenicSpotIds.length} 个景点 · {theme.totalDuration}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {theme.scenicSpotIds.map((id) => {
                    const spot = scenicSpots.find((s) => s.id === id);
                    return spot ? <span key={id} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">{spot.name.substring(0, 6)}</span> : null;
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {routeInfo && (
          <div className="p-5 bg-red-50">
            <h3 className="text-sm font-semibold text-red-800 mb-3">路线信息</h3>
            {routeInfo.isTheme ? (
              <div>
                <div className="text-base font-bold text-gray-900 mb-2">{routeInfo.themeName}</div>
                <div className="space-y-2">
                  {routeInfo.spots.map((spot: any, idx: number) => (
                    <div key={spot.id} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shrink-0">{idx + 1}</span>
                      <span className="text-gray-700">{spot.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">全程距离</span><span className="font-semibold text-gray-900">{routeInfo.distance} 公里</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">预计耗时</span><span className="font-semibold text-gray-900">{formatDuration(routeInfo.duration)}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-600">出行方式</span><span className="font-semibold text-gray-900">{modeLabels[routeInfo.mode as TravelMode]}</span></div>
                {targetSpot && (
                  <Link to={`/spot/${targetSpot.id}`}>
                    <Card className="border-0 shadow-sm mt-3">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                          <img src={`https://placehold.co/100x100/b91c1c/ffffff?text=${encodeURIComponent(targetSpot.name.substring(0, 4))}`} alt={targetSpot.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">{targetSpot.name}</div>
                          <div className="flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="text-xs text-gray-500">{targetSpot.score}</span></div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 relative min-h-[50vh] md:min-h-0">
        <div ref={mapContainerRef} className="absolute inset-0 bg-gray-100" style={{ backgroundImage: 'url(https://placehold.co/1920x1080/f3f4f6/9ca3af?text=路线地图)', backgroundSize: 'cover' }} />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">正在加载地图...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}