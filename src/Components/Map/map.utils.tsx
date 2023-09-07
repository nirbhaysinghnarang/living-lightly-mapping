import { Map } from "mapbox-gl";
export const panTo = (coords:[number, number], zoom:number, mapRef:React.RefObject<Map>) => {
    if (mapRef.current) {
        mapRef.current.flyTo(
            {
                center: coords, zoom: zoom,
                speed: 5,
                curve: 1,
                easing(t) {
                    return t;
                }
            },
        )
    }
}