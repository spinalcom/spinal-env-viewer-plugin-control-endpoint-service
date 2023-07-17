import { SpinalNode } from 'spinal-env-viewer-graph-service';
import { ControlEndpointDataType, ControlEndpointType } from '..';
import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from '../dataTypes/ControlConfigDataType';
import { Model } from 'spinal-core-connectorjs_type';
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
export declare class IControlEndpointModel extends Model {
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
export declare class ILinkedToGroupRes extends Model {
    linkedDirectlyToGroup: boolean;
    node: SpinalNode<any>;
}
export declare const isLinkedDirectlyToGroup: (model: any) => model is ILinkedToGroupRes;
