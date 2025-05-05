import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceDot
} from "recharts";
import "./AnalysisPage.css";

// 정규분포 데이터 생성
const normalDistData = Array.from({ length: 31 }, (_, i) => {
    const x = 60 + i;
    const y = Math.exp(-0.5 * Math.pow((x - 75) / 5, 2));
    return { score: x, density: y };
});

// 오류 함수 erf 근사식
function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * Math.abs(x));
    const y = 1 - (((((
        a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}

// 백분위 계산 함수
function calculatePercentile(score, mean = 75, std = 5) {
    const z = (score - mean) / std;
    const percentile = Math.round(100 * 0.5 * (1 + erf(z / Math.sqrt(2))));
    return percentile;
}

function AnalysisPage() {
    const { prsScore } = useContext(UserContext);
    const percentile = calculatePercentile(prsScore);

    console.log("현재 사용자 심혈관 점수:", prsScore);


    // 건강 추천 문구 (4등분 기준)
    let recommendation = "";
    if (percentile >= 75) {
        recommendation = "위험도가 높습니다. 즉시 생활 습관을 바꾸세요!";
    } else if (percentile >= 50) {
        recommendation = "주의가 필요합니다. 규칙적인 운동과 식단이 중요합니다.";
    } else if (percentile >= 25) {
        recommendation = "건강한 편입니다. 가벼운 운동과 식단관리를 시작해보세요.";
    } else {
        recommendation = "매우 건강합니다! 좋은 습관을 유지하세요.";
    }

    return (
        <div className="analysis-page">
            <h1>심혈관 분석 결과</h1>
            <h2 className="highlight">당신의 심혈관 위험도는 상위 {percentile}% 입니다.</h2>
            <p className="recommendation">{recommendation}</p>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={normalDistData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="score" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="density" stroke="#F28C28" strokeWidth={2} dot={false} />
                        <ReferenceDot
                            x={prsScore}
                            y={Math.exp(-0.5 * Math.pow((prsScore - 75) / 5, 2))}
                            r={6}
                            fill="#F28C28"
                            stroke="white"
                            strokeWidth={2}
                            label={{
                                value: "당신",
                                position: "top",
                                fill: "#F28C28",
                                fontSize: 14
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="tips-section">
                <h3>생활 습관 개선 팁</h3>
                <div className="tip-item"><span className="emoji">🥗</span> 채소 위주의 식단으로 바꾸기</div>
                <div className="tip-item"><span className="emoji">🚶‍♂️</span> 매일 30분 이상 걷기</div>
                <div className="tip-item"><span className="emoji">💧</span> 수분 충분히 섭취하기</div>
                <div className="tip-item"><span className="emoji">🛌</span> 규칙적인 수면 유지</div>
            </div>

        </div>
    );
}

export default AnalysisPage;
