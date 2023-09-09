import { VIEWMODE } from "../map.base";

export function getZoomLevel(view:VIEWMODE){
    switch (view){
        case "State":
            return 4
        case "Community":
            return 6
        case "Routes":
            return 7
        case "Route":
            return 10
    }
}