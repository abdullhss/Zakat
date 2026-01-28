import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Diamond from '../../../components/Diamond'
import ServiceCard from '../../../components/ServiceCard'
import { HandCoinsIcon, MegaphoneIcon } from 'lucide-react'
import Sheep from "../../../../public/Sheep.svg"
import zakat from "../../../public/SVGs/zakat.svg"
import speaker from "../../../public/SVGs/Speaker.svg"
import DonateRequest from "../../../public/SVGs/DonateRequest.svg";
import rememberIcon from "../../../../public/remember-1-svgrepo-com.svg" 
import food from "../../../../public/food-svgrepo-com.svg" 

const Services = () => {
  const [isInView, setIsInView] = useState(false);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Service card data
  const services = [
    {
      icon: <img src={speaker} alt="Speaker" />,
      title: "الحملات",
      link:"/services/campaigns",
      description: "خدمة تتيح لك إنشاء حملة لجمع التبرعات في مختلف المجالات الخيرية و نشرها ليصل أثرها إلى مستحقيها"
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
      link:"/sacrifice",
      description: "خدمة لتوكيل ذبح الأضاحي والهدي والعقيقة والفدية والصدقة ، وتوزيعها على مستحقيها."
    },
    {
      icon: <img src={DonateRequest} alt="Speaker" />,
      title: "طلبات الإعانة",
      link:"/DonationRequester",
      description: "خدمة تتيح لك تقديم طلبات للتبرع في مختلف الأبواب الخيرية، ليتم مراجعتها ونشرها لمن يرغب في المساهمة."
    },
    {
      icon: <img src={DonateRequest} alt="Zakat" />,
      title: "تبرع لمن تحب",
      link:"/DonateTo",
      description: "خدمة تتيح لك إرسال تبرع باسم من تحب في أبواب الخير المختلفة وبطرق سهلة وسريعة."
    },
    {
      icon: <img src={food} alt="Sheep" className='w-10'/>,
      title: "زكاة الفطر",
      link:"/fitrZakat",
      description: "خدمة تتيح لك دفع زكاة الفطر إلكترونيًا لتصل إلى مستحقيها في الوقت المحدد وبالطريقة الشرعية."
    },
    {
      icon: <img src={rememberIcon} alt="Sheep" className='w-10' />,
      title: "ذكرني",
      link:"/remember",
      description: "خدمة تساعدك على تذكيرك بمواعيد التبرعات والزكاة والصدقات لضمان أدائها في أوقاتها."
    }
  ]

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

  // Simple fade up animation
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

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

        {/* <span className="text-xl text-[#16343A] cursor-pointer hover:text-[#24645E] transition-colors">
          المزيد
        </span> */}
      </div>

      {/* Services Cards with Horizontal Scroll */}
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

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-6 overflow-x-auto scrollbar-hide md:pr-8"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="flex-shrink-0"
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                link={service.link}
                descirption={service.description}
                className="min-w-[320px] max-w-[420px] h-full"
              />
            </div>
          ))}
        </div>

        {/* Shadow Overlays */}
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-[1000] pointer-events-none md:right-8"></div>
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-[1000] pointer-events-none md:left-8"></div>
      </div>
    </motion.div>
  )
}

export default Services