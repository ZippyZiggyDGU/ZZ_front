// src/api/rank.js
import api from "./auth.js";
// (auth.js에서 axios 인스턴스를 export default로 내보낸다고 가정)

export function getRank() {
    // GET /rank → [{ rank: number, userName: string }, …]
    return api.get("/rank");
}