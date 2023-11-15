import { Box, Button, Typography } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Map, Marker, Source } from 'react-map-gl';
import { COLORS } from "../../Constants/Colors/color.mapping.js";
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
import { MapBreadCrumbs } from "./map.breadcrumbs.tsx";
import { DynMenu } from "./map.dyn.menu.tsx";
import { InsetMap } from "./map.inset.tsx";
import { MenuOptions } from './map.options.menu.tsx';
import { panTo, renderCommunity, renderRoutePoints, renderState } from "./map.utils.tsx";

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
    const ARROW_PREV = assetList.find(elem => elem.id === "ARROW_PREV_IMG")
    const ARROW_NEXT = assetList.find(elem => elem.id === "ARROW_NEXT_IMG")
    const mapRef = useRef(null);


    const routeAssets = [assetList.find(elem => elem.id === "ROUTE_1"), assetList.find(elem => elem.id === "ROUTE_2")]
    const routeAssetSelected = [assetList.find(elem => elem.id === "ROUTE_1_SEL"), assetList.find(elem => elem.id === "ROUTE_2_SEL")]


    /**
     * useState hooks for data management
     */




    const [communities, setCommunities] = useState<ChannelType[]>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<ChannelType>(null);
    const [routes, setRoutes] = useState<ChannelType[]>(null);
    const [routeStartPoints, setRouteStartPoints] = useState<ChannelContent[]>();
    const [routePoints, setRoutePoints] = useState<ChannelContent[]>(null);
    const [scopedMarker, setScopedMarker] = useState<ChannelContent>(null);
    const [selectedRoute, setSelectedRoute] = useState<ChannelType>(null)
    const [states, setStates] = useState<State[]>([]);
    const [view, setView] = useState<VIEWMODE>("IND");
    const [hoverCommunity, setHoverCommunity] = useState<ChannelType>(null);
    const [hoverRoute, setHoverRoute] = useState<ChannelType>(null);
    const [hoverRoutePoints, setHoverRoutePoints] = useState<ChannelContent[]>(null);
    const [overlays, setOverlays] = useState<Overlay[]>([]);
    const [idColorMap, setIdColorMap] = useState<any>();
    const [stateRoutes, setStateRoutes] = useState<ChannelType[]>([]);
    const [isContentPopupOpen, setIsContentPopupOpen] = useState<boolean>(false);
    const [isChannelPopupOpen, setIsChannelPopupOpen] = useState<boolean>(false);
    const [selState, setSelState] = useState<State | null>(null)

    const [scopedCommunity, setScopedCommunity] = useState<null | ChannelType>(null);
    const [historyStack, setHistoryStack] = useState<HistoryStack>([
        initialStackElement
    ]);

    const recursivelyPopulateColorMap = (communities: ChannelType[]) => {
        const map: Record<string, string> = {};
        const helper = (community: ChannelType, map: Record<string, string>, index: number) => {
            map[community.uniqueID] = COLORS[index % (COLORS.length - 1)]
            if (!community.children) return
            if (community.contents) for (const content of community.contents) map[content.id] = COLORS[index % (COLORS.length - 1)]
            for (const child of community.children) helper(child, map, index)
        }

        for (let i = 0; i < communities.length; i++) helper(communities[i], map, i);
        return map;
    }



    /**
     * useState hooks for UI management
     */
    const [showMenu, setShowMenu] = useState(false);
    const [zoom, setZoom] = useState(getZoomLevel(view))


    useEffect(() => { if (hoverCommunity && typeof (hoverRoute) !== "undefined") { setHoverRoutePoints(hoverRoute.contents); setIsChannelPopupOpen(true) } }, [hoverRoute])

    /**
     * useEffect Hooks
     */

    //This useEffect hook will automagically set zoom level, proper coordinates, and overlays based on the last element on the stack.
    useEffect(() => {
        console.log(historyStack)
        if (historyStack && historyStack.length > 1) {
            const stackTop = peek(historyStack)
            setView(stackTop.view)
            updateScrollBehaviour(stackTop, mapRef)
            setBounds(stackTop, mapRef, setOverlays)
            updateState(
                stackTop,
                setSelectedCommunity,
                setSelectedRoute,
                setShowMenu,
                setScopedMarker,
                setRouteStartPoints,
                setRoutePoints,
                setOverlays,
                setRoutes,
                setView,
                routes,
                setStateRoutes
            )

            if (stackTop.view === 'STATE') {
                setSelState(stackTop.selectedElement as State)
            }
            if (stackTop.view === 'ROUTE') {
                const route = stackTop.selectedElement as ChannelType
                setSelectedRoute(route)
                setScopedCommunity(route)
                setIsChannelPopupOpen(true)
            }
            if (stackTop.view === 'COMM') {
                setSelectedCommunity(stackTop.selectedElement as ChannelType)
                setIsChannelPopupOpen(true)
            }
        } else {
            panTo([mapCenter.lng, mapCenter.lat], getZoomLevel("IND"), mapRef)
            setView("IND")
            setSelectedCommunity(null);
            setSelectedRoute(null);
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
        if (communities) setIdColorMap(recursivelyPopulateColorMap(communities))

    }, [communities])
    useEffect(() => {
        if (selectedCommunity && peek(historyStack).selectedElement !== selectedCommunity) {
            setIsChannelPopupOpen(true)
            setHistoryStack((prevStack: HistoryStack) => {
                return append([...prevStack],
                    {
                        view: "COMM",
                        selectedElement: selectedCommunity
                    }
                )
            })
        }
    }, [selectedCommunity])
    useEffect(() => {
        if (selectedRoute) {
            const selectedCommunity = communities.find(community => {
                return community.children.map(route => route.uniqueID).includes(selectedRoute.uniqueID)
            })
            setScopedCommunity(selectedCommunity)
            setScopedMarker(selectedRoute.contents.at(0))
            let stack = [...historyStack]
            const prevTop = peek(stack)
            //There are some cases to consider here.
            //1. Previous top of the stack was a state
            //2. Previous top of the stack was a community
            //In case 1, we want to add the correct community and this to the top of the stack
            //In case 2, we only add this to the top of the stack
            if (prevTop.view === "STATE") {
                stack = append([...stack], {
                    view: "COMM",
                    selectedElement: selectedCommunity
                })
            }

            stack = append([...stack], {
                view: "ROUTE",
                selectedElement: selectedRoute
            })
            setHistoryStack([...stack])
        }
    }, [selectedRoute])
    useEffect(() => {
        if (hoverCommunity) {
            setIsChannelPopupOpen(true)
        }

    }, [hoverCommunity])
    useEffect(() => {
        if (scopedMarker) {
            setIsContentPopupOpen(true)
            panTo(
                [scopedMarker.long, scopedMarker.lat],
                getZoomLevel("ROUTE"),
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
                style={{ zIndex: 0 }}
                mapStyle={mapStyle}
                scrollZoom={false}
                mapboxAccessToken={accessToken}
                onClick={(e) => {
                    if (states && view === "IND") {
                        const resultOfClick: State | null = handleClickStateLevel(e.lngLat, mapRef, (states))
                        if (resultOfClick) {
                            setView("STATE")
                            setCommunities(resultOfClick.communities)
                            const stackTop: HistoryStackElement = {
                                view: "STATE",
                                selectedElement: resultOfClick
                            }
                            setHistoryStack((prevStack: HistoryStack) => {
                                return append([...prevStack], stackTop)
                            })
                        }
                    }

                }}
            >
                {states && idColorMap && <Box sx={{ position: 'absolute', top: "50px", left: "80px", zIndex: 10 }}>
                    <div>
                        <DynMenu
                            setSelectedRoute={setSelectedRoute}
                            setScopedMarker={setScopedMarker}
                            setHistory={setHistoryStack} idColorMap={idColorMap} history={historyStack} topOfStack={peek(historyStack)} states={states} />
                    </div>
                </Box>}
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
                {view === "IND" && states && states.map((state: State) => {
                    return <Source id={"state"} type="geojson" data={state.features} >
                        <Layer id={state.name} {...createPolygonLayer()} />
                    </Source>
                })}
                {view === "STATE" && <div id="community">
                    {renderState(selState, idColorMap, routeAssets, routeAssetSelected, setHoverRoute, setIsChannelPopupOpen, setSelectedRoute)}
                    {hoverRoute && <ChannelPopup isFromHover={true} color={idColorMap[hoverRoute.uniqueID]} isOpen={isChannelPopupOpen} handleClose={setIsChannelPopupOpen} channel={hoverRoute} fixed={false}></ChannelPopup>}
                </div>
                }
                {view === "COMM" && <div id="route-start-points">
                    {renderCommunity(selectedCommunity, idColorMap, routeAssets, routeAssetSelected, setHoverRoute, setIsChannelPopupOpen, setSelectedRoute)}
                    {hoverRoute && <ChannelPopup isFromHover={true} color={idColorMap[hoverRoute.uniqueID]} isOpen={isChannelPopupOpen} handleClose={setIsChannelPopupOpen} channel={hoverRoute} fixed={false}></ChannelPopup>}
                </div>}


                {view === "ROUTE" && (selectedRoute) && <div id="route-points">
                 

                    <Source id="routes" type="geojson" data={createLineGeoJson(selectedRoute.contents)}>
                        {<Layer {...createLayer(idColorMap[routePoints[0].id])}></Layer>}
                    </Source>
                    {scopedMarker && renderRoutePoints(
                        selectedRoute.contents,
                        scopedMarker,
                        idColorMap[selectedRoute.contents[0].id] === COLORS[0] ? routeAssets[0] : routeAssets[1],
                        setScopedMarker,
                        idColorMap[selectedRoute.contents[0].id],
                        setIsContentPopupOpen
                    )}
                   
                    {scopedMarker && <ContentPopup 
                    onNextArrowClick={() => {
                        setScopedMarker(cycle(scopedMarker, routePoints, "UP"))
                    }}
                    onPrevArrowClick={() => {
                        setScopedMarker(cycle(scopedMarker, routePoints, "DOWN"))
                    }}
                    isOpen={isContentPopupOpen} onClose={setIsContentPopupOpen} content={scopedMarker} ></ContentPopup>}
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

                {
                    <div style={{ position: "absolute", top: "50px", right: '150px' }}>
                        <MenuOptions />
                    </div>
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
                <div style={{ position: 'absolute', bottom: 50, left: 0, width: "100%", backgroundColor: "white", }}>
                    <MapBreadCrumbs history={historyStack}></MapBreadCrumbs>

                </div>

            </Map>
        </Box>

    </>);
}