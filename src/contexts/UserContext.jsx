import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [prsScore, setPrsScore] = useState(0);
    const [userInfo, setUserInfo] = useState({
        age: "",
        gender: "",
        smoker: false,
        bloodSugar: "",
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 👈 추가!

    const updateUserInfo = (info) => {
        setUserInfo((prev) => ({ ...prev, ...info }));
    };

    const updatePrsScore = (score) => {
        setPrsScore(score);
    };

    return (
        <UserContext.Provider value={{ prsScore, userInfo, updateUserInfo, updatePrsScore, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
}
