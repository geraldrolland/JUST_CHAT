
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


type stateType = {
    bears: number;
    isPasswordChanged: boolean,
    changePasswordChangeStatus: (status: boolean) => void,
    increasePopulation: () => void;
    removeAllBears: () => void;
    updateBears: (newBears: number) => void;
  }
  
  const useStore = create<stateType>()(immer((set) => ({
    bears: 0,

    isPasswordChanged: false,

    changePasswordChangeStatus: (status: boolean) => set((state: stateType) => {
      state.isPasswordChanged = status
    }),
  
    increasePopulation: () =>
      set((state: stateType) => {
        state.bears += 1;
      }),
  
    removeAllBears: () => set((state: stateType) => {
      state.bears = 0;
    }),
  
    updateBears: (newBears: number) =>
      set((state: stateType) => {
        state.bears = newBears;
      }),
  })));
  
  export default useStore;