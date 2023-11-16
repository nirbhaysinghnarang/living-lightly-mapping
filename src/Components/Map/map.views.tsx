import { routeAssets } from "../../Constants/assets";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, peek } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
import { renderRouteLayer, renderRouteLayers, renderRoutePoints, renderRoutes } from "./map.utils";

export function renderRouteView(
    history:HistoryStack,
    scopedMarker:ChannelContent,
    setScopedMarker:(marker:ChannelContent)=> void,
    idColorMap: Record<string, string>,
    communities:ChannelType[],
    
){
    const top = peek(history)
    const view = top.view
    if (view!=="ROUTE") return <></>
    const route = top.selectedElement as ChannelType
    const color = idColorMap[route.uniqueID]
    const image = color === "#4ab975" ? routeAssets[0] : routeAssets[1]
    return <div id={route.uniqueID}>
        {renderRoutePoints(
            scopedMarker,
            setScopedMarker,
            image,
            history,
            color
        )}
        {renderRouteLayer(
            route,
            idColorMap
        )}
    </div>
}

export function renderStateView(
    stack: HistoryStack,
    setHistory: (stack: HistoryStack) => void,
    idColorMap: Record<string, string>,
    setHoverRoute: (route: ChannelType) => void,
    displayPopup: (show: boolean) => void,
    stateRouteMap: Record<string, ChannelType[]>,
    communities: ChannelType[]
) {
    const top = peek(stack)
    const view = top.view
    if (view !== "STATE") return <></>
    const state = top.selectedElement as State
    const routes = stateRouteMap[state.name]
    return <>
        {renderRoutes(
            routes,
            idColorMap,
            setHoverRoute,
            displayPopup,
            setHistory,
            stack,
            communities,
        )}
        {renderRouteLayers(routes, idColorMap)}
    </>

}

export function renderCommunityView(
    stack: HistoryStack,
    setHistory: (stack: HistoryStack) => void,
    idColorMap: Record<string, string>,
    setHoverRoute: (route: ChannelType) => void,
    displayPopup: (show: boolean) => void,
    communities: ChannelType[]) {
    const top = peek(stack)
    const view = top.view
    const community = top.selectedElement as ChannelType
    if (view !== "COMM") return <></>
    return <>
        {renderRoutes(
            community.children,
            idColorMap,
            setHoverRoute,
            displayPopup,
            setHistory,
            stack,
            communities
        )}
        {renderRouteLayers(community.children, idColorMap)}
    </>
}