import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    // prescriptions 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        birth_year VARCHAR(4) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        memory TEXT NOT NULL,
        regret TEXT NOT NULL,
        plan TEXT NOT NULL,
        prescription_html TEXT NOT NULL,
        prescription_number VARCHAR(50) NOT NULL,
        generation_method VARCHAR(20) DEFAULT 'manual',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // generation_method 컬럼 추가 (기존 테이블에 컬럼이 없을 경우)
    try {
      await sql`
        ALTER TABLE prescriptions
        ADD COLUMN IF NOT EXISTS generation_method VARCHAR(20) DEFAULT 'manual'
      `;
    } catch {
      // 컬럼이 이미 존재하면 무시
      console.log('generation_method 컬럼 추가 스킵 (이미 존재)');
    }

    // 인덱스 생성 (검색 성능 향상)
    await sql`
      CREATE INDEX IF NOT EXISTS idx_prescriptions_name ON prescriptions(name)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_prescriptions_created_at ON prescriptions(created_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_prescriptions_birth_year ON prescriptions(birth_year)
    `;

    return NextResponse.json({
      success: true,
      message: '데이터베이스 테이블이 성공적으로 생성되었습니다.',
    });
  } catch (error) {
    console.error('DB 초기화 에러:', error);
    return NextResponse.json(
      {
        error: '데이터베이스 초기화 실패',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
