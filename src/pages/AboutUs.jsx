import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { executeProcedure } from '../services/apiServices';

const AboutUs = () => {
  const [aboutUsParagraph, setAboutUsParagraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await executeProcedure("Ey//Th+MOGZq8DGxl+GABA==", "0");
        setAboutUsParagraph(JSON.parse(response.decrypted.ProgramData)[0].AboutUs);
        setError(null);
      } catch (error) {
        console.error("Error fetching about us data:", error);
        setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
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

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 sm:px-12 py-20 flex flex-col"
    style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
          >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold mb-8 text-emerald-700 text-center"
      >
        من نحن
      </motion.h1>

      <div className="max-w-4xl mx-auto">
        {aboutUsParagraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="leading-relaxed text-gray-700 text-lg text-justify"
          >
            {aboutUsParagraph.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;