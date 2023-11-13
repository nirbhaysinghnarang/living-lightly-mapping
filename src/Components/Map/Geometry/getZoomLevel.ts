import { VIEWMODE } from "../../../Types/ViewMode.type"
export function getZoomLevel(view:VIEWMODE){
    switch (view){
        case "IND":
            return 4
        case "STATE":
            return 6
        case "COMM":
            return 7
        case "ROUTE":
            return 10
    }
}