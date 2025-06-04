// src/pages/MyPage/MyPage.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import EditModal from "../../components/EditModal/EditModal.jsx";
import { UserContext } from "../../contexts/UserContext";
import { getMypage, getLogs } from "../../api/mypage.js"; // <-- getMypage, getLogs 헬퍼

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
    const { userInfo, updateUserInfo, logoutUser } = useContext(UserContext);

    // 날짜 필터 기본값
    const [startDate, setStartDate] = useState("2025-01-01");
    const [endDate, setEndDate] = useState(() =>
        new Date().toISOString().split("T")[0]
    );

    // 1) isSearched 상태 복원 (조회 버튼을 눌렀는지 여부)
    const [isSearched, setIsSearched] = useState(false);

    // 2) 서버에서 가져온 전체 로그
    //    ModelLogResponse: { testDate: "YYYY-MM-DD", result: double } 
    //    → 소수(0.114) 형태로 오면 percent: result * 100 으로 표시
    const [allLogs, setAllLogs] = useState([]);

    // 3) 날짜 범위에 맞춰 필터된 로그 배열
    //    각 원소 형태: { date: "2025-06-01", percent: 11.4, diff:  +0.6  }
    const [filteredLogs, setFilteredLogs] = useState([]);

    // 4) 모달(비밀번호 변경) 오픈 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ───────────────────────────────────────────────────────────────────────────
    // 마운트 시 ① /mypage API → 사용자 정보 가져와서 Context 업데이트
    // ───────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        getMypage()
            .then((res) => {
                const { userName, gender, birth, age } = res.data;
                updateUserInfo({
                    userName,
                    age,
                    gender: gender === 0 ? "male" : "female",
                });
            })
            .catch((err) => {
                console.error("MyPage: /mypage 호출 오류:", err);
            });
    }, [updateUserInfo]);

    // ───────────────────────────────────────────────────────────────────────────
    // 마운트 시 ② /get-logs API → allLogs 상태에 저장
    // ───────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        getLogs()
            .then((res) => {
                // res.data === [ { testDate: "2025-06-01", result: 0.114 }, … ]
                const logsFromServer = res.data.map((item) => ({
                    date: item.testDate,          // e.g. "2025-06-01"
                    percent: +(item.result * 100).toFixed(1), // 0.114 → 11.4
                }));
                setAllLogs(logsFromServer);
            })
            .catch((err) => {
                console.error("MyPage: /get-logs 호출 오류:", err);
            });
    }, []);

    // ───────────────────────────────────────────────────────────────────────────
    // 날짜 조회 버튼 또는 allLogs 업데이트 시 필터링 실행
    // ───────────────────────────────────────────────────────────────────────────
    const handleSearch = () => {
        // 문자열 비교를 이용한 날짜 범위 필터링
        const results = allLogs.filter(
            (record) => record.date >= startDate && record.date <= endDate
        );

        // 날짜 오름차순 정렬
        const sorted = [...results].sort((a, b) =>
            a.date.localeCompare(b.date)
        );

        // 변화량(diff) 계산: 이전 항목과 비교해서 퍼센트 차이 구하기
        const withDiff = sorted.map((rec, idx, arr) => {
            if (idx === 0) {
                return { ...rec, diff: null };
            } else {
                const prev = arr[idx - 1];
                const diffValue = +(rec.percent - prev.percent).toFixed(1);
                return { ...rec, diff: diffValue };
            }
        });

        setFilteredLogs(withDiff);
        setIsSearched(true);
    };

    // allLogs가 서버에서 바뀔 때마다 자동으로 handleSearch 실행
    // → 페이지 로드 후 API가 들어오면 바로 조회 상태가 true가 됩니다.
    useEffect(() => {
        if (allLogs.length > 0) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allLogs]);

    // ───────────────────────────────────────────────────────────────────────────
    // 모달 제어
    // ───────────────────────────────────────────────────────────────────────────
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // ───────────────────────────────────────────────────────────────────────────
    // 로그아웃 버튼 클릭 → Context 로그아웃 + 로그인 페이지로 리다이렉트
    // ───────────────────────────────────────────────────────────────────────────
    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <div className="mypage-container">
            {/* ──────────────────────────────────────────────────────────────── */}
            {/* 상단: 사용자 정보 + 로그아웃/비밀번호 변경 버튼                 */}
            {/* ──────────────────────────────────────────────────────────────── */}
            <div className="mypage-header">
                <div className="greeting">
                    <h2>{userInfo.userName} 님</h2>
                    <p>안녕하세요, 오늘도 건강한 하루 되세요</p>
                </div>

                <div className="mypage-actions">
                    <button className="logout-button" onClick={handleLogout}>
                        로그아웃
                    </button>
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

                {/* ──────────────────────────────────────────────────────────── */}
                {/* isSearched가 true일 때만 “조회 결과” 영역을 보여줌        */}
                {/* ──────────────────────────────────────────────────────────── */}
                {isSearched && (
                    <>
                        {/* ──────────────────────────────────────────────────────── */}
                        {/* 1) 필터된 로그 카드 (날짜 / 퍼센트 / 증감량)         */}
                        {/* ──────────────────────────────────────────────────────── */}
                        <div className="record-cards">
                            {filteredLogs.map((record) => {
                                return (
                                    <div className="record-card" key={record.date}>
                                        <p className="date">{record.date}</p>
                                        <p className="score">{record.percent.toFixed(1)}%</p>
                                        {record.diff !== null && (
                                            <p
                                                className="change"
                                                style={{
                                                    color: record.diff >= 0 ? "#f28c28" : "#2e8b57",
                                                }}
                                            >
                                                {record.diff >= 0
                                                    ? `+${record.diff.toFixed(1)}%`
                                                    : `${record.diff.toFixed(1)}%`}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ──────────────────────────────────────────────────────── */}
                        {/* 2) 그래프: filteredLogs → 퍼센트 변화를 선 그래프로 표시 */}
                        {/* ──────────────────────────────────────────────────────── */}
                        <div className="graph-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={filteredLogs}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis
                                        unit="%"
                                        domain={[
                                            (dataMin) => Math.floor(dataMin) - 5,
                                            (dataMax) => Math.ceil(dataMax) + 5,
                                        ]}
                                    />
                                    <Tooltip
                                        formatter={(value) => `${value.toFixed(1)}%`}
                                        labelFormatter={(label) => `날짜: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="percent"
                                        stroke="#F28C28"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
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