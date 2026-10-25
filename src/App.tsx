import React, { useState, useEffect } from 'react';
import type { Announcement } from './types';
import { fetchAnnouncements, createAnnouncement } from './api';
import './App.css';

export const App: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await fetchAnnouncements();
      
      // Защита от разных форматов ответа бэкенда
      if (Array.isArray(res)) {
        setAnnouncements(res);
      } else if (res && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      } else if (res && Array.isArray(res.items)) {
        setAnnouncements(res.items);
      } else {
        setAnnouncements([]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Не удалось загрузить объявления');
      }
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const newPost: Announcement = {
        title: title.trim(),
        description: description.trim(),
        author: author.trim() || undefined,
        price: price !== '' ? Number(price) : undefined,
      };

      await createAnnouncement(newPost);
      setTitle('');
      setDescription('');
      setAuthor('');
      setPrice('');
      await loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Не удалось отправить объявление');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Доска объявлений</h1>
      </header>

      <section className="form-section">
        <h2>Подать объявление</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Заголовок *</label>
            <input
              id="title"