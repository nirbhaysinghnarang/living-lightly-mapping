import { ChannelType } from "../../../Types/Channel.types";
import { Box, Typography, Stack } from "@mui/material";
import { CONSTANT_ASSETS } from "../../../Constants/assets";
import { Asset } from "../../../Types/Asset.type";
import { Popup } from "react-map-gl";
interface CommunityPopupProps {
    community: ChannelType,
    fixed: boolean

}

export const CommunityPopup: React.FC<CommunityPopupProps> = ({ community, fixed }: CommunityPopupProps) => {

    const popupBackgroundOverlay: Asset = CONSTANT_ASSETS.find((asset: Asset) => asset.id === "MAP_OVERLAY_ASSET")

    function _renderContents() {
        return (<Stack direction="column" flex={1} justifyContent={"flex-start"} alignItems={"flex-start"}>
            <Typography variant="body1" sx={{ fontFamily: "Gotu", width: "100%" }} gutterBottom>
                {community.name}
            </Typography>
            <img style={{ height: '100px', width: '100%' }} src={community.picture.url}></img>
            <Typography variant="subtitle2" sx={{ fontFamily: 'Gotu', marginTop: 1 }}>
                {community.description}
            </Typography>
        </Stack>);
    }


    if (!community) return;
    if (!fixed) return (
        <Popup anchor="top" latitude={community.lat} longitude={community.long} offset={1} style={{ padding: 10 }}>
            {_renderContents()}
        </Popup>);

    return <Box style={{ padding: 10, border: '2px dashed black', position: "absolute", top: 200, right: 100, maxWidth: 300, opacity:1}}>
       {_renderContents()}
    </Box>
}


