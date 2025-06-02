// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserProvider, UserContext } from "./contexts/UserContext";
import "./styles/App.css";
import api from "./api/auth.js";

import Header from "./components/Header/Header";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MainPage from "./pages/MainPage/MainPage";
import MyPage from "./pages/MyPage/MyPage";
import AnalysisPage from "./pages/AnalysisPage/AnalysisPage";
import MagazineListPage from "./pages/MagazineListPage/MagazineListPage";
import MagazinePage from "./pages/MagazinePage/MagazinePage";

const savedAccessToken = localStorage.getItem("accessToken");
if (savedAccessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${savedAccessToken}`;
}
/**
 * AppContent 컴포넌트:
 *  - UserProvider 내부이므로, UserContext를 자유롭게 사용할 수 있습니다.
 *  - 3초마다 콘솔에 로그인 상태(isLoggedIn)를 출력합니다.
 *  - Router, Header, Routes를 여기서 렌더링합니다.
 */
function AppContent() {
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    let intervalId = null;

    if (isLoggedIn) {
      intervalId = setInterval(() => {
        console.log("[디버그] 현재 로그인 여부:", isLoggedIn);
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoggedIn]);

  return (
    <Router>
      <Header /> {/* 모든 페이지에 공통으로 표시되는 헤더 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/magazine" element={<MagazineListPage />} />
        <Route path="/magazine/:id" element={<MagazinePage />} />
      </Routes>
    </Router>
  );
}

/**
 * App 컴포넌트:
 *  - 최상위에 UserProvider를 두어 Context를 전체 앱에 공급합니다.
 *  - 실제 라우터 부분은 AppContent에서 렌더링합니다.
 */
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;