'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HistoryModal from './components/HistoryModal';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [memory, setMemory] = useState('');
  const [regret, setRegret] = useState('');
  const [plan, setPlan] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [dummyIconIndex, setDummyIconIndex] = useState(0);

  const generatePrompt = () => {
    const currentYear = new Date().getFullYear();
    const age = birthYear ? currentYear - parseInt(birthYear) : 0;

    const prompt = `당신은 따뜻하고 통찰력 있는 '인생처방의원'의 전문 의사입니다.
신청자의 한 해를 진단하고, 마음 치유를 위한 처방전을 작성해주세요.

**신청자 정보:**
- 성명: ${name}
- 출생연도: ${birthYear}년생 (만 ${age}세)
- 성별: ${gender}
- 진료일: 2025년 12월
- 주 증상: 한 해 돌아보기 및 내년 준비

**신청자 상태:**
- 올해 긍정적 경험: ${memory}
- 올해 어려움/아쉬움: ${regret}
- 내년 치유 목표: ${plan}

**🏥 처방전 작성 규칙:**

1. 약품명 작명 규칙:
   - 한글 의미 + 제형 (정/환/산/캡슐/시럽)
   - 예: 온기정, 평온환, 시작산, 활력캡슐, 휴식시럽
   - 감성적이면서도 의약품처럼 들리게

2. 복용법 작성:
   - "마음이 힘들 때 1정씩 복용"
   - "하루 3번, 식후 30분에 복용"
   - "잠들기 전 1회, 따뜻한 물과 함께"
   - "매일 아침, 거울 앞에서 복용"

3. 의사 소견:
   - 신청자 이름(${name}) 사용
   - 나이(${age}세), 성별(${gender}) 고려
   - 따뜻하면서도 전문적인 톤
   - 희망과 응원의 메시지

**⚠️ 금지 사항:**
- 정신과 관련 용어 사용 금지 (우울증, 불안증 등)
- 실제 질병/약품명 사용 금지

**📋 출력 형식 (아래는 형식 예시일 뿐, 내용은 신청자에 맞게 완전히 새로 작성!):**

<prescription>
  <section type="medicine">
    <title>처방 약품</title>
    <item>
      <name>온기정</name>
      <usage>외로움을 느낄 때 1정, 따뜻한 물과 함께 복용</usage>
    </item>
    <item>
      <name>성장환</name>
      <usage>하루 3번, 작은 성취를 기록하며 복용</usage>
    </item>
  </section>

  <section type="notes">
    <title>의사 소견</title>
    <message>${name} 신청자님, 한 해 동안 정말 고생 많으셨습니다.</message>
    <message>올해의 긍정적 경험("${memory}")을 보니 충분히 잘 성장하고 계십니다.</message>
    <message>올해의 어려움("${regret}")은 누구에게나 있는 자연스러운 과정입니다.</message>
    <message>${age}세의 지금, 신청자님께 특별히 권하고 싶은 것은 새로운 배움에 도전해보시는 것입니다.</message>
    <message>나이는 배움의 장애가 아니라 오히려 깊이를 더해주며, 새로운 공부는 삶에 활력을 불어넣습니다.</message>
    <message>2026년 1월부터는 새로운 배움과 도전에 시간을 투자하며 시작하는 한 해가 되길 진심으로 응원합니다.</message>
  </section>
</prescription>

⚠️ **위 예시는 형식 참고용입니다. 실제 내용은 반드시 신청자 정보에 맞춰 완전히 새롭게 작성하세요!**

**작성 가이드:**
- medicine 섹션: "${memory}"와 "${plan}"를 깊이 분석하여 **2-3개** 맞춤형 약품 작성
  - 약품명: 창의적이고 신청자 상황에 딱 맞는 이름
  - 복용법: 구체적이고 실천 가능한 방법

- notes 섹션: **${age}세 ${gender} 신청자만을 위한** 4-6개 message 작성
  1. **개인화된 인사**: 이름(${name})과 한 해 노고 진심으로 인정
  2. **구체적 칭찬**: "${memory}"의 구체적 내용 언급하며 격려
  3. **공감 위로**: "${regret}"의 감정을 이해하고 따뜻하게 위로
  4. **새로운 배움 권유 (필수)**:
     - ${age}세라는 나이는 새로운 배움을 시작하기에 완벽한 시기임을 강조
     - 구체적 활동은 절대 추천하지 말고, "새로운 배움", "새로운 도전", "새로운 공부"처럼 추상적으로 표현
     - 배움은 나이와 무관하며, 오히려 경험이 배움을 더 풍요롭게 만든다는 철학
  5. **배움의 가치 강조**: 새로운 것을 배우는 과정 자체가 삶을 풍요롭게 만든다는 메시지
  6. **2026년 배움 응원 (필수)**: 2026년 1월부터는 새로운 배움에 시간을 투자하며 시작하는 한 해가 되길 응원

❗ **중요**:
- 위 예시 문구를 절대 그대로 사용하지 마세요
- 매번 완전히 다른, 신청자에게 딱 맞는 내용으로 작성
- XML/HTML 태그 구조만 정확히 지키면 됩니다`;

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

  // 더미 데이터 버튼 아이콘 렌더링
  const renderDummyIcon = () => {
    const icons = [
      // 주사위 아이콘
      <svg key="dice" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>,
      // 반짝이 아이콘
      <svg key="sparkles" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>,
      // 마법봉 아이콘
      <svg key="wand" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      // 셔플 아이콘
      <svg key="shuffle" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>,
      // 리프레시 아이콘
      <svg key="refresh" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>,
    ];
    return icons[dummyIconIndex];
  };

  const fillDummyData = () => {
    const dummyDataSets = [
      {
        name: '홍길동',
        birthYear: '1990',
        gender: '남성',
        memory: '회사에서 큰 프로젝트를 성공적으로 완수하고 팀원들과 함께 성장한 경험',
        regret: '건강 관리에 소홀해서 체력이 많이 떨어진 것',
        plan: '매일 30분씩 운동하고, 명상으로 마음의 평온 찾기'
      },
      {
        name: '김영희',
        birthYear: '1985',
        gender: '여성',
        memory: '새로운 취미로 시작한 요가를 통해 내면의 평화를 찾은 경험',
        regret: '가족과 함께하는 시간을 충분히 만들지 못한 것',
        plan: '주말마다 가족과 함께 여행하고, 일주일에 3번 요가 수련하기'
      },
      {
        name: '박민수',
        birthYear: '1995',
        gender: '남성',
        memory: '첫 마라톤 완주에 성공하며 끈기와 인내를 배운 경험',
        regret: '독서 목표를 달성하지 못하고 스마트폰에 너무 많은 시간을 쏟은 것',
        plan: '매달 2권 이상 책 읽기, 하루 스마트폰 사용 시간 2시간 이내로 제한하기'
      },
      {
        name: '이수진',
        birthYear: '1988',
        gender: '여성',
        memory: '오랜만에 친구들과 재회하며 소중한 인연의 가치를 깨달은 경험',
        regret: '자기계발에 투자하지 못하고 현상 유지에만 머물렀던 것',
        plan: '온라인 강의로 새로운 기술 배우기, 월 1회 독서 모임 참여하기'
      },
      {
        name: '최민상',
        birthYear: '1992',
        gender: '남성',
        memory: '처음으로 봉사활동을 시작하며 나눔의 기쁨을 느낀 경험',
        regret: '재정 관리를 제대로 하지 못해 저축 목표를 달성하지 못한 것',
        plan: '매달 수입의 20% 저축하기, 분기마다 1회 봉사활동 참여하기'
      }
    ];

    const randomData = dummyDataSets[Math.floor(Math.random() * dummyDataSets.length)];

    setName(randomData.name);
    setBirthYear(randomData.birthYear);
    setGender(randomData.gender);
    setMemory(randomData.memory);
    setRegret(randomData.regret);
    setPlan(randomData.plan);

    // 아이콘도 랜덤하게 변경 (5개 아이콘 순환)
    setDummyIconIndex((prev) => (prev + 1) % 5);
  };

  const handleGenerateClick = () => {
    if (!name || !birthYear || !gender || !memory || !regret || !plan) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    setShowConfirmModal(true);
  };

  const generateWithAI = async () => {
    setShowConfirmModal(false);
    setIsGenerating(true);

    try {
      const currentYear = new Date().getFullYear();
      const age = birthYear ? currentYear - parseInt(birthYear) : 0;

      const prompt = `당신은 따뜻하고 통찰력 있는 '인생처방의원'의 전문 의사입니다.
신청자의 한 해를 진단하고, 마음 치유를 위한 처방전을 작성해주세요.

**신청자 정보:**
- 성명: ${name}
- 출생연도: ${birthYear}년생 (만 ${age}세)
- 성별: ${gender}
- 진료일: 2025년 12월
- 주 증상: 한 해 돌아보기 및 내년 준비

**신청자 상태:**
- 올해 긍정적 경험: ${memory}
- 올해 어려움/아쉬움: ${regret}
- 내년 치유 목표: ${plan}

**🏥 처방전 작성 규칙:**

1. 약품명 작명 규칙:
   - 한글 의미 + 제형 (정/환/산/캡슐/시럽)
   - 예: 온기정, 평온환, 시작산, 활력캡슐, 휴식시럽
   - 감성적이면서도 의약품처럼 들리게

2. 복용법 작성:
   - "마음이 힘들 때 1정씩 복용"
   - "하루 3번, 식후 30분에 복용"
   - "잠들기 전 1회, 따뜻한 물과 함께"
   - "매일 아침, 거울 앞에서 복용"

3. 의사 소견:
   - 신청자 이름(${name}) 사용
   - 나이(${age}세), 성별(${gender}) 고려
   - 따뜻하면서도 전문적인 톤
   - 희망과 응원의 메시지

**⚠️ 금지 사항:**
- 정신과 관련 용어 사용 금지 (우울증, 불안증 등)
- 실제 질병/약품명 사용 금지

**📋 출력 형식 (아래는 형식 예시일 뿐, 내용은 신청자에 맞게 완전히 새로 작성!):**

<prescription>
  <section type="medicine">
    <title>처방 약품</title>
    <item>
      <name>온기정</name>
      <usage>외로움을 느낄 때 1정, 따뜻한 물과 함께 복용</usage>
    </item>
    <item>
      <name>성장환</name>
      <usage>하루 3번, 작은 성취를 기록하며 복용</usage>
    </item>
  </section>

  <section type="notes">
    <title>의사 소견</title>
    <message>${name} 신청자님, 한 해 동안 정말 고생 많으셨습니다.</message>
    <message>올해의 긍정적 경험("${memory}")을 보니 충분히 잘 성장하고 계십니다.</message>
    <message>올해의 어려움("${regret}")은 누구에게나 있는 자연스러운 과정입니다.</message>
    <message>${age}세의 지금, 신청자님께 특별히 권하고 싶은 것은 새로운 배움에 도전해보시는 것입니다.</message>
    <message>나이는 배움의 장애가 아니라 오히려 깊이를 더해주며, 새로운 공부는 삶에 활력을 불어넣습니다.</message>
    <message>2026년 1월부터는 새로운 배움과 도전에 시간을 투자하며 시작하는 한 해가 되길 진심으로 응원합니다.</message>
  </section>
</prescription>

⚠️ **위 예시는 형식 참고용입니다. 실제 내용은 반드시 신청자 정보에 맞춰 완전히 새롭게 작성하세요!**

**작성 가이드:**
- medicine 섹션: "${memory}"와 "${plan}"를 깊이 분석하여 **2-3개** 맞춤형 약품 작성
  - 약품명: 창의적이고 신청자 상황에 딱 맞는 이름
  - 복용법: 구체적이고 실천 가능한 방법

- notes 섹션: **${age}세 ${gender} 신청자만을 위한** 4-6개 message 작성
  1. **개인화된 인사**: 이름(${name})과 한 해 노고 진심으로 인정
  2. **구체적 칭찬**: "${memory}"의 구체적 내용 언급하며 격려
  3. **공감 위로**: "${regret}"의 감정을 이해하고 따뜻하게 위로
  4. **새로운 배움 권유 (필수)**:
     - ${age}세라는 나이는 새로운 배움을 시작하기에 완벽한 시기임을 강조
     - 구체적 활동은 절대 추천하지 말고, "새로운 배움", "새로운 도전", "새로운 공부"처럼 추상적으로 표현
     - 배움은 나이와 무관하며, 오히려 경험이 배움을 더 풍요롭게 만든다는 철학
  5. **배움의 가치 강조**: 새로운 것을 배우는 과정 자체가 삶을 풍요롭게 만든다는 메시지
  6. **2026년 배움 응원 (필수)**: 2026년 1월부터는 새로운 배움에 시간을 투자하며 시작하는 한 해가 되길 응원

❗ **중요**:
- 위 예시 문구를 절대 그대로 사용하지 마세요
- 매번 완전히 다른, 신청자에게 딱 맞는 내용으로 작성
- XML/HTML 태그 구조만 정확히 지키면 됩니다`;

      const response = await fetch('/api/generate-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI 생성 실패');
      }

      const data = await response.json();

      // 처방전 번호 생성
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      const prescriptionNumber = `RX-${year}-${month}-${random}`;

      // DB에 저장
      try {
        await fetch('/api/prescriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            birthYear,
            gender,
            memory,
            regret,
            plan,
            prescriptionHtml: data.prescription,
            prescriptionNumber,
            generationMethod: 'gemini_ai'
          })
        });
      } catch (dbError) {
        console.error('DB 저장 에러 (계속 진행):', dbError);
      }

      // 처방전이 생성되면 자동으로 로컬 스토리지에 저장
      localStorage.setItem('prescription', data.prescription);
      // 신청자 정보도 함께 저장
      localStorage.setItem('patientInfo', JSON.stringify({
        name,
        birthYear,
        gender
      }));

      // 바로 처방전 뷰어 페이지로 이동
      router.push('/receipt');
    } catch (error) {
      console.error('AI 생성 에러:', error);
      setIsGenerating(false);
      alert(
        `처방전 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm mb-6 border border-gray-200">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-sm font-medium text-gray-600">AI 처방전</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900">
            마음 처방전 생성기
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            올 한 해를 돌아보고, 마음을 치유하는 특별한 처방전을 만들어보세요
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/receipt"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-5 rounded-lg font-medium transition-colors shadow-sm"
            >
              💊 처방전 뷰어 & 인쇄하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 우측 고정 토글 버튼 */}
        {!showHistoryModal && (
          <>
            {/* 히스토리 버튼 */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-xl shadow-lg transition-all duration-200 z-40 flex flex-col items-center gap-1"
              title="히스토리 보기"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs font-semibold">히스토리</span>
            </button>

            {/* 더미 데이터 버튼 */}
            <button
              onClick={fillDummyData}
              className="fixed right-0 top-1/3 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-l-xl shadow-lg transition-all duration-200 z-40 flex flex-col items-center gap-1"
              title="더미 데이터로 채우기"
            >
              {renderDummyIcon()}
              <span className="text-xs font-semibold">랜덤</span>
            </button>
          </>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200 slide-up">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">신청자 정보</h2>
            <p className="text-sm text-gray-600 mt-1">처방전 작성을 위한 정보를 입력해주세요</p>
          </div>

          <div className="space-y-6">
            {/* Personal Info Grid */}
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none cursor-pointer"
                >
                  <option value="">선택하세요</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
            </div>

            {/* Reflection Sections */}
            <div className="space-y-4">
              <div>
                <label htmlFor="memory" className="block text-sm font-semibold text-gray-700 mb-2">
                  올해 기억에 남는 일
                </label>
                <textarea
                  id="memory"
                  value={memory}
                  onChange={e => setMemory(e.target.value)}
                  placeholder="예: 새로운 취미를 시작했어요, 좋은 사람들을 만났어요..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none resize-none h-32"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none resize-none h-32"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none resize-none h-32"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <button
                onClick={generatePrompt}
                disabled={!name || !birthYear || !gender || !memory || !regret || !plan}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
              >
                📋 프롬프트 생성하기
              </button>
              <button
                onClick={handleGenerateClick}
                disabled={!name || !birthYear || !gender || !memory || !regret || !plan || isGenerating}
                className="bg-teal-600 hover:bg-teal-700 text-white py-3.5 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
              >
                🤖 Gemini AI로 바로 생성
              </button>
            </div>
          </div>
        </div>

        {generatedPrompt && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 scale-in">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">📋 생성된 프롬프트</h2>
                <p className="text-sm text-gray-600 mt-1">AI에 입력할 프롬프트가 준비되었습니다</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 rounded-lg font-semibold transition-colors shadow-sm"
              >
                {copied ? '✓ 복사됨!' : '📄 복사하기'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <p className="font-semibold text-gray-900 mb-3">💡 사용 방법</p>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>위의 프롬프트를 복사하여 ChatGPT, Claude, Gemini 등의 AI에게 입력</li>
                <li>AI가 생성한 HTML 형식 처방전을 복사 (전체 &lt;prescription&gt; 태그 포함)</li>
                <li>
                  <Link href="/receipt" className="font-semibold text-blue-600 underline hover:text-blue-800">
                    처방전 뷰어 페이지
                  </Link>
                  로 이동하여 붙여넣기
                </li>
                <li>실제 처방전 디자인으로 확인하고 인쇄하기! 🖨️</li>
              </ol>
            </div>
          </div>
        )}

        {/* 확인 모달 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full scale-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🤖</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 처방전 생성</h2>
                <p className="text-gray-600">
                  Gemini AI로 맞춤형 처방전을 생성하시겠습니까?
                </p>
                <p className="text-sm text-gray-500 mt-2">생성 후 바로 미리보기 화면으로 이동합니다.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={generateWithAI}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors shadow-sm"
                >
                  예, 생성합니다
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 모달 */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full text-center scale-in">
              <div className="mb-6">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                🤖 AI 처방전 생성 중
              </h2>
              <p className="text-gray-600">
                <span className="font-semibold text-blue-600">{name}</span>님을 위한 맞춤형 처방전을 작성하고 있습니다.
              </p>
              <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요...</p>
            </div>
          </div>
        )}

        {/* 히스토리 모달 */}
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          onSelect={(prescription) => {
            setName(prescription.name);
            setBirthYear(prescription.birth_year);
            setGender(prescription.gender);
            setMemory(prescription.memory);
            setRegret(prescription.regret);
            setPlan(prescription.plan);
            setShowHistoryModal(false);
          }}
        />
      </div>
    </div>
  );
}
