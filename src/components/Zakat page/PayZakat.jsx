import React, { useState } from "react";
import PropTypes from "prop-types";
import Diamond from "../Diamond";
import { Banknote, CalculatorIcon } from "lucide-react";

const PayZakat = ({ data }) => {
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedAid, setSelectedAid] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const offices = [
    { id: 1, name: "المكتب 1" },
    { id: 2, name: "المكتب 2" },
    { id: 3, name: "المكتب 3" },
  ];

  const aids = [
    { id: 1, name: "إعانة 1" },
    { id: 2, name: "إعانة 2" },
    { id: 3, name: "إعانة 3" },
  ];

  const categories = [
    "الفقراء",
    "المساكين",
    "العاملون عليها",
    "المؤلفة قلوبهم",
    "في الرقاب (لشراء الحرية)",
    "الغارمين (أصحاب الديون)",
    "في سبيل الله",
    "ابن السبيل (المسافرون المحتاجون)",
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Zakat header */}
      <div className="flex items-center justify-between pl-12 mt-28">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <Diamond className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4" />
          اخرج زكاتك
        </div>

        <span className="text-xl text-[#16343A] cursor-pointer">المزيد</span>
      </div>

      <div className="px-8 lg:px-24">
        {/* dropdowns */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block mb-2 text-gray-700 font-medium">
              المكاتب
            </label>
            <select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600  font-semibold"
            >
              <option className="bg-white text-black" value="">
                اختر مكتب
              </option>
              {offices.map((office) => (
                <option
                  key={office.id}
                  value={office.id}
                  className="bg-white text-black"
                >
                  {office.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-gray-700 font-medium">
              الإعانة
            </label>
            <select
              value={selectedAid}
              onChange={(e) => setSelectedAid(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600  font-semibold"
            >
              <option className="bg-white text-black" value="">
                اختر إعانة
              </option>
              {aids.map((aid) => (
                <option
                  key={aid.id}
                  value={aid.id}
                  className="bg-white text-black"
                >
                  {aid.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* radio buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <label
              key={index}
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 font-semibold ${
                selectedCategory === category
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-[#B7B7B7]"
              }`}
            >
              <input
                type="radio"
                name="zakatCategory"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-emerald-600 focus:ring-emerald-600"
              />
              {category}
            </label>
          ))}
        </div>

        <hr className="border border-[#B7B7B7] mt-10" />
        {/* zakat calac */}
        <div className="flex items-end gap-6 mt-6">
          <div className="flex flex-1 items-end justify-between p-2 gap-4 border border-[#B7B7B7] rounded-lg">
            <div className="flex items-start gap-2">
              <CalculatorIcon color="#000000" size={30}/>
              <div className="h-full w-full flex flex-col justify-between gap-4">
                <h3 className="text-[#16343A] font-bold text-xl">حاسبة الزكاة</h3>
                <span className="text-[#666666] font-medium">أداة ذكية لحساب الزكاة لأموالك وممتلكاتك بسهولة</span>
              </div>
            </div>
            <button className="px-4 py-2 h-fit bg-gradient-to-l from-[#17343B] via-[#18383D] to-[#24645E] text-white rounded-lg">
              احسب الآن
            </button>
          </div>
          <div className="flex flex-1 items-center gap-6 mt-6">
            <div className="relative w-full">
              <Banknote 
                color="#16343A" 
                className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5"
              />
              <input
                type="number"
                min={1}
                placeholder="رجاء إدخال مبلغ التبرع"
                className="w-full pl-10 pr-3 py-2 border-2 border-[#979797] bg-transparent rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-emerald-600
                          placeholder:font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PayZakat.propTypes = {
  data: PropTypes.any,
};

export default PayZakat;
