import { ChannelContent } from "../../../Types/Channel.types";
import bezierSpline from '@turf/bezier-spline';
import {lineString } from "@turf/helpers";

export function createLineGeoJson(route_markers:ChannelContent[]) {
    const geometry = bezierSpline(
        lineString(
            route_markers.map(marker => [marker.long, marker.lat]
            )
        )
    );
    return {
        'id': 'routes',
        'type': 'Feature',
        ...geometry
    };
}
