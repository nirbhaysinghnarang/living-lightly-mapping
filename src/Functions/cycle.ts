import { ChannelContent } from "../Types/Channel.types";
export type dir = "UP" | "DOWN"
export function cycle(current: ChannelContent, list: ChannelContent[], direction: dir) {
    const index = list.findIndex(c=>c.id===current.id)
    if (index === -1) {
        console.log(list, current, 'here')
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
            newIndex = index; 
            break;
    }
    return list[newIndex];
}