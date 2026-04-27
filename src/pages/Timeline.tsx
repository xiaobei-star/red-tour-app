import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, MapPin, Calendar, Star, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redCultures, scenicSpots, historyPeriods } from '@/data/mockData';

export function Timeline() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const filteredCultures = selectedPeriod === 'all'
    ? redCultures
    : redCultures.filter((c) => c.historyPeriod === selectedPeriod);

  const periodOrder = ['近代屈辱与抗争', '土地革命战争时期', '抗日战争时期', '解放战争时期', '社会主义建设时期', '改革开放时期'];
  const groupedCultures = periodOrder.map((period) => ({
    period,
    items: filteredCultures.filter((c) => c.historyPeriod === period),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-amber-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm mb-6 backdrop-blur-sm">
            <Clock className="w-4 h-4" />
            时间-空间双轴叙事
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">红色历史时间轴</h1>
          <p className="text-red-100 max-w-2xl mx-auto text-lg">
            以时间为线索，以空间为关联，纵览广西红色文化的历史脉络
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Period Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-500 mr-2">历史时期:</span>
            {historyPeriods.map((period) => (
              <Badge
                key={period.key}
                variant={selectedPeriod === period.key ? 'default' : 'outline'}
                className={`cursor-pointer text-xs ${selectedPeriod === period.key ? 'bg-red-700 hover:bg-red-800' : 'hover:bg-red-50'}`}
                onClick={() => setSelectedPeriod(period.key)}
              >
                {period.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        {selectedPeriod === 'all' ? (
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-red-200 md:-translate-x-px" />

            <div className="space-y-8">
              {groupedCultures.map((group) => (
                <div key={group.period}>
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-red-600 border-4 border-red-100 md:-translate-x-2 z-10" />
                    <div className="ml-12 md:ml-0 bg-red-700 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                      {group.period}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {group.items.map((culture, idx) => {
                      const spot = scenicSpots.find((s) => s.id === culture.tourId);
                      const isLeft = idx % 2 === 0;
                      return (
                        <div
                          key={culture.id}
                          className={`relative flex flex-col md:flex-row items-start gap-4 ${isLeft ? '' : 'md:flex-row-reverse'}`}
                        >
                          <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-red-400 border-2 border-white shadow md:-translate-x-1.5 mt-6 z-10" />

                          <div className={`ml-10 md:ml-0 w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
                            <Link to={`/spot/${culture.tourId}`}>
                              <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                                <CardContent className="p-5">
                                  <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-lg bg-gray-200 shrink-0 overflow-hidden">
                                      <img
                                        src={`https://placehold.co/200x200/7f1d1d/ffffff?text=${encodeURIComponent(culture.tourName.substring(0, 4))}`}
                                        alt={culture.tourName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-1 mb-1">
                                        {culture.title}
                                      </h3>
                                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                        <MapPin className="w-3 h-3" />
                                        {spot?.name}
                                      </div>
                                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{culture.lssj}</p>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs bg-red-50 text-red-700">
                                          {culture.historyPeriod}
                                        </Badge>
                                        {spot && (
                                          <div className="flex items-center gap-1 text-xs text-amber-500">
                                            <Star className="w-3 h-3 fill-current" />
                                            {spot.score}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCultures.map((culture) => {
              const spot = scenicSpots.find((s) => s.id === culture.tourId);
              return (
                <Link key={culture.id} to={`/spot/${culture.tourId}`}>
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group h-full flex flex-col">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <img
                        src={`https://placehold.co/500x300/7f1d1d/ffffff?text=${encodeURIComponent(culture.title.substring(0, 6))}`}
                        alt={culture.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded bg-red-600/90 text-white text-xs">
                          {culture.historyPeriod}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                        {culture.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 flex-1">{culture.lssj}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {spot?.name}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {filteredCultures.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">该时期暂无数据</h3>
            <p className="text-gray-500">请尝试选择其他历史时期</p>
          </div>
        )}
      </div>
    </div>
  );
}