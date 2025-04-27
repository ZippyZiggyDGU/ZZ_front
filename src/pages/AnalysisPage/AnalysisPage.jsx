import "./AnalysisPage.css";

function AnalysisPage() {
    return (
        <div className="analysis-page" style={{ backgroundColor: "#FFF8F0" }}>
            <h1>당신의 심부전 위험도는 상위 43%입니다</h1>

            <div className="graph-placeholder">
                {/* 여기에 정규분포 그래프 이미지 or 가짜 그래프 넣을게요 */}
                (여기는 나중에 그래프 연결!)
            </div>

            <div className="health-tips">
                <h2>건강 관리 방법</h2>
                <ul>
                    <li>오메가-3 지방산 섭취 늘리기</li>
                    <li>주 5일 이상 가벼운 유산소 운동</li>
                    <li>저염 식단 유지하기</li>
                </ul>
            </div>
        </div>
    );
}

export default AnalysisPage;
