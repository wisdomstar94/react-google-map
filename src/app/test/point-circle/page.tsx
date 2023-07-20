"use client"

import { GoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.component";
import { IGoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.interface";
import { useMemo, useState } from "react";

export default function Page() {
  const apiOptions = useMemo<IGoogleMapTuning.ApiOptions>(() => ({
    id: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID ?? '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
    libraries: ['visualization'],
  }), []);
  const [markerItems, setMarkerItems] = useState<IGoogleMapTuning.MarkerItem[]>();
  const [pointCircleOptions, setPointCircleOptions] = useState<google.maps.CircleOptions | undefined>({
    radius: 2000,
  });

  return (
    <>
      <div className="w-full relative">
        <GoogleMapTuning
          apiOptions={apiOptions}
          containerStyle={{
            width: '100%',
            height: '300px',
          }}
          modes={['point-circle']}
          markerItems={markerItems}
          onMarkerItemsChange={setMarkerItems}
          pointCircleOptions={pointCircleOptions}
          onPointCircleOptionsChange={setPointCircleOptions}
          />
      </div>
      <div className="w-full relative">
        <input 
          type="range" 
          defaultValue={20} 
          onChange={(event) => {
            setPointCircleOptions(prev => ({
              ...prev,
              radius: Number(event.target.value) * 100,
            }));
          }} 
          />
      </div>
    </>
  );
}
