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
        <div className="empty-icon">🧭</div>
        <div className="empty-text">
          <p>아직 생성된 나침반 메시지가 없습니다.</p>
          <p className="sub-text">AI가 생성한 내용을 붙여넣어주세요.</p>
        </div>
        <style jsx>{`
          .empty-state {
            text-align: center;
            padding: 100px 20px;
            color: #888;
            font-family: 'YeongjuSeonbi', sans-serif;
            border: 2px dashed #ddd;
            border-radius: 12px;
            background: #fafafa;
          }
          .empty-icon {
            font-size: 48px;
            margin-bottom: 20px;
            color: #94a3b8;
          }
          .empty-text {
            font-size: 18px;
            line-height: 1.6;
          }
          .sub-text {
            font-size: 14px;
            color: #aaa;
            margin-top: 8px;
          }
        `}</style>
      </div>
    );
  }

  const sections = parseHTMLPrescription(text);

  return (
    <div className="prescription-content">
      {sections.map((section, idx) => (
        <div key={idx} className="compass-section">
          {/* <div className="section-title">{section.title}</div> */}
          <div className="compass-messages">
            {section.items.map((item, itemIdx) => (
              <p key={itemIdx} className="compass-paragraph">
                {item.desc}
              </p>
            ))}
          </div>
        </div>
      ))}

      <style jsx>{`
        .prescription-content {
          font-family: 'YeongjuSeonbi', sans-serif;
          color: #1e293b;
        }

        .compass-section {
          margin-bottom: 20px;
        }

        .compass-messages {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .compass-paragraph {
          font-size: 26px;
          line-height: 1.8;
          word-break: keep-all;
          text-align: justify;
          letter-spacing: -0.02em;
        }

        /* 인쇄 시 폰트 크기 조정 */
        @media print {
          .compass-paragraph {
            font-size: 16pt;
            line-height: 1.5;
            margin-bottom: 8pt;
          }
        }
      `}</style>
    </div>
  );
}

// 섹션 타입 정의 (advice 추가)
type SectionType = 'medicine' | 'sideeffect' | 'followup' | 'notes' | 'blessing' | 'advice';

interface Section {
  type: SectionType;
  title: string;
  items: PrescriptionItem[];
}

// HTML 처방전 파싱
function parseHTMLPrescription(text: string): Section[] {
  const sections: Section[] = [];

  try {
    // Top-level tag can be prescription or compass
    const rootMatch = text.match(/<(prescription|compass)>([\s\S]*?)<\/(prescription|compass)>/i);

    // 태그가 없으면 전체 텍스트를 그냥 하나의 메시지로 취급
    if (!rootMatch) {
      return [
        {
          type: 'advice',
          title: '인생 나침반',
          items: [{ name: '', desc: text }],
        },
      ];
    }

    const content = rootMatch[2];

    // 각 섹션 파싱
    const sectionMatches = content.matchAll(/<section\s+type="(\w+)">([\s\S]*?)<\/section>/gi);

    for (const match of Array.from(sectionMatches)) {
      const sectionType = match[1].toLowerCase() as SectionType;
      const sectionContent = match[2];

      // 제목 추출
      const titleMatch = sectionContent.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      const items: PrescriptionItem[] = [];

      // blessing, notes, advice 모두 message 태그 파싱
      if (['blessing', 'notes', 'advice'].includes(sectionType)) {
        const messageMatches = sectionContent.matchAll(/<message>(.*?)<\/message>/gi);
        for (const messageMatch of Array.from(messageMatches)) {
          items.push({
            name: '',
            desc: messageMatch[1].trim(),
          });
        }
      }

      if (items.length > 0) {
        sections.push({
          type: sectionType,
          title: title || '나침반 메시지',
          items,
        });
      }
    }
  } catch (error) {
    console.error('HTML 파싱 에러:', error);
    return [];
  }

  return sections;
}
