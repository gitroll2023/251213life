import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// POST - 처방전 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthYear, gender, memory, regret, plan, prescriptionHtml, prescriptionNumber, generationMethod } = body;

    // 필수 필드 검증
    if (!name || !birthYear || !gender || !memory || !regret || !plan || !prescriptionHtml || !prescriptionNumber) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 한국 시간 (UTC+9) 생성
    const koreaTime = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));

    const result = await sql`
      INSERT INTO prescriptions (
        name, birth_year, gender, memory, regret, plan,
        prescription_html, prescription_number, generation_method, created_at, updated_at
      )
      VALUES (
        ${name}, ${birthYear}, ${gender}, ${memory}, ${regret}, ${plan},
        ${prescriptionHtml}, ${prescriptionNumber}, ${generationMethod || 'manual'}, ${koreaTime.toISOString()}, ${koreaTime.toISOString()}
      )
      RETURNING id, created_at
    `;

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at,
      message: '처방전이 성공적으로 저장되었습니다.'
    });
  } catch (error) {
    console.error('처방전 저장 에러:', error);
    return NextResponse.json(
      { error: '처방전 저장 실패', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET - 처방전 조회 (필터링 포함)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'all'; // today, 3days, 7days, 30days, all
    const date = searchParams.get('date'); // YYYY-MM-DD 형식
    const name = searchParams.get('name');
    const birthYear = searchParams.get('birthYear');
    const gender = searchParams.get('gender');

    let query = 'SELECT * FROM prescriptions WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    // 날짜 필터
    if (date) {
      query += ` AND DATE(created_at) = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    } else if (filter !== 'all') {
      const now = new Date();
      let dateFilter = new Date();

      switch (filter) {
        case 'today':
          query += ` AND DATE(created_at) = CURRENT_DATE`;
          break;
        case '3days':
          dateFilter.setDate(now.getDate() - 3);
          query += ` AND created_at >= $${paramIndex}`;
          params.push(dateFilter.toISOString());
          paramIndex++;
          break;
        case '7days':
          dateFilter.setDate(now.getDate() - 7);
          query += ` AND created_at >= $${paramIndex}`;
          params.push(dateFilter.toISOString());
          paramIndex++;
          break;
        case '30days':
          dateFilter.setDate(now.getDate() - 30);
          query += ` AND created_at >= $${paramIndex}`;
          params.push(dateFilter.toISOString());
          paramIndex++;
          break;
      }
    }

    // 이름 필터
    if (name) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${name}%`);
      paramIndex++;
    }

    // 생년월일 필터
    if (birthYear) {
      query += ` AND birth_year = $${paramIndex}`;
      params.push(birthYear);
      paramIndex++;
    }

    // 성별 필터
    if (gender) {
      query += ` AND gender = $${paramIndex}`;
      params.push(gender);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await sql.query(query, params);

    return NextResponse.json({
      success: true,
      prescriptions: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('처방전 조회 에러:', error);
    return NextResponse.json(
      { error: '처방전 조회 실패', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
