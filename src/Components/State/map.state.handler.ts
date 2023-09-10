import { BoxBound, calculateCenter, padBounds } from "../../Types/Bounds.type";
import { HistoryStackElement,selectedElementString } from "../../Types/History.stack.type";
import { getStateBounds } from "../../Types/State.type";
import { getType } from "../../Types/TypeChecks";
import { State } from "../../Types/State.type";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { getBounds } from "../Map/Geometry/getBounds";
import { getZoomLevel } from "../Map/Geometry/getZoomLevel";
import { panTo } from "../Map/map.utils";
import { MapRef } from "react-map-gl";
/**
 * These functions will be caused in useEffect() in [map.base.tsx] whenever
 * the stack that contains the history of a users interactions with a map is
 * changed
 */
export function setBounds(element:HistoryStackElement,  mapRef: React.RefObject<MapRef>){
    if(mapRef.current){
        const zoomLevel = getZoomLevel(element.view)
        let mapBounds: BoxBound
        let jumpDestination:[number, number]
        var isJump = false;
        const typeOfTop: selectedElementString = getType(element.selectedElement)
        switch (typeOfTop) {
            case "State":
                mapBounds = getStateBounds(element.selectedElement as State) 
                break
            case "ChannelType":
                mapBounds = getBounds(element.selectedElement as ChannelType)
                break
            case "ChannelContent":
                isJump = true
                jumpDestination = [(element.selectedElement as ChannelContent).long, (element.selectedElement as ChannelContent).lat]
                break
            default:
                console.log("NONE MATCHED?")
        }
        if(isJump){
            panTo(jumpDestination, zoomLevel, mapRef)
        }else {
            mapRef.current.fitBounds(padBounds(mapBounds, 1.8))
        }
    }
    

}