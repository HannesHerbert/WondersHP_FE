import HeroArea from "../components/Home/HeroArea";
import Members from "../components/Home/Members";
import Dates from "../components/Home/Dates";
import Media from "../components/Home/MediaContainer";
import BookingTeaser from "../components/Home/BookingTeaser";
import "../sass/Home.scss";

function Home() {
  return (
    <div id="home">
      <HeroArea />
      <Members />
      <Media />
      <Dates/>
      <BookingTeaser />
    </div>
  );
}

export default Home;
