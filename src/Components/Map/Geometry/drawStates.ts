import {geoContains} from 'd3-geo';
import { ChannelType } from "../../../Types/Channel.types";
import json from '../../../Constants/Data/states_geojson.constants.json'
import { LineLayer, } from "mapbox-gl";


export function getStatesJson(communities:ChannelType[]):Record<string, any>[]{
    return communities.map((community:ChannelType)=> {return getStateJson(community)});
}

export function getStateJson(community:ChannelType): Record<string,any> {
    const center = [community.long, community.lat] as [number, number];
    var j:Record<string, any> = json;
    var obj = j["features"].filter((elem:any) => geoContains(elem, center))[0]
    if (typeof (obj) != "undefined") obj["id"] = "state"
    return obj
}

export function createPolygonLayer():LineLayer{
    return {
        id: 'states',
        type: 'line',
        source: 'routes',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#4F311C',
            'line-width': 2
        }
}}