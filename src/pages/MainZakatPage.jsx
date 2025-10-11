import React from 'react'
import Diamond from '../components/Diamond'
import ServiceCard from '../components/ServiceCard'
import { Calculator } from 'lucide-react'
import { ArrowUp } from 'lucide-react'
const MainZakatPage = () => {
  return (
    <div className="relative overflow-hidden">
      <div
            className="z-10 mx-auto px-4 flex flex-col gap-4 min-h-screen"
            style={{
              backgroundImage: "url('/background pattern.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
            }}
          >
            <div className="relative flex flex-col gap-6">
              {/* Zakat header */}
              <div className="flex items-center justify-between pl-12 mt-28">
                <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
                  <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
                  الزكاة
                </div>
              </div>
            </div>

            <div className='flex items-center gap-12 mr-2'>
              <ServiceCard icon={<Calculator size={40} color="#17343B" />} descirption={"اداة ذكية لحساب الزكاة لأموالك وممتلكاتك بسهولة"} onClick={()=>{}} className={"flex-1 max-w-[30%]"} title={"الزكاة"}/> 
              <ServiceCard icon={<ArrowUp size={40} color="#17343B" className='underline underline-offset-2'/>} descirption={"اخرج زكاتك بكل يسر"} className={"flex-1 max-w-[30%]"} link={"/services/zakat"} title={"اخراج الزكاة"}/>
            </div>
      </div>
      

        <div className="rightBow"></div>
        <div className="leftBow"></div>
    </div>
  )
}

export default MainZakatPage