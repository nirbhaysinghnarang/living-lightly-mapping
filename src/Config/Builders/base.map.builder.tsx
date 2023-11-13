import { BASE_MAP_ASSETS, BASE_MAP_BOUNDS, BASE_MAP_CENTER, BASE_MAP_INIT_ZOOM } from "../../Constants/map.ts";
import { ENV_VARS } from "../../Helpers/env";
import { MapProps } from "../../Types/MapProps";

export function buildBaseMapProps(): MapProps {
    return {
        assetList:BASE_MAP_ASSETS,
        channelId:ENV_VARS["CHANNEL_ID"]!,
        mapZoom: BASE_MAP_INIT_ZOOM,
        mapCenter: BASE_MAP_CENTER,
        mapBounds: BASE_MAP_BOUNDS,
        mapStyle: ENV_VARS["MAPBOX_STYLE"]!,
        hasInset:true,
        insetMapProps:{
            channelId:null,
            hasInset:false,
            assetList:[],
            mapZoom:1,
            mapCenter:BASE_MAP_CENTER,
            mapBounds:BASE_MAP_BOUNDS,
            mapStyle:ENV_VARS["INSET_MAPBOX_STYLE"]!,
            accessToken:ENV_VARS["INSET_MAPBOX_ACCESS"]!,
            insetMapProps:null,
        },
        accessToken: ENV_VARS!["MAPBOX_ACCESS"]!,
    }
}
