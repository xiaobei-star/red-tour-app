# 红色旅游平台 — 前后端接口规范

> **后端语言：Python**（FastAPI / Flask / Django 均可）  
> **前端对接**：`src/api/` 目录下已完成 axios 封装，本规范供 Python 后端开发参考。

---

## 一、通用约定

| 项目 | 约定 |
|------|------|
| 基础路径 | `/api`（开发时 Vite 已配置代理到 `http://127.0.0.1:8000`） |
| 请求格式 | JSON，文件上传用 `multipart/form-data` |
| 响应格式 | 统一包装，见下方 |
| 认证方式 | JWT Bearer Token，放在 Header `Authorization: Bearer <token>` |

### 统一响应体

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code`: `0` 或 `200` 表示成功，其他值为业务错误码
- `message`: 提示文本
- `data`: 实际业务数据

### 分页响应体

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

---

## 二、认证模块 `/auth`

### POST `/auth/register`
用户注册

**Body:**
```json
{
  "name": "红色追寻者",
  "phone": "13800138000",
  "password": "123456"
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "u_001",
      "name": "红色追寻者",
      "phone": "13800138000"
    }
  }
}
```

---

### POST `/auth/login`
用户登录

**Body:**
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**Response:** 同 register

---

### GET `/auth/me`
获取当前用户（需 JWT）

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "u_001",
    "name": "红色追寻者",
    "phone": "13800138000",
    "avatar": "https://...",
    "role": "user"
  }
}
```

---

## 三、景点模块 `/spots`

### GET `/spots`
景点列表

**Query:**
| 参数 | 类型 | 说明 |
|------|------|------|
| cityId | string | 城市编码，如 `450300` |
| type | string | 景点类型，如 `革命遗址` |
| keyword | string | 关键词搜索（名称/地址） |
| page | int | 页码，默认 1 |
| pageSize | int | 每页数量，默认 12 |

**Response:** `PaginatedData<ScenicSpot>`

---

### GET `/spots/:id`
景点详情

**Response:** `ScenicSpot`

```json
{
  "code": 0,
  "data": {
    "id": "1",
    "name": "红军长征突破湘江烈士纪念碑园",
    "address": "桂林市兴安县双拥路56号",
    "latitude": 25.6173,
    "longitude": 110.6715,
    "opentime": "09:00-17:00",
    "ticket": "免费",
    "introduction": "...",
    "img": ["/uploads/spots/xj-hero.jpg"],
    "dqid": "450300",
    "score": 4.9,
    "checkStatus": "approved",
    "dqList": "桂林市",
    "number": "0773-6222149",
    "type": "革命遗址",
    "location": { "type": "Point", "coordinates": [110.6715, 25.6173] },
    "commentCount": 128,
    "userPhotoCount": 36
  }
}
```

---

### GET `/spots/:id/culture`
景点红色文化

**Response:** `RedCulture`

---

### GET `/spots/:id/nearby`
周边景点

**Query:** `radius`（米，默认 5000）

**Response:** `ScenicSpot[]`

> **Python GIS 实现提示**：
> - MongoDB: `db.spots.find({ location: { $near: { $geometry: point, $maxDistance: radius } } })`
> - PostGIS: `SELECT * FROM spots WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(lng, lat), 4326), radius)`

---

### GET `/spots/nearby`
按坐标查周边

**Query:** `lng`, `lat`, `radius`

**Response:** `ScenicSpot[]`

---

### GET `/spots/map`
地图视野内景点（动态加载）

**Query:** `bounds=swLng,swLat,neLng,neLat`

**Response:** `ScenicSpot[]`（只返回必要字段：id, name, longitude, latitude, type, score）

> **Python GIS 实现提示**：
> - MongoDB: `db.spots.find({ location: { $geoWithin: { $box: [[swLng, swLat], [neLng, neLat]] } } })`

---

## 四、评论模块 `/comments`

### GET `/spots/:spotId/comments`
评论列表

**Query:** `page`, `pageSize`

**Response:** `PaginatedData<Comment>`

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "c_001",
        "tourId": "1",
        "userId": "u_001",
        "userName": "红色追寻者",
        "userAvatar": "https://...",
        "content": "站在纪念碑前，深刻感受到...",
        "rating": 5,
        "images": ["/uploads/comments/img1.jpg"],
        "likeNumber": 128,
        "createTime": "2025-04-10T14:32:00",
        "isLiked": false,
        "location": { "type": "Point", "coordinates": [110.6715, 25.6173] }
      }
    ],
    "total": 50
  }
}
```

---

### POST `/comments`
发表评论（需 JWT）

**Body:**
```json
{
  "tourId": "1",
  "content": "参观后深受感动...",
  "rating": 5,
  "images": ["/uploads/comments/img1.jpg"],
  "location": { "lng": 110.6715, "lat": 25.6173 }
}
```

**Response:** `Comment`

---

### POST `/comments/:id/like`
点赞 / 取消点赞（需 JWT）

**Response:**
```json
{
  "code": 0,
  "data": { "liked": true, "likeNumber": 129 }
}
```

---

### DELETE `/comments/:id`
删除评论（需 JWT，只能删自己的）

**Response:** `{ code: 0, data: null }`

---

## 五、用户故事模块 `/stories`

用户实地打卡、上传照片与故事。

### GET `/stories`
故事列表

**Query:**
| 参数 | 说明 |
|------|------|
| spotId | 按景点筛选 |
| userId | 按用户筛选 |
| page | 页码 |
| pageSize | 每页数量 |

**Response:** `PaginatedData<UserStory>`

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "s_001",
        "userId": "u_001",
        "userName": "红色追寻者",
        "userAvatar": "https://...",
        "tourId": "1",
        "tourName": "红军长征突破湘江烈士纪念碑园",
        "title": "重走长征路",
        "content": "今天我来到了湘江战役纪念园...",
        "images": ["/uploads/stories/img1.jpg", "/uploads/stories/img2.jpg"],
        "video": null,
        "location": { "type": "Point", "coordinates": [110.6715, 25.6173] },
        "address": "桂林市兴安县双拥路56号",
        "checkStatus": "approved",
        "isFeatured": true,
        "likeCount": 88,
        "viewCount": 1024,
        "isLiked": false,
        "createTime": "2025-04-10T10:00:00"
      }
    ],
    "total": 200
  }
}
```

