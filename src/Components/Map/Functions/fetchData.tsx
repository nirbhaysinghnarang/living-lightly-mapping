import { AxiosResponse } from "axios";
import { getSubChannel, getChannel, getContentForChannel } from "../../../Client/mvc.client";
import { ChannelType, ChannelContent} from "../../../Types/Channel.types";



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
        tileset:null
    }
}

/**
 * 
 * @param channelId: the id of the base channel
 * @returns A promise that represents a channel that has been unwrapped to its lowest level
 */
export async function fetchData(channelId:string): Promise<ChannelType>{
    async function recurse(channelId:string, channel:ChannelType):Promise<ChannelType>{
        return getChannel(channelId).then((channelResponse:AxiosResponse<ChannelType>)=>{
            const data:ChannelType = channelResponse.data


            channel.editors = data.editors
            channel.description = data.description
            channel.createdAt = data.createdAt
            channel.lat = data.lat
            channel.long = data.long
            channel.tileset = data.tileset
            channel.markercolor = data.markercolor
            channel.uniqueID = data.uniqueID
            channel.children = []
            channel.order = data.order
            channel.contents = []

            if(data.contents.length !==0){
                channel.contents = data.contents
                return channel
            }

            if (data.children.length !== 0){
                data.children.forEach(async (child:ChannelType)=>  {
                    channel.children.push(await recurse(child.uniqueID, child))
                })
            }
            return channel
        })
    }
    return recurse(channelId,  _createEmptyChannel())
}