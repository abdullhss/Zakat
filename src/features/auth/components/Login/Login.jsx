/* eslint-disable react/prop-types */
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import FloatingDonationButton from "../../../../globalComponents/FloatingDonationButton";

// Validation schema using Zod
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^[0-9+\-\s()]+$/, "رقم الهاتف غير صالح"),
});

/**
 * Login component with phone number authentication
 */
const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  /**
   * Handle form submission for login
   */
  const onSubmit = async (data) => {
    try {
      console.log("Login data:", data);
      // TODO: Dispatch login action
      // dispatch(loginUser(data));
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  /**
   * Navigate to registration page
   */
  const handleCreateAccount = () => {
    navigate("/register");
  };

  /**
   * Navigate to visitor browsing
   */
  const handleBrowseAsVisitor = () => {
    navigate("/");
  };

  return (
    <>
      {/* Floating Donation Button */}
      <FloatingDonationButton />

      <div className="min-h-screen flex flex-col lg:flex-row" dir="rtl">
        {/* Right Side - Decorative Background */}
        <img
          src={"/src/assets/Desktop/Login/Frame 2147223937.png"}
          className="md:w-1/2 "
          alt=""
        />

        {/* Left Side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white order-2 lg:order-2">
          <div className="w-full max-w-lg lg:max-w-xl">
            {/* Logo */}
            <div className="text-center mb-8 lg:mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-6 lg:mb-8 relative shadow-lg">
                <span className="text-2xl lg:text-3xl font-bold text-white">
                  وصل
                </span>
                <div className="absolute -bottom-2 lg:-bottom-3 bg-white text-emerald-700 px-3 lg:px-4 py-1 lg:py-2 rounded-full text-sm lg:text-base font-medium shadow-md">
                  الليبية
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div className="text-center mb-8 lg:mb-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
                تسجيل الدخول
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                مرحباً بعودتك! قم بتسجيل الدخول إلى حسابك
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 lg:space-y-8"
            >
              {/* Phone Number Input */}
              <div>
                <label className="block text-base lg:text-lg font-medium text-gray-700 mb-3">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    placeholder="رجاء إدخال رقم الهاتف"
                    className={`w-full px-6 py-4 lg:py-5 pl-14 border rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-500 outline-none transition-all text-right text-lg lg:text-xl ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-gray-400 h-6 w-6"
                    />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <p className="mt-2 text-base text-red-600 text-right">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-800 text-white py-4 lg:py-5 rounded-lg hover:bg-emerald-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg lg:text-xl"
              >
                {isSubmitting ? "جاري التسجيل..." : "تسجيل الدخول"}
              </button>

              {/* Browse as Visitor */}
              <button
                type="button"
                onClick={handleBrowseAsVisitor}
                className="w-full border border-gray-300 text-gray-700 py-4 lg:py-5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg lg:text-xl"
              >
                تصفح للضيف كزائر
              </button>

              {/* Create Account Link */}
              <div className="text-center">
                <span className="text-gray-600 text-base lg:text-lg">
                  ليس لديك حساب؟
                </span>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="text-emerald-800 hover:text-emerald-800 font-medium transition-colors text-base lg:text-lg"
                >
                  إنشاء حساب
                </button>
              </div>
            </form>

            {/* Quranic Verse */}
            <div className="mt-8 lg:mt-12 text-center overflow-hidden">
              <p className="text-xl lg:text-2xl text-gray-700 font-quran leading-relaxed whitespace-nowrap">
                ﴿ لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ ﴾
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
