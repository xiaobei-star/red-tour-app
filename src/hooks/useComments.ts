import { useState, useEffect, useCallback } from 'react';
import { getComments, postComment, toggleCommentLike, deleteComment } from '@/api/services/comments';
import type { Comment, CommentParams, PaginatedData } from '@/api/types';
import { toast } from 'sonner';

export function useComments(spotId: string, pageSize = 10) {
  const [data, setData] = useState<PaginatedData<Comment> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetch = useCallback(async (p: number) => {
    if (!spotId) return;
    setLoading(true);
    try {
      const res = await getComments(spotId, p, pageSize);
      if (res.code === 0 || res.code === 200) {
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  }, [spotId, pageSize]);

  useEffect(() => { fetch(page); }, [fetch, page]);

  const submitComment = useCallback(async (params: CommentParams) => {
    const res = await postComment(params);
    if (res.code === 0 || res.code === 200) {
      toast.success('评论发表成功');
      fetch(page); // 刷新列表
      return true;
    }
    toast.error(res.message || '发表失败');
    return false;
  }, [fetch, page]);

  const like = useCallback(async (commentId: string) => {
    const res = await toggleCommentLike(commentId);
    if (res.code === 0 || res.code === 200) {
      // 乐观更新本地数据
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          list: prev.list.map((c) =>
            c.id === commentId
              ? { ...c, likeNumber: res.data.likeNumber, isLiked: res.data.liked }
              : c
          ),
        };
      });
    }
  }, []);

  const remove = useCallback(async (commentId: string) => {
    const res = await deleteComment(commentId);
    if (res.code === 0 || res.code === 200) {
      toast.success('删除成功');
      fetch(page);
    }
  }, [fetch, page]);

  return {
    comments: data?.list ?? [],
    total: data?.total ?? 0,
    loading,
    page,
    setPage,
    submitComment,
    likeComment: like,
    deleteComment: remove,
    refetch: () => fetch(page),
  };
}
