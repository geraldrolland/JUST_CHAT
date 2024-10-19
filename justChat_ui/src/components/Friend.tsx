import pic from "../assets/images/git_img.png"
import { useNavigate } from "react-router"

type propType = {
    showMessageBox: () => void,
}



const Friend = ({showMessageBox}: propType) => {
    const navigateToChat = useNavigate()
    const navigateToMessageChatBox = () => {
    navigateToChat("/home/1")
    showMessageBox()
    }

  return (
    <div onClick={navigateToMessageChatBox} className="w-[100%] ld:last:mb-[40px] last:mb-[80px] cursor-pointer h-[60px] border-b-[1px] transform scale-95 flex justify-between items-center">
        <div className="w-[55%] h-[80%] flex justify-between items-center">
            <img className="w-[40px] h-[40px]  rounded-full" src={pic} alt="" />
            <div className="w-[70%] h-[40px] pl-1 flex flex-col justify-center text-gray-700  items-start ">
                <h1 className="font-spaceMono font-semibold truncate">jerry</h1>
                <p className="font-muli text-gray-900 truncate text-[14px] font-thin">never mind bro</p>
            </div>
        </div>
        <div className="w-[30%] relative h-[40px]">
            <p className="absolute top-0 right-0 text-gray-500 tracking-wide text-[14px] font-thin ">Today, 9.52pm</p>
            <div className="w-[18px] h-[18px] rounded-full bg-red-500 absolute bottom-0 flex justify-center items-center right-0 proportional-nums font-roboto ">
                <h1 className="text-[12px] text-gray-50">12</h1>
            </div>
        </div>
    </div>
  )
}

export default Friend
