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
        if(elem.view === 'IND') return "Indian Peninsular Map"
        if(elem.view === 'STATE') return (elem.selectedElement as State).name
        if(elem.view === 'COMM') return (elem.selectedElement as ChannelType).name
        if(elem.view === 'ROUTE') return (elem.selectedElement as ChannelType).name
        if(elem.view === 'POINT') return (elem.selectedElement as ChannelContent).title
    }


    return <Breadcrumbs sx={{padding:'10px', opacity:0.9, background:"#f6f6f2", zIndex:99}} separator={<NavigateNext fontSize="small" />}>
        {history.map((elem,index)=>{
            return <Typography sx={{fontFamily:"Source Serif", color:"black", fontStyle:"italic"}}>{getDisplayNameFromElement(elem, index)}</Typography>
        })}
    </Breadcrumbs>
}