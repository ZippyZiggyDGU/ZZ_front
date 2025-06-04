// src/api/recommend.js
import api from "./auth";
// ※ auth.js에서 `export default api;` 로 axios 인스턴스를 내보냈다고 가정합니다. 
//    기본 URL(baseURL)과 withCredentials 설정 등이 이미 되어있습니다.

export function getRecommend(userId) {
    // GET /api/recommend/{userId}
    return api.get(`/api/recommend/${userId}`);
}