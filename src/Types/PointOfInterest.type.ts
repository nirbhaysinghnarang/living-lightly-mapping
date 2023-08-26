import { Asset } from "./Asset.type"
import { Nullable } from "tsdef"

export type PointOfInterest = {
    name: string,
    description: Nullable<String>,
    asset: Asset,
    child: Nullable<PointOfInterest> | Nullable<PointOfInterest[]>,
}

