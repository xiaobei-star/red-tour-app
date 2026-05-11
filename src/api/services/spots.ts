import client from '../client';
import type { ApiResponse, ScenicSpot, RedCulture, PaginatedData, SpotQueryParams, NearbyQueryParams, MapBoundsQueryParams } from '../types';

/**
 * GET /spots
 * 获取景点列表（支持分页、筛选）
 */
export async function getSpots(params?: SpotQueryParams) {
  const res = await client.get<ApiResponse<PaginatedData<ScenicSpot>>>('/spots', { params });
  return res.data;
}

/**
 * GET /spots/:id
 * 获取景点详情
 */
export async function getSpotById(id: string) {
  const res = await client.get<ApiResponse<ScenicSpot>>(`/spots/${id}`);
  return res.data;
}

/**
 * GET /spots/:id/culture
 * 获取景点的红色文化资料
 */
export async function getSpotCulture(id: string) {
  const res = await client.get<ApiResponse<RedCulture>>(`/spots/${id}/culture`);
  return res.data;
}

/**
 * GET /spots/:id/nearby
 * 获取周边景点（GIS 空间查询）
 * Python 后端可用 MongoDB $near 或 PostGIS ST_DWithin 实现
 */
export async function getNearbySpots(id: string, radius?: number) {
  const res = await client.get<ApiResponse<ScenicSpot[]>>(`/spots/${id}/nearby`, {
    params: radius ? { radius } : undefined,
  });
  return res.data;
}

/**
 * GET /spots/nearby
 * 根据坐标获取周边景点
 */
export async function getNearbySpotsByLocation(params: NearbyQueryParams) {
  const res = await client.get<ApiResponse<ScenicSpot[]>>('/spots/nearby', { params });
  return res.data;
}

/**
 * GET /spots/map
 * 地图视野范围内景点（用于动态加载）
 * Python 后端可用 $geoWithin / bbox 查询
 */
export async function getSpotsInBounds(params: MapBoundsQueryParams) {
  const res = await client.get<ApiResponse<ScenicSpot[]>>('/spots/map', {
    params: {
      bounds: `${params.swLng},${params.swLat},${params.neLng},${params.neLat}`,
    },
  });
  return res.data;
}
