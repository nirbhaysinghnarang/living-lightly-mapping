import { Nullable } from 'tsdef';
import { Overlay } from './Overlay.type';
/**
 * This file contains types to fit in with the existing MVC typing system and exports them globally.
 */

/**
 * This type represents an editor.
 * Required field: id
 */
export type ChannelEditor ={
    id:string,
    username:Nullable<string>,
    email:Nullable<string>
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
    markercolor:string,
    createdAt:string,
    updatedAt:string,
    children: Nullable<ChannelType[]>
    contents: Nullable<ChannelContent[]>
    name:string,
    order: Nullable<number>,
    uniqueID:string,
    overlays: Overlay[]
    tileset:Nullable<Tileset>
    picture:Nullable<{
        formats:Nullable<any>,
        id:number,
        size:number,
        url:string
    }>
}


/**
 * This is the base level content for each channel. 
 * There is no nested data here
 */
export type ChannelContent = {
    parent: ChannelType,
    description: Nullable<string>,
    id:number,
    lat: number,
    long: number,
    title: Nullable<String>,
    mediafile:Nullable<MediaFile>
}

type MediaFile = {
    caption: Nullable<String>,
    url:string,
}

type Tileset = {
    id:number,
    attribution:Nullable<string>,
    name:Nullable<string>,
    url:string
}