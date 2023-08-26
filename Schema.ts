import { PointOfInterest } from "./src/Types/PointOfInterest.type";

export const Schema: PointOfInterest = {
    name:"community",
    description:"Base community for LL.",
    asset:{
        id:"community-pointer",
        url:"none",
    },
    child:[{
        name:"routes",
        description:"routes for community",
        asset:{
            id:'routes-pointer',
            url:"none"
        },
        child:[{
            name:'route-points',
            description:"route points for community routes",
            asset:{
                id:'route-pointer',
                url:"none"
            },
            child: null
        }]
    }],
}