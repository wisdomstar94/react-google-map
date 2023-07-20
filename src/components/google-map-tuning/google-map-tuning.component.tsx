import { CircleF, GoogleMap, InfoWindowF, MarkerF, PolygonF, useJsApiLoader, MarkerClustererF, HeatmapLayer } from "@react-google-maps/api";
import { ChangeEvent, CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { IGoogleMapTuning } from "./google-map-tuning.interface";
import styles from './google-map-tuning.module.css';
import { geoCircle } from 'd3';

export const containerStyleDefault: CSSProperties = {
  width: '100%',
  height: '300px',
};

export const zoomDefault = 12;

export const polygonOptionsDefault = {
  fillColor: "red",
  fillOpacity: 0.4,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
};

export const pointCircleOptionsDefault = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 2000,
  zIndex: 1
};

export const mapOptionsDefault = {
  fullscreenControl: false,
  gestureHandling: 'cooperative',
  keyboardShortcuts: false,
  mapTypeControl: false,
  streetViewControl: false,
};

export const centerDefault = {
  lat: 37.5076069,
  lng: 127.0605808,
};

export const clusterOptionsDefault: IGoogleMapTuning.ClustererOptions = {
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
  enableRetinaIcons: true,
  averageCenter: true,
};

export function GoogleMapTuning<T = any>(props: IGoogleMapTuning.Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiOptions = props.apiOptions;
  const mapOptions = useMemo(() => props.mapOptions ?? mapOptionsDefault, [props.mapOptions]);
  const clusterOptions = useMemo(() => props.clusterOptions ?? clusterOptionsDefault, [props.clusterOptions]);
  const modes = useMemo(() => props.modes, [props.modes]);
  const disableFitBounds = useMemo(() => props.disableFitBounds ?? false, [props.disableFitBounds]);
  const latLngFixedCount = useMemo(() => props.latLngFixedCount ?? 6, [props.latLngFixedCount]);
  const showModeButtons = useMemo(() => props.showModeButtons, [props.showModeButtons]);
  const disable = useMemo(() => props.disable ?? false, [props.disable]);
  const enableMarkerCluster = useMemo(() => props.enableMarkerCluster ?? false, [props.enableMarkerCluster]);
  const [isMarkerDragging, setIsMarkerDragging] = useState<boolean>(false);
  const {
    defaultMarkerLabel,
    defaultMarkerIcon,
    onMarkerItemsChange,
    onModesChange,
    onPointCircleOptionsChange,
    polygonWithCircleOptions,
    infoWindowItems,
    onPolygonMouseOver,
    onPolygonMouseOut,
    onPolygonMouseClick,
  } = props;
  const fitBounds = useMemo(() => {
    if (isMarkerDragging) return undefined;
    return props.fitBounds;
  } ,[isMarkerDragging, props.fitBounds]);
  const polygonOptions = useMemo<google.maps.PolygonOptions>(() => {
    if (props.polygonOptions === undefined) {
      return polygonOptionsDefault;
    }
    return {
      ...polygonOptionsDefault,
      ...props.polygonOptions,
    };
  }, [props.polygonOptions]);
  const polygonWithCircleOptionsPrev = useRef<IGoogleMapTuning.PolygonWithCircleOptions | undefined>();
  const polygonWithCircleOptionsPrevSnapshot = useRef<IGoogleMapTuning.PolygonWithCircleOptions | undefined>();
  const pointCircleOptions = useMemo<google.maps.CircleOptions>(() => {
    if (props.pointCircleOptions === undefined) {
      return pointCircleOptionsDefault;
    }
    return {
      ...pointCircleOptionsDefault,
      ...props.pointCircleOptions,
    };
  }, [props.pointCircleOptions]);
  const heatMapItems = useMemo(() => props.heatMapItems, [props.heatMapItems]);
  const markerItems = useMemo(() => props.markerItems, [props.markerItems]);
  const polygonItems = useMemo(() => props.polygonItems, [props.polygonItems]);
  const containerStyle = useMemo(() => props.containerStyle ?? containerStyleDefault, [props.containerStyle]);
  const center = useMemo(() => props.center ?? centerDefault, [props.center]);
  const zoom = useMemo(() => props.zoom ?? zoomDefault, [props.zoom]);
  
  const { isLoaded, loadError } = useJsApiLoader(apiOptions);

  const markers = useRef<Map<string, google.maps.Marker>>(new Map());
  const prevMarkerItems = useRef<IGoogleMapTuning.MarkerItem[] | undefined>();
  const prevMarkerItemsSnapshot = useRef<IGoogleMapTuning.MarkerItem[] | undefined>();

  const prevMouseOveredPolygonItem = useRef<IGoogleMapTuning.PolygonItem>();
  const prevMouseOutedPolygonItem = useRef<IGoogleMapTuning.PolygonItem>();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerDraggable = useMemo<boolean>(() => {
    if (typeof props.markerDraggable === 'boolean') return props.markerDraggable;
    if (modes?.includes('geo-fence')) return true;
    if (modes?.includes('point-circle')) return true;
    if (modes?.includes('polygon-with-circle')) return true;
    return false;
  }, [modes, props.markerDraggable]);

  const isValidPolygonWithCircleOptions = useMemo(() => {
    if (polygonWithCircleOptions === undefined) return false;
    if (polygonWithCircleOptions.center === undefined) return false;
    if (polygonWithCircleOptions.center.lat === undefined) return false;
    if (polygonWithCircleOptions.center.lng === undefined) return false;
    if (polygonWithCircleOptions.radius === undefined) return false;
    return true;
  }, [polygonWithCircleOptions]);

  function onPolygonWithCircleOptionsChange(polygonWithCircleOptions: IGoogleMapTuning.PolygonWithCircleOptions | undefined) {
    if (typeof props.onPolygonWithCircleOptionsChange === 'function') {
      props.onPolygonWithCircleOptionsChange(polygonWithCircleOptions);
    }
  }

  function onInfoWindowItemsChange(infoWindowItems: IGoogleMapTuning.InfoWindowItem[] | undefined) {
    if (typeof props.onInfoWindowItemsChange === 'function') {
      props.onInfoWindowItemsChange(infoWindowItems);
    }
  }

  function clearMarkerItems() {
    const prev = markerItems;
    const newValue = prev?.filter(x => x.isMustNotClear === true);
    if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
  }

  function onMapLoad(map: google.maps.Map) {
    setMap(map);
  }

  function onMapClick(e: google.maps.MapMouseEvent) {
    if (disable) return;

    const position = {
      lat: Number(e.latLng?.lat().toFixed(latLngFixedCount)) ?? 0,
      lng: Number(e.latLng?.lng().toFixed(latLngFixedCount)) ?? 0,
    };

    const prev = markerItems;
    if (modes?.includes('geo-fence')) {
      if (prev === undefined) {
        const newValue = [{
          position,
        }];
        if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
      } else {
        const newValue = prev.concat({
          position,
        });
        if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
      }
    } else if (modes?.includes('point-circle')) {
      clearMarkerItems();
      const newValue = [{
        position,
      }];
      if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
    } else if (modes?.includes('marker-pin-single')) {
      const newValue = (prev?.filter(x => x.isMustNotClear === true) ?? []).concat({
        position,
      });
      if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
    } else if (modes?.includes('polygon-with-circle')) {
      onPolygonWithCircleOptionsChange({
        ...polygonWithCircleOptions,
        center: position,
      });
    }
  }

  function onMarkerLoad(marker: google.maps.Marker, item: IGoogleMapTuning.MarkerItem, index: number) {
    markers.current.set(item?.id?.toString() ?? '', marker);
  }

  function onMarkerClick(e: google.maps.MapMouseEvent, item: IGoogleMapTuning.MarkerItem, index: number) {
    if (disable) return;

    const prev = markerItems;
    if (modes?.includes('geo-fence')) {
      if (prev === undefined) {
        if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange([]);
      } else {
        const newValue = prev.filter((x, i) => i !== index);
        if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
      }
    } else if (modes?.includes('polygon-with-circle')) {
      const newValue = prev?.filter((x, i) => i !== index);
      if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
    }

    if (item.infoWindowContent !== undefined && infoWindowItems?.find(x => x.id === item.id) === undefined) {
      onInfoWindowItemsChange(infoWindowItems?.concat({
        id: item.id,
        infoWindowOptions: item.infoWindowOptions,
        infoWindowContent: item.infoWindowContent,
      }));
    }

    if (typeof props.onMarkerClick === 'function') {
      props.onMarkerClick(item);
    }
  }

  function onMarkerDrag(e: google.maps.MapMouseEvent, item: IGoogleMapTuning.MarkerItem) {
    if (disable) return;

    const position = {
      lat: Number(e.latLng?.lat().toFixed(latLngFixedCount)) ?? 0,
      lng: Number(e.latLng?.lng().toFixed(latLngFixedCount)) ?? 0,
    };
    item.position = position;
    
    const prev = markerItems;

    if (prev === undefined) {
      if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange([]);
    } else {
      const newValue = prev.map((x) => {
        if (x === item) {
          return item;
        }
        return x;
      });
      if (modes?.includes('geo-fence') || modes?.includes('point-circle') || modes?.includes('polygon-with-circle')) {
        if (typeof onMarkerItemsChange === 'function') onMarkerItemsChange(newValue);
      } else if (modes?.includes('point-circle')) {
        if (typeof onPointCircleOptionsChange === 'function') {
          onPointCircleOptionsChange({
            ...(pointCircleOptions ?? {}),
            center: position,
          });
        }
      }
    }
  }

  function getPolygonCircleCoordinates(center: IGoogleMapTuning.Position, radius: number) {
    console.log('@getPolygonCircleCoordinates');
    const circle = geoCircle().center([center.lng, center.lat]).radius(radius / 110000);
    const coordinates = circle().coordinates;
    return coordinates[0];
  }

  function onPolygonCircleCenterMarkerDrag(e: google.maps.MapMouseEvent) {
    if (disable) return;

    const position = {
      lat: Number(e.latLng?.lat().toFixed(latLngFixedCount)) ?? 0,
      lng: Number(e.latLng?.lng().toFixed(latLngFixedCount)) ?? 0,
    };

    const diffLat = (polygonWithCircleOptionsPrevSnapshot.current?.center.lat ?? position.lat) - position.lat;
    const diffLng = (polygonWithCircleOptionsPrevSnapshot.current?.center.lng ?? position.lng) - position.lng;
    if (typeof onMarkerItemsChange === 'function') {
      onMarkerItemsChange(markerItems?.map((item, index) => {
        const prevSnapshotMarkerItem = prevMarkerItemsSnapshot.current?.find((k, i) => index === i);

        return {
          ...item,
          position: {
            lat: (prevSnapshotMarkerItem?.position.lat ?? 0) - diffLat,
            lng: (prevSnapshotMarkerItem?.position.lng ?? 0) - diffLng,
          },
        };
      }));
    }
    onPolygonWithCircleOptionsChange({
      ...polygonWithCircleOptions,
      center: {
        ...polygonWithCircleOptions?.center,
        lat: position.lat,
        lng: position.lng,
      },
    });
  }

  function getMarkerIndexWithoutMustNotClear(item: IGoogleMapTuning.MarkerItem) {
    let index = 0;
    markerItems?.filter(x => x.isMustNotClear !== true).forEach((inItem, inIndex) => {
      if (inItem === item) {
        index = inIndex;
      }
    });
    return index;
  }

  function convertMarkerIconToGoogleInterface(icon: IGoogleMapTuning.MarkerIcon | undefined): google.maps.Icon | undefined {
    if (icon === undefined) return undefined;
    return {
      url: icon.url,
      anchor: new google.maps.Point(icon.anchor[0], icon.anchor[1]),
      scaledSize: new google.maps.Size(icon.scaledSize[0], icon.scaledSize[1]),
    };
  }

  function getMarkerLabel(item: IGoogleMapTuning.MarkerItem, index: number): google.maps.MarkerLabel | undefined {
    if (modes?.includes('geo-fence')) {
      if (typeof defaultMarkerLabel === 'function') {
        return defaultMarkerLabel(item, index);
      }
      return {
        fontSize: '10px',
        color: '#fff',
        text: (getMarkerIndexWithoutMustNotClear(item) + 1).toString(),
      } as google.maps.MarkerLabel;
    }

    if (typeof defaultMarkerLabel === 'function') {
      return defaultMarkerLabel(item, index);
    }

    return item.label;
  }

  function getMarkerIcon(item: IGoogleMapTuning.MarkerItem, index: number): google.maps.Icon | undefined {
    if (item.icon !== undefined) {
      return convertMarkerIconToGoogleInterface(item.icon);
    }
    if (typeof defaultMarkerIcon === 'function') {
      return convertMarkerIconToGoogleInterface(defaultMarkerIcon(item, index));
    }
    return undefined;
  }

  function onClickFunctionButtons(mode: IGoogleMapTuning.Mode) {
    if (disable) return;

    const prev = modes;

    if (modes?.includes(mode)) {
      clearMarkerItems();
      if (prev === undefined) {
        if (typeof onModesChange === 'function') onModesChange([]);
      } else {
        if (typeof onModesChange === 'function') onModesChange(prev.filter(x => x !== mode));
      }
    } else {
      clearMarkerItems();
      if (typeof onModesChange === 'function') onModesChange([mode]);
    }
  }
  
  function onChangePointCircleRadius(e: ChangeEvent<HTMLInputElement>) {
    const prev = pointCircleOptions;
    const newValue: google.maps.CircleOptions = {
      ...prev,
      radius: Number(e.target.value),
    };
    if (typeof onPointCircleOptionsChange === 'function') onPointCircleOptionsChange(newValue);
  }

  function getHeatMapLayerData() {
    if (heatMapItems === undefined) {
      return [];
    }

    return heatMapItems.map((item) => {
      return { location: new google.maps.LatLng(item.position.lat, item.position.lng), weight: item.weight };
    });
  }

  const mapStatus = useMemo<IGoogleMapTuning.MapStatus>(() => {
    if (loadError !== undefined) {
      return 'error';
    }

    if (!isLoaded) {
      return 'loading';
    }

    return 'load-complete';
  }, [isLoaded, loadError]);

  const [isShowMarkerClusterer, setIsShowMarkerClusterer] = useState<boolean>(false);

  function clustererFn(clusterer: any): any {
    return (enableMarkerCluster ? markerItems : [])?.map((item, index) => {
      const key = index + JSON.stringify(item.position) + getMarkerIcon(item, index)?.url;
      return ( 
        <MarkerF
          key={key} 
          onLoad={(marker) => onMarkerLoad(marker, item, index)}
          icon={getMarkerIcon(item, index)}
          label={getMarkerLabel(item, index)}
          draggable={markerDraggable}
          onDrag={(e) => onMarkerDrag(e, item)}
          position={{...item.position}}
          onClick={e => onMarkerClick(e, item, index)}
          clusterer={clusterer}
        />  
      );  
    });
  }

  useEffect(() => {
    if (fitBounds === undefined) return;
    if (map === null) return;
    if (disableFitBounds) return;

    const bounds = new google.maps.LatLngBounds();
    const googleLatLngs = fitBounds.positions.map(x => new google.maps.LatLng(x.lat, x.lng));
    googleLatLngs.forEach((latlng) => {
      bounds.extend(latlng);
    });

    map.fitBounds(bounds);
    if (fitBounds.padding !== undefined) {
      map.setZoom((map?.getZoom() ?? 0) - fitBounds.padding);
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitBounds, map]);

  useEffect(() => {
    prevMarkerItems.current = markerItems?.map((x) => {
      return {
        position: {
          ...x.position,
        },
      };
    });
  }, [markerItems]);

  useEffect(() => {
    if (enableMarkerCluster) {
      setIsShowMarkerClusterer(false);
      setTimeout(() => {
        setIsShowMarkerClusterer(true);
      }, 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerItems]);

  useEffect(() => {
    console.log('@polygonWithCircleOptions', polygonWithCircleOptions);
    if (polygonWithCircleOptions === undefined) return;
    if (polygonWithCircleOptions.radius !== polygonWithCircleOptionsPrev.current?.radius) {
      console.log('@1');
      const coordinates = getPolygonCircleCoordinates({ lat: polygonWithCircleOptions.center.lat ?? 0, lng: polygonWithCircleOptions.center.lng ?? 0 }, polygonWithCircleOptions.radius ?? 0);
      if (typeof onMarkerItemsChange === 'function') {
        onMarkerItemsChange(coordinates.map<IGoogleMapTuning.MarkerItem>((coordinate) => {
          return {
            position: { lng: coordinate[0], lat: coordinate[1] },
          };
        }));
      }
    } else if (polygonWithCircleOptionsPrev.current?.center.lat !== polygonWithCircleOptions.center.lat || polygonWithCircleOptionsPrev.current?.center.lng !== polygonWithCircleOptions.center.lng) {
      console.log('@2');
      const diffLat = (polygonWithCircleOptionsPrev.current?.center.lat ?? (polygonWithCircleOptions.center?.lat ?? 0)) - (polygonWithCircleOptions.center?.lat ?? 0);
      const diffLng = (polygonWithCircleOptionsPrev.current?.center.lng ?? (polygonWithCircleOptions.center?.lng ?? 0)) - (polygonWithCircleOptions.center?.lng ?? 0);
      if (typeof onMarkerItemsChange === 'function') {
        onMarkerItemsChange(markerItems?.map((item) => {
          return {
            ...item,
            position: {
              lat: item.position.lat - diffLat,
              lng: item.position.lng - diffLng,
            },
          };
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygonWithCircleOptions]);

  useEffect(() => {
    polygonWithCircleOptionsPrev.current = { ...(polygonWithCircleOptions ?? {}), center: { ...(polygonWithCircleOptions?.center ?? {}) } };
  }, [polygonWithCircleOptions]);

  return (
    <div  
      ref={containerRef}
      className="block relative"
      style={containerStyle}>
      {
        mapStatus === 'loading' ? 
        <>
          <div className="flex flex-wrap justify-center items-center relative bg-gray-400 w-full h-full">
            Google Map 을 불러오는 중입니다.
          </div>
        </>
        : 
        <></>
      }

      {
        mapStatus === 'load-complete' ? 
        <>
          <GoogleMap
            options={mapOptions}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onMapLoad}
            onClick={onMapClick}
          >
            {
              isShowMarkerClusterer ? 
              <MarkerClustererF options={clusterOptions}>
                { clustererFn }
              </MarkerClustererF> :
              null
            }

            {
              (!enableMarkerCluster ? markerItems : [])?.map((item, index) => {
                return ( 
                  <MarkerF
                    key={index}
                    onLoad={(marker) => onMarkerLoad(marker, item, index)}
                    icon={getMarkerIcon(item, index)}
                    label={getMarkerLabel(item, index)}
                    draggable={markerDraggable}
                    onDrag={(e) => onMarkerDrag(e, item)}
                    position={{...item.position}}
                    onClick={e => onMarkerClick(e, item, index)}
                  />  
                );  
              })
            }

            {
              modes?.includes('geo-fence') || modes?.includes('polygon-with-circle') ? 
              <>
                {
                  (markerItems ?? []).length >= 3 ? 
                  <PolygonF
                    paths={markerItems?.filter(x => x.isMustNotClear !== true).map(x => x.position)}
                    options={polygonOptions}
                  /> : 
                  <></>
                }
              </> : 
              <></>
            }

            {
              modes?.includes('polygon-with-circle') && isValidPolygonWithCircleOptions ? 
              <>
                <MarkerF
                  key={'polygon-with-circle-center'}
                  draggable={true}
                  onDrag={(e) => onPolygonCircleCenterMarkerDrag(e)}
                  onDragStart={() => {
                    if (disable) return;
                    if (polygonWithCircleOptionsPrev.current !== undefined) {
                      polygonWithCircleOptionsPrevSnapshot.current = { ...polygonWithCircleOptionsPrev.current };
                    }
                    if (prevMarkerItems.current !== undefined) {
                      prevMarkerItemsSnapshot.current = [ ...prevMarkerItems.current ];
                    }
                    setIsMarkerDragging(true);
                  }}
                  onDragEnd={() => {
                    if (disable) return;
                    setIsMarkerDragging(false);
                  }}
                  position={{ lat: polygonWithCircleOptions!.center.lat ?? 0, lng: polygonWithCircleOptions!.center.lng ?? 0 }}
                />
              </> : 
              <></>
            }

            {
              modes?.includes('point-circle') && !modes?.includes('geo-fence') ? 
              <>
                {
                  (markerItems ?? []).length > 0 ? 
                  markerItems?.map((item, index) => {
                    return (
                      <Fragment key={JSON.stringify(item.position)}>
                        {
                          item.isMustNotClear === true ? 
                          <></> : 
                          <CircleF
                            center={item.position}
                            options={{
                              ...pointCircleOptions,
                              radius: pointCircleOptions.radius,
                            }}
                          />
                        }
                      </Fragment>
                    );
                  }) : 
                  <></>
                }
              </> : 
              <></>
            }

            {
              modes?.includes('heat-map') && getHeatMapLayerData().length > 0 ? 
              <>
                <HeatmapLayer
                  data={getHeatMapLayerData()}
                />
              </> : 
              <></>
            }

            {
              modes?.includes('multiple-polygon') && (polygonItems ?? [])?.length > 0 ?
              <>
                {
                  polygonItems?.map(polygonItem => {
                    return (
                      <PolygonF
                        key={polygonItem.id + '_' + polygonItem.refreshKey}
                        paths={polygonItem?.coordinates}
                        options={polygonItem.polygonOptions}
                        draggable={false}
                        onMouseOver={(e) => {
                          if (prevMouseOveredPolygonItem.current?.id !== polygonItem.id) {
                            if (typeof onPolygonMouseOver === 'function') onPolygonMouseOver(polygonItem);
                          }
                          prevMouseOveredPolygonItem.current = polygonItem;
                        }}
                        onMouseOut={(e) => {
                          if (typeof onPolygonMouseOut === 'function') onPolygonMouseOut(polygonItem);
                          prevMouseOutedPolygonItem.current = polygonItem;
                        }}
                        onClick={() => {
                          if (typeof onPolygonMouseClick === 'function') onPolygonMouseClick(polygonItem);
                        }}
                      />
                    );
                  })
                }
              </> :
              <></>
            }
          </GoogleMap> 

          <div className={styles['function-button-area']}>
            <ul className={styles['button-list']}>
              <li className={[
                  styles['item'],
                  showModeButtons?.includes('geo-fence') !== true ? styles['hide'] : '',
                ].join(' ')}>
                <button 
                  onClick={() => onClickFunctionButtons('geo-fence')}
                  className={[modes?.includes('geo-fence') ? styles['active'] : ''].join(' ')}>
                  <PolygonSvg />
                </button>
              </li>
              <li className={[
                  styles['item'],
                  showModeButtons?.includes('point-circle') !== true ? styles['hide'] : '',
                ].join(' ')}>
                <button   
                  onClick={() => onClickFunctionButtons('point-circle')}
                  className={[modes?.includes('point-circle') ? styles['active'] : ''].join(' ')}>
                  <PinPointSvg />
                </button>
                <div className={[
                  styles['point-circle-required-info-input-box'],
                  modes?.includes('point-circle') ? '' : styles['hide'],
                  ].join(' ')}>
                  <input
                    className={styles['point-circle-radius']}
                    type="number"
                    value={pointCircleOptions.radius?.toString()}
                    onChange={onChangePointCircleRadius} />
                  <div className={styles['input-unit-box']}>m</div>
                </div>
              </li>
              <li className={[
                  styles['item'],
                  showModeButtons?.includes('heat-map') !== true ? styles['hide'] : '',
                ].join(' ')}>
                <button   
                  onClick={() => onClickFunctionButtons('heat-map')}
                  className={[modes?.includes('heat-map') ? styles['active'] : ''].join(' ')}>
                  <HeatMapSvg />
                </button>
              </li>
            </ul>
          </div>
        </>
        : 
        <></>
      }

      {
        infoWindowItems?.map((item, index) => {
          return (
            <InfoWindowF
              anchor={markers.current.get(item.id?.toString() ?? '')}
              options={item.infoWindowOptions}
              key={item.id?.toString()}
              onCloseClick={() => onInfoWindowItemsChange(infoWindowItems.filter(k => {
                return k.id !== item.id;
              }))}
              zIndex={3}
              >
              <div>
                { item.infoWindowContent }
              </div>
            </InfoWindowF>
          );
        })
      }

      {
        mapStatus === 'error' ? 
        <>
          <div className="flex flex-wrap justify-center items-center relative bg-gray-400 w-full h-full">
            Google Map 을 불러오는데 실패하였습니다.
          </div>
        </>
        : 
        <></>
      }
    </div>
  );
}

function PolygonSvg() {
  return (
    <svg 
      style={{ display: 'inline-flex' }}
      width="24"
      height="24"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      aria-hidden="true" 
      role="img" 
      className="iconify iconify--gis" 
      preserveAspectRatio="xMidYMid meet">
      <path 
        d="M32.5 10.95c-6.89 0-12.55 5.66-12.55 12.55c0 4.02 1.935 7.613 4.91 9.916L14.815 54.172a12.354 12.354 0 0 0-2.316-.223C5.61 53.95-.05 59.61-.05 66.5c0 6.89 5.66 12.55 12.55 12.55c5.13 0 9.54-3.151 11.463-7.603l51.277 7.71c1.232 5.629 6.281 9.894 12.26 9.894c6.656 0 12.114-5.297 12.48-11.867a3.5 3.5 0 0 0 .07-.684a3.5 3.5 0 0 0-.071-.7c-.375-6.562-5.829-11.85-12.479-11.85c-.134 0-.264.015-.396.019L80.242 43.05c3.275-2.127 5.509-5.746 5.738-9.867a3.5 3.5 0 0 0 .07-.684a3.5 3.5 0 0 0-.071-.7c-.375-6.562-5.829-11.85-12.479-11.85c-5.062 0-9.452 3.06-11.43 7.415l-17.082-4.517a3.5 3.5 0 0 0-.01-.047c-.374-6.563-5.828-11.852-12.478-11.852zm0 7c3.107 0 5.55 2.443 5.55 5.55c0 3.107-2.443 5.55-5.55 5.55c-3.107 0-5.55-2.443-5.55-5.55c0-3.107 2.443-5.55 5.55-5.55zm41 9c3.107 0 5.55 2.443 5.55 5.55c0 3.107-2.443 5.55-5.55 5.55c-3.107 0-5.55-2.443-5.55-5.55c0-3.107 2.443-5.55 5.55-5.55zm-30.137 2.708l17.739 4.69C62.007 40.37 67.239 45.05 73.5 45.05l.033-.002l6.92 21.092a12.688 12.688 0 0 0-4.705 6.015l-50.916-7.654a12.611 12.611 0 0 0-3.787-7.13l10.342-21.378c.368.033.737.057 1.113.057c4.652 0 8.71-2.592 10.863-6.393zM12.5 60.95c3.107 0 5.55 2.444 5.55 5.551s-2.443 5.55-5.55 5.55c-3.107 0-5.55-2.443-5.55-5.55c0-3.107 2.443-5.55 5.55-5.55zm75 10c3.107 0 5.55 2.444 5.55 5.551s-2.443 5.55-5.55 5.55c-3.107 0-5.55-2.443-5.55-5.55c0-3.107 2.443-5.55 5.55-5.55z" 
        fill="#000000"
      ></path>
    </svg>
  );
}

function PinPointSvg() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M12.398 17.804C13.881 17.0348 19 14.0163 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 14.0163 10.119 17.0348 11.602 17.804C11.8548 17.9351 12.1452 17.9351 12.398 17.804ZM12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" 
        fill="#222222" />
      <path 
        d="M18.0622 16.5C18.6766 16.9561 19 17.4734 19 18C19 18.5266 18.6766 19.0439 18.0622 19.5C17.4478 19.9561 16.5641 20.3348 15.5 20.5981C14.4359 20.8614 13.2288 21 12 21C10.7712 21 9.56414 20.8614 8.5 20.5981C7.43587 20.3348 6.5522 19.9561 5.93782 19.5C5.32344 19.0439 5 18.5266 5 18C5 17.4734 5.32344 16.9561 5.93782 16.5" 
        stroke="#222222" 
        strokeWidth="2" 
        strokeLinecap="round" />
    </svg>
  );
}

function HeatMapSvg() {
  return (
    <svg
      fill="#000000"
      width="24"
      height="24"
      viewBox="0 0 32 32" 
      id="icon" 
      xmlns="http://www.w3.org/2000/svg">
      <title>heat-map--02</title>
      <circle cx="21" cy="20" r="2"/>
      <circle cx="14" cy="12" r="2"/>
      <circle cx="29" cy="19" r="1"/>
      <path d="M26.5,30A3.5,3.5,0,1,1,30,26.5,3.5041,3.5041,0,0,1,26.5,30Zm0-5A1.5,1.5,0,1,0,28,26.5,1.5017,1.5017,0,0,0,26.5,25Z"/>
      <path d="M14,30a3.958,3.958,0,0,1-2.126-.6211,6.9977,6.9977,0,1,1,4.1109-6.8384A3.9916,3.9916,0,0,1,14,30Zm-1.8843-3.0278.5391.4946a1.9915,1.9915,0,1,0,2.0039-3.343l-.6909-.2432.03-.8467a5.0085,5.0085,0,1,0-2.5166,4.3023Z"/>
      <path d="M24,16a6.0067,6.0067,0,0,1-6-6,5.3246,5.3246,0,0,1,.0269-.5327A3.9564,3.9564,0,0,1,16,6a4.0045,4.0045,0,0,1,4-4,3.9564,3.9564,0,0,1,3.4673,2.0271C23.6484,4.009,23.8252,4,24,4a6,6,0,0,1,0,12ZM20,4a2.0021,2.0021,0,0,0-2,2,1.9805,1.9805,0,0,0,1.43,1.9023l.9018.2706-.2153.9162A3.9938,3.9938,0,1,0,24,6a4.0064,4.0064,0,0,0-.9121.1162l-.9155.2141-.27-.9006A1.9807,1.9807,0,0,0,20,4Z"/>
      <path d="M6.5,11A4.5,4.5,0,1,1,11,6.5,4.5051,4.5051,0,0,1,6.5,11Zm0-7A2.5,2.5,0,1,0,9,6.5,2.503,2.503,0,0,0,6.5,4Z"/>
      <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" fill="none" width="32" height="32"/>
    </svg>
  );
}