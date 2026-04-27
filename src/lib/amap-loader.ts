let loadPromise: Promise<typeof window.AMap> | null = null;

/**
 * 动态加载高德地图 JS API (1.4.x 版本)
 * 使用 1.4.15 版本，无需安全密钥，兼容性更好
 */
export function loadAMap(): Promise<typeof window.AMap> {
  if (window.AMap) {
    return Promise.resolve(window.AMap);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    // 使用 1.4.15 版本，不需要安全密钥
    script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=2d615837481db003a3863cd61f05be72&plugin=AMap.Scale,AMap.ToolBar,AMap.MapType';
    script.onerror = () => reject(new Error('高德地图脚本加载失败，请检查网络或Key配置'));

    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error('高德地图脚本加载后 AMap 对象不存在'));
      }
    };

    // 超时处理：15秒
    setTimeout(() => {
      reject(new Error('高德地图脚本加载超时'));
    }, 15000);

    document.head.appendChild(script);
  });

  return loadPromise;
}
