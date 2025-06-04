import api from "./auth.js";
export function getMypage() {
    return api.get("/mypage");
}
export function getLogs() {
    return api.get("/get-logs");  // GET /get-logs  
}  