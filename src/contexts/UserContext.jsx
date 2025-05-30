// src/contexts/UserContext.jsx
import { createContext, useState } from "react";

export const UserContext = createContext({
    prsScore: 0,
    userInfo: {
        age: "",
        gender: "",
        smoker: false,
        bloodSugar: ""
    },
    isLoggedIn: false,
    loginUser: (accessToken) => { },
    logoutUser: () => { },
    updatePrsScore: (score) => { },
    updateUserInfo: (info) => { }
});

export function UserProvider({ children }) {
    const [prsScore, setPrsScore] = useState(0);
    const [userInfo, setUserInfo] = useState({
        age: "",
        gender: "",
        smoker: false,
        bloodSugar: ""
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 시 호출
    const loginUser = (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        setIsLoggedIn(true);
    };

    // 로그아웃 시 호출
    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
    };

    // PRS 점수 업데이트
    const updatePrsScore = (score) => {
        setPrsScore(score);
    };

    // 사용자 정보 업데이트
    const updateUserInfo = (info) => {
        setUserInfo((prev) => ({ ...prev, ...info }));
    };

    return (
        <UserContext.Provider
            value={{
                prsScore,
                userInfo,
                isLoggedIn,
                loginUser,
                logoutUser,
                updatePrsScore,
                updateUserInfo
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
