import { Cancel } from "@mui/icons-material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button, Card, IconButton, Stack, Typography } from "@mui/material";
import { Popup } from "react-map-gl";
import { ChannelContent, ChannelType } from "../../../Types/Channel.types";
import ExpandableImage from "../../Gallery/expandable.image";
import { Map as MapBoxMap } from "mapbox-gl";
interface ChannelPopupProps {
    channel: ChannelType,
    fixed: boolean,
    isOpen: boolean,
    color: string,
    handleClose: (b: boolean) => void,
    isFromHover: boolean,
    map: MapBoxMap
}

interface ContentPopupProps {
    content: ChannelContent,
    isOpen: boolean,
    color: string,
    onClose: (b: boolean) => void,
    onNextArrowClick: () => void,
    onPrevArrowClick: () => void,
    map: MapBoxMap,
    onExpand?: () => void,
    onShrink?: () => void
}

interface CommunityPopupProps {
    community: ChannelType,
    idColorMap: Record<string, string>
}




export const ChannelPopup: React.FC<ChannelPopupProps> = ({ channel, fixed, isOpen, handleClose, color, isFromHover, map }: ChannelPopupProps) => {
    document.documentElement.style.setProperty('--popup-background-color', color);
    document.documentElement.style.setProperty('--popup-width', "auto")

    if (!isOpen) return <></>
    function _renderContents() {
        return (<Stack direction="column" flex={1} justifyContent={"flex-start"} alignItems={"flex-start"}>

            <Stack direction={"row"} sx={{ width: "100%" }} justifyContent={"space-between"} alignContent={"center"} alignItems={"center"}>
                <Typography color="white" variant="body1" sx={{ fontFamily: "Source Serif ", color: "white", fontSize: "18px", }}>
                    {channel.name}
                </Typography>
                {!fixed && !isFromHover && <Button onClick={() => { handleClose(false) }}>
                    <Cancel sx={{ color: "white" }}></Cancel>
                </Button>}
            </Stack>

            {channel.picture && <ExpandableImage src={channel.picture.url}></ExpandableImage>}
            {fixed && <Typography color="white" variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: 'white', marginTop: 1 }}>
                {channel.description}
            </Typography>}
        </Stack>);
    }

    if (!channel) return;
    if (!fixed && channel.contents.length == 0) return (
        <Popup anchor="top" closeOnClick={false} closeButton={false} latitude={channel.lat} longitude={channel.long} offset={10}>
            {_renderContents()}
        </Popup>);

    if (!fixed) return (
        <Card sx={{ padding: "10px", backgroundColor: color }}>
            <Popup anchor="top-left" closeOnClick={false} closeButton={false} latitude={channel.contents[0].lat} longitude={channel.contents[0].long} offset={10}>
                {_renderContents()}
            </Popup>
        </Card>
    );

    return <Card style={{ position: "absolute", top: 300, left: "80px", maxWidth: 300, opacity: 1, padding: "10px", backgroundColor: color }}>
        {_renderContents()}
    </Card>
}


const createSquarePolygon = (centerLat:any, centerLng:any, size:any) => {
    // Size is the length of each side of the square in degrees
    const halfSize = size / 2;
    return [
        [centerLng - halfSize, centerLat - halfSize],
        [centerLng + halfSize, centerLat - halfSize],
        [centerLng + halfSize, centerLat + halfSize],
        [centerLng - halfSize, centerLat + halfSize],
    ];
};


