import React from 'react'
import Diamond from '../components/Diamond'
import ServiceCard from '../components/ServiceCard'
import { Calculator } from 'lucide-react'
import { ArrowUp } from 'lucide-react'
import ZakatCalculator from "../components/Zakat page/ZakatCalc";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';

const MainZakatPage = () => {
  const [zakatPopUp, setZakatPopUp] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [donationValue, setDonationValue] = useState(0);
  const handleCalcZakat = ()=>{
    setZakatPopUp(true);
    
  }
  return (
    <div className="relative overflow-hidden">
      <div
            className="z-10 mx-auto px-4 flex flex-col gap-4 min-h-screen"
            style={{
              backgroundImage: "url('/background pattern.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
            }}
          >
            <div className="relative flex flex-col gap-6">
              {/* Zakat header */}
              <div className="flex items-center justify-between pl-12 mt-28">
                <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
                  <Diamond className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/4  shadow-xl" />
                  الزكاة
                </div>
              </div>
            </div>

            <div className='flex items-center flex-col md:flex-row gap-12 mr-2'>
              <ServiceCard icon={<Calculator size={40} color="#17343B" />} descirption={"اداة ذكية لحساب الزكاة لأموالك وممتلكاتك بسهولة"} onClick={handleCalcZakat} className={"flex-1 max-h-48 w-full lg:max-w-[30%]"} title={"الزكاة"}/> 
              <ServiceCard icon={<ArrowUp size={40} color="#17343B" className='underline underline-offset-2'/>} descirption={"اخرج زكاتك بكل يسر"} className={"flex-1 max-h-48  w-full lg:max-w-[30%]"} link={"/services/zakat"} title={"اخراج الزكاة"}/>
            </div>
      </div>
            <AnimatePresence>
              {zakatPopUp && (
                <motion.div
                  className="fixed top-0 right-0 h-screen w-screen z-[10000] bg-black/50 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setZakatPopUp(false)}
                >
                  <motion.div
                    className="bg-white w-full md:w-1/2 h-full shadow-lg"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ZakatCalculator
                      closeZakatCalc={setZakatPopUp}
                      setDonationAmount={setDonationAmount}
                      setDonationValue={setDonationValue}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

        <div className="rightBow"></div>
        <div className="leftBow"></div>
    </div>
  )
}

export default MainZakatPage