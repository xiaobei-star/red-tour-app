import { useState, useEffect, useCallback } from 'react';
import { getSpots, getSpotById, getSpotCulture, getNearbySpotsByLocation, getSpotsInBounds } from '@/api/services/spots';
import type { ScenicSpot, RedCulture, SpotQueryParams, NearbyQueryParams, MapBoundsQueryParams } from '@/api/types';

export function useSpotList(params?: SpotQueryParams) {
  const [data, setData] = useState<ScenicSpot[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async (p?: SpotQueryParams) => {
    setLoading(true);
    try {
      const res = await getSpots(p);
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

export function useSpotDetail(id: string) {
  const [spot, setSpot] = useState<ScenicSpot | null>(null);
  const [culture, setCulture] = useState<RedCulture | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const [spotRes, cultureRes] = await Promise.all([
          getSpotById(id),
          getSpotCulture(id).catch(() => null),
        ]);
        if (!cancelled) {
          if (spotRes.code === 0 || spotRes.code === 200) setSpot(spotRes.data);
          if (cultureRes && (cultureRes.code === 0 || cultureRes.code === 200)) setCulture(cultureRes.data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [id]);

  return { spot, culture, loading };
}

export function useNearbySpots() {
  const [data, setData] = useState<ScenicSpot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNearby = useCallback(async (params: NearbyQueryParams) => {
    setLoading(true);
    try {
      const res = await getNearbySpotsByLocation(params);
      if (res.code === 0 || res.code === 200) setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, fetchNearby };
}

export function useMapSpots() {
  const [data, setData] = useState<ScenicSpot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInBounds = useCallback(async (params: MapBoundsQueryParams) => {
    setLoading(true);
    try {
      const res = await getSpotsInBounds(params);
      if (res.code === 0 || res.code === 200) setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, fetchInBounds };
}
