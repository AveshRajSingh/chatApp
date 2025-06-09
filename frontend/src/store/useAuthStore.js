import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-toastify";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/user/check");
      if (response.status === 200) {
        set({ authUser: response.data.user, isCheckingAuth: false });
      } else {
        set({ authUser: null, isCheckingAuth: false });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  setAuthUser: (user) => set({ authUser: user }),
  login: async (email, password) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      console.log("Login response:", response);
      if (response.status === 200) {
        set({ authUser: response.data.user, isLoggingIn: false });
        toast.success("Login successful");
        set({ isLoggingIn: false });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout : async () => {
    try {
      const response = await axiosInstance.get("/user/logout");
      if (response.status === 200) {
        set({ authUser: null });
        toast.success("Logout successful");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

}));

export default useAuthStore;
