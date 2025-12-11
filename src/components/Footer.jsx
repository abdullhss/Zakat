import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import logoImage from '../../public/LogoWhite.png';
import { Link } from 'react-router-dom';
import { executeProcedure } from '../services/apiServices';

const Footer = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
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

          {/* Terms Section */}
          <div className='col-span-2'>
            <Link to={'/tos'} className="text-lg font-semibold mb-4">شروط وأحكام</Link>
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
            </div>
          </div>

          {/* Company Section */}
          <div className='col-span-2'>
            <h3 className="text-lg font-semibold mb-4">الشركة</h3>
            <div className="flex flex-col gap-2 text-sm">
              <p onClick={()=>{window.location.href="/"}} className='cursor-pointer'>الرئيسية</p>
              <Link to={"/about-us"}>معلومات عنا</Link>
              <Link to={"/contact"}>اتصل بنا</Link>
            </div>
          </div>

          {/* Location Section */}
          <div className='col-span-2'>
            <h3 className="text-lg font-semibold mb-4">الموقع</h3>
            <p>{contactData?.Address ?? "جاري التحميل..."}</p>
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
  );
};

export default Footer;
