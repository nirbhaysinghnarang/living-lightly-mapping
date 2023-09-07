const BASE_MVC_URL = "https://mvcdev.represent.org/strapi/api"
const ENDPOINTS = {
    "channelContent":"getContentForChannel",
    "channelInfo":"getChannel",
    "subChannels": "getChildChannels"
}

export const getEndpoint = (endpoint, channelId) => {
    return `${BASE_MVC_URL}/${ENDPOINTS[endpoint]}?uniqueID=${channelId}`
}