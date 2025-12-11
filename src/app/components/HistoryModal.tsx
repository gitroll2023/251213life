'use client';

import { useState, useEffect } from 'react';

interface Prescription {
  id: number;
  name: string;
  birth_year: string;
  gender: string;
  memory: string;
  regret: string;
  plan: string;
  prescription_html: string;
  prescription_number: string;
  generation_method?: string;
  created_at: string;
  updated_at: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prescription: Prescription) => void;
}

export default function HistoryModal({ isOpen, onClose, onSelect }: HistoryModalProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'today' | '3days' | '7days' | '30days' | 'all'>('today');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchBirthYear, setSearchBirthYear] = useState('');
  const [searchGender, setSearchGender] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    birthYear: '',
    gender: '',
    memory: '',
    regret: '',
    plan: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchPrescriptions();
    }
  }, [isOpen, filter, selectedDate, searchName, searchBirthYear, searchGender]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDate) {
        params.append('date', selectedDate);
      } else {
        params.append('filter', filter);
      }
      if (searchName) params.append('name', searchName);
      if (searchBirthYear) params.append('birthYear', searchBirthYear);
      if (searchGender) params.append('gender', searchGender);

      const response = await fetch(`/api/prescriptions?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPrescriptions(data.prescriptions);
      } else {
        alert('히스토리를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('히스토리 조회 에러:', error);
      alert('히스토리를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setEditForm({
      name: prescription.name,
      birthYear: prescription.birth_year,
      gender: prescription.gender,
      memory: prescription.memory,
      regret: prescription.regret,
      plan: prescription.plan
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPrescription) return;

    try {
      const response = await fetch(`/api/prescriptions/${selectedPrescription.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          birthYear: editForm.birthYear,
          gender: editForm.gender,
          memory: editForm.memory,
          regret: editForm.regret,
          plan: editForm.plan
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('수정되었습니다!');
        setShowEditModal(false);
        fetchPrescriptions();
      } else {
        alert('수정 실패: ' + data.error);
      }
    } catch (error) {
      console.error('수정 에러:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('삭제되었습니다!');
        fetchPrescriptions();
      } else {
        alert('삭제 실패: ' + data.error);
      }
    } catch (error) {
      console.error('삭제 에러:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 fade-in"
        onClick={onClose}
      />

      {/* 사이드바 */}
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] lg:w-[500px] bg-white shadow-2xl flex flex-col slide-in-right">
        {/* 헤더 */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">📚 처방전 히스토리</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* 필터 및 검색 */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* 날짜 필터 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">기간 필터</label>
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as any);
                  setSelectedDate('');
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="today">오늘</option>
                <option value="3days">3일 이내</option>
                <option value="7days">7일 이내</option>
                <option value="30days">30일 이내</option>
                <option value="all">전체</option>
              </select>
            </div>

            {/* 특정 날짜 선택 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">특정 날짜</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* 이름 검색 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="이름 검색..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* 생년월일 검색 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">출생연도</label>
              <input
                type="text"
                value={searchBirthYear}
                onChange={(e) => setSearchBirthYear(e.target.value)}
                placeholder="YYYY"
                maxLength={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* 성별 필터 */}
          <div className="flex gap-2">
            <button
              onClick={() => setSearchGender('')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                searchGender === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSearchGender('남성')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                searchGender === '남성' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setSearchGender('여성')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                searchGender === '여성' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              여성
            </button>
          </div>
        </div>

        {/* 처방전 리스트 */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">조회된 처방전이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-bold text-gray-900">{prescription.name}</h3>
                      <span className="text-sm text-gray-500">{prescription.birth_year}년생</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {prescription.gender}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>처방전 번호:</strong> {prescription.prescription_number}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>생성일:</strong> {new Date(prescription.created_at).toLocaleString('ko-KR')}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>생성 방법:</strong>{' '}
                      {prescription.generation_method === 'gemini_ai' ? (
                        <span className="text-teal-600 font-medium">🤖 AI 자동생성</span>
                      ) : (
                        <span className="text-gray-600">✍️ 수동 입력</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        localStorage.setItem('prescription', prescription.prescription_html);
                        localStorage.setItem('patientInfo', JSON.stringify({
                          name: prescription.name,
                          birthYear: prescription.birth_year,
                          gender: prescription.gender
                        }));
                        window.location.href = '/receipt';
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      💊 처방전 보기
                    </button>
                    <button
                      onClick={() => onSelect(prescription)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => handleEdit(prescription)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 결과 카운트 */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            총 <strong className="text-blue-600">{prescriptions.length}개</strong>의 처방전이 조회되었습니다.
          </p>
        </div>
      </div>

      {/* 수정 모달 */}
      {showEditModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">✏️ 처방전 수정</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">출생연도</label>
                  <input
                    type="text"
                    value={editForm.birthYear}
                    onChange={(e) => setEditForm({ ...editForm, birthYear: e.target.value })}
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  올해 긍정적인 경험 (기억)
                </label>
                <textarea
                  value={editForm.memory}
                  onChange={(e) => setEditForm({ ...editForm, memory: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  올해 어려움/아쉬움 (후회)
                </label>
                <textarea
                  value={editForm.regret}
                  onChange={(e) => setEditForm({ ...editForm, regret: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  내년 치유 목표 (계획)
                </label>
                <textarea
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
