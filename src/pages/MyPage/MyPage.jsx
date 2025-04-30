import { useState, useEffect } from "react";
import "./MyPage.css";
import EditModal from "../../components/EditModal/EditModal.jsx";
import { recordData } from "../../api/recordData.js";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function MyPage() {
    const [startDate, setStartDate] = useState("2025-01-01");
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const [filteredRecords, setFilteredRecords] = useState([]);

    const handleSearch = () => {
        const results = recordData.filter((record) => {
            return record.date >= startDate && record.date <= endDate;
        });
        const sorted = [...results].sort((a, b) => new Date(a.date) - new Date(b.date));
        setFilteredRecords(sorted);
        setIsSearched(true);
    };

    useEffect(() => {
        // 초기 검색 자동 실행
        handleSearch();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="mypage-container">
            {/* 상단 사용자 정보 영역 */}
            <div className="mypage-header">
                <div className="greeting">
                    <h2>송지은 님</h2>
                    <p>안녕하세요 오늘도 건강한 하루 되세요</p>
                </div>
                <button className="edit-button" onClick={openModal}>프로필 수정</button>
            </div>

            {/* 기록 섹션 */}
            <div className="record-section">
                <h2 className="record-title">심혈관 질병 위험도 기록</h2>
                <p className="record-sub">당신의 진행상황을 추적하세요</p>

                <div className="date-filter">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>~</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button onClick={handleSearch} className="search-button">
                        조회
                    </button>
                </div>

                {isSearched && (
                    <>
                        <div className="record-cards">
                            {filteredRecords.map((record, index) => {
                                const previousScore = index > 0 ? filteredRecords[index - 1].score : null;
                                const difference = previousScore !== null ? record.score - previousScore : null;
                                return (
                                    <div className="record-card" key={record.date}>
                                        <p className="date">{record.date}</p>
                                        <p className="score">{record.score}점</p>
                                        {difference !== null && (
                                            <p className="change">
                                                {difference >= 0 ? `+${difference}점` : `${difference}점`}
                                            </p>
                                        )}
                                    </div>

                                );
                            })}
                        </div>

                        <div className="graph-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={filteredRecords} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="score" stroke="#F28C28" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>

            {/* 프로필 수정 모달 */}
            {isModalOpen && <EditModal onClose={closeModal} />}
        </div>
    );
}

export default MyPage;
