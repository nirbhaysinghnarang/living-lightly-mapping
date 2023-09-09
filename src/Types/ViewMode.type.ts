export type VIEWMODE = "State" | "Community" | "Routes" | "Route"
export const getParentType = (view: VIEWMODE) => {
    switch (view) {
        case "State":
            return "State"
        case "Community":
            return "State"
        case "Routes":
            return "Community"
        case "Route":
            return "Routes"
    }
}

export const getChildType = (view: VIEWMODE)=>{
    switch(view){
        case "State":
            return "Community"
        case "Community":
            return "Routes"
        case "Routes":
            return "Route"
        case "Route":
            return "Route"
    }
}