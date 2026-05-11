import client from '../client';
import type { ApiResponse } from '../types';

export interface UploadResult {
  url: string;        // 文件访问 URL
  filename: string;   // 文件名
  size: number;       // 文件大小（字节）
}

/**
 * POST /upload/image
 * 上传图片
 * @param file 图片文件
 * @param onProgress 上传进度回调 0-100
 */
export async function uploadImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<ApiResponse<UploadResult>> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await client.post<ApiResponse<UploadResult>>('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return res.data;
}

/**
 * POST /upload/images
 * 批量上传图片
 * @param files 图片文件数组
 * @param onProgress 总进度回调
 */
export async function uploadImages(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<ApiResponse<UploadResult[]>> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await client.post<ApiResponse<UploadResult[]>>('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return res.data;
}

/**
 * POST /upload/video
 * 上传视频
 */
export async function uploadVideo(
  file: File,
  onProgress?: (percent: number) => void
): Promise<ApiResponse<UploadResult>> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await client.post<ApiResponse<UploadResult>>('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return res.data;
}
