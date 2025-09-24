import styles from "./HeroBanner.module.css";
import union from "../../../../public/Union.png";
import sadaka from "../../../../public/sadaka.png";

const HeroBanner = () => {
  const handleCreateCampaignClick = () => {
    console.log("clicked افتراح انشاء حملة");
  };

  return (
    <section
      className={`${styles.heroBg} bg-[#18383D] relative w-full h-[400px] overflow-hidden`}
      style={{
        backgroundImage: `url(${sadaka})`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Content Container */}
      <div className="relative w-full z-50 flex items-center justify-between h-full px-8 lg:px-24">
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
            className="bg-gradient-to-t from-[#A47B53] to-[#DBAD81] text-white px-16 py-4 rounded-xl text-lg font-semibold shadow-lg"
          >
            اقتراح أنشاء حملة
          </button>
        </div>
      </div>

      {/* Right Decoration */}
      <div
        className="absolute top-0 right-0 w-1/6 h-full z-10"
        style={{
          backgroundImage: `url(${union.src})`,
          backgroundRepeat: "repeat",
          transform: "rotate(180deg)",
          backgroundSize: "auto",
        }}
      ></div>

      {/* Left Decoration */}
      <div
        className="absolute top-0 left-0 w-1/6 h-full z-10"
        style={{
          backgroundImage: `url(${union.src})`,
          backgroundRepeat: "repeat",
          transform: "rotate(180deg)",
          backgroundSize: "auto",
        }}
      ></div>
    </section>
  );
};

export default HeroBanner;
