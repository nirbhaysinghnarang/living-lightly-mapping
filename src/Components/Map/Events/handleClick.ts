import { LngLat } from "mapbox-gl";
import { State } from "../../../Types/State.type";
import { geoContains } from "d3-geo";
import { panTo } from "../map.utils";
import { getZoomLevel } from "../Geometry/getZoomLevel";
import { MapRef } from "react-map-gl";

export function handleClickStateLevel(position: LngLat, mapRef: React.RefObject<MapRef>, states: State[]): State|null{
    if (mapRef.current) {
        //get states
        const filtered = states.filter((state: State) => {
            return geoContains(state.features, [position.lng, position.lat])
        });

        if (!filtered || filtered.length == 0) {
            return null //do nothing if click event is outside any state
        }
        const state = filtered[0]
        
        panTo(
            state.center.geometry.coordinates as [number, number],
            getZoomLevel("Community"),
            mapRef
        )
        return state
    }
}