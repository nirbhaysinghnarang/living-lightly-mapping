import { LatLng } from "../Types/LatLng.type";
import { CONSTANT_ASSETS } from './assets.ts';


const BASE_MAP_ASSET_LIST: string[] = [
    "MAP_OVERLAY_ASSET",
    "INSET_MAP_OVERLAY_ASSET",
    "ROUTE_START_IMG",
    "ROUTE_POINTER_IMG",
    "ARROW_NEXT_IMG",
    "ARROW_PREV_IMG",
    "ROUTE_1",
    "ROUTE_2",
    "ROUTE_1_SEL",
    "ROUTE_1_SEL"
] 

const BASE_MAP_ASSETS = CONSTANT_ASSETS.filter(asset=>BASE_MAP_ASSET_LIST.includes(asset.id));
const BASE_MAP_INIT_ZOOM = 6
const BASE_MAP_ZOOM_MIN_MAX:[number, number] = [6,13]
const BASE_MAP_CENTER:LatLng = {lat:20.5937, lng:78.9629}
const BASE_MAP_HAS_INSET_MAP = false;
export const BASE_MAP_BOUNDS = [
    //Southwest bound
    [57.991404, 9.459868],
    //Northeast bound
    [98.616617, 41.179631]
]
export {
    BASE_MAP_ASSETS,
    BASE_MAP_INIT_ZOOM,
    BASE_MAP_ZOOM_MIN_MAX,
    BASE_MAP_CENTER,
    BASE_MAP_HAS_INSET_MAP
};

