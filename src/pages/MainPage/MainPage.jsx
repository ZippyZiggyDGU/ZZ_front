// src/pages/MainPage/MainPage.jsx
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getMagazines } from "../../api/magazine.js";
import { predictAtrialFibrillation } from "../../api/auth";
import { getRank } from "../../api/rank.js";       // 랭킹 API 헬퍼
import { getMypage } from "../../api/mypage.js";   // ← 새로 추가
import { useNavigate, Link } from "react-router-dom";
import ChatBot from "../../components/ChatBot/ChatBot";
import AiIcon from "../../assets/ai-icon.png";
import "./MainPage.css";

function MainPage() {
    const {
        updateUserInfo,
        updatePrsScore,
        updatePredictionResult,
        userInfo,
        isLoggedIn,
    } = useContext(UserContext);

    const [prsInput, setPrsInput] = useState("");
    const [systolicInput, setSystolicInput] = useState("");
    const [firstAgeInput, setFirstAgeInput] = useState("");
    const [isSmoker, setIsSmoker] = useState(false);
    const [showBot, setShowBot] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // ─────────────────────────────────────────────────────────────────────────────
    // 0) (NEW) 마운트 시: 로그인 상태라면 /mypage API를 호출해서 userInfo.age, userInfo.gender 세팅
    // ─────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isLoggedIn) return;

        getMypage()
            .then((res) => {
                const { userName, gender, age } = res.data;
                // gender: 0 = 남성, 1 = 여성
                updateUserInfo({
                    // userId는 원래 로그인할 때 이미 저장되어 있다고 가정
                    age: age,
                    gender: gender === 0 ? "male" : "female",
                    // name은 Context에 저장되어 있지 않으므로 필요 없으면 생략
                });
            })
            .catch((err) => {
                console.error("메인 페이지에서 /mypage 호출 오류:", err);
            });
    }, [isLoggedIn, updateUserInfo]);

    // ─────────────────────────────────────────────────────────────────────────────
    // 1) 랭킹 API 호출 관련 상태
    // ─────────────────────────────────────────────────────────────────────────────
    const [rankList, setRankList] = useState([]);    // [{ rank, userName }, …]
    const [loadingRank, setLoadingRank] = useState(true);
    const [errorRank, setErrorRank] = useState(null);

    // ─────────────────────────────────────────────────────────────────────────────
    // 2) 마운트 시(또는 로그인 상태 변경 시) 랭킹 호출
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
    // 3) 사용자 이름 가운데를 "*"로 가려주는 헬퍼 (길이가 2 이하면 그대로 반환)
    // ─────────────────────────────────────────────────────────────────────────────
    const obscureName = (name) => {
        if (!name) return "";
        if (name.length <= 2) return name;
        const middle = "*".repeat(name.length - 2);
        return name[0] + middle + name[name.length - 1];
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // 4) “분석하기” 버튼 클릭 시 예측 API 호출
    //    → requestBody.age, sex 은 Context의 userInfo에서 가져오도록 수정
    // ─────────────────────────────────────────────────────────────────────────────
    const handleAnalyze = async () => {
        updateUserInfo({
            systolic: Number(systolicInput),
            firstExamAge: Number(firstAgeInput),
            smoker: isSmoker,
        });
        updatePrsScore(Number(prsInput));

        const requestBody = {
            age: Number(userInfo.age || 50),                            // Context에서 가져온 age
            ASBP: Number(systolicInput),
            sex: userInfo.gender === "male" ? 1 : 0,                     // Context에서 가져온 gender
            exam1_age: Number(firstAgeInput),
            smoke: isSmoker ? 1 : 0,
            PRSice2: Number(prsInput),
        };

        setIsLoading(true);
        try {
            const response = await predictAtrialFibrillation(requestBody);
            const { label, probabilities } = response.data;
            updatePredictionResult({ label, probabilities });
            navigate("/analysis");
        } catch (err) {
            console.error("Predict API 호출 중 오류:", err);
            alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setPrsInput("");
        setSystolicInput("");
        setFirstAgeInput("");
        setIsSmoker(false);
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // 5) 매거진 목록 로딩 (기존 코드)
    // ─────────────────────────────────────────────────────────────────────────────
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
                console.error("매거진 로딩 중 오류:", err);
                setErrorMag("매거진을 불러오는 중 오류가 발생했습니다.");
                setLoadingMag(false);
            });
    }, []);

    return (
        <div className="main-page">
            <div className="top-section">
                {/* ─────────────────────────────────────────────────────────────────────── */}
                {/* 좌측: PRS 분석 입력 폼 (기존과 동일)                              */}
                {/* ─────────────────────────────────────────────────────────────────────── */}
                <div className="left-form">
                    <h1 className="main-title">심방세동 발병 확률 분석</h1>
                    <p className="main-subtitle">
                        분석을 위해 본인의 PRS 점수와 개인 건강 정보를 입력하세요
                    </p>

                    {/* PRS 점수 입력 */}
                    <div className="input-group">
                        <span className="input-label">PRS 점수</span>
                        <input
                            type="number"
                            value={prsInput}
                            onChange={(e) => setPrsInput(e.target.value)}
                            placeholder="PRS 점수를 입력하세요."
                        />
                    </div>

                    {/* 수축기 혈압 입력 */}
                    <div className="input-group">
                        <span className="input-label">수축기 혈압</span>
                        <input
                            type="number"
                            value={systolicInput}
                            onChange={(e) => setSystolicInput(e.target.value)}
                            placeholder="수축기 혈압 (최고 혈압)을 입력하세요."
                        />
                    </div>

                    {/* 첫 검진 나이 입력 */}
                    <div className="input-group">
                        <span className="input-label">첫 검진 나이</span>
                        <input
                            type="number"
                            value={firstAgeInput}
                            onChange={(e) => setFirstAgeInput(e.target.value)}
                            placeholder="첫 검진 시 나이를 입력하세요."
                        />
                    </div>

                    {/* 흡연 여부 토글 */}
                    <div className="input-group">
                        <span className="input-label">흡연 여부</span>
                        <div className="smoke-button-group">
                            <button
                                className={`smoke-button ${!isSmoker ? "selected" : ""}`}
                                onClick={() => setIsSmoker(false)}
                            >
                                아니오
                            </button>
                            <button
                                className={`smoke-button ${isSmoker ? "selected" : ""}`}
                                onClick={() => setIsSmoker(true)}
                            >
                                예
                            </button>
                        </div>
                    </div>

                    {/* 분석 / 초기화 버튼 */}
                    <div className="button-group">
                        <button className="button-reset" onClick={handleReset}>
                            초기화
                        </button>
                        <button
                            className="button-analyze"
                            onClick={handleAnalyze}
                            disabled={isLoading}
                        >
                            {isLoading ? "분석 중…" : "분석하기"}
                        </button>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────────────── */}
                {/* 우측: 실시간 랭킹 영역 (API 연동 + 로그인 분기)                       */}
                {/* ─────────────────────────────────────────────────────────────────────── */}
                <div className="right-ranking">
                    <h2 className="ranking-title">
                        심방세동 발병 확률 랭킹
                        <button
                            className="refresh-button"
                            onClick={() => {
                                // “새로고침” 버튼 클릭 시 랭킹 다시 불러오기
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
                    </h2>

                    {/* 1) 로딩 중 */}
                    {loadingRank && <p>랭킹 로딩 중…</p>}

                    {/* 2) 로그인 안 된 경우 */}
                    {!loadingRank && !isLoggedIn && (
                        <p className="error">랭킹을 확인하려면 로그인을 해야합니다</p>
                    )}

                    {/* 3) 로그인 되어 있지만 API 호출 에러가 난 경우 */}
                    {!loadingRank && isLoggedIn && errorRank && (
                        <p className="error">{errorRank}</p>
                    )}

                    {/* 4) 로그인 되어 있고 에러도 없고 로딩도 끝났다면 렌더링 */}
                    {!loadingRank && isLoggedIn && !errorRank && (
                        <div className="ranking-list">
                            {rankList.map((item, idx) => {
                                const rankNum = item.rank;          // 1,2,3,4(나),5
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
                                // 4번째(인덱스 3) → “나”
                                if (idx === 3) {
                                    return (
                                        <div key={rankNum} className="ranking-item">
                                            <span className="rank-circle">{rankNum}</span>
                                            <span className="rank-name">{obscureName(rawName)} (나)</span>
                                        </div>
                                    );
                                }
                                // 마지막(인덱스 4) → 꼴등
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
            </div>

            {/* ──────────────────────────────────────────────────────────────────────────── */}
            {/* 하단 매거진 섹션 (기존 코드와 동일)                                         */}
            {/* ──────────────────────────────────────────────────────────────────────────── */}
            <div className="bottom-magazine">
                <h2 className="magazine-title">건강 매거진</h2>
                <p className="magazine-subtext">
                    심혈관 건강 관리를 위해 매거진을 탐색해보세요
                </p>
                {loadingMag ? (
                    <p>로딩 중…</p>
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

            {/* AI 버튼 */}
            <button className="ai-button" onClick={() => setShowBot((v) => !v)}>
                <img src={AiIcon} alt="AI" className="ai-icon" />
            </button>
            {showBot && <ChatBot onClose={() => setShowBot(false)} />}
        </div>
    );
}

export default MainPage;