import { useEffect} from "react"
import { useRef } from "react"


const Message = () => {
    const textContainerRef = useRef<HTMLDivElement>(null!)
    const textParaRef = useRef<HTMLParagraphElement>(null!)
    useEffect(() => {
      if (textContainerRef.current.scrollWidth > textContainerRef.current.clientWidth) {
        textParaRef.current.classList.add("w-[100%]")

      } else {
        textParaRef.current.classList.remove("w-[100%]")
        textParaRef.current.classList.remove("py-2")
        textParaRef.current.classList.add("py-1")
      }
    }, [])
  return (
<div className="w-[100%] md:px-0 px-2 mt-6  flex ld:px-4 justify-start items-center">
  <div ref={textContainerRef} className="md:w-[65%]  lg:w-[55%] w-[75%]  flex rounded-md justify-start flex-col  items-start">
    <p ref={textParaRef} className="text-wrap px-2 w-[100%] rounded-md py-2 border  break-words text-[14px] md:text-[15px] text-gray-800 font-noto">hi00000000000000000000000000000000000000000000000000000000000
    </p>
    <div className="w-[110px] justify-start px-3 items-center h-[15px]  mt-[2px] relative flex">
      <div className="absolute  -left-1 -top-[1px] w-[10px] bg-gray-300 h-[10px] rounded-full"></div>
      <p className="font-thin text-gray-700 text-[10px]">Wed, 10.30 pm</p>
      <div className="absolute -right-1 -top-[1px] w-[10px] bg-purple-500 h-[10px] rounded-full "></div>
    </div>
  </div>
</div>
  )
}

export default Message