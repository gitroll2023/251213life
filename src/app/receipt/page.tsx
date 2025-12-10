'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReceiptRenderer from './components/ReceiptRenderer';

export default function ReceiptPage() {
  const [receiptText, setReceiptText] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // 인쇄 시 타이틀 제거
    document.title = ' ';

    // 컴포넌트 마운트 시 영수증 번호와 날짜 생성
    setReceiptNumber(
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')
    );
    setCurrentDate(
      new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* 인쇄 시 숨길 영역 */}
      <div className="print:hidden min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"
            >
              ← 프롬프트 생성기로
            </Link>
            <button
              onClick={handlePrint}
              disabled={!receiptText.trim()}
              className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              🖨️ 인쇄하기
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 - 두 컬럼 */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 입력 영역 */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">인생 영수증 뷰어</h1>
                <p className="text-gray-600 mb-6">
                  AI가 생성한 영수증을 붙여넣으면 오른쪽에서 실시간으로 미리볼 수 있습니다
                </p>

                <label htmlFor="receipt" className="block text-sm font-semibold text-gray-700 mb-2">
                  AI 생성 영수증 텍스트 (4개 섹션만)
                </label>
                <textarea
                  id="receipt"
                  value={receiptText}
                  onChange={e => setReceiptText(e.target.value)}
                  placeholder="[섹션] 구매 내역 - 올해의 획득물
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
[메시지] 홍길동님, 당신은 지금 이 순간에도 성장하고 있습니다.
[메시지] 내년에는 꼭 공부를 시작해보세요. AI 시대에 우리도 더 똑똑해져야 합니다.
[메시지] 배움은 인생을 바꾸는 가장 확실한 방법입니다.

(AI가 생성한 4개 섹션을 모두 붙여넣으세요)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm h-96"
                />

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <strong>팁:</strong> AI 응답에서 헤더/푸터를 제외한 본문 4개 섹션만 복사하여
                    붙여넣으세요. 헤더와 푸터는 자동으로 추가됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 오른쪽: A4 미리보기 영역 */}
            <div className="sticky top-24 h-fit">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">미리보기</h2>

                {/* A4 영수증 */}
                <div className="receipt-viewport">
                  <div className="receipt-a4">
                    {/* 고정 헤더 */}
                    <div className="receipt-header">
                      <pre className="receipt-text">
                        {`===============================================
2025 인생 결산 영수증
===============================================
발행일시: ${currentDate}
참여자: 소중한 당신께
영수증 번호: LIFE-2025-${receiptNumber}
===============================================

`}
                      </pre>
                    </div>

                    {/* AI 생성 본문 */}
                    <div className="receipt-body">
                      <ReceiptRenderer text={receiptText} />
                    </div>

                    {/* 고정 푸터 */}
                    <div className="receipt-footer">
                      <pre className="receipt-text">
                        {`
===============================================
       | | || ||| | || | ||| || | | || |
       LIFE  RECEIPT  2025  BARCODE
-----------------------------------------------

당신의 2026년을 진심으로 응원합니다.
새로운 한 해도 배움과 성장으로 가득하길 바랍니다.

                                    - 인생 정산소 드림

===============================================`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 인쇄 전용 영역 */}
      <div className="hidden print:block">
        <div className="receipt-print">
          {/* 고정 헤더 */}
          <pre className="receipt-text">
            {`===============================================
2025 인생 결산 영수증
===============================================
발행일시: ${currentDate}
참여자: 소중한 당신께
영수증 번호: LIFE-2025-${receiptNumber}
===============================================

`}
          </pre>

          {/* AI 생성 본문 */}
          <div className="receipt-body-print">
            <ReceiptRenderer text={receiptText} />
          </div>

          {/* 고정 푸터 */}
          <pre className="receipt-text">
            {`
===============================================
       | | || ||| | || | ||| || | | || |
       LIFE  RECEIPT  2025  BARCODE
-----------------------------------------------

당신의 2026년을 진심으로 응원합니다.
새로운 한 해도 배움과 성장으로 가득하길 바랍니다.

                                    - 인생 정산소 드림

===============================================`}
          </pre>
        </div>
      </div>

      {/* 스타일 */}
      <style jsx>{`
        /* A4 비율 뷰포트 */
        .receipt-viewport {
          width: 100%;
          aspect-ratio: 210 / 297;
          max-height: 70vh;
          overflow: auto;
          background: #f5f5f5;
          border-radius: 8px;
          padding: 16px;
        }

        /* A4 영수증 */
        .receipt-a4 {
          width: 100%;
          min-height: 100%;
          background: white;
          padding: 24px 40px;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.07),
            0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
        }

        /* 영수증 텍스트 스타일 */
        .receipt-text {
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
          line-height: 1.5;
          color: #1a1a1a;
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
          text-align: center;
        }

        .receipt-header {
          margin-bottom: 0px;
        }

        .receipt-body {
          margin: 8px 0;
          padding: 0 8px;
          font-family: 'Courier New', Courier, monospace;
        }

        .receipt-body-print {
          margin: 8px 0;
          padding: 0 8px;
          font-family: 'Courier New', Courier, monospace;
        }

        .receipt-footer {
          margin-top: 8px;
          border-top: 1px dashed #ccc;
          padding-top: 8px;
        }

        /* 인쇄 스타일 */
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            background: white !important;
          }

          .receipt-print {
            width: 100%;
            max-width: 180mm;
            margin: 0 auto;
            padding: 0;
          }

          .receipt-print .receipt-text {
            font-family: 'Courier New', Courier, monospace;
            font-size: 10pt;
            line-height: 1.4;
            color: black;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        }

        /* 모바일 반응형 */
        @media (max-width: 1024px) {
          .receipt-viewport {
            max-height: 500px;
          }
        }
      `}</style>
    </>
  );
}
