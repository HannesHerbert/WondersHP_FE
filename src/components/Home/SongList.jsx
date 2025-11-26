import { useEffect, useState } from "react";
import { RxArrowDown, RxArrowUp } from "react-icons/rx";

function SongList() {
  const SONGLIST = [
    {
      song_name: "Ain´t nobody",
      artist: "Chaka Khan",
    },
    {
      song_name: "Disco Inferno",
      artist: "The Trammps",
    },
    {
      song_name: "Do it again",
      artist: "Steely Dan",
    },
    {
      song_name: "Don´t be afraid of the dark",
      artist: "Robert Cray",
    },
    {
      song_name: "Don´t stop till you get enough",
      artist: "Michael Jackson",
    },
    {
      song_name: "Faith",
      artist: "George Michael",
    },
    {
      song_name: "Get back",
      artist: "The Beatles",
    },
    {
      song_name: "Get down on it / Ladies night",
      artist: "Kool & the Gang",
    },
    {
      song_name: "Get lucky",
      artist: "Daft Punk",
    },
    {
      song_name: "Gimme some lovin´",
      artist: "The Spencer Davis Group",
    },
    {
      song_name: "Good Times",
      artist: "Chic",
    },
    {
      song_name: "Happy",
      artist: "Pharrell Williams",
    },
    {
      song_name: "Hard to handle",
      artist: "Otis Redding",
    },
    {
      song_name: "Heard it through the grapevine",
      artist: "Marvin Gaye",
    },
    {
      song_name: "Higher and higher",
      artist: "Jackie Wilson",
    },
    {
      song_name: "Holding back the years",
      artist: "Simply Red",
    },
    {
      song_name: "I can´t go for that",
      artist: "Hall & Oats",
    },
    {
      song_name: "I feel for you",
      artist: "Chaka Khan",
    },
    {
      song_name: "I feel good",
      artist: "James Brown",
    },
    {
      song_name: "I need a dollar",
      artist: "Aloe Blacc",
    },
    {
      song_name: "I shot the Sheriff",
      artist: "Eric Clapton",
    },
    {
      song_name: "Isn´t she lovely",
      artist: "Stevie Wonder",
    },
    {
      song_name: "Jive Talking",
      artist: "Bee Gees",
    },
    {
      song_name: "Johnny B. Goode",
      artist: "Chuck Berry",
    },
    {
      song_name: "Kiss",
      artist: "Prince",
    },
    {
      song_name: "Le freak",
      artist: "Chic",
    },
    {
      song_name: "Let´s dance",
      artist: "David Bowie",
    },
    {
      song_name: "Locked out of heaven",
      artist: "Bruno Mars",
    },
    {
      song_name: "Lovely day",
      artist: "Bill Withers",
    },
    {
      song_name: "Miss you",
      artist: "The Rolling Stones",
    },
    {
      song_name: "Money´s to tight to mention",
      artist: "Simply Red",
    },
    {
      song_name: "More than one way home",
      artist: "K´eb Moe",
    },
    {
      song_name: "My girl",
      artist: "Temptations",
    },
    {
      song_name: "Ride like the wind",
      artist: "Christopher Cross",
    },
    {
      song_name: "Riders on the storm",
      artist: "The Doors",
    },
    {
      song_name: "Rock your baby",
      artist: "George McCrae",
    },
    {
      song_name: "September",
      artist: "Earth Wind & Fire",
    },
    {
      song_name: "Sitting on the dock of the bay",
      artist: "Otis Redding",
    },
    {
      song_name: "Sledgehammer",
      artist: "Peter Gabriel",
    },
    {
      song_name: "Somebody´s watching me",
      artist: "Rockwell",
    },
    {
      song_name: "Superfreak",
      artist: "Rick James",
    },
    {
      song_name: "Superstition",
      artist: "Stevie Wonder",
    },
    {
      song_name: "That´s the way I like it",
      artist: "KC & the Sunshine Band",
    },
    {
      song_name: "The thrill is gone",
      artist: "BB King",
    },
    {
      song_name: "Thunder in my heart",
      artist: "Leo Sayer",
    },
    {
      song_name: "Treasure",
      artist: "Bruno Mars",
    },
    {
      song_name: "Tutti Frutti",
      artist: "Little Richard",
    },
    {
      song_name: "Uptown Funk",
      artist: "Bruno Mars",
    },
    {
      song_name: "Use me",
      artist: "Bill Withers",
    },
    {
      song_name: "We close our eyes",
      artist: "Go West",
    },
    {
      song_name: "What´s going on",
      artist: "Marvin Gaye",
    },
    {
      song_name: "Word up",
      artist: "Cameo",
    },
    {
      song_name: "Wot",
      artist: "Captain Sensible",
    },
    {
      song_name: "You make me feel like dancing",
      artist: "Leo Sayer",
    },
    {
      song_name: "You should be dancing",
      artist: "Bee Gees",
    },
  ];

  const [songList, setSongList] = useState(SONGLIST);
  const [isInit, setIsInit] = useState(true);
  const [sortSetting, setSortSetting] = useState({
    column: "song_name",
    ascending: true,
  });

  useEffect(() => {
    if (isInit) {
      setSongList(SONGLIST);
      setIsInit(false);
    }
  }, [isInit]);

  const handleSorting = (column) => {
    setSortSetting((prev) => ({
      column: column,
      ascending: prev.column === column ? !prev.ascending : true,
    }));
  };

  useEffect(() => {
    const sortedList = songList.slice().sort((a, b) => {
      const itemA = a[sortSetting.column].toLowerCase();
      const itemB = b[sortSetting.column].toLowerCase();

      if (itemA < itemB) return sortSetting.ascending ? -1 : 1;
      if (itemA > itemB) return sortSetting.ascending ? 1 : -1;
      return 0;
    });

    setSongList(sortedList);
  }, [sortSetting]);


  return (
    <div id="songlist">
      <table>
        <thead>
          <tr>
            <th
              onClick={() => handleSorting("song_name")}
            >
              Titel{" "}
              {sortSetting.column === "song_name" &&
                (sortSetting.ascending ? <RxArrowUp /> : <RxArrowDown />)}
            </th>

            <th
              onClick={() => handleSorting("artist")}
            >
              Interpret{" "}
              {sortSetting.column === "artist" &&
                (sortSetting.ascending ? <RxArrowUp /> : <RxArrowDown />)}
            </th>
          </tr>
        </thead>

        <tbody>
          {songList.map((song, index) => (
            <tr key={index}>
              <td>{song.song_name}</td>
              <td>{song.artist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SongList;