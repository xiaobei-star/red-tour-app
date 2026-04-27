import { useState, useRef, useEffect, useCallback } from 'react';
import type { ScenicSpot } from '@/types';
import { loadAMap } from '@/lib/amap-loader';

export function useAMap(containerId: string, spots: ScenicSpot[]) {
  const mapRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadAMap().then((AMap) => {
      if (cancelled || !document.getElementById(containerId)) return;

      const map = new AMap.Map(containerId, {
        center: [108.3275, 22.8152],
        zoom: 7,
        viewMode: '2D',
      });

      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar({ position: 'LB' }));
      map.addControl(new AMap.MapTypeControl({ position: 'RT' }));

      spots.forEach((spot) => {
        const marker = new AMap.Marker({
          position: [spot.longitude, spot.latitude],
          title: spot.name,
          animation: 'AMAP_ANIMATION_DROP',
        });
        map.add(marker);
      });

      mapRef.current = map;
      setIsReady(true);
    }).catch(() => {
      if (!cancelled) setLoadError(true);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [containerId, spots]);

  const setCenter = useCallback((lng: number, lat: number, zoom?: number) => {
    if (mapRef.current) {
      mapRef.current.setCenter([lng, lat]);
      if (zoom) mapRef.current.setZoom(zoom);
    }
  }, []);

  return { map: mapRef.current, isReady, loadError, setCenter };
}