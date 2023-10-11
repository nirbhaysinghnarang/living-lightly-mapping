import { MenuOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Map, Marker, Source } from 'react-map-gl';
import { BASE_MAP_BOUNDS } from "../../Constants/map.ts";
import { ChannelContent, ChannelType } from "../../Types/Channel.types.ts";
import { HistoryStack, HistoryStackElement, append, initialStackElement, peek, pop } from "../../Types/History.stack.type.ts";
import { MapProps } from "../../Types/MapProps";
import { Overlay } from "../../Types/Overlay.type.ts";
import { State, constructStates } from "../../Types/State.type.ts";
import { VIEWMODE } from "../../Types/ViewMode.type.ts";
import { setBounds, updateScrollBehaviour, updateState } from "../State/map.state.handler.ts";
import { handleClickStateLevel } from "./Events/handleClick.ts";
import { cycle } from "./Functions/cycle.ts";
import { fetchData } from "./Functions/fetchData.ts";
import { createPolygonLayer } from "./Geometry/drawStates.ts";
import { getZoomLevel } from "./Geometry/getZoomLevel.ts";
import { createLineGeoJson } from "./Geometry/lineGeoJson.ts";
import { createLayer } from "./Geometry/routeLayer.ts";
import { ChannelPopup, ContentPopup } from "./Popups/popup.main.tsx";
import { Cycle } from "./map.cycle.tsx";
import { InsetMap } from "./map.inset.tsx";
import { Menu as MapMenu } from "./map.menu.tsx";
import { panTo, renderCommunities, renderRoutePoints, renderRouteStartPoints } from "./map.utils.tsx";

