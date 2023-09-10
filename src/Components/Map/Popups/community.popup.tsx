import { ChannelType } from "../../../Types/Channel.types";
import { Box, Typography, Stack } from "@mui/material";
import { Popup } from "react-map-gl";
interface CommunityPopupProps {
    channel: ChannelType,
    fixed: boolean

}

export const ChannelPopup: React.FC<CommunityPopupProps> = ({ channel, fixed }: CommunityPopupProps) => {
    function _renderContents() {
        return (<Stack direction="column" flex={1} justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Typography variant="body1" sx={{ fontFamily: "Gotu", width: "100%" }} gutterBottom>
                {channel.name}
            </Typography>
            {channel.picture && <img style={{ height: '100px', width: '100%' }} src={channel.picture.url}></img>}
            <Typography variant="subtitle2" sx={{ fontFamily: 'Gotu', marginTop: 1 }}>
                {channel.description}
            </Typography>
        </Stack>);
    }


    if (!channel) return;
    if (!fixed) return (
        <Popup anchor="top" latitude={channel.lat} longitude={channel.long} offset={50} style={{ padding: 10 }}>
            {_renderContents()}
        </Popup>);

    return <Box style={{ padding: 10, border: '2px dashed black', position: "absolute", top: 200, right: 100, maxWidth: 300, opacity:1}}>
       {_renderContents()}
    </Box>
}


