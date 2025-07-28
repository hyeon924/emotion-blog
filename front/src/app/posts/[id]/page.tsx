'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  emotion: string | null;
  createDate: string;
  modifyDate: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/users/login');
      return;
    }

    fetch(`http://localhost:8080/api/v1/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('글 조회 실패');
        const data = await res.json();
        setPost(data.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id, router]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert('삭제 완료');
        router.push('/posts');
      } else {
        const data = await res.json();
        alert(data.message || '삭제 실패');
      }
    } catch (err) {
      alert('서버 오류');
    }
  };

  const renderEmotion = (emotion: string | null) => {
    if (!emotion) return '-';
    const emoji =
      emotion === 'happy'
        ? '😊'
        : emotion === 'sad'
          ? '😢'
          : emotion === 'angry'
            ? '😠'
            : emotion === 'anxious'
              ? '😨'
              : emotion === 'neutral'
                ? '😐'
                : '❔';

    const bgColor =
      emotion === 'happy'
        ? 'bg-yellow-100 text-yellow-800'
        : emotion === 'sad'
          ? 'bg-blue-100 text-blue-800'
          : emotion === 'angry'
            ? 'bg-red-100 text-red-800'
            : emotion === 'surprised'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800';

    return (
      <div className={`px-4 py-2 rounded-full ${bgColor} font-semibold flex items-center gap-2`}>
        <span className="text-lg">{emoji}</span>
        <span>{emotion}</span>
      </div>
    );
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="p-4">로딩 중...</div>;
  }

  const isModified = post.createDate !== post.modifyDate;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          {renderEmotion(post.emotion)}
        </div>

        {/* <div className="mb-6">
          <p className="text-sm text-gray-600 font-medium">
            작성자: {post.author}
          </p>
        </div> */}

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
            {post.content}
          </p>
        </div>

        <div className="text-sm text-gray-500 space-y-2 border-t border-gray-100 pt-4">
          <p className="flex items-center gap-2">
            <span className="text-gray-400">📅</span>
            <span>작성일: {formatDate(post.createDate)}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-gray-400">🛠</span>
            <span>수정일: {isModified ? formatDate(post.modifyDate) : '-'}</span>
          </p>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => router.push('/posts')}
            className="bg-gray-500 text-white px-5 py-2.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            📋 목록으로
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/posts/${post.id}/edit`)}
              className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              ✒️ 수정하기
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              🗑️ 삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
