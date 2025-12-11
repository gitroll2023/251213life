// DB 초기화 스크립트
// 사용법: node scripts/init-db.js

async function initDatabase() {
  try {
    console.log('🔧 데이터베이스 초기화 중...');

    const response = await fetch('http://localhost:3000/api/init-db', {
      method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ 성공:', data.message);
    } else {
      console.error('❌ 실패:', data.error);
      if (data.details) {
        console.error('상세:', data.details);
      }
    }
  } catch (error) {
    console.error('❌ 에러:', error.message);
    console.log('\n💡 먼저 개발 서버를 실행하세요: npm run dev');
  }
}

initDatabase();
