import { Button, Card, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement, append, pop } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
import { ArrowCircleLeftTwoTone, ChevronRight, Reply } from "@mui/icons-material";
import KeyboardIcon from '@mui/icons-material/Keyboard';
interface DynMenuProps {
    history: HistoryStack,
    topOfStack: HistoryStackElement,
    states: State[],
    idColorMap: Record<string, string>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryStack>>
    setScopedMarker: React.Dispatch<React.SetStateAction<ChannelContent>>
    scopedMarker: ChannelContent
}

export const DynMenu = ({ history, topOfStack, states, idColorMap, setHistory, setScopedMarker, scopedMarker }: DynMenuProps) => {
    const renderBackButton = (history: HistoryStack, setHistory: React.Dispatch<React.SetStateAction<HistoryStack>>) => {
        if (history && history.length > 1) return (<IconButton sx={{
            padding: 0,
            color: 'black'
        }} onClick={() => {
            setHistory((prev: HistoryStack) => {
                return pop([...prev])
            })
        }}>
            <Reply />
        </IconButton>);
        return <></>
    }


    const renderHeader = (text: string, history: HistoryStack, setHistory: React.Dispatch<React.SetStateAction<HistoryStack>>, isWhite: boolean) => {
        return (<Stack direction={"row"} sx={{ width: "300px" }} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontFamily: "Source Serif", color: isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                {text}
            </Typography>
            {renderBackButton(history, setHistory)}
        </Stack>)
    }

    const renderMenuContent = (history: HistoryStack, topOfStack: HistoryStackElement, states: State[], isWhite: boolean, scopedMarker: ChannelContent) => {
        if (topOfStack.view === 'IND') {
            return <Stack direction="column" spacing={1}>

                {renderHeader("Indian Peninsular Map", history, setHistory, isWhite)}
                {states.map(state => <Button
                    sx={{ justifyContent: "left", textTransform: "none" }}
                    onClick={() => {
                        setHistory((p: HistoryStack) => {
                            return append([...p], {
                                view: 'STATE',
                                selectedElement: state
                            })
                        })
                    }}
                >
                    <Typography sx={{ color: isWhite ? 'white' : '#38424D', fontFamily: "Lato" }} >{state.name}</Typography>
                </Button>)}
            </Stack>
        }
        if (topOfStack.view === "STATE") {
            const state = topOfStack.selectedElement as State
            return <Stack direction="column" spacing={1}>
                {renderHeader(`Communities in ${state.name}`, history, setHistory, isWhite)}
                {state.communities.map(community => {
                    return <Button
                        sx={{ justifyContent: "left", textTransform: "none" }}
                        onClick={() => {
                            setHistory((p: HistoryStack) => {
                                return append([...p], {
                                    view: 'COMM',
                                    selectedElement: community
                                })
                            })
                        }}
                    >
                        <Stack direction="row" sx={{ width: "100%", alignItems: "center", justifyContent: 'flex-start' }} spacing={1}>
                        <ChevronRight sx={{ color: idColorMap[community.uniqueID]}}></ChevronRight>
                        <Typography sx={{ fontFamily: "Lato", fontSize: "16px", color: idColorMap[community.uniqueID] }} >{community.name}</Typography>
                    </Stack>

                    </Button>
                })}

            </Stack>
        }
        if (topOfStack.view === 'COMM') {
            const community = topOfStack.selectedElement as ChannelType
            const state = states.find(state => state.communities.includes(community))
            return <Stack direction="column" spacing={1}>
                {renderHeader(`Communities in ${state.name}`, history, setHistory, false)}
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: idColorMap[community.uniqueID], fontSize: "18px", width: "100%" }}>
                    {`${community.name}`}
                </Typography>
                {community.picture && <img style={{ height: '200px' }} src={community.picture.url}></img>}
                <Typography variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width: "100%" }}>
                    {community.description}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width: "100%", fontWeight:"bold" }}>
                    Explore Routes
                </Typography>

                {community.children.map(route => {
                    return <Button
                        sx={{ justifyContent: "left", textTransform: "none" }}
                        onClick={() => {
                            setHistory((p: HistoryStack) => {
                                return append([...p], {
                                    view: 'ROUTE',
                                    selectedElement: route
                                })
                            })
                        }}
                    >
                        <Stack direction="row" sx={{ width: "100%", alignItems: "center", justifyContent: 'flex-start' }} spacing={1}>
                            <ChevronRight sx={{ color: '#38424D' }}></ChevronRight>
                            <Typography sx={{ color: '#38424D', fontFamily: "Lato" }} >{route.name}</Typography>
                        </Stack>
                    </Button>
                })}
            </Stack>
        }

        if (topOfStack.view === "ROUTE") {
            const route = topOfStack.selectedElement as ChannelType
            return <Stack direction="column" spacing={1}>
                {renderHeader(`Explore ${route.name}`, history, setHistory, false)}
                <Typography variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width: "100%" }}>
                    {route.description}
                </Typography>
                <Stack direction="row" sx={{ width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width: "100%", fontWeight:"bold" }}>
                        Route Points
                    </Typography>
                    <Tooltip title="Use your keyboard's Left and Right arrow keys to move between route points.">
                    <KeyboardIcon></KeyboardIcon>

                    </Tooltip>

                </Stack>

                {route.contents.map(routePoint => <Button
                    sx={{ justifyContent: "left", textTransform: "none" }}
                    onClick={() => {
                        setScopedMarker(routePoint)
                    }}
                >
                    <Stack direction="row" sx={{ width: "100%", alignItems: "center", justifyContent: 'flex-start' }} spacing={1}>
                        <ChevronRight sx={{ color: '#38424D', fontWeight:scopedMarker && routePoint.id === scopedMarker.id ? "bold" : "regular"}}></ChevronRight>
                        {scopedMarker && routePoint.id === scopedMarker.id ? < Typography sx={{ color: '#38424D', fontFamily: "Lato", fontWeight: "bold" }} >{routePoint.title}</Typography> : < Typography sx={{ color: '#38424D', fontFamily: "Lato" }} >{routePoint.title}</Typography>}
                    </Stack>
                </Button>)}
            </Stack>
        }

    }
    const isColorSpecified = topOfStack.view === 'COMM' || topOfStack.view === 'ROUTE'
    let specColor = '#f6f6f2'
    return <Card sx={{ padding: "10px", width: "300px", background: specColor }}>
        <Stack direction="row" alignContent={"flex-start"} justifyContent={"flex-start"}>
            {renderMenuContent(history, topOfStack, states, isColorSpecified, scopedMarker)}

        </Stack>
    </Card>


}