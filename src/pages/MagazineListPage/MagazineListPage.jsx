import { magazineData } from "../../api/magazineData";
import { Link } from "react-router-dom";
import "./MagazineListPage.css";

function MagazineListPage() {
    return (
        <div className="magazine-list" style={{ backgroundColor: "#FFF8F0" }}>
            <h1>건강 매거진</h1>
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
    );
}

export default MagazineListPage;
