import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("my_secret_key");

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log(payload);
    return payload;
  } catch (error) {
    return null;
  }
};