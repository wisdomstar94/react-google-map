import { Libraries } from "@react-google-maps/api";
import { CSSProperties, ReactNode } from "react";

export declare namespace IGoogleMapTuning {
  export type MapStatus = 'loading' | 'load-complete' | 'error';

  export type Mode = 
    'geo-fence' | 
    'polygon-with-circle' | 
    'point-circle' | 
    'heat-map' | 
    'marker-pin-single' |
    'multiple-polygon' | 
    ''
  ;

  export type MarkerExtended = google.maps.Marker & { isAdded?: boolean; };

  export type TCalculator = (markers: MarkerExtended[], num: number) => ClusterIconInfo;

  export interface ClusterIconInfo {
    text: string;
    index: number;
    title?: string;
    html?: string;
  }

  export interface ClusterIconStyle {
    url: string;
    className?: string | undefined;
    height: number;
    width: number;
    anchorText?: [number, number] | undefined;
    anchorIcon?: [number, number] | undefined;
    textColor?: string | undefined;
    textSize?: number | undefined;
    textDecoration?: string | undefined;
    fontWeight?: string | undefined;
    fontStyle?: string | undefined;
    fontFamily?: string | undefined;
    backgroundPosition?: string | undefined;
  }

  export type Direction = 'left' | 'none' | 'right';

  export interface Position {
    lat: number;
    lng: number;
  }

  export interface PositionOptional {
    lat?: number;
    lng?: number;
  }

  export interface MarkerItem {
    id?: string | number;
    refreshKey?: string;
    marker?: google.maps.Marker;
    label?: google.maps.MarkerLabel;
    position: Position;
    icon?: MarkerIcon;
    isMustNotClear?: boolean;
    infoWindowOptions?: google.maps.InfoWindowOptions;
    infoWindowContent?: ReactNode;
  }

  export interface PolygonItem<T = any> {
    id: number | string;
    coordinates: Position[];
    refreshKey?: string;
    // strokeColor: string;
    // bgColor: string;
    data?: T | undefined;
    polygonOptions: google.maps.PolygonOptions;
  }

  export interface InfoWindowItem {
    id?: string | number;
    infoWindowOptions?: google.maps.InfoWindowOptions;
    infoWindowContent?: ReactNode;
  }

  export interface HeatMapItem {
    position: Position;
    weight: number;
  }

  export interface ApiOptions {
    id: string;
    googleMapsApiKey: string;
    libraries?: Libraries;
  }

  export interface MarkerIcon {
    url: string;
    anchor: [number, number];
    scaledSize: [number, number];
  }

  export interface PolygonWithCircleOptions {
    center: PositionOptional;
    radius?: number;
    // circleStrokePointCount: number;
  }

  export interface FitBounds {
    positions: Position[];
    padding?: number;
  }

  export interface ClustererOptions {
    gridSize?: number | undefined;
    maxZoom?: number | undefined;
    zoomOnClick?: boolean | undefined;
    averageCenter?: boolean | undefined;
    minimumClusterSize?: number | undefined;
    ignoreHidden?: boolean | undefined;
    title?: string | undefined;
    calculator?: TCalculator | undefined;
    clusterClass?: string | undefined;
    styles?: ClusterIconStyle[] | undefined;
    enableRetinaIcons?: boolean | undefined;
    batchSize?: number | undefined;
    batchSizeIE?: number | undefined;
    imagePath?: string | undefined;
    imageExtension?: string | undefined;
    imageSizes?: number[] | undefined;
  }

  export interface Props<T> {
    apiOptions: ApiOptions;
    mapOptions?: google.maps.MapOptions;
    latLngFixedCount?: number;
    modes?: Mode[]; 
    markerDraggable?: boolean;
    fitBounds?: FitBounds;
    disableFitBounds?: boolean;
    showModeButtons?: Mode[];
    enableMarkerCluster?: boolean;
    clusterOptions?: ClustererOptions;
    // infoWindowOptions?: (item: MarkerItem<T>, index: number) => google.maps.InfoWindowOptions;
    defaultMarkerLabel?: (item: MarkerItem, index: number) => google.maps.MarkerLabel;
    defaultMarkerIcon?: (item: MarkerItem, index: number) => MarkerIcon;
    polygonOptions?: google.maps.PolygonOptions;
    polygonWithCircleOptions?: PolygonWithCircleOptions;
    onPolygonWithCircleOptionsChange?: (polygonWithCircleOptions?: PolygonWithCircleOptions) => void;
    pointCircleOptions?: google.maps.CircleOptions;
    heatMapItems?: HeatMapItem[];
    markerItems?: MarkerItem[];
    containerStyle?: CSSProperties;
    center?: Position;
    zoom?: number;
    disable?: boolean;
    infoWindowItems?: InfoWindowItem[];
    onMarkerClick?: (markerItem?: MarkerItem) => void;
    onMarkerItemsChange?: (markerItems?: MarkerItem[]) => void;
    onModesChange?: (modes?: Mode[]) => void;
    onPointCircleOptionsChange?: (pointCircleOptions?: google.maps.CircleOptions) => void; 
    onInfoWindowItemsChange?: (infoWindowItems: InfoWindowItem[] | undefined) => void;
    onPolygonMouseOver?: (polygonItem: PolygonItem<T>) => void;
    onPolygonMouseOut?: (polygonItem: PolygonItem<T>) => void;
    onPolygonMouseClick?: (polygonItem: PolygonItem<T>) => void;
    polygonItems?: PolygonItem<T>[];
    children?: React.ReactNode;
  }
}