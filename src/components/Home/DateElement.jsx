import { useRef, useState } from "react";
import { FaMapMarkerAlt, FaRegClock, FaArrowCircleRight } from "react-icons/fa";

function DateElement({ dateObj, animationClass, delay = 0 }) {
  const months = {
    1: "JAN",
    2: "FEB",
    3: "MAR",
    4: "APR",
    5: "MAI",
    6: "JUN",
    7: "JUL",
    8: "AUG",
    9: "SEP",
    10: "OKT",
    11: "NOV",
    12: "DEZ",
  };

  const dateArr = dateObj.date.split("-");

  const day = dateArr[2];
  const month = months[+dateArr[1]];
  const year = dateArr[0];


  return (
    <div 
      className={`dateElement ${animationClass ? animationClass : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="date">
        <div>{day}</div>
        <div>{month}</div>
        <div>{year}</div>
      </div>
      <div className="location">
        <div className="place">{dateObj.venue}</div>
        <div className="address">
          <div><FaMapMarkerAlt /></div>
          <div>
            {dateObj.street} {dateObj.number}
            <br />
            {dateObj.postalCode} {dateObj.city}
          </div>
        </div>
      </div>
      <div className="info">
        <div>
          <FaRegClock />
          {dateObj.time}
        </div>
        {dateObj.link && (<div title="Zum Veranstalter"><FaArrowCircleRight /><a href={dateObj.link} target="_blank" rel="noopener">Info</a></div>)}
      </div>
    </div>
  );
}

export default DateElement;
