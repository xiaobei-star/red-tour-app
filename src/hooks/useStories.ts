import { useState, useEffect, useCallback } from 'react';
import {
  getStories,
  getStoryById,
  postStory,
  getStoriesForMap,
  getNearbyStories,
  toggleStoryLike,
  deleteStory,
} from '@/api/services/stories';
import type { UserStory, StoryParams, StoryQueryParams, MapBoundsQueryParams } from '@/api/types';
import { toast } from 'sonner';

export function useStoryList(params?: StoryQueryParams) {
  const [data, setData] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async (p?: StoryQueryParams) => {
    setLoading(true);
    try {
      const res = await getStories(p);
      if (res.code === 0 || res.code === 200) {
        setData(res.data.list);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(params); }, [fetch, params]);

  return { data, loading, total, refetch: fetch };
}

export function useStoryDetail(id: string) {
  const [story, setStory] = useState<UserStory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const res = await getStoryById(id);
        if (!cancelled && (res.code === 0 || res.code === 200)) {
          setStory(res.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [id]);

  return { story, loading };
}

export function useStorySubmit() {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async (params: StoryParams) => {
    setSubmitting(true);
    try {
      const res = await postStory(params);
      if (res.code === 0 || res.code === 200) {
        toast.success('发布成功，等待审核');
        return res.data;
      }
      toast.error(res.message || '发布失败');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting };
}

export function useMapStories() {
  const [data, setData] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInBounds = useCallback(async (params: MapBoundsQueryParams) => {
    setLoading(true);
    try {
      const res = await getStoriesForMap(params);
      if (res.code === 0 || res.code === 200) setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, fetchInBounds };
}

export function useNearbyStories() {
  const [data, setData] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNearby = useCallback(async (lng: number, lat: number, radius?: number) => {
    setLoading(true);
    try {
      const res = await getNearbyStories(lng, lat, radius);
      if (res.code === 0 || res.code === 200) setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, fetchNearby };
}

export function useStoryActions() {
  const like = useCallback(async (storyId: string, onSuccess?: (liked: boolean, count: number) => void) => {
    const res = await toggleStoryLike(storyId);
    if (res.code === 0 || res.code === 200) {
      onSuccess?.(res.data.liked, res.data.likeCount);
    }
  }, []);

  const remove = useCallback(async (storyId: string, onSuccess?: () => void) => {
    const res = await deleteStory(storyId);
    if (res.code === 0 || res.code === 200) {
      toast.success('删除成功');
      onSuccess?.();
    }
  }, []);

  return { likeStory: like, deleteStory: remove };
}
