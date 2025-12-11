import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// GET - 특정 처방전 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const result = await sql`
      SELECT * FROM prescriptions WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '처방전을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      prescription: result.rows[0]
    });
  } catch (error) {
    console.error('처방전 조회 에러:', error);
    return NextResponse.json(
      { error: '처방전 조회 실패', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH - 처방전 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { name, birthYear, gender, memory, regret, plan, prescriptionHtml } = body;

    // 수정할 필드만 업데이트
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }
    if (birthYear !== undefined) {
      updates.push(`birth_year = $${paramIndex}`);
      values.push(birthYear);
      paramIndex++;
    }
    if (gender !== undefined) {
      updates.push(`gender = $${paramIndex}`);
      values.push(gender);
      paramIndex++;
    }
    if (memory !== undefined) {
      updates.push(`memory = $${paramIndex}`);
      values.push(memory);
      paramIndex++;
    }
    if (regret !== undefined) {
      updates.push(`regret = $${paramIndex}`);
      values.push(regret);
      paramIndex++;
    }
    if (plan !== undefined) {
      updates.push(`plan = $${paramIndex}`);
      values.push(plan);
      paramIndex++;
    }
    if (prescriptionHtml !== undefined) {
      updates.push(`prescription_html = $${paramIndex}`);
      values.push(prescriptionHtml);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: '수정할 내용이 없습니다.' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE prescriptions
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '처방전을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      prescription: result.rows[0],
      message: '처방전이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('처방전 수정 에러:', error);
    return NextResponse.json(
      { error: '처방전 수정 실패', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - 처방전 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const result = await sql`
      DELETE FROM prescriptions WHERE id = ${id}
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '처방전을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '처방전이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('처방전 삭제 에러:', error);
    return NextResponse.json(
      { error: '처방전 삭제 실패', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
