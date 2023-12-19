import { Info, MapRounded, PhotoAlbum, Share } from "@mui/icons-material"
import { IconButton, Stack } from "@mui/material"
import { NavLink } from "react-router-dom"
export const MenuOptions:React.FC = ({}) => {
    return <Stack direction="row" alignItems={"space-evenly"}>
        <NavLink to='/map'>
        <IconButton >
            <MapRounded></MapRounded>
        </IconButton>
        </NavLink>
        <NavLink to='/gallery'>
        <IconButton>
            <PhotoAlbum></PhotoAlbum>
        </IconButton>
        </NavLink>
       
        <IconButton>
            <Info></Info>
        </IconButton>
        <IconButton>
            <Share></Share>
        </IconButton>

    </Stack>
}