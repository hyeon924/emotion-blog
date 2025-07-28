'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  content: string;
  createDate: string;
  modifyDate: string;
  emotion: string | null;
}

const EMOTIONS = [
  { value: 'happy', label: '😊 행복' },
  { value: 'sad', label: '😢 슬픔' },
  { value: 'angry', label: '😠 화남' },
  { value: 'anxious', label: '😨 불안' },
  { value: 'neutral', label: '😐 보통' },
] as const;

export default function PostListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/users/login');
      return;
    }

    fetch('http://localhost:8080/api/v1/posts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('글 목록 불러오기 실패');
        const data = await res.json();
        console.log('응답 :', data);
        setPosts(data.data.posts);
        setNickname(data.data.nickname);
      })
      .catch((err) => setError(err.message));
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmotion = !selectedEmotion || post.emotion === selectedEmotion;
    return matchesSearch && matchesEmotion;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/users/login');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEmotionBadge = (emotion: string | null) => {
    if (!emotion) return null;

    const badgeStyle =
      emotion === 'happy'
        ? 'bg-yellow-200 text-yellow-800'
        : emotion === 'sad'
          ? 'bg-blue-200 text-blue-800'
          : emotion === 'angry'
            ? 'bg-red-200 text-red-800'
            : emotion === 'anxious'
              ? 'bg-purple-200 text-purple-800'
              : 'bg-gray-200 text-gray-800';

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

    return (
      <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium ${badgeStyle}`}>
        {emoji} {emotion}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <button onClick={() => router.push('/users/my')} className="text-3xl">
              🗂️
            </button>
            <strong className="text-base font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-lg shadow-sm hover:scale-105 transition-transform duration-200">
              {nickname}의 기록
            </strong>
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/posts/write')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-lg font-medium"
            >
              ✍ 글쓰기
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-lg font-medium"
            >
              🔒 로그아웃
            </button>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="제목 또는 내용으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedEmotion(null)}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                selectedEmotion === null
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              전체
            </button>
            {EMOTIONS.map((e) => (
              <button
                key={e.value}
                onClick={() => setSelectedEmotion(e.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  selectedEmotion === e.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const isModified = post.createDate !== post.modifyDate;
              return (
                <div
                  key={post.id}
                  onClick={() => router.push(`/posts/${post.id}`)}
                  className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg bg-white transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {post.title}
                    </h2>
                    {renderEmotionBadge(post.emotion)}
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4 text-base leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📅</span>
                      <span>{formatDate(post.createDate)}</span>
                    </div>
                    {isModified && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🛠</span>
                        <span>{formatDate(post.modifyDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 py-12 text-center">
              <p className="text-gray-500 text-lg">
                {searchTerm || selectedEmotion
                  ? '검색 결과가 없습니다.'
                  : '작성된 게시글이 없습니다.'}
              </p>
              <button
                onClick={() => router.push('/posts/write')}
                className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
              >
                첫 게시글 작성하기 →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
