import { Stack, Typography } from "@mui/material";
import { Popup } from "react-map-gl";
import { ChannelContent, ChannelType } from "../../../Types/Channel.types";


interface ChannelPopupProps {
    channel: ChannelType,
    fixed: boolean
}

interface ContentPopupProps {
    content: ChannelContent
}

export const ChannelPopup: React.FC<ChannelPopupProps> = ({ channel, fixed }: ChannelPopupProps) => {
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
    if (!fixed && channel.contents.length == 0) return (
        <Popup anchor="top" closeOnClick={false}  closeButton={false} latitude={channel.lat} longitude={channel.long} offset={10} style={{ padding: 1 }}>
            {_renderContents()}
        </Popup>);

    if (!fixed) return (
        <Popup anchor="top" closeOnClick={false}  closeButton={false} latitude={channel.contents[0].lat} longitude={channel.contents[0].long} offset={10} style={{ padding: 1 }}>
            {_renderContents()}
        </Popup>);

    return <div style={{  position: "absolute", top: 100, left: 100, maxWidth: 300, opacity: 1, border: "1px dashed black", padding:"10px" }}>
        {_renderContents()}
    </div>
}


export const ContentPopup: React.FC<ContentPopupProps> = ({ content }: ContentPopupProps) => {
    if (!content) return;
    return (
        <Popup  closeOnClick={false}  anchor="top" closeButton={false} latitude={content.lat} longitude={content.long} offset={50} style={{ padding: 10 }}>
            <Stack direction="column" flex={1} justifyContent={"flex-start"} alignItems={"flex-start"}>
                <Typography variant="body1" sx={{ fontFamily: "Gotu", width: "100%" }} gutterBottom>
                    {content.title}
                </Typography>
                {content.mediafile && <img style={{ height: '100px', width: '100%' }} src={content.mediafile.url}></img>}
                <Typography variant="subtitle2" sx={{ fontFamily: 'Gotu', marginTop: 1 }}>
                    {content.description}
                </Typography>
            </Stack>
        </Popup>);
}

