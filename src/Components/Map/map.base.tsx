import { MapProps } from "../../Types/MapProps";
import React, { useRef, useEffect, useState, createRef } from 'react';
import * as mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Box } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker, Map, MapProvider, Source, Layer, Popup } from 'react-map-gl';
import { InsetMap } from "./map.inset.tsx";
import { fetchData } from "./Functions/fetchData.tsx";
import { ChannelContent, ChannelType } from "../../Types/Channel.types.ts";
import { Menu as MapMenu } from "../menu.map.tsx";
import { MenuOutlined } from "@mui/icons-material";
export const BaseMap: React.FC<MapProps> = ({
    assetList,
    mapZoom,
    channelId,
    mapCenter,
    zoomMinMax,
    mapBounds,
    mapStyle,
    accessToken,
    insetMapProps,
    hasInset
}: MapProps) => {
    const MAP_OVERLAY_ASSET = assetList.find(elem => elem.id == "MAP_OVERLAY_ASSET")
    const mapRef = useRef(null);
    const [mapData, setMapData] = useState<ChannelType>(null);
    const [communities, setCommunities] = useState<ChannelType[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<ChannelType>(null);
    const [showMenu, setShowMenu] = useState(false);


    const handleCommunity = (community:ChannelType) => {
        setSelectedCommunity(
            communities.find((comm:ChannelType)=>comm.uniqueID === community.uniqueID)
        );
    }
    useEffect(()=>{
        fetchData(channelId).then((data:ChannelType)=>setMapData(data))
    },[])

    useEffect(()=>{
        if(mapData!==null && Object.keys(mapData).length!==0){
            setCommunities(mapData.children)
        }
    },[mapData])



    
    return (<>
        <Box sx={{ backgroundImage: `url('${MAP_OVERLAY_ASSET?.url}')`, width: '100vw', height: '100vh', backgroundSize: "100vw 100vh", zIndex: 1 }}>
            <Map
                initialViewState={{
                    longitude: mapCenter.lng,
                    latitude: mapCenter.lat,
                    zoom: mapZoom

                }}
                maxZoom={zoomMinMax[1]}
                minZoom={zoomMinMax[0]}
                id="primary_map"
                ref={mapRef}
                style={{ zIndex: 0, opacity: 0.5 }}
                mapStyle={mapStyle}
                mapboxAccessToken={accessToken}
            >
                <Box sx={{ position: 'absolute', top: "50px", left: "80px", zIndex: 10 }}>
                        <div>
                            <div className={'flex justify-start items-center gap-5'}>
                                <div onClick={() => { setShowMenu(!showMenu) }}> <MenuOutlined /> </div>
                            </div>
                            {showMenu && <MapMenu selectCommunity={handleCommunity} communities={communities} />}
                        </div>
                    </Box>
                {hasInset && <InsetMap
                    channelId={insetMapProps!.channelId}
                    hasInset={false}
                    accessToken={insetMapProps!.accessToken}
                    assetList={insetMapProps!.assetList}
                    mapZoom={insetMapProps!.mapZoom}
                    mapBounds={insetMapProps!.mapBounds}
                    mapCenter={insetMapProps!.mapCenter}
                    mapStyle={insetMapProps!.mapStyle}
                    insetMapProps={null}
                    zoomMinMax={insetMapProps!.zoomMinMax}
                ></InsetMap>}




            </Map>
        </Box>

    </>);
}