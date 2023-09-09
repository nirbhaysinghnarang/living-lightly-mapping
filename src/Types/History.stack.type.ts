import { ChannelType, ChannelContent } from "./Channel.types"
import { State } from "./State.type"
import { VIEWMODE } from "./ViewMode.type"
/**
 * This type will allow for smooth transitions through both directions of map traversals
 */

export type HistoryStackElement = {
    view:VIEWMODE,
    selectedElement: State | ChannelType | ChannelContent | null
}
export type selectedElementString = "State" | "ChannelType" | "ChannelContent"

export type HistoryStack = HistoryStackElement[]


export function pop(stack:HistoryStack){
    
    if (!stack || stack.length == 0){
        return stack
    }
    stack.pop()
    return stack
}

export function append(stack:HistoryStack, element:HistoryStackElement){
    stack.push(element);
    return stack
}

export function peek(stack:HistoryStack):HistoryStackElement{
    if (!stack || stack.length == 0){
        return 
    }
    return stack.at(stack.length-1);
}

export const initialStackElement:HistoryStackElement = {
    view:"State",
    selectedElement: null
}