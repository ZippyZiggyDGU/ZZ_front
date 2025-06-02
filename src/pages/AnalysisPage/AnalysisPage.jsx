// src/pages/AnalysisPage.jsx

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getMagazines } from "../../api/magazine.js"; // 매거진 API 호출 함수
import {
    // import { LineChart, … } from "recharts"; // 그래프는 제거하므로 import하지 않음
} from "recharts";
import { Link } from "react-router-dom";

import "./AnalysisPage.css";

function AnalysisPage() {
    // UserContext에서 prsScore(점수)와 userInfo를 가져옵니다.
    const { prsScore, userInfo } = useContext(UserContext);

    // ------ 1. 랭킹 더미 데이터 (메인 페이지와 동일) ------
    const mockRanking = [
        { id: 1, name: "김○영" },
        { id: 2, name: "박○연" },
        { id: 3, name: "최○래" },
        { id: 4, name: "송지은 (나)", value: 57 },
        { id: 5, name: "이○민", value: 154 },
    ];

    // ------ 2. 매거진 목록(추천) 상태 ------
    const [magazines, setMagazines] = useState([]);
    const [loadingMag, setLoadingMag] = useState(true);
    const [errorMag, setErrorMag] = useState(null);

    useEffect(() => {
        // 예시: 전체 매거진을 가져온 뒤, 간단히 앞쪽 일부만 뿌리겠습니다.
        getMagazines()
            .then((res) => {
                setMagazines(res.data);
                setLoadingMag(false);
            })
            .catch((err) => {
                console.error(err);
                setErrorMag("매거진을 불러오는 중 오류가 발생했습니다.");
                setLoadingMag(false);
            });
    }, []);

    // ------ 3. 분석 결과 문구 (percentile, recommendation) ------
    // 그래프 부분을 제거했기 때문에, percentile 계산만 남겨 두겠습니다.
    function erf(x) {
        const sign = x >= 0 ? 1 : -1;
        const a1 = 0.254829592,
            a2 = -0.284496736,
            a3 = 1.421413741;
        const a4 = -1.453152027,
            a5 = 1.061405429;
        const p = 0.3275911;
        const t = 1 / (1 + p * Math.abs(x));
        const y =
            1 -
            (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
            Math.exp(-x * x);
        return sign * y;
    }
    function calculatePercentile(score, mean = 75, std = 5) {
        const z = (score - mean) / std;
        return Math.round(100 * 0.5 * (1 + erf(z / Math.sqrt(2))));
    }
    const percentile = calculatePercentile(prsScore);

    let recommendation = "";
    if (percentile >= 75) {
        recommendation = "위험도가 높습니다. 즉시 생활 습관을 바꾸세요!";
    } else if (percentile >= 50) {
        recommendation = "주의가 필요합니다. 규칙적인 운동과 식단이 중요합니다.";
    } else if (percentile >= 25) {
        recommendation = "건강한 편입니다. 가벼운 운동과 식단 관리를 시작해보세요.";
    } else {
        recommendation = "매우 건강합니다! 좋은 습관을 유지하세요.";
    }

    return (
        <div className="analysis-page">
            {/* 1. 페이지 상단: 분석 결과 */}
            <h1>심방세동 분석 결과</h1>
            <h2 className="highlight">
                당신의 심방세동 발병 확률은 <span>{percentile}%</span>입니다.
            </h2>
            <p className="recommendation">{recommendation}</p>

            {/* 2. 랭킹 섹션 (메인 페이지와 동일한 UI) */}
            <div className="ranking-section">
                <h3>
                    심방세동 발병 확률 랭킹
                    <button
                        className="refresh-button"
                        onClick={() => alert("데이터 새로고침 예정")}
                    >
                        🔄
                    </button>
                </h3>
                <div className="ranking-list">
                    {mockRanking.map((person, idx) => (
                        <div key={person.id} className="ranking-item">
                            {idx < 3 ? (
                                <span className="medal">{["🥇", "🥈", "🥉"][idx]}</span>
                            ) : (
                                <span className="rank-circle">{person.value}</span>
                            )}
                            <span className="rank-name">{person.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. 사용자 정보 기반 매거진 추천 섹션 */}
            <div className="recommendation-section">
                <h3>
                    {userInfo.age}세 {userInfo.gender === "female" ? "여성" : "남성"}{" "}
                    {userInfo.smoker ? "흡연자" : "비흡연자"}인 당신을 위한 맞춤형 매거진
                </h3>

                {loadingMag ? (
                    <p>매거진 로딩 중…</p>
                ) : errorMag ? (
                    <p className="error">{errorMag}</p>
                ) : (
                    <div className="magazine-cards">
                        {/* 예시: 앞에서 두 개만 보여주기 */}
                        {magazines.slice(0, 2).map((item) => (
                            <Link
                                to={`/magazine/${item.id}`}
                                key={item.id}
                                className="magazine-card"
                            >
                                <div className="magazine-text">
                                    <h4>{item.title}</h4>
                                    {/* 본문을 줄바꿈(\n) 기준으로 첫 줄만 출력 */}
                                    <p>{item.content.split("\n")[0]}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. (원한다면) 아래에 더 많은 매거진 추천 문구를 추가하거나, Tailored UI를 넣어도 됩니다. */}
        </div>
    );
}

export default AnalysisPage;