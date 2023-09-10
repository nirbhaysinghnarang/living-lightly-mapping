import { Nullable } from 'tsdef';
import { Overlay } from './Overlay.type';
/**
 * This file contains types to fit in with the existing MVC typing system and exports them globally.
 */

/**
 * This type represents an editor.
 * Required field: id
 */
export type ChannelEditor = {
    id: string,
    username: Nullable<string>,
    email: Nullable<string>
}
/**
 * This type represents a base channel
 * which has children of type [ChannelType]
 */
export type ChannelType = {
    editors: ChannelEditor[],
    description: string,
    lat: number,
    long: number,
    markercolor: string,
    createdAt: string,
    updatedAt: string,
    children: Nullable<ChannelType[]>
    contents: Nullable<ChannelContent[]>
    name: string,
    order: Nullable<number>,
    uniqueID: string,
    overlays: Overlay[]
    tileset: Nullable<Tileset>
    picture: Nullable<{
        formats: Nullable<any>,
        id: number,
        size: number,
        url: string
    }>
}


/**
 * This is the base level content for each channel. 
 * There is no nested data here
 */
export type ChannelContent = {
    parent: ChannelType,
    description: Nullable<string>,
    id: number,
    lat: number,
    long: number,
    title: Nullable<String>,
    mediafile: Nullable<MediaFile>
}

type MediaFile = {
    caption: Nullable<String>,
    url: string,
}

type Tileset = {
    id: number,
    attribution: Nullable<string>,
    name: Nullable<string>,
    url: string
}

/**
 * Recursively computes
 * 1. minLat
 * 2. maxLat
 * 3. minLng
 * 4. maxLng
 * for an entire channel.
 * @param channel 
 */
export function getBounds(channel: ChannelType) {
    var minLat = Infinity
    var minLng = Infinity
    var maxLat = -Infinity
    var maxLng = -Infinity
    function recurse(channel: ChannelType): number[][] {
        if (!channel) return
        if (channel.contents && channel.contents.length!==0) {
            const lats = channel.contents.map((content: ChannelContent) => content.lat)
            const lngs = channel.contents.map((content: ChannelContent) => content.long)
            minLat = Math.min(minLat, ...lats);
            maxLat = Math.max(maxLat, ...lats);
            minLng = Math.min(minLng, ...lngs);
            maxLng = Math.max(maxLng, ...lngs);
            return [
                [minLng, minLat], 
                [maxLng, maxLat]
            ]
        }
        if(channel.children){
            channel.children.forEach((child:ChannelType)=>{
                const boundsOfChild = recurse(child)
                maxLat = Math.max(maxLat, boundsOfChild[1][1])
                minLat = Math.min(maxLat, boundsOfChild[0][1])
                minLng = Math.min(maxLat, boundsOfChild[1][0])
                maxLng = Math.max(maxLat, boundsOfChild[1][0])
            })
        }
        return [
            [minLng, minLat], 
            [maxLng, maxLat]
        ]
    }
    return recurse(channel)
}