import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import "./AnalysisPage.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceLine,
} from "recharts";

function AnalysisPage() {
    const { userInfo, prsScore } = useContext(UserContext);

    // 가상의 정규분포 데이터 생성 (평균: 75, 표준편차: 10)
    const normalDistData = Array.from({ length: 31 }, (_, i) => {
        const x = 60 + i; // 점수 60~90
        const y = Math.exp(-0.5 * Math.pow((x - 75) / 5, 2)); // 정규분포 수식
        return { score: x, density: y };
    });

    // 백분위 계산 (그래프 데이터에서 내 점수 이하 개수 / 전체)
    const percentile = Math.floor(
        (normalDistData.filter((d) => d.score <= prsScore).length / normalDistData.length) * 100
    );

    // 추천 문구
    let recommendation = "";
    if (percentile >= 80) {
        recommendation = "위험도가 높습니다. 반드시 식단과 운동을 시작하세요.";
    } else if (percentile >= 50) {
        recommendation = "양호하지만 꾸준한 관리가 필요합니다.";
    } else {
        recommendation = "건강한 상태입니다! 앞으로도 좋은 습관을 유지하세요.";
    }

    return (
        <div className="analysis-page">
            <h1>심혈관 분석 결과</h1>
            <h2 className="highlight">
                당신의 심혈관 위험도는 상위 {percentile}% 입니다.
            </h2>
            <p className="recommendation">{recommendation}</p>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={normalDistData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="score" />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="density" stroke="#F28C28" strokeWidth={2} dot={false} />
                        <ReferenceLine
                            x={prsScore}
                            stroke="#F28C28"
                            strokeWidth={3}
                            label={{
                                value: "당신의 점수",
                                fill: "#F28C28",
                                position: "top",
                                fontSize: 14,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default AnalysisPage;
