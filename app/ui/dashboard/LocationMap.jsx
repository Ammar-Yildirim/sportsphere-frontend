"use client";

import React from 'react';
import {GoogleMap, Marker  } from '@react-google-maps/api';

const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 47.508494, lng: 19.0860844 };

export default function LocationMap({coordinates, zoom}){
    const coords = coordinates && coordinates.lat && coordinates.lng 
        ? coordinates 
        : defaultCenter;

    const parsedCoords = {
      lat: parseFloat(coords.lat),
      lng: parseFloat(coords.lng)
    }

    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: parsedCoords.lat, lng: parsedCoords.lng }}
        zoom={zoom}
        options={{
          gestureHandling: "greedy",
          disableDefaultUI: true
        }}
      >
        <Marker position={parsedCoords} />
      </GoogleMap>
    );
}