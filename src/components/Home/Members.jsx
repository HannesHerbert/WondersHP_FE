import "../../sass/Members.scss";
import { useState } from "react";

function Members() {

  //  TODO: Query für members einsetzen
  let membersArr = [
    {
      firstName: 'Gordon',
      lastName: 'Dannat',
      instrument: 'Piano',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, dolore adipisci. Inventore nostrum accusamus cum sequi vitae quidem voluptatibus similique modi ducimus beatae odio non, quibusdam, temporibus optio aliquid facilis molestias. Possimus, quibusdam veritatis dolores earum harum blanditiis fugiat! Deserunt reprehenderit deleniti accusamus sapiente porro, consectetur maxime, aspernatur nihil ab facere eligendi? Ducimus eos autem facilis nobis, beatae deserunt temporibus possimus, quasi itaque, recusandae architecto eum in sed vel molestiae non asperiores ullam error ipsa provident. Minus voluptates vero commodi sed totam molestias saepe deserunt aperiam iusto inventore, cumque, quia accusantium ab. Neque dolor unde facilis quod repellat placeat tempore!',
      position: 'topLeft',
      image: '/src/images/Gordon-frontal.jpg'
    },
    {
      firstName: 'Ulrich',
      lastName: 'Dobe',
      instrument: 'Bass',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
      position: 'topRight',
      image: '/src/images/Ulli-frontal.jpg'
    },
    {
      firstName: 'Jody',
      lastName: 'Cooper',
      instrument: 'Gesang, Gitarre',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
      position: 'bottomLeft',
      image: '/src/images/Jody-frontal.jpg'
    },
    {
      firstName: 'Hannes',
      lastName: 'Petri',
      instrument: 'Schlagzeug',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
      position: 'bottomRight',
      image: '/src/images/Hannes-frontal.jpg'
    }
  ];

  const getMembersNameSquared = (array) => {

    let maxNameLength = 0;
    array.forEach(member => {
      let nameLength = (member.firstName + member.lastName).length;
      if(nameLength > maxNameLength) maxNameLength = nameLength;
    })

    let squareNum = 0;
    let squareNumIsFound = false
    let i = 0;

    while (squareNumIsFound === false) {
      i = i + 1;
      
      if(maxNameLength + 1 < i*i) {
        squareNum = i*i;
        squareNumIsFound = true
      } 
    }

    return squareNum
    
  }

  
  let membersNamesLength = getMembersNameSquared(membersArr);


  let [ descExpandedObj, setDescEnpandedObj ] = useState(
    {
      topLeft : false,
      topRight : false,
      bottomLeft : false,
      bottomRight : false
  }
)


  const toggleDescription = (position) => {
    setDescEnpandedObj((prevState) => ({
      ...prevState,
      [position]: !prevState[position],
    }));
  }

  let membersElements = membersArr.map( member => {
    const fullNameLength = member.firstName.length + member.lastName.length;
    const emptyDivsCount = membersNamesLength - fullNameLength;


    return (
      <div key={member.position} className={`member ${member.position}${descExpandedObj[member.position] ? ' expanded' : '' }`}
          onClick={() => toggleDescription(member.position)} >
          <img className="member-image" src={member.image} alt={`${member.firstName} ${member.lastName}`}></img>
          <div className="image-overlay"></div>
          <div className="member-name">

            {member.firstName.split('').map((letter, i) => (
                    <div key={`firstName-${i}`} className="name-box">
                        {letter}
                    </div>
                ))}

                {Array(emptyDivsCount).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} className="name-box empty"></div>
                ))}

                {member.lastName.split('').map((letter, i) => (
                    <div key={`lastName-${i}`} className="name-box">
                        {letter}
                    </div>
                ))}
          </div>
          <div className="member-description">{member.description}</div>
        </div>
    )
  }
  )


  return (
    <section id="members">
      <div className="members-grid">

        {membersElements}
        
      </div>
    </section>
  );
}

export default Members;
