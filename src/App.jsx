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

// ————————————————————————————————————————————————
// 1) 로컬스토리지에 accessToken이 있으면 바로 헤더에 붙여두기
// ————————————————————————————————————————————————
const savedAccessToken = localStorage.getItem("accessToken");
if (savedAccessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${savedAccessToken}`;
}

// ————————————————————————————————————————————————
// AppContent: 실제 라우터를 렌더링하는 부분
// ————————————————————————————————————————————————
function AppContent() {
  const { isLoggedIn, loginUser, updateUserInfo } = useContext(UserContext);

  // ————————————————————————————————————————————————
  // 2) 자동 로그인 처리: 저장된 토큰이 있으면 Context에 로그인 상태 반영
  //    & /mypage API 호출로 간단히 사용자 정보(userName, gender, age)도 채워두기
  // ————————————————————————————————————————————————
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // ① Axios 인스턴스에도 헤더 보장
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // ② Context에 로그인 상태로 표시
    loginUser(token);

    // ③ (선택) 유저 프로필 API로 추가 정보 가져오기
    api
      .get("/mypage")
      .then((res) => {
        const { userId, userName, gender, age } = res.data;
        updateUserInfo({
          userId,
          userName,
          // 백엔드가 gender=0/1이라면 이렇게 변환
          gender: gender === 0 ? "male" : "female",
          age,
        });
      })
      .catch((err) => {
        console.error("자동 로그인 중 /mypage 호출 오류:", err);
      });
  }, [loginUser, updateUserInfo]);

  // ————————————————————————————————————————————————
  // 3) 디버그: 로그인 상태 3초마다 찍어보기
  // ————————————————————————————————————————————————
  useEffect(() => {
    let id;
    if (isLoggedIn) {
      id = setInterval(() => {
        console.log("[디버그] isLoggedIn:", isLoggedIn);
      }, 3000);
    }
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

// ————————————————————————————————————————————————
// App: 최상위에 UserProvider로 Context를 감싸고 ToastContainer도 함께
// ————————————————————————————————————————————————
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