# 마음 처방전 생성기 - 데이터베이스 가이드

## 🗄️ 데이터베이스 구조

### Neon PostgreSQL
- **호스트**: ep-wild-art-a1hwrnq5-pooler.ap-southeast-1.aws.neon.tech
- **데이터베이스**: neondb
- **연결**: Pooler를 통한 connection pooling 사용

### 테이블 스키마: `prescriptions`

```sql
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,              -- 신청자 이름
  birth_year VARCHAR(4) NOT NULL,          -- 생년월일
  gender VARCHAR(10) NOT NULL,             -- 성별
  memory TEXT NOT NULL,                    -- 올해 긍정적 경험
  regret TEXT NOT NULL,                    -- 올해 어려움/아쉬움
  plan TEXT NOT NULL,                      -- 내년 치유 목표
  prescription_html TEXT NOT NULL,         -- AI 생성 처방전 (HTML)
  prescription_number VARCHAR(50) NOT NULL, -- 처방전 번호 (RX-YYYY-MM-####)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_prescriptions_name ON prescriptions(name);
CREATE INDEX idx_prescriptions_created_at ON prescriptions(created_at DESC);
CREATE INDEX idx_prescriptions_birth_year ON prescriptions(birth_year);
```

## 🚀 초기 설정

### 1. 환경 변수 설정
`.env.local` 파일에 다음 변수들이 설정되어 있어야 합니다:

```env
# Neon PostgreSQL Database
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NO_SSL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-wild-art-a1hwrnq5-pooler.ap-southeast-1.aws.neon.tech
POSTGRES_PASSWORD=***
POSTGRES_DATABASE=neondb
```

### 2. 데이터베이스 초기화
개발 서버를 실행한 상태에서:

```bash
# 개발 서버 실행 (터미널 1)
npm run dev

# 별도 터미널에서 DB 초기화 (터미널 2)
node scripts/init-db.js
```

또는 API 직접 호출:
```bash
curl -X POST http://localhost:3000/api/init-db
```

## 📡 API 엔드포인트

### 1. DB 초기화
```
POST /api/init-db
```
- 테이블 생성 및 인덱스 생성
- 응답: `{ success: true, message: "..." }`

### 2. 처방전 저장
```
POST /api/prescriptions
Content-Type: application/json

{
  "name": "홍길동",
  "birthYear": "1990",
  "gender": "남성",
  "memory": "긍정적 경험...",
  "regret": "아쉬웠던 점...",
  "plan": "내년 목표...",
  "prescriptionHtml": "<prescription>...</prescription>",
  "prescriptionNumber": "RX-2025-12-1234"
}
```

### 3. 처방전 조회 (필터링)
```
GET /api/prescriptions?filter=today
GET /api/prescriptions?filter=7days
GET /api/prescriptions?date=2025-12-11
GET /api/prescriptions?name=홍길동&birthYear=1990&gender=남성
```

**필터 옵션**:
- `filter`: today | 3days | 7days | 30days | all
- `date`: YYYY-MM-DD 형식
- `name`: 이름 (부분 검색)
- `birthYear`: 생년월일
- `gender`: 성별

### 4. 처방전 수정
```
PATCH /api/prescriptions/[id]
Content-Type: application/json

{
  "name": "홍길동",
  "memory": "수정된 경험..."
}
```

### 5. 처방전 삭제
```
DELETE /api/prescriptions/[id]
```

## 🎯 히스토리 기능

### 메인 페이지에서 사용
1. **📚 히스토리 보기** 버튼 클릭
2. 필터 옵션으로 원하는 처방전 검색
   - 기간별: 오늘, 3일, 7일, 30일, 전체
   - 특정 날짜 선택
   - 이름, 생년월일, 성별로 검색
3. 처방전 선택 시 폼에 자동 입력
4. 수정 버튼으로 직관적인 내용 수정 (HTML이 아닌 일반 텍스트로 표시)
5. 삭제 버튼으로 불필요한 데이터 제거

### 자동 저장
- Gemini AI로 처방전 생성 시 자동으로 DB에 저장됨
- 저장 실패 시에도 정상적으로 처방전 뷰어로 이동 (에러 무시)

## 🔒 보안

### .env.local 파일
- **절대 Git에 커밋하지 마세요!**
- `.gitignore`에 `.env*.local` 패턴이 이미 등록되어 있습니다
- 데이터베이스 비밀번호와 API 키가 포함되어 있습니다

### Vercel 배포
Vercel 대시보드에서 환경 변수를 설정하세요:
1. Project Settings → Environment Variables
2. 다음 변수들을 추가:
   - `GEMINI_API_KEY`
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NO_SSL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

## 🧪 테스트

### 로컬 테스트
```bash
# 1. 서버 실행
npm run dev

# 2. DB 초기화
node scripts/init-db.js

# 3. 브라우저에서 테스트
# - http://localhost:3000 접속
# - 더미 데이터로 처방전 생성
# - 히스토리 모달에서 조회, 수정, 삭제 테스트
```

### API 테스트
```bash
# 처방전 조회
curl http://localhost:3000/api/prescriptions?filter=all

# 특정 처방전 조회
curl http://localhost:3000/api/prescriptions/1
```

## 📊 데이터 관리

### 백업
Neon 대시보드에서 자동 백업 설정을 권장합니다.

### 데이터 초기화
⚠️ **주의**: 모든 데이터가 삭제됩니다!

```sql
-- psql 또는 Neon SQL Editor에서 실행
DROP TABLE IF EXISTS prescriptions CASCADE;
```

그 후 `node scripts/init-db.js`로 재생성

## 🎨 UI 기능

### 히스토리 모달
- **필터**: 날짜별, 기간별 조회
- **검색**: 이름, 생년월일, 성별로 검색
- **불러오기**: 선택한 처방전을 폼에 자동 입력
- **수정**: 모달에서 직관적으로 수정 (HTML 태그 숨김)
- **삭제**: 확인 후 영구 삭제

### 수정 모달
- 이름, 생년월일, 성별 수정
- 올해 긍정적 경험 (memory)
- 올해 어려움/아쉬움 (regret)
- 내년 치유 목표 (plan)
- **HTML 처방전은 수정 불가** (재생성 필요)

## 🐛 트러블슈팅

### "Cannot find module '@vercel/postgres'"
```bash
npm install @vercel/postgres
```

### "Failed to connect to database"
- `.env.local`의 데이터베이스 연결 정보 확인
- Neon 대시보드에서 데이터베이스 상태 확인
- 방화벽 설정 확인

### "Table does not exist"
```bash
node scripts/init-db.js
```

## 📝 변경 이력

### v1.0.0 (2025-12-11)
- ✅ Neon PostgreSQL 연동
- ✅ 처방전 저장/조회/수정/삭제 API
- ✅ 히스토리 모달 UI
- ✅ 자동 저장 기능
- ✅ 필터링 및 검색 기능
