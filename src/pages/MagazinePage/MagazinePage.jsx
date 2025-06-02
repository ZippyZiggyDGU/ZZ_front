// src/pages/MagazinePage.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMagazineById } from "../../api/magazine.js";  // 위에서 만든 함수
import "./MagazinePage.css";

function MagazinePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1) 로딩 / 에러 / 데이터 상태 관리
    const [magazine, setMagazine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getMagazineById(id)
            .then((res) => {
                setMagazine(res.data);
            })
            .catch((err) => {
                console.error(err);
                setError("매거진을 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    // 2) 로딩/에러 상태별 UI
    if (loading) {
        return (
            <div className="magazine-page">
                <p className="loading">로딩 중…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="magazine-page">
                <p className="error">{error}</p>
                <button
                    className="back-button"
                    onClick={() => navigate("/magazine")}
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    if (!magazine) {
        return (
            <div className="magazine-page">
                <p>존재하지 않는 매거진입니다.</p>
                <button
                    className="back-button"
                    onClick={() => navigate("/magazine")}
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    // 3) 정상적으로 데이터를 가져왔을 때 렌더링
    return (
        <div className="magazine-page">
            <div className="magazine-header">
                <div className="header-text">
                    <h1>{magazine.title}</h1>
                    {/* subtitle이 있다면 보여줍니다. */}
                    {magazine.subtitle && <h3>{magazine.subtitle}</h3>}
                </div>
                <div className="magazine-image" />
            </div>

            <div className="magazine-body">
                {/* 서버가 내려준 content를 그대로 출력 */}
                <div className="magazine-content">{magazine.content}</div>
                <button
                    className="back-button"
                    onClick={() => navigate("/magazine")}
                >
                    목록
                </button>
            </div>
        </div>
    );
}

export default MagazinePage;