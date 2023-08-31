import { PointOfInterest } from "./src/Types/PointOfInterest.type";
//Schema object can be edited to match user specifications but must conform to the PointOfInterest type.
//[https://www.typescriptlang.org/docs/handbook/type-compatibility.html]
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