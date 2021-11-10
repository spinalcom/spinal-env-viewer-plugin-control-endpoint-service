import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from "../dataTypes/ControlConfigDataType";
import { ControlEndpointDataType, ControlEndpointType } from "..";
export interface IControlEndpoint {
    name: string;
    alias: string;
    path: string;
    unit: string;
    dataType: ControlEndpointDataType;
    type: ControlEndpointType;
    command: number;
    saveTimeSeries: number;
    icon: string;
    config: BoolConfigDataType | EnumConfigDataType | NumberConfigDataType;
    isActive?: boolean;
}
