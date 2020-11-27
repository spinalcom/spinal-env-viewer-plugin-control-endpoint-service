import { InputDataEndpointType } from "spinal-model-bmsnetwork";
import { ControlEndpointDataType } from "../dataTypes/ControlEndpointDataType";
import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from "../dataTypes/ControlConfigDataType";
export interface IControlEndpoint {
    name: string;
    alias: string;
    path: string;
    unit: string;
    dataType: ControlEndpointDataType;
    type: InputDataEndpointType;
    command: boolean;
    saveTimeSeries: boolean;
    config: BoolConfigDataType | EnumConfigDataType | NumberConfigDataType;
}
