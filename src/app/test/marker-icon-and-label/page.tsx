"use client"
import { useState, useEffect, useMemo } from "react";
import { GoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.component";
import { IGoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.interface";

export default function MarkerAndLayerPage() {
  const [marketItems, setMarkerItems] = useState<IGoogleMapTuning.MarkerItem[]>();
  const infoWindowOptions = useMemo<google.maps.InfoWindowOptions>(() => {
    return {
      disableAutoPan: true, // info box 의 anchor 로 할당된 마커가 이동해도 이동한 마커를 계속 따라가는 것을 비활성화 할 것인지에 대한 옵션 값. (default false)
    };
  }, []);
  const apiOptions = useMemo<IGoogleMapTuning.ApiOptions>(() => ({
    id: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID ?? '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
    libraries: ['visualization'],
  }), []);

  useEffect(() => {
    setMarkerItems([
      {
        id: 'first',
        position: {
          lat: 37.5076069,
          lng: 127.0605808, 
        },
        infoWindowOptions,
        infoWindowContent: 'one',
        label: {
          text: `first`,
          color: `#fff`,
          fontSize: `16px`,
        },
        // icon: {
        //   url: `/circle.svg`,
        //   anchor: [12, 12],
        //   scaledSize: [80, 80],
        // },
      },
      {
        id: 'second',
        position: {
          lat: 37.5206069,
          lng: 127.0885808, 
        },
        infoWindowOptions,
        infoWindowContent: 'two',
        label: {
          text: `second`,
          color: `#fff`,
          fontSize: `16px`,
        },
        // icon: {
        //   url: `/circle.svg`,
        //   anchor: [12, 12],
        //   scaledSize: [80, 80],
        // },
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        marker-and-layer
      </h1>
      <div>
        <GoogleMapTuning
          apiOptions={apiOptions}
          containerStyle={{
            height: '600px',
          }}
          markerItems={marketItems}
          onMarkerItemsChange={setMarkerItems}
          onModesChange={(modes) => {}}
          onPointCircleOptionsChange={(pointCircleOptions) => {}} />
      </div>
    </>
  )
}