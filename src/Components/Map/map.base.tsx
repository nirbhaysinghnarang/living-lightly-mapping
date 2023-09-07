import { MapProps } from "../../Types/MapProps";
import React, { useRef, useEffect, useState, createRef, Children } from 'react';
import * as mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Box } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker, Map, MapProvider, Source, Layer, Popup } from 'react-map-gl';
import { InsetMap } from "./map.inset.tsx";
import { fetchData } from "./Functions/fetchData.tsx";
import { ChannelContent, ChannelType } from "../../Types/Channel.types.ts";
import { Menu as MapMenu } from "../menu.map.tsx";
import { MenuOutlined } from "@mui/icons-material";
import { panTo } from "./map.utils.tsx";
import { renderCommunities, renderRouteStartPoints } from "./map.utils.tsx";
const _ = require('lodash');

export const BaseMap: React.FC<MapProps> = ({
    assetList,
    mapZoom,
    channelId,
    mapCenter,
    zoomMinMax,
    mapBounds,
    mapStyle,
    accessToken,
    insetMapProps,
    hasInset
}: MapProps) => {
    const MAP_OVERLAY_ASSET = assetList.find(elem => elem.id == "MAP_OVERLAY_ASSET")
    const ROUTE_START_POINT_ASSET = assetList.find(elem => elem.id == "ROUTE_START_IMG")
    const mapRef = useRef(null);

    /**
     * useState hooks for data management
     */
    const [communities, setCommunities] = useState<ChannelType[]>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<ChannelType>(null);
    const [routes, setRoutes] = useState<ChannelType[]>(null);
    const [routeStartPoints, setRouteStartPoints] = useState<ChannelContent[]>();
    const [routePoints, setRoutePoints] = useState<ChannelType[]>(null);
    const [selectedRoutePoint, setSelectedRoutePoint] = useState<ChannelContent>(null);


    /**
     * useState hooks for UI management
     */
    const [showMenu, setShowMenu] = useState(false);
    /**
     * useEffect Hooks
     */

    useEffect(() => {
        fetchData(channelId).then((data) => {
            setCommunities(data.children)
        })
    }, [])

    /**
     * Cascading useEffect hooks for separation of concerns.
     * setSelectedCommunity TRIGGERS setRoutes TRIGGERS setRouteStartPoints
     */

    useEffect(() => {
        if (selectedCommunity) {
            panTo([selectedCommunity.long, selectedCommunity.lat], 8, mapRef);
            setRoutes(selectedCommunity.children)
        }
    }, [selectedCommunity])

    useEffect(() => {
        if (routes) {
            setRouteStartPoints(
                routes.map((route: ChannelType) => route.contents.at(0))
            )
        }
    }, [routes])
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
                ref={mapRef}
                style={{ zIndex: 0, opacity: 0.5 }}
                mapStyle={mapStyle}
                mapboxAccessToken={accessToken}
            >
                <Box sx={{ position: 'absolute', top: "50px", left: "80px", zIndex: 10 }}>
                    <div>
                        <div className={'flex justify-start items-center gap-5'}>
                            <div onClick={() => { setShowMenu(!showMenu) }}> <MenuOutlined /> </div>
                        </div>
                        {showMenu && <MapMenu selectCommunity={setSelectedCommunity} communities={communities} />}
                    </div>
                </Box>
                {hasInset && <InsetMap
                    channelId={insetMapProps!.channelId}
                    hasInset={false}
                    accessToken={insetMapProps!.accessToken}
                    assetList={insetMapProps!.assetList}
                    mapZoom={insetMapProps!.mapZoom}
                    mapBounds={insetMapProps!.mapBounds}
                    mapCenter={insetMapProps!.mapCenter}
                    mapStyle={insetMapProps!.mapStyle}
                    insetMapProps={null}
                    zoomMinMax={insetMapProps!.zoomMinMax}
                ></InsetMap>}
                <div id="community">
                    {renderCommunities(
                        communities,
                        setSelectedCommunity
                    )}
                </div>

                <div id="route-start-points">
                    {renderRouteStartPoints(
                        routeStartPoints,
                        setSelectedRoutePoint,
                        ROUTE_START_POINT_ASSET
                    )}

                </div>




            </Map>
        </Box>

    </>);
}