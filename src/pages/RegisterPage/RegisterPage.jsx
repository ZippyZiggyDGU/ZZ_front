// src/pages/RegisterPage/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← 추가
import { signup } from "../../api/auth.js";
import "./RegisterPage.css";

function RegisterPage() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [birth, setBirth] = useState("");
    const [gender, setGender] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // ← 추가

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!gender) {
            alert("성별을 선택해주세요.");
            return;
        }
        if (!name || !birth) {
            alert("이름과 생년월일을 모두 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            await signup({
                userId: userId,
                password: password,
                userName: name,                    // ← 반드시 userName(실제 이름)을 포함
                gender: gender === "남성" ? 0 : 1, // 남=0, 여=1
                birth: birth,                      // ex) "19900101"
            });

            alert("회원가입이 완료되었습니다!");
            navigate("/login"); // ← 회원가입 성공 후 바로 로그인 페이지로 이동

        } catch (err) {
            console.error(err);
            if (err.response?.status === 409) {
                alert("이미 사용 중인 이메일입니다.");
            } else {
                alert("회원가입 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <form onSubmit={handleSubmit}>
                {/* ─────────────────────── 상단 주황 영역 ─────────────────────── */}
                <section className="register-top">
                    <h1 className="register-title">회원가입</h1>
                    <p className="register-subtitle">
                        웹사이트에 가입하고, 심혈관 질환을 간편하게 분석하세요!
                    </p>

                    {/* 이메일 */}
                    <input
                        type="email"
                        placeholder="이메일 주소를 입력하세요."
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />

                    {/* 비밀번호 */}
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* 비밀번호 확인 */}
                    <input
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </section>

                {/* ─────────────────────── 하단 정보 입력 영역 ─────────────────────── */}
                <div className="register-bottom">
                    <div className="info-text">
                        <h2 className="section-title">개인 정보 입력</h2>
                        <p className="section-sub">
                            계정을 생성하기 위해 당신의 개인 정보를 입력하세요
                        </p>
                    </div>

                    <div className="info-form">
                        {/* 이름(userName) */}
                        <label>이름</label>
                        <input
                            type="text"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        {/* 생년월일 */}
                        <label>생년월일</label>
                        <input
                            type="text"
                            placeholder="예) 19900101"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                            required
                        />

                        {/* 성별 선택 */}
                        <label className="gender-label">성별</label>
                        <div className="gender-buttons">
                            <button
                                type="button"
                                className={`gender-btn ${gender === "남성" ? "selected" : ""}`}
                                onClick={() => setGender("남성")}
                            >
                                남성
                            </button>
                            <button
                                type="button"
                                className={`gender-btn ${gender === "여성" ? "selected" : ""}`}
                                onClick={() => setGender("여성")}
                            >
                                여성
                            </button>
                        </div>

                        {/* 회원가입 버튼 */}
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? "가입 중…" : "회원가입"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;