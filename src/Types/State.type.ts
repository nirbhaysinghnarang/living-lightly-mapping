import { ChannelType, getBounds } from "./Channel.types"
import { getStatesJson } from "../Components/Map/Geometry/drawStates"
import { geoContains } from 'd3-geo';
import { Feature, Polygon, Point, center } from "@turf/turf";
import { BASE_MAP_BOUNDS } from "../Constants/map";

export type State = {
    name: string,
    features: Polygon,
    communities: ChannelType[],
    center: Feature<Point>
}


export function constructStates(communities: ChannelType[]): State[] {

    const stateJsons: Record<string, any>[] = getStatesJson(communities);

    const states = stateJsons.map((json: Record<string, any>) => {
        return {
            name: json["properties"]["VARNAME_1"],
            features: json["geometry"],
            communities: [],
            center: center(json["geometry"])
        }
    })

    for (const state of states) {
        for (const community of communities) {
            const center = [community.long, community.lat] as [number, number];
            if (geoContains(state.features, center)) {
                state.communities.push(community)
            }
        }
    }
    return states
}

/**
 * 
 * @param state 
 * @returns a 2d matrix representing the 'bounds' of a state depending on all nested communities
 */
export function getStateBounds(state:State): number[][]{
    if(!state || !state.communities || state.communities.length === 0){
        return BASE_MAP_BOUNDS
    }

    var minLng = Infinity
    var minLat = Infinity
    var maxLat = -Infinity
    var maxLng = -Infinity

    state.communities.forEach((community:ChannelType)=>{
        const [
            [maxLngComm, minLatComm], 
            [minLngComm, maxLatComm]
        ] = getBounds(community)
        minLng = Math.min(minLng, minLngComm)
        maxLng = Math.max(maxLng, maxLngComm)
        minLat = Math.min(minLat, minLatComm)
        maxLat = Math.max(maxLat, maxLatComm)
    })

    return [
        [minLng, minLat], 
        [maxLng, maxLat]
    ]

}