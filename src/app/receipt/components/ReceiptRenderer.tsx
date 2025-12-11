interface ReceiptRendererProps {
  text: string;
}

export default function ReceiptRenderer({ text }: ReceiptRendererProps) {
  if (!text.trim()) {
    return (
      <div className="text-gray-400 text-center py-12 text-sm">
        왼쪽에 텍스트를 입력하면
        <br />
        여기에 미리보기가 나타납니다
      </div>
    );
  }

  // 텍스트 전처리: 섹션 키워드 앞에 줄바꿈 강제
  let preprocessedText = text;

  // 섹션 키워드 전에 줄바꿈 추가 (이미 줄바꿈이 없는 경우)
  preprocessedText = preprocessedText.replace(
    /([^\n])(구매 내역|반품.*내역|미수령.*내역|예약 주문|올해의 결산|특별 메시지)/g,
    '$1\n$2'
  );

  // [메시지] 태그 전에도 줄바꿈
  preprocessedText = preprocessedText.replace(/([^\n])(\[메시지\])/g, '$1\n$2');

  const lines = preprocessedText.split('\n');
  const elements: JSX.Element[] = [];
  let inSpecialSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // ===== 구분선 무시
    if (trimmedLine.match(/^[=\-]{3,}$/)) {
      continue;
    }

    // 헤더/푸터 정보 무시
    if (
      trimmedLine.startsWith('발행일시:') ||
      trimmedLine.startsWith('참여자:') ||
      trimmedLine.startsWith('영수증 번호:') ||
      trimmedLine.match(/^\d{4}/) ||
      trimmedLine.includes('인생 결산') ||
      trimmedLine.includes('LIFE') ||
      trimmedLine.includes('RECEIPT') ||
      trimmedLine.includes('BARCODE') ||
      trimmedLine.includes('응원합니다') ||
      trimmedLine.includes('정산소') ||
      trimmedLine.includes('배움과 성장') ||
      trimmedLine.match(/^[\|\s]+$/) ||
      trimmedLine.match(/^-{3,}$/)
    ) {
      continue;
    }

    // [섹션] 태그로 시작하는 경우
    if (trimmedLine.startsWith('[섹션]')) {
      const title = trimmedLine.replace('[섹션]', '').trim();
      inSpecialSection =
        title.includes('결산') || (title.includes('특별') && title.includes('메시지'));

      elements.push(
        <div key={i} className="font-bold text-base mt-8 mb-3 text-gray-900 first:mt-0">
          {title}
        </div>
      );
      elements.push(
        <div key={`${i}-divider`} className="border-t border-dashed border-gray-400 mb-4" />
      );
      continue;
    }

    // 섹션 키워드 감지 (태그 없이 온 경우)
    const sectionMatch = trimmedLine.match(
      /^(구매 내역.*|반품.*내역.*|미수령.*내역.*|예약 주문.*|올해의 결산.*|특별 메시지)/
    );
    if (sectionMatch) {
      let title = sectionMatch[1];
      let remainingContent = trimmedLine.substring(title.length).trim();

      // 제목에서 >> 이후 내용 제거
      if (title.includes('>>')) {
        const titleParts = title.split('>>');
        title = titleParts[0].trim();
        remainingContent = titleParts.slice(1).join('>>').trim() + ' ' + remainingContent;
      }

      inSpecialSection =
        title.includes('결산') || (title.includes('특별') && title.includes('메시지'));

      elements.push(
        <div key={i} className="font-bold text-base mt-8 mb-3 text-gray-900 first:mt-0">
          {title}
        </div>
      );
      elements.push(
        <div key={`${i}-divider`} className="border-t border-dashed border-gray-400 mb-4" />
      );

      // 남은 내용에 >> 항목들이 있으면 파싱
      if (remainingContent && remainingContent.includes('>>')) {
        // >> 로 분리
        const segments = remainingContent
          .split('>>')
          .map(s => s.trim())
          .filter(s => s);
        const parsedItems: Array<{ name: string; desc: string }> = [];

        for (let j = 0; j < segments.length; j++) {
          if (j === 0) {
            // 첫 세그먼트는 항목명만
            parsedItems.push({ name: segments[j], desc: '' });
          } else {
            const segment = segments[j];
            const words = segment.split(/\s+/);

            if (j < segments.length - 1 && words.length > 2) {
              // 중간 세그먼트: "설명 + 다음 항목명"
              // 한국어 항목명은 대부분 2단어 (예: "새 노트북", "고장의 위기")
              const nameWordCount = 2;
              const desc = words.slice(0, -nameWordCount).join(' ');
              const nextName = words.slice(-nameWordCount).join(' ');

              // 이전 항목의 설명 설정
              if (parsedItems.length > 0) {
                parsedItems[parsedItems.length - 1].desc = desc;
              }

              // 다음 항목 추가
              parsedItems.push({ name: nextName, desc: '' });
            } else {
              // 마지막 세그먼트는 설명만
              if (parsedItems.length > 0) {
                parsedItems[parsedItems.length - 1].desc = segment;
              }
            }
          }
        }

        // 파싱된 항목들 렌더링
        parsedItems.forEach((item, idx) => {
          if (item.name && item.desc) {
            elements.push(
              <div key={`${i}-item-${idx}`} className="flex items-start gap-2 mb-3 text-sm">
                <span className="text-gray-700 flex-shrink-0">{item.name}</span>
                <span className="flex-1 border-b border-dotted border-gray-300 mb-1 min-w-[20px]" />
                <span className="text-gray-800 flex-shrink-0">{item.desc}</span>
              </div>
            );
          }
        });
      }
      continue;
    }

    // [메시지] 태그
    if (trimmedLine.startsWith('[메시지]')) {
      const message = trimmedLine.replace('[메시지]', '').trim();
      elements.push(
        <div
          key={i}
          className="text-sm leading-relaxed text-gray-800 pl-4 py-1.5 my-0.5 border-l-2 border-gray-400"
        >
          {message}
        </div>
      );
      continue;
    }

    // 괄호 설명 무시
    if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
      continue;
    }

    // >> 구분자가 여러 개 있는 경우 (한 줄에 여러 항목)
    if (trimmedLine.includes('>>')) {
      const items = trimmedLine.split(/\s+(?=[^\s]+\s*>>)/);
      items.forEach((item, idx) => {
        const parts = item.split('>>').map(s => s.trim());
        if (parts.length >= 2 && parts[0] && parts[1]) {
          elements.push(
            <div key={`${i}-${idx}`} className="flex items-start gap-2 mb-3 text-sm">
              <span className="text-gray-700 flex-shrink-0">{parts[0]}</span>
              <span className="flex-1 border-b border-dotted border-gray-300 mb-1 min-w-[20px]" />
              <span className="text-gray-800 flex-shrink-0">{parts[1]}</span>
            </div>
          );
        }
      });
      continue;
    }

    // 빈 줄
    if (trimmedLine === '') {
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // 일반 텍스트
    if (inSpecialSection) {
      elements.push(
        <div
          key={i}
          className="text-sm leading-relaxed text-gray-800 pl-4 py-1.5 my-0.5 border-l-2 border-gray-400"
        >
          {line}
        </div>
      );
    } else {
      elements.push(
        <div key={i} className="text-xs text-gray-500 leading-relaxed mb-1">
          {line}
        </div>
      );
    }
  }

  return <div className="space-y-0">{elements}</div>;
}
