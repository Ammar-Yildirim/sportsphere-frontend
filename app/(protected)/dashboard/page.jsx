"use client";

import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { useState } from "react";
import EventGrid from "@/app/ui/dashboard/EventGrid";
import EventLineChart from "@/app/ui/dashboard/EventLineChart";

export default function Dashboard() {
  const api = useAxiosPrivate();
  const [loading, setLoading] = useState({
    registeredUpcomingEventsLoading: true,
    createdUpcomingEventsLoading: true,
    registeredPastEventsLoading: true,
    createdPastEventsLoading: true,
  });
  const [registeredUpcomingEvents, setRegisteredUpcomingEvents] = useState({
    rows: [],
    eventToParticipationCount: [],
  });
  const [createdUpcomingEvents, setCreatedUpcomingEvents] = useState({
    rows: [],
    eventToParticipationCount: [],
  });
  const [registeredPastEvents, setRegisteredPastEvents] = useState([]);
  const [createdPastEvents, setCreatedPastEvents] = useState([]);
  const [showCreatedEvents, setShowCreatedEvents] = useState(false);
  const [showRegisteredEvents, setShowRegisteredEvents] = useState(false);
  const [dataFetched, setDataFetched] = useState({
    registeredEvents: false,
    createdEvents: false,
  });

  async function getRegisteredUpcomingEvents() {
    try {
      const { data: events } = await api.get(
        "/events/getUpcomingEventsByParticipant"
      );
      const eventIDs = events.map((x) => x.id);
      const { data: participationCounts } = await api.post(
        "/eventParticipation/getParticipationCounts",
        eventIDs
      );

      setRegisteredUpcomingEvents({
        rows: events,
        eventToParticipationCount: participationCounts,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading((prev) => ({
        ...prev,
        registeredUpcomingEventsLoading: false,
      }));
    }
  }

  async function getCreatedUpcomingEvents() {
    try {
      const { data: events } = await api.get(
        "/events/getUpcomingEventsByCreator"
      );
      const eventIDs = events.map((x) => x.id);
      const { data: participationCounts } = await api.post(
        "/eventParticipation/getParticipationCounts",
        eventIDs
      );

      setCreatedUpcomingEvents({
        rows: events,
        eventToParticipationCount: participationCounts,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, createdUpcomingEventsLoading: false }));
    }
  }

  async function getRegisteredPastEvents() {
    try {
      const { data: events } = await api.get(
        "/events/getPastEventsByParticipant"
      );

      setRegisteredPastEvents(events);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, registeredPastEventsLoading: false }));
    }
  }

  async function getCreatedPastEvents() {
    try {
      const { data: events } = await api.get("/events/getPastEventsByCreator");

      setCreatedPastEvents(events);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, createdPastEventsLoading: false }));
    }
  }

  const handleCreatedEventsClick = () => {
    setShowCreatedEvents(prev => !prev);

    if (!dataFetched.createdEvents) {
      setDataFetched(prev => ({ ...prev, createdEvents: true }));
      getCreatedPastEvents();
      getCreatedUpcomingEvents();
    }
  };

  const handleRegisteredEventsClick = () => {
    setShowRegisteredEvents(prev => !prev);

    if (!dataFetched.registeredEvents) {
      setDataFetched(prev => ({ ...prev, registeredEvents: true }));
      getRegisteredPastEvents();
      getRegisteredUpcomingEvents();
    }
  };

  return (
    <div className="overflow-y-auto md:w-[calc(100%-16rem)] px-2 py-4">
      <div className="p-2 flex flex-col justify-center items-center">
        <h1 className="text-left w-full text-2xl font-semibold">
          Monthly Event Participation
        </h1>
        <EventLineChart />
      </div>
      <div className="py-2">
        <button
          onClick={handleCreatedEventsClick}
          className="flex items-center text-left text-2xl font-semibold py-2 focus:outline-none cursor-pointer"
        >
          <span>Created Events</span>
          <span
            className="ml-2 transform transition-transform duration-200 text-base"
            style={{
              transform: showCreatedEvents ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>
        {showCreatedEvents && (
          <div className="md:flex">
            <div className="h-full md:w-1/2">
              <h1 className="m-2 text-lg font-semibold">Past</h1>
              <EventGrid
                loading={loading.createdPastEventsLoading}
                rows={createdPastEvents}
              />
            </div>
            <div className="h-full md:w-1/2">
              <h1 className="m-2 text-lg font-semibold">Upcoming</h1>
              <EventGrid
                loading={loading.createdUpcomingEventsLoading}
                rows={createdUpcomingEvents.rows}
                eventToParticipationCount={
                  createdUpcomingEvents.eventToParticipationCount
                }
              />
            </div>
          </div>
        )}
      </div>
      <div className="py-2">
        <button
          onClick={handleRegisteredEventsClick}
          className="flex items-center text-left text-2xl font-semibold py-2 focus:outline-none cursor-pointer"
        >
          <span>Registered Events</span>
          <span
            className="ml-2 transform transition-transform duration-200 text-base"
            style={{
              transform: showRegisteredEvents
                ? "rotate(180deg)"
                : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>
        {showRegisteredEvents && (
          <div className="md:flex">
            <div className="md:w-1/2 h-full">
              <h1 className="m-2 text-lg font-semibold">Past</h1>
              <EventGrid
                loading={loading.registeredPastEventsLoading}
                rows={registeredPastEvents}
              />
            </div>
            <div className="md:w-1/2 h-full">
              <h1 className="m-2 text-lg font-semibold">Upcoming</h1>
              <EventGrid
                loading={loading.registeredUpcomingEventsLoading}
                rows={registeredUpcomingEvents.rows}
                eventToParticipationCount={
                  registeredUpcomingEvents.eventToParticipationCount
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
