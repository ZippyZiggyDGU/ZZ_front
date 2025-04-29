import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { mockHealthMagazines } from "../../api/mockData";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
    const { updateUserInfo } = useContext(UserContext);
    const [prsInput, setPrsInput] = useState("");
    const [bloodSugarInput, setBloodSugarInput] = useState("");
    const [isSmoker, setIsSmoker] = useState(false);
    const [magazines, setMagazines] = useState([]);
    const navigate = useNavigate();

    const mockRanking = [
        { id: 1, name: "김○영" },
        { id: 2, name: "박○연" },
        { id: 3, name: "최○래" },
        { id: 4, name: "송○은 (나)" },
        { id: 5, name: "이○민" },
    ];

    useEffect(() => {
        setMagazines(mockHealthMagazines);
    }, []);

    const handleAnalyze = () => {
        updateUserInfo({
            prsScore: prsInput,
            bloodSugar: bloodSugarInput,
            smoker: isSmoker,
        });
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
                {/* 왼쪽 입력폼 */}
                <div className="left-form">
                    <h1>심혈관 질환 위험도 분석</h1>

                    <div>
                        <label>PRS 점수</label><br />
                        <input
                            type="number"
                            value={prsInput}
                            onChange={(e) => setPrsInput(e.target.value)}
                            placeholder="PRS 점수를 입력하세요"
                        />
                    </div>

                    <div className="input-group">
                        <label>혈당</label><br />
                        <input
                            type="number"
                            value={bloodSugarInput}
                            onChange={(e) => setBloodSugarInput(e.target.value)}
                            placeholder="공복 혈당을 입력하세요"
                        />
                    </div>

                    <div className="input-group">
                        <label>흡연 여부</label><br />
                        <button onClick={() => setIsSmoker(false)}>아니오</button>
                        <button onClick={() => setIsSmoker(true)}>예</button>
                    </div>

                    <div className="button-group">
                        <button onClick={handleReset}>초기화</button>
                        <button onClick={handleAnalyze}>분석하기</button>
                    </div>
                </div>

                {/* 오른쪽 랭킹 */}
                <div className="right-ranking">
                    <h2>심부전 위험도 랭킹</h2>
                    {mockRanking.map((person, index) => (
                        <div key={person.id}>
                            {index + 1}위: {person.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* 아래쪽 매거진 */}
            <div className="bottom-magazine">
                <h2>건강 매거진</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {magazines.map((magazine) => (
                        <div key={magazine.id} style={{ width: "250px", border: "1px solid #ccc", padding: "15px", borderRadius: "10px" }}>
                            <h3>{magazine.title}</h3>
                            <p>{magazine.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default MainPage; 