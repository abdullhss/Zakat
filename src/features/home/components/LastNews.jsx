import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Diamond from "../../../components/Diamond";
import NewsCard from "../../../components/NewsCard";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const LastNews = ({ data }) => {
  const news = JSON.parse(data);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: false }); // replay animation
  const navigate = useNavigate();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScrollLeft = 0;
      const minScrollLeft = -(scrollWidth - clientWidth);

      setCanScrollLeft(scrollLeft > minScrollLeft);
      setCanScrollRight(scrollLeft < maxScrollLeft);
    }
  };

  // Scroll functions RTL
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
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
  }, [news]);

  // Handle news card click
  const handleNewsClick = (item) => {
    navigate('/news/details', { 
      state: { newsItem: item } 
    });
  };

  // Simple fade up animation
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      ref={sectionRef}
      className="flex flex-col gap-6 mt-8"
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* header */}
      <div className="flex items-center justify-between pl-12">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
          آخر الأخبار
        </div>

        <Link to={`/news`} className="text-xl text-[#16343A] cursor-pointer hover:text-[#24645E] transition-colors">
          المزيد
        </Link>
      </div>

      {/* news cards with navigation */}
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
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {news.map((item, index) => (
            <div
              key={item.Id}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleNewsClick(item)}
            >
              <NewsCard
                image={`https://framework.md-license.com:8093/ZakatImages/${item.NewsMainPhotoName}.jpg`}
                title={item.NewsMainTitle}
                descirption={item.NewsSubTitle}
                className="w-[320px] transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* overlays */}
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-[1000] pointer-events-none md:right-8"></div>
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-[1000] pointer-events-none md:left-8"></div>
      </div>
    </motion.div>
  );
};

export default LastNews;

LastNews.propTypes = {
  data: PropTypes.any,
};