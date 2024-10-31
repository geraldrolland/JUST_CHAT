import { TiMicrophone } from "react-icons/ti";
import { IoSendSharp } from "react-icons/io5";
import React, {useEffect, useRef} from "react"
import "../style.css"
import { CiFaceSmile } from "react-icons/ci";
import { CiCamera } from "react-icons/ci";
import { GiPaperClip } from "react-icons/gi";
import useStore from "./customhooks/UseStore";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
type propType ={
  boxRef: HTMLDivElement,

}

type  userStatusType = {
  id: string | number,
  username: string,
  email: string,
  profile_image: string | null,
  access: string,
  refresh: string,
}

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

const fetchFunc = async (url: string, data: messageType,  navigateToLogin: any) => {
  console.log("errror in userequest")
  try {
      const userStatus: userStatusType = JSON.parse(sessionStorage.getItem("userProfile")!);
      let config = {
          headers: { Authorization: "Bearer " + userStatus.access },
      };
      const response = await axios.post(url, data,  config);
      if (response.status === 200 || response.status === 201) {
          console.log("url", url)
          return response.data;
      }
  } catch (error: any) {
      if (error.response && error.response.status === 401) {
          const userStatus: userStatusType = JSON.parse(sessionStorage.getItem("userProfile")!);
          if (userStatus && userStatus.refresh) {
              try {
                  const refreshResponse = await axios.post("http://127.0.0.1:8000/token-refresh/", { refresh: userStatus.refresh });
                  if (refreshResponse.status === 200) {
                      userStatus.access = refreshResponse.data.access;
                      sessionStorage.setItem("userProfile", JSON.stringify(userStatus));
                      const config = {
                          headers: { Authorization: "Bearer " + userStatus.access },
                      };
                      const retryResponse = await axios.post(url, data, config);
                      if (retryResponse.status === 200) {
                          return retryResponse.data;
                      } else {
                          throw new Error ("failed to refresh token")
                      }
                  }
              } catch {
                  navigateToLogin("/log-in/");
                  throw new Error("Failed to refresh token.");
              }
          }
      } else {
          throw new Error("Request failed.");
      }
  }
};

