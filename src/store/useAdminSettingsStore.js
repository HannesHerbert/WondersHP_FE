import { create } from "zustand";

const useAdminSettingsStore = create((set) => ({

  membersArray: [],

  setMembersArray: ( membersArray ) =>
    set(() => ({
      membersArray: membersArray
    })),


}));

export default useAdminSettingsStore;
