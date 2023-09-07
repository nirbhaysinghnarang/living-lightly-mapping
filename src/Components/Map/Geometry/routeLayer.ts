import { FillLayer, LineLayer, } from "mapbox-gl";

export function createLayer():LineLayer {
    return {
        id: 'routes',
        type: 'line',
        source: 'routes',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#4F311C',
            'line-width': 2
        }
    };

}