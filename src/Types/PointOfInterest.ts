import { Asset } from "./Asset"
import { Nullable } from "tsdef"

export type PointOfInterest = {
    isBase: boolean,
    name: String,
    description: Nullable<String>,
    asset: Asset,
    child: Nullable<PointOfInterest>,
}