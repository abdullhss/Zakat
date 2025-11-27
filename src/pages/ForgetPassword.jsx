/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import FloatingDonationButton from "../globalComponents/FloatingDonationButton";
import logo from "../../public/Logo.png";
import { RequireAuthentication } from "../services/apiServices";
import { toast } from "react-toastify";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Validation schema
const forgetSchema = z.object({
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^09[0-9]{8}$/, "رقم الهاتف يجب أن يبدأ بـ 09 ويحتوي على 10 أرقام"),

  newPassword: z
    .string()
    .min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),

  confirmNewPassword: z
    .string()
    .min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmNewPassword"],
});


const ForgetPassword = () => {
    const navigate = useNavigate();
    const [phoneValue, setPhoneValue] = useState("09");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(forgetSchema),
    defaultValues: {
      phone: "09",
    },
  });

  // Handle phone input changes
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // Force start with "09"
    if (!value.startsWith("09")) {
      value = "09" + value.replace(/^09/, "");
    }

    // Limit to 10 digits
    if (value.length > 10) value = value.slice(0, 10);

    setPhoneValue(value);
    setValue("phone", value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const response = await RequireAuthentication(
        "c4g0C1LxwdwfxiX+rwPds32cuYWKXGP/njUZnZDIl5o=",
        "s5H0wR0G187hrsrvlq3cTeyLUL/K1Bjo5Mi6giB2b20=",
        `${data.phone}#${data.newPassword}`,
        "Sms",
        data.phone
      );
      console.log(`${data.phone}#${data.newPassword}`);
      console.log(response);
      
      if (response.success == 200) {
        localStorage.setItem("TransToken", response.TransToken);
        toast.success("تم إرسال رمز التحقق بنجاح");
        navigate("/otp");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال رمز الاستعادة");
      console.error(error);
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
        {/* Right side image */}
        <motion.div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/loginpage.png')" }}
          variants={itemVariants}
        />

        {/* Left content (form) */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-white"
          variants={containerVariants}
        >
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-4xl">
            {/* Logo */}
            <motion.div variants={itemVariants}>
              <img src={logo} alt="Logo" className="h-24 sm:h-28 mb-6 mx-auto" />
            </motion.div>

            {/* Header */}
            <motion.div
              className="text-center mb-6 sm:mb-8 lg:mb-10"
              variants={itemVariants}
            >
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
                استعادة كلمة المرور
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                أدخل رقم هاتفك لإرسال رمز التحقق
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              variants={containerVariants}
            >
            {/* Phone */}
            <motion.div variants={itemVariants}>
            <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                رقم الهاتف <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                {...register("phone")}
                value={phoneValue}
                onChange={handlePhoneChange}
                type="tel"
                inputMode="numeric"
                placeholder="09xxxxxxxx"
                className={`w-full px-4 sm:px-6 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none text-right text-base ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon
                    icon={faPhone}
                    className="text-gray-400 h-5 w-5"
                />
                </div>
            </div>

            {errors.phone && (
                <motion.p
                className="mt-2 text-sm text-red-600 text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                >
                {errors.phone.message}
                </motion.p>
            )}
            </motion.div>
            {/* New Password */}
            <motion.div variants={itemVariants}>
            <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                كلمة السر الجديدة <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                {...register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                placeholder="أدخل كلمة السر الجديدة"
                className={`w-full px-4 sm:px-6 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none text-right text-base ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                />

                <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                    className="w-5 h-5"
                />
                </button>
            </div>

            {errors.newPassword && (
                <motion.p className="text-red-600 text-sm mt-2">{errors.newPassword.message}</motion.p>
            )}
            </motion.div>
            {/* Confirm New Password */}
            <motion.div variants={itemVariants}>
                <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                    تأكيد كلمة السر الجديدة <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                    <input
                    {...register("confirmNewPassword")}
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="أعد إدخال كلمة السر الجديدة"
                    className={`w-full px-4 sm:px-6 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none text-right text-base ${
                        errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    />

                    <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                    <FontAwesomeIcon
                        icon={showConfirmNewPassword ? faEyeSlash : faEye}
                        className="w-5 h-5"
                    />
                    </button>
                </div>

                {errors.confirmNewPassword && (
                    <motion.p className="text-red-600 text-sm mt-2">{errors.confirmNewPassword.message}</motion.p>
                )}
            </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                style={{ background: "linear-gradient(90deg, #24645E -23.06%, #18383D 53.78%, #17343B 60.46%)"}}
                className="w-full  text-white py-3 rounded-lg hover:bg-emerald-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg lg:text-xl"
                variants={itemVariants}
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال رمز التحقق"}
              </motion.button>

              {/* Back to login */}
              <motion.p
                className="text-center mt-4 text-gray-600 cursor-pointer hover:text-emerald-700 transition"
                variants={itemVariants}
                onClick={() => navigate("/login")}
              >
                العودة إلى تسجيل الدخول
              </motion.p>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ForgetPassword;
