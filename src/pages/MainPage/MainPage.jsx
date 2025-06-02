// src/pages/MainPage.jsx
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getMagazines } from "../../api/magazine.js";
import { predictAtrialFibrillation } from "../../api/auth"; // 예측 API 함수 임포트
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
    } = useContext(UserContext);

    const [prsInput, setPrsInput] = useState("");
    const [systolicInput, setSystolicInput] = useState("");
    const [firstAgeInput, setFirstAgeInput] = useState("");
    const [isSmoker, setIsSmoker] = useState(false);
    const [showBot, setShowBot] = useState(false);

    const [isLoading, setIsLoading] = useState(false); // 예측 API 호출 중 로딩 상태

    const navigate = useNavigate();

    const handleAnalyze = async () => {
        // 1) Context에 먼저 사용자 입력값 저장 (prsScore, systolic, firstExamAge, smoker)
        updateUserInfo({
            // (이 예제에서는 기존 userInfo.age, userInfo.gender, userInfo.bloodSugar 등은
            //  이미 로그인/프로필 단계에서 채워져 있다고 가정합니다.)
            systolic: Number(systolicInput),
            firstExamAge: Number(firstAgeInput),
            smoker: isSmoker,
        });
        updatePrsScore(Number(prsInput));

        // 2) 예측 API 요청을 위해 requestBody 구성
        //    API 스펙: { age, ASBP, sex, exam1_age, smoke, PRSice2 }
        //    - age: userInfo.age (string or number)
        //    - ASBP: 수축기 혈압(systolicInput)
        //    - sex: gender -> 0 혹은 1 (예: female=0, male=1) 
        //    - exam1_age: firstExamAge
        //    - smoke: smoker?1:0
        //    - PRSice2: PRS 점수(prsInput)
        const requestBody = {
            age: Number(userInfo.age || 20),
            ASBP: Number(systolicInput),
            sex: userInfo.gender === "male" ? 1 : 0,
            exam1_age: Number(firstAgeInput),
            smoke: isSmoker ? 1 : 0,
            PRSice2: Number(prsInput),
        };

        setIsLoading(true);

        try {
            // 3) 실제 API 호출
            const response = await predictAtrialFibrillation(requestBody);
            // PredictResponse 스펙에 따르면 response.data = { label: int, probabilities: [Double,...] }
            const { label, probabilities } = response.data;

            // 4) 받은 결과를 Context에 저장
            updatePredictionResult({ label, probabilities });

            // 5) AnalysisPage로 이동
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

    // 매거진 목록 로딩
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

    return (
        <div className="main-page">
            <div className="top-section">
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

                    {/* 흡연 여부 */}
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

                {/* 우측 랭킹 (더미 데이터) */}
                <div className="right-ranking">
                    <h2 className="ranking-title">
                        심방세동 발병 확률 랭킹
                        <button
                            className="refresh-button"
                            onClick={() => alert("데이터 새로고침 예정")}
                        >
                            🔄
                        </button>
                    </h2>
                    <div className="ranking-list">
                        {[
                            { id: 1, name: "김○영" },
                            { id: 2, name: "박○연" },
                            { id: 3, name: "최○래" },
                            { id: 4, name: "송지은 (나)", value: 57 },
                            { id: 5, name: "이○민", value: 154 },
                        ].map((person, idx) => (
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
            </div>

            {/* 하단 매거진 섹션 */}
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
                                    <h2>{item.title}</h2>
                                    {/* 첫 줄(1줄)만 보여주기 */}
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