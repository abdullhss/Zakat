/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faIdCard, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import FloatingDonationButton from "../globalComponents/FloatingDonationButton";
import aya from "../public/SVGs/Aya.svg";
import logo from "../../public/Logo.png";
import { executeProcedure, RequireAuthentication } from "../services/apiServices";
import { toast } from "react-toastify";

// Validation schema using Zod
const signupSchema = z.object({
  name: z
    .string()
    .min(1, "الاسم مطلوب")
    .min(2, "الاسم يجب أن يكون على الأقل حرفين"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[0-9]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط")
    .min(10, "رقم الهاتف يجب أن يكون على الأقل 10 أرقام"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صالح"),
  nationalId: z
    .string()
    .min(1, "الرقم الوطني مطلوب")
    .min(10, "الرقم الوطني يجب أن يكون على الأقل 10 أرقام"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z
    .string()
    .min(1, "تأكيد كلمة المرور مطلوب")
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

/**
 * Signup component with multiple fields for user registration
 */
const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      nationalId: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Handle form submission for signup
   */
  const onSubmit = async (data) => {
    try {
        const response = await RequireAuthentication("8d8VWC1xFIjp4ztA3Mny/g==","x9FJkPguBjCejvcgGD0tLw==",`${data.name}#${data.email}#${data.phone}#${data.nationalId}#${data.password}`,"Sms",data.phone)
        localStorage.setItem("TransToken",response.TransToken)
        console.log(response);
        
        if(response.success == 200){
            navigate("/otp")
            toast.success("تم ارسال ال OTP بنجاح")
        }
        else{
            console.log(response);
            toast.error(response.error)
        }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    }
  };

  const handleBrowseAsVisitor = () => {
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  return (
    <>
      {/* Floating Donation Button */}
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

        {/* Left Side - Signup Form */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-white"
          variants={containerVariants}
        >
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-4xl">
            {/* Logo */}
            <motion.div variants={itemVariants}>
              <img
                src={logo}
                alt="Logo"
                className="h-24 sm:h-28 mb-6 mx-auto"
              />
            </motion.div>

            {/* Signup Form Header */}
            <motion.div 
              className="text-center mb-6 sm:mb-8 lg:mb-10"
              variants={itemVariants}
            >
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                إنشاء حساب جديد
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                انضم إلينا! قم بإنشاء حساب جديد
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6 lg:space-y-8"
              variants={containerVariants}
            >
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Name Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                    الاسم <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="رجاء إدخال الاسم الكامل"
                      className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-400 h-4 w-4 py-3sm:h-5 sm:w-5"
                      />
                    </div>
                  </div>
                  {errors.name && (
                    <motion.p 
                      className="mt-1 sm:mt-2 text-xs sm:text-base text-red-600 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Phone Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="رجاء إدخال رقم الهاتف"
                      className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-gray-400 h-4 w-4 py-3sm:h-5 sm:w-5"
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <motion.p 
                      className="mt-1 sm:mt-2 text-xs sm:text-base text-red-600 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.phone.message}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Row 2: Email and National ID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Email Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="رجاء إدخال البريد الإلكتروني"
                      className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-gray-400 h-4 w-4 py-3sm:h-5 sm:w-5"
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <motion.p 
                      className="mt-1 sm:mt-2 text-xs sm:text-base text-red-600 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* National ID Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                    الرقم الوطني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("nationalId")}
                      type="text"
                      placeholder="رجاء إدخال الرقم الوطني"
                      className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base ${
                        errors.nationalId ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                      <FontAwesomeIcon
                        icon={faIdCard}
                        className="text-gray-400 h-4 w-4 py-3sm:h-5 sm:w-5"
                      />
                    </div>
                  </div>
                  {errors.nationalId && (
                    <motion.p 
                      className="mt-1 sm:mt-2 text-xs sm:text-base text-red-600 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.nationalId.message}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Row 3: Password and Confirm Password */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Password Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="رجاء إدخال كلمة المرور"
                      className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      className="mt-1 sm:mt-2 text-xs sm:text-base text-red-600 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="رجاء إعادة إدخال كلمة المرور"
                      className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p 
                      className="mt-1 sm:mt-2 text-xs sm:text-base text-red-600 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                variants={buttonVariants}
                whileTap="tap"
                whileHover="hover"
                style={{ background: "linear-gradient(90deg, #24645E -23.06%, #18383D 53.78%, #17343B 60.46%)"}}
                className="w-full text-white py-3 rounded-lg hover:bg-emerald-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg lg:text-xl"
              >
                {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
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
            </motion.form>

            {/* Already have an account? */}
            <motion.div 
              className="text-center mt-6"
              variants={itemVariants}
            >
              <p className="text-gray-600">
                لديك حساب بالفعل؟{" "}
                <button 
                  onClick={() => navigate("/login")}
                  className="text-[#17343B] font-medium"
                >
                  تسجيل الدخول
                </button>
              </p>
            </motion.div>

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

export default Signup;