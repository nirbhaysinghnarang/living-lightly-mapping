import bezierSpline from '@turf/bezier-spline';
import { lineString } from "@turf/helpers";
import { ChannelContent } from "../../../Types/Channel.types";
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
