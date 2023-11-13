import { Info, MapRounded, PhotoAlbum, Share } from "@mui/icons-material"
import { IconButton, Stack } from "@mui/material"
export const MenuOptions:React.FC = ({}) => {
    return <Stack direction="row" alignItems={"space-evenly"}>
        <IconButton>
            <MapRounded></MapRounded>
        </IconButton>
        <IconButton>
            <PhotoAlbum></PhotoAlbum>
        </IconButton>
        <IconButton>
            <Info></Info>
        </IconButton>
        <IconButton>
            <Share></Share>
        </IconButton>

    </Stack>
}