import { ChannelContent, ChannelType } from "./Channel.types";
import { State } from "./State.type";
import { selectedElementString } from "./History.stack.type";


type toCheck = State | ChannelType | ChannelContent


function isState(item:toCheck):boolean{
    return "center" in item
}

function isChannelType(item:toCheck): boolean{
    return "tileset" in item
}

function isChannelContent(item:toCheck): boolean{
    return "mediafile" in item
}


export function getType(item:toCheck): selectedElementString{
    if(!item) return null
    if(isState(item)) return "State"
    if(isChannelType(item)) return "ChannelType"
    return "ChannelContent"
    
}