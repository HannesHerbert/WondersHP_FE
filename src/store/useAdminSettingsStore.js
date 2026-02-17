import { create } from "zustand";

const useAdminSettingsStore = create((set) => ({

  imagePositionVals : [
    { value: 1, class: 'topLeft', label: 'Oben Links' },
    { value: 2, class: 'topRight', label: 'Oben Rechts' },
    { value: 3, class: 'bottomLeft', label: 'Unten Links' },
    { value: 4, class: 'bottomRight', label: 'Unten Rechts' }
  ],

  membersArray: [],

  setMembersArray: ( membersArray ) =>
    set(() => ({
      membersArray: membersArray
    })),


}));

export default useAdminSettingsStore;
