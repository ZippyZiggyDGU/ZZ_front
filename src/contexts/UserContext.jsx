// src/contexts/UserContext.jsx
import { createContext, useState } from "react";

export const UserContext = createContext({
    prsScore: 0,

    // 기존 userInfo에 추가 필드가 있습니다.
    userInfo: {
        age: "",          // ex) 로그인 시 받아온 사용자 생년월일(또는 나이)
        gender: "",       // ex) "male" 또는 "female"
        bloodSugar: "",   // ex) 프로필에서 설정된 혈당
        systolic: "",     // ex) MainPage에서 입력받은 수축기 혈압
        firstExamAge: "", // ex) MainPage에서 입력받은 첫 검진 나이
        smoker: false,    // ex) MainPage에서 입력받은 흡연 여부
    },

    // “예측 결과”를 저장할 객체를 추가합니다.
    // label: 예측된 클래스(정수), probabilities: [p0, p1, ...] 형태
    predictionResult: {
        label: null,        // int
        probabilities: [],  // List<Double>
    },

    isLoggedIn: false,

    loginUser: (accessToken) => { },
    logoutUser: () => { },
    updatePrsScore: (score) => { },
    updateUserInfo: (info) => { },
    updatePredictionResult: (result) => { },
});

export function UserProvider({ children }) {
    const [prsScore, setPrsScore] = useState(0);

    const [userInfo, setUserInfo] = useState({
        age: "",
        gender: "",
        bloodSugar: "",
        systolic: "",
        firstExamAge: "",
        smoker: false,
    });

    // 예측 결과를 담을 state
    const [predictionResult, setPredictionResult] = useState({
        label: null,
        probabilities: [],
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 시 실행: 토큰 저장 + 로그인 상태 변경
    const loginUser = (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        setIsLoggedIn(true);
    };

    // 로그아웃 시 실행: 토큰 삭제 + 로그인 상태 해제
    const logoutUser = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
    };

    // PRS 점수 업데이트
    const updatePrsScore = (score) => {
        setPrsScore(score);
    };

    // 사용자 정보 업데이트: { age, gender, bloodSugar, systolic, firstExamAge, smoker } 중 필요한 필드만 덮어씀
    const updateUserInfo = (info) => {
        setUserInfo((prev) => ({
            ...prev,
            ...info,
        }));
    };

    // 예측 결과 업데이트: { label, probabilities } 형태로 덮어씀
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