import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { executeProcedure } from '../services/apiServices';
import { MapPin, Phone, Globe, Instagram, Facebook } from 'lucide-react';

const ContactUs = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <p className="text-xl animate-pulse">جارٍ التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <p className="text-xl">لا توجد بيانات متاحة</p>
      </div>
    );
  }
  const normalizeUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (url.startsWith("www.")) {
      return "https://" + url;
    }

    return "https://" + url;
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 sm:px-12 py-20 flex flex-col">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold mb-12 text-emerald-700 text-center"
      >
        تواصل معنا
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto w-full space-y-8"
      >
        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <MapPin className="text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="block text-emerald-700 mb-2 text-lg">العنوان:</strong>
            <p className="text-gray-700 text-base">{contactData.Address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Phone className="text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="block text-emerald-700 mb-2 text-lg">رقم الهاتف:</strong>
            <p className="text-gray-700 text-base">{contactData.PhoneNum}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Globe className="text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="block text-emerald-700 mb-2 text-lg">الموقع الإلكتروني:</strong>
            <a
              href={`https://${contactData.WebSite}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-500 underline text-base"
            >
              {contactData.WebSite}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Instagram className="text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="block text-emerald-700 mb-2 text-lg">إنستغرام:</strong>
            <a
              href={normalizeUrl(contactData.Instegram)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-500 underline text-base"
            >
              {contactData.Instegram}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Facebook className="text-emerald-600 mt-1 flex-shrink-0" />
          <div>
            <strong className="block text-emerald-700 mb-2 text-lg">فيسبوك:</strong>
            <a
              href={normalizeUrl(contactData.FaceBook)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-500 underline text-base"
            >
              {contactData.FaceBook}
            </a>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;