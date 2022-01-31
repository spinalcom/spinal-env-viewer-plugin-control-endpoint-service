import { SpinalControlEndpointService } from './classes/SpinalControlEndpointService';
import { CalculationRule } from './dataTypes/CalculationRulesDataType';
import { ControlEndpointDataType } from './dataTypes/ControlEndpointDataType';
import { ControlEndpointType } from './dataTypes/ControlEndpointType';
import { BoolConfig, EnumConfig, getConfig, NumberConfig } from './models/config';
import { ControlPointObj, SpinalControlPoint } from './models/controlPointsModel';
declare const spinalControlPointService: SpinalControlEndpointService;
declare const spinalHeatmapService: SpinalControlEndpointService;
export { spinalControlPointService, spinalHeatmapService, BoolConfig, EnumConfig, NumberConfig, getConfig, SpinalControlPoint, ControlPointObj, CalculationRule, ControlEndpointDataType, ControlEndpointType, };
