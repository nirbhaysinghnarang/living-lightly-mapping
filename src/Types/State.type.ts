import { ChannelType } from "./Channel.types"
import { getStatesJson } from "../Components/Map/Geometry/drawStates"
import { geoContains } from 'd3-geo';
import { Feature, Polygon, Point, center } from "@turf/turf";


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