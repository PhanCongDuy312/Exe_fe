import { create } from "zustand";

const useCVState = create((set) => ({
  cvs: null,
  setCVs: (cvs) => set({ cvs }),
  setCVScores: (items) => {
    set((state) => ({
      cvs: state.cvs.map((cv) => {
        const item = items.find((i) => i.id === cv.id);
        return item ? { ...cv, score: item.score } : cv;
      }),
    }));
  },
  uploadFiles: null,
  setUploadFiles: (uploadFiles) => set({ uploadFiles }),
  setFileProgress: (fileName, progress) => {
    set((state) => ({
      uploadFiles: state.uploadFiles.map((file) =>
        file.name === fileName ? { ...file, progress } : file
      ),
    }));
  },
}));

export default useCVState;
