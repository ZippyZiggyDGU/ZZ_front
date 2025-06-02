// src/api/auth.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    withCredentials: true,  // 세션 쿠키 방식을 써도, 혹은 CSRF 토큰 등을 쓸 예정이라면 true
});

// 📌 로그인·회원가입 함수(기존)
export function signup(request) {
    return api.post("/signup", request);
}

export function login(request) {
    return api.post("/login", request);
}

// 📌 Predict API 함수 (예측)
export function predictAtrialFibrillation(request) {
    return api.post("/predict", request);
}

// 📌 Change Password API 함수 (비밀번호 변경)
export function changePassword(request) {
    return api.patch("/change-pw", request);
}

// -----
// ↓ 여기서 default export로 인스턴스를 내보냅니다.
//    앱 어디서든 `import api from "…/auth.js"` 를 쓰면, 
//    지금 설정된 baseURL, withCredentials, headers를 바로 사용합니다.
export default api;