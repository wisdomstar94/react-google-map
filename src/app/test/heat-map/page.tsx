"use client"
import { useState, useEffect, useMemo } from "react";
import { GoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.component";
import { IGoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.interface";
import { getRandomInteger } from "@/functions/common.function";

export default function Page() {
  const [heatMapItems, setHeatMapItems] = useState<IGoogleMapTuning.HeatMapItem[]>();
  const apiOptions = useMemo<IGoogleMapTuning.ApiOptions>(() => ({
    id: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID ?? '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
    libraries: ['visualization'],
  }), []);

  useEffect(() => {
    const interval = setInterval(() => {
      const values: IGoogleMapTuning.HeatMapItem[] = [];
      Array.from({ length: 55 }).forEach((v, i) => {
        values.push({ position: { lat: Number(`37.5${getRandomInteger(10, 30)}6069`), lng: Number(`127.0${getRandomInteger(60, 90)}5808`) }, weight: getRandomInteger(0, 5), });
      });
      setHeatMapItems(values);
    }, 1000);  
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <h1>
        heat-map
      </h1>
      <GoogleMapTuning 
        apiOptions={apiOptions}
        heatMapItems={heatMapItems}
        modes={['heat-map']}
        />
    </>
  );
}