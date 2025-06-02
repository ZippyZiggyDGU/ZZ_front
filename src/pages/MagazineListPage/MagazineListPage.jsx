import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMagazines } from "../../api/magazine.js";
import "./MagazineListPage.css";

function MagazineListPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getMagazines()
            .then(res => {
                setItems(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("매거진을 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>로딩 중…</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="magazine-list" style={{ backgroundColor: "#FFF8F0" }}>
            <h1>건강 매거진</h1>
            <div className="magazine-cards">
                {items.map(item => (
                    <Link to={`/magazine/${item.id}`} key={item.id} className="magazine-card">
                        <div className="magazine-text">
                            <h2>{item.title}</h2>
                            {/* 내용 1줄만 보여주기 */}
                            <p>{item.content.split("\n")[0]}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MagazineListPage;
