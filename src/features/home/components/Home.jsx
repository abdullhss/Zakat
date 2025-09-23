import HeroBanner from "./HeroBanner";
import ZakatCategories from "./ZakatCategories";
import HelpRequestComponent from "./HelpRequestComponent";
import Donations from "./Donations";
import Librarys from "./Librarys";

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
        </div>
      <div className="rightBow"></div>
      <div className="leftBow"></div>
      </div>
    </section>
  );
}

export default Home;
