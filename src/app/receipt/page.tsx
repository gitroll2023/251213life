'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import PrescriptionRenderer from './components/PrescriptionRenderer';
import LoginStatus from '../components/LoginStatus';

export default function ReceiptPage() {
  const [prescriptionText, setPrescriptionText] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [patientName, setPatientName] = useState('');
  const [fromGemini, setFromGemini] = useState(false);
  const [showA4Modal, setShowA4Modal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 인쇄 시 타이틀 제거
    document.title = ' ';

    // 발급일 설정
    const now = new Date();
    const issueDateStr = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setIssueDate(issueDateStr);

    // 로컬 스토리지에서 처방전 불러오기
    const savedPrescription = localStorage.getItem('prescription');
    if (savedPrescription) {
      setPrescriptionText(savedPrescription);
      setFromGemini(true); // Gemini로 생성된 경우 표시
      // 불러온 후 삭제 (일회성)
      localStorage.removeItem('prescription');
    }

    // 로컬 스토리지에서 신청자 정보 불러오기
    const savedPatientInfo = localStorage.getItem('patientInfo');
    if (savedPatientInfo) {
      try {
        const patientInfo = JSON.parse(savedPatientInfo);
        setPatientName(patientInfo.name || '');
        // 불러온 후 삭제 (일회성)
        localStorage.removeItem('patientInfo');
      } catch (error) {
        console.error('신청자 정보 파싱 오류:', error);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const saveAsImage = async () => {
    try {
      // A4 모달을 임시로 열어서 캡처
      const wasModalOpen = showA4Modal;
      if (!wasModalOpen) {
        setShowA4Modal(true);
        // DOM 업데이트 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // A4 모달 요소 찾기
      const a4Element = document.querySelector('.prescription-a4-modal') as HTMLElement;
      if (!a4Element) {
        alert('문서를 찾을 수 없습니다.');
        return;
      }

      // A4 크기로 고해상도 캡처
      const canvas = await html2canvas(a4Element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // 모달이 원래 닫혀있었다면 다시 닫기
      if (!wasModalOpen) {
        setShowA4Modal(false);
      }

      // PNG로 다운로드
      const link = document.createElement('a');
      const fileName = `인생나침반_${patientName || '참여자'}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'YeongjuSeonbi';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2403@1.0/YEONGJUSeonbiTTF.woff2')
            format('woff2');
          font-weight: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Shilla';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/Shilla_CultureM-Medium.woff2')
            format('woff2');
          font-weight: 500;
          font-display: swap;
        }
        @font-face {
          font-family: 'Shilla';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/Shilla_CultureB-Bold.woff2')
            format('woff2');
          font-weight: 700;
          font-display: swap;
        }
      `}</style>

      {/* 인쇄 시 숨길 영역 */}
      <div className="print:hidden min-h-screen bg-slate-100">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-800 font-semibold flex items-center gap-2"
            >
              ← 항해 일지로
            </Link>
            <div className="flex items-center gap-3">
              <LoginStatus />
              <button
                onClick={saveAsImage}
                disabled={!prescriptionText.trim()}
                className="bg-sky-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                💾 이미지 저장
              </button>
              <button
                onClick={handlePrint}
                disabled={!prescriptionText.trim()}
                className="bg-slate-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                🖨️ 인쇄하기
              </button>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="max-w-7xl mx-auto p-6">
          <div className={`grid grid-cols-1 ${fromGemini ? '' : 'lg:grid-cols-2'} gap-8`}>
            {/* 왼쪽: 입력 영역 - Gemini로 생성된 경우 숨김 */}
            {!fromGemini && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">나침반 뷰어</h1>
                  <p className="text-gray-600 mb-6">AI가 생성한 항해 일지(XML)를 붙여넣어주세요.</p>

                  <textarea
                    value={prescriptionText}
                    onChange={e => setPrescriptionText(e.target.value)}
                    placeholder="<compass>...</compass>"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none font-mono text-sm h-96"
                  />
                </div>
              </div>
            )}

            {/* 오른쪽: A4 미리보기 영역 */}
            <div className={`sticky top-24 h-fit ${fromGemini ? 'mx-auto max-w-4xl' : ''}`}>
              {fromGemini && (
                <div className="text-center mb-4">
                  <p className="text-slate-600">아래 나침반을 클릭하면 크게 볼 수 있습니다.</p>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8">
                {/* A4 문서 컨테이너 */}
                <div
                  className="prescription-viewport cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.01]"
                  onClick={() => setShowA4Modal(true)}
                  title="클릭하여 크게 보기"
                >
                  <div className="prescription-a4" ref={previewRef}>
                    {/* 문서 테두리 */}
                    <div className="document-border">
                      {/* 배경 워터마크 */}
                      {/* 배경 워터마크 */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/compass.png" alt="watermark" className="watermark" />

                      {/* 헤더 */}
                      <div className="doc-header">
                        <h1 className="doc-title">인 생 나 침 반</h1>
                        <div className="doc-subtitle">Life Compass</div>
                        <div className="doc-date">{issueDate}</div>
                      </div>

                      <div className="divider"></div>

                      {/* 수신인 */}
                      <div className="doc-recipient">
                        <span className="label">항해 선장 : </span>
                        <span className="name">{patientName} 님</span>
                      </div>

                      {/* 본문 */}
                      <div className="doc-body">
                        <PrescriptionRenderer text={prescriptionText} />
                      </div>

                      {/* 푸터 */}
                      <div className="doc-footer">
                        <div className="stamp-area">
                          <span className="sender">
                            인생 항해 위원회 <span className="sign-mark">(인)</span>
                          </span>
                          <span className="stamp">
                            <span className="stamp-inner">인생나침반</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 인쇄 전용 영역 */}
      <div className="hidden print:block print-only">
        <div className="prescription-print" ref={printRef}>
          <div className="document-border-print">
            {/* 배경 워터마크 */}
            {/* 배경 워터마크 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compass.png" alt="watermark" className="watermark" />

            {/* 헤더 */}
            <div className="doc-header-print">
              <h1 className="doc-title-print">인 생 나 침 반</h1>
              <div className="doc-subtitle-print">Life Compass</div>
              <div className="doc-date-print">{issueDate}</div>
            </div>

            <div className="divider-print"></div>

            {/* 수신인 */}
            <div className="doc-recipient-print">
              <span className="label-print">항해 선장 : </span>
              <span className="name-print">{patientName} 님</span>
            </div>

            {/* 본문 */}
            <div className="doc-body-print">
              <PrescriptionRenderer text={prescriptionText} />
            </div>

            {/* 푸터 */}
            <div className="doc-footer-print">
              <div className="stamp-area-print">
                <span className="sender-print">
                  인생 항해 위원회 <span className="sign-mark-print">(인)</span>
                </span>
                <span className="stamp-print">
                  <div className="seal-circle">인생나침반</div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* A4 모달 */}
      {showA4Modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowA4Modal(false)}
        >
          <div
            className="rounded-lg max-w-5xl w-full max-h-[95vh] overflow-auto flex justify-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="prescription-a4-modal">
              <div className="document-border p-8 bg-white min-h-[297mm]">
                {/* 배경 워터마크 */}
                {/* 배경 워터마크 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/compass.png" alt="watermark" className="watermark" />

                {/* 헤더 */}
                <div className="doc-header text-center">
                  <h1 className="doc-title text-5xl mb-2 text-slate-800">인 생 나 침 반</h1>
                  <div className="doc-subtitle text-xl text-slate-500 mb-4 tracking-widest uppercase">
                    Life Compass
                  </div>
                  <div className="doc-date text-lg text-slate-500 mb-2">{issueDate}</div>
                </div>

                <div className="divider border-b-2 border-slate-300 mb-8 w-2/3 mx-auto"></div>

                {/* 수신인 */}
                <div className="doc-recipient text-left mb-10 pl-8">
                  <span className="label text-2xl text-slate-700 font-serif">항해 선장 : </span>
                  <span className="name text-3xl font-bold ml-4 text-slate-900">
                    {patientName} 님
                  </span>
                </div>

                {/* 본문 */}
                <div className="doc-body min-h-[400px] px-8">
                  <PrescriptionRenderer text={prescriptionText} />
                </div>

                {/* 푸터 */}
                <div className="doc-footer mt-16 text-center">
                  <div className="stamp-area flex flex-col items-center justify-center">
                    <span className="sender text-2xl font-serif text-slate-800 mb-4">
                      인생 항해 위원회 <span className="text-slate-300 text-lg ml-2">(인)</span>
                    </span>
                    <div className="relative inline-block">
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-10 border-4 border-double border-red-700 rounded-sm flex items-center justify-center text-red-700 text-lg font-bold opacity-80 rotate-[-2deg]"
                        style={{
                          top: '-5px',
                          left: '30px',
                          fontFamily: 'Shilla',
                          letterSpacing: '2px',
                        }}
                      >
                        인생나침반
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowA4Modal(false)}
            className="fixed top-6 right-6 text-white hover:text-gray-300 text-4xl font-bold z-50"
          >
            ×
          </button>
        </div>
      )}

      {/* 스타일 */}
      <style jsx>{`
        /* 폰트 적용 */
        .prescription-a4,
        .prescription-print,
        .prescription-a4-modal {
          font-family: 'YeongjuSeonbi', serif;
        }

        /* A4 비율 뷰포트 */
        .prescription-viewport {
          width: 100%;
          aspect-ratio: 210 / 297;
          overflow: hidden;
          background: #fff;
        }

        /* A4 문서 스타일 */
        .prescription-a4 {
          width: 100%;
          height: 100%;
          padding: 40px;
          background: #fdfbf7;
          position: relative;
        }

        .document-border {
          width: 100%;
          height: 100%;
          border: 6px double #5d4037;
          background: white;
          box-shadow: inset 0 0 40px rgba(93, 64, 55, 0.05);
          padding: 40px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden; /* 이미지가 테두리를 넘지 않도록 */
        }

        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: auto;
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }

        .doc-header,
        .doc-recipient,
        .doc-body,
        .doc-footer,
        .divider {
          position: relative;
          z-index: 1;
        }

        .doc-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .doc-date {
          font-size: 14px;
          color: #64748b;
          margin-top: 5px;
        }

        .doc-title {
          font-size: 36px;
          color: #0f172a;
          margin-bottom: 5px;
          letter-spacing: 8px;
        }

        .doc-subtitle {
          font-size: 12px;
          color: #cbd5e1;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .divider {
          height: 1px;
          background: #8d6e63;
          width: 60%;
          margin: 0 auto 30px;
        }

        .doc-recipient {
          font-size: 18px;
          margin-bottom: 30px;
          text-align: center;
        }

        .doc-recipient .name {
          font-size: 24px;
          font-weight: bold;
          color: #2b1d0e;
          border-bottom: 2px solid #5d4037;
          padding: 0 10px 5px 10px;
          display: inline-block;
          min-width: 200px;
        }

        .doc-body {
          flex: 1;
          padding: 0 10px;
        }

        .doc-footer {
          margin-top: 40px;
          text-align: center;
          padding-bottom: 20px;
        }

        .stamp-area {
          position: relative;
          display: inline-block;
        }

        .sender {
          font-size: 20px;
          margin-right: 0;
          color: #334155;
        }

        .sign-mark {
          font-size: 16px;
          color: #cbd5e1;
          margin-left: 40px;
        }

        .stamp {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 32px;
          vertical-align: middle;
          margin-left: -50px;
          z-index: 10;
        }

        .stamp-inner {
          display: block;
          width: 100%;
          height: 100%;
          border: 3px double #b91c1c;
          border-radius: 2px;
          color: #b91c1c;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
          text-align: center;
          font-family: 'Shilla', serif;
          font-weight: 700;
          transform: rotate(-2deg);
          letter-spacing: 1px;
        }

        /* 인쇄 스타일 */
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            background: white !important;
          }

          .print:hidden {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          .prescription-print {
            width: 210mm;
            height: 297mm;
            padding: 15mm;
            box-sizing: border-box;
          }

          .document-border-print {
            width: 100%;
            height: 100%;
            border: 2mm double #5d4037;
            padding: 8mm;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            background: white;
          }

          .watermark {
            width: 80%;
            height: auto;
            opacity: 0.12;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .doc-header-print,
          .doc-recipient-print,
          .doc-body-print,
          .doc-footer-print,
          .divider-print {
            position: relative;
            z-index: 1;
          }

          .doc-header-print {
            text-align: center;
            margin-bottom: 8mm;
          }

          .doc-date-print {
            font-size: 12pt;
            color: #64748b;
          }

          .doc-title-print {
            font-size: 32pt;
            letter-spacing: 10pt;
            margin-bottom: 2mm;
            font-family: 'YeongjuSeonbi', serif;
            color: #0f172a;
          }

          .doc-subtitle-print {
            font-size: 10pt;
            color: #94a3b8;
            letter-spacing: 3pt;
            text-transform: uppercase;
          }

          .divider-print {
            border-bottom: 1pt solid #cbd5e1;
            width: 60%;
            margin: 0 auto 10mm;
          }

          .doc-recipient-print {
            font-size: 16pt;
            margin-bottom: 8mm;
            text-align: center;
            border-left: none;
            padding-left: 0;
          }

          .doc-recipient-print .name-print {
            border-bottom: 1pt solid #5d4037;
            padding-bottom: 2mm;
            display: inline-block;
            min-width: 60mm;
            font-weight: bold;
          }

          .doc-body-print {
            flex: 1;
          }

          .doc-footer-print {
            text-align: center;
            margin-top: 10mm;
          }

          .sender-print {
            font-size: 18pt;
            margin-right: 0;
          }

          .sign-mark-print {
            font-size: 14pt;
            color: #cbd5e1;
            margin-left: 25mm;
          }

          .seal-circle {
            display: inline-flex;
            width: 35mm;
            height: 12mm;
            border: 1mm double #b91c1c;
            border-radius: 1mm;
            background-color: transparent;
            vertical-align: middle;
            align-items: center;
            justify-content: center;
            color: #b91c1c;
            font-size: 14pt;
            font-weight: 700;
            text-align: center;
            font-family: 'Shilla', serif;
            letter-spacing: 1pt;
            transform: rotate(-1.5deg);
            opacity: 0.9;
            margin-left: -25mm;
            position: relative;
            z-index: 10;
          }
        }
      `}</style>
    </>
  );
}
