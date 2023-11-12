import { Cancel } from "@mui/icons-material";
import { Button, Card, Stack, Typography } from "@mui/material";
import { Popup } from "react-map-gl";
import { ChannelContent, ChannelType } from "../../../Types/Channel.types";


interface ChannelPopupProps {
    channel: ChannelType,
    fixed: boolean,
    isOpen: boolean,
    handleClose: (b: boolean) => void
}

interface ContentPopupProps {
    content: ChannelContent,
    isOpen: boolean,
    onClose: (b: boolean) => void
}

export const ChannelPopup: React.FC<ChannelPopupProps> = ({ channel, fixed, isOpen, handleClose }: ChannelPopupProps) => {
    if (!isOpen) return <></>
    function _renderContents() {
        return (<Stack direction="column" flex={1} justifyContent={"flex-start"} alignItems={"flex-start"}>

            <Stack direction={"row"} sx={{ width: "100%" }} justifyContent={"space-between"} alignContent={"center"}>
                <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                    {channel.name}
                </Typography>
                {!fixed && <Button onClick={() => { handleClose(false) }}>
                    <Cancel sx={{ color: "black" }}></Cancel>
                </Button>}
            </Stack>

            {channel.picture && <img style={{ height: '100px', width: '100%' }} src={channel.picture.url}></img>}
            <Typography variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#5b5f60', marginTop: 1 }}>
                {channel.description}
            </Typography>
        </Stack>);
    }

    if (!channel) return;
    if (!fixed && channel.contents.length == 0) return (
        <Popup anchor="top" closeOnClick={false} closeButton={false} latitude={channel.lat} longitude={channel.long} offset={10}>
            {_renderContents()}
        </Popup>);

    if (!fixed) return (
        <Popup anchor="top" closeOnClick={false} closeButton={false} latitude={channel.contents[0].lat} longitude={channel.contents[0].long} offset={10}>
            {_renderContents()}
        </Popup>);

    return <Card style={{ position: "absolute", top: 300, left: "80px", maxWidth: 300, opacity: 1, padding: "10px", backgroundColor: "#f6f6f2" }}>
        {_renderContents()}
    </Card>
}


export const ContentPopup: React.FC<ContentPopupProps> = ({ content, isOpen, onClose }: ContentPopupProps) => {
    if (!content || !isOpen) return;
    return (
        <Popup closeOnClick={false} anchor="top"
            closeButton={false}
            latitude={content.lat} longitude={content.long} offset={50} style={{ padding: 10, zIndex: 10 }}>
            <Stack direction="column" flex={1} justifyContent={"flex-start"} alignItems={"flex-start"} >

                <Stack direction="row" sx={{ width: "100%" }} justifyContent={"space-between"} padding={1} alignItems={"center"} alignContent={"center"}>
                    <Typography variant="body1" sx={{ fontFamily: "Source Serif", color: "#191c1b", fontSize: "18px", width: "100%" }}>
                        {content.title}
                    </Typography>
                    <Button onClick={() => { onClose(false) }}>
                        <Cancel sx={{ color: "black" }}></Cancel>
                    </Button>
                </Stack>

                {content.mediafile && <img style={{ height: '100px', width: '100%' }} src={content.mediafile.url}></img>}
                <Typography variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#5b5f60', marginTop: 1 }}>
                    {content.description}
                </Typography>
            </Stack>
        </Popup>);
}

