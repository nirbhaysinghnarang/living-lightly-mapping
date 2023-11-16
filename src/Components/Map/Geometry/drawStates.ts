import { geoContains } from 'd3-geo';
import { FillLayer } from "mapbox-gl";
import json from '../../../Constants/Data/states_geojson.constants.json';
import { ChannelType } from "../../../Types/Channel.types";


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

export function createPolygonLayer(id:string):FillLayer{
    return {
        id: id,
        type: 'fill',
        source: 'routes',
        paint: {
            "fill-color":"#BE8F2F"
        },
}}