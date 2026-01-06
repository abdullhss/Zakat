/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Twitter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../../public/LogoWhite.png';
import { Link } from 'react-router-dom';
import { executeProcedure } from '../services/apiServices';
import { FaFacebook, FaInstagram } from "react-icons/fa"
const InfoModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="إغلاق"
            >
              <X className="text-gray-600 text-xl" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {content ? (
              <div className="prose prose-lg max-w-none text-gray-700 text-right">
                <div 
                  className="whitespace-pre-line leading-relaxed text-base sm:text-lg"
                  dir="rtl"
                >
                  {content}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">جاري تحميل المحتوى...</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Footer = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polices, setPolices] = useState(null);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await executeProcedure("igF/cbQ6FNWc0XAZ8gncLw==", "0");
        setContactData(JSON.parse(response.decrypted.AboutUsData)[0]);
        setError(null);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setError("فشل في تحميل بيانات الاتصال. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await executeProcedure("Ey//Th+MOGZq8DGxl+GABA==", "0");
        console.log(response.decrypted.ProgramData);
        
        setPolices(JSON.parse(response.decrypted.ProgramData));
        setError(null);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setError("فشل في تحميل بيانات الاتصال. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract policy data from the array
  const policyData = polices && polices[0] ? polices[0] : null;
  console.log(contactData);
  
  return (
    <>
      <footer 
        className="text-white py-12 px-6"
        style={{
          background: "linear-gradient(135deg, #24645E 0%, #18383D 50%, #17343B 100%)"
        }}
      >
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-center md:text-right mb-16">

            {/* Logo Section */}
            <div className="col-span-4 flex justify-center md:justify-start px-5">
              <img 
                src={logoImage} 
                alt="وصل البيئة" 
                className="object-contain"
              />
            </div>

            {/* Terms & Policies Section */}
            <div className='col-span-2'>
              <h3 className="text-lg font-semibold mb-4">الشروط والسياسات</h3>
              <div className="flex flex-col gap-2 text-sm">
                <button 
                  onClick={() => setIsConditionsModalOpen(true)}
                  className="hover:underline text-right"
                >
                  شروط الاستخدام
                </button>
                <button 
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="hover:underline text-right"
                >
                  سياسة الخصوصية
                </button>
              </div>
            </div>

            {/* Contact Section */}
            <div className='col-span-2'>
              <h3 className="text-lg font-semibold mb-4">اتصال</h3>
              <div className="space-y-2 text-sm">
                <p>{contactData?.PhoneNum ?? "جاري التحميل..."}</p>
                <p>
                  <a
                    href={contactData?.WebSite
                      ? contactData.WebSite.startsWith("http")
                        ? contactData.WebSite
                        : `https://${contactData.WebSite}`
                      : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-300"
                  >
                    {contactData?.WebSite ?? "جاري التحميل..."}
                  </a>
                </p>

                <div className='flex items-center gap-2'>
                  {/* فيسبوك */}
                  {contactData?.FaceBook && (
                    <a
                      href={contactData.FaceBook.startsWith("http")
                        ? contactData.FaceBook
                        : `https://${contactData.FaceBook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 hover:text-blue-600"
                    >
                      <FaFacebook size={18} />
                    </a>
                  )}

                  {/* انستجرام */}
                  {contactData?.Instegram && (
                    <a
                      href={contactData.Instegram.startsWith("http")
                        ? contactData.Instegram
                        : `https://${contactData.Instegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 hover:text-pink-500"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            {/* Company Section */}
            <div className='col-span-2'>
              <h3 className="text-lg font-semibold mb-4">الشركة</h3>
              <div className="flex flex-col gap-2 text-sm">
                <button 
                  onClick={() => { window.location.href = "/"; }}
                  className='cursor-pointer hover:underline text-right'
                >
                  الرئيسية
                </button>
                <Link to="/about-us" className="hover:underline">معلومات عنا</Link>
                <Link to="/contact" className="hover:underline">اتصل بنا</Link>
              </div>
            </div>

            {/* Location Section */}
            <div className='col-span-2'>
              <h3 className="text-lg font-semibold mb-4">الموقع</h3>
              <p className="text-sm">{contactData?.Address ?? "جاري التحميل..."}</p>
            </div>

          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-4">
            <p className="text-center text-sm opacity-80">
              جميع الحقوق محفوظة لمنصة وصـــل © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      {/* Conditions Modal */}
      <InfoModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        title="شروط الاستخدام"
        content={policyData?.UseConditions}
      />

      {/* Privacy Policy Modal */}
      <InfoModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="سياسة الخصوصية"
        content={policyData?.PrivacyPolicy}
      />
    </>
  );
};

export default Footer;