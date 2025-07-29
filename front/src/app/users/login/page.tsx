'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailId, setEmailId] = useState('');
  const [domainSelect, setDomainSelect] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const domainOptions = ['gmail.com', 'naver.com', 'daum.net', '직접 입력'];

  const handleLogin = async () => {
    const res = await fetch('https://emotion-blog-production.up.railway.app/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();
    console.log(result);

    if (res.ok) {
      localStorage.setItem('token', result.data);
      router.push('/posts');
    } else {
      alert(result.message);
    }
  };

  const handleEmailIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailId(e.target.value);
    const domain = domainSelect === '직접 입력' ? customDomain : domainSelect;
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">로그인</h2>

        {/* 이메일 아이디 + @ + 도메인 드롭다운/직접입력 */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="이메일 아이디"
            value={emailId}
            onChange={handleEmailIdChange}
            className="w-[180px] border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="self-center">@</span>
          {showCustomDomain ? (
            <input
              type="text"
              placeholder=" example.com"
              value={customDomain}
              onChange={handleCustomDomainChange}
              onBlur={handleCustomDomainBlur}
              autoFocus
              className="w-[180px] border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <select
              className="w-[180px] border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        </div>

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
        >
          로그인
        </button>

        <div className="text-center">
          <span className="text-gray-600">계정이 없으신가요?</span>
          <button
            onClick={() => router.push('/users/signup')}
            className="ml-2 text-blue-500 hover:underline"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
