import { Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { MapRef, Marker } from 'react-map-gl';
import { Asset } from '../../Types/Asset.type';
import { ChannelContent, ChannelType } from "../../Types/Channel.types";

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
        {communities && communities.length !== 0 && communities.map((community: ChannelType) => {
            return (<>
                <Box>
                    <Marker
                        longitude={community.long}
                        latitude={community.lat}
                        style={{zIndex:10}}
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
                        > <Typography variant='h5' fontFamily={'BriemScript'}>{(community.name)}</Typography> </div>
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
    routes: ChannelType[]): ReactNode {
    return (
        <div>
            {routeStartPoints && routeStartPoints.length !== 0 &&
                routeStartPoints.map((marker: ChannelContent) => {
                    const route = routes.find((route: ChannelType) => route.contents.at(0) === marker)
                    return (
                        <>
                            <Marker
                                style={{zIndex:10}}
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

export function renderRoutePoints(routePoints: ChannelContent[], scopedMarker: ChannelContent, image: Asset, setScopedMarker: (marker: React.SetStateAction<ChannelContent>) => void): ReactNode {
    return (
        <>
            {routePoints.map((marker: ChannelContent) => (
                <div key={marker.id} onClick={(e)=>{setScopedMarker(marker)}}>
                    <Marker
                        longitude={marker.long}
                        latitude={marker.lat}
                        
                        style={{
                            cursor: 'pointer',
                            zIndex:10,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {(scopedMarker.id === marker.id) ? (
                            <>
                                <img src={image.url} style={{ margin: 'auto', width: '30px', height: '40px' }} /> {/* Apply native styles */}
                                <p style={{ fontFamily: 'BriemScript', color: '#894E35', fontSize: '20px', fontWeight: 700 }}>{marker.title}</p> {/* Apply native styles */}
                            </>
                        ) : (
                            <>
                                <img src={image.url} style={{ margin: 'auto', width: '20px', height: '30px' }} /> {/* Apply native styles */}
                                <p style={{ fontFamily: 'BriemScript', color: '#894E35', fontSize: '18px' }}>{marker.title}</p>
                            </>
                        )}
                    </Marker>
                </div>
            ))}



        </>
    );
}

