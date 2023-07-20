"use client"
import { GoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.component";
import { IGoogleMapTuning } from "@/components/google-map-tuning/google-map-tuning.interface";
import { getRandomInteger } from "@/functions/common.function";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Page() {
  const apiOptions = useMemo<IGoogleMapTuning.ApiOptions>(() => ({
    id: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_ID ?? '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '',
    libraries: ['visualization'],
  }), []);

  const [polygonItems, setPolygonItems] = useState<IGoogleMapTuning.PolygonItem[]>([]);

  const [geoJsonData, setGeoJsonData] = useState<any>();

  const isCallingRef = useRef<boolean>(false);

  function call() {
    if (isCallingRef.current) return;

    isCallingRef.current = true;
    axios.get(process.env.NEXT_PUBLIC_GEO_JSON_URL ?? '/').then(res => {
      const data = res.data;
      setGeoJsonData(data);

      const features = data.features;
      const _polygonItems: IGoogleMapTuning.PolygonItem[] = [];
      for (const item of features) {
        const {
          geometry,
          properties,
          type,
        } = item;
        if (geometry === null) {
          continue;
        }
        const coordinates = geometry.coordinates;
        // console.log('@@@@@coordinates[0]', coordinates[0]);
        if (coordinates[0] === undefined) {
          continue;
        }

        const polygonItem: IGoogleMapTuning.PolygonItem = {
          id: properties.ADM_CD + '_' + properties.TOT_REG_CD,
          data: properties,
          // bgColor: `rgb(${getRandomInteger(0, 255)}, ${getRandomInteger(0, 255)}, ${getRandomInteger(0, 255)})`,
          coordinates: coordinates[0].map((coordinate: [number, number][]) => {
            return {
              lat: coordinate[1],
              lng: coordinate[0],
            };
          }),
          polygonOptions: {
            fillColor: `rgb(${getRandomInteger(0, 255)}, ${getRandomInteger(0, 255)}, ${getRandomInteger(0, 255)})`,
            fillOpacity: 0.4,
            strokeColor: `#999`,
            strokeOpacity: 0.5,
            strokeWeight: 1,
            clickable: true,
            draggable: false,
            editable: false,
            geodesic: false,
            zIndex: 1
          },
        };
        _polygonItems.push(polygonItem);
      }
      setPolygonItems(_polygonItems);
    }).finally(() => {
      isCallingRef.current = false;
    });
  }

  useEffect(() => {
    call();
  }, []);

  return (
    <>
      <h1>
        multiple-polygon
      </h1>
      <GoogleMapTuning 
        apiOptions={apiOptions}
        containerStyle={{
          height: 600,
        }}
        onMarkerItemsChange={() => {}}
        modes={['multiple-polygon']}
        polygonItems={polygonItems}
        onPointCircleOptionsChange={(pointCircleOptions) => {}}
        onPolygonWithCircleOptionsChange={() => {}}
        onPolygonMouseOver={(item) => {
          console.log('@onPolygonMouseOver.item', item);
          setPolygonItems(prev => prev.map(x => {
            if (x.id !== item.id) {
              return x;
            }
            return {
              ...x,
              // refreshKey: Date.now().toString(),
              polygonOptions: {
                ...x.polygonOptions,
                fillOpacity: 1,
              },
            };
          }));
        }}
        onPolygonMouseOut={(item) => {
          console.log('@onPolygonMouseOut.item', item);
          setPolygonItems(prev => prev.map(x => {
            if (x.id !== item.id) {
              return x;
            }
            return {
              ...x,
              // refreshKey: Date.now().toString(),
              polygonOptions: {
                ...x.polygonOptions,
                fillOpacity: 0.4,
              },
            };
          }));
        }}
        onPolygonMouseClick={(item) => {
          console.log('@onPolygonMouseClick.item', item);
        }}
        />
    </>
  );
}