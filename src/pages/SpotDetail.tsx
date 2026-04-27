import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Ticket, Phone, ArrowLeft, Send, ThumbsUp, Share2, Heart, Bookmark, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { scenicSpots, redCultures, comments } from '@/data/mockData';
import { LoginModal } from '@/components/LoginModal';

export function SpotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const spot = scenicSpots.find((s) => s.id === id);
  const culture = redCultures.find((c) => c.tourId === id);
  const spotComments = comments.filter((c) => c.tourId === id);

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">景点未找到</h2>
          <Button variant="outline" onClick={() => navigate('/spots')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> 返回景点列表
          </Button>
        </div>
      </div>
    );
  }

  const handlePostComment = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    if (!commentText.trim()) return;
    alert('评论发表成功！（演示模式）');
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLogin={(u) => setUser(u)} />

      {/* Breadcrumb & Back */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-red-700">首页</Link>
          <span className="text-gray-300">/</span>
          <Link to="/spots" className="text-gray-500 hover:text-red-700">红色文化</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{spot.name}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="bg-gray-900 h-[320px] relative">
        <img
          src={spot.img?.[0] || `https://placehold.co/1920x400/b91c1c/ffffff?text=${encodeURIComponent(spot.name)}`}
          alt={spot.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur text-xs font-medium text-white">
              {spot.type}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur text-xs font-medium text-white">
              {spot.dqList}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{spot.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{spot.score} 分</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {spot.address}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="info" className="bg-white rounded-xl shadow-sm">
              <TabsList className="w-full grid grid-cols-3 rounded-t-xl">
                <TabsTrigger value="info">景点信息</TabsTrigger>
                <TabsTrigger value="culture">红色文化</TabsTrigger>
                <TabsTrigger value="comments">评论互动</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">基本信息</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="text-xs text-gray-500">开放时间</div>
                          <div className="text-sm font-medium text-gray-900">{spot.opentime}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Ticket className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="text-xs text-gray-500">门票价格</div>
                          <div className="text-sm font-medium text-gray-900">{spot.ticket}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="text-xs text-gray-500">咨询电话</div>
                          <div className="text-sm font-medium text-gray-900">{spot.number}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="text-xs text-gray-500">详细地址</div>
                          <div className="text-sm font-medium text-gray-900">{spot.address}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">景点简介</h3>
                    <p className="text-gray-600 leading-relaxed">{spot.introduction}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">景点图片</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={`https://placehold.co/400x300/b91c1c/ffffff?text=图片${i}`}
                            alt={`${spot.name}图片${i}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="culture" className="p-6">
                {culture ? (
                  <div className="space-y-6">
                    <div className="border-l-4 border-red-600 pl-4">
                      <h3 className="text-xl font-bold text-red-800 mb-1">{culture.title}</h3>
                      <p className="text-sm text-gray-500">所属时期：{culture.historyPeriod || '未知'}</p>
                    </div>

                    {[
                      { label: '历史事件', content: culture.lssj },
                      { label: '时代背景', content: culture.sdbj },
                      { label: '相关人物', content: culture.xgrw },
                      { label: '具体情节', content: culture.jtqj },
                      { label: '文物古迹', content: culture.wwgj },
                    ].map((section) => (
                      <div key={section.label}>
                        <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          {section.label}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
                      </div>
                    ))}

                    {culture.redImg.length > 0 && (
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">相关图片</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {culture.redImg.map((_img, idx) => (
                            <div key={idx} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={`https://placehold.co/500x350/7f1d1d/ffffff?text=${encodeURIComponent(culture.title.substring(0, 4))}${idx + 1}`}
                                alt="红色文化图片"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    暂无红色文化资料
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="p-6">
                {/* Post Comment */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">发表评论</h4>
                  <Textarea
                    placeholder={user ? '分享您的参观感受...' : '登录后发表评论'}
                    value={commentText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                    className="mb-2"
                    disabled={!user}
                  />
                  <div className="flex justify-between items-center">
                    {!user && (
                      <p className="text-xs text-gray-400">
                        <button className="text-red-600 hover:underline" onClick={() => setLoginOpen(true)}>登录</button> 后参与互动
                      </p>
                    )}
                    <Button
                      className="bg-red-700 hover:bg-red-800 ml-auto"
                      onClick={handlePostComment}
                      disabled={!commentText.trim()}
                    >
                      <Send className="w-4 h-4 mr-1" /> 发表
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {spotComments.length > 0 ? (
                    spotComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarFallback className="bg-red-100 text-red-700 text-sm">
                            {comment.userName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                            <span className="text-xs text-gray-400">{comment.createTime}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{comment.content}</p>
                          <div className="flex items-center gap-3">
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              {comment.likeNumber}
                            </button>
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors">
                              <Share2 className="w-3.5 h-3.5" />
                              分享
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      暂无评论，快来抢沙发吧！
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Card */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={`https://placehold.co/400x200/d1d5db/6b7280?text=${encodeURIComponent('地图定位: ' + spot.name.substring(0, 6))}`}
                  alt="地图位置"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-3">{spot.address}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Link to={`/route-plan?target=${spot.id}`}>
                    <Button variant="outline" size="sm" className="w-full gap-1 text-red-700 border-red-200 hover:bg-red-50">
                      <Navigation className="w-3.5 h-3.5" />
                      路线规划
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    收藏
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">快捷操作</h4>
                <Link to={`/route-plan?target=${spot.id}`}>
                  <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-700 hover:bg-red-50">
                    <Navigation className="w-4 h-4 mr-2" />
                    规划到此路线
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-700 hover:bg-red-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享给好友
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-700 hover:bg-red-50">
                  <Bookmark className="w-4 h-4 mr-2" />
                  收藏景点
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}