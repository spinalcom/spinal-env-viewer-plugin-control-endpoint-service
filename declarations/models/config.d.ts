import { BoolConfigDataType, EnumConfigDataType, NumberConfigDataType } from '../dataTypes/ControlConfigDataType';
import { ControlEndpointDataType } from '../dataTypes/ControlEndpointDataType';
export declare const BoolConfig: BoolConfigDataType;
export declare const EnumConfig: EnumConfigDataType;
export declare const NumberConfig: NumberConfigDataType;
export declare const getConfig: (dataType: ControlEndpointDataType) => EnumConfigDataType | NumberConfigDataType | BoolConfigDataType;
