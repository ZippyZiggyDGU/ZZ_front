import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getRecommend } from "../../api/recommend.js"; // 추천 API 호출 함수
import { Link } from "react-router-dom";
import "./AnalysisPage.css";

function AnalysisPage() {
    const { userInfo, predictionResult } = useContext(UserContext);
    const { label, probabilities } = predictionResult;
    const userId = userInfo.userId; // 로그인 시 저장된 userId

    // ------ 1. 랭킹 더미 데이터 (메인 페이지와 동일) ------
    const mockRanking = [
        { id: 1, name: "김○영" },
        { id: 2, name: "박○연" },
        { id: 3, name: "최○래" },
        { id: 4, name: "송지은 (나)", value: 57 },
        { id: 5, name: "이○민", value: 154 },
    ];

    // ------ 2. 추천 매거진 상태 ------
    const [magazines, setMagazines] = useState([]);
    const [loadingMag, setLoadingMag] = useState(true);
    const [errorMag, setErrorMag] = useState(null);

    // ------ 3. 예측 결과 검증 (없으면 간단 안내 후 리턴) ------
    if (label === null || probabilities.length === 0) {
        return (
            <div className="analysis-page">
                <h1>분석된 결과가 없습니다.</h1>
                <p>메인 페이지에서 “분석하기”를 먼저 눌러주세요.</p>
            </div>
        );
    }

    // ------ 4. 예측 확률 계산 (예: AF 발병 확률은 probabilities[1]) ------
    const afProbability = probabilities[1] ?? 0;
    let recommendationText = "";
    if (afProbability >= 0.75) {
        recommendationText = "매우 높은 위험도입니다. 즉시 의료기관 상담을 권장합니다.";
    } else if (afProbability >= 0.5) {
        recommendationText = "위험도가 높습니다. 생활 습관 개선을 권장합니다.";
    } else if (afProbability >= 0.25) {
        recommendationText = "조금 주의가 필요합니다. 규칙적인 운동과 식단관리가 중요합니다.";
    } else {
        recommendationText = "비교적 낮은 위험도입니다. 좋은 습관을 계속 유지하세요!";
    }

    // ------ 5. 컴포넌트 마운트 시 추천 API 호출 ------
    useEffect(() => {
        console.log("▶▶▶ AnalysisPage에서 넘기는 userId:", userId);
        // userId가 비어 있으면 호출하지 않음
        if (!userId) {
            setErrorMag("사용자 정보가 없어 매거진을 불러올 수 없습니다.");
            setLoadingMag(false);
            return;
        }

        setLoadingMag(true);
        getRecommend(userId)
            .then((res) => {
                // 응답: 추천된 매거진 2개가 담긴 배열이라고 가정
                setMagazines(res.data);
                setLoadingMag(false);
            })
            .catch((err) => {
                console.error("매거진 추천 API 오류:", err);
                setErrorMag("매거진 추천을 불러오는 중 오류가 발생했습니다.");
                setLoadingMag(false);
            });
    }, [userId]);

    return (
        <div className="analysis-page">
            {/* 1. 페이지 상단: 예측 결과 */}
            <h1>심방세동 분석 결과</h1>
            <h2 className="highlight">
                당신의 심방세동 발병 확률은 <span>{(afProbability * 100).toFixed(1)}%</span>입니다.
            </h2>
            <p className="recommendation">{recommendationText}</p>

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
                    {userInfo.gender === "female" ? "여성" : "남성"}{" "}
                    {userInfo.smoker ? "흡연자" : "비흡연자"}인 당신을 위한 맞춤형 매거진 추천
                </h3>

                {loadingMag ? (
                    <p>매거진 추천을 불러오는 중…</p>
                ) : errorMag ? (
                    <p className="error">{errorMag}</p>
                ) : (
                    /* ← 아래는 magazines.map을 단 한 번만 호출합니다. */
                    <div className="magazine-cards">
                        {magazines.map((item) => (
                            <Link
                                to={`/magazine/${item.id}`}
                                key={item.id}
                                className="magazine-card"
                            >
                                <div className="magazine-text">
                                    <h4>{item.title}</h4>
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