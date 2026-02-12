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

  const generatePrompt = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const age = birthYear ? currentYear - parseInt(birthYear) : 0;

    const prompt = `당신은 인생이라는 거친 바다에서 방향을 잡아주는 지혜로운 '인생 나침반'입니다.
신청자(선장)의 비바람 쳤던 지난 항해(${currentYear}년)를 위로하고, ${nextYear}년의 새로운 항해를 위한 방향을 제시해주세요.

**⚓ 선장 정보:**
- 성함: ${name}
- 나이: ${birthYear}년생 (만 ${age}세)
- 성별: ${gender}
- ${currentYear}년 만난 파도(기억에 남는 일): ${memory}
- 항해의 아쉬움(후회되는 점): ${regret}
- ${nextYear}년 항로(새해 목표): ${plan}

**🧭 '인생 나침반' 메시지 작성 규칙:**

1. **톤앤매너:**
   - 인생을 '항해'에 비유하여 문학적이고 감동적으로 작성
   - 거친 파도를 넘온 선장(${name})에게 보내는 경의와 격려의 어조
   - 든든한 등대처럼 따뜻하고 희망적인 메시지
   - **글자 크기가 큰 출력물에 들어갈 내용이므로, 문장은 간결하고 짧게 작성 (매우 중요)**
   - **전체 내용은 반드시 5~6개의 짧은 문단으로 구성하며, 절대 길어지지 않도록 주의 (A4 용지 한 장 초과 방지)**

2. **메시지 구성 가이드 (필수 포함 내용):**
   - **거친 파도를 넘은 위로**: ${currentYear}년의 파도("${memory}")를 무사히 건너온 용기와 노고를 치하
   - **아쉬움의 포용**: 아쉬운 점("${regret}")은 더 단단한 배를 만들기 위한 과정임을 격려
   - **새로운 항해의 응원**: ${nextYear}년의 목표("${plan}")를 향해 키를 잡은 선장을 응원
   - **★ '새로운 배움'의 항로 권유 (핵심 필수사항)**:
     - ${age}세라는 나이는 새로운 미지의 바다(배움)를 탐험하기에 가장 좋은 때임을 강조
     - "배움이라는 나침반을 챙기세요", "새로운 지식의 섬을 찾아 떠나세요" 등 항해 은유를 사용하여 새로운 도전과 학습을 권유
     - 끊임없이 배우고 도전하는 것이야말로 멈추지 않는 항해의 동력임을 조언

3. **출력 형식 (XML):**

<compass>
  <section type="advice">
    <title>${nextYear} 인생 나침반</title>
    <message>${name} 선장님, ${currentYear}년이라는 거친 바다를 헤치고 여기까지 오시느라 정말 수고 많으셨습니다.</message>
    <message>지난 항해에서 마주한 "${memory}"라는 파도는 당신을 더욱 노련한 선장으로 만들었을 것입니다.</message>
    <message>비록 "${regret}" 같은 역풍이 있었을지라도, 그것은 앞으로 나아갈 추진력이 되어줄 것입니다.</message>
    <message>이제 ${nextYear}년, "${plan}"라는 희망의 닻을 올리고 다시 한번 힘차게 출항하십시오.</message>
    <message>무엇보다 이번 항해에서는 '새로운 배움'이라는 미지의 보물을 찾아 떠나보시길 권합니다.</message>
    <message>나이라는 숫자에 얽매이지 않고 끊임없이 배우고 도전할 때, 당신의 항해는 언제나 푸른 청춘의 바다 위에 있을 것입니다.</message>
  </section>
</compass>

⚠️ **위 예시는 참고용입니다. 실제 내용은 신청자의 항해 일지("${memory}", "${regret}", "${plan}")에 맞춰, 항해(바다, 파도, 바람, 배, 닻, 나침반 등)의 은유를 사용하여 감동적으로 새로 작성해주세요.**`;

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

  const fillDummyData = () => {
    const dummyDataSets = [
      {
        name: '김민수',
        birthYear: '1990',
        gender: '남성',
        memory: '첫 해외여행에서 만난 새로운 경험들',
        regret: '운동을 계획만 세우고 실천하지 못한 것',
        plan: '주 3회 헬스장 다니며 건강 챙기기',
      },
      {
        name: '이서연',
        birthYear: '1995',
        gender: '여성',
        memory: '새로운 프로젝트를 성공적으로 마무리한 일',
        regret: '친구들과 자주 만나지 못한 것',
        plan: '매달 친구들과 정기모임 갖기',
      },
      {
        name: '박지원',
        birthYear: '1988',
        gender: '여성',
        memory: '오랜 준비 끝에 자격증을 취득한 순간',
        regret: '가족들과 충분한 시간을 보내지 못한 것',
        plan: '주말마다 가족과 함께 시간 보내기',
      },
      {
        name: '정하늘',
        birthYear: '2000',
        gender: '남성',
        memory: '새로운 취미활동을 시작하며 느낀 설렘',
        regret: '책을 많이 사두고 읽지 못한 것',
        plan: '매달 2권씩 독서하고 기록하기',
      },
    ];

    const randomData = dummyDataSets[Math.floor(Math.random() * dummyDataSets.length)];

    setName(randomData.name);
    setBirthYear(randomData.birthYear);
    setGender(randomData.gender);
    setMemory(randomData.memory);
    setRegret(randomData.regret);
    setPlan(randomData.plan);
  };

  const handleGenerateClick = () => {
    if (!name || !birthYear || !gender || !memory || !regret || !plan) {
      alert('항해 일지를 모두 기록해주세요.');
      return;
    }
    setShowConfirmModal(true);
  };

  const generateWithAI = async () => {
    setShowConfirmModal(false);
    setIsGenerating(true);

    try {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const age = birthYear ? currentYear - parseInt(birthYear) : 0;

      const prompt = `당신은 인생이라는 거친 바다에서 방향을 잡아주는 지혜로운 '인생 나침반'입니다.
    신청자(선장)의 비바람 쳤던 지난 항해(${currentYear}년)를 위로하고, ${nextYear}년의 새로운 항해를 위한 방향을 제시해주세요.

    **⚓ 선장 정보:**
    - 성함: ${name}
    - 나이: ${birthYear}년생 (만 ${age}세)
    - 성별: ${gender}
    - ${currentYear}년 만난 파도(기억에 남는 일): ${memory}
    - 항해의 아쉬움(후회되는 점): ${regret}
    - ${nextYear}년 항로(새해 목표): ${plan}
    
    **🧭 '인생 나침반' 메시지 작성 규칙:**
    
    1. **톤앤매너:**
       - 인생을 '항해'에 비유하여 문학적이고 감동적으로 작성
       - 거친 파도를 넘온 선장(${name})에게 보내는 경의와 격려의 어조
       - 든든한 등대처럼 따뜻하고 희망적인 메시지
       - **글자 크기가 큰 출력물에 들어갈 내용이므로, 문장은 간결하고 울림 있게(약 5-6문장)**
    
    2. **메시지 구성 가이드 (필수 포함 내용):**
       - **거친 파도를 넘은 위로**: ${currentYear}년의 파도("${memory}")를 무사히 건너온 용기와 노고를 치하
       - **아쉬움의 포용**: 아쉬운 점("${regret}")은 더 단단한 배를 만들기 위한 과정임을 격려
       - **새로운 항해의 응원**: ${nextYear}년의 목표("${plan}")를 향해 키를 잡은 선장을 응원
       - **★ '새로운 배움'의 항로 권유 (핵심 필수사항)**:
         - ${age}세라는 나이는 새로운 미지의 바다(배움)를 탐험하기에 가장 좋은 때임을 강조
         - "배움이라는 나침반을 챙기세요", "새로운 지식의 섬을 찾아 떠나세요" 등 항해 은유를 사용하여 새로운 도전과 학습을 권유
         - 끊임없이 배우고 도전하는 것이야말로 멈추지 않는 항해의 동력임을 조언
    
    3. **출력 형식 (XML):**
    
    <compass>
      <section type="advice">
        <title>${nextYear} 인생 나침반</title>
        <message>${name} 선장님, ${currentYear}년이라는 거친 바다를 헤치고 여기까지 오시느라 정말 수고 많으셨습니다.</message>
        <message>지난 항해에서 마주한 "${memory}"라는 파도는 당신을 더욱 노련한 선장으로 만들었을 것입니다.</message>
        <message>비록 "${regret}" 같은 역풍이 있었을지라도, 그것은 앞으로 나아갈 추진력이 되어줄 것입니다.</message>
        <message>이제 ${nextYear}년, "${plan}"라는 희망의 닻을 올리고 다시 한번 힘차게 출항하십시오.</message>
        <message>무엇보다 이번 항해에서는 '새로운 배움'이라는 미지의 보물을 찾아 떠나보시길 권합니다.</message>
        <message>나이라는 숫자에 얽매이지 않고 끊임없이 배우고 도전할 때, 당신의 항해는 언제나 푸른 청춘의 바다 위에 있을 것입니다.</message>
      </section>
    </compass>
    
    ⚠️ **위 예시는 참고용입니다. 실제 내용은 신청자의 항해 일지("${memory}", "${regret}", "${plan}")에 맞춰, 항해(바다, 파도, 바람, 배, 닻, 나침반 등)의 은유를 사용하여 감동적으로 새로 작성해주세요.**`;

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

      // 번호 생성
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      const prescriptionNumber = `LOG-${year}-${month}-${random}`;

      // DB에 저장 (api/prescriptions 재사용)
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
            generationMethod: 'gemini_ai',
          }),
        });
      } catch (dbError) {
        console.error('DB 저장 에러 (계속 진행):', dbError);
      }

      // 로컬 스토리지에 저장
      localStorage.setItem('prescription', data.prescription);
      localStorage.setItem(
        'patientInfo',
        JSON.stringify({
          name,
          birthYear,
          gender,
        })
      );

      // 뷰어 페이지로 이동
      router.push('/receipt');
    } catch (error) {
      console.error('AI 생성 에러:', error);
      setIsGenerating(false);
      alert(
        `생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-sky-200">
            <span className="text-xl">⚓</span>
            <span className="text-sm font-bold text-sky-700">인생은 거대한 항해입니다</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-slate-800 tracking-tight">
            [ 나의 항해 일지 ]
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            거친 파도를 넘어온 당신의 기록을 남겨주세요.
            <br />
            작성하신 내용을 바탕으로 길을 밝혀줄{' '}
            <span className="font-bold text-slate-800">[인생 나침반]</span> 메시지를 드립니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/receipt"
              className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white py-3 px-6 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
            >
              🧭 나침반(결과) 확인하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
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
              className="fixed right-0 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-slate-800 text-white p-3 rounded-l-xl shadow-lg transition-all duration-200 z-40 flex flex-col items-center gap-1 border-l border-t border-b border-white/20"
              title="히스토리 보기"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-semibold">기록</span>
            </button>

            {/* 더미 데이터 버튼 */}
            <button
              onClick={fillDummyData}
              className="fixed right-0 top-1/3 -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-l-xl shadow-lg transition-all duration-200 z-40 flex flex-col items-center gap-1 border-l border-t border-b border-white/20"
              title="더미 데이터로 채우기"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <span className="text-xs font-semibold">예시</span>
            </button>
          </>
        )}

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-sky-100 slide-up relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="mb-8 pb-4 border-b border-gray-200 relative">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-3xl">📝</span> 기록 남기기
            </h2>
            <p className="text-sky-700 mt-2 font-medium">
              솔직한 항해의 기록이 당신의 나침반이 됩니다
            </p>
          </div>

          <div className="space-y-10">
            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label htmlFor="name" className="block text-lg font-bold text-slate-700 mb-2">
                  1. 선장 성함 (이름)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="예: 김민수"
                  className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all outline-none text-center font-bold text-xl text-slate-800 placeholder-slate-300"
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  정확한 기록을 위해 성함을 크게 적어주세요
                </p>
              </div>
              <div>
                <label
                  htmlFor="birthYear"
                  className="block text-sm font-bold text-slate-600 mb-2 mt-2"
                >
                  출생연도
                </label>
                <input
                  type="text"
                  id="birthYear"
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1960"
                  maxLength={4}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-bold text-slate-600 mb-2 mt-2"
                >
                  성별
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all outline-none cursor-pointer"
                >
                  <option value="">선택하세요</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>
            </div>

            {/* Reflection Sections */}
            <div className="space-y-8">
              <div className="bg-sky-50/50 p-6 rounded-xl border border-sky-100 hover:border-sky-300 transition-colors">
                <label htmlFor="memory" className="block text-xl font-bold text-slate-800 mb-2">
                  2. 올해, 어떤 파도를 넘어오셨나요?
                </label>
                <p className="text-slate-600 mb-4 text-sm">
                  가장 기억에 남는 일이나, 보람찼던 순간을 적어주세요.
                </p>
                <textarea
                  id="memory"
                  value={memory}
                  onChange={e => setMemory(e.target.value)}
                  placeholder="( ____________________________________________________ )"
                  className="w-full px-5 py-4 bg-white border border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all outline-none resize-none h-28 text-lg"
                />
              </div>

              <div className="bg-sky-50/50 p-6 rounded-xl border border-sky-100 hover:border-sky-300 transition-colors">
                <label htmlFor="regret" className="block text-xl font-bold text-slate-800 mb-2">
                  3. 항해 중 조금 아쉬웠던 점은 무엇인가요?
                </label>
                <p className="text-slate-600 mb-4 text-sm">
                  미처 하지 못했거나, 후회되는 일이 있다면 털어놓으세요.
                </p>
                <textarea
                  id="regret"
                  value={regret}
                  onChange={e => setRegret(e.target.value)}
                  placeholder="( ____________________________________________________ )"
                  className="w-full px-5 py-4 bg-white border border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all outline-none resize-none h-28 text-lg"
                />
              </div>

              <div className="bg-sky-50/50 p-6 rounded-xl border border-sky-100 hover:border-sky-300 transition-colors">
                <label htmlFor="plan" className="block text-xl font-bold text-slate-800 mb-2">
                  4. 내년, 배의 키를 어디로 돌리시겠습니까?
                </label>
                <p className="text-slate-600 mb-4 text-sm">
                  새해에 이루고 싶은 목표나 다짐을 적어주세요.
                </p>
                <textarea
                  id="plan"
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                  placeholder="( ____________________________________________________ )"
                  className="w-full px-5 py-4 bg-white border border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all outline-none resize-none h-28 text-lg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100 mt-6">
              <button
                onClick={generatePrompt}
                disabled={!name || !birthYear || !gender || !memory || !regret || !plan}
                className="bg-white hover:bg-slate-50 text-slate-600 py-4 px-6 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-slate-200"
              >
                📋 프롬프트 미리보기
              </button>
              <button
                onClick={handleGenerateClick}
                disabled={
                  !name || !birthYear || !gender || !memory || !regret || !plan || isGenerating
                }
                className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex justify-center items-center gap-2 transform active:scale-[0.98]"
              >
                <span>🧭 인생 나침반 확인하기</span>
              </button>
            </div>
          </div>
        </div>

        {generatedPrompt && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 scale-in mb-12">
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
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed max-h-96 overflow-y-auto">
                {generatedPrompt}
              </pre>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <p className="font-semibold text-gray-900 mb-3">💡 사용 방법</p>
              <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                <li>위의 프롬프트를 복사하여 ChatGPT, Claude, Gemini 등의 AI에게 입력</li>
                <li>AI가 생성한 XML 형식 결과물을 복사</li>
                <li>
                  <Link
                    href="/receipt"
                    className="font-semibold text-blue-600 underline hover:text-blue-800"
                  >
                    결과지 뷰어 페이지
                  </Link>
                  로 이동하여 붙여넣기
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* 확인 모달 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full scale-in border-t-4 border-sky-500">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <span className="text-5xl">⚓</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">항해를 시작하시겠습니까?</h2>
                <p className="text-slate-600">
                  작성하신 일지를 바탕으로
                  <br />
                  새로운 항해를 위한 나침반을 띄웁니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 px-6 rounded-xl font-bold transition-colors"
                >
                  잠시만요
                </button>
                <button
                  onClick={generateWithAI}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3.5 px-6 rounded-xl font-bold transition-colors shadow-md"
                >
                  출항하기 🚢
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 모달 */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center scale-in">
              <div className="mb-8 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-pulse">🧭</span>
                </div>
                <div className="inline-block animate-spin-slow rounded-full h-24 w-24 border-4 border-slate-100 border-t-sky-500"></div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">항로 탐색 중...</h2>
              <p className="text-slate-600 leading-relaxed">
                <span className="font-bold text-sky-700">{name} 선장님</span>의 기록을 읽고
                <br />
                최적의 항로를 분석하고 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* 히스토리 모달 */}
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          onSelect={prescription => {
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
