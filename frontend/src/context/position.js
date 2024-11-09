import { create } from "zustand";

const usePositionsState = create((set) => ({
  positions: null,
  setPositions: (positions) => set({ positions }),
  position: null,
  setPosition: (position) => set({ position }),
}));

export default usePositionsState;
