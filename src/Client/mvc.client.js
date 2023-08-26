import axios from "axios";
import { getEndpoint } from "./endpoints";
export async function getContentForChannel(channelId) { return await axios.get(getEndpoint("channelContent", channelId)); }

export async function getChannel(channelId) {return await axios.get(getEndpoint("channelInfo", channelId)) }

export async function getSubChannel(channelId) { return await axios.get(getEndpoint("subChannels", channelId))}

