import { ChannelContent } from "../../../Types/Channel.types";
export type dir = "UP" | "DOWN"
export function cycle(current:ChannelContent, list:ChannelContent[], direction:dir){
    const index = list.indexOf(current);
    switch(direction){
        case "UP":
            return list.at(index+1 % list.length)
        case "DOWN":
            return list.at(index-1 % list.length)
    }
}