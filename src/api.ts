import type { Announcement } from './types';

const API_URL = 'https://inai-col1.fishrungames.com/ads';

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки объявлений: ${response.statusText}`);
  }
  return response.json();
}

export async function createAnnouncement(data: {
  title: string;
  description: string;
  author?: string;
  price?: number;
  phone?: string;
  image?: File;
}): Promise<any> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);

  if (data.author) formData.append('author', data.author);
  if (data.price !== undefined) formData.append('price', String(data.price));
  if (data.phone) formData.append('phone', data.phone);
  if (data.image) formData.append('image', data.image);

  // При отправке FormData браузер автоматически выставляет multipart/form-data и boundary,
  // заголовок Content-Type указывать вручную не нужно
  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Ошибка при публикации объявления: ${response.statusText}`);
  }

  return response.json();
}