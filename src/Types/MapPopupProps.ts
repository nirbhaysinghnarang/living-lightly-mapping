import { PointOfInterest } from "./PointOfInterest";
import { Asset } from "./Asset";
import { Nullable } from "tsdef";
import { ReactNode } from "react";


export interface MapPopupProps{
    POI: PointOfInterest,
    overlay: Asset,
    handleDisplay : (poiType: PointOfInterest) => ReactNode,
    arrowLeftAsset: Nullable<Asset>,
    arrowRightAsset: Nullable<Asset>,
    showArrows: boolean,
    onLeftArrowClick:React.MouseEventHandler<HTMLButtonElement>,
    onRightArrowClick: React.MouseEventHandler<HTMLButtonElement>,
    arrowColor:string
}
