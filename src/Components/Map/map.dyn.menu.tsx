import { Card, Stack, Typography } from "@mui/material";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
interface DynMenuProps {
    history: HistoryStack,
    topOfStack: HistoryStackElement,
    states: State[],
}

export const DynMenu = ({ history, topOfStack, states }: DynMenuProps) => {
    const renderMenuContent = (history: HistoryStack, topOfStack: HistoryStackElement, states: State[]) => {
        if (topOfStack.view === 'State') {
            return <Stack direction="column" spacing={1}>

                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                    Indian Peninsular Map
                </Typography>
                {states.map(state => <Typography sx={{ color: '#38424D', fontFamily: "Source Serif" }} >{state.name}</Typography>)}
            </Stack>
        }
        if (topOfStack.view === "Community") {
            const state = topOfStack.selectedElement as State
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                    Communities in {`${state.name}`}
                </Typography>
                {state.communities.map(community => <Typography sx={{ color: '#38424D', fontFamily: "Source Serif" }} >{community.name}</Typography>)}
            </Stack>
        }


        if (topOfStack.view === 'Routes') {
            const community = topOfStack.selectedElement as ChannelType
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                    {`${community.name} routes`}
                </Typography>
                {community.children.map(route => <Typography sx={{ color: '#38424D', fontFamily: "Source Serif" }} >{route.name}</Typography>)}
            </Stack>
        }

        if (topOfStack.view === "Route") {
            const routePoint = topOfStack.selectedElement as ChannelContent
            const community = history[history.length - 2].selectedElement as ChannelType
            const route = community.children.find(route => route.contents[0].id === routePoint.id)
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                    {`Explore ${route.name}`}
                </Typography>
                {route.contents.map(routePoint => <Typography sx={{ color: '#38424D', fontFamily: "Source Serif" }} >{routePoint.title}</Typography>)}
            </Stack>
        }

    }
    return <Card sx={{ border: '1px dashed black', padding: "10px", background: '#f6f6f2' }}>
        {renderMenuContent(history, topOfStack, states)}
    </Card>


}