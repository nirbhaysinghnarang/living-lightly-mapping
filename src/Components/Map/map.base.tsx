import { MapProps } from "../../Types/MapProps";
import React, { useRef, useEffect, useState, createRef, Children } from 'react';
import { Box } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker, Map, MapProvider, Source, Layer, Popup } from 'react-map-gl';
import { InsetMap } from "./map.inset.tsx";
import { fetchData } from "./Functions/fetchData.ts";
import { ChannelContent, ChannelType } from "../../Types/Channel.types.ts";
import { Menu as MapMenu } from "../map.menu.tsx";
import { MenuOutlined } from "@mui/icons-material";
import { panTo, renderRoutePoints } from "./map.utils.tsx";
import { renderCommunities, renderRouteStartPoints } from "./map.utils.tsx";
import { createLineGeoJson } from "./Geometry/lineGeoJson.ts";
import { createLayer } from "./Geometry/routeLayer.ts";
import { Cycle } from "./map.cycle.tsx";
import { cycle } from "./Functions/cycle.ts";
import { createPolygonLayer, getStatesJson } from "./Geometry/drawStates.ts";


//Map should only show one type of content at a time.
type VIEWMODE = "Community" | "Routes" | "Route"


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
    const ROUTE_POINTER = assetList.find(elem => elem.id == "ROUTE_POINTER_IMG")
    const ARROW_PREV = assetList.find(elem => elem.id === "ARROW_PREV_IMG")
    const ARROW_NEXT = assetList.find(elem => elem.id === "ARROW_NEXT_IMG")


    const mapRef = useRef(null);

    /**
     * useState hooks for data management
     */
    const [communities, setCommunities] = useState<ChannelType[]>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<ChannelType>(null);
    const [routes, setRoutes] = useState<ChannelType[]>(null);
    const [routeStartPoints, setRouteStartPoints] = useState<ChannelContent[]>();
    const [routePoints, setRoutePoints] = useState<ChannelContent[]>(null);
    const [selectedRoutePoint, setSelectedRoutePoint] = useState<ChannelContent>(null);
    const [scopedMarker, setScopedMarker] = useState<ChannelContent>(null);


    const [view, setView] = useState<VIEWMODE>("Community");


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
     * 
     */

    useEffect(() => {
        if (selectedCommunity) {
            setShowMenu(false); //in case
            panTo([selectedCommunity.long, selectedCommunity.lat], 8, mapRef);
            setView("Routes")
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

    useEffect(() => {
        if (selectedRoutePoint) {
            setView("Route")
            setRoutePoints(
                routes.find((route: ChannelType) => route.contents.at(0) === selectedRoutePoint).contents
            )
        }
    }, [selectedRoutePoint])

    useEffect(() => {
        if (routePoints) {
            setScopedMarker(routePoints.at(0));
        }
    },
        [routePoints])






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

                {view === "Community" && <div id="community">
                    {renderCommunities(
                        communities,
                        setSelectedCommunity
                    )}

                </div>}

                {communities && getStatesJson(communities).map((data: any) => {
                    return <Source id={"state"} type="geojson" data={data} >
                        <Layer {...createPolygonLayer()} />
                    </Source>
                })}
                {view === "Routes" && <div id="route-start-points">
                    {renderRouteStartPoints(
                        routeStartPoints,
                        setSelectedRoutePoint,
                        ROUTE_START_POINT_ASSET
                    )}
                </div>}

                {view === "Route" && scopedMarker && routePoints && routePoints.length !== 0 && <div id="route-points">
                    {renderRoutePoints(
                        routePoints,
                        setScopedMarker,
                        scopedMarker,
                        ROUTE_POINTER
                    )}
                    <Source id="routes" type="geojson" data={createLineGeoJson(routePoints)}>
                        {<Layer {...createLayer()}></Layer>}
                    </Source>
                    <Cycle
                        arrowPrevImage={ARROW_PREV}
                        arrowNextImage={ARROW_NEXT}
                        onNextArrowClick={() => { 
                            const next = cycle(scopedMarker, routePoints, "UP")
                            panTo([next.long, next.lat], 8, mapRef)
                            setScopedMarker(next)
                         }}
                        onPrevArrowClick={() => {
                            const prev = cycle(scopedMarker, routePoints, "DOWN")
                            panTo([prev.long, prev.lat], 8, mapRef)
                            setScopedMarker(prev)
                        }}
                    />
                </div>}






            </Map>
        </Box>

    </>);
}