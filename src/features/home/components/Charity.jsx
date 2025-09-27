import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Diamond from "../../../components/Diamond";
import CharityCard from "../../../components/CharityCard";
import chartArrowUP from "../../../public/SVGs/ChartArrowUp.svg";

const Charity = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false }); // once: false => replay

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 }
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4 } }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, type: "spring", stiffness: 100 }
    },
    exit: { opacity: 0, x: -100, transition: { duration: 0.4 } }
  };

  const cardsContainerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 }
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.4 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 120, damping: 20 }
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.4 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
    hover: { scale: 1.05, y: -2, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    hidden: { rotate: -180, opacity: 0 },
    visible: { rotate: 0, opacity: 1, transition: { duration: 0.6, delay: 1 } },
    exit: { rotate: -180, opacity: 0, transition: { duration: 0.3 } },
    hover: { y: -3, transition: { duration: 0.2, repeat: Infinity } }
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col mt-8"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "exit"}
    >
      {/* donation header */}
      <motion.div
        className="flex items-center justify-between pl-12"
        variants={headerVariants}
      >
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            <Diamond className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4" />
          </motion.div>
          احسانكم لعام 2025
        </div>
      </motion.div>

      {/* Cards Container */}
      <motion.div
        className="mt-6 flex flex-col md:flex-row items-center justify-around gap-6 md:pr-8 overflow-hidden bg-[#18383D] px-6 py-12"
        variants={cardsContainerVariants}
      >
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              y: -10,
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <CharityCard
              title={"عدد المستفدين"}
              description={"213.7 ألف مستفيد"}
              className="py-8 w-96 h-40"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Button */}
      <motion.div
        className="w-full flex items-center justify-center bg-[#18383D] py-4"
        variants={cardsContainerVariants}
      >
        <motion.button
          className="text-white px-6 py-3 rounded-md flex items-center gap-2"
          style={{
            background:
              "linear-gradient(90deg, rgba(36, 100, 94, 0.5) -6.91%, rgba(57, 104, 112, 0.5) 62.58%, rgba(59, 136, 154, 0.5) 100%)"
          }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.img src={chartArrowUP} variants={iconVariants} alt="Chart Arrow" />
          عرض الاحصائيات
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Charity;
