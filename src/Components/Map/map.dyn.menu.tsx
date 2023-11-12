import { Card, Stack, Typography } from "@mui/material";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
interface DynMenuProps {
    history: HistoryStack,
    topOfStack: HistoryStackElement,
    states: State[],
    idColorMap:Record<string,string>
}

export const DynMenu = ({ history, topOfStack, states, idColorMap }: DynMenuProps) => {
    const renderMenuContent = (history: HistoryStack, topOfStack: HistoryStackElement, states: State[], isWhite:boolean) => {
        if (topOfStack.view === 'State') {
            return <Stack direction="column" spacing={1}>

                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    Indian Peninsular Map
                </Typography>
                {states.map(state => <Typography sx={{ color:  isWhite ? 'white' : '#38424D', fontFamily: "Source Serif" }} >{state.name}</Typography>)}
            </Stack>
        }
        if (topOfStack.view === "Community") {
            const state = topOfStack.selectedElement as State
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color:  isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    Communities in {`${state.name}`}
                </Typography>
                {state.communities.map(community => <Typography sx={{ color:  isWhite ? 'white' : '#38424D', fontFamily: "Source Serif" }} >{community.name}</Typography>)}
            </Stack>
        }


        if (topOfStack.view === 'Routes') {
            const community = topOfStack.selectedElement as ChannelType

            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color:  isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    {`${community.name} routes`}
                </Typography>
                {community.children.map(route => <Typography sx={{ color:  isWhite ? 'white' : '#38424D', fontFamily: "Source Serif" }} >{route.name}</Typography>)}
            </Stack>
        }

        if (topOfStack.view === "Route") {
            const routePoint = topOfStack.selectedElement as ChannelContent
            const community = history[history.length - 2].selectedElement as ChannelType
            const route = community.children.find(route => route.contents[0].id === routePoint.id)
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color:  isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    {`Explore ${route.name}`}
                </Typography>
                {route.contents.map(routePoint => <Typography sx={{ color:  isWhite ? 'white' : '#38424D', fontFamily: "Source Serif" }} >{routePoint.title}</Typography>)}
            </Stack>
        }

    }
    const isColorSpecified = topOfStack.view === 'Route'|| topOfStack.view === 'Routes'
    let specColor = '#f6f6f2'
    if(topOfStack.view === 'Routes')
    {
        specColor = isColorSpecified ? idColorMap[(topOfStack.selectedElement as ChannelType).uniqueID] : '#f6f6f2'
    }    

    if(topOfStack.view === 'Route'){
        const community = history[history.length-2].selectedElement as ChannelType
        specColor = isColorSpecified ? idColorMap[(community).uniqueID] : '#f6f6f2'
    }
    
    return <Card sx={{ padding: "10px", background:specColor}}>
        {renderMenuContent(history, topOfStack, states, isColorSpecified)}
    </Card>


}