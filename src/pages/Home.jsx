import HeroArea from "../components/Home/HeroArea";
import Members from "../components/Home/Members";
import Dates from "../components/Home/Dates";
import Information from "../components/Home/Information";
import "../sass/Home.scss";

function Home() {
  return (
    <main id="home">
      <HeroArea />
      <Members />
      <Dates/>
      <Information />
    </main>
  );
}

export default Home;
