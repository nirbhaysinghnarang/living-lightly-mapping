import { MapProps } from "../../Types/MapProps";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Source, Layer } from 'react-map-gl';
import { InsetMap } from "./map.inset.tsx";
import { extractNestedIds, fetchData, getOverlays } from "./Functions/fetchData.ts";
import { ChannelContent, ChannelType } from "../../Types/Channel.types.ts";
import { Menu as MapMenu } from "./map.menu.tsx";
import { MenuOutlined } from "@mui/icons-material";
import { panTo, renderRoutePoints } from "./map.utils.tsx";
import { renderCommunities, renderRouteStartPoints } from "./map.utils.tsx";
import { createLineGeoJson } from "./Geometry/lineGeoJson.ts";
import { createLayer } from "./Geometry/routeLayer.ts";
import { Cycle } from "./map.cycle.tsx";
import { cycle } from "./Functions/cycle.ts";
import { createPolygonLayer } from "./Geometry/drawStates.ts";
import { State, constructStates } from "../../Types/State.type.ts";
import { getZoomLevel } from "./Geometry/getZoomLevel.ts";
import { handleClickStateLevel } from "./Events/handleClick.ts";
import { HistoryStack, HistoryStackElement, append, peek, selectedElementString, pop, initialStackElement } from "../../Types/History.stack.type.ts";
import { getType } from "../../Types/TypeChecks.ts";
import { VIEWMODE } from "../../Types/ViewMode.type.ts";
import { ChannelPopup, ContentPopup } from "./Popups/popup.main.tsx";
import { Overlay } from "../../Types/Overlay.type.ts";
import { type } from "@testing-library/user-event/dist/type/index";
import { Marker } from "react-map-gl";
import { image } from "d3";
import zIndex from "@mui/material/styles/zIndex";

export const BaseMap: React.FC<MapProps> = ({
    assetList,
    channelId,
    mapCenter,
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
    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State | null>(null);
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
            const zoomLevel = getZoomLevel(stackTop.view)
            setView(stackTop.view)
            const typeOfTop: selectedElementString = getType(stackTop.selectedElement)
            let jumpDestination: [number, number]
            switch (typeOfTop) {
                case "State":
                    setOverlays([])
                    const stateElt = stackTop.selectedElement as State
                    jumpDestination = stateElt.center.geometry.coordinates as [number, number]
                    break
                case "ChannelType":
                    const typeElt = stackTop.selectedElement as ChannelType
                    setOverlays(typeElt.overlays)
                    jumpDestination = [typeElt.long, typeElt.lat]
                    break
                case "ChannelContent":
                    setOverlays([])
                    const contentElt = stackTop.selectedElement as ChannelContent
                    jumpDestination = [contentElt.long, contentElt.lat]
                    break
            }
            panTo(jumpDestination, zoomLevel, mapRef)
        } else {
            panTo([mapCenter.lng, mapCenter.lat], getZoomLevel("State"), mapRef)
            setView("State")
        }

    }, [historyStack])

    useEffect(() => { console.log(overlays) }, [overlays])

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
        if (selectedCommunity) {
            setShowMenu(false); //in case
            setRoutes(selectedCommunity.children)
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
        if (routes) {
            setRouteStartPoints(
                routes.map((route: ChannelType) => route.contents.at(0))
            )
        }
    }, [routes])

    useEffect(() => {
        if (selectedRoutePoint) {
            setRoutePoints(
                routes.find((route: ChannelType) => route.contents.at(0) === selectedRoutePoint).contents
            )
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
        if (routePoints) {
            setScopedMarker(routePoints.at(0));
        }
    },
        [routePoints])

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
                            setSelectedState(resultOfClick)
                            setCommunities(resultOfClick.communities)
                            //this is where we add the first element to the history stack because
                            //this is where user interaction actually begins.
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