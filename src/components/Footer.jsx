import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';

import logoImage from '../../public/LogoWhite.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer 
      className="text-white py-12 px-6"
      style={{
        background: "linear-gradient(135deg, #24645E 0%, #18383D 50%, #17343B 100%)"
      }}
    >
      <div className=" mx-auto">
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
            <h3 className="text-lg font-semibold mb-4">شروط وأحكام</h3>
          </div>


          {/* Contact Section */}
          <div className='col-span-2'>
            <h3 className="text-lg font-semibold mb-4">اتصال</h3>
            <div className="space-y-2 text-sm">
              <p>(+218) 092-093-1112</p>
              <p>wasl@example.com</p>
            </div>
          </div>

          
          {/* Company Section */}
          <div className='col-span-2'>
            <h3 className="text-lg font-semibold mb-4">الشركة</h3>
            <div className="flex flex-col gap-2 text-sm">
              <p>الرئيسية</p>
              <Link to={"/about-us"}>معلومات عنا</Link>
              <Link to={"/contact"}>اتصل بنا</Link>
            </div>
          </div>
          
          <div className='col-span-2'>
            <h3 className="text-lg font-semibold mb-4">الموقع</h3>
                <p>طرابلس , ليبيا</p>
          </div>

          
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-8 mb-6">
          <div className="w-10 h-10 ml-4 bg-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <Twitter size={20} color='#383638'/>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <Mail size={20} color='#383638'/>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <Linkedin size={20} color='#383638'/>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <Instagram size={20} color='#383638'/>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <Facebook size={20} color='#383638'/>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-4">
          <p className="text-center text-sm opacity-80">
            جميع الحقوق محفوظة لمنصة وصـــل © 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;