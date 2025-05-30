import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { magazineData } from "../../api/magazineData";
import { useNavigate, Link } from "react-router-dom";
import ChatBot from "../../components/ChatBot/ChatBot";
import AiIcon from "../../assets/ai-icon.png";

import "./MainPage.css";

function MainPage() {
    const { updateUserInfo, updatePrsScore } = useContext(UserContext);
    const [prsInput, setPrsInput] = useState("");
    const [systolicInput, setSystolicInput] = useState("");      // 수축기 혈압
    const [firstAgeInput, setFirstAgeInput] = useState("");      // 첫 검진 나이
    const [isSmoker, setIsSmoker] = useState(false);
    const [showBot, setShowBot] = useState(false);

    const navigate = useNavigate();

    // 값(value)을 추가했습니다.
    const mockRanking = [
        { id: 1, name: "김○영" },
        { id: 2, name: "박○연" },
        { id: 3, name: "최○래" },
        { id: 4, name: "송지은 (나)", value: 57 },
        { id: 5, name: "이○민", value: 154 },
    ];

    const handleAnalyze = () => {
        // 입력값 context에 전달
        updateUserInfo({
            prsScore: Number(prsInput),
            systolic: Number(systolicInput),
            firstExamAge: Number(firstAgeInput),
            smoker: isSmoker,
        });
        updatePrsScore(Number(prsInput));
        navigate("/analysis");
    };

    const handleReset = () => {
        setPrsInput("");
        setSystolicInput("");
        setFirstAgeInput("");
        setIsSmoker(false);
    };

    return (
        <div className="main-page">
            <div className="top-section">
              <div className="left-form">
                    <h1 className="main-title">심방세동 발병 확률 분석</h1>
                    <p className="main-subtitle">
                        분석을 위해 본인의 PRS 점수와 개인 건강 정보를 입력하세요
                    </p>

                    {/* PRS 점수 */}
                    <div className="input-group">
                        <span className="input-label">PRS 점수</span>
                        <input
                            type="number"
                            value={prsInput}
                            onChange={(e) => setPrsInput(e.target.value)}
                            placeholder="PRS 점수를 입력하세요."
                        />
                    </div>

                    {/* 수축기 혈압 */}
                    <div className="input-group">
                        <span className="input-label">수축기 혈압</span>
                        <input
                            type="number"
                            value={systolicInput}
                            onChange={(e) => setSystolicInput(e.target.value)}
                            placeholder="수축기 혈압 (최고 혈압) 수치를 입력하세요."
                        />
                    </div>

                    {/* 첫 검진 나이 */}
                    <div className="input-group">
                        <span className="input-label">첫 검진 나이</span>
                        <input
                            type="number"
                            value={firstAgeInput}
                            onChange={(e) => setFirstAgeInput(e.target.value)}
                            placeholder="첫 검진 시 나이 기록을 입력하세요."
                        />
                    </div>

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

                    <div className="button-group">
                        <button className="button-reset" onClick={handleReset}>
                            초기화
                        </button>
                        <button className="button-analyze" onClick={handleAnalyze}>
                            분석하기
                        </button>
                    </div>
                </div>

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

                    {/* 원래 있던 설명은 제거했습니다 */}
                    {/* <p className="ranking-desc">여성 / 또래 (만 50세 ~ 59세)</p> */}

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
            </div>

            <div className="bottom-magazine">
                <h2 className="magazine-title">건강 매거진</h2>
                <p className="magazine-subtext">
                    심혈관 건강 관리를 위해 매거진을 탐색해보세요
                </p>
                <div className="magazine-cards">
                    {magazineData.map((item) => (
                        <Link
                            to={`/magazine/${item.id}`}
                            key={item.id}
                            className="magazine-card"
                        >
                            <div className="magazine-text">
                                <h2>{item.title}</h2>
                                <p>{item.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {/* 3. AI 버튼: 오른쪽 하단 고정 */}
            <button
                className="ai-button"
                onClick={() => setShowBot((v) => !v)}
            >


                {/* 아이콘 */}
                <img src={AiIcon} alt="AI" className="ai-icon" />
            </button>

         {/* 4. ChatBot 모달 */ }
        { showBot && <ChatBot onClose={() => setShowBot(false)} />}
        </div>
    );
}

export default MainPage;
