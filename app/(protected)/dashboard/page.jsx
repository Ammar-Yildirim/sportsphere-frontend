"use client";

import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { useState } from "react";
import EventGrid from "@/app/ui/dashboard/EventGrid";
import EventLineChart from "@/app/ui/dashboard/EventLineChart";
import { ChevronDownIcon, CalendarIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

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
  const [activeCreatedTab, setActiveCreatedTab] = useState('upcoming');
  const [activeRegisteredTab, setActiveRegisteredTab] = useState('upcoming');

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
  
  const renderCreatedEvents = () => {
    if (activeCreatedTab === 'upcoming') {
      return loading.createdUpcomingEventsLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : createdUpcomingEvents.rows.length > 0 ? (
        <EventGrid
          loading={loading.createdUpcomingEventsLoading}
          rows={createdUpcomingEvents.rows}
          eventToParticipationCount={createdUpcomingEvents.eventToParticipationCount}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-2">No upcoming events created</div>
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md font-medium text-sm hover:bg-blue-200 transition">
            Create an event
          </button>
        </div>
      );
    } else {
      return loading.createdPastEventsLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : createdPastEvents.length > 0 ? (
        <EventGrid
          loading={loading.createdPastEventsLoading}
          rows={createdPastEvents}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-2">No past events created</div>
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md font-medium text-sm hover:bg-blue-200 transition">
            Create an event
          </button>
        </div>
      );
    }
  };

  const renderRegisteredEvents = () => {
    if (activeRegisteredTab === 'upcoming') {
      return loading.registeredUpcomingEventsLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : registeredUpcomingEvents.rows.length > 0 ? (
        <EventGrid
          loading={loading.registeredUpcomingEventsLoading}
          rows={registeredUpcomingEvents.rows}
          eventToParticipationCount={registeredUpcomingEvents.eventToParticipationCount}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-2">No upcoming registered events</div>
          <button className="px-4 py-2 bg-green-100 text-green-600 rounded-md font-medium text-sm hover:bg-green-200 transition">
            Browse events
          </button>
        </div>
      );
    } else {
      return loading.registeredPastEventsLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : registeredPastEvents.length > 0 ? (
        <EventGrid
          loading={loading.registeredPastEventsLoading}
          rows={registeredPastEvents}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-2">No past registered events</div>
          <button className="px-4 py-2 bg-green-100 text-green-600 rounded-md font-medium text-sm hover:bg-green-200 transition">
            Browse events
          </button>
        </div>
      );
    }
  };

  return (
    <div className="overflow-y-auto md:w-[calc(100%-16rem)] p-6 bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-left w-full text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">
            <CalendarIcon className="w-6 h-6" />
          </span>
          2025 Monthly Event Participation
        </h1>
        <div className="bg-gray-50 p-4 rounded-lg">
          <EventLineChart />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={handleCreatedEventsClick}
            className="w-full flex items-center justify-between text-left text-xl font-semibold p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white focus:outline-none cursor-pointer"
          >
            <div className="flex items-center">
              <PlusCircleIcon className="w-6 h-6 mr-2" />
              <span>Created Events</span>
            </div>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform duration-200 ${
                showCreatedEvents ? "transform rotate-180" : ""
              }`}
            />
          </button>
          
          {showCreatedEvents && (
            <div className="p-4">
              <div className="flex border-b border-gray-200">
                <button 
                  className={`px-4 py-2 font-medium text-sm ${
                    activeCreatedTab === 'upcoming' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveCreatedTab('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={`px-4 py-2 font-medium text-sm ${
                    activeCreatedTab === 'past' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveCreatedTab('past')}
                >
                  Past
                </button>
              </div>
              
              <div className="mt-4">
                {renderCreatedEvents()}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={handleRegisteredEventsClick}
            className="w-full flex items-center justify-between text-left text-xl font-semibold p-4 bg-gradient-to-r from-green-500 to-green-600 text-white focus:outline-none cursor-pointer"
          >
            <div className="flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2" />
              <span>Registered Events</span>
            </div>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform duration-200 ${
                showRegisteredEvents ? "transform rotate-180" : ""
              }`}
            />
          </button>
          
          {showRegisteredEvents && (
            <div className="p-4">
              <div className="flex border-b border-gray-200">
                <button 
                  className={`px-4 py-2 font-medium text-sm cursor-pointer ${
                    activeRegisteredTab === 'upcoming' 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveRegisteredTab('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={`px-4 py-2 font-medium text-sm cursor-pointer ${
                    activeRegisteredTab === 'past' 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveRegisteredTab('past')}
                >
                  Past
                </button>
              </div>
              
              <div className="mt-4">
                {renderRegisteredEvents()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}