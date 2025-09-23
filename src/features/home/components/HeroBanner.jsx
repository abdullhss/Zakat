import styles from "./HeroBanner.module.css";
const HeroBanner = () => {
  const handleCreateCampaignClick = () => {
    console.log("clicked افتراح انشاء حملة");
  };

  return (
    <section
      className={`${styles.heroBg} bg-red-200  relative w-full h-[300px] overflow-hidden`}
    >
      {/* Content Container */}
      <div
        className={` relative w-full z-10 flex items-center justify-between h-full px-8 lg:px-16`}
      >
        {/* Left Side - Text Content */}
        <div className="text-white text-right flex-1">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            كن ساعياً للخير
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            عبر برامج الحملات
          </p>

          <button
            onClick={handleCreateCampaignClick}
            className="bg-amber-600 hover:bg-amber-500 text-white px-16 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            اقتراح أنشاء حملة
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
