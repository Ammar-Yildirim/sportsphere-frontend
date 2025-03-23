"use client";

import { FaRegClock, FaRegCalendar, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { getSportIcon } from "@/app/utils/utils";
import LocationMap from "@/app/ui/dashboard/LocationMap";
import { parseIncomingEvent } from "@/app/utils/utils";
import { use, useEffect, useState } from "react";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import ParticipationFormation from "@/app/ui/dashboard/event/ParticipationFormation";

export default function EventPage({ params }) {
  const [eventLoading, setEventLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const api = useAxiosPrivate();
  const id = use(params).id;

  useEffect(() => {
    async function getEventData() {
      const data = await api.get("/events/getByID", {
        params: {
          id: id,
        },
      });
      console.log(data);
      const fetchedEvent = data.data;
      setEventData(parseIncomingEvent(fetchedEvent));
      setEventLoading(false);
    }

    getEventData();
  }, []);

  if (eventLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:p-6 px-6 w-full max-h-screen text-sm">
      <div className="md:h-1/12 my-2.5 text-3xl font-semibold text-gray-900">
        {eventData.title}
      </div>
      <div className="md:h-11/12 md:grid md:grid-cols-3 md:space-x-5 md:overflow-y-auto w-full pb-3 pt-1 text-gray-500">
        <div className="shadow-sm border border-gray-100  h-fit">
          <h3 className="p-2 bg-gray-50 font-semibold text-gray-900">
            When and Where
          </h3>
          <div className="p-3 flex items-center space-x-1  border-b border-b-gray-200">
            <div className="w-6 h-6">
              <FaRegCalendar className="w-full h-full" />
            </div>
            <p>{eventData.date}</p>
          </div>
          <div className="p-3 flex items-center space-x-1 text-gray-500 border-b border-b-gray-200">
            <div className="w-6 h-6">
              <FaRegClock className="w-full h-full" />
            </div>
            <p>{eventData.time}</p>
          </div>
          <div className="p-3 flex items-center space-x-1 text-gray-500 border-b border-b-gray-200">
            <div className="w-6 h-6">
              <FaLocationDot className="w-full h-full" />
            </div>
            <p>{eventData.locationDTO.name}</p>
          </div>
          <div className="w-full h-80 md:h-64">
            <LocationMap
              coordinates={{
                lat: eventData.locationDTO.latitude,
                lng: eventData.locationDTO.longitude,
              }}
              zoom={16}
            />
          </div>
        </div>
        <div className="p-2 shadow-sm border border-gray-100  h-fit ">
          <div className="flex justify-center items-center">
            <button className="bg-blue-500 px-3 py-1.5 text-lg font-semibold text-white">
              Pick Your Spot
            </button>
          </div>
          <ParticipationFormation
            eventID={id}
            teamNumber={eventData.teamNumber}
            playerNumber={eventData.playerNumber}
          />
        </div>
        <div className="shadow-sm border border-gray-100 h-fit">
          <div className="p-5 flex items-center space-x-2 text-gray-500 ">
            <div className="w-6 h-6">{getSportIcon(eventData.sport.name)}</div>
            <div>
              <p className="text-gray-700 font-semibold">
                {eventData.sport.name}
              </p>
              <p className="text-sm">{eventData.sport.category}</p>
            </div>
          </div>
          <div className="p-5 flex items-center space-x-2 text-gray-500 bg-gray-100">
            <FaUser className="w-6 h-6" />
            <div>
              <p className="text-gray-700 font-semibold">
                {eventData.createdBy}
              </p>
              <p className="text-sm">Game Organizer</p>
            </div>
          </div>
          <div className="p-3">
            <h2 className="text-xl mb-2">Description</h2>
            <p className="overflow-y-auto">{eventData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
