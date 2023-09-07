import { AxiosResponse } from "axios";
import { getSubChannel, getChannel, getContentForChannel } from "../../../Client/mvc.client";
import { BaseChannelType, ChannelType, ChannelContent} from "../../../Types/Channel.types";
export async function fetchData(channelId:string){
    var communities: ChannelType[] = [];
    var routes: ChannelType[] = [];
    var routePoints: ChannelContent[] =[]
    getChannel(channelId).then((channelReponse:AxiosResponse<BaseChannelType>)=>{
        channelReponse.data.children.forEach((communityChild:ChannelType)=>{
                communities = communities.concat([...channelReponse.data.children])
                getSubChannel(communityChild.uniqueID).then((subchannelResponse:AxiosResponse<ChannelType[]>)=>{
                    routes = routes.concat([...subchannelResponse.data])
                    subchannelResponse.data.forEach((route:ChannelType)=>{
                        getContentForChannel(route.uniqueID).then((routeResponse:AxiosResponse<ChannelContent[]>)=>{
                            routePoints = routePoints.concat([...routeResponse.data])
                        })
                    })
                })
        })
    })




   
}
