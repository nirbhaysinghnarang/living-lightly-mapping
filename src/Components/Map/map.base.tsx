import { BaseMapProps } from "../../Types/BaseMapProps.type";
import React, { useRef, useEffect, useState, createRef } from 'react';
import * as mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntaximport { Box } from '@mui/material';
import { Box } from '@mui/material';
import { Marker, Map, MapProvider, Source, Layer, Popup } from 'react-map-gl';
import { Schema } from "../../../schema";
import { PointOfInterest } from "../../Types/PointOfInterest.type";
import { getSubChannel } from "../../Client/mvc.client";

export const BaseMap: React.FC<BaseMapProps> = ({
    assetList,
    mapZoom,
    mapCenter,
    zoomMinMax,
    hasInsetMap,
    insetMapProps,
    mapBounds,
    mapStyle, 
    accessToken
}: BaseMapProps) => {
    const MAP_OVERLAY_ASSET = assetList.find(elem => elem.id == "MAP_OVERLAY_ASSET")
    const mapRef = useRef(null);


    const [mapData, setMapData] = useState({});


    // const getAllMapData = () => {
    //     var mapTempData = {};
    //     getSubChannel(env_vars.CHANNEL_ID).then(response => {
    //         const data = response.data;
    //         var allCommunities = [];
    //         data.forEach(element => {
    //             const elementContent = JSON.stringify(element);
    //             mapTempData[elementContent] = {};
    //             allCommunities.push(element);
    //             getSubChannel(element.uniqueID).then(response => {
    //                 const routesData = response.data;
    //                 routesData.forEach(route => {
    //                     const routeContent = JSON.stringify(route);
    //                     mapTempData[elementContent][routeContent] = {};
    //                     getContentForChannel(route.uniqueID).then(response => {
    //                         const markersData = response.data;
    //                         var allMarkers = []
    //                         markersData.forEach(marker => {
    //                             allMarkers.push(marker);
    //                         })
    //                         mapTempData[elementContent][routeContent] = allMarkers;
    //                     })
    //                 })
    //             })
    //         });
    //         setMapData(mapTempData);
    //         setAllCommunity(allCommunities);
    //     })
    // }


    async function fetchData(){
        //schema object can be modelled as a graph of separate unconnected trees.
        type levelInfo = {
            id:string,
            isBase:boolean,
        }
        function unwrapSchema(schema:PointOfInterest): levelInfo[]{
            //the unwrapSchema function unwraps the keys of the schema in 
            //level-based order they appear in the schema definition into a queue.
            var schemaQueue: levelInfo[] = [];
            var bfsQueue:PointOfInterest[] = [];
            var visited = new Set()
            bfsQueue.push(schema);
            while (bfsQueue){
                for (let i = 0; i<bfsQueue.length;i++){

                    var key = bfsQueue.shift()!;
                    visited.add(key);
                    var children = key?.child 
                    const isBase = Object.prototype.toString.call(children) === '[object Array]'
                    schemaQueue.push({id:key.name!,isBase:isBase});
                    if (!children){continue}
                    if(isBase) {
                        for(const child of children as PointOfInterest[]){
                            if(!visited.has(child))bfsQueue.push(child)
                        }
                    }else{
                        let child = children as PointOfInterest
                        if(!visited.has(child)) bfsQueue.push(child)
                    }
                }
            }
            return schemaQueue
        }

        const schemaQueue: levelInfo[] = unwrapSchema(Schema);
        var schemaStack = [schemaQueue[0]];
        var mapData = {}


        const mockData = {
            name:'community',
            description:'van gujjar',
            pos:[1,0],
            children:[
                {
                    name:'routes',
                    description:"chakrta santi route",
                    pos:[0,1],
                    children:[
                        {
                            name:'route-pointers',
                            description:'salona pt',
                            pos:[0,1]
                        }
                    ]
                }
            ]
        }

        const getSubChannel = (data, channel) => {
                if(!channel) return
                if(channel[data]!=='undefined'){
                    return channel[data];
                }

                for (const key in channel) {
                    if (channel.hasOwnProperty(key)) {
                        getSubChannel(data, channel[key])
                    }
                  }

        }
        
        while (schemaStack){
            //get current level to look at
            const level = schemaStack.pop()!
            //use queue to see if level has children or not
            const levelInfo = schemaQueue.find(elem=>elem.id === level.id);
            mapData[level.id] = levelInfo?.isBase ? {} : [];
            //get data for this level
            getSubChannel(mockData, level).then(response=>{
                //push next level on to stack
                schemaQueue && schemaStack.push(schemaQueue.shift()!);

                const data = response.data
                //if level is base, 
                if (levelInfo?.isBase) mapData[level.id] = data
                else{
                    data.forEach(datum=>{
                        mapData[level.id].push(datum)
                    })
                }
            })
        }

        console.log(mapData)

        
        

    }
    




    return (<>
        <Box sx={{ backgroundImage: MAP_OVERLAY_ASSET, width: '100vw', height: '100vh', backgroundSize: "100vw 100vh", zIndex: 1 }}>
            <Map
                initialViewState={{
                    longitude: mapCenter.lng,
                    latitude: mapCenter.lat,
                    zoom: mapZoom

                }}
                maxZoom={zoomMinMax[1]}
                minZoom={zoomMinMax[0]}
                id="primary_map"
                maxBounds={mapBounds}
                ref={mapRef}
                style={{ zIndex: 0, opacity: 0.5 }}
                mapStyle={mapStyle}
                mapboxAccessToken={accessToken}
            >



            </Map>
        </Box>

    </>);
}