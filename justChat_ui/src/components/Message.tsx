import { useEffect} from "react"
import { useRef } from "react"
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

type propType = {
  message: messageType
}

type  userStatusType = {
  id: string | number,
  username: string,
  email: string,
  profile_image: string | null,
  access: string,
  refresh: string,
}

const Message = ({message}: propType) => {
    const textBoxRef  = useRef<HTMLDivElement>(null!)
    const greyDotRef  = useRef<HTMLDivElement>(null!)
    const purpleDotRef  = useRef<HTMLDivElement>(null!)
    const textContainerRef = useRef<HTMLDivElement>(null!)
    const textParaRef = useRef<HTMLParagraphElement>(null!)
    const ParaRef = useRef<HTMLParagraphElement>(null!)

    useEffect(() => {
      const userProfile: userStatusType = JSON.parse(sessionStorage.getItem("userProfile")!) 
      if (textContainerRef.current.scrollWidth > textContainerRef.current.clientWidth) {
        textParaRef.current.classList.add("w-[100%]")

      } else {
        textParaRef.current.classList.remove("w-[100%]")
        textParaRef.current.classList.remove("py-2")
        textParaRef.current.classList.add("py-1")
      }

      console.log("this is the sender id", message.sender)
      console.log("this is the user id", userProfile.id)

      if (userProfile.id === message.sender) {
        textBoxRef.current.classList.remove("justify-start")
        textBoxRef.current.classList.add("justify-end")
        console.log("yah")
        greyDotRef.current.classList.add("hidden")
        textParaRef.current.classList.add("self-end")
        ParaRef.current.classList.add("justify-end")
        ParaRef.current.classList.remove("justify-start")
        ParaRef.current.classList.remove("left-[4px]")
        ParaRef.current.classList.add("right-[4px]")
        textParaRef.current.classList.remove("bg-slate-200")
        textParaRef.current.classList.add("bg-purple-600")
        textParaRef.current.classList.remove("text-gray-700")
        textParaRef.current.classList.add("text-white")
        if (message.is_receipient_online === false) {
          purpleDotRef.current.classList.remove("bg-purple-500")
          purpleDotRef.current.classList.add("border-purple-500")
          purpleDotRef.current.classList.add("border")
        } else {
          purpleDotRef.current.classList.add("bg-purple-500")
          purpleDotRef.current.classList.remove("border-purple-500")
          purpleDotRef.current.classList.remove("border")     
        }


      } else {
        purpleDotRef.current.classList.add("hidden")
      }
    }, [message.is_receipient_online])


  return (
<div ref={textBoxRef} className="w-[100%] md:px-0 px-2 mt-6  flex ld:px-4 justify-start items-center ">
  <div ref={textContainerRef}  className="md:w-[65%]  lg:w-[55%] w-[75%]  relative  flex rounded-md justify-start flex-col  items-start">
    <p ref={textParaRef} className="text-wrap shadow-md px-2 w-[100%] rounded-md py-2 break-words text-[14px]  mb-[16px] md:text-[15px] bg-slate-200 text-gray-700 font-noto">{message.text}
    </p>
    <div ref={ParaRef} className="w-[110px] absolute justify-start px-3 items-center h-[15px]  mt-[2px] bottom-0 flex left-[4px]">
      <div ref={greyDotRef} className="absolute  -left-1  -top-[1px] w-[10px] bg-slate-200 h-[10px] rounded-full"></div>
      <p  className="font-thin text-gray-700 text-[10px]">{message.created_at}</p>
      <div ref={purpleDotRef} className="absolute -right-1 -top-[1px] w-[10px] bg-purple-500 h-[10px] rounded-full "></div>
    </div>
  </div>
</div>
  )
}

export default Message