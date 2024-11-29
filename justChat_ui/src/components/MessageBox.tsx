import { useLocation, useNavigate, useParams } from "react-router"
import { useContext, useEffect} from "react"
import { hideContext } from "./Home"

import { BsTelephone } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import "../style.css"
import TextInput from "./TextInput";
import { useRef } from "react";
import useStore from "./customhooks/UseStore";
import Message from "./Message";



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
const MessageBox = () => {
  const currentLocation = useLocation()
  const setScrollToLastMsg = useStore(state => state.setScrollToLastMsg)
  const messageBoxRef = useRef<HTMLDivElement>(null!)
  const navigateToHome = useNavigate()
  const {hideMessageBox} = useContext(hideContext)
  const params = useParams()

  const messageContainerRef = useRef<HTMLDivElement>(null!)
  const friendProfile = useStore(state => state.friendProfile)

  const scrollToLastMsg = () => {
    messageContainerRef.current.scrollIntoView({behavior: "smooth", block: "end"})
  }

  const navigateHome = () => {
    navigateToHome("/home")
    hideMessageBox()
    useStore.setState({currentPath: ""})
  }

  useEffect(() => {
    messageContainerRef.current.scrollIntoView({behavior:"smooth", block:"end"})
    console.log("params", params.userId)
    console.log("message", friendProfile?.messages)
    setScrollToLastMsg(scrollToLastMsg) 
  }, [friendProfile?.messages])

  useEffect(() => {
    console.log("THIS IS THE PATH ", currentLocation.pathname)
    useStore.setState({currentPath: currentLocation.pathname})   
  }, [])


  return (
    <div  className="w-[100%] relative h-[100%]">
      <div className="w-[100%] bg-[#ffff]  h-[10%] flex justify-center rounded-t-[15px] items-center">
        <div className="md:w-[90%] ld:w-[95%] w-[100%] h-[100%] flex justify-between items-center md:border-b-[1px]">
        <div className="lg:w-[50%] ld:w-[65%]  w-[60%] md:w-[50%] flex justify-between items-center h-[80%]">
          <div className="md:w-[50px] flex justify-center items-center md:h-[50px] h-[40px] ml-1 w-[40px] rounded-full">
          <img  className="w-[80%] h-[80%] rounded-full" src={friendProfile?.profile_image} alt="" />
          </div>

          <div className="w-[75%] flex flex-col justify-center items-start h-[45px]">
            <h1 className="font-spaceMono w-[100%] truncate text-ellipsis text-gray-800 font-semibold -mt-[1px] text-[18px]">{friendProfile?.username}</h1>
            <p className="font-thin tracking-wide -mt-[4px] text-[13px] md:text-[15px] text-gray-600">{friendProfile?.is_online === true ? <span className="text-green-500">Online</span> : <span className="text-[14px]">Last Seen  {friendProfile?.last_date_online}</span>}</p>
          </div>
        </div>
        <div className="md:w-[20%] ld:min-w-[25%] w-[30%] h-[80%] flex justify-between items-center">
          <BsTelephone onClick={navigateHome} className="text-purple-600 cursor-pointer transform transition-all active:text-[23px] text-[25px] md:text-[27px]" />
          <BsCameraVideo className="text-purple-600 cursor-pointer transform transition-all active:text-[23px] text-[25px] md:text-[27px]"/>
          <CiMenuKebab className="text-purple-600 cursor-pointer transform transition-all active:text-[23px] text-[25px] md:text-[27px]"   />
        </div>
        </div>
      </div>
      <div

       className="w-[100%] h-[90%] pb-[5%]  scroll-smooth relative">
        <div  className="w-[100%] md:w-[90%] ld:w-[100%] mx-auto  max-h-[100%] relative tab-container overflow-y-auto">
        <div ref={messageContainerRef} id="message-container" className="md:w-[100%] ld:w-[100%]  relative ">
          {
            friendProfile?.messages?.map((message: messageType) => <Message key={message.message_id} message={message} />)
          }
      <div ref={messageBoxRef}  id="padding" className="w-[100%] h-[60px]">
      </div>
      </div>
      </div>
      <TextInput  boxRef={messageBoxRef.current} />
      </div>

    </div>
  )
}

export default MessageBox