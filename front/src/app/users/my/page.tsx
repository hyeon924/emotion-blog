'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('닉네임');
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/users/login');
      return;
    }

    fetch('http://localhost:8080/my', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('인증 실패');
        return res.json();
      })
      .then((json) => {
        setNickname(json.data.nickname);
        setPostCount(json.data.postCount);
      })
      .catch(() => {
        alert('로그인이 필요합니다.');
        router.push('/users/login');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/users/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => router.push('/posts')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 border border-gray-200 shadow transition mb-2 outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="홈으로 가기"
            style={{ fontSize: '20px' }}
          >
            🏠
          </button>
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl shadow">
            <span role="img" aria-label="avatar">
              👤
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">{nickname}</h2>
          <p className="text-gray-500 text-sm">총 게시글 {postCount}개</p>
        </div>
        <div className="space-y-4">
          <button
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            onClick={() => alert('비밀번호 변경 기능은 준비 중입니다.')}
          >
            비밀번호 변경
          </button>
          <button
            className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
            onClick={handleLogout}
          >
            로그아웃
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            onClick={() => alert('회원탈퇴 기능은 준비 중입니다.')}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
