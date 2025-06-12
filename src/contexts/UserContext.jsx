// src/contexts/UserContext.jsx
import { createContext, useState } from "react";

export const UserContext = createContext({
    prsScore: 0,

    userInfo: {
        userId: "",        // ← 추가
        age: "",
        gender: "",
        bloodSugar: "",
        systolic: "",
        firstExamAge: "",
        smoker: false,
    },

    predictionResult: {
        label: null,
        probabilities: [],
    },

    isLoggedIn: false,

    loginUser: (accessToken) => { },
    logoutUser: () => { },
    updatePrsScore: (score) => { },
    updateUserInfo: (info) => { },
    updatePredictionResult: (result) => { },
});

export function UserProvider({ children }) {
    // PRS 점수
    const [prsScore, setPrsScore] = useState(0);

    // userInfo 안에 userId도 관리
    const [userInfo, setUserInfo] = useState({
        userId: "",
        age: "",
        gender: "",
        bloodSugar: "",
        systolic: "",
        firstExamAge: "",
        smoker: false,
    });

    // 예측 결과
    const [predictionResult, setPredictionResult] = useState({
        label: null,
        probabilities: [],
    });

    // 로그인 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 시: 토큰 저장 + 로그인 상태 true
    const loginUser = (accessToken) => {
        setIsLoggedIn(true);
    };

    // 로그아웃 시: 토큰 제거 + 로그인 상태 false + Context 초기화
    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);

        // (선택) 로그아웃되면 userInfo, predictionResult, prsScore도 초기 상태로 되돌림
        setUserInfo({
            userId: "",
            age: "",
            gender: "",
            bloodSugar: "",
            systolic: "",
            firstExamAge: "",
            smoker: false,
        });
        setPredictionResult({ label: null, probabilities: [] });
        setPrsScore(0);
    };

    // PRS 점수 업데이트
    const updatePrsScore = (score) => {
        setPrsScore(score);
    };

    // userInfo 업데이트: { userId, age, gender, … } 형태로 덮어쓰기
    const updateUserInfo = (info) => {
        setUserInfo((prev) => ({
            ...prev,
            ...info,
        }));
    };

    // 예측 결과 업데이트
    const updatePredictionResult = (result) => {
        setPredictionResult(result);
    };

    return (
        <UserContext.Provider
            value={{
                prsScore,
                userInfo,
                predictionResult,
                isLoggedIn,
                loginUser,
                logoutUser,
                updatePrsScore,
                updateUserInfo,
                updatePredictionResult,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}