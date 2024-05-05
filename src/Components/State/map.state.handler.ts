import type { MapRef } from 'react-map-gl';
import { BoxBound, padBounds } from "../../Types/Bounds.type";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStackElement, selectedElementString } from "../../Types/History.stack.type";
import { Overlay } from "../../Types/Overlay.type";
import { State, getStateBounds } from "../../Types/State.type";
import { getType } from "../../Types/TypeChecks";
import { VIEWMODE } from "../../Types/ViewMode.type";
import { getZoomLevel } from "../Map/Geometry/getZoomLevel";
import { panTo } from "../Map/map.utils";
/**
 * These functions will be called in useEffect() in [map.base.tsx] whenever
 * the stack that contains the history of a users interactions with a map is
 * changed
 */
export function setBounds
(element: HistoryStackElement, 
mapRef: React.RefObject<MapRef>, 
setOverlays: (overlays: Overlay[]) => void,
idBoundsMap: Record<string, BoxBound>) {
    if (mapRef.current) {
        const zoomLevel = getZoomLevel(element.view)
        let mapBounds: BoxBound
        let jumpDestination: [number, number]
        var isJump = false;
        const typeOfTop: selectedElementString = getType(element.selectedElement)
        switch (typeOfTop) {
            case "State":
                setOverlays([]);
                mapBounds = getStateBounds(element.selectedElement as State)
                break
            case "ChannelType":
                setOverlays(((element.selectedElement) as ChannelType).overlays)
                mapBounds = idBoundsMap[(element.selectedElement as ChannelType).uniqueID]
                break
            case "ChannelContent":
                setOverlays([]);
                isJump = true
                jumpDestination = [(element.selectedElement as ChannelContent).long, (element.selectedElement as ChannelContent).lat]
                break
        }
        if (isJump) {
            console.log("panning to " + jumpDestination)
            panTo(jumpDestination, zoomLevel, mapRef)
        } else {
            console.log("fitting bounds to" + mapBounds)
            mapRef.current.fitBounds(padBounds(mapBounds, 1.8))
        }
    }
}

/**
 * Imperatively update scroll permissions on map depending on current scope.
 * @param element 
 * @param mapRef 
 */
export function updateScrollBehaviour(
    element: HistoryStackElement,
    mapRef: React.RefObject<MapRef>) {
    const typeOfTop: selectedElementString = getType(element.selectedElement)
    if(!mapRef.current || !mapRef.current.scrollZoom) return
    if(typeOfTop === 'ChannelContent'){
        //Want to enable scrolling for content elements only.
        if(!mapRef.current.scrollZoom.isEnabled) {
            mapRef.current.scrollZoom.enable();
            mapRef.current.setMinZoom(mapRef.current.getMinZoom())
            mapRef.current.setMaxZoom(16);
        }
    }else{
        if(mapRef.current.scrollZoom.isEnabled) mapRef.current.scrollZoom.disable()
    }

}

// We want to refresh state based on the top of the stack.
export function updateState(
    element: HistoryStackElement,
    setSelectedCommunity: (comm: ChannelType) => void,
    setSelectedRoute: (point: ChannelType) => void,
    setScopedMarker: (marker: ChannelContent) => void,
    setRoutePoints: (points: ChannelContent[]) => void,
    setOverlays: (overlays: Overlay[]) => void,
    setRoutes: (routes: ChannelType[]) => void,
    setView: (view: VIEWMODE) => void,
    routes: ChannelType[],
    stateRouteMap:Record<string, ChannelType[]>
) {
    setView(element.view)
    const typeOfTop: selectedElementString = getType(element.selectedElement)
    switch (typeOfTop) {
        case "State":
            const state = element.selectedElement as State
            setOverlays([]);
            setSelectedCommunity(null)
            setRoutes([])
            setSelectedRoute(null)
            setScopedMarker(null)
            setRoutePoints([])
            setRoutes([])
            break;

        case "ChannelType":
            const channelType = (element.selectedElement) as ChannelType
            const isCommunity = element.view === "COMM"
            if (isCommunity) {
                setSelectedCommunity(channelType)
                setRoutes(channelType.children)
                setSelectedRoute(null)
                setScopedMarker(null)
                setRoutePoints([]);
            }
            if (!isCommunity) {
                setSelectedCommunity(null)
                setRoutes([])
                setScopedMarker((element.selectedElement as ChannelType).contents.at(0))
                setRoutePoints(channelType.contents)
            }
            setOverlays(channelType.overlays)
            break
        case "ChannelContent":
            const channelContent = (element.selectedElement) as ChannelContent
            setOverlays([]);
            setSelectedCommunity(null)
            setRoutes([])
            setSelectedRoute(null)
            setScopedMarker(channelContent)
            setRoutePoints(routes.find((route: ChannelType) => route.contents.at(0).id === channelContent.id).contents)
            setRoutes([])
            break
    }


}