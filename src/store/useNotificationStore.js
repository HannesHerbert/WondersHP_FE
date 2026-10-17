import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notification: null,
  showNotification: (message, type = 'success', duration = 3000) => {
    set({ notification: { message, type } });
    setTimeout(() => {
      set({ notification: null });
    }, duration);
  },
  hideNotification: () => set({ notification: null }),
}));

export default useNotificationStore;
