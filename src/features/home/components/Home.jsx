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

function Home() {
  return (
    <section className="">
        <HeroBanner />
      <div className="relative overflow-hidden">
        <div className="z-10 mx-auto px-4 flex flex-col gap-4 pattern">
          <ZakatCategories />
          <HelpRequestComponent />
          <Donations />
          <Librarys/>
          <LastNews/>
          <Services/>
          <Charity/>
          <DownloadApp/>
          <Footer/>
        </div>
      <div className="rightBow"></div>
      <div className="leftBow"></div>
      </div>
    </section>
  );
}

export default Home;
