import "./EditModal.css";

function EditModal({ onClose }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>프로필 수정</h2>

                <form>
                    <div className="form-group">
                        <label>비밀번호 변경</label>
                        <input type="password" placeholder="새 비밀번호 입력" />
                    </div>

                    <div className="form-group">
                        <label>이름 변경</label>
                        <input type="text" placeholder="새 이름 입력" />
                    </div>

                    <div className="form-group">
                        <label>생년월일 변경</label>
                        <input type="date" />
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={onClose}>닫기</button>
                        <button type="submit">수정 완료</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
