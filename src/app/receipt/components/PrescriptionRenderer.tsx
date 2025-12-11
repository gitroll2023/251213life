import React from 'react';

interface PrescriptionRendererProps {
  text: string;
}

interface PrescriptionItem {
  name: string;
  desc: string;
}

export default function PrescriptionRenderer({ text }: PrescriptionRendererProps) {
  if (!text.trim()) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <div className="empty-text">
          왼쪽에 AI가 생성한 처방전 내용을
          <br />
          붙여넣으면 여기에 표시됩니다
        </div>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
          }
          .empty-icon {
            font-size: 48px;
            margin-bottom: 12px;
          }
          .empty-text {
            font-size: 12px;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  const sections = parseHTMLPrescription(text);

  return (
    <div className="prescription-content">
      {sections.map((section, idx) => (
        <div key={idx}>
          {section.type === 'medicine' && renderMedicineSection(section)}
          {section.type === 'sideeffect' && renderSideEffectSection(section)}
          {section.type === 'followup' && renderFollowUpSection(section)}
          {section.type === 'notes' && renderNotesSection(section)}
        </div>
      ))}

      <style jsx>{`
        .prescription-content {
          font-family: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
          font-size: 11px;
          line-height: 1.7;
        }

        /* 섹션 제목 */
        :global(.section-title) {
          background: #0066cc;
          color: white;
          padding: 6px 12px;
          font-weight: 700;
          font-size: 14px;
          margin: 6px 0 5px 0;
        }

        /* 약품 테이블 */
        :global(.medicine-table) {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #cccccc;
          margin-bottom: 8px;
        }

        :global(.medicine-table th) {
          background: #f0f0f0;
          border: 1px solid #cccccc;
          padding: 5px 6px;
          font-weight: 600;
          font-size: 10px;
          text-align: center;
        }

        :global(.medicine-table td) {
          border: 1px solid #cccccc;
          padding: 5px 6px;
          font-size: 10px;
        }

        :global(.medicine-name) {
          font-weight: 600;
          color: #0066cc;
        }

        :global(.usage-row) {
          background: #f9f9f9;
        }

        :global(.usage-instruction) {
          color: #333;
          font-size: 9px;
          padding-left: 10px;
        }

        /* 부작용 경고 박스 */
        :global(.warning-box) {
          border: 2px solid #cc0000;
          background: #fff5f5;
          padding: 8px;
          margin-bottom: 8px;
        }

        :global(.warning-header) {
          font-weight: 700;
          color: #cc0000;
          font-size: 13px;
          margin-bottom: 5px;
        }

        :global(.warning-item) {
          padding: 4px 0 4px 24px;
          position: relative;
          font-size: 11px;
          margin-bottom: 3px;
        }

        :global(.warning-item::before) {
          content: '⚠️';
          position: absolute;
          left: 0;
          top: 4px;
        }

        /* 추가 처방 리스트 */
        :global(.followup-list) {
          background: #f0f8ff;
          border: 1px solid #0066cc;
          padding: 8px;
          margin-bottom: 8px;
        }

        :global(.followup-item) {
          padding: 5px 0 5px 24px;
          position: relative;
          font-size: 11px;
          border-bottom: 1px dotted #ccc;
          margin-bottom: 3px;
        }

        :global(.followup-item:last-child) {
          border-bottom: none;
          margin-bottom: 0;
        }

        :global(.followup-item::before) {
          content: '▶';
          position: absolute;
          left: 4px;
          top: 6px;
          color: #0066cc;
          font-size: 9px;
        }

        /* 의사 소견 */
        :global(.notes-section) {
          border-top: 2px solid #333;
          padding-top: 8px;
          margin-top: 8px;
        }

        :global(.note-paragraph) {
          padding: 6px 12px;
          margin: 4px 0;
          border-left: 4px solid #0066cc;
          background: #f9f9f9;
          font-size: 13px;
          line-height: 1.8;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

// 섹션 타입 정의
type SectionType = 'medicine' | 'sideeffect' | 'followup' | 'notes';

interface Section {
  type: SectionType;
  title: string;
  items: PrescriptionItem[];
}

// HTML 처방전 파싱
function parseHTMLPrescription(text: string): Section[] {
  const sections: Section[] = [];

  try {
    // <prescription> 태그 찾기
    const prescriptionMatch = text.match(/<prescription>([\s\S]*?)<\/prescription>/i);
    if (!prescriptionMatch) {
      return [];
    }

    const prescriptionContent = prescriptionMatch[1];

    // 각 섹션 파싱
    const sectionMatches = prescriptionContent.matchAll(
      /<section\s+type="(\w+)">([\s\S]*?)<\/section>/gi
    );

    for (const match of Array.from(sectionMatches)) {
      const sectionType = match[1].toLowerCase() as SectionType;
      const sectionContent = match[2];

      // 제목 추출
      const titleMatch = sectionContent.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      const items: PrescriptionItem[] = [];

      if (sectionType === 'medicine') {
        // <item> 안의 <name>, <usage> 파싱
        const itemMatches = sectionContent.matchAll(/<item>([\s\S]*?)<\/item>/gi);
        for (const itemMatch of Array.from(itemMatches)) {
          const itemContent = itemMatch[1];
          const nameMatch = itemContent.match(/<name>(.*?)<\/name>/i);
          const usageMatch = itemContent.match(/<usage>(.*?)<\/usage>/i);

          if (nameMatch && usageMatch) {
            items.push({
              name: nameMatch[1].trim(),
              desc: usageMatch[1].trim(),
            });
          }
        }
      } else if (sectionType === 'sideeffect') {
        // <item> 안의 <symptom>, <solution> 파싱
        const itemMatches = sectionContent.matchAll(/<item>([\s\S]*?)<\/item>/gi);
        for (const itemMatch of Array.from(itemMatches)) {
          const itemContent = itemMatch[1];
          const symptomMatch = itemContent.match(/<symptom>(.*?)<\/symptom>/i);
          const solutionMatch = itemContent.match(/<solution>(.*?)<\/solution>/i);

          if (symptomMatch && solutionMatch) {
            items.push({
              name: symptomMatch[1].trim(),
              desc: solutionMatch[1].trim(),
            });
          }
        }
      } else if (sectionType === 'followup') {
        // <item> 안의 <name>, <schedule> 파싱
        const itemMatches = sectionContent.matchAll(/<item>([\s\S]*?)<\/item>/gi);
        for (const itemMatch of Array.from(itemMatches)) {
          const itemContent = itemMatch[1];
          const nameMatch = itemContent.match(/<name>(.*?)<\/name>/i);
          const scheduleMatch = itemContent.match(/<schedule>(.*?)<\/schedule>/i);

          if (nameMatch && scheduleMatch) {
            items.push({
              name: nameMatch[1].trim(),
              desc: scheduleMatch[1].trim(),
            });
          }
        }
      } else if (sectionType === 'notes') {
        // <message> 태그들 파싱
        const messageMatches = sectionContent.matchAll(/<message>(.*?)<\/message>/gi);
        for (const messageMatch of Array.from(messageMatches)) {
          items.push({
            name: '',
            desc: messageMatch[1].trim(),
          });
        }
      }

      sections.push({
        type: sectionType,
        title: title || getDefaultTitle(sectionType),
        items,
      });
    }
  } catch (error) {
    console.error('HTML 파싱 에러:', error);
    return [];
  }

  return sections;
}

// 기본 제목 반환
function getDefaultTitle(type: SectionType): string {
  switch (type) {
    case 'medicine':
      return '올해의 치유약';
    case 'sideeffect':
      return '올해의 경험';
    case 'followup':
      return '내년의 치유 계획';
    case 'notes':
      return '전문가의 조언';
    default:
      return '';
  }
}

// 약품 테이블 렌더링
function renderMedicineSection(section: Section): JSX.Element {
  return (
    <>
      <div className="section-title">{section.title}</div>
      <table className="medicine-table">
        <thead>
          <tr>
            <th style={{ width: '35%' }}>약품명</th>
            <th style={{ width: '15%' }}>1회 투약량</th>
            <th style={{ width: '15%' }}>1일 투여횟수</th>
            <th style={{ width: '15%' }}>총 투약일수</th>
          </tr>
        </thead>
        <tbody>
          {section.items.map((item, idx) => (
            <React.Fragment key={idx}>
              <tr>
                <td className="medicine-name">{item.name}</td>
                <td style={{ textAlign: 'center' }}>1정</td>
                <td style={{ textAlign: 'center' }}>3회</td>
                <td style={{ textAlign: 'center' }}>365일</td>
              </tr>
              <tr className="usage-row">
                <td colSpan={4} className="usage-instruction">
                  용법: {item.desc}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}

// 부작용 경고 박스 렌더링
function renderSideEffectSection(section: Section): JSX.Element {
  return (
    <>
      <div className="section-title">{section.title}</div>
      <div className="warning-box">
        <div className="warning-header">⚠️ 부작용 및 주의사항</div>
        {section.items.map((item, idx) => (
          <div key={idx} className="warning-item">
            {item.name} → 대처법: {item.desc}
          </div>
        ))}
      </div>
    </>
  );
}

// 추가 처방 리스트 렌더링
function renderFollowUpSection(section: Section): JSX.Element {
  return (
    <>
      <div className="section-title">{section.title}</div>
      <div className="followup-list">
        {section.items.map((item, idx) => (
          <div key={idx} className="followup-item">
            {item.name} → {item.desc}
          </div>
        ))}
      </div>
    </>
  );
}

// 의사 소견 렌더링
function renderNotesSection(section: Section): JSX.Element {
  return (
    <div className="notes-section">
      <div className="section-title">{section.title}</div>
      {section.items.map((item, idx) => (
        <div key={idx} className="note-paragraph">
          {item.desc}
        </div>
      ))}
    </div>
  );
}
