import { create } from "zustand";

const useModalStore = create((set) => ({
  
  modalContent: {
    title: null,
    content: null,
  },

  modalIsShown: false,

  // Funktion zum Setzen des Inhalts des Modals
  setModalContent: (title, content) => set((state) => ({
    modalContent: {
      title: title,
      content: content,
    }
  })),

  // Funktion zum Umschalten des Sichtbarkeitsstatus des Modals
  setModalIsShown: () => set((state) => ({
    modalIsShown: !state.modalIsShown,
  }))
}));

export default useModalStore;
