import apiService from "./apiService";

export const loginUser = (data) => {
    apiService.post("/api/Authenticate/Login");
}