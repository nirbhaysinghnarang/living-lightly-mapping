import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { fetchData } from "../../Functions/fetchData"
import { ChannelType } from "../../Types/Channel.types"
import { State, constructStates } from "../../Types/State.type"
interface GalleryProps{
    channelId:string
}
export const Gallery: React.FC<GalleryProps> = ({channelId}:GalleryProps) => {
  const [states, setStates] = useState<State[]>([])
  const [communities, setCommunities] = useState<ChannelType[]>([])  


  useEffect(() => {
    fetchData(channelId).then((data) => {
        setCommunities(data.children);
    })
    }, [])

    useEffect(()=> {
        if(communities) setStates(constructStates(communities))
    }, [communities])
    if(!states) return <></>
    return <Box sx={{width:"100%", height:"100%"}}>
        <Stack direction={"column"} sx={{width:"100%"}}>
            {states.map(state=> {
                return <Stack direction="row" justifyContent={"space-between"} sx={{width:'100%'}}>
                    <Typography>{state.name}</Typography>
                    <Stack direction="row" spacing={2}>
                        {state.communities.map(community=>{
                            return <Typography>{community.name}</Typography>
                        })}
                    </Stack>
                </Stack>
            })}
        </Stack>
    </Box>
}
