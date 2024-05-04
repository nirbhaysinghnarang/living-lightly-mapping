import { LineLayer } from "mapbox-gl";
export function createLayer(color:string|undefined, id:string, isHover:boolean=false):LineLayer {
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
            'line-opacity': isHover ? 0.7 : 1,
            'line-width': 2,
            'line-dasharray': [1, 2]
        }
    };

}