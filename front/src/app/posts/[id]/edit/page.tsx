'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostForm from '@/app/components/PostForm';

export default function PostEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('happy');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/v1/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('불러오기 실패');
        const data = await res.json();
        setTitle(data.data.title);
        setContent(data.data.content);
        setEmotion(data.data.emotion || 'happy');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (newTitle: string, newContent: string, newEmotion: string) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          emotion: newEmotion,
        }),
      });

      if (res.ok) {
        alert('수정 완료');
        router.push(`/posts/${id}`);
      } else {
        const result = await res.json();
        alert(result.message || '수정 실패');
      }
    } catch {
      alert('서버 오류');
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <PostForm
      mode="edit"
      initialTitle={title}
      initialContent={content}
      initialEmotion={emotion}
      onSubmit={handleUpdate}
    />
  );
}
