/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import FloatingDonationButton from "../../../../globalComponents/FloatingDonationButton";
import aya from "../../../../public/SVGs/Aya.svg";
import logo from "../../../../../public/Logo.png";
import { executeProcedure } from "../../../../services/apiServices";
import { t } from "i18next";
import { toast } from "react-toastify";
import {setCartData} from "../../../CartSlice/CartSlice";

// Validation schema using Zod
const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[0-9]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط")
    .min(10, "رقم الهاتف يجب أن يكون على الأقل 10 أرقام"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف"),
});

/**
 * Login component with phone number and password authentication
 */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  /**
   * Handle form submission for login
   */
  const onSubmit = async (data) => {
    try {
      
      
      
      const response = await executeProcedure("5GbDgnFHgSnsKHp60G95ngKtX9A5Wkofyq68u6hXJGg=",`${data.phone}#${data.password}#$????`)
      
      if(response.decrypted){
        localStorage.setItem("UserData",JSON.stringify(response.decrypted))
        console.log(response.decrypted);
        
        const handleFetchCartData =   async () => {
            const data = await executeProcedure(
              "ErZm8y9oKKuQnK5LmJafNAUcnH+bSFupYyw5NcrCUJ0=",
              response.decrypted.Id
            );
            dispatch(setCartData(data.decrypted));
          } 
          handleFetchCartData()
      }
      toast.success(`مرحبا ${response.decrypted.UserName}`);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("خطأ في رقم الهاتف او كلمة المرور")
    }
  };
  const handleBrowseAsVisitor = () => {
    navigate("/");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

        {/* Left Side - Login Form */}
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

            {/* Login Form */}
            <motion.div 
              className="text-center mb-6 sm:mb-8 lg:mb-10"
              variants={itemVariants}
            >
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                تسجيل الدخول
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                مرحباً بعودتك! قم بتسجيل الدخول إلى حسابك
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6 lg:space-y-8"
              variants={containerVariants}
            >
              {/* Phone Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2 sm:mb-3">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("phone", {
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "يُسمح بإدخال الأرقام فقط",
                      },
                    })}
                    type="tel"
                    placeholder="رجاء إدخال رقم الهاتف"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base sm:text-lg lg:text-xl ${
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
                    className={`w-full px-4 sm:px-6 py-3 pl-12 sm:pl-14 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-base sm:text-lg lg:text-xl ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                    {/* <FontAwesomeIcon
                      icon={faPhone}
                      className="text-gray-400 h-4 w-4 sm:h-5 sm:w-5"
                    /> */}
                  </div>
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

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                variants={buttonVariants}
                whileTap="tap"
                whileHover="hover"
                style={{ background: "linear-gradient(90deg, #24645E -23.06%, #18383D 53.78%, #17343B 60.46%)"}}
                className="w-full  text-white py-3 rounded-lg hover:bg-emerald-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg lg:text-xl"
              >
                {isSubmitting ? "جاري التسجيل..." : "تسجيل الدخول"}
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
            <div className="w-full flex items-center justify-center mt-6 font-medium text-lg">
              <span className="text-[#6E6E6E] font-normal" >ليس لديك حساب ؟ </span>
              <Link className="text-[#17343B] mx-2" to={"/signup"}> انشاء حساب </Link>
            </div>
            <div className="w-full flex items-center justify-center mt-2 font-medium text-lg">
              <Link className="text-[#17343B] mx-2" to={"/ForgetPassword"}> نسيت كلمة السر ؟ </Link>
            </div>
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

export default Login;