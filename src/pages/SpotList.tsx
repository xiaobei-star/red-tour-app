import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scenicSpots } from '@/data/mockData';

const spotTypes = ['全部', '革命遗址', '革命纪念馆', '革命旧址', '战争遗址', '历史遗址'];

export function SpotList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredSpots = scenicSpots.filter((spot) => {
    const matchSearch = !searchQuery || 
      spot.name.includes(searchQuery) || 
      spot.address.includes(searchQuery) ||
      spot.introduction.includes(searchQuery);
    const matchType = selectedType === '全部' || spot.type === selectedType;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filteredSpots.length / pageSize);
  const paginatedSpots = filteredSpots.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">红色文化景点</h1>
          <p className="text-gray-500">探索广西红色旅游资源，深入了解革命历史与文化</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索景点名称、地址、关键词..."
                className="pl-9"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                <X className="w-4 h-4 mr-1" /> 清除
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-500 mr-2">类型筛选:</span>
            {spotTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                className={`cursor-pointer ${selectedType === type ? 'bg-red-700 hover:bg-red-800' : 'hover:bg-red-50'}`}
                onClick={() => { setSelectedType(type); setCurrentPage(1); }}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          共找到 <span className="font-semibold text-gray-900">{filteredSpots.length}</span> 个景点
        </div>

        {/* Spot Grid */}
        {paginatedSpots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {paginatedSpots.map((spot) => (
              <Link key={spot.id} to={`/spot/${spot.id}`}>
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
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
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-700 transition-colors line-clamp-1">
                      {spot.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {spot.address}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 flex-1">{spot.introduction}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{spot.score}</span>
                      </div>
                      <span className="text-xs text-gray-400">{spot.opentime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">未找到匹配的景点</h3>
            <p className="text-gray-500">请尝试调整搜索关键词或筛选条件</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              上一页
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? 'default' : 'outline'}
                className={currentPage === page ? 'bg-red-700 hover:bg-red-800' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}