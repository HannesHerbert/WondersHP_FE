import HeroArea from "../components/Home/HeroArea";
import Members from "../components/Home/Members";
import Dates from "../components/Home/Dates";
import Media from "../components/Home/MediaContainer";
import "../sass/Home.scss";

function Home() {
  return (
    <main id="home">
      {/* <AudioPlayer /> */}
      <HeroArea />
      <Members />
      <Media />
      <Dates/>
      {/* <Information /> */}
    </main>
  );
}

export default Home;
