import { Asset } from "./Asset.type"
import { LatLng } from "./LatLng.type"
import { Nullable } from 'tsdef';

export interface BaseMapProps{
    assetList: Asset[],
    mapZoom: number,
    mapCenter: LatLng,
    zoomMinMax: [number, number],
    hasInsetMap: boolean,
    insetMapProps: Nullable<BaseMapProps>,
    mapBounds: [LatLng, LatLng],
    mapStyle: string,
    accessToken: string,


}