import { create } from "zustand";

const useGalleryStore = create((set) => ({
    galleryElements: [],

    setGalleryElements: (elemsArr) =>
        set(() => ({
            galleryElements: elemsArr,
        })),

    currentGalleryElementIndex: 0,

    setCurrGalleryElementIndex: (index) =>
        set(() => ({
            currentGalleryElementIndex: (index !== null),
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

export default useGalleryStore;
