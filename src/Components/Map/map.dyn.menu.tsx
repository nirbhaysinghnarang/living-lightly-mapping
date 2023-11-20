import { Button, Card, Stack, Typography } from "@mui/material";
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement, append } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
interface DynMenuProps {
    history: HistoryStack,
    topOfStack: HistoryStackElement,
    states: State[],
    idColorMap: Record<string, string>,
    setHistory: React.Dispatch<React.SetStateAction<HistoryStack>>
    setScopedMarker: React.Dispatch<React.SetStateAction<ChannelContent>>
}

export const DynMenu = ({ history, topOfStack, states, idColorMap, setHistory, setScopedMarker   }: DynMenuProps) => {


    const renderMenuContent = (history: HistoryStack, topOfStack: HistoryStackElement, states: State[], isWhite: boolean) => {
        if (topOfStack.view === 'IND') {
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontWeight:"bold",fontFamily: "Source Serif", color: isWhite ? 'white' : "#191c1b", fontSize: "18px", width: "100%" }}>
                    Indian Peninsular Map
                </Typography>
                {states.map(state => <Button
                    sx={{justifyContent:"left", textTransform:"none"}}
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
                <Typography variant="body1" sx={{ fontWeight:"bold",fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                    Communities in {`${state.name}`}
                </Typography>
                {state.communities.map(community => {
                    return <Button
                    sx={{justifyContent:"left", textTransform:"none"}}
                        onClick={() => {
                            setHistory((p: HistoryStack) => {
                                return append([...p], {
                                    view: 'COMM',
                                    selectedElement: community
                                })
                            })
                        }}
                    >
                        <Typography sx={{ fontFamily: "Lato", fontSize: "16px", color: idColorMap[community.uniqueID] }} >{community.name}</Typography>
                        
                    </Button>
                })}

            </Stack>
        }
        if (topOfStack.view === 'COMM') {
            const community = topOfStack.selectedElement as ChannelType
            const state = states.find(state=> state.communities.includes(community))
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                    Communities in {`${state.name}`}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: idColorMap[community.uniqueID], fontSize: "18px", width: "100%" }}>
                    {`${community.name}`}
                </Typography>
                {community.picture && <img style={{ height: '200px' }} src={community.picture.url}></img>}
                <Typography  variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width:"100%" }}>
                {community.description}
            </Typography>

            <Typography  variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width:"100%" }}>
                Explore Routes
            </Typography>
            
                {community.children.map(route => {
                    return <Button
                    sx={{justifyContent:"left", textTransform:"none"}}
                    onClick={() => {
                        setHistory((p: HistoryStack) => {
                                return append([...p], {
                                    view: 'ROUTE',
                                    selectedElement: route
                                })
                            })
                    }}
                        >
                        <Typography sx={{ color: '#38424D',fontFamily: "Lato" }} >{route.name}</Typography>
                    </Button>
                })}
            </Stack>
        }

        if (topOfStack.view === "ROUTE") {
            const route = topOfStack.selectedElement as ChannelType
            return <Stack direction="column" spacing={1}>
                <Typography variant="body1" sx={{fontWeight:"bold", fontFamily: "Source Serif", color: "#38424D", fontSize: "18px", width: "100%" }}>
                    {`Explore ${route.name}`}
                </Typography>
                <Typography  variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width:"100%" }}>
                {route.description}
            </Typography>
                <Typography  variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1, width:"100%" }}>
                    Route Points
                </Typography>
                {route.contents.map(routePoint => <Button
                    sx={{justifyContent:"left", textTransform:"none"}}
                    onClick={() => {
                      setScopedMarker(routePoint)
                    }}
                >
                    <Typography sx={{ color: '#38424D', fontFamily: "Lato" }} >{routePoint.title}</Typography>
                </Button>)}
            </Stack>
        }

    }
    const isColorSpecified = topOfStack.view === 'COMM' || topOfStack.view === 'ROUTE'
    let specColor = '#f6f6f2'
    return <Card sx={{ padding: "10px",maxWidth:"300px",  background: specColor }}>
        {renderMenuContent(history, topOfStack, states, isColorSpecified)}
    </Card>


}