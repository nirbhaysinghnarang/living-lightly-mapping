import { Button, Card, Stack, Typography } from "@mui/material";
import { ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement, append } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
interface DynMenuProps {
    history: HistoryStack,
    topOfStack: HistoryStackElement,
    states: State[],
    idColorMap: Record<string, string>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryStack>>
    setSelectedRoute:  React.Dispatch<React.SetStateAction<ChannelType>>
}

export const DynMenu = ({ history, topOfStack, states, idColorMap, setHistory, setSelectedRoute }: DynMenuProps) => {
    const renderMenuContent = (history: HistoryStack, topOfStack: HistoryStackElement, states: State[], isWhite: boolean) => {
        if (topOfStack.view === 'IND') {
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    Indian Peninsular Map
                </Typography>
                {states.map(state => <Button
                    sx={{alignItems:"left", textTransform:'none'}}
                    onClick={() => {
                        setHistory((p: HistoryStack) => {
                            return append([...p], {
                                view: 'STATE',
                                selectedElement: state
                            })
                        })
                    }}
                >
                    <Typography sx={{ color: isWhite ? 'white' : '#38424D', fontWeight:'bold', fontFamily: "Source Serif" }} >{state.name}</Typography>
                </Button>)}
            </Stack>
        }
        if (topOfStack.view === "STATE") {
            const state = topOfStack.selectedElement as State
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    Communities in {`${state.name}`}
                </Typography>
                {state.communities.map(community => {
                    return <Button
                    sx={{alignItems:"left", textTransform:'none', fontWeight:"bold"}}
                        onClick={() => {
                            setHistory((p: HistoryStack) => {
                                return append([...p], {
                                    view: 'COMM',
                                    selectedElement: community
                                })
                            })
                        }}
                    >
                        <Typography sx={{ fontFamily: "Source Serif",  fontWeight:'bold',fontSize: "16px", color: idColorMap[community.uniqueID] }} >{community.name}</Typography>
                    </Button>
                })}

            </Stack>
        }


        if (topOfStack.view === 'COMM') {
            const community = topOfStack.selectedElement as ChannelType
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    {`${community.name} routes`}
                </Typography>
                {community.children.map(route => {
                    return <Button 
                    sx={{alignItems:"left", textTransform:'none', fontWeight:"bold"}}
                    onClick={() => {
                        setSelectedRoute(route)
                    }}
                        >
                        <Typography sx={{ color: isWhite ? 'white' : '#38424D',  fontWeight:'bold',fontFamily: "Source Serif" }} >{route.name}</Typography>
                    </Button>
                })}
            </Stack>
        }

        if (topOfStack.view === "ROUTE") {
            const route = topOfStack.selectedElement as ChannelType
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    {`Explore ${route.name}`}
                </Typography>
                {route.contents.map(routePoint => <Typography sx={{ color: isWhite ? 'white' : '#38424D',  fontWeight:'bold',fontFamily: "Source Serif" }} >{routePoint.title}</Typography>)}
            </Stack>
        }

    }
    const isColorSpecified = topOfStack.view === 'COMM' || topOfStack.view === 'ROUTE'
    let specColor = '#f6f6f2'
    if (topOfStack.view === 'COMM' || topOfStack.view === 'ROUTE') {
        specColor = isColorSpecified ? idColorMap[(topOfStack.selectedElement as ChannelType).uniqueID] : '#f6f6f2'
    }
    return <Card sx={{ padding: "10px", background: specColor }}>
        {renderMenuContent(history, topOfStack, states, isColorSpecified)}
    </Card>


}