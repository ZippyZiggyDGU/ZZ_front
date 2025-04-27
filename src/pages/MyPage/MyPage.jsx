import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { recordData } from "../../api/recordData"; // 👈 추가
import "./MyPage.css";
import EditModal from "../../components/EditModal/EditModal";

function MyPage() {
    const { userInfo } = useContext(UserContext);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const handleEditClick = () => {
        setIsEditOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditOpen(false);
    };

    const handleSearch = () => {
        if (!startDate || !endDate) return;
        const filtered = recordData.filter(record =>
            record.date >= startDate && record.date <= endDate
        );
        setFilteredData(filtered);
    };

    return (
        <div className="mypage" style={{ backgroundColor: "#FFF8F0" }}>
            <div className="mypage-header">
                <h1>{userInfo.name || "사용자"} 님</h1>
                <p>항상 건강한 하루 되세요.</p>
            </div>

            <div className="record-section">
                <h2>심혈관 질환 위험도 기록</h2>
                <div className="search-form">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <span>~</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    <button onClick={handleSearch}>조회</button>
                </div>

                <div className="record-list">
                    {filteredData.length > 0 ? (
                        filteredData.map((record, idx) => (
                            <div className="record-item" key={idx}>
                                {record.date} - {record.score}점
                            </div>
                        ))
                    ) : (
                        <div className="no-data">조회된 기록이 없습니다.</div>
                    )}
                </div>
            </div>

            <div className="edit-profile-section">
                <button className="edit-button" onClick={handleEditClick}>프로필 수정</button>
            </div>

            {isEditOpen && <EditModal onClose={handleCloseModal} />}
        </div>
    );
}

export default MyPage;
