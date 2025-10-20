import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingDonationButton from "../globalComponents/FloatingDonationButton";
import aya from "../public/SVGs/Aya.svg";
import logo from "../../public/Logo.png";
import { toast } from "react-toastify";
import { ExecuteAuthentication } from '../services/apiServices';

const EnterOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds countdown
  const [canResend, setCanResend] = useState(false);

  // Countdown timer effect with navigation when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      // Navigate to home when timer finishes
      const navigateTimer = setTimeout(() => {
        navigate("/");
        localStorage.removeItem("TransToken")
      }, 1000);
      return () => clearTimeout(navigateTimer);
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, navigate]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key down for backspace and navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp(newOtp);
      
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    } else {
      toast.error("الرجاء لصق رمز مكون من 6 أرقام");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const TransToken = localStorage.getItem("TransToken")
        
        const otpString = otp.join('');
        
        const response = await ExecuteAuthentication(TransToken , otpString);
        
        
        if(response.success == 200){
            navigate("/login")
        }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("خطأ في التحقق، الرجاء المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrowseAsVisitor = () => {
    navigate("/");
    localStorage.removeItem("TransToken")
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate circle progress (for circular timer)
  const radius = 35; // Increased radius for bigger timer
  const circumference = 2 * Math.PI * radius;
  const progress = ((90 - timeLeft) / 90) * circumference;

  // Determine timer color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 30) {
      return "#EF4444"; // Red color for last 30 seconds
    }
    return "#24645E"; // Original color for first 60 seconds
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.02 }
  };

  const otpContainerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const otpInputVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <>
      <FloatingDonationButton />

      <motion.div 
        className="min-h-screen flex flex-col lg:flex-row" 
        dir="rtl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Right Side - Decorative Background */}
        <motion.div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('/loginpage.png')",
          }}
          variants={itemVariants}
        />

        {/* Left Side - OTP Form */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-white"
          variants={containerVariants}
        >
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
            {/* Logo */}
            <motion.div variants={itemVariants}>
              <img
                src={logo}
                alt="Logo"
                className="h-24 sm:h-28 mb-6 mx-auto"
              />
            </motion.div>

            {/* OTP Form Header */}
            <motion.div 
              className="text-center mb-6 sm:mb-8 lg:mb-10"
              variants={itemVariants}
            >
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                التحقق من الرمز
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4">
                أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك
              </p>
              
              {/* Circular Countdown Timer - Bigger and color changing */}
              <motion.div 
                className="flex items-center justify-center mb-4"
                variants={itemVariants}
                >
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                        fill="transparent"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke={getTimerColor()}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        strokeLinecap="round"
                    />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center inset-0">
                    <span 
                        className={`text-lg font-bold ${
                        timeLeft <= 30 ? 'text-red-600' : 'text-gray-700'
                        }`}
                    >
                        {formatTime(timeLeft)}
                    </span>
                    {timeLeft <= 30 && (
                        <span className="text-xs text-red-500 mt-1">
                        متبقي وقت قليل
                        </span>
                    )}
                    </div>
                </div>
                </motion.div>

            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6 sm:space-y-8 lg:space-y-10"
              variants={containerVariants}
            >
              {/* OTP Inputs */}
              <motion.div 
                className="flex flex-col items-center space-y-6"
                variants={otpContainerVariants}
              >
                <div className="flex text-center justify-center space-x-2 sm:space-x-3 lg:space-x-4" dir="ltr">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      onFocus={(e) => e.target.select()}
                      variants={otpInputVariants}
                      style={{textAlign:"center"}}
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-center text-lg sm:text-xl lg:text-2xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all ${
                        digit ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              <div className='flex flex-col gap-3'>
                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || otp.join('').length !== 6}
                  variants={buttonVariants}
                  whileTap="tap"
                  whileHover="hover"
                  style={{ background: "linear-gradient(90deg, #24645E -23.06%, #18383D 53.78%, #17343B 60.46%)"}}
                  className="w-full text-white py-3 rounded-lg hover:bg-emerald-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg lg:text-xl"
                >
                  {isSubmitting ? "جاري التحقق..." : "تحقق من الرمز"}
                </motion.button>

                {/* Browse as Visitor */}
                <motion.button
                  type="button"
                  onClick={handleBrowseAsVisitor}
                  variants={buttonVariants}
                  whileTap="tap"
                  whileHover="hover"
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-base sm:text-lg lg:text-xl"
                >
                  تصفح كزائر
                </motion.button>
              </div>

            </motion.form>

            {/* Quranic Verse */}
            <motion.div 
              className="w-full flex items-center justify-center mt-6 sm:mt-8 lg:mt-12 text-center overflow-hidden"
              variants={itemVariants}
            >
              <img 
                src={aya} 
                alt="Quranic verse" 
                className="max-w-full h-auto"
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default EnterOTP;