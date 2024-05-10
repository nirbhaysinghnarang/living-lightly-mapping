import { Stack } from "@mui/material";
import React, { ReactNode } from "react";
import { Layer, MapRef, Marker, Source } from 'react-map-gl';
import { routeAssetSelected, routeAssets } from "../../Constants/assets";
import { Asset } from '../../Types/Asset.type';
import { ChannelContent, ChannelType, Tag } from "../../Types/Channel.types";
import { HistoryStack, append, peek } from "../../Types/History.stack.type";
import { createLineGeoJson } from "./Geometry/lineGeoJson";
import { createLayer } from "./Geometry/routeLayer";
import { useState } from "react";
import { RadioButtonUnchecked, RadioButtonChecked, Circle } from "@mui/icons-material";
export const panTo = (coords: [number, number], zoom: number, mapRef: React.RefObject<MapRef>) => {
    const latOffset = -0.05;
    const adjustedCoords: [number, number] = [coords[0], coords[1] + latOffset];

    if (mapRef.current) {
        mapRef.current.flyTo(
            {
                center: adjustedCoords, zoom: zoom,
                speed: 2,
                curve: 1,
                easing(t: number) {
                    return t;
                }
            },
        )
    }
}

export function renderRoutes(
    routes: ChannelType[],
    idColorMap: Record<string, string>,
    setHoverRoute: (route: ChannelType) => void,
    displayPopup: (show: boolean) => void,
    setHistory: (stack: HistoryStack) => void,
    history: HistoryStack,
    communities: ChannelType[]
): ReactNode {
    return routes.map(route => {
        const image: Asset = idColorMap[route.uniqueID] === '#4ab975' ? routeAssets[0] : routeAssets[1];
        const imageHighlighted: Asset = idColorMap[route.uniqueID] === '#4ab975' ? routeAssetSelected[0] : routeAssetSelected[1];
        return route.contents.map((marker: ChannelContent, index: number) => {
            return <div key={marker.id} >
                <Marker
                    longitude={marker.long}
                    latitude={marker.lat}
                    style={{
                        cursor: 'pointer',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    {index === 0 &&
                        <div
                            onMouseEnter={() => { setHoverRoute(route); displayPopup(true) }}
                            onMouseLeave={() => { setHoverRoute(null); displayPopup(false) }}
                            onClick={() => {
                                //If the top of the stack is a community, we just add this route
                                //If the top of the stack is a state, we need to add both
                                //this route and its community
                                const top = peek(history)
                                const stack = [...history]
                                const view = top.view
                                if (view === "ROUTE") return;
                                if (view === 'STATE') {
                                    const commununity = route.parent;
                                    append(stack, {
                                        view: "COMM",
                                        selectedElement: commununity
                                    })
                                }
                                append(stack, {
                                    view: "ROUTE",
                                    selectedElement: route
                                })

                                setHistory([...stack])
                            }}
                        >

                            <RadioButtonChecked sx={{ color: idColorMap[route.uniqueID], zIndex: 99, fontSize: 20 }}></RadioButtonChecked>
                        </div>}
                    {index !== 0 && <div >
                        <Circle sx={{ color: idColorMap[route.uniqueID], zIndex: 99, fontSize: 15 }}></Circle>

                    </div>}
                </Marker>
            </div>
        })
    })
}

export function renderRouteLayer(
    route: ChannelType,
    idColorMap: Record<string, string>,
    map: any,
) {
    const layerProps = createLayer(idColorMap[route.uniqueID], route.uniqueID);

    // Add hover effect

    return (<>
        <Source id={route.uniqueID} type="geojson" data={createLineGeoJson(route.contents)}>
            {<Layer  {...createLayer(idColorMap[route.uniqueID], route.uniqueID)}></Layer>}
        </Source>
    </>
    );
}

export function renderRouteLayers(routes: ChannelType[], idColorMap: Record<string, string>, map: any) {
    return <>
        {routes.map((route: ChannelType) => {
            return renderRouteLayer(route, idColorMap, map)
        })}
    </>
}




function isTagImageType(tags: Tag[]) {
    for (const tag of tags) {
        if (tag.thumbnail !== null) return [true, tag]
    }
    return [false, null]
}


export function renderRoutePoints(
    scopedMarker: ChannelContent,
    setScopedMarker: (m: ChannelContent) => void,
    image: Asset,
    history: HistoryStack,
    color: string,
): ReactNode {

    const top = peek(history)
    const view = top.view
    if (view !== "ROUTE") return <></>

    const route = top.selectedElement as ChannelType
    const routePoints = route.contents
    const flag = isTagImageType(scopedMarker.tags);

    return (
        <>
            {routePoints.map((marker: ChannelContent) => {
                return <Stack
                    key={marker.id}
                    onClick={(e: any) => {
                        setScopedMarker(marker)
                    }}
                    direction={"row"}
                    justifyContent={"center"}
                    alignContent={"center"}
                >
                    <Marker
                        longitude={marker.long}
                        latitude={marker.lat}
                        style={{
                            cursor: 'pointer',
                            zIndex: 10,
                        }}
                    >
                        <Stack justifyContent="center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: "45%" }}>
                            {(scopedMarker.id === marker.id) ? (
                                <>
                                    <RadioButtonChecked style={{ marginRight: '10px', width: '20px', color: color, zIndex: 99 }} />
                                    <p style={{ fontFamily: 'Source Serif ', color: color, fontSize: '20px' }}>{marker.tags.length > 0 ? marker.tags[0].tag : ""}</p>
                                </>
                            ) : (
                                <>
                                    <Circle style={{ marginRight: '10px', width: '20px', color: color, zIndex: 99 }} />
                                    <p style={{ fontFamily: 'Source Serif ', color: color, fontSize: '18px' }}>{marker.tags.length > 0 ? marker.tags[0].tag : ""}</p>
                                </>
                            )}
                            {flag[0] && <img src={(flag[1] as Tag)?.thumbnail.url} height={20} width={20} style={{ margin: '20px' }}></img>}



                        </Stack>
                    </Marker>
                </Stack>
            }

            )}



        </>
    );
}
