import "../../sass/Members.scss";
import { useState, useEffect } from "react";
import axios from "axios";

function Members() {
  
  const [membersArr, setMembersArr] = useState([]);
  const [descExpandedObj, setDescEnpandedObj] = useState({
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
  });

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

  const getAllMembers = async () => {
    let res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/members`);
    setMembersArr(res.data.data);
  };

  useEffect(() => {
    getAllMembers();
  }, []);

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
