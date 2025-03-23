import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { MdOutlineSportsTennis, MdOutlineSportsSoccer } from "react-icons/md";
import { FaVolleyballBall, FaBasketballBall, FaTableTennis, FaSkating, FaMountain, FaSpa } from "react-icons/fa";

export function parseIncomingEvent(event) {
  dayjs.extend(advancedFormat);
  return {
    ...event,
    date: dayjs(event.startsAt).format("dddd, MMMM D, YYYY"),
    time: dayjs(event.startsAt).format("h:mm A"),
  };
}

export function getSportIcon(sport) {
  const sportToIcons = {
    "Tennis": <MdOutlineSportsTennis className="w-full h-full"/>,
    "Ping Pong": <FaTableTennis className="w-full h-full"/>,
    "Squash": <MdOutlineSportsTennis className="w-full h-full"/>, 
    "Football": <MdOutlineSportsSoccer className="w-full h-full"/>,
    "Basketball": <FaBasketballBall className="w-full h-full"/>,
    "Volleyball": <FaVolleyballBall className="w-full h-full"/>,
    "Hiking": <FaMountain className="w-full h-full"/>,
    "Ice Skating": <FaSkating className="w-full h-full"/>,
    "Yoga": <FaSpa className="w-full h-full"/>
  };

  return sportToIcons[sport] || null; 
}