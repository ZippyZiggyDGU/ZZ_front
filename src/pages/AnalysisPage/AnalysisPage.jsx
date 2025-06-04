// src/pages/AnalysisPage.jsx
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getRecommend } from "../../api/recommend.js"; // 매거진 추천 API 함수
import { getRank } from "../../api/rank.js";             // 랭킹 API 함수
import { Link } from "react-router-dom";
import "./AnalysisPage.css";

function AnalysisPage() {
    // 1) Context에서 필요한 값 불러오기
    const { userInfo, predictionResult, isLoggedIn } = useContext(UserContext);
    const { label, probabilities } = predictionResult;
    const userId = userInfo.userId; // 로그인 시 UserContext에 저장해 둔 userId

    // 2) 추천 매거진 상태
    const [magazines, setMagazines] = useState([]);
    const [loadingMag, setLoadingMag] = useState(true);
    const [errorMag, setErrorMag] = useState(null);

    // 3) 랭킹 상태
    //    - API에서 항상 5개의 객체(인덱스 0~4)가 내려온다고 가정
    //      [ { rank:1, userName:"..." }, { rank:2, userName:"..." }, { rank:3, userName:"..." },
    //        { rank:4, userName:"실제이름" }, // “나” 자리에 해당
    //        { rank:5, userName:"다른이름" } ]
    const [rankList, setRankList] = useState([]);
    const [loadingRank, setLoadingRank] = useState(true);
    const [errorRank, setErrorRank] = useState(null);

    // ───────────────────────────────────────────────────────────────────────────────
    // 4) 예측 결과가 없으면 간단 안내 후 리턴
    // ───────────────────────────────────────────────────────────────────────────────
    if (label === null || probabilities.length === 0) {
        return (
            <div className="analysis-page">
                <h1>분석된 결과가 없습니다.</h1>
                <p>메인 페이지에서 “분석하기”를 먼저 눌러주세요.</p>
            </div>
        );
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // 5) 예측 확률 계산 (예: AF 발병 확률은 probabilities[1])
    // ───────────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────────
    // 6) 매거진 추천 API 호출 (componentDidMount 역할)
    // ───────────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────────
    // 7) 랭킹 API 호출 (componentDidMount 역할)
    // ───────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        // 1) 로그인되지 않으면 랭킹 API 호출하지 않고, 안내 메시지를 보여줌
        if (!isLoggedIn) {
            setErrorRank("랭킹을 확인하려면 로그인을 해야합니다.");
            setLoadingRank(false);
            return;
        }

        // 2) 로그인된 상태라면 /rank 호출
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

    // ───────────────────────────────────────────────────────────────────────────────
    // 8) 이름 가운데를 "*"로 가려주는 헬퍼 함수
    //    - 길이가 2 이하이면 그대로 반환
    //    - 길이가 그 이상이면 첫 글자 + 중간(*) + 마지막 글자
    // ───────────────────────────────────────────────────────────────────────────────
    const obscureName = (name) => {
        if (!name) return "";
        if (name.length <= 2) return name;
        const middle = "*".repeat(name.length - 2);
        return name[0] + middle + name[name.length - 1];
    };

    return (
        <div className="analysis-page">
            {/* ──────────────────────────────────────────────────────────────────────────── */}
            {/* 1. 페이지 상단: 예측 결과 출력                                           */}
            {/* ──────────────────────────────────────────────────────────────────────────── */}
            <h1>심방세동 분석 결과</h1>
            <h2 className="highlight">
                당신의 심방세동 발병 확률은 <span>{(afProbability * 100).toFixed(1)}%</span>입니다.
            </h2>
            <p className="recommendation">{recommendationText}</p>

            {/* ──────────────────────────────────────────────────────────────────────────── */}
            {/* 2. 랭킹 섹션                                                           */}
            {/* ──────────────────────────────────────────────────────────────────────────── */}
            <div className="ranking-section">
                <h3>
                    심방세동 발병 확률 랭킹
                    <button
                        className="refresh-button"
                        onClick={() => {
                            // 새로고침 버튼을 눌렀을 때, 로그인 상태라면 다시 API 호출
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

                {/*
          2-1) 로딩 중
        */}
                {loadingRank && <p>랭킹 로딩 중…</p>}

                {/*
          2-2) 로그인 안 된 경우
        */}
                {!loadingRank && !isLoggedIn && (
                    <p className="error">랭킹을 확인하려면 로그인을 해야합니다</p>
                )}

                {/*
          2-3) 로그인 되었지만 API 호출 에러가 난 경우
        */}
                {!loadingRank && isLoggedIn && errorRank && (
                    <p className="error">{errorRank}</p>
                )}

                {/*
          2-4) 로그인 되었고, 에러도 없으며, 로딩도 끝났다면 실제 랭킹 렌더
          - rankList는 항상 길이가 5라고 가정
            인덱스 0→1등, 1→2등, 2→3등, 3→4등(“나”), 4→5등(“꼴등”)
        */}
                {!loadingRank && isLoggedIn && !errorRank && (
                    <div className="ranking-list">
                        {rankList.map((item, idx) => {
                            const rankNum = item.rank;          // 실제 등수 (1~5)
                            const rawName = item.userName || ""; // 실사용 이름

                            // 1~3등 : 메달 이모지 + 가운데 * 처리된 이름
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

                            // 4번째(인덱스 3) : 무조건 “나” (rank circle + “나”)
                            if (idx === 3) {
                                return (
                                    <div key={rankNum} className="ranking-item">
                                        <span className="rank-circle">{rankNum}</span>
                                        <span className="rank-name">{obscureName(rawName)} (나)</span>
                                    </div>
                                );
                            }

                            // 마지막(인덱스 4) : 꼴등 (rank circle + * 처리된 이름)
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

            {/* ──────────────────────────────────────────────────────────────────────────── */}
            {/* 3. 사용자 정보 기반 매거진 추천 섹션                                      */}
            {/* ──────────────────────────────────────────────────────────────────────────── */}
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