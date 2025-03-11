"use client";

import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MultiLevelDropdown from "@/app/ui/dashboard/MultiLevelDropdown";
import { createSchema } from "@/app/schemas/schemas";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

const defaultLocation = "City Park MiniArena - artificial grass football pitch";
const defaultCoordinates = { lat: 47.5084941, lng: 19.086084 };

export default function CreateForm({ coordinates, setCoordinates }) {
  const axiosPrivate = useAxiosPrivate();
  const [autocomplete, setAutocomplete] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [selectedSport, setSelectedSport] = useState({
    category: "",
    name: "",
  });
  const [location, setLocation] = useState(defaultLocation);

  const handleOnLoad = (auto) => {
    setAutocomplete(auto);
  };

  const handleOnPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation(place.name);
        setCoordinates({ lat, lng });
        console.log("Selected Address:", place.name);
        console.log("Coordinates:", lat, lng);
      }
    }
  };

  async function handleAction(formData) {
    let data = {
      ...Object.fromEntries(formData),
      location: {
        name: location,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      },
      startsAt: dateTime.toISOString(),
      sport: selectedSport,
      teamNumber: selectedSport.category === "Group Sports" ? 0 : 2,
      playerNumber:
        selectedSport.category === "Individual Sports"
          ? 1
          : Number(formData.get("playerNumber")),
    };

    const validatedData = createSchema.safeParse(data);

    if (!validatedData.success) {
      console.log(validatedData.error);
      return;
    }

    try {
      const response = await axiosPrivate.post(
        "/events/create",
        validatedData.data
      );
    } catch (err) {
      console.error("ERROR CREATING EVENT" + err);
    } finally {
      setLocation(defaultLocation);
      setCoordinates(defaultCoordinates);
      setDateTime(null);
      setSelectedSport({
        category: "",
        name: "",
      });
    }
  }

  return (
    <form action={handleAction} className="space-y-4 pr-2.5 text-gray-800">
      <div>
        <label htmlFor="sport" className="text-gray-600 mb-0.5 block">
          <abbr title="required" className="cursor-help">
            *
          </abbr>{" "}
          Sport
        </label>
        <MultiLevelDropdown
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
        />
      </div>
      <div>
        <label htmlFor="title" className="text-gray-600 mb-0.5 block">
          <abbr title="required" className="cursor-help">
            *
          </abbr>{" "}
          Title
        </label>
        <input
          name="title"
          type="text"
          className="w-full py-[9px] px-1.5 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-800
              focus:border-blue-600"
          maxLength={50}
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="text-gray-600  mb-0.5 block">
          <abbr title="required" className="cursor-help">
            *
          </abbr>{" "}
          Location
        </label>
        <Autocomplete
          onLoad={handleOnLoad}
          onPlaceChanged={handleOnPlaceChanged}
          fields={["name", "geometry.location", "formatted_address"]}
        >
          <input
            name="location"
            type="text"
            placeholder=""
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full py-[9px] px-2.5 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-800
                        focus:border-blue-600"
          />
        </Autocomplete>
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-gray-600 mb-0.5 block text-sm"
        >
          <abbr title="required" className="cursor-help">
            *
          </abbr>{" "}
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className="w-full py-2 px-1.5 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-800 focus:border-blue-600 h-24"
          maxLength={500}
          required
        ></textarea>
      </div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Start At"
            value={dateTime}
            onChange={(newValue) => setDateTime(newValue)}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>
      </div>

      <div className="md:flex md:space-x-10">
        <div>
          <label
            htmlFor="teamNumber"
            className="text-gray-600 mb-1 block text-sm"
          >
            Team Number
          </label>
          <input
            name="teamNumber"
            id="teamNumber"
            className="py-2 px-1.5 w-28 rounded-md border  text-sm outline-none placeholder:text-gray-800 
                text-gray-500 bg-gray-200 border-gray-200 cursor-not-allowed"
            disabled
            value={
              selectedSport.category === "Group Sports" ? "No teams" : "2 Teams"
            }
          ></input>
        </div>

        <div>
          <label
            htmlFor="playerNumber"
            className="text-gray-600 mb-1 block text-sm"
          >
            Players per Team
          </label>
          {selectedSport.category === "Group Sports" && (
            <input
              type="number"
              name="playerNumber"
              id="playerNumber"
              className="py-2 px-1.5 w-28 rounded-md border border-gray-300 text-sm outline-none"
              min={1}
              max={100}
              required
            />
          )}
          {selectedSport.category === "Team Sports" && (
            <select
              name="playerNumber"
              id="playerNumber"
              className="py-2 px-1.5 w-28 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-800 focus:border-blue-600"
              required
            >
              <option value="" disabled>
                Choose an option
              </option>
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <option key={num} value={num}>
                  {num} players
                </option>
              ))}
            </select>
          )}
          {selectedSport.category === "Individual Sports" && (
            <input
              name="teamNumber"
              id="teamNumber"
              className="py-2 px-1.5 w-28 rounded-md border  text-sm outline-none placeholder:text-gray-800 
                text-gray-500 bg-gray-200 border-gray-200 cursor-not-allowed"
              disabled
              value="1 player"
              hidden={selectedSport.category !== "Individual Sports"}
            ></input>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded-lg text-lg font-semibold text-white cursor-pointer active:bg-blue-500 hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
