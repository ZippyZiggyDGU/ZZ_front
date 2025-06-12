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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * AppContent 컴포넌트:
 *  - UserProvider 내부이므로 UserContext를 자유롭게 사용할 수 있습니다.
 *  - 앱 마운트 시 로컬/세션 스토리지에 남은 토큰을 읽어서 로그인 상태 복원
 *  - 3초마다 콘솔에 로그인 상태(isLoggedIn)를 출력 (디버그 용)
 *  - Router, Header, Routes를 렌더링
 */
function AppContent() {
  const { loginUser, updateUserInfo, isLoggedIn } = useContext(UserContext);

  // 1) 앱 시작 시: 저장된 토큰이 있으면 axios 헤더와 Context 복원
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // axios 기본 헤더에 토큰 붙이기
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Context 로그인 상태(true)로 변경
      loginUser(token);

      // (선택) /mypage 호출해서 유저 정보(age, gender 등) Context에 업데이트
      // import { getMypage } from "./api/mypage.js";
      // getMypage().then(res => {
      //   const { userName, gender, birth, age } = res.data;
      //   updateUserInfo({
      //     userName,
      //     gender: gender === 0 ? "male" : "female",
      //     age,
      //   });
      // });
    }
  }, [loginUser, updateUserInfo]);

  // 2) 디버그: isLoggedIn 변경 시 콘솔에 찍기
  useEffect(() => {
    if (!isLoggedIn) return;
    const id = setInterval(() => {
      console.log("[디버그] 현재 로그인 여부:", isLoggedIn);
    }, 3000);
    return () => clearInterval(id);
  }, [isLoggedIn]);

  return (
    <Router>
      <Header />
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
 *  - ToastContainer는 Context 밖이어도 무관합니다.
 */
function App() {
  return (
    <>
      <UserProvider>
        <AppContent />
      </UserProvider>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;