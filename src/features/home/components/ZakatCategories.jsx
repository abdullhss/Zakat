import React, { useState } from "react";
import { motion } from "framer-motion";
import Diamond from "../../../components/Diamond";
import coins from "../../../../public/coins.webp";
import { Link } from "react-router-dom";
import aya from "../../../public/SVGs/Aya.svg";
import zakatIcon from "../../../../public/icons/zakat icon.png"
import sadaqatIcon from "../../../../public/icons/sadaqat icon.png"
import kafaratIcon from "../../../../public/icons/kafarat icon.png"
import projectsIcon from "../../../../public/icons/projects icon.png"

const ZakatCategories = () => {
  const [isInView, setIsInView] = useState(false);
  
  const handleDonateClick = (category) => {
    
  };

  const categories = [
    {
      id: 1,
      title: "أخرج زكاتك",
      link:"/services/zakat",
      bgColor: "bg-gray-200",
      icon:zakatIcon
    },
    {
      id: 3,
      title: "الصدقات",
      link:"/services/sadaka",
      bgColor: "bg-gray-200",
      icon:sadaqatIcon
    },
    {
      id: 2,
      title: "الكفارات والفدية والنذور",
      link:"/services/karfaraAndNozor",
      bgColor: "bg-gray-200",
      icon:kafaratIcon
    },
    {
      id: 4,
      title: "المشاريع",
      link:"/opportunities/projects",
      bgColor: "bg-gray-200",
      icon:projectsIcon
    },
  ];

  // Container animation with exit
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    }
  };

  // Verse animation with exit
  const verseVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
      transition: { 
        duration: 0.6,
        ease: "easeIn"
      }
    }
  };

  // Card animation with exit
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateY: -10 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateY: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: 60,
      rotateY: -10,
      transition: { 
        duration: 0.5,
        ease: "easeIn"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Button animation
  const buttonVariants = {
    hover: {
      scale: 1.05,
      background: "linear-gradient(to right, #1a4a46, #142c2f, #112228)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      borderBottomWidth: "2px",
      transition: {
        duration: 0.1
      }
    }
  };

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
  };

  return (
    <motion.section 
      className="py-16 px-4"
      initial="hidden"
      animate={isInView ? "visible" : "exit"}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      viewport={{ amount: 0.0 }}
      variants={containerVariants}
    >
      <div className="flex flex-col gap-12 items-center">
        {/* Quranic Verse */}
        <span className="text-2xl bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] bg-clip-text text-transparent font-semibold">
          قال الله تعالى
        </span>
        <motion.div 
          className="text-center mb-12"
          variants={verseVariants}
        >
          <img src={aya}></img>
        </motion.div>

        {/* Categories Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full mx-auto"
          variants={containerVariants}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative bg-gradient-to-r from-[#ffffff] to-[#CBCBCB] rounded-2xl shadow-lg p-6 text-center"
              variants={cardVariants}
              whileHover="hover"
              custom={index}
            >
              {/* Icon Container */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div
                >
                  <img width={100} height={100} src={category.icon}></img>
                  {/* <Diamond width={80} height={80} imgUrl={category.icon} /> */}
                </div>
              </div>

              {/* Category Title */}
              <h3
                className="text-xl font-bold text-gray-800 mb-4 pt-10"
                dir="rtl"
              >
                {category.title}
              </h3>

              {/* Donate Button */}
              <Link to={category.link}>
                <motion.button
                  className="w-full bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] border-b-4 border-[#8E6D4C] text-white py-3 px-6 rounded-lg font-semibold shadow-md"
                  dir="rtl"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  ادفع الآن
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ZakatCategories;