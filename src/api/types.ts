// ==========================================
// 统一响应格式（与 Python 后端对齐）
// ==========================================
export interface ApiResponse<T = unknown> {
  code: number;        // 0 或 200 表示成功，其他为业务错误码
  message: string;     // 提示信息
  data: T;             // 实际数据
}

export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==========================================
// 基础类型（扩展现有，与后端模型对齐）
// ==========================================
export interface City {
  id: string;
  province: string;
  city: string;
  country: string;
  pid: string;
  cityLevel: string;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ScenicSpot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opentime: string;
  ticket: string;
  introduction: string;
  img: string[];
  dqid: string;
  score: number;
  checkStatus: '已通过' | 'pending' | 'approved' | 'rejected';
  dqList: string;
  number: string;
  type: string;

  // 后端新增字段
  location?: GeoPoint;
  commentCount?: number;
  userPhotoCount?: number;
}

export interface RedCulture {
  id: string;
  redImg: string[];
  tourId: string;
  tourName: string;
  lssj: string;
  sdbj: string;
  xgrw: string;
  jtqj: string;
  wwgj: string;
  checkStatus: string;
  title: string;
  historyPeriod?: string;
}

export interface Comment {
  id: string;
  tourId: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  content: string;
  rating?: number;       // 评分 1-5
  images?: string[];     // 用户上传的实地照片
  likeNumber: number;
  createTime: string;
  isLiked?: boolean;     // 当前用户是否已点赞

  // GIS 关联
  location?: GeoPoint;
}

export interface User {
  id: string;
  name: string;
  number: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export interface ThemeRoute {
  id: string;
  routeName: string;
  routeTheme: string;
  scenicSpotIds: string[];
  totalDuration: string;
  routeIntro: string;
}

// ==========================================
// 用户故事 / 实地打卡（新增核心模块）
// ==========================================
export interface UserStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;

  // 关联信息
  tourId?: string;       // 关联景点（可选）
  tourName?: string;     // 冗余字段

  // 内容
  title: string;
  content: string;       // 文字故事

  // 媒体
  images: string[];      // 实地拍摄照片
  video?: string;        // 视频（可选）

  // GIS 核心字段
  location?: GeoPoint;
  address?: string;      // 逆地理编码地址

  // 审核与展示
  checkStatus: 'pending' | 'approved' | 'rejected';
  isFeatured?: boolean;

  // 互动
  likeCount: number;
  viewCount: number;
  isLiked?: boolean;

  createTime: string;
  updateTime?: string;
}

// ==========================================
// 请求参数类型
// ==========================================
export interface LoginParams {
  phone: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  phone: string;
  password: string;
}

export interface CommentParams {
  tourId: string;
  content: string;
  rating?: number;
  images?: string[];
  location?: { lng: number; lat: number };
}

export interface StoryParams {
  title: string;
  content: string;
  images: string[];
  tourId?: string;
  location?: { lng: number; lat: number };
}

export interface SpotQueryParams {
  cityId?: string;
  type?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface NearbyQueryParams {
  lng: number;
  lat: number;
  radius?: number;       // 单位：米，默认 5000
}

export interface MapBoundsQueryParams {
  swLng: number;         // 西南角经度
  swLat: number;         // 西南角纬度
  neLng: number;         // 东北角经度
  neLat: number;         // 东北角纬度
}

export interface StoryQueryParams {
  spotId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}
