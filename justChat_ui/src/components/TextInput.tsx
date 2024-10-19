import { TiMicrophone } from "react-icons/ti";
import { IoSendSharp } from "react-icons/io5";
import React, { TextareaHTMLAttributes, useRef, useState } from "react"
import "../style.css"
import { CiFaceSmile } from "react-icons/ci";
import { CiCamera } from "react-icons/ci";
import { GiPaperClip } from "react-icons/gi";
type propType ={
  boxRef: HTMLDivElement,
  setAmount: (amount: number | ((prevAmount: number) => number)) => void,
  amount: number,
}

const TextInput = ({boxRef, setAmount, amount}: propType) => {
  const [isRender, setIsRender] = useState(false)
  const sendRef = useRef<HTMLButtonElement>(null!)
  const micRef = useRef<HTMLButtonElement>(null!)
  const smileCamRef = useRef<HTMLDivElement>(null!)

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

    if (e.target.value !== "") {
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

    setIsRender(!isRender)

  }


  return (
    <div className="ld:w-[100%] w-[100%] md:w-[90%] md:left-[5%] ld:left-0  flex bottom-0  bg-[#ffff] lg:rounded-b-[15px]  absolute    items-center   z-10">
      <div className="lg:w-[85%] w-[80%] md:w-[85%] lg:ml-[15px] relative  ml-[10px] flex rounded-md py-1 overflow-hidden">
        <div className="absolute left-0 bottom-[14px] w-[30px] h-[30px] pt-1  justify-end pl-1 items-center">
          <GiPaperClip className="text-gray-700 text-[25px]" />
        </div>
        <textarea onChange={(e) => expandInputHeight(e)} className="w-[100%] tab-container text-gray-700 rounded-md resize-none pr-8 focus:outline-none bg-blue-100  pl-10  " cols={1} name="" id="" placeholder="enter message"></textarea>
        <div ref={smileCamRef} className="absolute right-0 bottom-[14px] w-[70px] h-[30px] flex transform transition-all duration-300 justify-center items-center">
          <div className="w-[50%] h-[100%] flex justify-center items-center">
            <CiFaceSmile className="text-gray-700       text-[25px]" />
          </div>
          <div className="w-[50%] h-[100%] flex justify-center items-center">
            <CiCamera className="text-gray-700       text-[25px]" />
          </div>
        </div>
      </div>
      <button ref={sendRef} className="absolute hidden lg:right-[15px] right-[10px] rounded-md w-[45px]  justify-center items-center bottom-[5px] h-[45px] transform transition-all duration-500 active:scale-95 bg-purple-700">
        <IoSendSharp className="text-gray-50 text-[25px]" />
      </button>
      <button ref={micRef} className="absolute flex right-[10px] rounded-md lg:right-[15px] w-[45px]  justify-center items-center bottom-[5px] h-[45px] transform transition-all duration-500 active:scale-95 bg-purple-700">
        <TiMicrophone className="text-gray-50 text-[25px]" />
      </button>
    </div>
  )
}

export default TextInput