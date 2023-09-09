import React from 'react';
import * as mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Box } from '@mui/material';
import {Map,} from 'react-map-gl';
import { MapProps } from '../../Types/MapProps';
export const InsetMap: React.FC<MapProps> = ({
    assetList,
    mapZoom,
    mapCenter,
    mapBounds,
    mapStyle,
    accessToken,
    insetMapProps
}: MapProps) => {
    const MAP_OVERLAY_ASSET = assetList.find(elem => elem.id == "MAP_OVERLAY_ASSET")
    return (<>
        <Box sx={{ backgroundImage: MAP_OVERLAY_ASSET, zIndex: 5, border: 1, borderStyle: 'dashed', borderRadius: 1, borderColor: "brown", width: 100, height: 100, position: 'absolute', bottom: '150px', right: '100px' }}>
            <Map
                initialViewState={{
                    longitude: mapCenter.lng,
                    latitude: mapCenter.lat,
                    zoom: mapZoom
                }}
                id="inset_map"
                style={{ width: '100%', height: '100%', zIndex: 2, opacity: 1 }}
                mapStyle={mapStyle}
                mapboxAccessToken={accessToken}
            >;
               
            </Map>
        </Box>

    </>);
}