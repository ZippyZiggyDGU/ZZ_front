import { useParams, useNavigate } from "react-router-dom";
import { magazineData } from "../../api/magazineData";
import "./MagazinePage.css";

function MagazinePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const magazine = magazineData.find((item) => item.id === Number(id));

    if (!magazine) return <div>매거진을 찾을 수 없습니다.</div>;

    return (
        <div className="magazine-page">
            <div className="magazine-header">
                <div className="header-text">
                    <h1>{magazine.title}</h1>
                    <h3>{magazine.subtitle}</h3>
                </div>
                <div className="magazine-image" />
            </div>

            <div className="magazine-body">
                <div className="magazine-content">{magazine.content}</div>
                <button className="back-button" onClick={() => navigate("/magazine")}>
                    목록
                </button>
            </div>
        </div>
    );
}

export default MagazinePage;