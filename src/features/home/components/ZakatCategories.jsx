import React from "react";

const ZakatCategories = () => {
  const handleDonateClick = (category) => {
    console.log(`تبرع الآن clicked for ${category}`);
  };

  const categories = [
    {
      id: 1,
      title: "أخرج زكاتك",
      icon: "💰", // You can replace with actual images
      bgColor: "bg-gray-200",
    },
    {
      id: 2,
      title: "الكفارات والنذور",

      icon: "💰",
      bgColor: "bg-gray-200",
    },
    {
      id: 3,
      title: "الصدقات",
      icon: "⚖️",
      bgColor: "bg-gray-200",
    },
    {
      id: 4,
      title: "المشاريع",
      icon: "💰",
      bgColor: "bg-gray-200",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Quranic Verse */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-800 text-center leading-relaxed font-arabic"
            dir="rtl"
            style={{
              fontFamily:
                "'Amiri', 'Scheherazade New', 'Arabic Typesetting', serif",
            }}
          >
            ﴿ لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ ﴾
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center transform rotate-45 shadow-lg">
                  <div className="transform -rotate-45">
                    {/* Placeholder for coin stack image */}
                    <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-6" dir="rtl">
                {category.title}
              </h3>

              {/* Donate Button */}
              <button
                onClick={() => handleDonateClick(category.title)}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
                dir="rtl"
              >
                تبرع الآن
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZakatCategories;
