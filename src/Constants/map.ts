import { LatLng } from "../Types/LatLng.type";
import {CONSTANT_ASSETS} from './assets.ts'


const BASE_MAP_ASSET_LIST: string[] = [
    "MAP_OVERLAY_ASSET",
    "INSET_MAP_OVERLAY_ASSET",
    "ROUTE_START_IMG"
] 

const BASE_MAP_ASSETS = CONSTANT_ASSETS.filter(asset=>BASE_MAP_ASSET_LIST.includes(asset.id));
const BASE_MAP_INIT_ZOOM = 6
const BASE_MAP_ZOOM_MIN_MAX:[number, number] = [6,13]
const BASE_MAP_CENTER:LatLng = {lat:20.5937, lng:78.9629}
const BASE_MAP_BOUNDS:[LatLng, LatLng] = [{lat:0.0, lng:0.0},{lat:0.0, lng:0.0}]
const BASE_MAP_HAS_INSET_MAP = false;

export {
    BASE_MAP_ASSETS,
    BASE_MAP_INIT_ZOOM,
    BASE_MAP_ZOOM_MIN_MAX,
    BASE_MAP_CENTER,
    BASE_MAP_BOUNDS,
    BASE_MAP_HAS_INSET_MAP
}