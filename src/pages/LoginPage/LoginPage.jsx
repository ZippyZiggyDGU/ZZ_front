// src/pages/LoginPage/LoginPage.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { login } from "../../api/auth.js"; // Axios 인스턴스와 login 함수
import { UserContext } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import "./LoginPage.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [autoLogin, setAutoLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { loginUser, updateUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return toast.error("이메일과 비밀번호를 모두 입력해주세요.");
        }

        setLoading(true);
        try {
            // ① 로그인 API 호출
            const response = await login({
                userId: email,
                password,
                rememberMe: autoLogin,
            });

            const { accessToken, refreshToken } = response.data;

            // ② Context에 로그인 상태 및 userId 저장
            loginUser(accessToken);          // isLoggedIn = true
            updateUserInfo({ userId: email }); // userInfo.userId = email

            // ③ 토큰을 로컬스토리지에 저장
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // ④ Axios 인스턴스 기본 헤더에 토큰 자동 추가
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            toast.success("로그인 성공!");
            navigate("/");
        } catch (err) {
            console.error("로그인 오류", err);
            if (err.response?.data?.message) {
                toast.error(`로그인 실패: ${err.response.data.message}`);
            } else {
                toast.error("로그인 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleLogin}>
                <h1 className="login-title">로그인</h1>

                {/* 이메일 입력 */}
                <label htmlFor="email">이메일</label>
                <input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* 비밀번호 입력 + 보이기 토글 */}
                <label htmlFor="password">비밀번호</label>
                <div className="password-wrapper">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력하세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                {/* 자동 로그인 체크박스 + 회원가입 링크 */}
                <div className="login-options">
                    <label className="checkbox-wrap">
                        <input
                            type="checkbox"
                            checked={autoLogin}
                            onChange={(e) => setAutoLogin(e.target.checked)}
                        />
                        자동 로그인
                    </label>
                    <Link to="/register" className="register-link">
                        지피지기가 처음이세요?
                    </Link>
                </div>

                {/* 로그인 버튼 */}
                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? "로그인 중…" : "로그인"}
                </button>
            </form>
        </div>
    );
}