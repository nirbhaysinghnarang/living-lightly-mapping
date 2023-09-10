import { ChannelType } from "./Channel.types"
import { getBounds } from "../Components/Map/Geometry/getBounds";
import { getStatesJson } from "../Components/Map/Geometry/drawStates"
import { geoContains } from 'd3-geo';
import { Feature, Polygon, Point, center } from "@turf/turf";
import { BASE_MAP_BOUNDS } from "../Constants/map";
import { BoxBound, MapBounds, get2DBounds, getBoundsFromBox } from "./Bounds.type";

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
 * @returns a 2d matrix representing the maximal geographical 'bounds' of a state depending on all nested communities
 */
export function getStateBounds(state:State): BoxBound{
    if(!state || !state.communities || state.communities.length === 0){
        return BASE_MAP_BOUNDS as BoxBound
    }
    var stateBounds:MapBounds = {
        minLng: Infinity,
        minLat:Infinity,
        maxLat:-Infinity,
         maxLng:-Infinity
    }
    state.communities.forEach((community:ChannelType)=>{
        const communityBounds = getBoundsFromBox(getBounds(community))
        stateBounds.minLng = Math.min(stateBounds.minLng, communityBounds.minLng)
        stateBounds.maxLng = Math.max(stateBounds.maxLng, communityBounds.maxLng)
        stateBounds.minLat = Math.min(stateBounds.minLat, communityBounds.minLat)
        stateBounds.maxLat = Math.max(stateBounds.maxLat, communityBounds.maxLat)
    })

   return  get2DBounds(stateBounds)

}