import React from "react";
import Diamond from "../../../components/Diamond";
import NewsCard from "../../../components/NewsCard";
import PropTypes from "prop-types";

const LastNews = ({ data }) => {
  const news = JSON.parse(data);

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* header */}
      <div className="flex items-center justify-between pl-12">
        <div className="relative bg-gradient-to-l from-[rgb(23,52,59)] via-[#18383D] to-[#24645E] rounded-tl-xl rounded-bl-3xl text-white text-2xl px-8 py-2">
          <Diamond className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-1/4" />
          آخر الأخبار
        </div>

        <span className="text-xl text-[#16343A] cursor-pointer">المزيد</span>
      </div>

      {/* news cards */}
      <div className="relative md:px-8">
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide pr-8">
          {news.map((item) => (
            <NewsCard
              key={item.Id}
              image={`https://framework.md-license.com:8093/ZakatImages/${item.NewsMainPhotoName}.jpg`}
              title={item.NewsMainTitle}
              descirption={item.NewsSubTitle}
              className="flex-shrink-0 w-[320px]"
            />
          ))}

          {/* shadow overlay */}
          <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-[1000] pointer-events-none md:left-8"></div>
        </div>
      </div>
    </div>
  );
};

export default LastNews;

LastNews.propTypes = {
  data: PropTypes.any,
};
