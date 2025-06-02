// src/pages/LoginPage/LoginPage.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { login } from "../../api/auth.js";     // ← api 인스턴스도 같이 import
import { UserContext } from "../../contexts/UserContext";
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [autoLogin, setAutoLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }
        setLoading(true);
        try {
            const response = await login({
                userId: email,
                password,
                rememberMe: autoLogin,
            });

            const { accessToken, refreshToken } = response.data;

            // 1) Context 상태 업데이트
            loginUser(accessToken);

            // 2) 로컬 스토리지에 토큰 보관(원한다면)
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // 3) **API 인스턴스의 기본 헤더에 토큰을 붙여주자**
            //    이후 모든 api 호출 시 자동으로 Authorization 헤더가 추가됩니다.
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            alert("로그인 성공!");
            navigate("/");
        } catch (err) {
            console.error(err);
            if (err.response) {
                alert(
                    `로그인 실패: ${err.response.data.message || err.response.statusText}`
                );
            } else {
                alert("로그인 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleLogin}>
                <h1 className="login-title">로그인</h1>

                <label htmlFor="email">이메일</label>
                <input
                    type="email"
                    id="email"
                    placeholder="이메일을 입력하세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">비밀번호</label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="비밀번호를 입력하세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

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

                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? "로그인 중…" : "로그인"}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;