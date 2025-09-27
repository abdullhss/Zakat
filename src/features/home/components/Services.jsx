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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  // Header animation variants
  const headerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.4 }
    }
  }

  // Cards container animation variants
  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  // Individual card animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 30,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  // Diamond animation variants
  const diamondVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180,
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: { 
        duration: 0.6, 
        delay: 0.5,
        type: "spring",
        stiffness: 200 
      }
    },
    exit: { 
      scale: 0, 
      rotate: 180,
      opacity: 0,
      transition: { 
        duration: 0.4,
        ease: "easeIn"
      }
    }
  }

  // Service card data
  const services = [
    {
      icon: <img src={speaker} alt="Speaker" />,
      title: "الحملات",
      description: "خدمة تتيح لك إنشاء حملة لجمع التبرعات في مختلف المجالات الخيرية و نشرها ليصل أثرها إلي مستحقيها"
    },
    {
      icon: <img src={zakat} alt="Zakat" />,
      title: "الزكاة",
      description: "خدمة تتيح لك إمكانية حساب الزكاة بأنواعها المختلفة ودفعها عبر طرق سهلة وسريعة لتصل إلى مستحقيها."
    },
    {
      icon: <img src={Sheep} alt="Sheep" />,
      title: "الأضاحي",
      description: "خدمة لتوكيل ذبح الأضاحي والهدي والعقيقة والفدية والصدقة ، وتوزيعها على مستحقيها."
    }
  ]

  return (
    <motion.div 
      className="flex flex-col gap-6 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "exit"}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      viewport={{ amount: 0.2 }}
    >
      {/* donation header */}
      <motion.div 
        className="flex items-center justify-between pl-12"
        variants={headerVariants}
      >
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
      </motion.div>

      {/* Services Cards Grid */}
      <motion.div 
        className="relative md:px-8"
        variants={cardsContainerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:pr-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                descirption={service.description}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Services