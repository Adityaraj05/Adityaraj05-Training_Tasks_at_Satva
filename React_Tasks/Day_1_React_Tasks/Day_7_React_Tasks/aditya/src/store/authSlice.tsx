import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, putApi, postApi } from "../services/apis";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { notification } from "antd";

const SECRET_KEY = new TextEncoder().encode("528db4829a8fbee606aa241b23ece5b0cec03b6223834e2bdf6cf39d5b0e30d7");

interface User {
  id?: number;
  email: string;
  password: string;
  decryptedPassword?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
};

// Generate JWT Token
const generateToken = async (user: User) => {
  return await new SignJWT({ email: user.email, id: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(SECRET_KEY);
};

// Verify Token
export const verifyToken = createAsyncThunk<void, void>(
  "auth/verifyToken",
  async (_, { getState, dispatch }) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) {
      dispatch(logout(false)); // Pass false to avoid duplicate notification
      return;
    }

    try {
      await jwtVerify(auth.token, SECRET_KEY);
    } catch (error) {
      dispatch(logout(false)); // Pass false to avoid duplicate notification
    }
  }
);

// Login User
export const login = createAsyncThunk<User, { email: string; password: string }>(
  "auth/login",
  async ({ email, password }) => {
    const response = await getApi("/users");

    const user = response.data.find((u: User) => u.email === email);

    if (!user) {
      notification.error({ message: "Invalid credentials", description: "Email not found!" });
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      notification.error({ message: "Invalid credentials", description: "Incorrect password!" });
      throw new Error("Invalid credentials");
    }

    const token = await generateToken(user);
    const userWithDecryptedPassword = {
      ...user,
      decryptedPassword: password // Store the plain text password for UI display
    };
    
    // Remove decryptedPassword before saving to local storage
    const { decryptedPassword, ...userWithoutDecryptedPassword } = userWithDecryptedPassword;
    localStorage.setItem("user", JSON.stringify(userWithoutDecryptedPassword));
    localStorage.setItem("token", token);

    return { ...userWithDecryptedPassword, token };
  }
);

// Sign Up User
export const signUp = createAsyncThunk<User, { email: string; password: string }>(
  "auth/signUp",
  async (userData) => {
    const response = await getApi("/users");
    const existingUser = response.data.find((u: User) => u.email === userData.email);

    if (existingUser) {
      notification.error({
        message: "Registration Failed",
        description: "Email already exists. Please use a different email.",
      });
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUserResponse = await postApi("/users", { ...userData, password: hashedPassword });
    const user = newUserResponse.data;
    const token = await generateToken(user);

    const userWithDecryptedPassword = {
      ...user,
      decryptedPassword: userData.password // Store the plain text password for UI display
    };

    // Remove decryptedPassword before saving to local storage
    const { decryptedPassword, ...userWithoutDecryptedPassword } = userWithDecryptedPassword;
    localStorage.setItem("user", JSON.stringify(userWithoutDecryptedPassword));
    localStorage.setItem("token", token);

    notification.success({
      message: "Registration Successful",
      description: "You have successfully signed up!",
    });

    return { ...userWithDecryptedPassword, token };
  }
);

// Fetch User Data
export const fetchUser = createAsyncThunk<User, void>(
  "auth/fetchUser",
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) throw new Error("No token found");

    try {
      await jwtVerify(auth.token, SECRET_KEY);
      const response = await getApi(`/users/${auth.user?.id}`);
      
      // Keep the decrypted password from the existing user state
      const userWithDecryptedPassword = {
        ...response.data,
        decryptedPassword: auth.user?.decryptedPassword
      };
      
      return userWithDecryptedPassword;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk<User, User>(
  "auth/updateProfile",
  async (userData, { getState }) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) throw new Error("No token found");

    // If the password has been updated, hash the new password
    let updatedUserData = { ...userData };
    
    if (userData.decryptedPassword && userData.decryptedPassword !== auth.user?.decryptedPassword) {
      const hashedPassword = await bcrypt.hash(userData.decryptedPassword, 10);
      updatedUserData = {
        ...updatedUserData,
        password: hashedPassword
      };
    }

    // Remove decryptedPassword before sending to server
    const { decryptedPassword, ...dataForServer } = updatedUserData;
    
    const response = await putApi(`/users/${userData.id}`, dataForServer);
    
    // Reattach the decrypted password for the UI
    const updatedUser = {
      ...response.data,
      decryptedPassword: userData.decryptedPassword
    };

    // Remove decryptedPassword before saving to local storage
    const { decryptedPassword: _, ...userWithoutDecryptedPassword } = updatedUser;
    localStorage.setItem("user", JSON.stringify(userWithoutDecryptedPassword));
    
    return updatedUser;
  }
);

// Update Password
export const updatePassword = createAsyncThunk<User, { currentPassword: string; newPassword: string }>(
  "auth/updatePassword",
  async ({ currentPassword, newPassword }, { getState }) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token || !auth.user) throw new Error("Not authenticated");

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, auth.user.password);
    if (!isMatch) {
      notification.error({ 
        message: "Password Update Failed", 
        description: "Current password is incorrect!" 
      });
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user data with new password
    const updatedUserData = {
      ...auth.user,
      password: hashedPassword
    };

    // Remove decryptedPassword before sending to server
    const { decryptedPassword, ...dataForServer } = updatedUserData;
    
    const response = await putApi(`/users/${auth.user.id}`, dataForServer);
    
    // Update user with new decrypted password
    const updatedUser = {
      ...response.data,
      decryptedPassword: newPassword
    };
    
    // Remove decryptedPassword before saving to local storage
    const { decryptedPassword: _, ...userWithoutDecryptedPassword } = updatedUser;
    localStorage.setItem("user", JSON.stringify(userWithoutDecryptedPassword));
    
    notification.success({
      message: "Password Updated",
      description: "Your password has been successfully updated."
    });
    
    return updatedUser;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (action.payload !== false) {
        notification.success({
          message: "Logged Out",
          description: "You have successfully logged out.",
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(verifyToken.rejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;