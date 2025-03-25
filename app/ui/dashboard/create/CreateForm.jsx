"use client";

import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MultiLevelDropdown from "@/app/ui/dashboard/MultiLevelDropdown";
import { createSchema } from "@/app/schemas/schemas";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/app/ui/dashboard/ErrorMessage";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const defaultLocation = {
  name: "City Park MiniArena - artificial grass football pitch",
  latitude: 47.508494,
  longitude: 19.086084,
  formattedAddress: "Budapest, 1146 Hungary",
  country: "Hungary",
  city: "Budapest",
};
const defaultCoordinates = { lat: 47.508494, lng: 19.086084 };

export default function CreateForm({ coordinates, setCoordinates }) {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const [autocomplete, setAutocomplete] = useState(null);

  const [formState, setFormState] = useState({
    dateTime: null,
    sport: {
      category: "",
      name: "",
    },
    location: defaultLocation,
    errors: {},
    title: "",
    description: "",
    playerNumber: "",
  });

  const updateFormField = (field, value) => {
    console.log(`${field} ${value}`)
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFieldError = (field) => {
    if (formState.errors[field]) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: null,
        },
      }));
    }
  };

  const handleOnLoad = (auto) => {
    setAutocomplete(auto);
  };

  const handleOnPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        let country = "";
        let city = "";
        place.address_components.forEach((component) => {
          if (component.types.includes("country")) {
            country = component.long_name;
          }
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
        });

        const newLocation = {
          name: place.name,
          latitude: lat,
          longitude: lng,
          formattedAddress: place.formatted_address || "",
          country: country || "",
          city: city || "",
        };

        updateFormField("location", newLocation);
        setCoordinates({ lat, lng });
      }
    }
  };

  async function handleAction(formDataObj) {
    const formData = Object.fromEntries(formDataObj);

    let data = {
      ...formData,
      locationDTO: {
        name: formState.location.name,
        latitude: formState.location.latitude,
        longitude: formState.location.longitude,
        formattedAddress: formState.location.formattedAddress,
        city: formState.location.city,
        country: formState.location.country,
      },
      startsAt: formState.dateTime ? dayjs(formState.dateTime).utc().toISOString() : null,
      sport: formState.sport,
      teamNumber: formState.sport.category === "Group Sports" ? 0 : 2,
      playerNumber:
        formState.sport.category === "Individual Sports"
          ? 1
          : Number(formData.playerNumber),
    };

    const validatedData = createSchema.safeParse(data);

    if (!validatedData.success) {
      const formattedErrors = {};
      validatedData.error.errors.forEach((err) => {
        const field = err.path[0];
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        formattedErrors[field].push(err.message);
      });

      updateFormField("errors", formattedErrors);
      return;
    }

    try {
      const { data } = await axiosPrivate.post(
        "/events/create",
        validatedData.data
      );
      router.push(`/dashboard/event/${data}`);
    } catch (err) {
      console.error("ERROR CREATING EVENT" + err);
      if (err.response && err.response.data && err.response.data.errors) {
        updateFormField("errors", err.response.data.errors);
      } else {
        updateFormField("errors", { form: ["An unexpected error occurred."] });
      }
    } finally {
      if (!formState.errors.form) {
        setFormState({
          dateTime: null,
          sport: {
            category: "",
            name: "",
          },
          location: defaultLocation,
          errors: {},
          title: "",
          description: "",
          playerNumber: "",
        });
        setCoordinates(defaultCoordinates);
      }
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
          selectedSport={formState.sport}
          setSelectedSport={(sport) => {
            updateFormField("sport", sport);
            clearFieldError("sport");
          }}
        />
        <ErrorMessage fieldName="sport" errors={formState.errors} />
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
          value={formState.title}
          onChange={(e) => {
            updateFormField("title", e.target.value);
            clearFieldError("title");
          }}
        />
        <ErrorMessage fieldName="title" errors={formState.errors} />
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
          fields={[
            "name",
            "geometry.location",
            "formatted_address",
            "address_components",
          ]}
        >
          <input
            name="location"
            type="text"
            placeholder=""
            value={formState.location.name}
            onChange={(e) => {
              updateFormField("location", {
                ...formState.location,
                name: e.target.value,
              });
              clearFieldError("locationDTO");
            }}
            className="w-full py-[9px] px-2.5 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-800
                        focus:border-blue-600"
          />
        </Autocomplete>
        <ErrorMessage fieldName="locationDTO" errors={formState.errors} />
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
          value={formState.description}
          onChange={(e) => {
            updateFormField("description", e.target.value);
            clearFieldError("description");
          }}
        ></textarea>
        <ErrorMessage fieldName="description" errors={formState.errors} />
      </div>
      <div>
      <label
          htmlFor="dateTime"
          className="text-gray-600 mb-0.5 block text-sm"
        >
          <abbr title="required" className="cursor-help">
            *
          </abbr>{" "}
          Starts At
        </label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            id="dateTime"
            value={formState.dateTime}
            onChange={(newValue) => {
              updateFormField("dateTime",  newValue ? dayjs(newValue) : null);
              clearFieldError("startsAt");
            }}
            slotProps={{ textField: { size: "small" } }}
            localeDatePickerProps={{
              disableTimezone: true
            }}
            timezone="UTC"
          />
        </LocalizationProvider>
        <ErrorMessage fieldName="startsAt" errors={formState.errors} />
      </div>

      <div className="md:flex md:space-x-10">
        <div>
          <label
            htmlFor="teamNumber"
            className="text-gray-600 mb-1 block text-sm"
          >
            <abbr title="required" className="cursor-help">
              *
            </abbr>{" "}
            Team Number
          </label>
          <input
            name="teamNumber"
            id="teamNumber"
            className="py-2 px-1.5 w-28 rounded-md border  text-sm outline-none placeholder:text-gray-800 
                text-gray-500 bg-gray-200 border-gray-200 cursor-not-allowed"
            disabled
            value={
              formState.sport.category === "Group Sports"
                ? "No teams"
                : "2 Teams"
            }
          ></input>
          <ErrorMessage fieldName="teamNumber" errors={formState.errors} />
        </div>

        <div>
          <label
            htmlFor="playerNumber"
            className="text-gray-600 mb-1 block text-sm"
          >
            <abbr title="required" className="cursor-help">
              *
            </abbr>{" "}
            Players per Team
          </label>
          {formState.sport.category === "Group Sports" && (
            <input
              type="number"
              name="playerNumber"
              id="playerNumber"
              className="py-2 px-1.5 w-28 rounded-md border border-gray-300 text-sm outline-none"
              min={1}
              max={100}
              required
              value={formState.playerNumber}
              onChange={(e) => {
                updateFormField("playerNumber", e.target.value);
                clearFieldError("playerNumber");
              }}
            />
          )}
          {formState.sport.category === "Team Sports" && (
            <select
              name="playerNumber"
              id="playerNumber"
              className="py-2 px-1.5 w-28 rounded-md border border-gray-300 text-sm outline-none placeholder:text-gray-800 focus:border-blue-600"
              required
              value={formState.playerNumber}
              onChange={(e) => {
                updateFormField("playerNumber", e.target.value);
                clearFieldError("playerNumber");
              }}
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
          {formState.sport.category === "Individual Sports" && (
            <input
              name="teamNumber"
              id="teamNumber"
              className="py-2 px-1.5 w-28 rounded-md border  text-sm outline-none placeholder:text-gray-800 
                text-gray-500 bg-gray-200 border-gray-200 cursor-not-allowed"
              disabled
              value="1 player"
              hidden={formState.sport.category !== "Individual Sports"}
            ></input>
          )}
          <ErrorMessage fieldName="playerNumber" errors={formState.errors} />
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
