import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import './styles/App.css';


import Header from "./components/Header/Header";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MainPage from "./pages/MainPage/MainPage";
import MyPage from "./pages/MyPage/MyPage";
import AnalysisPage from "./pages/AnalysisPage/AnalysisPage";
import MagazineListPage from "./pages/MagazineListPage/MagazineListPage";
import MagazinePage from "./pages/MagazinePage/MagazinePage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header /> {/* 👈 헤더를 모든 페이지에 공통으로 표시 */}
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
    </UserProvider>
  );
}

export default App;
