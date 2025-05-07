
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { magazineData } from "../../api/magazineData";
import { useNavigate, Link } from "react-router-dom";

import "./MainPage.css";

function MainPage() {
    const { updateUserInfo, updatePrsScore } = useContext(UserContext);
    const [prsInput, setPrsInput] = useState("");
    const [bloodSugarInput, setBloodSugarInput] = useState("");
    const [isSmoker, setIsSmoker] = useState(false);
    
    const navigate = useNavigate();

    const mockRanking = [
        { id: 1, name: "김○영" },
        { id: 2, name: "박○연" },
        { id: 3, name: "최○래" },
        { id: 4, name: "송○은 (나)" },
        { id: 5, name: "이○민" },
    ];

    const handleAnalyze = () => {
        updateUserInfo({
            bloodSugar: bloodSugarInput,
            smoker: isSmoker,
        });
        updatePrsScore(Number(prsInput))
        navigate("/analysis");
    };

    const handleReset = () => {
        setPrsInput("");
        setBloodSugarInput("");
        setIsSmoker(false);
    };

    return (
        <div className="main-page">
            <div className="top-section">
                <div className="left-form">
                    <h1 className="main-title">심혈관 질환 위험도 분석</h1>
                    <p className="main-subtitle">
                        분석을 위해 본인의 PRS 점수와 개인 건강 정보를 입력해주세요
                    </p>

                    <div className="input-group">
                        <input
                            type="number"
                            value={prsInput}
                            onChange={(e) => setPrsInput(e.target.value)}
                            placeholder="PRS 점수를 입력하세요."
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="number"
                            value={bloodSugarInput}
                            onChange={(e) => setBloodSugarInput(e.target.value)}
                            placeholder="공복 혈당을 입력하세요."
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
                        <button className="button-reset" onClick={handleReset}>초기화</button>
                        <button className="button-analyze" onClick={handleAnalyze}>분석하기</button>
                    </div>
                </div>

                <div className="right-ranking">
                    <h2 className="ranking-title">
                        심부전 위험도 랭킹
                        <button className="refresh-button" onClick={() => alert('데이터 새로고침 예정')}>
                            🔄
                        </button>
                    </h2>

                    <p className="ranking-desc">여성 / 또래 (만 50세 ~ 59세)</p>
                    <div className="ranking-list">
                        {mockRanking.map((person, index) => (
                            <div key={person.id} className="ranking-item">
                                {index < 3 ? (
                                    <span className="medal">{['🥇', '🥈', '🥉'][index]}</span>
                                ) : (
                                    <span className="rank-circle">{index + 1}</span>
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
                        <Link to={`/magazine/${item.id}`} key={item.id} className="magazine-card">
                            <div className="magazine-text">
                                <h2>{item.title}</h2>
                                <p>{item.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainPage;
