import { NavigateNext } from "@mui/icons-material";
import { Typography } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
interface MapBreadCrumbsProps{
    history:HistoryStack,
}

export const MapBreadCrumbs:React.FC<MapBreadCrumbsProps> = ({history}:MapBreadCrumbsProps) => {
    const getDisplayNameFromElement = (elem:HistoryStackElement, index:number) => {
        if(elem.view === 'State') return "Indian Peninsular Map"
        if(elem.view === 'Community') return (elem.selectedElement as State).name
        if (elem.view === 'Routes') return (elem.selectedElement as ChannelType).name
        if(elem.view === 'Route') {
            //get Route from historystack
            const community = history.at(index-1).selectedElement as ChannelType
            const routes = community.children
            const route = routes.find(route=>route.contents[0].id === (elem.selectedElement as ChannelContent).id)
            return route.name
        }
    }
    return <Breadcrumbs sx={{padding:'10px'}} separator={<NavigateNext fontSize="small" />}>
        {history.map((elem,index)=>{
            return <Typography sx={{fontFamily:"Source Serif", color:"black", fontStyle:"italic"}}>{getDisplayNameFromElement(elem, index)}</Typography>
        })}
    </Breadcrumbs>
}