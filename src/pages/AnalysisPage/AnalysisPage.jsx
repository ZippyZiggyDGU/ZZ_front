import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./AnalysisPage.css";

function AnalysisPage() {
    const { userInfo, prsScore } = useContext(UserContext);

    // 🧡 더미로 백분위 생성
    const dummyPercentile = Math.floor(Math.random() * 100);
    // 또는 고정하고 싶으면 예를 들어 const dummyPercentile = 70;

    // 🧡 추천 문구 결정
    let recommendation = "";

    if (dummyPercentile >= 80) {
        recommendation = "위험도가 높습니다. 반드시 식단과 운동을 시작하세요.";
    } else if (dummyPercentile >= 50) {
        recommendation = "양호하지만 꾸준한 관리가 필요합니다.";
    } else {
        recommendation = "건강한 상태입니다! 앞으로도 좋은 습관을 유지하세요.";
    }

    return (
        <div className="analysis-page" style={{ backgroundColor: "#FFF8F0" }}>
            <h1>심혈관 분석 결과</h1>

            <div className="result-box">
                <p><strong>당신의 심혈관 위험도는 상위 {dummyPercentile}%입니다.</strong></p>
                <p className="recommendation">{recommendation}</p>
            </div>
        </div>
    );
}

export default AnalysisPage;
