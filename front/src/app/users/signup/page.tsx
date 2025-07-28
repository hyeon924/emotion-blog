'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [sendComplete, setSendComplete] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, nickname, password, code }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || '회원가입 실패');
        return;
      }

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      router.push('/users/login');
    } catch (err) {
      setError('서버 오류');
    }
  };

  const handleSendCode = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/email/request-verification-code?email=${username}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) throw new Error('이메일 전송 실패');

      setSendComplete(true);
      setTimeout(() => setSendComplete(false), 5000);
    } catch (error) {
      alert('이메일 전송 실패');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">회원가입</h2>
        <p className="text-sm text-center text-gray-500">계정을 생성해보세요 🚀</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition font-medium whitespace-nowrap"
                style={{ minWidth: '110px' }}
                onClick={handleSendCode}
                disabled={sendComplete}
              >
                {sendComplete ? '전송완료' : '인증번호 받기'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">인증번호</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증번호를 입력하세요"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white text-base px-6 py-2 rounded hover:bg-green-600 transition font-semibold shadow"
              style={{ minWidth: '120px' }}
            >
              회원가입
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => router.push('/users/login')}
              className="text-blue-500 hover:underline ml-1"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
