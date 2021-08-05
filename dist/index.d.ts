import { getConfig, BoolConfig, EnumConfig, NumberConfig } from './models/config';
import { SpinalControlPoint, ControlPointObj } from './models/controlPointsModel';
import { CalculationRule } from './dataTypes/CalculationRulesDataType';
import { ControlEndpointDataType } from './dataTypes/ControlEndpointDataType';
import { ControlEndpointType } from "./dataTypes/ControlEndpointType";
import { SpinalControlEndpointService } from "./classes/SpinalControlEndpointService";
declare const spinalControlPointService: SpinalControlEndpointService;
declare const spinalHeatmapService: SpinalControlEndpointService;
export { spinalControlPointService, spinalHeatmapService, BoolConfig, EnumConfig, NumberConfig, getConfig, SpinalControlPoint, ControlPointObj, CalculationRule, ControlEndpointDataType, ControlEndpointType };
