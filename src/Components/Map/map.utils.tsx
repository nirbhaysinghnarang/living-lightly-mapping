
import React from 'react';
import {  Button, Box, Divider, Stack} from '@mui/material';
import { MapPopupProps } from '../../Types/MapPopupProps';
export const MapPopup : React.FC<MapPopupProps> = ({
    POI,
    overlay,
    handleDisplay,
    arrowLeftAsset,
    arrowRightAsset,
    showArrows,
    onLeftArrowClick,
    arrowColor,
    onRightArrowClick,
}:MapPopupProps) => {
    return (
        <div style={{backgroundImage: overlay.id, backgroundRepeat:'no-repeat'}}>
            {handleDisplay(POI)}
            {POI.asset && <img src={POI.asset.url} style={{ height: "100px", marginTop: 5 }}></img>}
            {showArrows &&
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                    <Divider></Divider>
                <Button onClick={onLeftArrowClick} sx={{ backgroundColor: arrowColor, ':hover': { backgroundColor: arrowColor, opacity: 0.5, } }}><img src={arrowLeftAsset?.url} alt={'prev'} /></Button>
                <Button onClick={onRightArrowClick} sx={{ backgroundColor: arrowColor, ':hover': { backgroundColor: arrowColor, opacity: 0.5, } }}><img src={arrowRightAsset?.url} alt={'next'} /></Button>
            </Box>}
        </div>
    );

}


