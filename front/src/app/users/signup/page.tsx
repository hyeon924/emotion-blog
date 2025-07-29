'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [emailId, setEmailId] = useState('');
  const [domainSelect, setDomainSelect] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const domainOptions = ['gmail.com', 'naver.com', 'daum.net', '직접 입력'];
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [sendComplete, setSendComplete] = useState(false);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');

  // username은 emailId와 domainSelect/customDomain을 합쳐서 관리
  // 기존 username 관련 인풋/로직 제거

  const handleEmailIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailId(e.target.value);
    const domain = showCustomDomain ? customDomain : domainSelect;
    setUsername(e.target.value && domain ? `${e.target.value}@${domain}` : '');
  };

  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDomainSelect(value);
    if (value === '직접 입력') {
      setShowCustomDomain(true);
      setCustomDomain('');
      setUsername(emailId ? `${emailId}@` : '');
    } else {
      setShowCustomDomain(false);
      setCustomDomain('');
      setUsername(emailId && value ? `${emailId}@${value}` : '');
    }
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
    setUsername(emailId && e.target.value ? `${emailId}@${e.target.value}` : '');
  };

  const handleCustomDomainBlur = () => {
    if (!customDomain) {
      setShowCustomDomain(false);
      setDomainSelect('');
      setUsername('');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://emotion-blog-production.up.railway.app/users/signup', {
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
    } catch {
      setError('서버 오류');
    }
  };

  const handleSendCode = async () => {
    try {
      const response = await fetch(
        `https://emotion-blog-production.up.railway.app/email/request-verification-code?email=${username}`,
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
            <div className="flex gap-2 mb-2 flex-nowrap w-full min-w-0 overflow-x-visible">
              <input
                type="text"
                placeholder="이메일 아이디"
                value={emailId}
                onChange={handleEmailIdChange}
                className="w-[180px] min-w-0 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="self-center">@</span>
              {showCustomDomain ? (
                <input
                  type="text"
                  placeholder="example.com"
                  value={customDomain}
                  onChange={handleCustomDomainChange}
                  onBlur={handleCustomDomainBlur}
                  autoFocus
                  className="w-[180px] min-w-0 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              ) : (
                <select
                  className="w-[180px] min-w-0 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={domainSelect}
                  onChange={handleDomainSelect}
                >
                  <option value="" disabled>
                    도메인 선택
                  </option>
                  {domainOptions.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition font-medium whitespace-nowrap flex-shrink-0 min-w-[110px]"
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
