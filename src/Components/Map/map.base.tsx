import { ArrowCircleLeftTwoTone } from '@mui/icons-material';
import { Box, IconButton, Stack } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Map, Marker, Projection, Source } from 'react-map-gl';
import { COLORS } from "../../Constants/Colors/color.mapping.js";
import { BASE_MAP_BOUNDS } from '../../Constants/map.ts';
import { cycle } from "../../Functions/cycle.ts";
import { fetchData } from "../../Functions/fetchData.ts";
import { BoxBound } from '../../Types/Bounds.type.ts';
import { ChannelContent, ChannelType, Tag } from "../../Types/Channel.types.ts";
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
import { ChannelPopup, ContentPopup, StartPopup } from "./Popups/popup.main.tsx";
import { MapBreadCrumbs } from "./map.breadcrumbs.tsx";
import { DynMenu } from "./map.dyn.menu.tsx";
import { MenuOptions } from './map.options.menu.tsx';
import { panTo } from "./map.utils.tsx";
import { renderCommunityView, renderRouteView, renderStateView } from './map.views.tsx';
import { geoContains } from "d3-geo";


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


    const [hoveredStateName, setHoveredStateName] = useState<string>("null")

    const [imm, setImm] = useState(false);



    const recursivelyPopulateColorMap = (states: State[]) => {
        const map: Record<string, string> = {};
        const helper = (community: ChannelType, map: Record<string, string>, index: number) => {
            map[community.uniqueID] = COLORS[index % (COLORS.length)]
            if (!community.children) return
            if (community.contents) for (const content of community.contents) map[content.id] = COLORS[index % (COLORS.length)]
            for (const child of community.children) helper(child, map, index)
        }
        for (const state of states) {
            const comms = state.communities
            for (let i = 0; i < comms.length; i++) { helper(comms[i], map, i); }
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


    const unnestTags = (communities: ChannelType[]): Tag[] => {
        const helper = (communities: ChannelType[], tags: Tag[] = []): Tag[] => {
            if (communities.length === 0) return tags;
    
            for (const comm of communities) {
                if (comm.contents) {
                    for (const content of comm.contents) {
                        tags = tags.concat(content.tags);
                    }
                }
                if (comm.children) {
                    tags = helper(comm.children, tags);
                }
            }
            return tags;
        };
    
        return helper(communities);
    };


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
           //console.log(unnestTags(data.children))
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

    /**
     * useEffect Hooks
     */
    //This useEffect hook will automagically set zoom level, proper coordinates, and overlays based on the last element on the stack.
    useEffect(() => {
        if (historyStack && historyStack.length > 1) {
            if (!mapRef.current) return;
            const stackTop = peek(historyStack)
            setView(stackTop.view)
            updateScrollBehaviour(stackTop, mapRef)
            setBounds(stackTop, mapRef, setOverlays, idBoundsMap)
            if (stackTop.view === 'ROUTE') {
                setImm(true)
                setScopedMarker(((stackTop.selectedElement) as ChannelType).contents.at(0))
            
            }

        } else {
            panTo([mapCenter.lng, mapCenter.lat], getZoomLevel("IND"), mapRef)
            setView("IND")
            mapRef.current && mapRef.current.getMap().setMaxBounds(BASE_MAP_BOUNDS)
        }

    }, [historyStack])


    const prevScopedMarker = useRef<ChannelContent|ChannelType>();



    useEffect(() => {
        if (scopedMarker && (prevScopedMarker.current !== scopedMarker)) {
            if (!imm) setIsContentPopupOpen(true);
            panTo(
                [scopedMarker.long, scopedMarker.lat],
                getZoomLevel("ROUTE"),
                mapRef
            );
            prevScopedMarker.current = scopedMarker; 
        }
    }, [scopedMarker, imm]);



    document.onkeydown = onKeyPress;


    function onKeyPress(e: KeyboardEvent) {
        if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && view === 'ROUTE' && scopedMarker !== null) {
            e.preventDefault()
            setScopedMarker(cycle(scopedMarker, (peek(historyStack).selectedElement as ChannelType).contents,
                (e.key === 'ArrowRight' ? "UP" : "DOWN")))
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
                projection={{ name: 'globe' }}
                id="primary_map"
                ref={mapRef}
                style={{ zIndex: 0 }}
                mapStyle={mapStyle}
                scrollZoom={false}
                mapboxAccessToken={accessToken}
                onMouseMove={(e) => {
                    if(!mapRef.current) return;
                    if (view === "IND") {
                        const filtered = states.filter((state: State) => {
                            return geoContains(state.features, [e.lngLat.lng, e.lngLat.lat]);
                        });
                        if (!filtered || filtered.length === 0) {
                            if (hoveredStateName) { // Reset opacity if there is no state under the cursor but there was one before
                                mapRef.current.getMap().setPaintProperty(hoveredStateName, 'fill-opacity', 1);
                                setHoveredStateName("")
                            }
                            return null;
                        }
                        const state = filtered[0];
                        if (hoveredStateName !== state.name) {
                            if (hoveredStateName) {
                                // Reset opacity of previously hovered state
                                mapRef.current.getMap().setPaintProperty(hoveredStateName, 'fill-opacity', 1);
                            }
                            // Change opacity of the new hovered state
                            mapRef.current.getMap().setPaintProperty(state.name, 'fill-opacity', 0.5);
                            setHoveredStateName(state.name)
                        }
                    }
                }}

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
                        <Layer id={state.name} {...createPolygonLayer(state.name)}
                        />
                    </Source>
                })}
                {view === "STATE" && <div id="community"> && mapRef.current &&
                    {renderStateView(
                        historyStack,
                        setHistoryStack,
                        idColorMap,
                        setHoverRoute,
                        setIsChannelPopupOpen,
                        stateRouteMap,
                        communities,
                        mapRef.current
                    )
                    }
                    {hoverRoute && mapRef.current && <ChannelPopup isFromHover={true} color={idColorMap[hoverRoute.uniqueID]} isOpen={isChannelPopupOpen} handleClose={setIsChannelPopupOpen} channel={hoverRoute} fixed={false} map={mapRef.current.getMap()}></ChannelPopup>}
                </div>
                }
                {view === "COMM" && <div id="route-start-points"> && mapRef.current &&

                    {renderCommunityView(
                        historyStack,
                        setHistoryStack,
                        idColorMap,
                        setHoverRoute,
                        setIsChannelPopupOpen,
                        communities,
                        mapRef.current
                    )
                    }
                    {hoverRoute && mapRef.current &&
                        <ChannelPopup
                            isFromHover={true}
                            color={idColorMap[hoverRoute.uniqueID]}
                            isOpen={isChannelPopupOpen}
                            handleClose={setIsChannelPopupOpen}
                            channel={hoverRoute}
                            map={mapRef.current.getMap()}
                            fixed={false}></ChannelPopup>}
                </div>}
                {view === "ROUTE" && scopedMarker && <div id="route-points"> && mapRef.current &&
                    {renderRouteView(
                        historyStack,
                        scopedMarker,
                        setScopedMarker,
                        idColorMap,
                        communities,
                        mapRef.current
                    )}


                    {scopedMarker && mapRef.current && imm && <StartPopup setImm={setImm} setPopupOpen={setIsContentPopupOpen}route={peek(historyStack).selectedElement as ChannelType} idColorMap={idColorMap}></StartPopup>}
                    {scopedMarker && mapRef.current && 
                        <ContentPopup
                            onNextArrowClick={() => { setScopedMarker(cycle(scopedMarker, (peek(historyStack).selectedElement as ChannelType).contents, "UP")) }}
                            onPrevArrowClick={() => { setScopedMarker(cycle(scopedMarker, (peek(historyStack).selectedElement as ChannelType).contents, "DOWN")) }}
                            isOpen={isContentPopupOpen}
                            onClose={setIsContentPopupOpen}
                            content={scopedMarker}
                            map={mapRef.current.getMap()}
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
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: "100%",  backgroundImage: `url('Assets/Images/footer.png')`, zIndex: 999, height:'100px', alignContent:'center', paddingTop:'10px', paddingLeft:'10px'}}>
                    <Stack direction="row" sx={{width:"100%"}} justifyContent={"space-between"} alignContent={"center"}>
                    <MapBreadCrumbs history={historyStack} setHistory={setHistoryStack}></MapBreadCrumbs>
                    <img src="Assets/Images/logo.png" height={50} style={{marginRight:'20px'}}></img>

                    </Stack>
                </div>

            </Map>
        </Box>

    </>);
}