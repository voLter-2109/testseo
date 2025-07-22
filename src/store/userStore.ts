import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DoctorInfo } from '../types/doctor/doctor';
import { IUserProfile } from '../types/user/user';

interface IUserProfileStore {
  user: IUserProfile | null;
  globalSideBar: boolean;
  toggleGlobalSideBar: () => void;
  chatSideBar: boolean;
  toggleChatSideBar: () => void;

  setUser: (user: IUserProfile) => void;
  clearUser: () => void;

  doctor: DoctorInfo | null;
  setDoctor: (doctor: DoctorInfo) => void;
  clearDoctor: () => void;

  resetUserStore: () => void;
}

const initialUserStore = {
  user: null,
  doctor: null,
  chatSideBar: false,
  globalSideBar: false,
};

/**
 * @name userStore
 * @function setUser (user:IUserProfile) записывает новый профиль юзера
 * @example const user = useUserStore(state=> state.user);
 * @function clearUser сбрасывает state
 * @param 'const { setUser, user } = useUserStore();
 * @example const clearUser = useUserStore(state=> state.clearUser);
 *
 * @example const {clearUser, setUser, user} = useUserStore(state=> state);
 */
const useUserStore = create<IUserProfileStore>()(
  persist(
    devtools(
      immer((set) => ({
        ...initialUserStore,
        toggleGlobalSideBar: () =>
          set(
            (state) => ({ globalSideBar: !state.globalSideBar }),
            false,
            'toggle global side bar'
          ),
        toggleChatSideBar: () =>
          set(
            (state) => ({ chatSideBar: !state.chatSideBar }),
            false,
            'toggle chat side bar'
          ),
        resetUserStore: () =>
          set(
            () => {
              return initialUserStore;
            },
            false,
            'reset user store'
          ),
        // ___________________________________
        setUser: (user) =>
          set(
            (state) => {
              state.user = user;
            },
            false,
            'setUseUserStore'
          ),
        clearUser: () =>
          set(
            (state) => {
              state.user = null;
            },
            false,
            'clearUserStore'
          ),
        // __________________________________________________

        setDoctor: (doctor) =>
          set(
            (state) => {
              state.doctor = doctor;
            },
            false,
            'setUseDoctorStore'
          ),
        clearDoctor: () =>
          set(
            (state) => {
              state.doctor = null;
            },
            false,
            'clearDoctorStore'
          ),
      }))
    ),

    { name: 'userProfile', storage: createJSONStorage(() => localStorage) }
  )
);

export default useUserStore;
