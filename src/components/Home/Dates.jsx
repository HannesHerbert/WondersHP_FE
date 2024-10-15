import "../../sass/Dates.scss";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DateElement from "./DateElement";

function Dates() {

  const [currDateIndex, setCurrDateIndex] = useState(0);
  const [prevDateIndex, setPrevDateIndex] = useState(0);
  const [datesElements, setDatesElements] = useState([]);
  const [animationClass, setAnimationClass] = useState("initial");
  const shownDates = 3;
  
  const dates = [
    {
      date: "2024-01-13",
      time: "21:00",
      location: "Tonellis",
      link: null,
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-02-13",
      time: "21:00",
      location: "Stadtfest Leipzig",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-03-13",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-04-13",
      time: "21:00",
      location: "Tonellis",
      link: null,
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-05-13",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-06-13",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-07-28",
      time: "21:00",
      location: "Tonellis",
      link: null,
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-08-28",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-10-28",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-11-28",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2024-12-28",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2025-01-28",
      time: "21:00",
      location: "Tonellis",
      link: "https://www.tonellis.de/",
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    },
    {
      date: "2025-03-23",
      time: "21:00",
      location: "Tonellis",
      link: null,
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    }, {
      date: "2025-04-23",
      time: "21:00",
      location: "Tonellis",
      link: null,
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    }, {
      date: "2025-05-23",
      time: "21:00",
      location: "Tonellis",
      link: null,
      address: {
        street: "Neumarkt",
        number: "9",
        postalCode: "04109",
        city: "Leipzig",
      },
    }
  ];


  useEffect(() => {
    const today = new Date();
    const futureDates = dates
      .map((event, index) => ({
        ...event,
        index,
        fullDate: new Date(`${event.date}T${event.time}`),
      }))
      .filter((event) => event.fullDate > today)
      .sort((a, b) => a.fullDate - b.fullDate);
    const nextDateIndex = futureDates[0]?.index || 0;
    setCurrDateIndex(nextDateIndex);
  }, []);


  useEffect(() => {
    let currDates
    if (currDateIndex !== null) {
      if(currDateIndex < 0) {
        currDates = dates.slice(0, currDateIndex + shownDates);
      } else {
        currDates = dates.slice(currDateIndex, currDateIndex + shownDates);
      }
      const dateElems = currDates.map((date) => (
        <DateElement
          key={date.date}
          dateObj={date}
          animationClass={animationClass}
        />
      ));

      setDatesElements(dateElems);
    }
  }, [currDateIndex, animationClass]);

  const handleNext = () => {
    if (currDateIndex + shownDates < dates.length) {
      setAnimationClass("slideOutLeft");
      setTimeout(() => {
        setCurrDateIndex(currDateIndex + shownDates);
        setAnimationClass("slideInRight");
      },  300 + (shownDates - 1) * 100);
    }
  };

  const handlePrevious = () => {
    if (currDateIndex > 0) {
      setAnimationClass("slideOutRight");
      setTimeout(() => {
        setCurrDateIndex(currDateIndex - shownDates);
        setAnimationClass("slideInLeft");
      }, 300 + (shownDates - 1) * 100);
    }    
  };

  return (
    <section id="dates">
      <h2>Unsere Spieltermine</h2>

      {currDateIndex > 0 && (
        <div className="earlierDates" onClick={handlePrevious}>
          <FaArrowLeft />
        </div>
      )}

      {currDateIndex + shownDates < dates.length && (
        <div className="laterDates" onClick={handleNext}>
          <FaArrowRight />
        </div>
      )}

      <div className="dates-container">{datesElements}</div>
    </section>
  );
}

export default Dates;
