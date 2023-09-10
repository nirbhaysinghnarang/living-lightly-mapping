import { Nullable } from 'tsdef';

export type Overlay = {
    br_lat:Nullable<number>;
    br_long:Nullable<number>;
    bl_lat:Nullable<number>;
    bl_long:Nullable<number>;
    tr_lat:Nullable<number>;
    tr_long:Nullable<number>;
    tl_lat:Nullable<number>;
    tl_long:Nullable<number>;
    id:number,
    image:{
        url:string;
        formats:Nullable<formats>;
    }
}
type formats = {
    thumbnail:Nullable<{
        ext:string,
        height:number,
        width:number
    }>

    
}

export function isValidOverlay(overlay:Overlay){
    const pairs:string[][] = [
        ["br_lat", "br_long","tl_lat", "tl_long"],
        ["bl_lat", "bl_long", "tr_lat", "tr_long"]
    ]
    for (const pair of pairs) {
        const hasNonNullValues = pair.every((key) => overlay[key as keyof Overlay] !== null);
        if (!hasNonNullValues) {
          return false; 
        }
      }
      return true;
}