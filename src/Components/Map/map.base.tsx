import { ArrowCircleLeftTwoTone } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Map, Marker, Source } from 'react-map-gl';
import { COLORS } from "../../Constants/Colors/color.mapping.js";
import { BASE_MAP_BOUNDS } from '../../Constants/map.ts';
import { cycle } from "../../Functions/cycle.ts";
import { fetchData } from "../../Functions/fetchData.ts";
import { BoxBound } from '../../Types/Bounds.type.ts';
import { ChannelContent, ChannelType } from "../../Types/Channel.types.ts";
import { HistoryStack, HistoryStackElement, append, initialStackElement, peek, pop } from "../../Types/History.stack.type.ts";
import { MapProps } from "../../Types/MapProps";
import { Overlay } from "../../Types/Overlay.type.ts";
import { State, constructStates, getNestedRoutes } from "../../Types/State.type.ts";
import { VIEWMODE } from "../../Types/ViewMode.type.ts";
import { setBounds, updateScrollBehaviour } from "../State/map.state.handler.ts";
import { handleClickStateLevel } from "./Events/handleClick.ts";
import { createPolygonLayer } from "./Geometry/drawStates.ts";
import { getBounds } from './Geometry/getBounds.ts';
import { getZoomLevel } from "./Geometry/getZoomLevel.ts";
import { ChannelPopup, ContentPopup } from "./Popups/popup.main.tsx";
import { MapBreadCrumbs } from "./map.breadcrumbs.tsx";
import { DynMenu } from "./map.dyn.menu.tsx";
import { MenuOptions } from './map.options.menu.tsx';
import { panTo } from "./map.utils.tsx";
import { renderCommunityView, renderRouteView, renderStateView } from './map.views.tsx';
import { useKeyPress } from "@uidotdev/usehooks";

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
    const mapRef = useRef(null);
    /**
     * useState hooks for data management
     */

    // UI State
    const [hoverRoute, setHoverRoute] = useState<ChannelType>(null);
    const [scopedMarker, setScopedMarker] = useState<ChannelContent>(null);
    
    //Popup State
    const [isContentPopupOpen, setIsContentPopupOpen] = useState<boolean>(false);
    const [isChannelPopupOpen, setIsChannelPopupOpen] = useState<boolean>(false);

    //Data State
    const [states, setStates] = useState<State[]>([]);
    const [communities, setCommunities] = useState<ChannelType[]>(null);

    const [view, setView] = useState<VIEWMODE>("IND");
    const [overlays, setOverlays] = useState<Overlay[]>([]);
    const [historyStack, setHistoryStack] = useState<HistoryStack>([]);


    /** 
     * Cached data stores to avoid expensive recomputation
     */
    const [stateRouteMap, setStateRouteMap] = useState<Record<string, ChannelType[]>>()
    const [idColorMap, setIdColorMap] = useState<Record<string, string>>()
    const [idBoundsMap, setIdBoundsMap] = useState<Record<string, BoxBound>>()
    const [loaded, setLoaded] = useState(false)
    
    
    
    const recursivelyPopulateColorMap = ( states:State[]) => {
        const map: Record<string, string> = {};
        const helper = (community: ChannelType, map: Record<string, string>, index: number) => {
            map[community.uniqueID] = COLORS[index % (COLORS.length)]
            if (!community.children) return
            if (community.contents) for (const content of community.contents) map[content.id] = COLORS[index % (COLORS.length)]
            for (const child of community.children) helper(child, map, index)
        }
        

        for(const state of states){
            const comms = state.communities
            for(let i = 0; i < communities.length; i++){helper(communities[i], map, i);}
        }
        setIdColorMap(map)
        // for (let i = 0; i < communities.length; i++) helper(communities[i], map, i);
        // setIdColorMap(map);
    }





    const recursivelyPopulateBoundsMap = (communities: ChannelType[]) => {
        const map: Record<string, BoxBound> = {};
        const helper = (community: ChannelType, map: Record<string, BoxBound>) => {
            map[community.uniqueID] = getBounds(community)
            if (community.children) community.children.forEach(child => helper(child, map))
        }
        communities.forEach((community: ChannelType) => helper(community, map))
        setIdBoundsMap(map)
    }
    const populateStateRouteMap = (states: State[]) => {
        let map: Record<string, ChannelType[]> = {}
        states.forEach(state => {
            map[state.name] = getNestedRoutes(state)
        })
        setStateRouteMap(map);

    }
    /**
     * 
     * UI/State Management Maxim
     * 1. The stack acts as the intermediary between UI elements and the state
     * 2. UI Interaction will only update the stack
     * 3. As soon as an item is pushed onto the stack, the state will be updated
     * 4. The UI updates in sync with the state
     */
    /**
     * Data Fetching
     */
    useEffect(() => {
        fetchData(channelId).then((data) => {
            setCommunities(data.children);
            setZoom(getZoomLevel(view));
        })
    }, [])
    /**
     * Computing data
     */
    useEffect(() => {
        if (communities) setStates(constructStates(communities))
        if (communities) recursivelyPopulateBoundsMap(communities)
    }, [communities])

    useEffect(() => {
        if (states) populateStateRouteMap(states)
        if (states) recursivelyPopulateColorMap(states)

    }, [states])

    //Once these are computed, we initialize the stack and display the map.
    useEffect(() => {
        if (stateRouteMap && idColorMap && idBoundsMap) setLoaded(true)
    }, [stateRouteMap, idBoundsMap, idColorMap])

    useEffect(() => { if (loaded) setHistoryStack([initialStackElement]) }, [loaded])
    /**
     * useState hooks for UI management
     */
    const [zoom, setZoom] = useState(getZoomLevel(view))

    useEffect(()=>{console.log(view)}, [view])
    /**
     * useEffect Hooks
     */
    //This useEffect hook will automagically set zoom level, proper coordinates, and overlays based on the last element on the stack.
    useEffect(() => {
        if (historyStack && historyStack.length > 1) {
            const stackTop = peek(historyStack)
            setView(stackTop.view)
            updateScrollBehaviour(stackTop, mapRef)
            setBounds(stackTop, mapRef, setOverlays, idBoundsMap)
            if (stackTop.view === 'ROUTE') setScopedMarker(((stackTop.selectedElement) as ChannelType).contents.at(0))
        } else {
            panTo([mapCenter.lng, mapCenter.lat], getZoomLevel("IND"), mapRef)
            setView("IND")
            mapRef.current && mapRef.current.getMap().setMaxBounds(BASE_MAP_BOUNDS)
        }

    }, [historyStack])


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


    document.onkeydown = onKeyPress;


    function onKeyPress(e:KeyboardEvent){
        if((e.key === 'ArrowRight' || e.key==='ArrowLeft') && view === 'ROUTE' && scopedMarker!==null){
            e.preventDefault()
            const routePoints = (peek(historyStack).selectedElement as ChannelType).contents
            setScopedMarker(cycle(scopedMarker,(peek(historyStack).selectedElement as ChannelType).contents, 
            (e.key === 'ArrowRight' ? "UP" : "DOWN" )))
        }
    }



    if (historyStack.length === 0) return <></>

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
                    if (view === "IND") {
                        const resultOfClick: State | null = handleClickStateLevel(e.lngLat, mapRef, (states))
                        if (resultOfClick) {
                            setView("STATE")
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
                <Box sx={{ position: 'absolute', top: "50px", left: "80px", zIndex: 10 }}>
                    <div>
                        <DynMenu
                            setHistory={setHistoryStack}
                            setScopedMarker={setScopedMarker}
                            idColorMap={idColorMap}
                            history={historyStack}
                            topOfStack={peek(historyStack)}
                            states={states}
                            scopedMarker={scopedMarker}
                            
                            />
                    </div>
                </Box>
                {view === "IND" && states && states.map((state: State) => {
                    return <Source id={state.name} type="geojson" data={state.features} >
                        <Layer id={state.name} {...createPolygonLayer(state.name)} />
                    </Source>
                })}
                {view === "STATE" && <div id="community">
                    {renderStateView(
                        historyStack,
                        setHistoryStack,
                        idColorMap,
                        setHoverRoute,
                        setIsChannelPopupOpen,
                        stateRouteMap,
                        communities,
                    )
                    }
                    {hoverRoute && <ChannelPopup isFromHover={true} color={idColorMap[hoverRoute.uniqueID]} isOpen={isChannelPopupOpen} handleClose={setIsChannelPopupOpen} channel={hoverRoute} fixed={false}></ChannelPopup>}
                </div>
                }
                {view === "COMM" && <div id="route-start-points">

                    {renderCommunityView(
                        historyStack,
                        setHistoryStack,
                        idColorMap,
                        setHoverRoute,
                        setIsChannelPopupOpen,
                        communities
                    )
                    }
                    {hoverRoute &&
                        <ChannelPopup
                            isFromHover={true}
                            color={idColorMap[hoverRoute.uniqueID]}
                            isOpen={isChannelPopupOpen}
                            handleClose={setIsChannelPopupOpen}
                            channel={hoverRoute}
                            fixed={false}></ChannelPopup>}
                </div>}
                {view === "ROUTE" && scopedMarker && <div id="route-points">
                    {renderRouteView(
                        historyStack,
                        scopedMarker,
                        setScopedMarker,
                        idColorMap,
                        communities
                    )}
                    {scopedMarker &&
                        <ContentPopup
                            onNextArrowClick={() => { setScopedMarker(cycle(scopedMarker,(peek(historyStack).selectedElement as ChannelType).contents, "UP")) }}
                            onPrevArrowClick={() => { setScopedMarker(cycle(scopedMarker, (peek(historyStack).selectedElement as ChannelType).contents, "DOWN")) }}
                            isOpen={isContentPopupOpen}
                            onClose={setIsContentPopupOpen}
                            content={scopedMarker}
                            color={idColorMap[scopedMarker.id]}
                        ></ContentPopup>
                }
                </div>}


                


                <div style={{ position: "absolute", top: "50px", right: '150px' }}>
                    <MenuOptions />
                </div>


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