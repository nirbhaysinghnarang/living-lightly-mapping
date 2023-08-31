import { PointOfInterest } from "../../../Types/PointOfInterest.type";
import { Schema } from "../../../../schema";
import { getSubChannel } from "../../../Client/mvc.client";
export async function fetchData(){
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
    while (schemaStack){
        //get current level to look at
        const level = schemaStack.pop()!
        //use queue to see if level has children or not
        const levelInfo = schemaQueue.find(elem=>elem.id === level.id);
        mapData[level.id] = levelInfo?.isBase ? {} : [];
        //get data for this level
        getSubChannel(level).then(response=>{
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

    return mapData

    
    

}
