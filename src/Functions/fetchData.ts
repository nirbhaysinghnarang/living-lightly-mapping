import { AxiosResponse } from "axios";
import { getChannel } from "../Client/mvc.client";
import { ChannelType } from "../Types/Channel.types";
import { Overlay, isValidOverlay } from "../Types/Overlay.type";



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
        parent:null,
        picture:null,
        overlays:[]
    }
}

/**
 * 
 * @param channelId: the id of the base channel
 * @returns A promise that represents a channel that has been unwrapped to its lowest level
 */
export async function fetchData(channelId: string): Promise<ChannelType> {
    async function recurse(channelId: string, parentChannel: ChannelType | null): Promise<ChannelType> {
        return await getChannel(channelId).then(async (channelResponse: AxiosResponse<ChannelType>) => {
            const data: ChannelType = channelResponse.data;

            const channel: ChannelType = {
                ...data, // Spreads all properties from data
                parent: parentChannel, // Assign the parent channel passed to the function
                children: [], // Initialize children to an empty array to be filled later
                contents: [], // Initialize contents to an empty array, to be possibly filled later
                overlays: data.overlays.filter((overlay: Overlay) => !isValidOverlay(overlay)) // Filter for valid overlays
            };

            // If there are contents, directly assign them as no further processing is required here
            if (data.contents.length !== 0) {
                channel.contents = data.contents;
                return channel;
            }

            // If there are child channels, recurse for each child and assign results to channel.children
            if (data.children.length !== 0) {
                await Promise.all(data.children.map(async (child: ChannelType) => {
                    channel.children.push(await recurse(child.uniqueID, channel)); // Pass current channel as parent for the child
                }));
            }

            return channel;
        });
    }

    return await recurse(channelId, null); // Initial call has no parent
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

export function isVaidChannel(channel:ChannelType){
    return channel.lat !== null && channel.long !==null
}