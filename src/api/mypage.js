// src/api/mypage.js
import api from "./auth.js";

// GET /mypage → MypageResponse { userName, gender, birth, age }
export function getMypage() {
    return api.get("/mypage");
}