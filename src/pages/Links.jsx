import React, { useEffect, useState } from 'react';
import { Mail, MessageCircle, Facebook } from 'lucide-react';
import { executeProcedure } from '../services/apiServices';


const Links = () => {
  const [sendLinksData, setSendLinksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = 0;
        const response = await executeProcedure("OO3XeYpFBsqxbb+QF28oAgRhMWm0v45l2VSVL04Km+k=", `${userID || 0}`);
        setSendLinksData(JSON.parse(response.decrypted.SendLinksData));
      } catch (error) {
        console.error('Error fetching links:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleWhatsAppClick = (link) => {
    if (link.includes('wa.me') || link.includes('whatsapp.com')) {
      window.open(link, '_blank');
    } else {
      const phoneNumber = link.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  };

  const handleFacebookClick = (link) => {
    const url = link.startsWith('http') ? link : `https://${link}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          روابط التواصل
        </h1>

        {sendLinksData.map((contact) => (
          <div key={contact.Id} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="space-y-4">
              {/* Email */}
              <button
                onClick={() => handleEmailClick(contact.EmailAddress)}
                className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors"
                style={{ backgroundColor: '#E8F5F3' }}
              >
                <div className="p-3 rounded-full" style={{ backgroundColor: '#24645E' }}>
                  <Mail size={24} className="text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-lg" style={{ color: '#17343B' }}>
                    البريد الإلكتروني
                  </h3>
                  <p className="text-sm text-gray-600">{contact.EmailAddress}</p>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleWhatsAppClick(contact.WhatsupLink)}
                className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors"
                style={{ backgroundColor: '#E8F5F3' }}
              >
                <div className="p-3 rounded-full" style={{ backgroundColor: '#18383D' }}>
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-lg" style={{ color: '#17343B' }}>
                    واتساب
                  </h3>
                  <p className="text-sm text-gray-600">ابدأ محادثة</p>
                </div>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleFacebookClick(contact.FacebookLink)}
                className="w-full flex items-center gap-4 p-4 rounded-lg transition-colors"
                style={{ backgroundColor: '#E8F5F3' }}
              >
                <div className="p-3 rounded-full" style={{ backgroundColor: '#17343B' }}>
                  <Facebook size={24} className="text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold text-lg" style={{ color: '#17343B' }}>
                    فيسبوك
                  </h3>
                  <p className="text-sm text-gray-600">زيارة الصفحة</p>
                </div>
              </button>
            </div>
          </div>
        ))}

        {sendLinksData.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد روابط متاحة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;