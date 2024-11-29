import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type messageType = {
  text: string,
  message_id: string,
  created_at: string,
  audio: string | null,
  image: string | null,
  video: string | null,
  file: string | null,
  sender?: string | number,
  receipient?: string | number,
  is_receipient_online: boolean,

}

type friendProfileType = {
  friend_id: string | undefined,
  username: string | undefined,
  profile_image: string | undefined,
  is_online: boolean,
  last_date_online: string | null,
  messages: messageType[] | null, 
}

type stateType = {
    currentPath: string | null,
    messageWebsocket: null | WebSocket,
    isPasswordChanged: boolean,
    friendProfile: friendProfileType | null,
    scrollToLastMsg: (() => void) | null,
    setFriendProfile: (profile: friendProfileType) => void,
    setScrollToLastMsg: (func: () => void) => void,
    setMessageWebsocket: (socket: WebSocket) => void,
    changePasswordChangeStatus: (status: boolean) => void,

  }
  
  const useStore = create<stateType>()(immer((set) => ({
    currentPath: null,
    messageWebsocket: null,
    isPasswordChanged: false,
    scrollToLastMsg: null as (() => void) | null,
    friendProfile: null as friendProfileType | null,
    setScrollToLastMsg: (func) => set((state: stateType) => {state.scrollToLastMsg = func}),
    setFriendProfile: (profile: friendProfileType) => set((state: stateType) => {state.friendProfile = profile}),

    setMessageWebsocket: (socket: WebSocket) =>  set((state: stateType) => {
      state.messageWebsocket = socket
    }),

    changePasswordChangeStatus: (status: boolean) => set((state: stateType) => {
      state.isPasswordChanged = status
    }),
  

  })));
  
  export default useStore;