import { Asset } from "./Asset"
import { LatLng } from "./LatLng"
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
    accessToken: string
}