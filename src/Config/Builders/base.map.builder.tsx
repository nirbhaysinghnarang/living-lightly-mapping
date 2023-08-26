import { env_vars } from "../../Helpers/env";
import { BaseMapProps } from "../../Types/BaseMapProps.type";
import { LatLng } from "../../Types/LatLng.type";

import { BASE_MAP_ASSETS, BASE_MAP_BOUNDS, BASE_MAP_CENTER, BASE_MAP_HAS_INSET_MAP, BASE_MAP_INIT_ZOOM, BASE_MAP_ZOOM_MIN_MAX } from "../../Constants/base.map.constants.ts";


export function buildBaseMapProps(): BaseMapProps {
    return {
        assetList:BASE_MAP_ASSETS,
        mapZoom: BASE_MAP_INIT_ZOOM,
        mapCenter: BASE_MAP_CENTER,
        zoomMinMax: BASE_MAP_ZOOM_MIN_MAX,
        hasInsetMap: BASE_MAP_HAS_INSET_MAP,
        insetMapProps:null,
        mapBounds: BASE_MAP_BOUNDS,
        mapStyle: env_vars["MAP_STYLE"],
        accessToken: env_vars["ACCESS_TOKEN"],
    }
}
