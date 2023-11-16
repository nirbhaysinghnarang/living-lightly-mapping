import { Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { Layer, MapRef, Marker, Source } from 'react-map-gl';
import { Asset } from '../../Types/Asset.type';
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { State, getNestedRoutes } from "../../Types/State.type";
import { createLineGeoJson } from "./Geometry/lineGeoJson";
import { createLayer } from "./Geometry/routeLayer";
export const panTo = (coords: [number, number], zoom: number, mapRef: React.RefObject<MapRef>) => {
    if (mapRef.current) {
        mapRef.current.flyTo(
            {
                center: coords, zoom: zoom,
                speed: 1,
                curve: 1,
                easing(t: number) {
                    return t;
                }
            },
        )
    }
}

export function renderCommunities(
    communities: ChannelType[],
    setSelectedCommunity: (community: ChannelType) => void,
    setHoverCommunity: (community: ChannelType) => void):
    ReactNode {
    return (<>
        {communities && communities.length !== 0 && communities.map((community: ChannelType, index: number) => {
            return (<>
                <Box>
                    <Marker
                        longitude={community.long}
                        latitude={community.lat}
                        style={{ zIndex: 10 }}
                    >
                        <div onClick={(e) => {
                            setSelectedCommunity(community);
                        }}
                            onMouseEnter={(e) => {
                                e.stopPropagation()
                                setHoverCommunity(community)
                            }}
                            onMouseLeave={(e) => {
                                e.stopPropagation()
                                setHoverCommunity(null)
                            }}
                        > <Typography variant='h5' fontFamily={'Source Serif'}>{(community.name)}</Typography> </div>
                    </Marker>
                </Box>);
            </>);
        })



        }
    </>)


}
export function renderRouteStartPoints(
    routeStartPoints: ChannelContent[],
    setSelectedRoute: (routeStartPoint: ChannelContent) => void,
    image: Asset,
    setHoverItem: (route: ChannelType) => void,
    routes: ChannelType[]

): ReactNode {
    return (
        <div>
            {routeStartPoints && routeStartPoints.length !== 0 &&
                routeStartPoints.map((marker: ChannelContent) => {
                    const route = routes.find((route: ChannelType) => route.contents.at(0) === marker)
                    return (
                        <>
                            <Marker
                                style={{ zIndex: 10 }}
                                key={marker.id}
                                longitude={marker.long}
                                latitude={marker.lat}>
                                <div>
                                    <img
                                        onMouseEnter={() => { setHoverItem(route) }}
                                        onMouseLeave={() => { setHoverItem(undefined) }}
                                        onClick={() => setSelectedRoute(marker)}
                                        src={
                                            image.url
                                        } alt={image.id} style={{ height: "40px", boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', }}
                                    />
                                </div>
                            </Marker>
                        </>);
                })}
        </div>);
}
export function renderRoutePoints(routePoints: ChannelContent[], scopedMarker: ChannelContent, image: Asset, setScopedMarker: (marker: React.SetStateAction<ChannelContent>) => void, color: string,
    setIsContentPopupOpen: (b: boolean) => void
): ReactNode {
    return (
        <>
            {routePoints.map((marker: ChannelContent) => {
                return <div key={marker.id} onClick={(e) => { setScopedMarker(marker); setIsContentPopupOpen(true) }}>
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
                        {(scopedMarker.id === marker.id) ? (
                            <>
                                <img src={image.url} style={{ margin: 'auto', width: '30px', }} /> {/* Apply native styles */}
                                <p style={{ fontFamily: 'Source Serif', color: color, fontSize: '20px', fontWeight: 700 }}>{marker.tags.length > 0 ? marker.tags[0].tag : marker.title}</p> {/* Apply native styles */}
                            </>
                        ) : (
                            <>
                                <img src={image.url} style={{ margin: 'auto', width: '20px', }} /> {/* Apply native styles */}
                                <p style={{ fontFamily: 'Source Serif', color: color, fontSize: '18px' }}>{marker.tags.length > 0 ? marker.tags[0].tag : marker.title}</p>
                            </>
                        )}
                    </Marker>
                </div>
            }

            )}



        </>
    );
}
function renderRoutes(
    routes: ChannelType[],
    idColorMap: Record<string, string>,
    routeAssets: Asset[],
    routeAssetsSelected: Asset[],
    setHoverRoute: (route: ChannelType) => void,
    displayPopup: (show: boolean) => void,
    setSelectedRoute: (route: ChannelType) => void
): ReactNode {

    return routes.map(route => {
        const image: Asset = idColorMap[route.uniqueID] === '#4ab975' ? routeAssets[0] : routeAssets[1];
        const imageHighlighted: Asset = idColorMap[route.uniqueID] === '#4ab975' ? routeAssetsSelected[0] : routeAssetsSelected[1];
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
                            onClick={() => { setSelectedRoute(route) }}
                        >
                            <img src={imageHighlighted.url} style={{ margin: 'auto', width: '30px' }} alt="route-pt" />
                        </div>}
                    {index !== 0 && <div >
                        <img src={image.url} style={{ margin: 'auto', width: '20px' }} alt="route-pt" />
                    </div>}


                </Marker>


            </div>
        })
    })
}
function renderRouteLayers(routes: ChannelType[], idColorMap: Record<string, string>) {

   return <>
        {routes.map((route: ChannelType) => {
            return <Source id={`route-${route.uniqueID}`}type="geojson" data={createLineGeoJson(route.contents)}>
                <Layer {...createLayer(idColorMap[route.uniqueID], route.uniqueID)}></Layer>
            </Source>

        })}
    </>

}

export function renderState(
    state: State,
    idColorMap: Record<string, string>,
    routeAssets: Asset[],
    routeAssetsSelected: Asset[],
    setHoverRoute: (route: ChannelType) => void,
    displayPopup: (show: boolean) => void,
    setSelectedRoute: (route: ChannelType) => void) {
    const routes = getNestedRoutes(state)
    return <>
        {renderRoutes(routes, idColorMap, routeAssets, routeAssetsSelected, setHoverRoute, displayPopup, setSelectedRoute)}
        {renderRouteLayers(routes, idColorMap)}
    </>

}


export function renderCommunity(
    community: ChannelType,
    idColorMap: Record<string, string>,
    routeAssets: Asset[],
    routeAssetsSelected: Asset[],
    setHoverRoute: (route: ChannelType) => void,
    displayPopup: (show: boolean) => void,
    setSelectedRoute: (route: ChannelType) => void) {
    return <>
        {renderRoutes(community.children, idColorMap, routeAssets, routeAssetsSelected, setHoverRoute, displayPopup, setSelectedRoute)}
        {renderRouteLayers(community.children, idColorMap)}
    </>
}