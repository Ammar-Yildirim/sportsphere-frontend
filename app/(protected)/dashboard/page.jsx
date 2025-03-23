"use client";

import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import EventGrid from "@/app/ui/dashboard/EventGrid";

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
  const [showRegisteredEvents, setShowRegisteredEvents] = useState(true);

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

  useEffect(() => {
    getRegisteredPastEvents();
    getRegisteredUpcomingEvents();
    getCreatedUpcomingEvents();
    getCreatedPastEvents();
  }, []);

  return (
    <div className="overflow-y-auto md:w-[calc(100%-16rem)] px-2 py-4">
      <div className="py-2">
        <button
          onClick={() => setShowCreatedEvents(!showCreatedEvents)}
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
          <div className="flex">
            <div className="h-full w-1/2">
              <h1 className="m-2 text-lg font-semibold">Past</h1>
              <EventGrid
                loading={loading.createdPastEventsLoading}
                rows={createdPastEvents}
              />
            </div>
            <div className="h-full w-1/2">
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
          onClick={() => setShowRegisteredEvents(!showRegisteredEvents)}
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
          <div className="flex">
            <div className="w-1/2 h-full">
              <h1 className="m-2 text-lg font-semibold">Past</h1>
              <EventGrid
                loading={loading.registeredPastEventsLoading}
                rows={registeredPastEvents}
              />
            </div>
            <div className="w-1/2 h-full">
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