---

### GET `/stories/:id`
故事详情

**Response:** `UserStory`

---

### POST `/stories`
发布故事（需 JWT）

**Body:**
```json
{
  "title": "重走长征路",
  "content": "今天我来到了湘江战役纪念园，站在纪念碑前...",
  "images": ["/uploads/stories/img1.jpg"],
  "tourId": "1",
  "location": { "lng": 110.6715, "lat": 25.6173 }
}
```

**Response:** `UserStory`

> 后端收到后建议做：
> 1. 将 `location` 转为 GeoJSON `Point` 存入数据库
> 2. 用高德/百度逆地理编码 API 将坐标转为 `address` 冗余存储
> 3. `checkStatus` 默认设为 `pending`，管理员审核后改为 `approved`

---

### GET `/stories/map`
地图视野内故事点（用于高德地图叠加）

**Query:** `bounds=swLng,swLat,neLng,neLat`

**Response:** `UserStory[]`（只返回：id, title, location, images, userName）

> **Python 实现**：与 `/spots/map` 类似，用 `$geoWithin` 或 `ST_MakeEnvelope` 查询

---

### GET `/stories/nearby`
坐标附近的故事

**Query:** `lng`, `lat`, `radius`

**Response:** `UserStory[]`

---

### POST `/stories/:id/like`
点赞 / 取消点赞（需 JWT）

**Response:** `{ liked: boolean, likeCount: number }`

---

### DELETE `/stories/:id`
删除故事（需 JWT，只能删自己的）

**Response:** `{ code: 0, data: null }`

---

## 六、文件上传 `/upload`

### POST `/upload/image`
单张图片上传

**Content-Type:** `multipart/form-data`

**Field:** `file`

**Response:**
```json
{
  "code": 0,
  "data": {
    "url": "/uploads/images/20250428_abc123.jpg",
    "filename": "20250428_abc123.jpg",
    "size": 204800
  }
}
```

---

### POST `/upload/images`
批量图片上传

**Field:** `files`（多个文件）

**Response:** `UploadResult[]`

---

### POST `/upload/video`
视频上传

**Field:** `file`

**Response:** `UploadResult`

> **Python 实现提示**：
> - FastAPI: `File(...)` / `UploadFile`
> - Flask: `request.files['file']`
> - 文件保存到 `static/uploads/` 并返回可访问 URL
> - 建议限制图片 10MB、视频 50MB

---

## 七、数据库设计参考（Python + MongoDB）

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class GeoPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float]  # [lng, lat]

class ScenicSpot(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    address: str
    latitude: float
    longitude: float
    location: GeoPoint  # 2dsphere 索引
    opentime: str
    ticket: str
    introduction: str
    img: List[str]
    dqid: str
    score: float
    checkStatus: str = "approved"
    type: str
    commentCount: int = 0
    userPhotoCount: int = 0

class UserStory(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    userId: str
    userName: str
    title: str
    content: str
    images: List[str]
    location: Optional[GeoPoint] = None  # 2dsphere 索引
    address: Optional[str] = None
    checkStatus: str = "pending"
    likeCount: int = 0
    viewCount: int = 0
    createTime: datetime = Field(default_factory=datetime.utcnow)
```

### MongoDB 索引创建

```python
# PyMongo 示例
db.spots.create_index([("location", "2dsphere")])
db.stories.create_index([("location", "2dsphere")])
db.comments.create_index([("tourId", 1), ("createTime", -1)])
db.likes.create_index([("userId", 1), ("targetId", 1), ("targetType", 1)], unique=True)
```

---

## 八、GIS 与 WebGIS 联动说明

### 前端如何传坐标？

用户在高德地图页面上传实地照片时，前端调用高德 `Geolocation` 插件获取 GPS：

```javascript
// 前端代码（已存在 SpotMap.tsx 中）
const geolocation = new AMap.Geolocation({ enableHighAccuracy: true });
geolocation.getCurrentPosition((status, result) => {
  const { lng, lat } = result.position;
  // 上传到后端
  postStory({ location: { lng, lat }, ... });
});
```

### 后端如何与高德联动？

1. **逆地理编码**：收到 `{lng, lat}` 后，调用高德逆地理编码 API 获取地址文本
   ```
   GET https://restapi.amap.com/v3/geocode/regeo?key=YOUR_KEY&location=110.6715,25.6173
   ```

2. **坐标系说明**：高德地图使用 GCJ-02（火星坐标系），如果前端直接从高德取的坐标，后端存的时候无需转换；如果前端用 `navigator.geolocation`（WGS-84），需要转换。

3. **空间查询**：用户拖动地图时，前端传当前视野的 `bounds`，后端用 `$geoWithin` 或 PostGIS 查询范围内的点，只返回视野内的数据，避免全量加载。
