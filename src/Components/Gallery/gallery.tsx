import { Box, Button, Card, Grid, ImageList, ImageListItem, ImageListItemBar, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { fetchData } from "../../Functions/fetchData"
import { ChannelType } from "../../Types/Channel.types"
import { State, constructStates } from "../../Types/State.type"
import { MenuOptions } from "../Map/map.options.menu"
import { HistoryStack, append, initialStackElement, peek, pop } from "../../Types/History.stack.type"
import { VIEWMODE } from "../../Types/ViewMode.type"
import {GalleryBreadcrumbs} from "./gallery.breadcrumbs"
interface GalleryProps {
    channelId: string
}
export const Gallery: React.FC<GalleryProps> = ({ channelId }: GalleryProps) => {



    const [states, setStates] = useState<State[]>([])
    const [communities, setCommunities] = useState<ChannelType[]>([])
    const [historyStack, setHistoryStack] = useState<HistoryStack>([]);
    const [loaded, setLoaded] = useState(false)
    const [view, setView] = useState<VIEWMODE>('IND')


    useEffect(() => {
        fetchData(channelId).then((data) => {
            setCommunities(data.children);
        })
    }, [])

    useEffect(() => {
        if (communities) setStates(constructStates(communities))
    }, [communities])

    useEffect(() => {
        if (states) setLoaded(true)
    }, [states])


    useEffect(() => {
        if (loaded) setHistoryStack([initialStackElement])
    }, [loaded])


    useEffect(() => {
        if (historyStack && historyStack.length >= 1) {setView(peek(historyStack).view)}
    }, [historyStack])


    if (!loaded) return <></>

    function renderRouteView() {
        const route = peek(historyStack).selectedElement as ChannelType;
        if(!route || !route.contents) return;   
        const getRandomPosition = (): "top" | "bottom" => {
            const positions = ['top', 'bottom'];
            //@ts-ignore
            return positions[Math.floor(Math.random() * positions.length)];
        };
    
        return (
            <Box sx={{ overflowY: 'auto', maxHeight: '100vh', maxWidth:'90%', alignItems:'center' }}>
                <ImageList variant="masonry" cols={3} gap={10}>
                    {route.contents.map((item) => (
                        <ImageListItem key={item.mediafile.url}>
                            <img
                                srcSet={`${item.mediafile.url}`}
                                src={`${item.mediafile.url}`}
                                alt={item.description}
                                loading="lazy"
                                style={{ width: '100%', height: 'auto' }}
                            />
                            <ImageListItemBar
                                title={item.title}
                                // subtitle={item.description}
                                position={getRandomPosition()}
                                style={{ fontFamily: 'Source Serif, sans-serif' }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        );
    }
    
    function renderCommView() {
        const community = peek(historyStack).selectedElement as ChannelType;
        return (
            <Grid container spacing={2} style={{ maxWidth: '100%' }}>
                {community.children.map((child, index) => (
                    <Grid item xs={4} key={index}> {/* Adjust xs for desired grid item size */}
                        <Stack sx={{ width: '100%', height: '100%' }} direction={"column"} spacing={1}>
                            {child.picture && <Card sx={{ width: '100%', height: '100%', backgroundColor: "#1e1e1e" }} elevation={2}>
                                {child.picture && <img src={child.picture.url} style={{ 'width': '100%' }}></img>}
                            </Card>}
                            <Button onClick={() => {
                                setHistoryStack((prevStack: HistoryStack) => {
                                    return append([...prevStack], { view: "ROUTE", selectedElement: child })
                                })
                            }}>
                                <Typography
                                    sx={{
                                        fontFamily: 'Source Serif ',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: 'white'
                                    }}
                                >
                                    {child.name}

                                </Typography>
                            </Button>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        );
    }

    function renderTopLevel() {
        return (
            <div>
                <Stack direction={'column'} sx={{ maxWidth: '30%' }} spacing={0}>
                    <Typography variant="h6" sx={{ fontFamily: 'Source Serif ', fontSize: '54px', fontWeight: 'medium', color: 'white', textTransform: 'uppercase' }}>Exhibit Name</Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Source Serif ', fontSize: '30px', fontWeight: 'medium', color: 'white', fontStyle: 'italic' }}>Gallery</Typography>
                </Stack>
                {
                    states.map(state => (
                        <Grid
                            container
                            spacing={2}
                            mt={2}
                            sx={{ width: '50%' }}
                            justifyContent="space-between"
                        >
                            <Grid item xs={6}>
                                <Typography
                                    sx={{
                                        fontFamily: 'Source Serif ',
                                        fontSize: '20px',
                                        color: 'white'
                                    }}
                                >
                                    {state.name}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    justifyContent="flex-start"
                                >
                                    {state.communities.map(community => (
                                        <Button onClick={() => {
                                            setHistoryStack((prevStack: HistoryStack) => {
                                                return append([...prevStack], { view: "COMM", selectedElement: community })
                                            })
                                        }}>
                                            <Typography
                                                key={community.name}
                                                sx={{
                                                    fontFamily: 'Source Serif ',
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    color: 'white'
                                                }}
                                            >
                                                {community.name}
                                            </Typography>
                                        </Button>

                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    ))
                }
            </div>

        )
    }


    return <Box sx={{ width: "100vw", minHeight: "100vh", background: "#98A4B3", overflowX: 'scroll' }}>
        <Stack direction={"column"} sx={{ width: "100%", padding: '100px'}}>
         <GalleryBreadcrumbs history={historyStack} setHistory={setHistoryStack}></GalleryBreadcrumbs>

            {view === 'IND' && renderTopLevel()}
            {view === 'COMM' && renderCommView()}
            {view === 'ROUTE' && renderRouteView()}
        </Stack>


        <div style={{ position: "absolute", top: "50px", right: '150px' }}>
            <MenuOptions />
        </div>
    </Box>
}
