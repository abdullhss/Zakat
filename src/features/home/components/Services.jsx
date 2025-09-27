import React from 'react'
import Diamond from '../../../components/Diamond'
import ServiceCard from '../../../components/ServiceCard'
import { HandCoinsIcon, MegaphoneIcon } from 'lucide-react'
import Sheep from "../../../../public/Sheep.svg"
import zakat from "../../../public/SVGs/zakat.svg"
import speaker from "../../../public/SVGs/speaker.svg"

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
                {/* Changed: Use grid instead of flex for equal heights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:pr-8">
                    <ServiceCard
                        icon={<img src={speaker} />}
                        title={"الحملات"}
                        className={""}
                        descirption={
                        "خدمة تتيح لك إنشاء حملة لجمع التبرعات في مختلف المجالات الخيرية و نشرها ليصل أثرها إلي مستحقيها"
                        }
                    />
                    <ServiceCard
                        icon={<img src={zakat} />}
                        title={"الزكاة"}
                        descirption={
                        "خدمة تتيح لك إمكانية حساب الزكاة بأنواعها المختلفة ودفعها عبر طرق سهلة وسريعة لتصل إلى مستحقيها."
                        }
                        className={""}
                    />
                    <ServiceCard
                        icon={<img src={Sheep} />}
                        title={"الأضاحي"}
                        className={""}
                        descirption={
                        "خدمة لتوكيل ذبح الأضاحي والهدي والعقيقة والفدية والصدقة ، وتوزيعها على مستحقيها."
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default Services