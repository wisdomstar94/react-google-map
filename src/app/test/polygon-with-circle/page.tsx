"use client"
import { GoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.component";
import { IGoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.interface";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [marketItems, setMarkerItems] = useState<IGoogleMapTuning.MarkerItem[]>();
  const [polygonWithCircleOptions, setPolygonWithCircleOptions] = useState<IGoogleMapTuning.PolygonWithCircleOptions>();
  const apiOptions = useMemo<IGoogleMapTuning.ApiOptions>(() => ({
    id: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID ?? '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
    libraries: ['visualization'],
  }), []);

  useEffect(() => {
    setPolygonWithCircleOptions({
      center: { lat: 37.5076069, lng: 127.0605808 },
      radius: 1500,
    });
  }, []);

  return (
    <>
      <h1>
        polygon-with-circle
      </h1>
      <div>
        <div>
          <label>위도(lat)</label>
          <input type="text" value={polygonWithCircleOptions?.center.lat ?? ''} onChange={(e) => {
            const value = e.target.value;
            setPolygonWithCircleOptions((prev) => {
              return {
                ...(prev ?? {}),
                center: {
                  ...prev?.center,
                  lat: Number(value),
                },
              };
            });
          }} />
        </div>
        <div>
          <label>경도(lng)</label>
          <input type="text" value={polygonWithCircleOptions?.center.lng ?? ''} onChange={(e) => {
            const value = e.target.value;
            setPolygonWithCircleOptions((prev) => {
              return {
                ...(prev ?? {}),
                center: {
                  ...prev?.center,
                  lng: Number(value),
                }
              };
            });
          }} />
        </div>
        <div>
          <label>반경(radius)</label>
          <input type="text" value={polygonWithCircleOptions?.radius ?? ''} onChange={(e) => {
            const value = e.target.value;
            setPolygonWithCircleOptions((prev) => {
              return {
                ...prev,
                center: {
                  ...prev?.center,
                },
                radius: Number(value),
              };
            });
          }} />
        </div>
      </div>
      <GoogleMapTuning 
        apiOptions={apiOptions}
        containerStyle={{
          height: 600,
        }}
        markerItems={marketItems}
        onMarkerItemsChange={setMarkerItems}
        modes={['polygon-with-circle']} 
        // fitBounds={}
        // defaultMarkerIcon={(item, index) => {
        //   return {
        //     anchor: [12, 12],
        //     scaledSize: [32, 32],
        //     url: '/circle.svg',
        //   };
        // }}
        defaultMarkerLabel={(item, index) => {
          return {
            text: index.toString(),
            color: '#fff',
            fontSize: '12px',
          };
        }}
        polygonWithCircleOptions={polygonWithCircleOptions}
        onPolygonWithCircleOptionsChange={setPolygonWithCircleOptions}
        />
    </>
  );
}