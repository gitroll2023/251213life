'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [memory, setMemory] = useState('');
  const [regret, setRegret] = useState('');
  const [plan, setPlan] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const currentYear = new Date().getFullYear();
    const age = birthYear ? currentYear - parseInt(birthYear) : 0;

    const prompt = `당신은 따뜻하고 통찰력 있는 '인생 정산소의 직원'입니다.
아래 참여자 정보를 바탕으로 인생 영수증의 본문 내용을 작성해 주세요.

**참여자 정보:**
- 이름: ${name}
- 출생연도: ${birthYear}년생 (만 ${age}세)
- 성별: ${gender}
- 올해 기억에 남는 일: ${memory}
- 올해 아쉬움: ${regret}
- 내년 계획: ${plan}

**🚨 절대 규칙 (반드시 지켜주세요!):**
1. 마크다운 문법 절대 금지 (**, ##, -, *, ===== 사용 금지)
2. 헤더나 푸터 만들지 마세요 (본문 4개 섹션만!)
3. 평문 텍스트만 사용
4. 아래 예시 형식을 정확히 따라주세요

**📋 출력 형식 (이 형식 외에는 절대 사용 금지):**

[섹션] 구매 내역 - 올해의 획득물
마음의 온기 >> 혼자가 아니라는 위로
깊어진 인연 >> 소중한 마음의 자산
새로운 시작 >> 무한한 가능성

[섹션] 반품/미수령 내역 - 올해의 아쉬움
미뤄둔 땀방울 >> 내년을 위한 준비
건강의 소중함 >> 몸을 아끼라는 신호

[섹션] 예약 주문 - 내년의 희망
매일 30분 운동 >> 자존감을 키우는 시간
단단한 체력 >> 더 많은 추억의 원동력

[섹션] 올해의 결산
[메시지] ${name}님, ${age}세의 ${gender === '남성' ? '당신은' : '당신은'} 지금 이 순간에도 성장하고 있습니다.
[메시지] 내년에는 꼭 공부를 시작해보세요. AI가 빠르게 성장하는 이 시대에 우리도 더 똑똑해져야 합니다.
[메시지] 나이에 관계없이, 배움은 인생을 바꾸는 가장 확실한 방법입니다.
[메시지] 인생을 바꾸는 답이 있다면 꼭 찾아가 보세요. 주저하지 말고, 도전하세요.
[메시지] 내년에는 반드시 배움에, 당신의 인생에 투자하세요. 그것이 미래의 당신을 위한 최고의 선물입니다.

**✅ 작성 가이드:**
- 섹션 1: "${memory}" 바탕으로 3-5개 항목
  * 항목명: 10자 이내, 설명: 15자 이내
  * 예: "마음의 온기 >> 혼자가 아니라는 위로"
- 섹션 2: "${regret}" 바탕으로 2-4개 항목 (긍정적으로 재해석)
  * 항목명: 10자 이내, 설명: 15자 이내
  * 예: "미뤄둔 땀방울 >> 내년을 위한 준비"
- 섹션 3: "${plan}" 바탕으로 2-4개 항목 (응원하는 톤)
  * 항목명: 10자 이내, 설명: 15자 이내
  * 예: "매일 30분 운동 >> 자존감을 키우는 시간"
- 섹션 4 (올해의 결산): ${age}세 ${gender}에게 맞는 깊이 있는 조언
  * 이름(${name})을 자연스럽게 사용
  * 나이대(${age}세)에 맞는 구체적인 조언
  * 성별(${gender})을 고려한 공감 메시지
  * 배움, 성장, 자기계발의 중요성 강조
  * 5-7개의 긴 메시지 (각 50-80자)
  * AI 시대, 평생학습, 인생 투자 등의 주제 포함

**⚠️ 주의사항:**
- 각 항목은 반드시 한 줄에 하나씩 (예: "항목명 >> 설명")
- 섹션 제목은 반드시 [섹션]으로 시작
- 결산 메시지는 반드시 [메시지]로 시작
- 섹션 1-3: 항목명 10자 이내, 설명 15자 이내 (짧고 간결하게!)
- 섹션 4: 메시지당 50-80자 (깊이 있게)
- 괄호 () 안의 설명은 출력하지 마세요
- 위 4개 섹션만 출력하고 다른 내용은 추가하지 마세요`;

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('복사에 실패했습니다. 텍스트를 직접 선택해서 복사해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">인생 영수증 프롬프트 메이커</h1>
          <p className="text-lg text-gray-600 mb-4">
            올 한 해를 정산하고, 새해를 준비하는 특별한 영수증을 만들어보세요
          </p>
          <Link
            href="/receipt"
            className="inline-block bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            📄 영수증 뷰어 & 인쇄하기 →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="birthYear" className="block text-sm font-semibold text-gray-700 mb-2">
                  출생연도
                </label>
                <input
                  type="text"
                  id="birthYear"
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="예: 1990"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                  성별
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="memory" className="block text-sm font-semibold text-gray-700 mb-2">
                올해 기억에 남는 일
              </label>
              <textarea
                id="memory"
                value={memory}
                onChange={e => setMemory(e.target.value)}
                placeholder="예: 새로운 취미를 시작했어요, 좋은 사람들을 만났어요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32"
              />
            </div>

            <div>
              <label htmlFor="regret" className="block text-sm font-semibold text-gray-700 mb-2">
                올해 아쉬웠던 점
              </label>
              <textarea
                id="regret"
                value={regret}
                onChange={e => setRegret(e.target.value)}
                placeholder="예: 운동을 더 꾸준히 하지 못했어요, 책을 많이 읽지 못했어요..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32"
              />
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-semibold text-gray-700 mb-2">
                내년 계획
              </label>
              <textarea
                id="plan"
                value={plan}
                onChange={e => setPlan(e.target.value)}
                placeholder="예: 매일 30분씩 운동하기, 월 2권 독서하기, 새로운 언어 배우기..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32"
              />
            </div>

            <button
              onClick={generatePrompt}
              disabled={!name || !birthYear || !gender || !memory || !regret || !plan}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              프롬프트 생성하기
            </button>
          </div>
        </div>

        {generatedPrompt && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">생성된 프롬프트</h2>
              <button
                onClick={copyToClipboard}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {copied ? '복사됨! ✓' : '복사하기'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {generatedPrompt}
              </pre>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-3">
                💡 <strong>사용 방법:</strong>
              </p>
              <ol className="text-sm text-blue-800 space-y-2 ml-4 list-decimal">
                <li>위의 프롬프트를 복사하여 ChatGPT, Claude 등의 AI에게 입력</li>
                <li>AI가 생성한 영수증 텍스트를 복사</li>
                <li>
                  <Link href="/receipt" className="font-bold underline hover:text-purple-700">
                    영수증 뷰어 페이지
                  </Link>
                  로 이동하여 붙여넣기
                </li>
                <li>예쁜 영수증 디자인으로 확인하고 인쇄하기! 🖨️</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
