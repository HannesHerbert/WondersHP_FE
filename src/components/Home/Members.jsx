import "../../sass/Members.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import GordonFrontal from "../../assets/images/Gordon-frontal.jpg";
import UlrichFrontal from "../../assets/images/Ulli-frontal.jpg";
import JodyFrontal from "../../assets/images/Jody-frontal.jpg";
import HannesFrontal from "../../assets/images/Hannes-frontal.jpg";

function Members() {
  
  // const [membersArr, setMembersArr] = useState([]);
  const [descExpandedObj, setDescEnpandedObj] = useState({
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
  });

  let membersArr = [
    {
      firstname: 'Gordon',
      lastname: 'Dannat',
      instrument: 'Piano',
      description: 'Der “Man on the the Keys” - Gordon - ist der Neuzugang der Wonders. Wenn er nicht gerade Coldplay-Songs singt, reißt auch ihn das Disco-Funk-Spielfieber mit! Während seines Lehramtsstudiums in Halle übte er sich in die Band hinein und ist nun ein festes Mitglied. Nach der klassischen Klavierausbildung für Schulmusik an der Uni sind ihm viel mehr die modernen Musikstile zugetan - ob Blues, Jazz, Funk oder Fusion, stets mit einer Liebe zu den elektronischen Klängen. Gordons Finger zaubern alles auf die Tasten - von den funky Clavinet-Rhythmen à la Stevie Wonder, bis hin zu melodiösen String-Bläser-Sätzen von Earth, Wind & Fire!',
      image_position: 1,
      image_path: GordonFrontal
    },
    {
      firstname: 'Ulrich',
      lastname: 'Dobe',
      instrument: 'Bass',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
      image_position: 2,
      image_path: UlrichFrontal
    },
    {
      firstname: 'Jody',
      lastname: 'Cooper',
      instrument: 'Gesang, Gitarre',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
      image_position: 3,
      image_path: JodyFrontal
    },
    {
      firstname: 'Hannes',
      lastname: 'Petri',
      instrument: 'Schlagzeug',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
      image_position: 4,
      image_path: HannesFrontal
    }
  ];

  const imagePositionVals = {
    1: "topLeft",
    2: "topRight",
    3: "bottomLeft",
    4: "bottomRight",
  };

  const getMembersNameSquared = (array) => {
    let maxNameLength = 0;
    array.forEach((member) => {
      let nameLength = (member.firstname + member.lastname).length;
      if (nameLength > maxNameLength) maxNameLength = nameLength;
    });

    let i = 0;
    while (true) {
      i++;
      if (maxNameLength + 1 < i * i) {
        return i * i;
      }
    }
  };

  let membersNamesLength = getMembersNameSquared(membersArr);

  // const getAllMembers = async () => {
  //   let res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/members`);
  //   console.log(res.data.data);
    
  //   setMembersArr(res.data.data);
  // };

  // useEffect(() => {
  //   getAllMembers();
  // }, []);

  const toggleDescription = (position) => {
    setDescEnpandedObj((prevState) => ({
      ...prevState,
      [position]: !prevState[position],
    }));
  };

  const membersElements = membersArr.map((member) => {
    const fullNameLength = member.firstname.length + member.lastname.length;
    const emptyDivsCount = membersNamesLength - fullNameLength;
    const positionClass = imagePositionVals[member.image_position];

    return (
      <div
        key={member.image_position}
        className={`member ${positionClass}${descExpandedObj[positionClass] ? " expanded" : ""}`}
        onClick={() => toggleDescription(positionClass)}
      >
        <img className="member-image" src={member.image_path} alt={`${member.firstname} ${member.lastname}`} />
        <div className="image-overlay"></div>
        <div className="member-name">
          {member.firstname.split("").map((letter, i) => (
            <div key={`firstname-${i}`} className="name-box">
              {letter}
            </div>
          ))}

          {Array(emptyDivsCount)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} className="name-box">
                _
              </div>
            ))}

          {member.lastname.split("").map((letter, i) => (
            <div key={`lastname-${i}`} className="name-box">
              {letter}
            </div>
          ))}
        </div>
        <div className="member-description">{member.description}</div>
      </div>
    );
  });

  return (
    <section id="members">
      <div className="members-grid">{membersElements}</div>
    </section>
  );
}

export default Members;
