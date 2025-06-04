// src/pages/AnalysisPage/AnalysisPage.jsx
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getRecommend } from "../../api/recommend.js"; // 매거진 추천 API
import { getRank } from "../../api/rank.js";             // 랭킹 API
import "./AnalysisPage.css";
import { Link } from "react-router-dom";

function AnalysisPage() {
    // 1) Context에서 필요한 값 불러오기
    const { userInfo, predictionResult, isLoggedIn } = useContext(UserContext);
    const { label, probabilities } = predictionResult;
    const userId = userInfo.userId; // 로그인 시 UserContext에 저장된 userId

    // 2) 추천 매거진 상태
    const [magazines, setMagazines] = useState([]);
    const [loadingMag, setLoadingMag] = useState(true);
    const [errorMag, setErrorMag] = useState(null);

    // 3) 랭킹 상태
    const [rankList, setRankList] = useState([]);
    const [loadingRank, setLoadingRank] = useState(true);
    const [errorRank, setErrorRank] = useState(null);

    // ─────────────────────────────────────────────────────────────────────────────
    // 4) 예측 결과가 없으면 안내 후 리턴
    // ─────────────────────────────────────────────────────────────────────────────
    if (label === null || probabilities.length === 0) {
        return (
            <div className="analysis-page">
                <h1>분석된 결과가 없습니다.</h1>
                <p>메인 페이지에서 “분석하기”를 먼저 눌러주세요.</p>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // 5) 예측 확률 계산 (AF 발병 확률은 probabilities[1])
    // ─────────────────────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────────────────────
    // 6) 매거진 추천 API 호출 (컴포넌트 마운트 시)
    // ─────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!userId) {
            setErrorMag("사용자 정보가 없어 매거진을 불러올 수 없습니다.");
            setLoadingMag(false);
            return;
        }
        setLoadingMag(true);
        getRecommend(userId)
            .then((res) => {
                setMagazines(res.data || []);
                setErrorMag(null);
                setLoadingMag(false);
            })
            .catch((err) => {
                console.error("매거진 추천 API 오류:", err);
                setErrorMag("매거진 추천을 불러오는 중 오류가 발생했습니다.");
                setLoadingMag(false);
            });
    }, [userId]);

    // ─────────────────────────────────────────────────────────────────────────────
    // 7) 랭킹 API 호출 (컴포넌트 마운트 시)
    // ─────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isLoggedIn) {
            setErrorRank("랭킹을 확인하려면 로그인을 해야합니다.");
            setLoadingRank(false);
            return;
        }
        setLoadingRank(true);
        getRank()
            .then((res) => {
                setRankList(res.data || []);
                setErrorRank(null);
                setLoadingRank(false);
            })
            .catch((err) => {
                console.error("랭킹 API 호출 중 오류:", err);
                setErrorRank("랭킹 정보를 불러오는 중 오류가 발생했습니다.");
                setLoadingRank(false);
            });
    }, [isLoggedIn]);

    // ─────────────────────────────────────────────────────────────────────────────
    // 8) 이름 가운데를 "*"로 가려주는 헬퍼
    // ─────────────────────────────────────────────────────────────────────────────
    const obscureName = (name) => {
        if (!name) return "";
        if (name.length <= 2) return name;
        const middle = "*".repeat(name.length - 2);
        return name[0] + middle + name[name.length - 1];
    };

    return (
        <div className="analysis-page">
            {/* 1) 페이지 상단: 예측 결과 */}
            <h1>심방세동 분석 결과</h1>
            <h2 className="highlight">
                당신의 심방세동 발병 확률은{" "}
                <span>{(afProbability * 100).toFixed(1)}%</span>입니다.
            </h2>
            <p className="recommendation">{recommendationText}</p>

            {/* 2) 랭킹 섹션 */}
            <div className="ranking-section">
                <h3>
                    심방세동 발병 확률 랭킹
                    <button
                        className="refresh-button"
                        onClick={() => {
                            if (!isLoggedIn) {
                                setErrorRank("랭킹을 확인하려면 로그인을 해야합니다.");
                                return;
                            }
                            setLoadingRank(true);
                            getRank()
                                .then((res) => {
                                    setRankList(res.data || []);
                                    setErrorRank(null);
                                    setLoadingRank(false);
                                })
                                .catch((err) => {
                                    console.error("랭킹 API 재호출 오류:", err);
                                    setErrorRank("랭킹 정보를 불러오는 중 오류가 발생했습니다.");
                                    setLoadingRank(false);
                                });
                        }}
                    >
                        🔄
                    </button>
                </h3>

                {loadingRank && <p>랭킹 로딩 중…</p>}
                {!loadingRank && !isLoggedIn && (
                    <p className="error">랭킹을 확인하려면 로그인을 해야합니다</p>
                )}
                {!loadingRank && isLoggedIn && errorRank && (
                    <p className="error">{errorRank}</p>
                )}
                {!loadingRank && isLoggedIn && !errorRank && (
                    <div className="ranking-list">
                        {rankList.map((item, idx) => {
                            const rankNum = item.rank;
                            const rawName = item.userName || "";

                            if (idx === 0) {
                                return (
                                    <div key={rankNum} className="ranking-item">
                                        <span className="medal">🥇</span>
                                        <span className="rank-name">{obscureName(rawName)}</span>
                                    </div>
                                );
                            }
                            if (idx === 1) {
                                return (
                                    <div key={rankNum} className="ranking-item">
                                        <span className="medal">🥈</span>
                                        <span className="rank-name">{obscureName(rawName)}</span>
                                    </div>
                                );
                            }
                            if (idx === 2) {
                                return (
                                    <div key={rankNum} className="ranking-item">
                                        <span className="medal">🥉</span>
                                        <span className="rank-name">{obscureName(rawName)}</span>
                                    </div>
                                );
                            }
                            if (idx === 3) {
                                // “나” 자리
                                return (
                                    <div key={rankNum} className="ranking-item">
                                        <span className="rank-circle">{rankNum}</span>
                                        <span className="rank-name">
                                            {obscureName(rawName)} (나)
                                        </span>
                                    </div>
                                );
                            }
                            // 마지막(인덱스 4) 꼴등
                            return (
                                <div key={rankNum} className="ranking-item">
                                    <span className="rank-circle">{rankNum}</span>
                                    <span className="rank-name">{obscureName(rawName)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3) 사용자 정보 기반 매거진 추천 섹션 */}
            <div className="recommendation-section">
                <h3>
                    {userInfo.age}세{" "}
                    {userInfo.gender === "female" ? "여성" : "남성"}{" "}
                    {userInfo.smoker ? "흡연자" : "비흡연자"}인 당신을 위한 맞춤형 매거진
                    추천
                </h3>

                {loadingMag ? (
                    <p>매거진 추천을 불러오는 중…</p>
                ) : errorMag ? (
                    <p className="error">{errorMag}</p>
                ) : (
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