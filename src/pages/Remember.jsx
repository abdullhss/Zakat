import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DoTransaction, executeProcedure } from '../services/apiServices';
import { toast } from 'react-toastify';
import { Calendar, Clock, Bell, MessageSquare, Phone, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';

const Remember = () => {
  const [formData, setFormData] = useState({
    text: '',
    date: '',
    time: '',
    notificationType: 'N'
  });
  
  const userData = localStorage.getItem("UserData");
  const userId = JSON.parse(userData).Id;
  
  // State for old reminders
  const [oldReminders, setOldReminders] = useState([]);
  const [totalRemindersCount, setTotalRemindersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(totalRemindersCount / itemsPerPage);

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

  // Fetch old reminders
  const fetchOldReminders = async (page = 1) => {
    try {
      setLoadingReminders(true);
      const startfrom = (page - 1) * itemsPerPage;
      const response = await executeProcedure(
        "EHJUSddT77wRe5BM+zwUjw==",
        `${userId}#${startfrom + 1}#${itemsPerPage}`
      );
      console.log(`${userId}#${startfrom + 1}#${itemsPerPage}`);
      
      console.log(response);
      
      if (response && response.decrypted) {
        const count = Number(JSON.parse(response.decrypted.SendToMeCount));
        const data = JSON.parse(response.decrypted.SendToMeData);
        
        setTotalRemindersCount(count);
        setOldReminders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching old reminders:", error);
      toast.error("حدث خطأ في تحميل التذكيرات السابقة");
      setOldReminders([]);
    } finally {
      setLoadingReminders(false);
    }
  };

  useEffect(() => {
    fetchOldReminders(currentPage);
  }, [currentPage]);

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
    
    console.log("Form submitted:", formattedData);
    const response = await DoTransaction("2dGct9IfGTg/fXhktm/Huw==", 
      `0#${userId}#${getCurrentFormattedDateTime()}#${formattedData.datetime}#${formattedData.text}#${formattedData.notificationType}`
    );
    
    if(response.success == 200){
      toast.success("تم إنشاء التذكير بنجاح");
      // Reset form
      setFormData({
        text: '',
        date: '',
        time: '',
        notificationType: 'N'
      });
      // Refresh old reminders list
      fetchOldReminders(currentPage);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get notification type icon and label
  const getNotificationTypeInfo = (type) => {
    switch(type) {
      case 'N':
        return { icon: <Bell className="w-4 h-4" />, label: 'إشعار', color: 'bg-blue-100 text-blue-600' };
      case 'S':
        return { icon: <MessageSquare className="w-4 h-4" />, label: 'رسالة SMS', color: 'bg-green-100 text-green-600' };
      case 'W':
        return { icon: <Phone className="w-4 h-4" />, label: 'واتساب', color: 'bg-green-100 text-green-600' };
      default:
        return { icon: <Bell className="w-4 h-4" />, label: 'إشعار', color: 'bg-blue-100 text-blue-600' };
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">التذكيرات</h1>
          <p className="text-gray-600">أنشئ تذكيرات جديدة واستعرض التذكيرات السابقة</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Create New Reminder */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white rounded-2xl shadow-xl overflow-hidden h-fit"
          >
            <div className="px-6 py-8">
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-bold text-center text-gray-800 mb-6"
              >
                إنشاء تذكير جديد
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
                      { label: "إشعار", value: "N" },
                      { label: "رسالة SMS", value: "S" },
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
                    إنشاء التذكير
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Old Reminders */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-8">
              <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">التذكيرات السابقة</h2>
                <div className="text-sm text-gray-500">
                  إجمالي: {totalRemindersCount} تذكير
                </div>
              </motion.div>

              {loadingReminders ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18383D] mx-auto"></div>
                  <p className="mt-4 text-gray-600">جاري تحميل التذكيرات...</p>
                </div>
              ) : oldReminders.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد تذكيرات سابقة</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {oldReminders.map((reminder) => {
                      const typeInfo = getNotificationTypeInfo(reminder.SendType);
                      
                      return (
                        <motion.div
                          key={reminder.Id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <div className={`${typeInfo.color} p-2 rounded-full`}>
                                {typeInfo.icon}
                              </div>
                              <span className="text-sm font-medium">{typeInfo.label}</span>
                            </div>
                            {/* <button
                              onClick={() => handleDeleteReminder(reminder.Id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                              title="حذف التذكير"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button> */}
                          </div>
                          
                          <p className="text-gray-800 mb-3 text-right">{reminder.SendMessage}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>أنشئ في: {formatDateForDisplay(reminder.CreateDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>موعد الإرسال: {formatDateForDisplay(reminder.SendDate)}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      variants={itemVariants}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          الصفحة {currentPage} من {totalPages}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg border ${
                              currentPage === 1
                                ? 'opacity-50 cursor-not-allowed text-gray-400'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg ${
                                  currentPage === pageNum
                                    ? 'bg-[#18383D] text-white'
                                    : 'border hover:bg-gray-50 text-gray-700'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg border ${
                              currentPage === totalPages
                                ? 'opacity-50 cursor-not-allowed text-gray-400'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Remember;