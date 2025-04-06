"use client";

import { FaRegClock, FaRegCalendar, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { getSportIcon } from "@/app/utils/utils";
import { MdDeleteForever } from "react-icons/md";
import { FaExclamationCircle } from "react-icons/fa";
import LocationMap from "@/app/ui/dashboard/LocationMap";
import { parseIncomingEvent } from "@/app/utils/utils";
import { use, useEffect, useState } from "react";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import ParticipationFormation from "@/app/ui/dashboard/event/ParticipationFormation";
import Spinner from "@/app/ui/dashboard/Spinner";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import { FaInfoCircle, FaComments } from "react-icons/fa";
import CommentSection from "@/app/ui/dashboard/event/CommentSection";

export default function EventPage({ params }) {
  const [eventLoading, setEventLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'comments'
  const api = useAxiosPrivate();
  const { userId } = useAuth();
  const id = use(params).id;
  const router = useRouter();

  const isDeleteDisplayed =
    eventData?.userId === userId && new Date(eventData?.startsAt) > new Date();

  async function deleteEvent() {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      await api.delete(`/events/${id}`);
      setIsDeleted(true);
      router.push("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete event.";
      setError(message);
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    async function getEventData() {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEventData(parseIncomingEvent(data));
        setEventLoading(false);
      } catch (err) {
        setError("Failed to load event.");
        setEventLoading(false);
      }
    }

    if (!isDeleted) {
      getEventData();
    }
  }, [id, api, isDeleted]);

  if (eventLoading || deleteLoading || isDeleted) {
    return (
      <div className="w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="md:flex md:flex-col md:p-6 px-6 w-full h-screen text-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center my-2.5">
        <h1 className="text-3xl text-center font-semibold text-gray-900">
          {eventData.title}
        </h1>
        {isDeleteDisplayed && (
          <div className="text-center flex items-center justify-center">
            <button
              className="bg-red-500 hover:bg-red-600 active:bg-red-500 px-3 py-1.5 text-lg font-semibold text-white cursor-pointer flex items-center"
              onClick={deleteEvent}
            >
              <MdDeleteForever className="text-2xl" />
              <p className="md:hidden"> Delete Event</p>
            </button>
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center px-4 py-2 mr-2 font-medium transition-colors duration-200 ${
            activeTab === "details"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <FaInfoCircle className="mr-2" />
          Event Details
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center px-4 py-2 font-medium transition-colors duration-200 ${
            activeTab === "comments"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <FaComments className="mr-2" />
          Comments
        </button>
      </div>

      {/* Comments Section (displayed above event details) */}
      {activeTab === "comments" && <CommentSection eventId={id} api={api}/>}

      {/* Event Details Section */}
      {activeTab === "details" && (
        <div className="md:flex-grow grid grid-cols-1 gap-5 md:grid-cols-3 md:overflow-y-auto md:space-y-0 w-full pb-3 text-gray-500">
          <div className="shadow-sm border border-gray-100 h-fit">
            <h3 className="p-2 bg-gray-50 font-semibold text-gray-900">
              When and Where
            </h3>
            <div className="p-3 flex items-center space-x-1 border-b border-b-gray-200">
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
            <div className="w-full h-80 md:h-56">
              <LocationMap
                coordinates={{
                  lat: eventData.locationDTO.latitude,
                  lng: eventData.locationDTO.longitude,
                }}
                zoom={16}
              />
            </div>
          </div>
          <div
            className={`p-2 shadow-sm border border-gray-100 ${
              eventData.sport.category === "Group Sports"
                ? "h-full flex flex-col overflow-y-hidden"
                : "h-fit"
            }`}
          >
            <ParticipationFormation
              eventID={id}
              playerNumber={eventData.playerNumber}
              sportCategory={eventData.sport.category}
              isPastEvent={new Date(eventData.startsAt) < new Date()}
            />
          </div>
          <div className="shadow-sm border border-gray-100 h-fit">
            <div className="p-5 flex items-center space-x-2 text-gray-500">
              <div className="w-6 h-6">
                {getSportIcon(eventData.sport.name)}
              </div>
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
      )}
    </div>
  );
}