const TextInput = ({boxRef}: propType) => {

  const [message, setMessage] = useState<messageType>({
    text: "",
    message_id: "",
    created_at: "",
    audio: null,
    image: null,
    video: null,
    file: null,
    sender: 0,
    receipient: 0,
    is_receipient_online: false,
  })

  const sendRef = useRef<HTMLButtonElement>(null!)
  const micRef = useRef<HTMLButtonElement>(null!)
  const smileCamRef = useRef<HTMLDivElement>(null!)
  const friendProfile = useStore(state => state.friendProfile)
  const scrollToLastMsg = useStore(state => state.scrollToLastMsg!)
  const navigateToLogin = useNavigate()

  const sendMessage = useMutation({
    mutationFn: () => fetchFunc(`http://127.0.0.1:8000/api/users/${friendProfile?.friend_id}/send_message_to_friend/`, message, navigateToLogin),
    onMutate: () => {
      setMessage({...message, created_at: new Date().toLocaleString(), message_id: crypto.randomUUID()});
      const msg = Object.assign({}, message);
      msg.created_at = "sending ...";
      console.log("this is the push message ", msg)
      console.log("this is the sent message", message)
      const messages = [...friendProfile?.messages!, msg]
      useStore.setState({friendProfile: {friend_id: friendProfile?.friend_id, username: friendProfile?.username, profile_image: friendProfile?.profile_image, is_online: friendProfile?.is_online!, last_date_online: friendProfile?.last_date_online!, messages: messages}})
      console.log("message", msg)
      scrollToLastMsg();
    },

    onSuccess: (data) => {
      console.log("it returned", data)
      friendProfile?.messages?.forEach((msg) => {
        console.log("it is iterating")
        console.log(msg)
        if (msg.message_id === data.message_id) {
          console.log("this is the returned mesage ", data)
          msg.created_at = data.created_at;
          msg.is_receipient_online = data.is_receipient_online;
          return;
        }

      })
    },

    onError: (error) => {
      console.log("error", error)
    }
  })
  const expandInputHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.offsetHeight)
    e.target.style.height = "auto"
    if (e.target.scrollHeight > 120 || e.target.scrollHeight === 120) {
      boxRef.style.height = "120px"
      e.target.style.height = "120px"
    }

    if (e.target.scrollHeight > 45 && e.target.scrollHeight < 120) {
      console.log("scroll height", e.target.scrollHeight )
      boxRef.style.height = `${e.target.scrollHeight}px`
      e.target.style.height = `${e.target.scrollHeight}px`
    }

    if (e.target.value.trim() !== "") {
      micRef.current.classList.remove("flex")
      micRef.current.classList.add("hidden")
      sendRef.current.classList.remove("hidden")
      sendRef.current.classList.add("flex")
      smileCamRef.current.classList.add("translate-x-[35px]")
      smileCamRef.current.classList.remove("translate-x-[0]")
    } else {
      micRef.current.classList.add("flex")
      micRef.current.classList.remove("hidden")
      sendRef.current.classList.add("hidden")
      sendRef.current.classList.remove("flex")
      smileCamRef.current.classList.remove("translate-x-[35px]")
      smileCamRef.current.classList.add("translate-x-[0]")
    }
    setMessage({...message, text: e.target.value})

  }

  const sendmsg = () => {
    console.log("this is it")
    sendMessage.mutate()
  }

  useEffect(() => {
    const userProfile: userStatusType = JSON.parse(sessionStorage.getItem("userProfile")!)
    setMessage({...message, sender: userProfile.id, receipient: friendProfile?.friend_id})
  }, [])


  return (
    <div className="ld:w-[100%] w-[100%] md:w-[90%] md:left-[5%] ld:left-0  flex bottom-0  bg-[#ffff] lg:rounded-b-[15px]  absolute    items-center   z-10">
      <div className="lg:w-[85%] w-[80%] md:w-[85%] lg:ml-[15px] relative  ml-[10px] flex rounded-md py-1 overflow-hidden">
        <div className="absolute left-0 bottom-[14px] w-[30px] h-[30px] pt-1  justify-end pl-1 items-center">
          <GiPaperClip className="text-gray-700 text-[25px]" />
        </div>
        <textarea onChange={(e) => expandInputHeight(e)} className="w-[100%] tab-container text-gray-700 rounded-md resize-none pr-8 focus:outline-none bg-blue-100  pl-10  " cols={1} name="" id="" placeholder="enter message"></textarea>
        <div ref={smileCamRef} className="absolute right-0 bottom-[14px] w-[70px] h-[30px] flex transform transition-all duration-300 justify-center items-center">
          <div className="w-[50%] h-[100%] flex justify-center items-center">
            <CiFaceSmile className="text-gray-700 text-[25px]" />
          </div>
          <div className="w-[50%] h-[100%] flex justify-center items-center">
            <CiCamera className="text-gray-700       text-[25px]" />
          </div>
        </div>
      </div>
      <button onClick={sendmsg} ref={sendRef} className="absolute hidden lg:right-[15px] right-[10px] rounded-md w-[45px]  justify-center items-center bottom-[5px] h-[45px] transform transition-all duration-500 active:scale-95 bg-purple-700">
        <IoSendSharp className="text-gray-50 text-[25px]" />
      </button>
      <button ref={micRef} className="absolute flex right-[10px] rounded-md lg:right-[15px] w-[45px]  justify-center items-center bottom-[5px] h-[45px] transform transition-all duration-500 active:scale-95 bg-purple-700">
        <TiMicrophone className="text-gray-50 text-[25px]" />
      </button>
    </div>
  )
}

export default TextInput