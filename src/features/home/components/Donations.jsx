import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Diamond from "../../../components/Diamond";
import DonationCard from "../../../components/DonationCard";
import PropTypes from "prop-types";

const Donations = ({ data }) => {
  const donations = JSON.parse(data);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows - Fixed for RTL
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      // For RTL layout, scrollLeft is negative or positive depending on browser
      // The maximum scroll position is 0, minimum is -(scrollWidth - clientWidth)
      const maxScrollLeft = 0;
      const minScrollLeft = -(scrollWidth - clientWidth);
      
      setCanScrollLeft(scrollLeft > minScrollLeft);
      setCanScrollRight(scrollLeft < maxScrollLeft);
    }
  };

  // Scroll functions fixed for RTL
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // In RTL, scrolling left means moving towards the end (more negative)
      scrollContainerRef.current.scrollBy({
        left: -340,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // In RTL, scrolling right means moving towards the start (less negative)
      scrollContainerRef.current.scrollBy({
        left: 340,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  // Check scroll position on mount, scroll, and resize
  useEffect(() => {
    checkScrollPosition();
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);
      
      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, []);

  // Also check when donations data changes
  useEffect(() => {
    setTimeout(checkScrollPosition, 100);
  }, [donations]);

  // Animations (same as LastNews)
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* donation header */}
      <motion.div
        className="flex items-center justify-between pl-12"
        variants={headerVariants}
      >
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <Diamond className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4" />
          فرص التبرع
        </div>

        <span className="text-xl text-[#16343A] cursor-pointer hover:text-[#24645E] transition-colors">
          المزيد
        </span>
      </motion.div>

      {/* donation cards with navigation */}
      <motion.div className="relative md:px-8" variants={cardsContainerVariants}>
        {/* Left Arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              key="left-arrow"
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              onClick={scrollLeft}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-[#17343B]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              key="right-arrow"
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              onClick={scrollRight}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-[#17343B]" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 overflow-x-auto scrollbar-hide md:pr-8"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            direction: "rtl"
          }}
          dir="rtl"
        >
          {donations.map((item, index) => (
            <motion.div
              key={item.Id}
              variants={cardVariants}
              custom={index}
              className="flex-shrink-0"
              style={{ direction: "ltr" }}
            >
              <DonationCard
                image={`https://framework.md-license.com:8093/ZakatImages/${item.ProjectPhotoName}.jpg`}
                title={item.ProjectName}
                description={item.ProjectDesc}
                collected={item.ProjectOpeningBalance}
                goal={item.ProjectWantedAmount}
                className="min-w-[320px]"
              />
            </motion.div>
          ))}
        </div>

        {/* shadow overlay */}
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-[1000] pointer-events-none md:right-8"></div>
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-[1000] pointer-events-none md:left-8"></div>
      </motion.div>
    </motion.div>
  );
};

export default Donations;

Donations.propTypes = {
  data: PropTypes.any,
};