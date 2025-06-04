// src/pages/MyPage/MyPage.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import EditModal from "../../components/EditModal/EditModal.jsx";
import { recordData } from "../../api/recordData.js";
import { UserContext } from "../../contexts/UserContext"; // ← 추가
import { getMypage } from "../../api/mypage.js";           // ← 추가

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
    const navigate = useNavigate();
    const {
        userInfo,
        updateUserInfo,
        logoutUser,
    } = useContext(UserContext); // Context에서 logoutUser, userInfo, updateUserInfo 가져오기

    const [startDate, setStartDate] = useState("2025-01-01");
    const [endDate, setEndDate] = useState(() =>
        new Date().toISOString().split("T")[0]
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const [filteredRecords, setFilteredRecords] = useState([]);

    // ─────────────────────────────────────────────────────────────────────────────
    // 0) 마운트 시: /mypage API 호출 → userName, gender, birth, age 가져와서 Context도 업데이트
    // ─────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        getMypage()
            .then((res) => {
                const { userName, gender, birth, age } = res.data;
                updateUserInfo({
                    userName, // Context에 userName이 없다면, store해 두거나 생략하셔도 됩니다.
                    age,
                    gender: gender === 0 ? "male" : "female",
                });
            })
            .catch((err) => {
                console.error("MyPage: /mypage 호출 오류:", err);
            });
    }, [updateUserInfo]);

    // 로그아웃 버튼 클릭 시
    const handleLogout = () => {
        logoutUser();       // Context의 logoutUser → 토큰 삭제 + isLoggedIn=false
        navigate("/login"); // 로그인 페이지로 리다이렉트
    };

    const handleSearch = () => {
        const results = recordData.filter((record) => {
            return record.date >= startDate && record.date <= endDate;
        });
        const sorted = [...results].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        setFilteredRecords(sorted);
        setIsSearched(true);
    };

    useEffect(() => {
        // 페이지 로딩 시 최초 조회
        handleSearch();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="mypage-container">
            {/* ──────────────────────────────────────────────────────────────── */}
            {/* 상단 사용자 정보 + 로그아웃/비밀번호 변경 버튼 영역 */}
            <div className="mypage-header">
                <div className="greeting">
                    <h2>{userInfo.userName} 님</h2>
                    <p>안녕하세요, 오늘도 건강한 하루 되세요</p>
                </div>

                <div className="mypage-actions">
                    {/* 로그아웃 버튼 */}
                    <button className="logout-button" onClick={handleLogout}>
                        로그아웃
                    </button>
                    {/* 비밀번호 변경 버튼 */}
                    <button className="edit-button" onClick={openModal}>
                        비밀번호 변경
                    </button>
                </div>
            </div>
            {/* ──────────────────────────────────────────────────────────────── */}

            {/* 기록 섹션 */}
            <div className="record-section">
                <h2 className="record-title">심방세동 발병 확률 기록</h2>
                <p className="record-sub">당신의 진행 상황을 추적하세요</p>

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
                                const previousScore =
                                    index > 0 ? filteredRecords[index - 1].score : null;
                                const difference =
                                    previousScore !== null
                                        ? record.score - previousScore
                                        : null;
                                return (
                                    <div className="record-card" key={record.date}>
                                        <p className="date">{record.date}</p>
                                        <p className="score">{record.score}점</p>
                                        {difference !== null && (
                                            <p className="change">
                                                {difference >= 0
                                                    ? `+${difference}점`
                                                    : `${difference}점`}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="graph-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={filteredRecords}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#F28C28"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>

            {/* 프로필 수정(비밀번호 변경) 모달 */}
            {isModalOpen && <EditModal onClose={closeModal} />}
        </div>
    );
}

export default MyPage;