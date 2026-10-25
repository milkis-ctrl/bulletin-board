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
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Не удалось загрузить объявления');
      }
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
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, Продам ноутбук"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробности, характеристики..."
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label htmlFor="author">Контакт / Имя</label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Имя или Telegram"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Цена</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="0"
              />
            </div>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Отправка...' : 'Опубликовать'}
          </button>
        </form>
      </section>

      {error && <div className="alert-error">{error}</div>}

      <section className="list-section">
        <h2>Объявления</h2>
        {loading && <p>Загрузка данных...</p>}
        {!loading && announcements.length === 0 && (
          <p className="empty-state">Объявлений пока нет.</p>
        )}
        <div className="grid">
          {announcements.map((item, index) => (
            <div key={item.id ?? index} className="card">
              <h3>{item.title}</h3>
              <p className="card-desc">{item.description}</p>
              <div className="card-footer">
                {item.price !== undefined && (
                  <span className="card-price">{item.price} сом</span>
                )}
                {item.author && <span className="card-author">👤 {item.author}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;