import { useParams } from "react-router-dom";
import { magazineData } from "../../api/magazineData";
import "./MagazinePage.css";

function MagazinePage() {
    const { id } = useParams();
    const magazine = magazineData.find((item) => item.id === Number(id));

    if (!magazine) {
        return <div>매거진을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="magazine-detail" style={{ backgroundColor: "#FFF8F0" }}>
            <h1>{magazine.title}</h1>
            <h3>{magazine.subtitle}</h3>
            <p>{magazine.content}</p>
        </div>
    );
}

export default MagazinePage;
