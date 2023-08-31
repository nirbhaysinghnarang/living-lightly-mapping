import { BaseMapProps } from "../../Types/BaseMapProps.type";
import React, { useRef, useEffect, useState, createRef } from 'react';
import * as mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Box } from '@mui/material';
import { Marker, Map, MapProvider, Source, Layer, Popup } from 'react-map-gl';



export const BaseMap: React.FC<BaseMapProps> = ({
    assetList,
    mapZoom,
    mapCenter,
    zoomMinMax,
    hasInsetMap,
    insetMapProps,
    mapBounds,
    mapStyle, 
    accessToken
}: BaseMapProps) => {
    const MAP_OVERLAY_ASSET = assetList.find(elem => elem.id == "MAP_OVERLAY_ASSET")
    console.log(mapStyle, accessToken, MAP_OVERLAY_ASSET)

    const mapRef = useRef(null);
    const [mapData, setMapData] = useState({});
    return (<>
        <Box sx={{ backgroundImage: `url('${MAP_OVERLAY_ASSET?.url}')`, width: '100vw', height: '100vh', backgroundSize: "100vw 100vh", zIndex: 1 }}>
            <Map
                initialViewState={{
                    longitude: mapCenter.lng,
                    latitude: mapCenter.lat,
                    zoom: mapZoom

                }}
                maxZoom={zoomMinMax[1]}
                minZoom={zoomMinMax[0]}
                id="primary_map"
                // maxBounds={mapBounds}
                ref={mapRef}
                style={{ zIndex: 0, opacity: 0.5 }}
                mapStyle={mapStyle}
                mapboxAccessToken={accessToken}
            >



            </Map>
        </Box>

    </>);
}