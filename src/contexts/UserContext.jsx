// src/contexts/UserContext.jsx

import { createContext, useState } from "react";

export const UserContext = createContext({
    // PRS 점수는 컨텍스트 바로 아래 별도 상태로 관리합니다.
    prsScore: 0,

    // userInfo 안에 age, gender, bloodSugar(기존), 
    // 새로 추가된 systolic, firstExamAge, smoker를 포함합니다.
    userInfo: {
        age: "",            // (예: 회원가입/로그인 시 받아온 생년월일 기반)
        gender: "",         // (예: 회원가입 시 선택된 성별)
        bloodSugar: "",     // (예: 입력 폼으로 받거나 프로필에서 설정된 혈당)
        systolic: "",       // MainPage에서 넘겨주는 '수축기 혈압'
        firstExamAge: "",   // MainPage에서 넘겨주는 '첫 검진 나이'
        smoker: false,      // MainPage에서 넘겨주는 '흡연 여부'
    },

    // 로그인 상태 관리용
    isLoggedIn: false,

    // 이하 context에 담길 함수들 (실제로는 provider 안에서 구현)
    loginUser: (accessToken) => { },
    logoutUser: () => { },
    updatePrsScore: (score) => { },
    updateUserInfo: (info) => { },
});

export function UserProvider({ children }) {
    // PRS 점수 전용 state
    const [prsScore, setPrsScore] = useState(0);

    // userInfo 안에 여러 건강 정보를 객체 형태로 관리
    const [userInfo, setUserInfo] = useState({
        age: "",
        gender: "",
        bloodSugar: "",
        systolic: "",
        firstExamAge: "",
        smoker: false,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 시 호출: 토큰 저장 및 로그인 상태 변경
    const loginUser = (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        setIsLoggedIn(true);
    };

    // 로그아웃 시 호출: 로컬스토리지 정리 및 로그인 상태 해제
    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
    };

    // PRS 점수 업데이트
    const updatePrsScore = (score) => {
        setPrsScore(score);
    };

    // 사용자 정보 업데이트: 
    // age, gender, bloodSugar, systolic, firstExamAge, smoker 중 원하는 필드를 덮어씁니다.
    const updateUserInfo = (info) => {
        setUserInfo((prev) => ({
            ...prev,
            ...info,
        }));
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
                updateUserInfo,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}