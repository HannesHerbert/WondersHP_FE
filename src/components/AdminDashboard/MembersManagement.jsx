import MemberRow from "./MemberRow";
import "../../sass/MembersManagement.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import useAdminSettingsStore from "../../store/useAdminSettingsStore";
import useAuthStore from "../../store/useAuthStore";




function MembersManagement() {

  // const [membersArr, setMembersArr] = useState([]);
  const [isInit, setIsInit] = useState([true]);

  const setMembersArrStore = useAdminSettingsStore((state) => state.setMembersArray);
  const membersArrStore = useAdminSettingsStore((state) => state.membersArray);
  const token = useAuthStore((state) => state.getToken())

  const getAllMembers = async () => {
    let res = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/members`);
    console.log(res.data.data);
    
    // setMembersArr(res.data.data);
    setMembersArrStore(res.data.data);

  };

  useEffect(() => {
    if (isInit) {
      getAllMembers();
      setIsInit(isInit => !isInit)
    }
  }, []);


    const imagePositionVals = {
        1: 'topLeft',
        2: 'topRight',
        3: 'bottomLeft',
        4: 'bottomRight'
    }

    // let membersArr = [
    //     {
    //       firstName: 'Gordon',
    //       lastName: 'Dannat',
    //       instrument: 'Piano',
    //       description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse, dolore adipisci. Inventore nostrum accusamus cum sequi vitae quidem voluptatibus similique modi ducimus beatae odio non, quibusdam, temporibus optio aliquid facilis molestias. Possimus, quibusdam veritatis dolores earum harum blanditiis fugiat! Deserunt reprehenderit deleniti accusamus sapiente porro, consectetur maxime, aspernatur nihil ab facere eligendi? Ducimus eos autem facilis nobis, beatae deserunt temporibus possimus, quasi itaque, recusandae architecto eum in sed vel molestiae non asperiores ullam error ipsa provident. Minus voluptates vero commodi sed totam molestias saepe deserunt aperiam iusto inventore, cumque, quia accusantium ab. Neque dolor unde facilis quod repellat placeat tempore!',
    //       position: 'topLeft',
    //       image: '/src/images/Gordon-frontal.jpg'
    //     },
    //     {
    //       firstName: 'Ulrich',
    //       lastName: 'Dobe',
    //       instrument: 'Bass',
    //       description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
    //       position: 'topRight',
    //       image: '/src/images/Ulli-frontal.jpg'
    //     },
    //     {
    //       firstName: 'Jody',
    //       lastName: 'Cooper',
    //       instrument: 'Gesang, Gitarre',
    //       description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
    //       position: 'bottomLeft',
    //       image: '/src/images/Jody-frontal.jpg'
    //     },
    //     {
    //       firstName: 'Hannes',
    //       lastName: 'Petri',
    //       instrument: 'Schlagzeug',
    //       description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, debitis harum praesentium recusandae quas, iure labore dolores officia enim iusto explicabo reprehenderit id natus molestias dolore cupiditate quam omnis sit perspiciatis deleniti. Odit dolores sint atque, labore error hic dolor magni, ullam facilis tempora voluptatibus quis praesentium alias? Ratione, facilis.',
    //       position: 'bottomRight',
    //       image: '/src/images/Hannes-frontal.jpg'
    //     }
    //   ];

      const MEMBER_ROWS = membersArrStore.map((member, index) => {

        return (
            <MemberRow key={index} member={member}/>
        )
      })

    async function updateMembers() {

        try {
            let res = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/admin/update-members`, {membersArrStore}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(res)

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div id="members-management">

            {MEMBER_ROWS}

            <div>
              <button onClick={getAllMembers}>Aktualisieren</button>
              <button onClick={updateMembers}>Speichern</button>
            </div>
            
        </div>
    )
}

export default MembersManagement