export const ContentPopup: React.FC<ContentPopupProps> = ({
    content,
    isOpen,
    onClose,
    onNextArrowClick,
    onPrevArrowClick,
    map,


}: ContentPopupProps) => {
    if (!content || !isOpen) return;
    document.documentElement.style.setProperty('--popup-background-color', "#F6F5F1");
    document.documentElement.style.setProperty('--popup-width', "405px")

    const onExpand = () => {
        if (!content.mediafile || !map) return
        const squareSize = 0.01; //
        const polygonCoordinates = createSquarePolygon(content.lat, content.long, squareSize);
        map.addSource(`${content.id}-mediafile`, { 'type': 'image', 'url': 'content.mediafile.url,', 'coordinates': polygonCoordinates })
        map.addLayer({
            'id': `${content.id}-mediafile-layer`, type: 'raster', source: `${content.id}-mediafile`, 'paint': {
                'raster-fade-duration': 0
            }
        })
    }
    const onShrink = () => {
        if (!content.id || !map) return;
        const layerId = `${content.id}-mediafile-layer`;
        const sourceId = `${content.id}-mediafile`;
            if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
            if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    };
    

    return (
        <Popup
            className={"popupContent"}
            closeOnClick={false}
            anchor="top"
            closeButton={false}

            latitude={content.lat} longitude={content.long} offset={50} style={{ padding: 20, zIndex: 10, color: "#f6f6f2" }}>
            <Stack direction="column" sx={{ width: "100%", height: '100%' }} flex={1} justifyContent={"flex-end"} alignItems={"flex-end"} >

                <Stack direction={"column"} sx={{ width: "100%" }} alignItems={"flex-start"}>
                    <Stack direction={"row"} sx={{ width: "100%" }} alignItems="center" alignContent={"center"} justifyContent={"space-between"}>
                        <Typography color="white" variant="body1" sx={{ fontFamily: "Georgia", color: "#38424D", fontSize: "18px", width: "100%", fontWeight: 'bold' }}>
                            {content.title}
                        </Typography>
                        <Stack direction={"row"} alignContent={"center"} justifyContent={"space-between"} sx={{ width: "100%" }}>
                            <IconButton onClick={() => onPrevArrowClick()}>
                                <KeyboardArrowLeftIcon sx={{ color: "#B39559" }}></KeyboardArrowLeftIcon>
                            </IconButton>
                            <IconButton onClick={() => onNextArrowClick()}>
                                <KeyboardArrowRightIcon sx={{ color: "#B39559" }}></KeyboardArrowRightIcon>
                            </IconButton>
                            <IconButton onClick={() => { onClose(false) }}>

                                <Cancel sx={{ color: "#B39559" }}></Cancel>
                            </IconButton>

                        </Stack>
                    </Stack>

                    {content.tags.length > 0 && content.tags.map(tag => <Typography variant="body1" fontStyle={"italic"}
                        sx={{ fontFamily: "Source Serif ", color: "#38424D", }}
                    >{tag.tag}</Typography>)}
                    {content.mediafile && <ExpandableImage src={content.mediafile.url} onExpand={()=>onExpand()} onShrink={()=>onShrink()}></ExpandableImage>}
                    <Typography color="white" variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: '#38424D', marginTop: 1 }}>
                        {content.description}
                    </Typography>
                </Stack>


            </Stack>
        </Popup>);
}

export const CommunityPopup: React.FC<CommunityPopupProps> = ({ community, idColorMap }: CommunityPopupProps) => {
    return <Card style={{ position: "absolute", top: 300, left: "80px", maxWidth: 300, opacity: 1, padding: "10px", backgroundColor: idColorMap[community.uniqueID] }}>
        <Stack direction="column" flex={1} justifyContent={"flex-start"} alignItems={"flex-start"}>

            <Stack direction={"row"} sx={{ width: "100%" }} justifyContent={"space-between"} alignContent={"center"} alignItems={"center"}>
                <Typography color="white" variant="body1" sx={{ fontFamily: "Source Serif ", color: "white", fontSize: "18px", }}>
                    {community.name}
                </Typography>

            </Stack>
            <Typography color="white" variant="subtitle2" sx={{ fontFamily: 'Lato', fontSize: "16px", color: 'white', marginTop: 1 }}>
                {community.description === "" ? "Community Description" : community.description}
            </Typography>
        </Stack>
    </Card>
}