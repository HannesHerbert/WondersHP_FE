import { create } from "zustand";

const useAdminSettingsStore = create((set) => ({

  membersArray: [],

  setMembersArray: ( membersArray ) =>
    set(() => ({
      membersArray: membersArray
    })),

  modalContent: {
    title: null,
    content: null,
  },

  modalIsShown: false,

  // Funktion zum Setzen des Inhalts des Modals
  setModalContent: (title, content) =>
    set(() => ({
      modalContent: { title, content },
    })),

  // Funktion zum Umschalten des Sichtbarkeitsstatus des Modals
  setModalIsShown: () =>
    set((state) => ({
      modalIsShown: !state.modalIsShown,
      modalContent: state.modalIsShown
        ? { title: null, content: null } // Modal wird geschlossen, Inhalt zurücksetzen
        : state.modalContent, // Modal wird geöffnet, Inhalt bleibt unverändert
    })),

}));

export default useAdminSettingsStore;
