import { Asset } from "./Asset.type"
import { LatLng } from "./LatLng.type"
import { Nullable } from 'tsdef';

export interface MapProps{
    assetList: Asset[],
    channelId:Nullable<string>,
    mapZoom: number,
    mapCenter: LatLng,
    zoomMinMax: [number, number],
    mapBounds: [LatLng, LatLng],
    mapStyle: string,
    accessToken: string,
    insetMapProps: Nullable<MapProps>,
    hasInset: boolean
}