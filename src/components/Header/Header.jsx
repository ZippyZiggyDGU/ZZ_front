import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <header className="header">
            <div className="logo-area">
                <img src="/logo.png" alt="logo" className="logo" />
                <span className="site-name">지피지기</span>
            </div>

            <nav className="nav">
                {isLoggedIn ? (
                    <>
                        <Link to="/">분석하기</Link>
                        <Link to="/magazine">매거진</Link> {/* 매거진 페이지는 아직 만들어야 함! */}
                        <Link to="/mypage">마이페이지</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/register">회원가입</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
