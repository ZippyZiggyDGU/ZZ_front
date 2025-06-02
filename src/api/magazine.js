// src/api/magazine.js
import api from "./auth.js";  // auth.js 에서 export default api; 로 바꿔두셨다면
export function getMagazines() {
    return api.get("/magazine");
}

// ★ 새로 추가: ID로 매거진 상세 조회
export function getMagazineById(id) {
    return api.get(`/magazine/${id}`);
}