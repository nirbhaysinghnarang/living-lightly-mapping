import { AxiosResponse } from "axios";
import { getChannel, getContentForChannel } from "../../../Client/mvc.client";
import { ChannelType } from "../../../Types/Channel.types";
import { Overlay, isValidOverlay } from "../../../Types/Overlay.type";



function _createEmptyChannel(): ChannelType{
    return {
        lat:0.0,
        long:0.0,
        order:undefined,
        uniqueID:"",
        children:null,
        contents:null,
        editors:[],
        markercolor:"",
        name:"",
        description:"",
        createdAt:"",
        updatedAt:"",
        tileset:null,
        picture:null,
        overlays:[]
    }
}

/**
 * 
 * @param channelId: the id of the base channel
 * @returns A promise that represents a channel that has been unwrapped to its lowest level
 */
export async function fetchData(channelId:string): Promise<ChannelType>{
    async function recurse(channelId:string, channel:ChannelType):Promise<ChannelType>{
        return await getChannel(channelId).then(async (channelResponse:AxiosResponse<ChannelType>)=>{
            const data:ChannelType = channelResponse.data
            channel.editors = data.editors
            channel.description = data.description
            channel.createdAt = data.createdAt
            channel.picture = data.picture
            channel.lat = data.lat
            channel.long = data.long
            channel.tileset = data.tileset
            channel.markercolor = data.markercolor
            channel.uniqueID = data.uniqueID
            channel.children = []
            channel.name = data.name
            channel.order = data.order
            channel.contents = []
            //filter for valid overlays.
            channel.overlays = data.overlays.filter((overlay:Overlay)=>!isValidOverlay(overlay))
            if(data.contents.length !==0){
                channel.contents = data.contents
                return channel
            }
            if (data.children.length !== 0){
                await Promise.all(data.children.map(async (child: ChannelType) => {
                    channel.children.push(await recurse(child.uniqueID, child));
                }));
            }
            return channel
        })
    }
    return await recurse(channelId,  _createEmptyChannel())
}


export function extractNestedIds(base:ChannelType){
    function recurse(channel:ChannelType, listOfIds:string[]){
        if(Object.keys(channel).length==0) return 
        listOfIds.push(channel.uniqueID)
        channel.children.forEach((child:ChannelType)=>{
            listOfIds = listOfIds.concat(recurse(child, []))
        })
        return listOfIds
    }
    return recurse(base, [])
}

export async function getOverlays(id:string){
    getContentForChannel(id).then(r=>console.log(r))
}