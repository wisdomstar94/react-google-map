"use client"
import { GoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.component";
import { IGoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.interface";
import { useEffect, useMemo, useState } from "react";

export default function GeoFancePage() {
  const [marketItems, setMarkerItems] = useState<IGoogleMapTuning.MarkerItem[]>();
  const [modes, setModes] = useState<IGoogleMapTuning.Mode[]>();
  const apiOptions = useMemo<IGoogleMapTuning.ApiOptions>(() => ({
    id: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID ?? '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
    libraries: ['visualization'],
  }), []);

  useEffect(() => {
    setModes([
      'geo-fence',
    ]);
  }, []);

  return (
    <>
      <h1>
        geo-fance
      </h1>
      <GoogleMapTuning 
        apiOptions={apiOptions}
        markerItems={marketItems}
        onMarkerItemsChange={setMarkerItems}
        modes={modes}
        onModesChange={setModes}
        onPointCircleOptionsChange={(pointCircleOptions) => {}}
        />
    </>
  );
}