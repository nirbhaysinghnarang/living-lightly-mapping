import { Feature, Point, Polygon, center } from "@turf/turf";
import { geoContains } from 'd3-geo';
import { getStatesJson } from "../Components/Map/Geometry/drawStates";
import { getBounds } from "../Components/Map/Geometry/getBounds";
import { BASE_MAP_BOUNDS } from "../Constants/map";
import { BoxBound, MapBounds, get2DBounds, getBoundsFromBox } from "./Bounds.type";
import { ChannelType } from "./Channel.types";


export type State = {
    name: string,
    features: Polygon,
    communities: ChannelType[],
    center: Feature<Point>
}

function deduplicateStates(states: State[]): State[] {
    if (!states || states.length === 0) return states;

    const sortedStates = states.sort((thisState, thatState) => thisState.name.localeCompare(thatState.name));

    const uniqueStates = sortedStates.reduce((unique, current) => {
        const isDuplicate = unique.find(state => state.name === current.name);
        if (!isDuplicate) {
            unique.push(current);
        }
        return unique;
    }, [] as State[]);

    return uniqueStates;
}

export function constructStates(communities: ChannelType[]): State[] {

    const stateJsons: Record<string, any>[] = getStatesJson(communities);
    console.log(stateJsons)
    const states = stateJsons.map((json: Record<string, any>) => {
        return {
            name: json["properties"]["NAME_1"],
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
    return deduplicateStates(states)
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
    return get2DBounds(stateBounds)

}

export function getNestedRoutes(state:State):ChannelType[]{
    if(!state || !state.communities || !state.communities.length) return []
    function recurse(community:ChannelType, routes:ChannelType[]){
        if(!community.children && !community.contents) return routes;
        if(community.contents.length!==0) routes.push(community)
        if(community.children) community.children.forEach(subcomm=> recurse(subcomm, routes))
    }
    let routes:ChannelType[]= []
    for(const community of state.communities) recurse(community, routes)
    return routes
}