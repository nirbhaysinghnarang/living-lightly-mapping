import { NavigateNext } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { ChannelContent, ChannelType } from "../../Types/Channel.types";
import { HistoryStack, HistoryStackElement, peek, pop } from "../../Types/History.stack.type";
import { State } from "../../Types/State.type";
import React from "react";
interface GalleryBreadcrumbsProps {
    history: HistoryStack,
    setHistory: (s: HistoryStack) => void
}

export const GalleryBreadcrumbs: React.FC<GalleryBreadcrumbsProps> = ({ history, setHistory }: GalleryBreadcrumbsProps) => {

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
        if (elem.view === 'IND') return "India"
        if (elem.view === 'STATE') return (elem.selectedElement as State).name
        if (elem.view === 'COMM') return (elem.selectedElement as ChannelType).name
        if (elem.view === 'ROUTE') return (elem.selectedElement as ChannelType).name
        if (elem.view === 'POINT') return (elem.selectedElement as ChannelContent).title
    }


    return <Breadcrumbs sx={{ padding: '10px', opacity: 0.9, background: "transparent", zIndex: 99 }} separator={<NavigateNext fontSize="small" sx={{color:"white"}}/>}>
        {history.map((elem, index) => {
            return <Button onClick={()=>onElementClick(elem)} style={{'textTransform':'none'}}>
                <Typography sx={{ fontFamily: "Source Serif ", color: "white", fontStyle: "italic" }}>{getDisplayNameFromElement(elem, index)}</Typography>
            </Button>
        })}
    </Breadcrumbs>
}