import client from '../client';
import type { ApiResponse, Comment, PaginatedData, CommentParams } from '../types';

/**
 * GET /spots/:spotId/comments
 * 获取景点评论列表
 */
export async function getComments(spotId: string, page = 1, pageSize = 10) {
  const res = await client.get<ApiResponse<PaginatedData<Comment>>>(`/spots/${spotId}/comments`, {
    params: { page, pageSize },
  });
  return res.data;
}

/**
 * POST /comments
 * 发表评论（需登录）
 */
export async function postComment(params: CommentParams) {
  const res = await client.post<ApiResponse<Comment>>('/comments', params);
  return res.data;
}

/**
 * POST /comments/:id/like
 * 点赞/取消点赞评论
 */
export async function toggleCommentLike(commentId: string) {
  const res = await client.post<ApiResponse<{ liked: boolean; likeNumber: number }>>(
    `/comments/${commentId}/like`
  );
  return res.data;
}

/**
 * DELETE /comments/:id
 * 删除自己的评论
 */
export async function deleteComment(commentId: string) {
  const res = await client.delete<ApiResponse<null>>(`/comments/${commentId}`);
  return res.data;
}
