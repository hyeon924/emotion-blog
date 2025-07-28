'use client';

import PostForm from '@/app/components/PostForm';
import { useRouter } from 'next/navigation';

export default function PostWritePage() {
  const router = useRouter();

  const handleSubmit = async (title: string, content: string, emotion: string) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8080/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, emotion }),
      });

      if (res.ok) {
        router.push('/posts');
      } else {
        const result = await res.json();
        alert(result.message || '작성 실패');
      }
    } catch (err) {
      alert('서버 오류');
    }
  };

  return (
    <PostForm
      mode="create"
      initialTitle=""
      initialContent=""
      initialEmotion="happy"
      onSubmit={handleSubmit}
    />
  );
}
