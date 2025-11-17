import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DoTransaction } from '../services/apiServices';
import { toast } from 'react-toastify';

const Remember = () => {
  const [formData, setFormData] = useState({
    text: '',
    datetime: '',
    notificationType: 'N'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (datetime) => {
  if (!datetime) return "";
  const date = new Date(datetime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = "00"; // خلي الثواني دايمًا صفر
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getCurrentFormattedDateTime = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = "00";

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedData = {
        ...formData,
        datetime: formatDateTime(formData.datetime)
    };
    const userData = localStorage.getItem("UserData");
    const userId = JSON.parse(userData).Id
    console.log("Form submitted:", formattedData);
    const response = await DoTransaction("2dGct9IfGTg/fXhktm/Huw==" , 
        `0#${userId}#${getCurrentFormattedDateTime()}#${formattedData.datetime}#${formattedData.text}#${formattedData.notificationType}`
    );
    if(response.success==200){
        toast.success("تم انشاء التذكير بنجاح")
    }
    
    };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: { scale: 0.95 }
  };

  const isFormValid = formData.text.trim() !== "" && formData.datetime.trim() !== "";

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className=" mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-8">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center text-gray-800 mb-8"
          >
            تذكير
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Input */}
            <motion.div variants={itemVariants}>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                النص (حد أقصى 50 حرفًا)
              </label>
              <input
                type="text"
                id="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-right"
                placeholder="أدخل نص التذكير..."
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {formData.text.length}/50
              </div>
            </motion.div>

            {/* Date and Time Selector */}
            <motion.div variants={itemVariants}>
              <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                التاريخ والوقت
              </label>
              <input
                type="datetime-local"
                id="datetime"
                name="datetime"
                value={formData.datetime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-right"
              />
            </motion.div>

            {/* Radio Buttons */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                نوع الإشعار
              </label>
              <div className="space-y-3 text-right">
                {[
                  { label: "اشعار", value: "N" },
                  { label: "رسالة sms", value: "S" },
                  { label: "واتساب", value: "W" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center justify-start space-x-3 space-x-reverse cursor-pointer">
                    <input
                      type="radio"
                      name="notificationType"
                      value={option.value}
                      checked={formData.notificationType === option.value}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-green-500 focus:ring-green-400 accent-[#18383D] border-gray-300 rounded-full"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
            type="submit"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            disabled={!isFormValid} // هنا
            className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] transform transition-all duration-300 shadow-lg hover:shadow-xl
                        ${!isFormValid ? "opacity-50 cursor-not-allowed hover:shadow-none" : ""}`}
            >
                إرسال
            </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Remember;