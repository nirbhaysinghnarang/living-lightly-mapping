import { LineLayer } from "mapbox-gl";
export function createLayer(color:string|undefined, id:string):LineLayer {
    console.log(id)
    return {
        id: `route${id}`,
        type: 'line',
        source: 'routes',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': typeof color === 'undefined' ? '#4F311C' : color,
            'line-width': 2,
            'line-dasharray': [1, 2]
        }
    };

}