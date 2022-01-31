import { ControlEndpointDataType, ControlEndpointType } from '..';
import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from '../dataTypes/ControlConfigDataType';
export interface IControlEndpoint {
    id?: string;
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
    currentValue?: string | boolean | number;
}
export declare class IControlEndpointModel extends spinal.Model {
    id?: string;
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
    currentValue?: string | boolean | number;
}
