import React from 'react';
import { Asset } from '../../Types/Asset.type';
import { ChannelContent } from '../../Types/Channel.types';
import { Box } from '@mui/material';
const arrowContainerStyle = {
    borderRadius: '50%',
    cursor: 'pointer',
    width: '35px',
    height: '35px',
    backgroundImage: 'url("../public/Assets/Images/arrowTexture.png")',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};
interface ArrowComponentProps {
    arrowImage: Asset;
    onArrowClick: ()=>void
}

interface CycleComponentProps {
    arrowPrevImage: Asset;
    arrowNextImage: Asset;
    onNextArrowClick:  ()=>void;
    onPrevArrowClick: ()=>void;
}
export const Arrow: React.FC<ArrowComponentProps> = ({ arrowImage, onArrowClick }: ArrowComponentProps) => {
    return (
        <div style={arrowContainerStyle} onClick={onArrowClick}>
            <img style={{ marginTop: '1px', height:35, width:35 }} src={arrowImage.url} alt={arrowImage.id} />
        </div>
    );
}


export const Cycle: React.FC<CycleComponentProps> = ({
    arrowPrevImage,
    arrowNextImage,
    onNextArrowClick,
    onPrevArrowClick,
}: CycleComponentProps) => {
    return (
        <>
        
         <Box sx={{ position: 'absolute', bottom: "50px", left: "80px", zIndex: 10, width:100, height:100}}>
                <Arrow arrowImage={arrowPrevImage} onArrowClick={onPrevArrowClick}></Arrow>
            </Box>
            <Box sx={{ position: 'absolute', bottom: "50px", right: "125px", zIndex: 10, width:100, height:100 }}>
                <Arrow arrowImage={arrowNextImage} onArrowClick={onNextArrowClick}></Arrow>
            </Box>
        </>
    )
}


