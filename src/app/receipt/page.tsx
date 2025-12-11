'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import PrescriptionRenderer from './components/PrescriptionRenderer';

export default function PrescriptionPage() {
  const [prescriptionText, setPrescriptionText] = useState('');
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientBirthYear, setPatientBirthYear] = useState('');
  const [fromGemini, setFromGemini] = useState(false);
  const [showA4Modal, setShowA4Modal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 인쇄 시 타이틀 제거
    document.title = ' ';

    // 처방전 번호 생성 (RX-YYYY-MM-#### 형식)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    setPrescriptionNumber(`RX-${year}-${month}-${random}`);

    // 발급일 설정
    const issueDateStr = now.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    setIssueDate(issueDateStr);

    // 사용기간 설정 (발급일로부터 7일)
    const validDate = new Date(now);
    validDate.setDate(validDate.getDate() + 7);
    const validDateStr = validDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    setValidUntil(validDateStr);

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
        setPatientBirthYear(patientInfo.birthYear || '');
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
        alert('A4 처방전을 찾을 수 없습니다.');
        return;
      }

      // A4 크기로 고해상도 캡처 (210mm x 297mm)
      const canvas = await html2canvas(a4Element, {
        scale: 3, // 고해상도 (2520px x 3564px)
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        windowWidth: 840, // 210mm in pixels
        windowHeight: 1188, // 297mm in pixels
      });

      // 모달이 원래 닫혀있었다면 다시 닫기
      if (!wasModalOpen) {
        setShowA4Modal(false);
      }

      // PNG로 다운로드
      const link = document.createElement('a');
      const fileName = `마음처방전_${patientName || '처방전'}_${new Date().toISOString().split('T')[0]}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      console.log(`✅ 이미지 저장 완료: ${fileName} (${canvas.width}x${canvas.height}px)`);
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* 인쇄 시 숨길 영역 */}
      <div className="print:hidden min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* 헤더 */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"
            >
              ← 프롬프트 생성기로
            </Link>
            <div className="flex gap-3">
              <button
                onClick={saveAsImage}
                disabled={!prescriptionText.trim()}
                className="bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                💾 A4 이미지로 저장
              </button>
              <button
                onClick={handlePrint}
                disabled={!prescriptionText.trim()}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                🖨️ 인쇄하기
              </button>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 - 두 컬럼 */}
        <div className="max-w-7xl mx-auto p-6">
          <div className={`grid grid-cols-1 ${fromGemini ? '' : 'lg:grid-cols-2'} gap-6`}>
            {/* 왼쪽: 입력 영역 - Gemini로 생성된 경우 숨김 */}
            {!fromGemini && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">마음 처방전 뷰어</h1>
                  <p className="text-gray-600 mb-6">
                    AI가 생성한 처방전을 붙여넣으면 실제 처방전처럼 확인할 수 있습니다
                  </p>

                  <label
                    htmlFor="prescription"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    AI 생성 처방전 텍스트 (약품 + 조언)
                  </label>
                  <textarea
                    id="prescription"
                    value={prescriptionText}
                    onChange={e => setPrescriptionText(e.target.value)}
                    placeholder='<prescription>
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
    <message>신청자님, 한 해 동안 고생 많으셨습니다.</message>
    <message>올해의 경험을 보니 충분히 잘 성장하고 계십니다.</message>
    <message>처방된 약을 꾸준히 복용하시면 좋은 결과가 있을 것입니다.</message>
  </section>
</prescription>

(AI가 생성한 HTML 형식을 붙여넣으세요)'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm h-96"
                  />

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      💡 <strong>팁:</strong> AI가 생성한 &lt;prescription&gt; ~
                      &lt;/prescription&gt; 전체를 복사하여 붙여넣으세요. HTML 형식으로 정확하게
                      파싱됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 오른쪽: A4 미리보기 영역 */}
            <div className={`sticky top-24 h-fit ${fromGemini ? 'mx-auto max-w-4xl' : ''}`}>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  미리보기
                  {fromGemini && (
                    <span className="ml-3 text-sm text-gray-500 font-normal">
                      클릭하면 A4 크기로 볼 수 있습니다
                    </span>
                  )}
                </h2>

                {/* A4 처방전 */}
                <div
                  className="prescription-viewport cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowA4Modal(true)}
                  title="클릭하여 A4 크기로 보기"
                >
                  <div className="prescription-a4" ref={previewRef}>
                    {/* 처방전 헤더 */}
                    <div className="prescription-header">
                      <div className="clinic-info">
                        <div className="clinic-logo">⚕️</div>
                        <div className="clinic-name">인생처방의원</div>
                        <div className="clinic-name-en">Life Prescription Clinic</div>
                        <div className="clinic-address">전라남도 나주시 희망구 치유로 2025</div>
                        <div className="clinic-contact">TEL: 061-LIFE-2025</div>
                      </div>

                      <div className="prescription-title-box">
                        <h1 className="prescription-title">처 방 전</h1>
                        <span className="prescription-number">
                          처방전번호: {prescriptionNumber}
                        </span>
                      </div>

                      <div className="patient-info-box">
                        <table className="patient-table">
                          <tbody>
                            <tr>
                              <td className="label">신청자 성명:</td>
                              <td className="value">{patientName || '_______________'}</td>
                              <td className="label">생년월일:</td>
                              <td className="value">
                                {patientBirthYear ? `${patientBirthYear}년` : '______년'}
                              </td>
                            </tr>
                            <tr>
                              <td className="label">발급일:</td>
                              <td className="value">{issueDate}</td>
                              <td className="label">사용기간:</td>
                              <td className="value">{validUntil}까지</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* AI 생성 본문 */}
                    <div className="prescription-body">
                      <PrescriptionRenderer text={prescriptionText} />
                    </div>

                    {/* 처방전 푸터 */}
                    <div className="prescription-footer">
                      <div className="signature-section">
                        <div className="signature-row">
                          <span className="label">의료기관명:</span>
                          <span className="value">인생처방의원</span>
                          <span className="label">의사 성명:</span>
                          <span className="value">Dr. 희망</span>
                          <span className="seal">(인)</span>
                        </div>
                        <div className="signature-row">
                          <span className="label">AI의사 면허번호:</span>
                          <span className="value">LIFE-2025-****</span>
                        </div>
                      </div>

                      <div className="pharmacy-section">
                        <div className="pharmacy-info">
                          <span className="pharmacy-label">조제 약국:</span>
                          <span className="pharmacy-name">마음약국</span>
                          <span className="pharmacy-contact">TEL: 061-MIND-2025</span>
                        </div>
                      </div>

                      <div className="prescription-notice">
                        본 처방전은 발급일로부터 7일간 유효합니다. | 마음의 건강을 위해 처방된 치유
                        계획을 꾸준히 실천해주세요.
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
          {/* 처방전 헤더 */}
          <div className="prescription-header-print">
            <div className="clinic-info-print">
              <div className="clinic-logo-print">⚕️</div>
              <div className="clinic-name-print">인생처방의원</div>
              <div className="clinic-name-en-print">Life Prescription Clinic</div>
              <div className="clinic-address-print">전라남도 나주시 희망구 치유로 2025</div>
              <div className="clinic-contact-print">TEL: 061-LIFE-2025</div>
            </div>

            <div className="prescription-title-box-print">
              <h1 className="prescription-title-print">처 방 전</h1>
              <span className="prescription-number-print">처방전번호: {prescriptionNumber}</span>
            </div>

            <div className="patient-info-box-print">
              <table className="patient-table-print">
                <tbody>
                  <tr>
                    <td className="label-print">신청자 성명:</td>
                    <td className="value-print">{patientName || '_______________'}</td>
                    <td className="label-print">생년월일:</td>
                    <td className="value-print">
                      {patientBirthYear ? `${patientBirthYear}년` : '______년'}
                    </td>
                  </tr>
                  <tr>
                    <td className="label-print">발급일:</td>
                    <td className="value-print">{issueDate}</td>
                    <td className="label-print">사용기간:</td>
                    <td className="value-print">{validUntil}까지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI 생성 본문 */}
          <div className="prescription-body-print">
            <PrescriptionRenderer text={prescriptionText} />
          </div>

          {/* 처방전 푸터 */}
          <div className="prescription-footer-print">
            <div className="signature-section-print">
              <div className="signature-row-print">
                <span className="label-print">의료기관명:</span>
                <span className="value-print">인생처방의원</span>
                <span className="label-print">의사 성명:</span>
                <span className="value-print">Dr. 희망</span>
                <span className="seal-print">(인)</span>
              </div>
              <div className="signature-row-print">
                <span className="label-print">AI의사 면허번호:</span>
                <span className="value-print">LIFE-2025-****</span>
              </div>
            </div>

            <div className="pharmacy-section-print">
              <div className="pharmacy-info-print">
                <span className="pharmacy-label-print">조제 약국:</span>
                <span className="pharmacy-name-print">마음약국</span>
                <span className="pharmacy-contact-print">TEL: 061-MIND-2025</span>
              </div>
            </div>

            <div className="prescription-notice-print">
              본 처방전은 발급일로부터 7일간 유효합니다. | 마음의 건강을 위해 처방된 치유 계획을
              꾸준히 실천해주세요.
            </div>
          </div>
        </div>
      </div>

      {/* A4 모달 */}
      {showA4Modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowA4Modal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">A4 처방전 미리보기</h3>
              <button
                onClick={() => setShowA4Modal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 bg-gray-100">
              <div className="prescription-a4-modal mx-auto">
                {/* 처방전 헤더 */}
                <div className="prescription-header">
                  <div className="clinic-info">
                    <div className="clinic-logo">⚕️</div>
                    <div className="clinic-name">인생처방의원</div>
                    <div className="clinic-name-en">Life Prescription Clinic</div>
                    <div className="clinic-address">전라남도 나주시 희망구 치유로 2025</div>
                    <div className="clinic-contact">TEL: 061-LIFE-2025</div>
                  </div>

                  <div className="prescription-title-box">
                    <h1 className="prescription-title">처 방 전</h1>
                    <span className="prescription-number">처방전번호: {prescriptionNumber}</span>
                  </div>

                  <div className="patient-info-box">
                    <table className="patient-table">
                      <tbody>
                        <tr>
                          <td className="label">신청자 성명:</td>
                          <td className="value">{patientName || '_______________'}</td>
                          <td className="label">생년월일:</td>
                          <td className="value">
                            {patientBirthYear ? `${patientBirthYear}년` : '______년'}
                          </td>
                        </tr>
                        <tr>
                          <td className="label">발급일:</td>
                          <td className="value">{issueDate}</td>
                          <td className="label">사용기간:</td>
                          <td className="value">{validUntil}까지</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI 생성 본문 */}
                <div className="prescription-body">
                  <PrescriptionRenderer text={prescriptionText} />
                </div>

                {/* 처방전 푸터 */}
                <div className="prescription-footer">
                  <div className="signature-section">
                    <div className="signature-row">
                      <span className="label">의료기관명:</span>
                      <span className="value">인생처방의원</span>
                      <span className="label">의사 성명:</span>
                      <span className="value">Dr. 희망</span>
                      <span className="seal">(인)</span>
                    </div>
                    <div className="signature-row">
                      <span className="label">AI의사 면허번호:</span>
                      <span className="value">LIFE-2025-****</span>
                    </div>
                  </div>

                  <div className="pharmacy-section">
                    <div className="pharmacy-info">
                      <span className="pharmacy-label">조제 약국:</span>
                      <span className="pharmacy-name">마음약국</span>
                      <span className="pharmacy-contact">TEL: 061-MIND-2025</span>
                    </div>
                  </div>

                  <div className="prescription-notice">
                    본 처방전은 발급일로부터 7일간 유효합니다. | 마음의 건강을 위해 처방된 치유
                    계획을 꾸준히 실천해주세요.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 스타일 */}
      <style jsx>{`
        /* A4 비율 뷰포트 */
        .prescription-viewport {
          width: 100%;
          aspect-ratio: 210 / 297;
          max-height: 70vh;
          overflow: auto;
          background: #e5e5e5;
          border-radius: 8px;
          padding: 16px;
        }

        /* A4 처방전 */
        .prescription-a4 {
          width: 100%;
          min-height: 100%;
          background: white;
          padding: 20px 30px;
          border: 3px solid #0066cc;
          font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
        }

        /* 헤더 스타일 */
        .prescription-header {
          margin-bottom: 16px;
        }

        .clinic-info {
          text-align: center;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 10px;
          margin-bottom: 12px;
        }

        .clinic-logo {
          font-size: 28px;
          margin-bottom: 4px;
        }

        .clinic-name {
          font-family: 'Noto Serif KR', serif;
          font-size: 18px;
          font-weight: 700;
          color: #0066cc;
          margin-bottom: 2px;
        }

        .clinic-name-en {
          font-size: 10px;
          color: #666;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .clinic-address {
          font-size: 9px;
          color: #666;
          margin-bottom: 2px;
        }

        .clinic-contact {
          font-size: 9px;
          color: #666;
        }

        .prescription-title-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 6px 10px;
          background: #f0f8ff;
          border: 1px solid #0066cc;
        }

        .prescription-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 3px;
          margin: 0;
        }

        .prescription-number {
          font-size: 9px;
          color: #666;
        }

        .patient-info-box {
          border: 1.5px solid #333;
          background: #fafafa;
          padding: 10px;
          margin-bottom: 14px;
        }

        .patient-table {
          width: 100%;
          font-size: 9px;
        }

        .patient-table td {
          padding: 3px 6px;
        }

        .patient-table .label {
          font-weight: 600;
          color: #333;
          width: 90px;
        }

        .patient-table .value {
          color: #000;
        }

        /* 본문 */
        .prescription-body {
          min-height: 300px;
          margin: 12px 0;
        }

        /* 푸터 */
        .prescription-footer {
          margin-top: 16px;
        }

        .signature-section {
          border: 2px solid #000;
          background: #fff9e6;
          padding: 10px;
          margin-bottom: 8px;
        }

        .signature-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          margin-bottom: 5px;
        }

        .signature-row:last-child {
          margin-bottom: 0;
        }

        .signature-row .label {
          font-weight: 600;
        }

        .signature-row .seal {
          width: 26px;
          height: 26px;
          border: 1px solid #cc0000;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #cc0000;
          font-size: 9px;
          margin-left: 6px;
        }

        /* 약국 섹션 */
        .pharmacy-section {
          border: 2px solid #10b981;
          background: #f0fdf4;
          padding: 8px 10px;
          margin-bottom: 8px;
        }

        .pharmacy-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 9px;
        }

        .pharmacy-label {
          font-weight: 600;
          color: #10b981;
        }

        .pharmacy-name {
          font-weight: 700;
          color: #059669;
          font-size: 10px;
        }

        .pharmacy-contact {
          color: #666;
          margin-left: auto;
        }

        .prescription-notice {
          text-align: center;
          font-size: 7px;
          color: #666;
          padding: 6px;
          background: #f0f0f0;
          border-top: 1px solid #ccc;
        }

        /* 인쇄 스타일 */
        @media print {
          @page {
            size: A4;
            margin: 6mm;
          }

          body {
            background: white !important;
          }

          /* 미리보기 영역 완전히 숨김 */
          .prescription-viewport,
          .prescription-a4 {
            display: none !important;
          }

          .prescription-print {
            width: 100%;
            max-width: 190mm;
            margin: 0 auto;
            padding: 0;
            font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
            page-break-after: avoid;
          }

          .prescription-header-print {
            border: 2.5px solid #0066cc;
            padding: 6pt 10pt;
            margin-bottom: 4pt;
            page-break-inside: avoid;
          }

          .clinic-info-print {
            text-align: center;
            border-bottom: 1.5px solid #0066cc;
            padding-bottom: 4pt;
            margin-bottom: 4pt;
          }

          .clinic-logo-print {
            font-size: 14pt;
            margin-bottom: 2pt;
          }

          .clinic-name-print {
            font-family: 'Noto Serif KR', serif;
            font-size: 11pt;
            font-weight: 700;
            color: #0066cc;
          }

          .clinic-name-en-print {
            font-size: 6.5pt;
            color: #666;
          }

          .clinic-address-print,
          .clinic-contact-print {
            font-size: 6pt;
            color: #666;
          }

          .prescription-title-box-print {
            display: flex;
            justify-content: space-between;
            padding: 4pt 8pt;
            background: #f0f8ff;
            border: 1px solid #0066cc;
            margin-bottom: 6pt;
          }

          .prescription-title-print {
            font-size: 10pt;
            font-weight: 700;
            letter-spacing: 2pt;
          }

          .prescription-number-print {
            font-size: 6.5pt;
            color: #666;
          }

          .patient-info-box-print {
            border: 1px solid #333;
            background: #fafafa;
            padding: 8pt;
            margin-bottom: 4pt;
          }

          .patient-table-print {
            width: 100%;
            font-size: 7.5pt;
          }

          .patient-table-print td {
            padding: 2pt 3pt;
          }

          .label-print {
            font-weight: 600;
            width: 85pt;
          }

          .value-print {
            color: #000;
            font-weight: 500;
          }

          .prescription-body-print {
            min-height: 380pt;
            padding: 0 6pt;
            margin: 6pt 0;
          }

          /* PrescriptionRenderer 컴포넌트 인쇄 스타일 */
          .prescription-body-print :global(.section-title) {
            background: #0066cc;
            color: white;
            padding: 4pt 8pt;
            font-weight: 700;
            font-size: 9pt;
            margin: 5pt 0 3pt 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .prescription-body-print :global(.medicine-table) {
            width: 100%;
            border-collapse: collapse;
            border: 0.5pt solid #cccccc;
            margin-bottom: 6pt;
          }

          .prescription-body-print :global(.medicine-table th) {
            background: #f0f0f0;
            border: 0.5pt solid #cccccc;
            padding: 3pt 4pt;
            font-weight: 600;
            font-size: 7.5pt;
            text-align: center;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .prescription-body-print :global(.medicine-table td) {
            border: 0.5pt solid #cccccc;
            padding: 3pt 4pt;
            font-size: 7.5pt;
            line-height: 1.4;
          }

          .prescription-body-print :global(.medicine-name) {
            font-weight: 600;
            color: #0066cc;
          }

          .prescription-body-print :global(.usage-row) {
            background: #f9f9f9;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .prescription-body-print :global(.usage-instruction) {
            color: #333;
            font-size: 6.5pt;
            padding-left: 6pt;
            line-height: 1.4;
          }

          .prescription-body-print :global(.notes-section) {
            border-top: 1pt solid #333;
            padding-top: 6pt;
            margin-top: 6pt;
          }

          .prescription-body-print :global(.note-paragraph) {
            padding: 4pt 8pt;
            margin: 3pt 0;
            border-left: 2.5pt solid #0066cc;
            background: #f9f9f9;
            font-size: 8pt;
            line-height: 1.6;
            font-weight: 500;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .prescription-footer-print {
            border-top: 1.5px solid #333;
            padding-top: 6pt;
            margin-top: 6pt;
            page-break-inside: avoid;
          }

          .signature-section-print {
            border: 1px solid #000;
            background: #fff9e6;
            padding: 4pt 6pt;
            margin-bottom: 3pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .signature-row-print {
            display: flex;
            gap: 3pt;
            font-size: 7.5pt;
            margin-bottom: 2pt;
          }

          .seal-print {
            width: 14pt;
            height: 14pt;
            border: 1px solid #cc0000;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #cc0000;
            font-size: 7pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .pharmacy-section-print {
            border: 1px solid #10b981;
            background: #f0fdf4;
            padding: 4pt 6pt;
            margin-bottom: 3pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .pharmacy-info-print {
            display: flex;
            align-items: center;
            gap: 4pt;
            font-size: 7.5pt;
          }

          .pharmacy-label-print {
            font-weight: 600;
            color: #10b981;
          }

          .pharmacy-name-print {
            font-weight: 700;
            color: #059669;
            font-size: 8pt;
          }

          .pharmacy-contact-print {
            color: #666;
            margin-left: auto;
          }

          .prescription-notice-print {
            text-align: center;
            font-size: 6pt;
            color: #666;
            padding: 2.5pt;
            background: #f0f0f0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        /* 모바일 반응형 */
        @media (max-width: 1024px) {
          .prescription-viewport {
            max-height: 500px;
          }
        }

        /* A4 모달 스타일 */
        .prescription-a4-modal {
          width: 210mm;
          min-height: 297mm;
          background: white;
          padding: 20px 30px;
          border: 3px solid #0066cc;
          font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
        }
      `}</style>
    </>
  );
}
