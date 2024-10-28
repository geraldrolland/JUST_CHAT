import { useNavigate, useParams } from "react-router"
import { useContext, useEffect} from "react"
import { hideContext } from "./Home"
import pic from "../assets/images/git_img.png"
import { BsTelephone } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import Message from "./Message";
import "../style.css"
import TextInput from "./TextInput";
import { useRef } from "react";
import useStore from "./customhooks/UseStore";
import UseRequest from "./customhooks/UseRequest";
const MessageBox = () => {

  const messageBoxRef = useRef<HTMLDivElement>(null!)
  const navigateToHome = useNavigate()
  const {hideMessageBox} = useContext(hideContext)
  const params = useParams()
  const setMessageWebsocket = useStore(state => state.setMessageWebsocket)
  const response = UseRequest(`http://127.0.0.1:8000/api/users/${params.userId}/get_user_and_frnd_msgs/`, "get", "messages")
  const navigateHome = () => {
    navigateToHome("/home")
    hideMessageBox()
  }

  useEffect(() => {
    console.log("params.id", params)
    const userStatus = JSON.parse(sessionStorage.getItem("userProfile")!)
    const access = userStatus.access
    if (params.userId) {
      const messageWebsocket = new WebSocket(`ws://localhost:8000/ws/chat/${params.userId}/?access=${access}`);
      messageWebsocket.onopen = () => {
        console.log("connected successfully")
      }
  
      messageWebsocket.onerror = () => {
        console.log("something went wrong")
      }
  
      messageWebsocket.onmessage = (e) => {
        const message = JSON.parse(e.data)
        if (message) {
          response?.data.push(message.message)
        }
      }
  
      messageWebsocket.onclose = () => {
        console.log("connection closed successfully")
      }
  
      setMessageWebsocket(messageWebsocket)
    }



  }, [response?.data])



  return (
    <div  className="w-[100%] relative h-[100%]">
      <div className="w-[100%] bg-[#ffff]  h-[10%] flex justify-center rounded-t-[15px] items-center">
        <div className="md:w-[90%] ld:w-[95%] w-[100%] h-[100%] flex justify-between items-center md:border-b-[1px]">
        <div className="lg:w-[50%] ld:w-[65%]  w-[60%] md:w-[50%] flex justify-between items-center h-[80%]">
          <img className="md:w-[50px] md:h-[50px] h-[40px] ml-1 w-[40px] rounded-full" src={pic} alt="" />
          <div className="w-[75%] flex flex-col justify-center items-start h-[45px]">
            <h1 className="font-spaceMono w-[100%] truncate text-ellipsis text-gray-800 font-semibold -mt-[1px] text-[18px]">jerry</h1>
            <p className="font-thin tracking-wide -mt-[4px] text-[13px] md:text-[15px] text-gray-600">Online - Last seen, 2.02pm</p>
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
        <div   className="w-[100%] md:w-[90%] ld:w-[100%] mx-auto  max-h-[100%] relative tab-container overflow-y-auto">
        <div id="message-container" className="md:w-[100%] ld:w-[100%]  relative ">
        <Message/>

        <div ref={messageBoxRef}  id="padding" className="w-[100%] h-[60px]"></div>
      </div>
      </div>
      <TextInput boxRef={messageBoxRef.current} />
      </div>

    </div>
  )
}

export default MessageBox