import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DoTransaction } from '../services/apiServices';
import { toast } from 'react-toastify';
import { Calendar, Clock } from 'lucide-react';

const Remember = () => {
  const [formData, setFormData] = useState({
    text: '',
    date: '',
    time: '',
    notificationType: 'N'
  });

  // Get current date and time for min values
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:00`;
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
    
    // Validate that selected date/time is not in the past
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const currentDateTime = new Date();
    
    if (selectedDateTime <= currentDateTime) {
      toast.error("لا يمكن اختيار تاريخ أو وقت مضى. الرجاء اختيار وقت مستقبلي");
      return;
    }
    
    const formattedData = {
      ...formData,
      datetime: formatDateTime(formData.date, formData.time)
    };
    
    const userData = localStorage.getItem("UserData");
    const userId = JSON.parse(userData).Id;
    
    console.log("Form submitted:", formattedData);
    const response = await DoTransaction("2dGct9IfGTg/fXhktm/Huw==", 
      `0#${userId}#${getCurrentFormattedDateTime()}#${formattedData.datetime}#${formattedData.text}#${formattedData.notificationType}`
    );
    
    if(response.success == 200){
      toast.success("تم انشاء التذكير بنجاح");
      // Reset form
      setFormData({
        text: '',
        date: '',
        time: '',
        notificationType: 'N'
      });
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

  const isFormValid = formData.text.trim() !== "" && formData.date.trim() !== "" && formData.time.trim() !== "";

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18383D] focus:border-transparent transition-all duration-300 text-right"
                placeholder="أدخل نص التذكير..."
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {formData.text.length}/50
              </div>
            </motion.div>

            {/* Date and Time Selectors */}
            <motion.div variants={itemVariants} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                التاريخ والوقت
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Input */}
                <div className="relative">
                  <label htmlFor="date" className="block text-xs text-gray-600 mb-1 text-right">
                    التاريخ
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={getCurrentDate()}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18383D] focus:border-transparent transition-all duration-300 text-right"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Time Input */}
                <div className="relative">
                  <label htmlFor="time" className="block text-xs text-gray-600 mb-1 text-right">
                    الوقت
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      min={formData.date === getCurrentDate() ? getCurrentTime() : undefined}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#18383D] focus:border-transparent transition-all duration-300 text-right"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Helper text */}
              <div className="text-xs text-gray-500 text-right mt-2">
                {formData.date && formData.time ? (
                  <span>
                    التذكير سيكون في: {new Date(`${formData.date}T${formData.time}`).toLocaleString('ar-EG')}
                  </span>
                ) : (
                  <span>اختر تاريخ ووقت مستقبلي للتذكير</span>
                )}
              </div>
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
                  <label key={option.value} className="flex items-center justify-start space-x-3 space-x-reverse cursor-pointer group">
                    <input
                      type="radio"
                      name="notificationType"
                      value={option.value}
                      checked={formData.notificationType === option.value}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-[#18383D] focus:ring-[#18383D] border-gray-300 rounded-full group-hover:border-[#18383D] transition-colors"
                    />
                    <span className="text-gray-700 group-hover:text-[#18383D] transition-colors">{option.label}</span>
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
                whileHover={isFormValid ? "hover" : "initial"}
                whileTap={isFormValid ? "tap" : "initial"}
                disabled={!isFormValid}
                className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] transform transition-all duration-300 shadow-lg ${
                  isFormValid 
                    ? 'hover:shadow-xl cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed hover:shadow-lg'
                }`}
              >
                إرسال التذكير
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Remember;