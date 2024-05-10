import { NavigateNext } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement, peek, pop } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
interface MapBreadCrumbsProps {
    history: HistoryStack,
    setHistory: (s: HistoryStack) => void
}

export const MapBreadCrumbs: React.FC<MapBreadCrumbsProps> = ({ history, setHistory }: MapBreadCrumbsProps) => {

    const onElementClick = (elem: HistoryStackElement) => {
        //Want to keep on popping from the stack until [elem] is at the top
        let stack = [...history]
        let top = peek(stack)
        while (top.selectedElement !== elem.selectedElement) {
            stack = pop(stack)
            top = peek(stack)
        }
        setHistory([...stack])
    }

    const getDisplayNameFromElement = (elem: HistoryStackElement, index: number) => {
        if (elem.view === 'IND') return "Indian Peninsular Map"
        if (elem.view === 'STATE') return (elem.selectedElement as State).name
        if (elem.view === 'COMM') return (elem.selectedElement as ChannelType).name
        if (elem.view === 'ROUTE') return (elem.selectedElement as ChannelType).name
        if (elem.view === 'POINT') return (elem.selectedElement as ChannelContent).title
    }


    return <Breadcrumbs sx={{ opacity: 0.9, background: "transparent", zIndex: 99 }} separator={<NavigateNext fontSize="small" style={{color:'white'}}/>}>
        {history.map((elem, index) => {
            return <Button onClick={()=>onElementClick(elem)} style={{'textTransform':'none'}}>
                <Typography sx={{ fontFamily: "Source Serif ", color: "white", fontStyle: "italic" }}>{getDisplayNameFromElement(elem, index)}</Typography>
            </Button>
        })}
    </Breadcrumbs>
}