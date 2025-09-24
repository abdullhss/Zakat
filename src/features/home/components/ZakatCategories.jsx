import React from "react";
import Diamond from "../../../components/Diamond";
import coins from "../../../../public/coins.webp"
const ZakatCategories = () => {
  const handleDonateClick = (category) => {
    console.log(`تبرع الآن clicked for ${category}`);
  };

  const categories = [
    {
      id: 1,
      title: "أخرج زكاتك",
      bgColor: "bg-gray-200",
    },
    {
      id: 2,
      title: "الكفارات والنذور",
      bgColor: "bg-gray-200",
    },
    {
      id: 3,
      title: "الصدقات",
      bgColor: "bg-gray-200",
    },
    {
      id: 4,
      title: "المشاريع",
      bgColor: "bg-gray-200",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="flex flex-col gap-12 items-center">
        {/* Quranic Verse */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-semibold text-[#16343A text-center leading-relaxed font-arabic"
            dir="rtl"
            style={{
              fontFamily:
                "'Amiri', 'Scheherazade New', 'Arabic Typesetting', serif",
            }}
          >
            ﴿ لَنْ تَنَالُوا الْبِرَّ حَتَّى تُنْفِقُوا مِمَّا تُحِبُّونَ ﴾
          </h2>
        </div>

        {/* Categories Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative bg-gradient-to-r from-[#ffffff] to-[#CBCBCB] rounded-2xl shadow-lg p-6 text-center"
            >
              {/* Icon Container */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Diamond width={80} height={80} imgUrl={coins} />
              </div>

              {/* Category Title */}
              <h3
                className="text-xl font-bold text-gray-800 mb-4 pt-10"
                dir="rtl"
              >
                {category.title}
              </h3>

              {/* Donate Button */}
              <button
                onClick={() => handleDonateClick(category.title)}
                className="w-full bg-gradient-to-r from-[#24645E] via-[#18383D] to-[#17343B] border-b-4 border-[#8E6D4C] text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
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
