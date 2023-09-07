import { Marker } from 'react-map-gl';
import { Map } from "mapbox-gl";
import { ReactNode } from "react";
import { Box } from "@mui/material";
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

export function renderCommunities(communities: ChannelType[], setSelectedCommunity: (community: ChannelType) => void): ReactNode {
    return (<>
        {communities && communities.length !== 0 && communities.map((community: ChannelType) => {
            return (<>
                <Box>
                    <Marker
                        longitude={community.long}
                        latitude={community.lat}>
                        <p onClick={() => {

                            setSelectedCommunity(community);

                        }}> {(community.name)} </p>
                    </Marker>
                </Box>);
            </>);
        })



        }
    </>)


}

export function renderRouteStartPoints(routeStartPoints: ChannelContent[], setSelectedRoute: (routeStartPoint: ChannelContent) => void, image: Asset): ReactNode {
    console.log(image)
    return (
        <>
            {routeStartPoints && routeStartPoints.length !== 0 &&
                routeStartPoints.map((marker: ChannelContent) => {
                    return (
                        <div className={"flex"}>
                            <Marker
                                longitude={marker.long}
                                latitude={marker.lat}
                                onClick={() => {

                                }}
                            >
                                <div className={'cursor-pointer '}>
                                    <img
                                        className={'shadow-2xl'}
                                        src={
                                           image.url
                                        } alt={image.id} style={{ height: "40px" }}
                                    />
                                </div>
                            </Marker>
                        </div>);
                })}
        </>);
}