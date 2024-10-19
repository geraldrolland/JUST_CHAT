import { useEffect, useRef } from "react"

const Message = () => {

    const textRef = useRef<HTMLParagraphElement>(null!)
    useEffect(() => {
        console.log("this clientwidth", textRef.current.clientWidth)
        if (textRef.current.clientWidth > 350) {
            if (matchMedia("(max-width: 680px)").matches === true) {
                textRef.current.classList.add("w-[250px]")
            } else {
              textRef.current.classList.add("w-[350px]")
            }

        } 
    }, [])
  return (
<div className="w-[100%] flex-col   flex flex-wrap justify-end last:mb-10 even:items-end even:pr-4  pl-4 first:mt-4 mt-8 relative right-0">
  <p ref={textRef}  className="  pl-3 text-gray-50  break-words pr-3 text-justify  leading-tight text-[15px] font-arimo rounded-[10px] py-2 shadow-sm  bg-purple-500">
    Hey00000000
  </p>
  <div className="w-[150px] flex justify-center relative h-[20px] border mt-1">
    <div className="w-[12px] h-[12px] bg-gray-300 rounded-full absolute top-0 left-0 "></div>
    <div className="w-[12px] h-[12px] bg-gray-200 rounded-full absolute top-0 right-0 "></div>
    <small className="text-gray-700 font-thin tracking-wide">Today, 8.20pm</small>
  </div>
</div>
  )
}

export default Message