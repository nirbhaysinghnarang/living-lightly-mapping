import { ChannelType, ChannelContent } from "../../../Types/Channel.types"
import { MapBounds, BoxBound, get2DBounds, getBoundsFromBox } from "../../../Types/Bounds.type"
/**
 * Recursively computes
 * 1. minLat
 * 2. maxLat
 * 3. minLng
 * 4. maxLng
 * for an entire channel.
 * @param channel 
 */


export function getBounds(channel: ChannelType):BoxBound {
    var mapBounds:MapBounds = {
        minLat:Infinity,
        minLng:Infinity,
        maxLat:-Infinity,
        maxLng:-Infinity,
    }
    function recurse(channel: ChannelType): BoxBound{
        if (!channel) return
        if (channel.contents && channel.contents.length!==0) {
            const lats = channel.contents.map((content: ChannelContent) => content.lat)
            const lngs = channel.contents.map((content: ChannelContent) => content.long)
            console.log(Math.min(...lngs))
            const bounds:MapBounds = {
                minLat:Math.min(mapBounds.minLat, ...lats),
                maxLat:Math.max(mapBounds.maxLat, ...lats),
                minLng:Math.min(mapBounds.minLng, ...lngs),
                maxLng:Math.max(mapBounds.maxLng, ...lngs),
            }
            return get2DBounds(bounds)
        }
        if(channel.children){
            channel.children.forEach((child:ChannelType)=>{
                const boundsOfChild = getBoundsFromBox(recurse(child))
                mapBounds.maxLat = Math.max( mapBounds.maxLat, boundsOfChild.maxLat)
                mapBounds.minLat = Math.min( mapBounds.maxLat, boundsOfChild.minLat)
                mapBounds.minLng = Math.min( mapBounds.minLng, boundsOfChild.minLng)
                mapBounds.maxLng = Math.max( mapBounds.maxLng, boundsOfChild.maxLng)
            })
        }
        return get2DBounds(mapBounds)
        
    }
    return recurse(channel)
}