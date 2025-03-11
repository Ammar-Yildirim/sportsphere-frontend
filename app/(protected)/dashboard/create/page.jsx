"use client";

import React, { useState } from "react";
import LocationMap from "@/app/ui/dashboard/LocationMap";
import CreateForm from "@/app/ui/dashboard/create/CreateForm";

export default function Page() {
  const [coordinates, setCoordinates] = useState({ lat: 47.5084941, lng: 19.086084 });

  return (
    <div className="flex p-6 w-full ">
      <div className="w-1/2 overflow-y-auto z-1">
        <h1 className="my-2.5 text-3xl font-semibold">Start a game</h1>
        <CreateForm setCoordinates={setCoordinates} coordinates={coordinates} />
      </div>
      <div className="w-1/2 h-full z-0">
        <LocationMap coordinates={coordinates} zoom={17} />
      </div>
    </div>
  );
}
