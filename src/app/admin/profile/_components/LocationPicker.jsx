"use client";

import { useCallback, useState, useRef } from "react";
import { Input, Spin } from "antd";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const libraries = ["places"];

export default function LocationPicker({ latitude, longitude, onChange }) {
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const center =
    latitude && longitude
      ? { lat: latitude, lng: longitude }
      : { lat: 23.8103, lng: 90.4125 }; // Dhaka default

  const onMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onChange?.({ lat, lng });
    },
    [onChange],
  );

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    onChange?.({ lat, lng, address });
    map?.panTo({ lat, lng });
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500">
        Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50">
        <Spin />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Autocomplete
        onLoad={(ac) => (autocompleteRef.current = ac)}
        onPlaceChanged={onPlaceChanged}
      >
        <Input
          size="large"
          placeholder="Search location..."
          className="!rounded-lg"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "280px",
          borderRadius: 12,
        }}
        center={center}
        zoom={14}
        onLoad={setMap}
        onClick={onMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {latitude && longitude && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            draggable
            onDragEnd={(e) => {
              onChange?.({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              });
            }}
          />
        )}
      </GoogleMap>

      {latitude && longitude && (
        <p className="text-xs text-slate-400">
          Lat: {latitude.toFixed(5)} · Lng: {longitude.toFixed(5)} · Click map
          or drag marker to update
        </p>
      )}
    </div>
  );
}
