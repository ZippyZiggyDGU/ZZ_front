import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [autoLogin, setAutoLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate("/");
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
                />

                <label htmlFor="password">비밀번호</label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="비밀번호를 입력하세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
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

                <button type="submit" className="login-btn">
                    로그인
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
