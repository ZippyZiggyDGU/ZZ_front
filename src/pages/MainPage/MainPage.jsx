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
        navigate("/analysis");  // 분석 결과 페이지로 이동
    };


    const handleReset = () => {
        setPrsInput("");
        setBloodSugarInput("");
        setIsSmoker(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>심혈관 질환 위험도 분석</h1>

            <section style={{ marginBottom: "30px" }}>
                <div>
                    <label>PRS 점수</label><br />
                    <input
                        type="number"
                        value={prsInput}
                        onChange={(e) => setPrsInput(e.target.value)}
                        placeholder="PRS 점수를 입력하세요"
                    />
                </div>

                <div style={{ marginTop: "15px" }}>
                    <label>혈당</label><br />
                    <input
                        type="number"
                        value={bloodSugarInput}
                        onChange={(e) => setBloodSugarInput(e.target.value)}
                        placeholder="공복 혈당을 입력하세요"
                    />
                </div>

                <div style={{ marginTop: "15px" }}>
                    <label>흡연 여부</label><br />
                    <button
                        onClick={() => setIsSmoker(false)}
                        style={{ marginRight: "10px", backgroundColor: !isSmoker ? "#ccc" : "white" }}
                    >
                        아니오
                    </button>
                    <button
                        onClick={() => setIsSmoker(true)}
                        style={{ backgroundColor: isSmoker ? "#ccc" : "white" }}
                    >
                        예
                    </button>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button onClick={handleReset} style={{ marginRight: "10px" }}>초기화</button>
                    <button onClick={handleAnalyze}>분석하기</button>
                </div>
            </section>
            
            <section style={{ marginTop: "40px" }}>
                <h2>심부전 위험도 랭킹</h2>
                <div style={{ marginTop: "10px" }}>
                    {mockRanking.map((person, index) => (
                        <div key={person.id} style={{ marginBottom: "8px" }}>
                            {index + 1}위: {person.name}
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2>건강 매거진</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {magazines.map((magazine) => (
                        <div
                            key={magazine.id}
                            style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}
                        >
                            <h3>{magazine.title}</h3>
                            <p>{magazine.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default MainPage;
