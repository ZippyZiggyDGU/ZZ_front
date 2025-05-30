// src/api/magazine.js
import api from "./auth.js";  // auth.js 에서 export default api; 로 바꿔두셨다면
export function getMagazines() {
    return api.get("/magazine");
}