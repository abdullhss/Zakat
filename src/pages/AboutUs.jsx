import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { executeProcedure } from '../services/apiServices';
import { MapPin, Phone, Globe, Instagram, Facebook } from 'lucide-react';

const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState(null);
  const [aboutUsParagraph, setAboutUsParagraph] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure("igF/cbQ6FNWc0XAZ8gncLw==", "0");
        setAboutUsData(JSON.parse(response.decrypted.AboutUsData)[0]);

        const response2 = await executeProcedure("Ey//Th+MOGZq8DGxl+GABA==", "0");
        setAboutUsParagraph(JSON.parse(response2.decrypted.ProgramData)[0].AboutUs);
      } catch (error) {
        console.error("Error fetching about us data:", error);
      }
    };
    fetchData();
  }, []);

  if (!aboutUsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <p className="text-xl animate-pulse">جارٍ التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 sm:px-12 py-20 flex flex-col">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold mb-8 text-emerald-700"
      >
        من نحن
      </motion.h1>

      {aboutUsParagraph && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl leading-relaxed text-gray-700 mb-12 text-lg"
        >
          {aboutUsParagraph}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-6 w-full max-w-2xl"
      >
        <div className="flex items-center  gap-3 border-b border-gray-200 pb-3">
          <MapPin className="text-emerald-600" />
          <div>
            <strong className="block text-emerald-700 mb-1">العنوان:</strong>
            <p className="text-gray-700">{aboutUsData.Address}</p>
          </div>
        </div>

        <div className="flex items-center  gap-3 border-b border-gray-200 pb-3">
          <Phone className="text-emerald-600" />
          <div>
            <strong className="block text-emerald-700 mb-1">رقم الهاتف:</strong>
            <p className="text-gray-700">{aboutUsData.PhoneNum}</p>
          </div>
        </div>

        <div className="flex items-center  gap-3 border-b border-gray-200 pb-3">
            <Globe className="text-emerald-600" />
          <div>
            <strong className="block text-emerald-700 mb-1">الموقع الإلكتروني:</strong>
            <a
              href={`https://${aboutUsData.WebSite}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-500 underline"
            >
              {aboutUsData.WebSite}
            </a>
          </div>
        </div>

        <div className="flex items-center  gap-3 border-b border-gray-200 pb-3">
          <Instagram className="text-emerald-600" />
          <div>
            <strong className="block text-emerald-700 mb-1">إنستغرام:</strong>
            <p className="text-gray-700">{aboutUsData.Instegram}</p>
          </div>
        </div>

        <div className="flex items-center  gap-3">
          <Facebook className="text-emerald-600" />
          <div>
            <strong className="block text-emerald-700 mb-1">فيسبوك:</strong>
            <p className="text-gray-700">{aboutUsData.FaceBook}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
