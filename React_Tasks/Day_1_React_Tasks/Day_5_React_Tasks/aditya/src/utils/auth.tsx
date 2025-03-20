import { jwtVerify, SignJWT, JWTPayload } from "jose";

const SECRET_KEY = "your-secret-key"; 
const SECRET = new TextEncoder().encode(SECRET_KEY);


export const generateToken = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(SECRET);
};


export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload; 
  } catch (error) {
    return null;
  }
};


export const getUserFromToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return await verifyToken(token);
};
