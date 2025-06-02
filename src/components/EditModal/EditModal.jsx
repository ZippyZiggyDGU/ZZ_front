// src/components/EditModal/EditModal.jsx
import { useState } from "react";
import { changePassword } from "../../api/auth";
import "./EditModal.css";

function EditModal({ onClose }) {
    // ① 각 input의 값을 useState로 관리
    const [currentPW, setCurrentPW] = useState("");
    const [targetPW, setTargetPW] = useState("");
    const [confirmPW, setConfirmPW] = useState("");

    // ② 에러 메시지 상태 (비밀번호 불일치, 서버 에러 등)
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ③ 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // 1) 간단한 클라이언트쪽 유효성 검사
        if (!currentPW || !targetPW || !confirmPW) {
            setErrorMessage("모든 입력란을 채워주세요.");
            return;
        }
        if (targetPW !== confirmPW) {
            setErrorMessage("새 비밀번호와 확인이 일치하지 않습니다.");
            return;
        }

        // 2) API 호출
        setIsSubmitting(true);
        try {
            const requestBody = {
                currentPW: currentPW.trim(),
                targetPW: targetPW.trim(),
            };
            await changePassword(requestBody);
            // 성공하면 모달 닫기
            onClose();
            alert("비밀번호가 성공적으로 변경되었습니다.");
        } catch (err) {
            // 서버에서 400/401/403 등 에러가 내려올 수 있으므로 상황에 맞게 메시지 표시
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else if (err.response && err.response.status === 403) {
                setErrorMessage("인증이 필요합니다. 다시 로그인해주세요.");
            } else {
                setErrorMessage("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>비밀번호 변경</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>기존 비밀번호</label>
                        <input
                            type="password"
                            value={currentPW}
                            onChange={(e) => setCurrentPW(e.target.value)}
                            placeholder="기존 비밀번호를 입력하세요"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label>새 비밀번호</label>
                        <input
                            type="password"
                            value={targetPW}
                            onChange={(e) => setTargetPW(e.target.value)}
                            placeholder="새 비밀번호를 입력하세요"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label>새 비밀번호 확인</label>
                        <input
                            type="password"
                            value={confirmPW}
                            onChange={(e) => setConfirmPW(e.target.value)}
                            placeholder="새 비밀번호를 다시 한 번 입력하세요"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* ④ 에러 메시지 출력 */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="button-group">
                        <button type="button" onClick={onClose} disabled={isSubmitting}>
                            취소
                        </button>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "변경 중…" : "저장"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;