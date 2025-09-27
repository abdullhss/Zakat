import HeroBanner from "./HeroBanner";
import ZakatCategories from "./ZakatCategories";
import HelpRequestComponent from "./HelpRequestComponent";
import Donations from "./Donations";
import Librarys from "./Librarys";
import LastNews from "./LastNews";
import Services from "./Services";
import Charity from "./Charity";
import DownloadApp from "./DownloadApp";
import Footer from "../../../components/Footer";
import { executeProcedure } from "../../../services/apiServices";
import { useEffect, useState } from "react";
import FloatingDonationButton from "../../../globalComponents/FloatingDonationButton";

function Home() {
  const [mainScreenData, setMainScreenData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await executeProcedure(
          "I0uFFxOqnfWgAy1EbMHIi+epTgwWrmYV51/bDxo0U0s=",
          "0"
        );
        setMainScreenData(response);
        console.log(response.decrypted);
        
      } catch (error) {
        console.error("Error fetching main screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#24645E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section>
      <HeroBanner data={mainScreenData?.heroBanner} />
      <div className="relative overflow-hidden">
        <div
          className="z-10 mx-auto px-4 flex flex-col gap-4"
          style={{
            backgroundImage: "url('/background pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        >
          <ZakatCategories />
          <HelpRequestComponent />
          {mainScreenData?.decrypted?.ProjectsData && (
            <Donations data={mainScreenData?.decrypted?.ProjectsData} />
          )}
          {mainScreenData?.decrypted?.OfficesData && (
            <Librarys data={mainScreenData.decrypted.OfficesData} />
          )}
          {mainScreenData?.decrypted?.NewsData && (
            <LastNews data={mainScreenData.decrypted.NewsData} />
          )}
          <Services/>
          <Charity />
          <DownloadApp />
          <Footer />
        </div>

        <div className="rightBow"></div>
        <div className="leftBow"></div>
      </div>
    </section>
  );
}

export default Home;
