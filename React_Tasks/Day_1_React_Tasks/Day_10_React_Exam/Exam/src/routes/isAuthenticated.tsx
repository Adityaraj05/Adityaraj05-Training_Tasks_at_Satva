import {jwtDecode} from "jwt-decode";

interface TokenPayload {
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at
  userId: string;
}

export const getToken = (): string | null => {
  return localStorage.getItem("BearerToken");
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: TokenPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime; 
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("BearerToken");
  window.location.href = "/";
};
