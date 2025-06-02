// src/pages/AnalysisPage.jsx
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getMagazines } from "../../api/magazine.js";
import { Link } from "react-router-dom";

import "./AnalysisPage.css";

function AnalysisPage() {
    const { prsScore, userInfo, predictionResult } = useContext(UserContext);
    const { label, probabilities } = predictionResult;

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

    // ------ 3. 예측 결과가 Context에 있는지 확인 ------
    //     없다면 “분석 결과가 없습니다” 문구를 보여줍니다.
    if (label === null || probabilities.length === 0) {
        return (
            <div className="analysis-page">
                <h1>분석된 결과가 없습니다.</h1>
                <p>메인 페이지에서 “분석하기”를 먼저 눌러주세요.</p>
            </div>
        );
    }

    // 예시: probabilities 배열이 [p0, p1] 형태라고 가정했을 때,
    // AF(심방세동) 발병 확률을 probabilities[1]로 간주합니다.
    // 실제 배열 크기와 뜻은 백엔드 스펙에 맞춰 조정하세요.
    const afProbability = probabilities[1] ?? 0;

    // 추천 문구: 확률이 0.5 이상이면 “위험”, 아니면 “양호” 예시
    let recommendation = "";
    if (afProbability >= 0.75) {
        recommendation = "매우 높은 위험도입니다. 즉시 의료기관 상담을 권장합니다.";
    } else if (afProbability >= 0.5) {
        recommendation = "위험도가 높습니다. 생활 습관 개선을 권장합니다.";
    } else if (afProbability >= 0.25) {
        recommendation = "조금 주의가 필요합니다. 규칙적인 운동과 식단관리가 중요합니다.";
    } else {
        recommendation = "비교적 낮은 위험도입니다. 좋은 습관을 계속 유지하세요!";
    }

    return (
        <div className="analysis-page">
            {/* 1. 페이지 상단: 예측 결과 */}
            <h1>심방세동 분석 결과</h1>
            <h2 className="highlight">
                당신의 심방세동 발병 확률은 <span>{(afProbability * 100).toFixed(1)}%</span>입니다.
            </h2>
            <p className="recommendation">{recommendation}</p>

            {/* 2. 랭킹 섹션 (메인 페이지와 동일 UI) */}
            <div className="ranking-section">
                <h3>
                    심방세동 발병 확률 랭킹
                    <button
                        className="refresh-button"
                        onClick={() => alert("랭킹 데이터 새로고침 예정")}
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
                    {userInfo.age}세{" "}
                    {userInfo.gender === "female" ? "여성" : "남성"} {userInfo.smoker ? "흡연자" : "비흡연자"}인
                    당신을 위한 맞춤형 매거진 추천
                </h3>

                {loadingMag ? (
                    <p>매거진 로딩 중…</p>
                ) : errorMag ? (
                    <p className="error">{errorMag}</p>
                ) : (
                    <div className="magazine-cards">
                        {magazines.slice(0, 2).map((item) => (
                            <Link to={`/magazine/${item.id}`} key={item.id} className="magazine-card">
                                <div className="magazine-text">
                                    <h4>{item.title}</h4>
                                    {/* 본문을 줄바꿈(\n) 기준으로 첫 줄만 보여줍니다. */}
                                    <p>{item.content.split("\n")[0]}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalysisPage;