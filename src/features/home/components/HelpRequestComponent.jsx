import React from "react";
const HelpRequestComponent = () => {
  const handleRequestHelpClick = () => {
    console.log("اطلب الآن clicked - help request submitted");
  };

  return (
    <section className="relative bg-gray-100 py-12 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-right pl-8">
            <div className="flex items-center justify-start mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center ml-4">
                <svg
                  className="w-6 h-6 text-teal-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-800">طالب الإعانة</h2>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              يمكنك الآن طلب إعانة وسيتوفر لك المنصة احتياجاتك
            </p>

            <button
              onClick={handleRequestHelpClick}
              className="bg-teal-700 hover:bg-teal-800 text-white px-12 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center"
            >
              <span className="ml-2">اطلب الآن</span>
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">وصل</span>
              </div>
            </button>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full max-w-md ml-auto">
              <div className="relative bg-gradient-to-br from-green-400 to-teal-500 rounded-l-full p-8">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center relative">
                      <div className="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-amber-800 rounded-full relative">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-6 bg-green-500 rounded-t-full"></div>
                            <div className="absolute -left-1 -top-1 w-2 h-4 bg-green-400 rounded-full transform -rotate-12"></div>
                            <div className="absolute -right-1 -top-1 w-2 h-4 bg-green-400 rounded-full transform rotate-12"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center relative">
                      <div className="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-amber-800 rounded-full relative">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-3 h-6 bg-green-500 rounded-t-full"></div>
                            <div className="absolute -left-1 -top-1 w-2 h-4 bg-green-400 rounded-full transform -rotate-12"></div>
                            <div className="absolute -right-1 -top-1 w-2 h-4 bg-green-400 rounded-full transform rotate-12"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpRequestComponent;
