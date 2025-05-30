import "./EditModal.css";

function EditModal({ onClose }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {/* 헤더를 '비밀번호 변경' 으로 바꿨습니다 */}
                <h2>비밀번호 변경</h2>

                <form>
                    <div className="form-group">
                        <label>기존 비밀번호</label>
                        <input
                            type="password"
                            placeholder="기존 비밀번호를 입력하세요"
                        />
                    </div>

                    <div className="form-group">
                        <label>새 비밀번호</label>
                        <input
                            type="password"
                            placeholder="새 비밀번호를 입력하세요"
                        />
                    </div>

                    <div className="form-group">
                        <label>새 비밀번호 확인</label>
                        <input
                            type="password"
                            placeholder="새 비밀번호를 다시 한 번 입력하세요"
                        />
                    </div>

                    <div className="button-group">
                        {/* 닫기 대신 '취소' */}
                        <button type="button" onClick={onClose}>
                            취소
                        </button>
                        {/* 저장 버튼 */}
                        <button type="submit">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
