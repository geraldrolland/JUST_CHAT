
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


type stateType = {
    messageWebsocket: null | WebSocket,
    isPasswordChanged: boolean,
    setMessageWebsocket: (socket: WebSocket) => void,
    changePasswordChangeStatus: (status: boolean) => void,

  }
  
  const useStore = create<stateType>()(immer((set) => ({
    messageWebsocket: null,
    isPasswordChanged: false,

    setMessageWebsocket: (socket: WebSocket) =>  set((state: stateType) => {
      state.messageWebsocket = socket
    }),

    changePasswordChangeStatus: (status: boolean) => set((state: stateType) => {
      state.isPasswordChanged = status
    }),
  

  })));
  
  export default useStore;