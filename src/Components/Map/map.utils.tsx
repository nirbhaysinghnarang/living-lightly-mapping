import { Marker } from 'react-map-gl';
import { Map } from "mapbox-gl";
import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { Asset } from '../../Types/Asset.type';
export const panTo = (coords: [number, number], zoom: number, mapRef: React.RefObject<Map>) => {
    if (mapRef.current) {
        mapRef.current.flyTo(
            {
                center: coords, zoom: zoom,
                speed: 5,
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
                            e.stopPropagation()
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

export function renderRoutePoints(routePoints: ChannelContent[], onClick: (marker: ChannelContent) => void, scopedMarker: ChannelContent, image: Asset): ReactNode {



    return (
        <>
            {routePoints.map((marker: ChannelContent) => (
                <div key={marker.id}>
                    <Marker
                    
                        longitude={marker.long}
                        latitude={marker.lat}
                        onClick={() => onClick(marker)}
                        style={{
                            cursor: 'pointer',
                            zIndex:10,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {(scopedMarker.lat === marker.lat && scopedMarker.long === marker.long) ? (
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

