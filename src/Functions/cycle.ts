import { ChannelContent } from "../Types/Channel.types";
export type dir = "UP" | "DOWN"
export function cycle(current: ChannelContent, list: ChannelContent[], direction: dir) {
    const index = list.indexOf(current);
    if (index === -1) {
        // Handle the case where the current item is not found in the list.
        return current;
    }
    let newIndex: number;
    switch (direction) {
        case "UP":
            newIndex = (index + 1) % list.length;
            break;
        case "DOWN":
            newIndex = (index - 1 + list.length) % list.length;
            break;
        default:
            newIndex = index; // Default to the current index for an invalid direction.
            break;
    }
    return list[newIndex];
}