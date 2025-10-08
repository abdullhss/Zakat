import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Diamond from '../../../components/Diamond'
import ServiceCard from '../../../components/ServiceCard'
import { HandCoinsIcon, MegaphoneIcon } from 'lucide-react'
import Sheep from "../../../../public/Sheep.svg"
import zakat from "../../../public/SVGs/zakat.svg"
import speaker from "../../../public/SVGs/Speaker.svg"

const Services = () => {
  const [isInView, setIsInView] = useState(false);

  // Simple fade up animation
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  // Service card data
  const services = [
    {
      icon: <img src={speaker} alt="Speaker" />,
      title: "الحملات",
      link:"/zakat",
      description: "خدمة تتيح لك إنشاء حملة لجمع التبرعات في مختلف المجالات الخيرية و نشرها ليصل أثرها إلي مستحقيها"
    },
    {
      icon: <img src={zakat} alt="Zakat" />,
      title: "الزكاة",
      link:"/zakat",
      description: "خدمة تتيح لك إمكانية حساب الزكاة بأنواعها المختلفة ودفعها عبر طرق سهلة وسريعة لتصل إلى مستحقيها."
    },
    {
      icon: <img src={Sheep} alt="Sheep" />,
      title: "الأضاحي",
      link:"/zakat",
      description: "خدمة لتوكيل ذبح الأضاحي والهدي والعقيقة والفدية والصدقة ، وتوزيعها على مستحقيها."
    }
  ]

  return (
    <motion.div 
      className="flex flex-col gap-6 mt-8"
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      viewport={{ amount: 0.2, once: false }}
    >
      {/* donation header */}
      <div className="flex items-center justify-between pl-12">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <div>
            <Diamond
              className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4"
            />
          </div>
          الخدمات
        </div>

        <span className="text-xl text-[#16343A] cursor-pointer hover:text-[#24645E] transition-colors">
          المزيد
        </span>
      </div>

      {/* Services Cards Grid */}
      <div className="relative md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:pr-8">
          {services.map((service, index) => (
            <div
              key={index}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                link={service.link}
                descirption={service.description}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Services