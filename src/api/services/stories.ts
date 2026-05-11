import client from '../client';
import type {
  ApiResponse,
  UserStory,
  PaginatedData,
  StoryParams,
  StoryQueryParams,
  MapBoundsQueryParams,
} from '../types';

/**
 * GET /stories
 * 获取用户故事列表（可按景点/用户筛选）
 */
export async function getStories(params?: StoryQueryParams) {
  const res = await client.get<ApiResponse<PaginatedData<UserStory>>>('/stories', { params });
  return res.data;
}

/**
 * GET /stories/:id
 * 获取故事详情
 */
export async function getStoryById(id: string) {
  const res = await client.get<ApiResponse<UserStory>>(`/stories/${id}`);
  return res.data;
}

/**
 * POST /stories
 * 发布实地打卡故事（需登录）
 */
export async function postStory(params: StoryParams) {
  const res = await client.post<ApiResponse<UserStory>>('/stories', params);
  return res.data;
}

/**
 * GET /stories/map
 * 获取地图视野内的故事点（用于高德地图叠加展示）
 * Python 后端用 $geoWithin + bbox 查询
 */
export async function getStoriesForMap(params: MapBoundsQueryParams) {
  const res = await client.get<ApiResponse<UserStory[]>>('/stories/map', {
    params: {
      bounds: `${params.swLng},${params.swLat},${params.neLng},${params.neLat}`,
    },
  });
  return res.data;
}

/**
 * GET /stories/nearby
 * 获取坐标附近的故事
 */
export async function getNearbyStories(lng: number, lat: number, radius = 5000) {
  const res = await client.get<ApiResponse<UserStory[]>>('/stories/nearby', {
    params: { lng, lat, radius },
  });
  return res.data;
}

/**
 * POST /stories/:id/like
 * 点赞/取消点赞故事
 */
export async function toggleStoryLike(storyId: string) {
  const res = await client.post<ApiResponse<{ liked: boolean; likeCount: number }>>(
    `/stories/${storyId}/like`
  );
  return res.data;
}

/**
 * DELETE /stories/:id
 * 删除自己的故事
 */
export async function deleteStory(storyId: string) {
  const res = await client.delete<ApiResponse<null>>(`/stories/${storyId}`);
  return res.data;
}
