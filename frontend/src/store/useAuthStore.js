import { create } from "zustand";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checAuth : async() =>{
    set({ isCheckingAuth: true });
    try {
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        const data = await response.json();
        set({ authUser: data.user, isCheckingAuth: false });
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
}));
