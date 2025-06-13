import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-toastify";

const useAuthStore = create(
  persist((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isLoading: false,
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
          set({ authUser: response.data.user });
          console.log("User logged in:", response.data.user);
          console.log("from authUser", get().authUser);
          toast.success("Login successful");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.response?.data?.message || "Login failed");
      } finally {
        set({ isLoggingIn: false });
      }
    },

    logout: async () => {
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
    fetchOnlineUsers: async () => {
      set({ isLoading: true });
      try {
        // Check if we have an authenticated user before making the request
        const { authUser } = get();
        if (!authUser) {
          console.log("No authenticated user, skipping fetch");
          set({ onlineUsers: [], isLoading: false });
          return;
        }

        const response = await axiosInstance.get("/user/getUsersForSidebar", {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        if (response.status === 200) {
          set({ onlineUsers: response.data.users });
        } else {
          set({ onlineUsers: [] });
        }
      } catch (error) {
        console.error("Error fetching online users:", error);
        toast.error("Failed to fetch online users");
        // Reset online users in case of error
        set({ onlineUsers: [] });
      } finally {
        set({ isLoading: false });
      }
    },
  })),
  {
    name: "auth-storage", // Unique name for the storage
    getStorage: () => localStorage, // Use localStorage for persistence
    partialize: (state) => ({
      authUser: state.authUser,
    }),
  }
);

export default useAuthStore;
