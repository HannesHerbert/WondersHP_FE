import "../../sass/Dates.scss";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DateElement from "./DateElement";
import axios from "axios";
import FlourishText from "../Snippets/FlourishText";

function Dates() {

  const [eventsArr, setEventsArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currDateIndex, setCurrDateIndex] = useState(0);
  const [datesElements, setDatesElements] = useState([]);
  const [animationClass, setAnimationClass] = useState("initial");

  const shownDates = 3;

  const getAllEvents = async () => {
        try {
            setIsLoading(true);
            console.log("Requesting URL:", `/api/public/events`);
            const res = await axios.get(`/api/public/events`);
            const data = res.data.data || res.data;
            
            if (Array.isArray(data)) {
              // Sort events by date ascending
              const sortedEvents = data.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
              setEventsArr(sortedEvents);
            } else {
              setEventsArr([]);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Events:', error);
            setEventsArr([]);
        } finally {
            setIsLoading(false);
        }
    };

  // EINZIGER useEffect für Initial-Load
  useEffect(() => {
    getAllEvents();
  }, []);


  useEffect(() => {
    if (!Array.isArray(eventsArr) || eventsArr.length === 0) return;
    const today = new Date();
    
    // Find the index of the first event that is in the future or today
    const nextDateIndex = eventsArr.findIndex(event => new Date(`${event.date}T${event.time}`) >= today);
    
    // If all events are in the past, show the last ones
    if (nextDateIndex === -1) {
      setCurrDateIndex(Math.max(0, eventsArr.length - shownDates));
    } else {
      setCurrDateIndex(nextDateIndex);
    }
  }, [eventsArr]);


  useEffect(() => {
    let slicedDates = [];
    if (currDateIndex !== null && Array.isArray(eventsArr)) {
      slicedDates = eventsArr.slice(currDateIndex, currDateIndex + shownDates);
      
      const dateElems = slicedDates.map((date, index) => (
        <div key={date.id || date.date} className="date-wrapper" style={{ marginLeft: `${index * 2}rem` }}>
          <DateElement
            dateObj={date}
            animationClass={animationClass}
            delay={index * 0.1}
          />
        </div>
      ));

      setDatesElements(dateElems);
    }
  }, [animationClass, eventsArr, currDateIndex]);

  const handleNext = () => {
    if (currDateIndex + shownDates < eventsArr?.length) {
      setAnimationClass("slideOutLeft");
      setTimeout(() => {
        setCurrDateIndex(currDateIndex + shownDates);
        setAnimationClass("slideInRight");
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currDateIndex > 0) {
      setAnimationClass("slideOutRight");
      setTimeout(() => {
        setCurrDateIndex(Math.max(currDateIndex - shownDates, 0));
        setAnimationClass("slideInLeft");
      }, 500);
    }
  };

  return (
    <section id="dates">
      <h2><FlourishText>Unsere Spieltermine</FlourishText></h2>

      {currDateIndex > 0 && (
        <div className="earlierDates" onClick={handlePrevious}>
          <FaArrowLeft />
        </div>
      )}

      {currDateIndex + shownDates < eventsArr?.length && (
        <div className="laterDates" onClick={handleNext}>
          <FaArrowRight />
        </div>
      )}

      <div className="dates-container">
        <div className="dates-staggered-wrapper">
          {datesElements}
        </div>
      </div>
    </section>
  );
}

export default Dates;
