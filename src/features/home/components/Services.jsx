import React from 'react'
import Diamond from '../../../components/Diamond'
import ServiceCard from '../../../components/ServiceCard'
import { HandCoinsIcon, MegaphoneIcon } from 'lucide-react'
import Sheep from "../../../../public/Sheep.svg"
const Services = () => {
  return (
        <div className="flex flex-col gap-6 mt-8">
            {/* donation header */}
            <div className=" flex items-center justify-between pl-12 ">
                <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl   text-white text-2xl px-8 py-2">
                    <Diamond
                        className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4"
                    />
                الخدمات
                </div>
    
                <span className="text-xl text-[#16343A]">المزيد</span>
            </div>
            <div className="relative md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:pr-8 overflow-scroll scrollbar-hide">
                    <ServiceCard
                        icon={<HandCoinsIcon color='#17343B' size={40}/>}
                        title={"الزكاة"}
                        descirption={"خدمة لتوكيل ذبح الأضاحي والهدي والعقيقة والفدية والصدقة ، وتوزيعها على مستحقيها."}
                        className={"flex-shrink-0 w-72"}
                    />
                    <ServiceCard
                        icon={<MegaphoneIcon color='#17343B' size={40}/>}
                        title={"الحملات"}
                        className={"flex-shrink-0 w-72"}
                        descirption={"خدمة تتيح لك إنشاء حملة لجمع التبرعات في مختلف المجالات الخيرية و نشرها ليصل أثرها إلي مستحقيها"}
                    />
                    <ServiceCard
                        icon={<img className='w-14' src={Sheep}></img>}
                        title={"الأضاحي"}
                        className={"flex-shrink-0 w-72"}
                        descirption={"خدمة لتوكيل ذبح الأضاحي والهدي والعقيقة والفدية والصدقة ، وتوزيعها على مستحقيها."}
                    />
                    <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-[1000]  pointer-events-none md:left-8"></div>
                </div>
            </div>
        </div>
    )
}

export default Services