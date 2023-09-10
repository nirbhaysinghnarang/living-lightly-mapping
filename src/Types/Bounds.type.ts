export type MapBounds = {
    minLng:number,
    minLat:number,
    maxLng:number,
    maxLat:number,
}
export type BoxBound = [[number, number], [number, number]]

export function calculateCenter(bounds: BoxBound): [number, number] {
    const centerLng = (bounds[0][0] + bounds[1][0]) / 2;
    const centerLat = (bounds[0][1] + bounds[1][1]) / 2;
    return [centerLng, centerLat];
  }
  
export function padBounds(originalBounds: BoxBound, paddingFactor: number): BoxBound {
    const center = calculateCenter(originalBounds);
    const halfWidth = (originalBounds[1][0] - originalBounds[0][0]) / 2;
    const halfHeight = (originalBounds[1][1] - originalBounds[0][1]) / 2;
  
    const newHalfWidth = halfWidth * paddingFactor;
    const newHalfHeight = halfHeight * paddingFactor;
  
    return [
      [center[0] - newHalfWidth, center[1] - newHalfHeight],
      [center[0] + newHalfWidth, center[1] + newHalfHeight],
    ];
  }
  
  
export function get2DBounds(bounds:MapBounds): BoxBound {
    return [
        [bounds.maxLng, bounds.minLat],
        [bounds.minLng, bounds.maxLat]
    ]
} 
export function getBoundsFromBox(twoDBounds:BoxBound): MapBounds{
    return {
        minLng:twoDBounds[0][0],
        minLat:twoDBounds[0][1],
        maxLng:twoDBounds[1][0],
        maxLat:twoDBounds[1][1]
    }
}