export interface Announcement {
  id?: number | string;
  title: string;
  description: string;
  author?: string;
  price?: number;
  phone?: string;
  imageUrl?: string;
  createdAt?: string;
}