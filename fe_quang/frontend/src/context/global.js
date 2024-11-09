import { create } from "zustand";

const useGlobalState = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  theme: localStorage.getItem("theme") || "light",
  setTheme: (theme) => set({ theme }),
  language: localStorage.getItem("language") || "en",
  setLanguage: (language) => set({ language }),
}));

export default useGlobalState;
