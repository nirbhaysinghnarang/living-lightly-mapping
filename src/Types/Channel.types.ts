import { Nullable } from 'tsdef';
/**
 * This file contains types to fit in with the existing MVC typing system and exports them globally.
 */

/**
 * This type represents an editor.
 */
export interface ChannelEditor {
    id:string;
    username:Nullable<string>;
    email:Nullable<string>;
}
/**
 * This type represents a base channel
 * which has children of type [ChannelType]
 */
export type BaseChannelType = {
    editors: ChannelEditor[],
    description: string,
    lat: number,
    long: number,
    markercolor:string,
    name:string,
    order: Nullable<number>,
    uniqueID:string,
    children: Nullable<ChannelType[]>,
}

/**
 * This is the main recursive data type to handle channels and subchannels
 */
export type ChannelType = {
    id:number,
    lat:Nullable<number>,
    long:Nullable<number>,
    order: Nullable<number>,
    owner: ChannelEditor,
    uniqueID:string,
    public:Nullable<boolean>,
    subchannels: Nullable<ChannelType>
    channelContent: Nullable<ChannelContent[]>
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
    title: Nullable<String>
}