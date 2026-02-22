import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Diamond from "../../../components/Diamond";
import CharityCard from "../../../components/CharityCard";
import chartArrowUP from "../../../public/SVGs/ChartArrowUp.svg";
import { executeProcedure } from "../../../services/apiServices";

const Charity = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });
  const [statisticalData, setStatisticalData] = useState(null);

  // دالة تنسيق الأرقام
  const formatNumber = (value) => {
    if (value === null || value === undefined) return "0";
    return Number(value).toLocaleString("ar-EG");
  };

  // Animation
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await executeProcedure(
        "Pnl2I5yvrTFeVH96QlzAsUDfACCXKoNvDpsIS2YJ77E=",
        "0#0"
      );
      console.log(response);
      setStatisticalData(response.decrypted);
    };
    fetchData();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col mt-8"
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* donation header */}
      <div className="flex items-center justify-between pl-12">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <div>
            <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4 shadow-xl" />
          </div>
          إحسانكم
        </div>
      </div>

      {/* Cards Container */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-around gap-6 md:pr-8 overflow-hidden bg-[#18383D] px-6 py-12">
        
        <CharityCard
          title="المبلغ المتبرع به"
          description={
            statisticalData?.PaidAmount !== undefined
              ? `${formatNumber(statisticalData.PaidAmount)} د.ل`
              : "جاري التحميل..."
          }
          className="py-8 w-96 h-40"
        />

        <CharityCard
          title="عدد المشاريع"
          description={
            statisticalData?.ProjectsCount !== undefined
              ? `${formatNumber(statisticalData.ProjectsCount)} مشروع`
              : "جاري التحميل..."
          }
          className="py-8 w-96 h-40"
        />

        <CharityCard
          title="عدد المستفيدين"
          description={
            statisticalData?.beneficiariesCount !== undefined
              ? `${formatNumber(statisticalData.beneficiariesCount)} مستفيد`
              : "جاري التحميل..."
          }
          className="py-8 w-96 h-40"
        />

      </div>
    </motion.div>
  );
};

export default Charity;