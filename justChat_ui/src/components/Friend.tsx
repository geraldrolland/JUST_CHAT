
import dog from "../assets/images/dog_avatar.png"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"

type propType = {
    showMessageBox: () => void,
    friend: {
        id: string | undefined,
        username: string,
        profile_image: string | undefined,
        is_online: boolean,
        last_date_online: string,
        last_message: {
             message_id: string | number,
            sender_username: string,
            sender_id: string | number,
            image: string | null,
            video: string | null,
            audio: string | null,
            text: string | null,
            created_at: string | null,
            is_receipient_online: string | null
        } | null
    } 
}



const Friend = ({showMessageBox, friend}: propType) => {
    const navigateToChat = useNavigate()
    const imgRef = useRef<HTMLImageElement>(null!)
    const navigateToMessageChatBox = () => {
    navigateToChat(`/home/friend/${friend.id}`)
    showMessageBox()
    }

    useEffect(() => {
        if (friend.profile_image === null) {
            if (friend.is_online === true) {
                imgRef.current.classList.add("filter")
                imgRef.current.classList.add("drop-shadow-md")
            } 
            else {
                imgRef.current.classList.add("filter")
                imgRef.current.classList.add("grayscale")
            }
        }

        console.log("username", friend.username)
    }, [])

  return (
    <div onClick={navigateToMessageChatBox} id={friend.id} className="w-[100%] ld:last:mb-[40px] last:mb-[80px] cursor-pointer h-[60px] border-b-[1px]  transform scale-95 flex justify-between items-center">
        <div className="w-[55%] h-[80%] flex justify-between items-center">
            <div style={{
                outlineColor:friend.is_online ? "#06D001" : "#F4F6FF"
            }} className="w-[50px] h-[50px] outline  outline-[1px] rounded-full  flex justify-center items-center">
            <img ref={imgRef} className="w-[40px]  h-[40px] rounded-full" src={friend?.profile_image ? friend.profile_image : dog} alt="" />
            </div>

            <div className="w-[70%] h-[40px] pl-1 flex flex-col justify-center text-gray-700  items-start ">
                <h1 className="font-spaceMono tracking-tighter font-semibold truncate">{friend.username}</h1>
                <p className="font-muli text-gray-900 truncate text-[14px] font-thin">{friend.last_message?.text}</p>
            </div>
        </div>
        <div className="w-[30%] relative h-[40px]">
            <p className="absolute top-0 right-0 text-gray-500 tracking-wide text-[14px] font-thin ">{friend.last_message?.created_at}</p>
            <div className="w-[18px] h-[18px] rounded-full bg-red-500 absolute bottom-0 flex justify-center items-center right-0 proportional-nums font-roboto ">
                <h1 className="text-[12px] text-gray-50">12</h1>
            </div>
        </div>
    </div>
  )
}

export default Friend
