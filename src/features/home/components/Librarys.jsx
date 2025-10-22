import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Diamond from "../../../components/Diamond";
import LibraryCard from "../../../components/LibraryCard";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const Librarys = ({ data }) => {
  const libs = JSON.parse(data);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      const maxScrollLeft = 0;
      const minScrollLeft = -(scrollWidth - clientWidth);

      setCanScrollLeft(scrollLeft > minScrollLeft);
      setCanScrollRight(scrollLeft < maxScrollLeft);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -340,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 340,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

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

  useEffect(() => {
    setTimeout(checkScrollPosition, 100);
  }, [libs]);

  // Simple fade up animation
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  const navigate = useNavigate() ;
  return (
    <motion.div
      className="flex flex-col gap-6 mt-8"
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      viewport={{ amount: 0.2, once: false }} // once: false allows re-triggering
    >
      {/* header */}
      <div className="flex items-center justify-between pl-12">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <div>
            <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
          </div>
          المكاتب
        </div>

        <Link to={"/offices"} className="text-xl text-[#16343A] cursor-pointer hover:text-[#24645E] transition-colors">
          المزيد
        </Link>
      </div>

      {/* libraries cards with navigation */}
      <div className="relative md:px-8">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-[#17343B]" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-[#17343B]" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 overflow-x-auto scrollbar-hide md:pr-8"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {libs.map((office, index) => (
            <div
              key={office.Id}
              className="flex-shrink-0"
            >
              <LibraryCard
                image={`https://framework.md-license.com:8093/ZakatImages/${office.OfficePhotoName}.jpg`}
                title={office.OfficeName}
                description={`${office.Address} - ${office.PhoneNum}`}
                className="w-[320px]"
                onClick={()=>{navigate(`/office?data=${encodeURIComponent(JSON.stringify(office))}`)}}
              />
            </div>
          ))}
        </div>

        {/* shadow overlay */}
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-[1000] pointer-events-none md:right-8"></div>
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-[1000] pointer-events-none md:left-8"></div>
      </div>
    </motion.div>
  );
};

export default Librarys;

Librarys.propTypes = {
  data: PropTypes.any,
};