export const BaseMap: React.FC<MapProps> = ({
    assetList,
    channelId,
    mapCenter,
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
    const [states, setStates] = useState<State[]>([]);
    const [view, setView] = useState<VIEWMODE>("State");
    const [hoverCommunity, setHoverCommunity] = useState<ChannelType>(null);
    const [hoverRoute, setHoverRoute] = useState<ChannelType>(null);
    const [hoverRoutePoints, setHoverRoutePoints] = useState<ChannelContent[]>(null);
    const [overlays, setOverlays] = useState<Overlay[]>([]);

    const [historyStack, setHistoryStack] = useState<HistoryStack>([
        initialStackElement
    ]);

    /**
     * useState hooks for UI management
     */
    const [showMenu, setShowMenu] = useState(false);
    const [zoom, setZoom] = useState(getZoomLevel(view))

    useEffect(() => { if (hoverCommunity && typeof (hoverRoute) !== "undefined") { setHoverRoutePoints(hoverRoute.contents) } }, [hoverRoute])

    /**
     * useEffect Hooks
     */

    //This useEffect hook will automagically set zoom level, proper coordinates, and overlays based on the last element on the stack.
    useEffect(() => {
        if (historyStack && historyStack.length > 1) {
            const stackTop = peek(historyStack)
            setView(stackTop.view)
            updateScrollBehaviour(stackTop, mapRef)
            setBounds(stackTop, mapRef, setOverlays)
            updateState(
                stackTop,
                setSelectedCommunity,
                setSelectedRoutePoint,
                setShowMenu,
                setScopedMarker,
                setRouteStartPoints,
                setRoutePoints,
                setOverlays,
                setRoutes, 
                setView,
                routes
            )
        } else {
            panTo([mapCenter.lng, mapCenter.lat], getZoomLevel("State"), mapRef)
            setView("State")
            setSelectedCommunity(null);
            setSelectedRoutePoint(null);
            mapRef.current && mapRef.current.getMap().setMaxBounds(BASE_MAP_BOUNDS)
        }

    }, [historyStack])

    useEffect(() => {
        fetchData(channelId).then((data) => {
            setCommunities(data.children)
            setZoom(getZoomLevel(view));
        })
    }, [])

    useEffect(() => {
        if (communities) setStates(constructStates(communities))
    }, [communities])

    useEffect(() => {
        console.log(selectedCommunity)
        if (selectedCommunity && peek(historyStack).selectedElement !== selectedCommunity) {
            setHistoryStack((prevStack: HistoryStack) => {
                return append([...prevStack],
                    {
                        view: "Routes",
                        selectedElement: selectedCommunity
                    }
                )
            })
        }
    }, [selectedCommunity])


    useEffect(() => {
        if (selectedRoutePoint) {
            setHistoryStack((prevStack: HistoryStack) => {
                return append([...prevStack],
                    {
                        view: "Route",
                        selectedElement: selectedRoutePoint
                    }
                )
            })
        }
    }, [selectedRoutePoint])


    useEffect(() => {
        if (scopedMarker) {
            panTo(
                [scopedMarker.long, scopedMarker.lat],
                getZoomLevel("Route"),
                mapRef
            )
        }
    }, [scopedMarker])




    return (<>
        <Box sx={{ backgroundImage: `url('${MAP_OVERLAY_ASSET?.url}')`, width: '100vw', height: '100vh', backgroundSize: "100vw 100vh", zIndex: 1 }}>
            <Map
                initialViewState={{
                    longitude: mapCenter.lng,
                    latitude: mapCenter.lat,
                    zoom: zoom
                }}
                id="primary_map"
                ref={mapRef}
                style={{ zIndex: 0, opacity: 0.5 }}
                mapStyle={mapStyle}
                scrollZoom={false}
                mapboxAccessToken={accessToken}
                onClick={(e) => {
                    if (states && view === "State") {
                        const resultOfClick: State | null = handleClickStateLevel(e.lngLat, mapRef, (states))
                        if (resultOfClick) {
                            setView("Community")
                            setCommunities(resultOfClick.communities)
                            const stackTop: HistoryStackElement = {
                                view: "Community",
                                selectedElement: resultOfClick
                            }
                            setHistoryStack((prevStack: HistoryStack) => {
                                return append([...prevStack], stackTop)
                            })
                        }
                    }

                }}
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
                ></InsetMap>}
                {view === "Community" && <div id="community">
                    {renderCommunities(
                        communities,
                        setSelectedCommunity,
                        setHoverCommunity
                    )}
                    {hoverCommunity && <ChannelPopup channel={hoverCommunity} fixed={false}></ChannelPopup>}
                </div>
                }
                {view == "State" && states && states.map((state: State) => {
                    return <Source id={"state"} type="geojson" data={state.features} >
                        <Layer id={state.name} {...createPolygonLayer()} />
                    </Source>
                })}
                {view === "Routes" && <div id="route-start-points">
                    {renderRouteStartPoints(
                        routeStartPoints,
                        setSelectedRoutePoint,
                        ROUTE_START_POINT_ASSET,
                        setHoverRoute,
                        routes
                    )}
                    {selectedCommunity && <ChannelPopup channel={selectedCommunity} fixed={true}></ChannelPopup>}
                    {hoverRoute && <ChannelPopup channel={hoverRoute} fixed={false}></ChannelPopup>}
                    {hoverRoute && hoverRoutePoints && <Source id="routes" type="geojson" data={createLineGeoJson(hoverRoutePoints)}>
                        {<Layer {...createLayer()}></Layer>}
                    </Source>}
                </div>}


                {view === "Route" && scopedMarker && routePoints && routePoints.length !== 0 && <div id="route-points">
                    




                    {renderRoutePoints(
                        routePoints,
                        scopedMarker,
                        ROUTE_POINTER,
                        setScopedMarker
                    )}
                    <Source id="routes" type="geojson" data={createLineGeoJson(routePoints)}>
                        {<Layer {...createLayer()}></Layer>}
                    </Source>
                    <Cycle
                        arrowPrevImage={ARROW_PREV}
                        arrowNextImage={ARROW_NEXT}
                        onNextArrowClick={() => {
                            setScopedMarker(cycle(scopedMarker, routePoints, "UP"))
                        }}
                        onPrevArrowClick={() => {
                            setScopedMarker(cycle(scopedMarker, routePoints, "DOWN"))
                        }}
                    />
                    {scopedMarker && <ContentPopup content={scopedMarker} ></ContentPopup>}
                </div>}


                {
                    historyStack && historyStack.length > 1 &&
                    <Button sx={{
                        position: "absolute",
                        top: "50px",
                        right: "80px",
                        zIndex: 10,
                        color: "black"
                    }} onClick={() => {

                        setHistoryStack((prev: HistoryStack) => {
                            return pop([...prev])
                        })
                    }}>
                        <Typography variant="body1" sx={{ fontFamily: "BriemScript", fontWeight: 800 }}>Back</Typography>

                    </Button>
                }

                {(overlays) && overlays.map((overlay: Overlay) => {
                    return (
                        <>
                            <Marker
                                longitude={(overlay.br_long + overlay.tl_long) / 2}
                                latitude={(overlay.br_lat + overlay.tl_lat) / 2}>
                                <div >
                                    {overlay.image.formats.thumbnail.height && overlay.image.formats.thumbnail.width &&
                                        <img src={overlay.image.url} 
                                        alt={'overlay'} 
                                        height={overlay.image.formats.thumbnail.height} 
                                        width={overlay.image.formats.thumbnail.width} 
                                        />
                                    }
                                </div>
                            </Marker>
                        </>

                    );
                })}
            </Map>
        </Box>

    </>);
}